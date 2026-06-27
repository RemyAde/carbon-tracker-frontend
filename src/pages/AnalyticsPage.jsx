import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { Leaf, ArrowLeft, TrendingUp, TrendingDown, Minus, Calendar, Zap, Activity } from 'lucide-react';
import { analyticsService, authService } from '../services/api';
import { formatCO2 } from '../utils/helpers';

const PERIODS = [
  { value: 'week', label: '7 Days' },
  { value: 'month', label: '30 Days' },
  { value: 'year', label: '12 Months' },
];

const CATEGORY_CHART_COLORS = {
  commute: '#3b82f6',
  food: '#f97316',
  home_energy: '#8b5cf6',
  shopping: '#10b981',
};

const CATEGORY_LABELS = {
  commute: 'Transportation',
  food: 'Food',
  home_energy: 'Home Energy',
  shopping: 'Shopping',
};

function StatCard({ label, value, icon: Icon, iconBg, iconColor, sub, subPositive }) {
  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-carbon-600 mb-1">{label}</p>
          <p className="text-2xl font-display font-bold text-carbon-900 truncate">{value}</p>
          {sub && (
            <p className={`text-xs mt-1 font-medium ${subPositive === true ? 'text-green-600' : subPositive === false ? 'text-red-500' : 'text-carbon-500'}`}>
              {sub}
            </p>
          )}
        </div>
        <div className={`${iconBg} p-3 rounded-xl flex-shrink-0 ml-3`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}

function TrendTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-carbon-200 rounded-xl shadow-lg px-3 py-2">
      <p className="text-xs text-carbon-500 mb-1">{label}</p>
      <p className="text-sm font-semibold text-carbon-900">{formatCO2(payload[0].value)}</p>
      {payload[0].payload.activity_count > 0 && (
        <p className="text-xs text-carbon-500">{payload[0].payload.activity_count} activit{payload[0].payload.activity_count === 1 ? 'y' : 'ies'}</p>
      )}
    </div>
  );
}

function CategoryTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-carbon-200 rounded-xl shadow-lg px-3 py-2">
      <p className="text-xs text-carbon-500 mb-1">{CATEGORY_LABELS[label] || label}</p>
      <p className="text-sm font-semibold text-carbon-900">{formatCO2(payload[0].value)}</p>
      <p className="text-xs text-carbon-500">{payload[0].payload.percentage}% of total</p>
    </div>
  );
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('week');
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [period]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [summaryData, trendsData] = await Promise.all([
        analyticsService.getSummary(period),
        analyticsService.getTrends(period),
      ]);
      setSummary(summaryData);
      setTrends(trendsData);
    } catch (err) {
      if (err.message?.includes('401')) {
        authService.logout();
        navigate('/');
      } else {
        setError('Failed to load analytics data.');
      }
    } finally {
      setLoading(false);
    }
  };

  const comparisonIcon = () => {
    if (!summary?.comparison) return null;
    const { change_percentage } = summary.comparison;
    if (change_percentage > 0) return { Icon: TrendingUp, color: 'text-red-500', label: `+${change_percentage}% vs prev.` };
    if (change_percentage < 0) return { Icon: TrendingDown, color: 'text-green-600', label: `${change_percentage}% vs prev.` };
    return { Icon: Minus, color: 'text-carbon-400', label: 'Same as prev.' };
  };

  const comp = comparisonIcon();

  // Thin out x-axis labels for long periods
  const trendData = trends?.data_points ?? [];
  const xAxisInterval = period === 'year' ? 29 : period === 'month' ? 6 : 0;

  const formatXAxis = (dateStr) => {
    const d = new Date(dateStr);
    if (period === 'year') return d.toLocaleDateString('en', { month: 'short' });
    return d.toLocaleDateString('en', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-carbon-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-earth-500 to-earth-600 rounded-xl flex items-center justify-center shadow-lg shadow-earth-500/30">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-carbon-900">Carbon Tracker</h1>
                <p className="text-xs text-carbon-600">Analytics</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 text-carbon-600 hover:text-carbon-900 hover:bg-carbon-50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title + Period Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <h2 className="text-3xl font-display font-bold text-carbon-900 mb-1">Analytics</h2>
            <p className="text-carbon-600">Understand your carbon footprint over time</p>
          </div>
          <div className="flex gap-2 bg-carbon-100 p-1 rounded-xl">
            {PERIODS.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  period === p.value
                    ? 'bg-white text-carbon-900 shadow-sm'
                    : 'text-carbon-600 hover:text-carbon-900'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-earth-600 border-t-transparent" />
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-carbon-600">{error}</p>
            <button onClick={loadData} className="btn-primary mt-4">Retry</button>
          </div>
        ) : summary && trends ? (
          <>
            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-slide-up">
              <StatCard
                label="Total Emissions"
                value={formatCO2(summary.total_co2_kg)}
                icon={Activity}
                iconBg="bg-red-50"
                iconColor="text-red-600"
                sub={comp ? `${comp.label}` : undefined}
                subPositive={comp ? summary.comparison.change_percentage < 0 : undefined}
              />
              <StatCard
                label="Activities Logged"
                value={summary.activity_count}
                icon={Calendar}
                iconBg="bg-blue-50"
                iconColor="text-blue-600"
              />
              <StatCard
                label="Avg / Day"
                value={formatCO2(summary.avg_per_day)}
                icon={TrendingUp}
                iconBg="bg-earth-50"
                iconColor="text-earth-600"
              />
              <StatCard
                label="Avg / Activity"
                value={formatCO2(summary.avg_per_activity)}
                icon={Zap}
                iconBg="bg-purple-50"
                iconColor="text-purple-600"
              />
            </div>

            {/* Trend Chart */}
            <div className="card mb-8 animate-slide-up animate-delay-100">
              <h3 className="text-lg font-display font-semibold text-carbon-900 mb-6">
                Daily Emissions
              </h3>
              {trendData.every(d => d.co2_kg === 0) ? (
                <div className="flex items-center justify-center h-48 text-carbon-500 text-sm">
                  No activity data for this period
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={trendData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatXAxis}
                      interval={xAxisInterval}
                      tick={{ fontSize: 11, fill: '#6b7280' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tickFormatter={(v) => formatCO2(v)}
                      tick={{ fontSize: 11, fill: '#6b7280' }}
                      axisLine={false}
                      tickLine={false}
                      width={55}
                    />
                    <Tooltip content={<TrendTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="co2_kg"
                      stroke="#16a34a"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, fill: '#16a34a' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Category Breakdown */}
            <div className="grid lg:grid-cols-2 gap-8 animate-slide-up animate-delay-200">
              {/* Bar Chart */}
              <div className="card">
                <h3 className="text-lg font-display font-semibold text-carbon-900 mb-6">
                  Emissions by Category
                </h3>
                {summary.by_category.length === 0 ? (
                  <div className="flex items-center justify-center h-40 text-carbon-500 text-sm">
                    No data for this period
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart
                      data={summary.by_category}
                      layout="vertical"
                      margin={{ top: 0, right: 10, left: 10, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                      <XAxis
                        type="number"
                        tickFormatter={(v) => formatCO2(v)}
                        tick={{ fontSize: 11, fill: '#6b7280' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        type="category"
                        dataKey="category"
                        tickFormatter={(v) => CATEGORY_LABELS[v] || v}
                        tick={{ fontSize: 11, fill: '#6b7280' }}
                        axisLine={false}
                        tickLine={false}
                        width={90}
                      />
                      <Tooltip content={<CategoryTooltip />} />
                      <Bar dataKey="co2_kg" radius={[0, 4, 4, 0]}>
                        {summary.by_category.map((entry) => (
                          <Cell
                            key={entry.category}
                            fill={CATEGORY_CHART_COLORS[entry.category] || '#94a3b8'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Category Table */}
              <div className="card">
                <h3 className="text-lg font-display font-semibold text-carbon-900 mb-4">
                  Breakdown
                </h3>
                {summary.by_category.length === 0 ? (
                  <div className="flex items-center justify-center h-40 text-carbon-500 text-sm">
                    No data for this period
                  </div>
                ) : (
                  <div className="space-y-4">
                    {summary.by_category.map((cat) => (
                      <div key={cat.category}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span
                              className="inline-block w-3 h-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: CATEGORY_CHART_COLORS[cat.category] || '#94a3b8' }}
                            />
                            <span className="text-sm font-medium text-carbon-800">
                              {CATEGORY_LABELS[cat.category] || cat.category}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-semibold text-carbon-900">
                              {formatCO2(cat.co2_kg)}
                            </span>
                            <span className="text-xs text-carbon-500 ml-2">{cat.percentage}%</span>
                          </div>
                        </div>
                        <div className="h-2 bg-carbon-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${cat.percentage}%`,
                              backgroundColor: CATEGORY_CHART_COLORS[cat.category] || '#94a3b8',
                            }}
                          />
                        </div>
                        <p className="text-xs text-carbon-500 mt-1">{cat.count} activit{cat.count === 1 ? 'y' : 'ies'}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Comparison callout */}
                {summary.comparison && (
                  <div className={`mt-6 p-3 rounded-xl border text-sm ${
                    summary.comparison.change_percentage < 0
                      ? 'bg-green-50 border-green-200 text-green-800'
                      : summary.comparison.change_percentage > 0
                      ? 'bg-red-50 border-red-200 text-red-800'
                      : 'bg-carbon-50 border-carbon-200 text-carbon-700'
                  }`}>
                    {summary.comparison.change_percentage < 0 ? '🎉 ' : summary.comparison.change_percentage > 0 ? '⚠️ ' : '➡️ '}
                    {summary.comparison.change_percentage < 0
                      ? `Down ${Math.abs(summary.comparison.change_percentage)}% vs previous ${period}`
                      : summary.comparison.change_percentage > 0
                      ? `Up ${summary.comparison.change_percentage}% vs previous ${period}`
                      : `Same as previous ${period}`}
                    {' '}({formatCO2(Math.abs(summary.comparison.change_kg))}{' '}
                    {summary.comparison.change_kg >= 0 ? 'more' : 'less'})
                  </div>
                )}
              </div>
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}

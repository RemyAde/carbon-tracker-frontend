import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { getCategoryTotals, CATEGORY_LABELS, formatCO2 } from '../utils/helpers';

const COLORS = {
  commute: '#3B82F6',
  food: '#F97316',
  home_energy: '#A855F7',
  shopping: '#10b981',
};

export default function CategoryChart({ activities }) {
  const categoryData = getCategoryTotals(activities);
  
  const chartData = categoryData.map(item => ({
    name: CATEGORY_LABELS[item.category] || item.category,
    value: item.total,
    category: item.category,
  }));

  if (activities.length === 0) {
    return (
      <div className="card h-full flex items-center justify-center">
        <div className="text-center text-carbon-500">
          <p className="text-sm">No data to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card h-full">
      <h3 className="text-lg font-display font-semibold text-carbon-900 mb-6">
        Emissions by Category
      </h3>
      
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            dataKey="value"
            paddingAngle={2}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[entry.category] || '#94a3b8'}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [formatCO2(value), name]}
            contentStyle={{
              backgroundColor: 'rgba(255,255,255,0.97)',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              padding: '0.5rem 0.75rem',
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Category List */}
      <div className="mt-4 space-y-2">
        {categoryData.map((item) => (
          <div
            key={item.category}
            className="flex items-center justify-between p-3 bg-carbon-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[item.category] || '#94a3b8' }}
              />
              <span className="text-sm font-medium text-carbon-700">
                {CATEGORY_LABELS[item.category] || item.category}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-carbon-900">
                {formatCO2(item.total)}
              </p>
              <p className="text-xs text-carbon-500">
                {item.count} {item.count === 1 ? 'activity' : 'activities'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
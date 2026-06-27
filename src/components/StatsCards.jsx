import { TrendingUp, Calendar, Flame } from 'lucide-react';
import { formatCO2, calculateTotal } from '../utils/helpers';

export default function StatsCards({ activities }) {
  const totalCO2 = calculateTotal(activities);
  
  // Calculate this week's total (last 7 days)
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const thisWeekActivities = activities.filter(
    a => new Date(a.logged_at) >= weekAgo
  );
  const weekTotal = calculateTotal(thisWeekActivities);

  // Calculate average per activity
  const avgPerActivity = activities.length > 0 
    ? totalCO2 / activities.length 
    : 0;

  const stats = [
    {
      label: 'Total Emissions',
      value: formatCO2(totalCO2),
      icon: Flame,
      color: 'from-red-500 to-orange-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
    },
    {
      label: 'This Week',
      value: formatCO2(weekTotal),
      icon: Calendar,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      label: 'Avg per Activity',
      value: formatCO2(avgPerActivity),
      icon: TrendingUp,
      color: 'from-earth-500 to-green-500',
      bgColor: 'bg-earth-50',
      textColor: 'text-earth-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="card card-hover"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-carbon-600 mb-1">
                  {stat.label}
                </p>
                <p className="text-3xl font-display font-bold text-carbon-900">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-xl`}>
                <Icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
            </div>
            
            {/* Decorative gradient bar */}
            <div className={`mt-4 h-1 rounded-full bg-gradient-to-r opacity-20 ${stat.color}`} />
          </div>
        );
      })}
    </div>
  );
}
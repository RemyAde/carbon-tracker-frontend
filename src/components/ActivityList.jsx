import { Trash2, Clock } from 'lucide-react';
import {
  formatDateTime,
  formatCO2,
  ACTIVITY_METADATA,
  CATEGORY_COLORS,
  getImpactLevel,
} from '../utils/helpers';

export default function ActivityList({ activities, onDelete }) {
  // Handle loading or undefined state
  if (!activities) {
    return (
      <div className="card">
        <div className="text-center py-8 text-carbon-600">
          <p>Loading activities...</p>
        </div>
      </div>
    );
  }

  // Handle empty state - show message instead of returning null
  if (activities.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-display font-semibold text-carbon-900 mb-4">
          Recent Activities
        </h3>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🌱</div>
          <p className="text-carbon-600 font-medium mb-2">No activities logged yet</p>
          <p className="text-sm text-carbon-500">
            Start tracking your carbon footprint by logging your first activity!
          </p>
        </div>
      </div>
    );
  }

  // Sort by date, newest first
  const sortedActivities = [...activities].sort(
    (a, b) => new Date(b.logged_at) - new Date(a.logged_at)
  );

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-display font-semibold text-carbon-900">
          Recent Activities
        </h3>
        <span className="text-sm text-carbon-600">
          {activities.length} {activities.length === 1 ? 'entry' : 'entries'}
        </span>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
        {sortedActivities.map((activity, index) => {
          const metadata = ACTIVITY_METADATA[activity.activity_type] || {};
          const categoryColor = CATEGORY_COLORS[activity.category] || {};
          const impact = getImpactLevel(activity.co2_kg);

          return (
            <div
              key={activity.id}
              className="group relative bg-carbon-50 hover:bg-white border border-carbon-200 rounded-xl p-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl shadow-sm">
                  {metadata.icon || '📊'}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="font-semibold text-carbon-900">
                        {metadata.label || activity.activity_type}
                      </h4>
                      <p className="text-sm text-carbon-600">
                        {activity.quantity} {activity.unit}
                      </p>
                    </div>
                    
                    {/* CO2 Badge */}
                    <div className={`badge badge-${impact.level === 'low' ? 'success' : impact.level === 'medium' ? 'warning' : 'danger'} flex-shrink-0`}>
                      {formatCO2(activity.co2_kg)} CO₂
                    </div>
                  </div>

                  {/* Description */}
                  {activity.description && (
                    <p className="text-sm text-carbon-600 mb-2">
                      {activity.description}
                    </p>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-carbon-500">
                      <span className={`badge ${categoryColor.bg} ${categoryColor.text} border ${categoryColor.border}`}>
                        {activity.category.replace('_', ' ')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDateTime(activity.logged_at)}
                      </span>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => onDelete(activity.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 text-red-600 rounded-lg transition-all"
                      title="Delete activity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
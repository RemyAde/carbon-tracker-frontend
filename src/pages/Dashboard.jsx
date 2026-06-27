import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { activitiesService, authService } from '../services/api';
import { LogOut, Plus, Leaf, TrendingDown, BarChart2 } from 'lucide-react';
import ActivityList from '../components/ActivityList';
import AddActivityModal from '../components/AddActivityModal'; // ← FIXED: Changed from ActivityList to AddActivityModal
import StatsCards from '../components/StatsCards';
import CategoryChart from '../components/CategoryChart';

export default function Dashboard() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const data = await activitiesService.getAll();
      setActivities(data);
    } catch (error) {
      console.error('Failed to load activities:', error);
      if (error.message.includes('401')) {
        authService.logout();
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const handleActivityAdded = () => {
    setShowAddModal(false);
    loadActivities();
  };

  const handleDeleteActivity = async (id) => {
    try {
      await activitiesService.delete(id);
      setActivities(activities.filter(a => a.id !== id));
    } catch (error) {
      console.error('Failed to delete activity:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-earth-600 border-t-transparent"></div>
      </div>
    );
  }

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
                <h1 className="text-2xl font-display font-bold text-carbon-900">
                  Carbon Tracker
                </h1>
                <p className="text-xs text-carbon-600">Your environmental dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/analytics')}
                className="flex items-center gap-2 px-4 py-2 text-carbon-600 hover:text-carbon-900 hover:bg-carbon-50 rounded-lg transition-colors"
              >
                <BarChart2 className="w-4 h-4" />
                <span className="hidden sm:inline">Analytics</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-carbon-600 hover:text-carbon-900 hover:bg-carbon-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-display font-bold text-carbon-900 mb-2">
                Welcome back! 👋
              </h2>
              <p className="text-carbon-600">
                Track your carbon footprint and make sustainable choices
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Log Activity
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 animate-slide-up">
          <StatsCards activities={activities} />
        </div>

        {/* Charts and Lists Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Category Chart */}
          <div className="lg:col-span-1 animate-slide-up animate-delay-100">
            <CategoryChart activities={activities} />
          </div>

          {/* Activity List */}
          <div className="lg:col-span-2 animate-slide-up animate-delay-200">
            <ActivityList
              activities={activities}
              onDelete={handleDeleteActivity}
            />
          </div>
        </div>

        {/* Empty State */}
        {activities.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-earth-100 rounded-full mb-4">
              <TrendingDown className="w-10 h-10 text-earth-600" />
            </div>
            <h3 className="text-xl font-display font-semibold text-carbon-900 mb-2">
              No activities yet
            </h3>
            <p className="text-carbon-600 mb-6 max-w-md mx-auto">
              Start tracking your carbon footprint by logging your daily activities
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Your First Activity
            </button>
          </div>
        )}
      </main>

      {/* Add Activity Modal */}
      {showAddModal && (
        <AddActivityModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleActivityAdded}
        />
      )}
    </div>
  );
}
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { activitiesService } from '../services/api';
import { ACTIVITY_METADATA, CATEGORY_LABELS } from '../utils/helpers';

export default function AddActivityModal({ onClose, onSuccess }) {
  const [activityTypes, setActivityTypes] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadActivityTypes();
  }, []);

  const loadActivityTypes = async () => {
    try {
      const data = await activitiesService.getTypes();
      
      // Group by category
      const grouped = {};
    
      data.types.forEach((item) => {
        const category = item.category;
        if (!grouped[category]) {
          grouped[category] = [];
        }
        // We use item.key as the 'type' identifier based on your JSON
        grouped[category].push({ 
          type: item.key, 
          ...item 
        });
      });
      
      setActivityTypes(grouped);
      
      // Set default selections
      const categories = Object.keys(grouped);
      if (categories.length > 0) {
        const firstCategory = categories[0];
        setSelectedCategory(firstCategory);
        setSelectedType(grouped[firstCategory][0]?.type || '');
      }
    } catch (err) {
      setError('Failed to load activity types');
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    const firstType = activityTypes[category]?.[0]?.type || '';
    setSelectedType(firstType);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await activitiesService.create({
        activity_type: selectedType,
        quantity: parseFloat(quantity),
        description: description || null,
      });
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedTypeInfo = activityTypes[selectedCategory]?.find(
    t => t.type === selectedType
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-carbon-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-display font-bold text-carbon-900">
            Log Activity
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-carbon-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-carbon-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-semibold text-carbon-700 mb-3">
              Category
            </label>
            <div className="grid grid-cols-3 gap-3">
              {Object.keys(activityTypes).map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryChange(category)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedCategory === category
                      ? 'border-earth-500 bg-earth-50 shadow-lg'
                      : 'border-carbon-200 hover:border-carbon-300 bg-white'
                  }`}
                >
                  <div className="text-2xl mb-1">
                    {category === 'commute' ? '🚗' : 
                      category === 'food' ? '🍽️' : 
                      category === 'home_energy' ? '⚡' : '🛍️'}
                  </div>
                  <div className="text-xs font-medium text-carbon-700">
                    {CATEGORY_LABELS[category]}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Activity Type */}
          <div>
            <label className="block text-sm font-semibold text-carbon-700 mb-3">
              Activity Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {activityTypes[selectedCategory]?.map((type) => {
                const metadata = ACTIVITY_METADATA[type.type] || {};
                return (
                  <button
                    key={type.type}
                    type="button"
                    onClick={() => setSelectedType(type.type)}
                    className={`p-3 rounded-xl border-2 transition-all text-left ${
                      selectedType === type.type
                        ? 'border-earth-500 bg-earth-50 shadow-lg'
                        : 'border-carbon-200 hover:border-carbon-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{metadata.icon}</span>
                      <span className="text-sm font-medium text-carbon-900">
                        {metadata.label || type.type}
                      </span>
                    </div>
                    <div className="text-xs text-carbon-600">
                      {type.factor} kg CO₂/{type.unit}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-semibold text-carbon-700 mb-2">
              Quantity
              {selectedTypeInfo?.unit && (
                <span className="ml-1 font-normal text-carbon-500">({selectedTypeInfo.unit})</span>
              )}
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="input-field pr-16"
                placeholder="e.g., 25"
                required
              />
              {selectedTypeInfo?.unit && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-carbon-400 pointer-events-none">
                  {selectedTypeInfo.unit}
                </span>
              )}
            </div>
            {quantity && selectedTypeInfo && (
              <p className="mt-2 text-sm text-earth-600 font-medium">
                ≈ {(parseFloat(quantity) * selectedTypeInfo.factor).toFixed(2)} kg CO₂
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-carbon-700 mb-2">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field resize-none"
              rows="3"
              placeholder="e.g., Morning commute to work"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !quantity}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging...' : 'Log Activity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
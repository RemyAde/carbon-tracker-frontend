import { format, parseISO } from 'date-fns';

// Format date strings
export const formatDate = (dateString) => {
  try {
    return format(parseISO(dateString), 'MMM d, yyyy');
  } catch {
    return dateString;
  }
};

export const formatDateTime = (dateString) => {
  try {
    return format(parseISO(dateString), 'MMM d, yyyy h:mm a');
  } catch {
    return dateString;
  }
};

// Format CO2 values
export const formatCO2 = (kg) => {
  if (kg < 1) {
    return `${(kg * 1000).toFixed(0)}g`;
  }
  return `${kg.toFixed(2)}kg`;
};

// Activity type metadata
export const ACTIVITY_METADATA = {
  car_petrol: {
    icon: '🚗',
    label: 'Petrol Car',
    category: 'commute',
    unit: 'km'
  },
  car_diesel: {
    icon: '🚙',
    label: 'Diesel Car',
    category: 'commute',
    unit: 'km'
  },
  car_electric: {
    icon: '⚡',
    label: 'Electric Car',
    category: 'commute',
    unit: 'km'
  },
  bus: {
    icon: '🚌',
    label: 'Bus',
    category: 'commute',
    unit: 'km'
  },
  train: {
    icon: '🚆',
    label: 'Train',
    category: 'commute',
    unit: 'km'
  },
  beef: {
    icon: '🥩',
    label: 'Beef',
    category: 'food',
    unit: 'kg'
  },
  lamb: {
    icon: '🐑',
    label: 'Lamb',
    category: 'food',
    unit: 'kg'
  },
  chicken: {
    icon: '🍗',
    label: 'Chicken',
    category: 'food',
    unit: 'kg'
  },
  pork: {
    icon: '🥓',
    label: 'Pork',
    category: 'food',
    unit: 'kg'
  },
  electricity: {
    icon: '💡',
    label: 'Electricity',
    category: 'home_energy',
    unit: 'kWh'
  },
  natural_gas: {
    icon: '🔥',
    label: 'Natural Gas',
    category: 'home_energy',
    unit: 'kWh'
  },
  clothing: {
    icon: '👕',
    label: 'Clothing',
    category: 'shopping',
    unit: 'items'
  },
  electronics: {
    icon: '💻',
    label: 'Electronics',
    category: 'shopping',
    unit: 'items'
  },
  flight_short: {
    icon: '✈️',
    label: 'Short Flight',
    category: 'commute',
    unit: 'km'
  },
  flight_long: {
    icon: '🛫',
    label: 'Long Flight',
    category: 'commute',
    unit: 'km'
  },
  motorbike: {
    icon: '🏍️',
    label: 'Motorbike',
    category: 'commute',
    unit: 'km'
  },
  fish: {
    icon: '🐟',
    label: 'Fish',
    category: 'food',
    unit: 'kg'
  },
  eggs: {
    icon: '🥚',
    label: 'Eggs',
    category: 'food',
    unit: 'kg'
  },
  cheese: {
    icon: '🧀',
    label: 'Cheese',
    category: 'food',
    unit: 'kg'
  },
  milk: {
    icon: '🥛',
    label: 'Milk',
    category: 'food',
    unit: 'kg'
  },
  tofu: {
    icon: '🫘',
    label: 'Tofu',
    category: 'food',
    unit: 'kg'
  },
  rice: {
    icon: '🍚',
    label: 'Rice',
    category: 'food',
    unit: 'kg'
  },
  vegetables: {
    icon: '🥦',
    label: 'Vegetables',
    category: 'food',
    unit: 'kg'
  },
  fruits: {
    icon: '🍎',
    label: 'Fruits',
    category: 'food',
    unit: 'kg'
  },
  beans: {
    icon: '🫘',
    label: 'Beans',
    category: 'food',
    unit: 'kg'
  },
};

export const CATEGORY_LABELS = {
  commute: 'Transportation',
  food: 'Food',
  home_energy: 'Home Energy',
  shopping: 'Shopping',
};

export const CATEGORY_COLORS = {
  commute: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    border: 'border-blue-300',
  },
  food: {
    bg: 'bg-orange-100',
    text: 'text-orange-700',
    border: 'border-orange-300',
  },
  home_energy: {
    bg: 'bg-purple-100',
    text: 'text-purple-700',
    border: 'border-purple-300',
  },
  shopping: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    border: 'border-green-300',
  },
};

// Get impact level based on CO2
export const getImpactLevel = (co2Kg) => {
  if (co2Kg < 1) return { level: 'low', color: 'earth', label: 'Low Impact' };
  if (co2Kg < 5) return { level: 'medium', color: 'amber', label: 'Medium Impact' };
  return { level: 'high', color: 'red', label: 'High Impact' };
};

// Calculate total CO2 from activities
export const calculateTotal = (activities) => {
  return activities.reduce((sum, activity) => sum + activity.co2_kg, 0);
};

// Group activities by category
export const groupByCategory = (activities) => {
  return activities.reduce((acc, activity) => {
    const category = activity.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(activity);
    return acc;
  }, {});
};

// Calculate category totals
export const getCategoryTotals = (activities) => {
  const grouped = groupByCategory(activities);
  return Object.entries(grouped).map(([category, items]) => ({
    category,
    total: calculateTotal(items),
    count: items.length,
  }));
};
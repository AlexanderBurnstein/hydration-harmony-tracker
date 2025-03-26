
import { format, parseISO, addDays, subDays, isToday, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

// Convert between ml and oz
export const mlToOz = (ml: number): number => {
  return parseFloat((ml / 29.5735).toFixed(1));
};

export const ozToMl = (oz: number): number => {
  return Math.round(oz * 29.5735);
};

// Format a date to display
export const formatDate = (dateString: string): string => {
  const date = parseISO(dateString);
  if (isToday(date)) {
    return 'Today';
  }
  return format(date, 'MMM d');
};

// Format time to display
export const formatTime = (timeString: string): string => {
  return format(parseISO(timeString), 'h:mm a');
};

// Get the current week's date range
export const getCurrentWeekRange = (): { start: Date; end: Date } => {
  const today = new Date();
  const start = startOfWeek(today, { weekStartsOn: 1 }); // Week starts on Monday
  const end = endOfWeek(today, { weekStartsOn: 1 });
  return { start, end };
};

// Check if a date is in the current week
export const isInCurrentWeek = (dateString: string): boolean => {
  const date = parseISO(dateString);
  const { start, end } = getCurrentWeekRange();
  return isWithinInterval(date, { start, end });
};

// Generate an array of the last n days
export const getLastNDays = (n: number): Date[] => {
  const result: Date[] = [];
  const today = new Date();
  
  for (let i = n - 1; i >= 0; i--) {
    result.push(subDays(today, i));
  }
  
  return result;
};

// Format a percentage for display
export const formatPercentage = (value: number): string => {
  return `${Math.min(Math.round(value), 100)}%`;
};

// Format an amount with the unit
export const formatAmount = (amount: number, unit: 'ml' | 'oz'): string => {
  if (unit === 'oz') {
    return `${mlToOz(amount)} oz`;
  }
  return `${amount} ml`;
};

// Generate preset amounts based on unit
export const getPresetAmounts = (unit: 'ml' | 'oz'): number[] => {
  if (unit === 'oz') {
    return [8, 12, 16, 20, 32].map(ozToMl);
  }
  return [200, 300, 500, 750, 1000];
};

// Calculate the recommended water intake based on weight and activity
export const calculateRecommendedIntake = (
  weight: number,
  weightUnit: 'kg' | 'lb',
  activityLevel: 'low' | 'moderate' | 'high'
): number => {
  // Convert to kg if weight is in pounds
  const weightInKg = weightUnit === 'lb' ? weight * 0.453592 : weight;
  
  // Base calculation (30-35ml per kg)
  let baseAmount = weightInKg * 35;
  
  // Adjust for activity level
  switch (activityLevel) {
    case 'low':
      baseAmount *= 0.9;
      break;
    case 'high':
      baseAmount *= 1.2;
      break;
    // 'moderate' is the default, no adjustment needed
  }
  
  return Math.round(baseAmount / 100) * 100; // Round to nearest 100ml
};

// Get color based on percentage
export const getColorByPercentage = (percentage: number): string => {
  if (percentage < 30) {
    return 'bg-red-500';
  } else if (percentage < 60) {
    return 'bg-yellow-500';
  } else if (percentage < 80) {
    return 'bg-blue-500';
  }
  return 'bg-green-500';
};

// Calculate the water level height percentage with a minimum visible amount
export const calculateWaterLevel = (current: number, target: number): number => {
  const percentage = (current / target) * 100;
  // Always show at least 5% to be visible, cap at 98% for aesthetic reasons
  return Math.min(Math.max(percentage, 5), 98);
};

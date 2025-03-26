
import React, { createContext, useContext, useState, useEffect } from 'react';

// Types
export type TimeFrame = 'daily' | 'weekly' | 'monthly' | 'annual';

export interface HydrationDay {
  date: string;
  target: number;
  current: number;
  entries: {
    time: string;
    amount: number;
  }[];
}

interface HydrationState {
  timeFrame: TimeFrame;
  hydrationData: {
    daily: HydrationDay[];
    weekly: {
      week: string;
      average: number;
      target: number;
      days: HydrationDay[];
    }[];
    monthly: {
      month: string;
      average: number;
      target: number;
      days: HydrationDay[];
    }[];
    annual: {
      year: string;
      average: number;
      target: number;
      months: {
        month: string;
        average: number;
      }[];
    }[];
  };
  targetAmount: number;
  reminderInterval: number;
  remindersEnabled: boolean;
  measurementUnit: 'ml' | 'oz';
  userProfile: {
    weight: number;
    weightUnit: 'kg' | 'lb';
    activityLevel: 'low' | 'moderate' | 'high';
  };
}

interface HydrationContextType extends HydrationState {
  setTimeFrame: (timeFrame: TimeFrame) => void;
  addWaterIntake: (amount: number) => void;
  setTargetAmount: (amount: number) => void;
  calculateHydrationGoal: () => number;
  toggleReminders: (enabled: boolean) => void;
  setReminderInterval: (minutes: number) => void;
  setMeasurementUnit: (unit: 'ml' | 'oz') => void;
  updateUserProfile: (profile: Partial<HydrationState['userProfile']>) => void;
  getCurrentDayProgress: () => {
    current: number;
    target: number;
    percentage: number;
  };
  getProgress: (timeFrame: TimeFrame) => {
    data: any[];
    average: number;
    target: number;
    percentage: number;
  };
}

// Helper to get ISO date string
const getDateString = (date: Date = new Date()): string => {
  return date.toISOString().split('T')[0];
};

// Default state
const defaultState: HydrationState = {
  timeFrame: 'daily',
  hydrationData: {
    daily: [
      {
        date: getDateString(),
        target: 2500,
        current: 0,
        entries: [],
      },
    ],
    weekly: [],
    monthly: [],
    annual: [],
  },
  targetAmount: 2500,
  reminderInterval: 60,
  remindersEnabled: false,
  measurementUnit: 'ml',
  userProfile: {
    weight: 70,
    weightUnit: 'kg',
    activityLevel: 'moderate',
  },
};

// Create context
const HydrationContext = createContext<HydrationContextType | undefined>(undefined);

export const HydrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage or use default
  const [state, setState] = useState<HydrationState>(() => {
    const savedState = localStorage.getItem('hydrationState');
    if (savedState) {
      const parsed = JSON.parse(savedState);
      
      // Ensure today exists in daily data
      const today = getDateString();
      if (!parsed.hydrationData.daily.some((day: HydrationDay) => day.date === today)) {
        parsed.hydrationData.daily.push({
          date: today,
          target: parsed.targetAmount,
          current: 0,
          entries: [],
        });
      }
      
      return parsed;
    }
    return defaultState;
  });

  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('hydrationState', JSON.stringify(state));
  }, [state]);

  // Set the active time frame
  const setTimeFrame = (timeFrame: TimeFrame) => {
    setState((prev) => ({ ...prev, timeFrame }));
  };

  // Add water intake
  const addWaterIntake = (amount: number) => {
    setState((prev) => {
      const today = getDateString();
      let dailyData = [...prev.hydrationData.daily];
      let todayIndex = dailyData.findIndex((day) => day.date === today);
      
      if (todayIndex === -1) {
        // If today doesn't exist in data, add it
        dailyData.push({
          date: today,
          target: prev.targetAmount,
          current: amount,
          entries: [{ time: new Date().toISOString(), amount }],
        });
      } else {
        // Update today's data
        const day = dailyData[todayIndex];
        dailyData[todayIndex] = {
          ...day,
          current: day.current + amount,
          entries: [...day.entries, { time: new Date().toISOString(), amount }],
        };
      }
      
      return {
        ...prev,
        hydrationData: {
          ...prev.hydrationData,
          daily: dailyData,
        },
      };
    });
  };

  // Set target amount
  const setTargetAmount = (amount: number) => {
    setState((prev) => {
      // Update today's target as well
      const today = getDateString();
      const dailyData = [...prev.hydrationData.daily];
      const todayIndex = dailyData.findIndex((day) => day.date === today);
      
      if (todayIndex !== -1) {
        dailyData[todayIndex] = {
          ...dailyData[todayIndex],
          target: amount,
        };
      }
      
      return {
        ...prev,
        targetAmount: amount,
        hydrationData: {
          ...prev.hydrationData,
          daily: dailyData,
        },
      };
    });
  };

  // Calculate recommended hydration goal based on user profile
  const calculateHydrationGoal = () => {
    const { weight, weightUnit, activityLevel } = state.userProfile;
    
    // Convert weight to kg if in pounds
    const weightInKg = weightUnit === 'lb' ? weight * 0.453592 : weight;
    
    // Base calculation: 30-35ml per kg of body weight
    let baseAmount = weightInKg * 33;
    
    // Adjust for activity level
    if (activityLevel === 'low') {
      baseAmount *= 0.9;
    } else if (activityLevel === 'high') {
      baseAmount *= 1.2;
    }
    
    return Math.round(baseAmount);
  };

  // Toggle reminders
  const toggleReminders = (enabled: boolean) => {
    setState((prev) => ({
      ...prev,
      remindersEnabled: enabled,
    }));
  };

  // Set reminder interval
  const setReminderInterval = (minutes: number) => {
    setState((prev) => ({
      ...prev,
      reminderInterval: minutes,
    }));
  };

  // Set measurement unit
  const setMeasurementUnit = (unit: 'ml' | 'oz') => {
    setState((prev) => ({
      ...prev,
      measurementUnit: unit,
    }));
  };

  // Update user profile
  const updateUserProfile = (profile: Partial<HydrationState['userProfile']>) => {
    setState((prev) => ({
      ...prev,
      userProfile: {
        ...prev.userProfile,
        ...profile,
      },
    }));
  };

  // Get current day progress
  const getCurrentDayProgress = () => {
    const today = getDateString();
    const day = state.hydrationData.daily.find((d) => d.date === today);
    
    if (!day) {
      return { current: 0, target: state.targetAmount, percentage: 0 };
    }
    
    return {
      current: day.current,
      target: day.target,
      percentage: Math.min((day.current / day.target) * 100, 100),
    };
  };

  // Get progress for the selected time frame
  const getProgress = (timeFrame: TimeFrame) => {
    const today = getDateString();
    
    switch (timeFrame) {
      case 'daily': {
        const day = state.hydrationData.daily.find((d) => d.date === today) || {
          date: today,
          target: state.targetAmount,
          current: 0,
          entries: [],
        };
        
        return {
          data: [day],
          average: day.current,
          target: day.target,
          percentage: Math.min((day.current / day.target) * 100, 100),
        };
      }
      
      case 'weekly': {
        // For simplicity, just get the last 7 days
        const last7Days = state.hydrationData.daily
          .filter((d) => {
            const date = new Date(d.date);
            const now = new Date();
            const diffTime = now.getTime() - date.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 7;
          })
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        const total = last7Days.reduce((acc, day) => acc + day.current, 0);
        const average = last7Days.length > 0 ? total / last7Days.length : 0;
        const targetAvg = last7Days.length > 0 
          ? last7Days.reduce((acc, day) => acc + day.target, 0) / last7Days.length 
          : state.targetAmount;
        
        return {
          data: last7Days,
          average,
          target: targetAvg,
          percentage: Math.min((average / targetAvg) * 100, 100),
        };
      }
      
      case 'monthly': {
        // Get current month data
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        const monthData = state.hydrationData.daily
          .filter((d) => {
            const date = new Date(d.date);
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
          })
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        const total = monthData.reduce((acc, day) => acc + day.current, 0);
        const average = monthData.length > 0 ? total / monthData.length : 0;
        const targetAvg = monthData.length > 0 
          ? monthData.reduce((acc, day) => acc + day.target, 0) / monthData.length 
          : state.targetAmount;
        
        return {
          data: monthData,
          average,
          target: targetAvg,
          percentage: Math.min((average / targetAvg) * 100, 100),
        };
      }
      
      case 'annual': {
        // Get current year data
        const now = new Date();
        const currentYear = now.getFullYear();
        
        const yearData = state.hydrationData.daily
          .filter((d) => {
            const date = new Date(d.date);
            return date.getFullYear() === currentYear;
          })
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        // Group by month
        const monthlyData: {[key: string]: {total: number, count: number, target: number}} = {};
        
        yearData.forEach((day) => {
          const date = new Date(day.date);
          const monthKey = date.toLocaleString('default', { month: 'short' });
          
          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { total: 0, count: 0, target: 0 };
          }
          
          monthlyData[monthKey].total += day.current;
          monthlyData[monthKey].target += day.target;
          monthlyData[monthKey].count += 1;
        });
        
        const monthlyAverages = Object.entries(monthlyData).map(([month, data]) => ({
          month,
          average: data.count > 0 ? data.total / data.count : 0,
          target: data.count > 0 ? data.target / data.count : state.targetAmount,
        }));
        
        const totalAvg = monthlyAverages.reduce((acc, m) => acc + m.average, 0) / (monthlyAverages.length || 1);
        const targetAvg = monthlyAverages.reduce((acc, m) => acc + m.target, 0) / (monthlyAverages.length || 1);
        
        return {
          data: monthlyAverages,
          average: totalAvg,
          target: targetAvg,
          percentage: Math.min((totalAvg / targetAvg) * 100, 100),
        };
      }
      
      default:
        return {
          data: [],
          average: 0,
          target: state.targetAmount,
          percentage: 0,
        };
    }
  };

  return (
    <HydrationContext.Provider
      value={{
        ...state,
        setTimeFrame,
        addWaterIntake,
        setTargetAmount,
        calculateHydrationGoal,
        toggleReminders,
        setReminderInterval,
        setMeasurementUnit,
        updateUserProfile,
        getCurrentDayProgress,
        getProgress,
      }}
    >
      {children}
    </HydrationContext.Provider>
  );
};

// Custom hook to use the hydration context
export const useHydration = () => {
  const context = useContext(HydrationContext);
  if (context === undefined) {
    throw new Error('useHydration must be used within a HydrationProvider');
  }
  return context;
};

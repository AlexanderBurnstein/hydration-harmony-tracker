
import React from 'react';
import { useHydration } from '@/context/HydrationContext';
import { formatDate, formatTime, formatAmount } from '@/utils/hydrationUtils';
import { Droplet, TrendingUp, Calendar, Clock } from 'lucide-react';

const StatisticsView: React.FC = () => {
  const { timeFrame, getProgress, measurementUnit } = useHydration();
  const { data, average, target, percentage } = getProgress(timeFrame);
  
  // Function to get streak (days in a row with progress)
  const getStreak = (): number => {
    const { hydrationData } = useHydration();
    const { daily } = hydrationData;
    
    // Sort by date descending
    const sortedData = [...daily].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < sortedData.length; i++) {
      const date = new Date(sortedData[i].date);
      date.setHours(0, 0, 0, 0);
      
      // Check if this day is either today or exactly (streak) days before today
      const daysDiff = Math.round((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak && sortedData[i].current > 0) {
        streak++;
      } else if (daysDiff !== streak) {
        break;
      }
    }
    
    return streak;
  };
  
  // Section for today's log
  const renderTodayLog = () => {
    if (timeFrame !== 'daily') return null;
    
    const todayData = data[0];
    if (!todayData || !todayData.entries || todayData.entries.length === 0) {
      return (
        <div className="text-center py-4">
          <p className="text-gray-500">No entries for today yet.</p>
        </div>
      );
    }
    
    return (
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-3">Today's Log</h3>
        <div className="glass rounded-2xl overflow-hidden">
          <div className="divide-y divide-white/10">
            {todayData.entries.map((entry, index) => (
              <div key={index} className="flex items-center p-3 hover:bg-white/5 transition-colors">
                <div className="flex-shrink-0 w-10 h-10 bg-water/20 rounded-full flex items-center justify-center mr-3">
                  <Droplet className="h-5 w-5 text-water" />
                </div>
                <div className="flex-grow">
                  <p className="font-medium">{formatAmount(entry.amount, measurementUnit)}</p>
                </div>
                <div className="text-sm text-gray-500">
                  {formatTime(entry.time)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  // Get the achievement status
  const getAchievementStatus = () => {
    const streak = getStreak();
    
    if (streak >= 30) return { title: "Hydration Master", desc: "30+ day streak" };
    if (streak >= 14) return { title: "Hydration Pro", desc: "14+ day streak" };
    if (streak >= 7) return { title: "Hydration Enthusiast", desc: "7+ day streak" };
    if (streak >= 3) return { title: "Hydration Starter", desc: "3+ day streak" };
    return { title: "Hydration Beginner", desc: "Keep going!" };
  };
  
  const achievement = getAchievementStatus();
  const streak = getStreak();

  return (
    <div className="space-y-6">
      {/* Stats summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass p-4 rounded-2xl">
          <div className="flex items-center">
            <div className="rounded-full bg-teal-100 p-2 mr-3">
              <TrendingUp className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Average Intake</p>
              <p className="font-semibold">{formatAmount(average, measurementUnit)}</p>
            </div>
          </div>
        </div>
        
        <div className="glass p-4 rounded-2xl">
          <div className="flex items-center">
            <div className="rounded-full bg-amber-100 p-2 mr-3">
              <Calendar className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Current Streak</p>
              <p className="font-semibold">{streak} {streak === 1 ? 'day' : 'days'}</p>
            </div>
          </div>
        </div>
        
        <div className="glass p-4 rounded-2xl col-span-2">
          <div className="flex items-center">
            <div className="flex items-center justify-center rounded-full bg-water/20 w-12 h-12 mr-4">
              <Droplet className="h-6 w-6 text-water" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Achievement</p>
              <p className="font-semibold">{achievement.title}</p>
              <p className="text-xs text-gray-500">{achievement.desc}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Today's log (daily view only) */}
      {renderTodayLog()}
      
      {/* Achievement cards for weekly, monthly, annual views */}
      {timeFrame !== 'daily' && data.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">
            {timeFrame === 'weekly' ? 'This Week' : 
             timeFrame === 'monthly' ? 'This Month' : 'This Year'}
          </h3>
          
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500">Average daily intake</p>
              <p className="font-semibold">{formatAmount(average, measurementUnit)}</p>
            </div>
            
            <div className="w-full bg-white/10 rounded-full h-2 mb-4">
              <div 
                className="bg-water h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <p>0%</p>
              <p>Target: {formatAmount(target, measurementUnit)}</p>
              <p>100%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatisticsView;

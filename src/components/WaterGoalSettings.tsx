
import React, { useState } from 'react';
import { useHydration } from '@/context/HydrationContext';
import { formatAmount, calculateRecommendedIntake } from '@/utils/hydrationUtils';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Droplet, Target, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';

const WaterGoalSettings: React.FC = () => {
  const { 
    targetAmount, 
    setTargetAmount, 
    measurementUnit,
    userProfile,
    updateUserProfile,
    calculateHydrationGoal
  } = useHydration();
  
  const [goal, setGoal] = useState(targetAmount);
  const [weight, setWeight] = useState(userProfile.weight);
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>(userProfile.weightUnit);
  const [activityLevel, setActivityLevel] = useState<'low' | 'moderate' | 'high'>(userProfile.activityLevel);
  
  // Calculate recommended intake
  const calculateRecommended = () => {
    const recommended = calculateRecommendedIntake(weight, weightUnit, activityLevel);
    setGoal(recommended);
    
    toast.info("Recommendation calculated", {
      description: `Based on your profile, we recommend ${formatAmount(recommended, measurementUnit)} daily.`,
    });
  };
  
  // Save settings
  const saveSettings = () => {
    setTargetAmount(goal);
    updateUserProfile({
      weight,
      weightUnit,
      activityLevel
    });
    
    toast.success("Settings saved", {
      description: "Your hydration goal has been updated.",
    });
  };

  return (
    <div className="space-y-6 glass p-6 rounded-3xl max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-1">Water Goal Settings</h2>
        <p className="text-sm text-gray-500">Set your daily hydration goal</p>
      </div>
      
      {/* Daily target slider */}
      <div className="space-y-3">
        <div className="flex justify-between">
          <label className="text-sm font-medium">Daily Target</label>
          <span className="text-sm font-medium">{formatAmount(goal, measurementUnit)}</span>
        </div>
        
        <Slider
          value={[goal]}
          min={500}
          max={5000}
          step={100}
          onValueChange={(values) => setGoal(values[0])}
          className="py-4"
        />
        
        <div className="grid grid-cols-3 gap-2 mt-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setGoal(1500)}
            className="text-xs"
          >
            1.5L
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setGoal(2000)}
            className="text-xs"
          >
            2L
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setGoal(3000)}
            className="text-xs"
          >
            3L
          </Button>
        </div>
      </div>
      
      <div className="border-t border-white/10 pt-5">
        <h3 className="text-sm font-medium mb-3">Personal Profile</h3>
        
        {/* Weight input */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs block mb-1">Weight</label>
            <div className="flex">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full rounded-l-md bg-white/10 border border-white/20 p-2 focus:outline-none focus:ring-1 focus:ring-water"
              />
              <select
                value={weightUnit}
                onChange={(e) => setWeightUnit(e.target.value as 'kg' | 'lb')}
                className="rounded-r-md bg-white/20 border border-white/30 p-2 focus:outline-none focus:ring-1 focus:ring-water"
              >
                <option value="kg">kg</option>
                <option value="lb">lb</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="text-xs block mb-1">Activity Level</label>
            <select
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value as 'low' | 'moderate' | 'high')}
              className="w-full rounded-md bg-white/10 border border-white/20 p-2 focus:outline-none focus:ring-1 focus:ring-water"
            >
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        
        <Button
          onClick={calculateRecommended}
          variant="outline"
          className="w-full mb-4 gap-2"
        >
          <RefreshCcw className="h-4 w-4" />
          Calculate Recommended Amount
        </Button>
      </div>
      
      <Button
        onClick={saveSettings}
        className="w-full bg-water hover:bg-water-dark text-white gap-2"
      >
        <Target className="h-4 w-4" />
        Save Goal
      </Button>
    </div>
  );
};

export default WaterGoalSettings;

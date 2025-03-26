
import React, { useState, useEffect } from 'react';
import { useHydration } from '@/context/HydrationContext';
import { formatAmount, getPresetAmounts } from '@/utils/hydrationUtils';
import { Droplet, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';

const HydrationTracker: React.FC = () => {
  const { addWaterIntake, measurementUnit } = useHydration();
  const [customAmount, setCustomAmount] = useState(250);
  const [showAddAnimation, setShowAddAnimation] = useState(false);
  
  const presetAmounts = getPresetAmounts(measurementUnit);
  
  // Handle adding water with animation
  const handleAddWater = (amount: number) => {
    addWaterIntake(amount);
    setShowAddAnimation(true);
    
    toast.success(`Added ${formatAmount(amount, measurementUnit)}`, {
      description: "Keep up the good work! Staying hydrated is important.",
      icon: <Droplet className="h-4 w-4 text-blue-500" />,
    });
    
    // Reset animation state
    setTimeout(() => {
      setShowAddAnimation(false);
    }, 1000);
  };
  
  // Handle custom amount changes
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setCustomAmount(value);
    }
  };
  
  const incrementCustomAmount = () => {
    setCustomAmount(prev => prev + 50);
  };
  
  const decrementCustomAmount = () => {
    setCustomAmount(prev => Math.max(50, prev - 50));
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4 text-center">Add Water</h2>
      
      {/* Quick add buttons */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {presetAmounts.map((amount) => (
          <button
            key={amount}
            onClick={() => handleAddWater(amount)}
            className="relative overflow-hidden glass flex items-center justify-center py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-white/30 active:scale-95"
          >
            <Droplet className="h-4 w-4 mr-2 text-water" />
            <span>{formatAmount(amount, measurementUnit)}</span>
          </button>
        ))}
      </div>
      
      {/* Custom amount input */}
      <div className="glass p-4 rounded-xl">
        <label className="block text-sm font-medium mb-2">Custom Amount</label>
        <div className="flex items-center">
          <button
            onClick={decrementCustomAmount}
            className="bg-white/20 rounded-l-lg p-3 hover:bg-white/30 transition-colors"
          >
            <Minus className="h-4 w-4" />
          </button>
          
          <input
            type="number"
            value={customAmount}
            onChange={handleCustomAmountChange}
            className="bg-transparent border-y border-white/20 p-3 text-center w-full focus:outline-none"
            min="50"
            step="50"
          />
          
          <button
            onClick={incrementCustomAmount}
            className="bg-white/20 rounded-r-lg p-3 hover:bg-white/30 transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        
        <button
          onClick={() => handleAddWater(customAmount)}
          className="mt-3 w-full bg-water hover:bg-water-dark text-white rounded-lg py-3 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add {formatAmount(customAmount, measurementUnit)}</span>
        </button>
      </div>
      
      {/* Add animation */}
      {showAddAnimation && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
          <Droplet 
            className="text-water animate-pulse-soft" 
            size={100}
            style={{
              animation: 'fade-in 0.3s ease-out, scale-in 0.5s ease-out, fade-out 0.5s ease-out 0.5s forwards'
            }}
          />
        </div>
      )}
    </div>
  );
};

export default HydrationTracker;

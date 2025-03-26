
import React, { useState } from 'react';
import { useHydration } from '@/context/HydrationContext';
import { Settings, Droplet } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import WaterGoalSettings from '@/components/WaterGoalSettings';
import ReminderSettings from '@/components/ReminderSettings';

const Header: React.FC = () => {
  const { measurementUnit, setMeasurementUnit } = useHydration();
  const [settingsTab, setSettingsTab] = useState<'goals' | 'reminders'>('goals');
  
  return (
    <header className="flex items-center justify-between py-6 px-6">
      <div className="flex items-center">
        <div className="w-10 h-10 bg-water/10 rounded-full flex items-center justify-center mr-3">
          <Droplet className="h-6 w-6 text-water" />
        </div>
        <h1 className="text-xl font-semibold">Hydration Buddy</h1>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Unit toggle */}
        <div className="glass px-3 py-1 rounded-full text-sm flex gap-3">
          <button
            onClick={() => setMeasurementUnit('ml')}
            className={`transition-colors ${
              measurementUnit === 'ml' ? 'text-water font-medium' : 'text-gray-500'
            }`}
          >
            ml
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={() => setMeasurementUnit('oz')}
            className={`transition-colors ${
              measurementUnit === 'oz' ? 'text-water font-medium' : 'text-gray-500'
            }`}
          >
            oz
          </button>
        </div>
        
        {/* Settings button */}
        <Sheet>
          <SheetTrigger asChild>
            <button className="w-10 h-10 glass rounded-full flex items-center justify-center transition-transform hover:scale-110">
              <Settings className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent className="bg-background/90 backdrop-blur-xl border-white/10">
            <SheetHeader>
              <SheetTitle>Settings</SheetTitle>
            </SheetHeader>
            
            <div className="flex justify-center gap-4 mt-6 border-b border-white/10 pb-2">
              <button
                onClick={() => setSettingsTab('goals')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  settingsTab === 'goals' 
                    ? 'border-b-2 border-water text-water' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Hydration Goals
              </button>
              <button
                onClick={() => setSettingsTab('reminders')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  settingsTab === 'reminders' 
                    ? 'border-b-2 border-water text-water' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Reminders
              </button>
            </div>
            
            <div className="mt-6">
              {settingsTab === 'goals' ? <WaterGoalSettings /> : <ReminderSettings />}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;

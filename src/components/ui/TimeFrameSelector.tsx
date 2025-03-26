
import React from 'react';
import { useHydration, TimeFrame } from '@/context/HydrationContext';
import { cn } from '@/lib/utils';

const TimeFrameSelector: React.FC = () => {
  const { timeFrame, setTimeFrame } = useHydration();

  const timeFrames: { value: TimeFrame; label: string }[] = [
    { value: 'daily', label: 'Day' },
    { value: 'weekly', label: 'Week' },
    { value: 'monthly', label: 'Month' },
    { value: 'annual', label: 'Year' },
  ];

  return (
    <div className="flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/20 shadow-sm mx-auto max-w-sm">
      {timeFrames.map((frame) => (
        <button
          key={frame.value}
          onClick={() => setTimeFrame(frame.value)}
          className={cn(
            "flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap",
            timeFrame === frame.value
              ? "bg-water text-white shadow-md"
              : "text-gray-600 hover:bg-gray-100"
          )}
        >
          {frame.label}
        </button>
      ))}
    </div>
  );
};

export default TimeFrameSelector;

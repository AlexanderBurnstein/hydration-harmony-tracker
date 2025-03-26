
import React, { useState, useEffect } from 'react';
import { useHydration } from '@/context/HydrationContext';
import { calculateWaterLevel, formatAmount } from '@/utils/hydrationUtils';
import { Droplet } from 'lucide-react';

interface WaterAnimationProps {
  showDetails?: boolean;
}

const WaterAnimation: React.FC<WaterAnimationProps> = ({ showDetails = true }) => {
  const { getCurrentDayProgress, measurementUnit } = useHydration();
  const [animationStarted, setAnimationStarted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [nextRippleId, setNextRippleId] = useState(0);
  const { current, target, percentage } = getCurrentDayProgress();

  // Start animation after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationStarted(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Set water level height using CSS variable
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--fill-height',
      `${calculateWaterLevel(current, target)}%`
    );
  }, [current, target]);

  // Handle click to create ripple effect
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = { id: nextRippleId, x, y };
    setRipples([...ripples, newRipple]);
    setNextRippleId(nextRippleId + 1);

    // Remove ripple after animation completes
    setTimeout(() => {
      setRipples(ripples => ripples.filter(r => r.id !== newRipple.id));
    }, 1000);
  };

  // Handle mouse move to track position
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const fillHeight = calculateWaterLevel(current, target);

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div
        className="ripple-container water-container h-80 w-full cursor-pointer transform transition-transform duration-300 hover:scale-[1.02]"
        onClick={handleClick}
        onMouseMove={handleMouseMove}
      >
        {/* Water fill */}
        <div
          className={`absolute left-0 right-0 bottom-0 bg-gradient-to-t from-water-dark to-water transition-all duration-1000 ease-out ${
            animationStarted ? 'animate-fill-up' : ''
          }`}
          style={{ height: animationStarted ? `${fillHeight}%` : '0%' }}
        >
          {/* Water waves */}
          <div className="water-wave animate-wave" />
          <div className="water-wave animate-wave" style={{ animationDelay: '-1.5s', opacity: 0.6 }} />
        </div>

        {/* Droplet icon at the top */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 animate-bounce-soft">
          <Droplet className="h-10 w-10 text-water" strokeWidth={1.5} />
        </div>

        {/* Current amount in the middle */}
        {showDetails && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-white drop-shadow-lg pointer-events-none">
            <p className="text-5xl font-light tracking-tight">
              {formatAmount(current, measurementUnit)}
            </p>
            <p className="text-xl opacity-80 mt-2">
              of {formatAmount(target, measurementUnit)}
            </p>
            <p className="mt-1 text-sm font-medium bg-white/20 rounded-full px-3 py-1 backdrop-blur-sm">
              {percentage.toFixed(0)}% of daily goal
            </p>
          </div>
        )}

        {/* Render ripples */}
        {ripples.map(ripple => (
          <div
            key={ripple.id}
            className="ripple"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: '10px',
              height: '10px',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default WaterAnimation;

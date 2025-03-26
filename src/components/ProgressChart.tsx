
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  TooltipProps
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { useHydration, TimeFrame } from '@/context/HydrationContext';
import { formatAmount } from '@/utils/hydrationUtils';

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  const { measurementUnit } = useHydration();
  
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    
    return (
      <div className="glass p-3 rounded-lg text-sm shadow-lg">
        <p className="font-medium">{data.name || label}</p>
        <p className="text-water-dark font-semibold">
          {formatAmount(payload[0].value as number, measurementUnit)}
        </p>
        {data.target && (
          <p className="text-gray-500 text-xs">
            Target: {formatAmount(data.target, measurementUnit)}
          </p>
        )}
      </div>
    );
  }

  return null;
};

const ProgressChart: React.FC = () => {
  const { timeFrame, getProgress, measurementUnit } = useHydration();
  
  const getChartData = () => {
    const { data } = getProgress(timeFrame);
    
    switch (timeFrame) {
      case 'daily':
        return data.flatMap((day: any) => 
          day.entries.map((entry: any, i: number) => ({
            name: format(parseISO(entry.time), 'h:mm a'),
            amount: entry.amount,
            time: entry.time,
          }))
        );
      
      case 'weekly':
        return data.map((day: any) => ({
          name: format(parseISO(day.date), 'EEE'),
          amount: day.current,
          target: day.target,
          date: day.date,
        }));
      
      case 'monthly':
        return data.map((day: any) => ({
          name: format(parseISO(day.date), 'd'),
          amount: day.current,
          target: day.target,
          date: day.date,
        }));
      
      case 'annual':
        return data.map((month: any) => ({
          name: month.month,
          amount: month.average,
          target: month.target,
        }));
      
      default:
        return [];
    }
  };
  
  const chartData = getChartData();
  
  // Only render if we have data
  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-center">
        <p className="text-gray-500">No data available for this {timeFrame} view yet.<br/>Add water intake to see progress.</p>
      </div>
    );
  }
  
  const getTargetValue = () => {
    const { target } = getProgress(timeFrame);
    return target;
  };

  // For the daily view, we want to show cumulative data
  const prepareDailyData = () => {
    if (timeFrame !== 'daily') return chartData;
    
    let cumulative = 0;
    return chartData.map((entry: any) => {
      cumulative += entry.amount;
      return {
        ...entry,
        amount: cumulative
      };
    });
  };
  
  const finalData = timeFrame === 'daily' ? prepareDailyData() : chartData;
  
  return (
    <div className="w-full h-64 mt-4 p-4 glass rounded-3xl">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={finalData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6B7280', fontSize: 12 }}
          />
          <YAxis 
            hide={true}
            domain={[0, 'dataMax + 500']}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine 
            y={getTargetValue()} 
            stroke="#60A5FA" 
            strokeDasharray="3 3" 
            label={{ 
              value: 'Target', 
              position: 'insideTopRight',
              fill: '#60A5FA',
              fontSize: 12
            }} 
          />
          <Bar 
            dataKey="amount" 
            radius={[4, 4, 0, 0]}
            fill="url(#colorGradient)" 
            animationDuration={1500}
          />
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--water))" stopOpacity={1} />
              <stop offset="100%" stopColor="hsl(var(--water-light))" stopOpacity={0.8} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;

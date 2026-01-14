import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface ScoreChartProps {
  score: number;
  isDark?: boolean;
}

const ScoreChart: React.FC<ScoreChartProps> = ({ score, isDark = false }) => {
  const data = [{ name: 'Score', value: score }];
  
  const getColor = (s: number) => {
    if (s >= 80) return isDark ? '#4ade80' : '#22c55e'; // Green
    if (s >= 60) return isDark ? '#fbbf24' : '#eab308'; // Yellow
    return isDark ? '#f87171' : '#ef4444'; // Red
  };

  const color = getColor(score);

  return (
    <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart 
          innerRadius="70%" 
          outerRadius="100%" 
          barSize={15} 
          data={data} 
          startAngle={90} 
          endAngle={-270}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            background={{ fill: isDark ? '#1e293b' : '#f1f5f9' }}
            dataKey="value"
            cornerRadius={10}
            fill={color}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-100 transition-colors">{score}</span>
        <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500 font-bold mt-1">ATS Score</span>
      </div>
    </div>
  );
};

export default ScoreChart;
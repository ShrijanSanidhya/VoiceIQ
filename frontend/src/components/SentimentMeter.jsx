import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const SentimentMeter = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-20 bg-white/5 rounded-2xl w-full animate-pulse" />
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-8 bg-white/5 rounded-lg w-full animate-pulse" />)}
        </div>
        <div className="h-40 bg-white/5 rounded-2xl w-full animate-pulse" />
      </div>
    );
  }

  if (!data) return <div className="text-brand-gray text-center p-8">No sentiment data available.</div>;

  const getOverallStyle = (overall) => {
    const o = overall?.toLowerCase();
    if (o === 'positive') return { emoji: '✅', color: 'text-green-400', border: 'border-green-500/50', glow: 'shadow-[0_0_15px_rgba(34,197,94,0.3)]', bg: 'bg-green-500/10' };
    if (o === 'negative') return { emoji: '❌', color: 'text-red-400', border: 'border-red-500/50', glow: 'shadow-[0_0_15px_rgba(239,68,68,0.3)]', bg: 'bg-red-500/10' };
    return { emoji: '⚠️', color: 'text-yellow-400', border: 'border-yellow-500/50', glow: 'shadow-[0_0_15px_rgba(234,179,8,0.3)]', bg: 'bg-yellow-500/10' };
  };

  const style = getOverallStyle(data.overall);

  // Generate fake timeline data for the graph if backend didn't provide a dense array
  // In a real app this would map to actual segment timestamps.
  const timelineData = [
    { time: '0:00', score: 50 },
    { time: '1:00', score: 65 },
    { time: '2:00', score: data.score ? data.score * 100 : 50 },
    { time: '3:00', score: 85 },
    { time: 'End', score: data.score ? data.score * 100 : 80 },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className={`glass p-6 rounded-2xl border ${style.border} ${style.glow} flex flex-col items-center justify-center`}>
        <div className={`text-4xl mb-2`}>{style.emoji}</div>
        <h3 className={`text-2xl font-bold uppercase tracking-widest ${style.color}`}>{data.overall}</h3>
        <p className="text-brand-gray mt-2">{data.score ? Math.round(data.score * 100) : 0}% confident</p>
      </div>

      <p className="text-brand-gray leading-relaxed text-center italic">
        "{data.sentiment_summary || data.summary}"
      </p>

      <div>
        <h4 className="text-lg font-bold mb-4 gradient-text">Emotion Breakdown</h4>
        <div className="space-y-4">
          {Object.entries(data.emotions || {}).map(([emotion, score], idx) => (
            <div key={idx} className="flex items-center gap-4">
              <span className="w-24 text-sm font-medium capitalize text-white">{emotion}</span>
              <div className="flex-1 h-4 bg-brand-dark rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${score * 100}%` }}
                  transition={{ duration: 1, delay: idx * 0.2, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-brand-purple to-brand-cyan"
                />
              </div>
              <span className="w-12 text-right text-sm text-brand-cyan font-mono">{Math.round(score * 100)}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-white/10">
        <h4 className="text-lg font-bold mb-6 gradient-text">Mood Timeline</h4>
        <div className="h-48 w-full -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData}>
              <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1A1A2E', borderColor: '#7C3AED', borderRadius: '8px' }}
                itemStyle={{ color: '#06B6D4' }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#06B6D4" 
                strokeWidth={3}
                dot={{ fill: '#7C3AED', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#06B6D4' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SentimentMeter;

import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ progress = 0, label = 'Uploading...' }) => {
  const isComplete = progress >= 100;

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-2 font-medium">
        <span className={`transition-colors ${isComplete ? 'text-green-400' : 'text-brand-gray'}`}>
          {isComplete ? '✓ Upload Complete!' : label}
        </span>
        <span className={`transition-colors ${isComplete ? 'text-green-400' : 'text-white'}`}>
          {progress}%
        </span>
      </div>
      <div className="h-3 w-full bg-brand-dark rounded-full overflow-hidden border border-white/10 p-[1px]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: 'circOut', duration: 0.4 }}
          className={`h-full rounded-full transition-all duration-300 ${
            isComplete
              ? 'bg-gradient-to-r from-green-500 to-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)]'
              : 'bg-gradient-to-r from-brand-purple to-brand-cyan shadow-[0_0_12px_rgba(124,58,237,0.5)]'
          }`}
        />
      </div>
      {/* Animated shimmer while uploading */}
      {!isComplete && progress > 0 && progress < 100 && (
        <div className="mt-2 flex items-center gap-2 text-xs text-brand-gray/60">
          <span className="flex gap-1">
            {[0, 1, 2].map(i => (
              <motion.span
                key={i}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                className="w-1 h-1 rounded-full bg-brand-cyan inline-block"
              />
            ))}
          </span>
          Processing your file...
        </div>
      )}
    </div>
  );
};

export default ProgressBar;

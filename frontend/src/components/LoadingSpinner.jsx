import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'md', label }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-[3px]',
    lg: 'w-14 h-14 border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative flex items-center justify-center">
        {/* Outer glow ring */}
        <div className={`${sizes[size]} rounded-full absolute opacity-20 bg-brand-purple blur-md`} />
        {/* Spinning border */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className={`${sizes[size]} rounded-full border-brand-dark border-t-brand-purple border-r-brand-cyan`}
        />
      </div>
      {label && (
        <p className="text-sm text-brand-gray animate-pulse">{label}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;

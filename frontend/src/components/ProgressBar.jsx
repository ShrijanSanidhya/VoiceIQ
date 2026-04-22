import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ progress = 0 }) => {
  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-2 text-brand-gray font-medium">
        <span>Uploading...</span>
        <span className="text-white">{progress}%</span>
      </div>
      <div className="h-3 w-full bg-brand-dark rounded-full overflow-hidden border border-white/10 p-[1px]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "circOut" }}
          className="h-full bg-gradient-to-r from-brand-purple to-brand-cyan rounded-full glow"
        />
      </div>
    </div>
  );
};

export default ProgressBar;

import React from 'react';
import { motion } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';

const Button = ({ children, variant = 'primary', isLoading = false, disabled = false, className = '', onClick, ...props }) => {
  const baseStyles = "relative inline-flex items-center justify-center font-medium transition-all duration-300 rounded-lg overflow-hidden";
  
  const variants = {
    primary: "bg-gradient-to-r from-brand-purple to-brand-cyan text-white hover:glow border border-transparent",
    secondary: "glass text-white hover:border-brand-purple hover:bg-white/5",
  };
  
  const sizes = "px-6 py-3 text-sm";
  
  const isDisabled = disabled || isLoading;

  return (
    <motion.button
      whileHover={isDisabled ? {} : { scale: 1.02 }}
      whileTap={isDisabled ? {} : { scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes} ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      onClick={onClick}
      disabled={isDisabled}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <LoadingSpinner size="sm" />
          Processing...
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default Button;

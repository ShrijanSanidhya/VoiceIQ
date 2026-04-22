import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, UploadCloud } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center relative overflow-hidden px-6">
      {/* Background glows */}
      <div className="absolute top-[20%] left-[15%] w-96 h-96 rounded-full bg-brand-purple/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[15%] w-80 h-80 rounded-full bg-brand-cyan/10 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-center max-w-lg relative z-10"
      >
        {/* 404 glitchy number */}
        <motion.div
          animate={{ textShadow: ['0 0 20px #7C3AED', '0 0 60px #06B6D4', '0 0 20px #7C3AED'] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-[10rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-brand-purple to-brand-cyan select-none"
        >
          404
        </motion.div>

        <h1 className="text-3xl font-bold text-white mb-4 -mt-4">Page Not Found</h1>
        <p className="text-brand-gray mb-10 text-lg">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-purple to-brand-cyan text-white font-semibold hover:opacity-90 transition-opacity shadow-lg"
          >
            <Home className="w-4 h-4" /> Go Home
          </Link>
          <Link
            to="/upload"
            className="flex items-center gap-2 px-6 py-3 rounded-xl glass border border-white/10 text-white font-semibold hover:bg-white/10 transition-colors"
          >
            <UploadCloud className="w-4 h-4" /> Upload Audio
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;

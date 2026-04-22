import React from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const SummaryCard = ({ data, isLoading }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (!data) return;
    const text = `SUMMARY:\n${data.one_line_summary}\n\nHIGHLIGHTS:\n${data.key_highlights?.join('\n')}\n\nPOINTS:\n${data.summary?.join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Summary copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-white/5 rounded-lg w-3/4 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-24 bg-white/5 rounded-xl animate-pulse" />)}
        </div>
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-6 bg-white/5 rounded w-full animate-pulse" />)}
        </div>
      </div>
    );
  }

  if (!data) return <div className="text-brand-gray text-center p-8">No summary generated yet.</div>;

  return (
    <div className="space-y-8 pb-10 group relative">
      <button 
        onClick={handleCopy}
        className="absolute top-0 right-0 p-2 text-brand-gray hover:text-white glass rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {copied ? <Check className="w-4 h-4 text-brand-cyan" /> : <Copy className="w-4 h-4" />}
      </button>

      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="border-l-4 border-brand-purple pl-6 py-2"
      >
        <h3 className="text-2xl font-bold text-white leading-snug">{data.one_line_summary}</h3>
      </motion.div>

      <div>
        <h4 className="text-lg font-bold mb-4 gradient-text">Key Highlights</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.key_highlights?.map((highlight, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass p-5 rounded-xl border border-white/5 hover:border-brand-purple/30 transition-colors"
            >
              <div className="text-2xl font-extrabold gradient-text opacity-50 mb-2">
                {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
              </div>
              <p className="text-white text-sm leading-relaxed">{highlight}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-lg font-bold mb-4 gradient-text">Summary Points</h4>
        <ul className="space-y-3">
          {data.summary?.map((point, idx) => (
            <motion.li 
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex gap-3 text-brand-gray"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 flex-shrink-0" />
              <span className="text-white leading-relaxed">{point}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SummaryCard;

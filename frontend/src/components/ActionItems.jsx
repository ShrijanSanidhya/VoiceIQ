import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, Square, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from './Button';

const ActionItems = ({ items = [], isLoading }) => {
  const [completed, setCompleted] = useState(new Set());

  const toggleComplete = (idx) => {
    const newSet = new Set(completed);
    if (newSet.has(idx)) newSet.delete(idx);
    else newSet.add(idx);
    setCompleted(newSet);
  };

  const handleCopy = () => {
    if (!items.length) return;
    const text = items.map((i, idx) => `[${completed.has(idx) ? 'x' : ' '}] ${i}`).join('\n');
    navigator.clipboard.writeText(text);
    toast.success('Action items copied!');
  };

  const assignPriority = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('urgent') || lower.includes('immediately') || lower.includes('asap')) return 'high';
    if (lower.includes('review') || lower.includes('check')) return 'medium';
    return 'low';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1,2,3].map(i => <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />)}
      </div>
    );
  }

  if (!items || items.length === 0) return <div className="text-brand-gray text-center p-8">No action items found.</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold">Action Items</h3>
          <p className="text-brand-gray text-sm">{items.length} items identified</p>
        </div>
        <Button variant="secondary" onClick={handleCopy} className="py-2 px-4 text-xs">
          <Copy className="w-4 h-4 mr-2" /> Copy All
        </Button>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {items.map((item, idx) => {
            const isDone = completed.has(idx);
            const priority = assignPriority(item);
            
            return (
              <motion.div 
                key={idx}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isDone ? 0.6 : 1, y: 0 }}
                className={`glass p-4 rounded-xl border flex gap-4 transition-all duration-300 cursor-pointer ${isDone ? 'border-white/10 bg-white/5' : 'border-white/20 hover:border-brand-purple/50'}`}
                onClick={() => toggleComplete(idx)}
              >
                <div className="mt-1 flex-shrink-0 text-brand-purple">
                  {isDone ? <CheckSquare className="w-5 h-5 text-brand-cyan" /> : <Square className="w-5 h-5" />}
                </div>
                
                <div className="flex-1">
                  <p className={`text-sm md:text-base transition-all ${isDone ? 'line-through text-brand-gray' : 'text-white'}`}>
                    {item}
                  </p>
                </div>
                
                <div className="flex-shrink-0">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border
                    ${priority === 'high' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                      priority === 'medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 
                      'bg-green-500/10 text-green-400 border-green-500/20'}`}
                  >
                    {priority}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ActionItems;

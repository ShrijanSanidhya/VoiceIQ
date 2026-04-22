import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const Transcript = ({ transcriptData = [], isLive = false, activeTime = 0 }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const scrollRef = useRef(null);

  // Auto-scroll logic
  useEffect(() => {
    if (isLive && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcriptData, isLive]);

  const formatTime = (time) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getSpeakerColor = (speaker) => {
    if (speaker === "Speaker 1") return "text-brand-purple";
    if (speaker === "Speaker 2") return "text-brand-cyan";
    return "text-brand-gray";
  };

  const highlightText = (text, highlight) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === highlight.toLowerCase() 
        ? <span key={i} className="bg-brand-cyan/30 text-white rounded px-1">{part}</span>
        : part
    );
  };

  return (
    <div className="flex flex-col h-full bg-brand-card rounded-2xl border border-white/5 overflow-hidden glass">
      {/* Header & Search */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
        <h2 className="text-xl font-bold flex items-center gap-2">
          Live Transcript
          {isLive && <span className="flex h-3 w-3"><span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-brand-cyan opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-brand-cyan"></span></span>}
        </h2>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray" />
          <input 
            type="text" 
            placeholder="Search transcript..." 
            className="pl-9 pr-4 py-2 bg-brand-dark rounded-lg text-sm focus:outline-none border border-white/10 focus:border-brand-purple transition-colors w-48"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Transcript Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {transcriptData.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-brand-gray gap-4">
            {isLive ? (
              <>
                <LoadingSpinner />
                <p className="animate-pulse">Waiting for audio stream...</p>
              </>
            ) : (
              <p>No transcript available.</p>
            )}
          </div>
        ) : (
          transcriptData.map((segment, idx) => {
            const isActive = activeTime >= segment.start && activeTime <= segment.end;
            
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl transition-all duration-300 border ${isActive ? 'border-brand-cyan/50 glow-cyan bg-brand-cyan/5' : 'border-white/5 hover:border-brand-purple/30 hover:bg-white/[0.02]'}`}
              >
                <div className="flex items-center gap-3 mb-2 text-sm font-medium">
                  <span className={`flex items-center gap-1 ${getSpeakerColor(segment.speaker)}`}>
                    🎙️ {segment.speaker}
                  </span>
                  <span className="text-brand-gray text-xs">
                    [{formatTime(segment.start)} - {formatTime(segment.end)}]
                  </span>
                </div>
                <div className="text-white leading-relaxed">
                  {highlightText(segment.text, searchTerm)}
                </div>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  );
};

export default Transcript;

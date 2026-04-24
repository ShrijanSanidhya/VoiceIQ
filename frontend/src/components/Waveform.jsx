import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Play, Pause } from 'lucide-react';

const Waveform = ({ audioUrl, onTimeUpdate }) => {
  const containerRef = useRef(null);
  const wavesurferRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const onTimeUpdateRef = useRef(onTimeUpdate);
  useEffect(() => {
    onTimeUpdateRef.current = onTimeUpdate;
  }, [onTimeUpdate]);

  useEffect(() => {
    if (!containerRef.current) return;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#4c1d95',
      progressColor: '#06b6d4',
      cursorColor: '#ffffff',
      barWidth: 2,
      barRadius: 3,
      responsive: true,
      height: 60,
      normalize: true,
    });
    wavesurferRef.current = ws;

    ws.on('ready', () => {
      setDuration(ws.getDuration());
    });

    ws.on('audioprocess', () => {
      const time = ws.getCurrentTime();
      setCurrentTime(time);
      if (onTimeUpdateRef.current) onTimeUpdateRef.current(time);
    });

    return () => {
      try {
        ws.destroy();
      } catch (e) {
        console.error("WaveSurfer destroy error:", e);
      }
    };
  }, []);

  useEffect(() => {
    if (wavesurferRef.current && audioUrl) {
      wavesurferRef.current.load(audioUrl).catch(e => {
        // Ignore AbortError caused by rapid unmounting or rapid audioUrl changes
        if (e.name !== 'AbortError') {
          console.error("WaveSurfer load error:", e);
        }
      });
    }
  }, [audioUrl]);

  const togglePlay = () => {
    if (!wavesurferRef.current) return;
    wavesurferRef.current.playPause();
    setIsPlaying(wavesurferRef.current.isPlaying());
  };

  const formatTime = (time) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex items-center gap-4 w-full bg-brand-card p-4 rounded-xl border border-white/5">
      <button 
        onClick={togglePlay}
        className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-purple to-brand-cyan flex items-center justify-center flex-shrink-0 text-white hover:glow transition-all"
        disabled={!audioUrl}
      >
        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
      </button>
      
      <div className="flex-grow" ref={containerRef} />
      
      <div className="text-sm font-medium text-brand-gray tabular-nums">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </div>
  );
};

export default Waveform;

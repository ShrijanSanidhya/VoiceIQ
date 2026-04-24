import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, BarChart3, ListTodo, MessagesSquare, FileText, Settings, Copy, RefreshCw, AlertTriangle } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';

import Transcript from '../components/Transcript';
import SummaryCard from '../components/SummaryCard';
import ActionItems from '../components/ActionItems';
import SentimentMeter from '../components/SentimentMeter';
import ChatBox from '../components/ChatBox';
import ExportButton from '../components/ExportButton';
import Waveform from '../components/Waveform';
import Button from '../components/Button';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const filename = location.state?.filename;
  const originalName = location.state?.originalName || 'Unknown Audio File';
  const audioUrl = location.state?.audioUrl;

  // --- Global State ---
  const [activeTab, setActiveTab] = useState('Summary');
  const [isLive, setIsLive] = useState(true);
  const [activeTime, setActiveTime] = useState(0);
  const [globalError, setGlobalError] = useState(null);
  
  // --- Data States ---
  const [transcriptData, setTranscriptData] = useState([]);
  const [fullTranscriptText, setFullTranscriptText] = useState('');
  const [summaryData, setSummaryData] = useState(null);
  const [actionItems, setActionItems] = useState([]);
  const [sentimentData, setSentimentData] = useState(null);
  const [chaptersData, setChaptersData] = useState([]);
  
  // --- Loading States ---
  const [isInsightsLoading, setIsInsightsLoading] = useState(true);

  // --- Refs ---
  const wsStarted = useRef(false); // Prevent double WebSocket connections

  // --- Setup Real-Time WebSocket & APIs ---
  useEffect(() => {
    if (!filename) {
      toast.error("No file was uploaded.");
      navigate('/upload');
      return;
    }

    // Guard against double-mount / double connection
    if (wsStarted.current) return;
    wsStarted.current = true;

    let ws;
    let isCompleted = false; // Track if transcription finished successfully
    try {
      ws = new WebSocket('ws://localhost:8000/ws/transcribe');
      
      ws.onopen = () => {
        setIsLive(true);
        // Send the file to be processed
        ws.send(JSON.stringify({ filename }));
      };

      let accumulatedText = "";

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.error) {
          setGlobalError(data.error);
          setIsLive(false);
          ws.close();
          return;
        }

        if (data.status === "completed") {
          isCompleted = true; // Mark as successfully completed
          setIsLive(false);
          // Kick off the Summarize API call using the accumulated text
          fetchInsights(accumulatedText);
        } else if (data.segment) {
          // It's a partial transcript from our generator
          const newSegment = {
            speaker: "Speaker 1", // Mocked speaker for now unless whisper handles it
            start: data.timestamp - 2.0, // Mock start
            end: data.timestamp,
            text: data.segment
          };
          
          accumulatedText += data.segment + " ";
          setFullTranscriptText(accumulatedText);
          setTranscriptData(prev => [...prev, newSegment]);
        }
      };

      ws.onerror = (err) => {
        console.error("WebSocket error", err);
        // Only show error if transcription did NOT complete successfully
        // A normal server-side close after completion can trigger onerror in some browsers
        if (!isCompleted) {
          setGlobalError("Lost connection to transcription server.");
        }
        setIsLive(false);
      };

      ws.onclose = () => {
        setIsLive(false);
      };
      
    } catch (err) {
      setGlobalError(err.message);
    }

    return () => {
      if (ws) ws.close();
    };
  }, [filename, navigate]);

  const fetchInsights = async (finalText) => {
    if (!finalText.trim()) {
      setIsInsightsLoading(false);
      return;
    }
    
    setIsInsightsLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/summarize', {
        transcript_text: finalText
      });
      
      const { summary, action_items, sentiment, chapters, key_highlights } = response.data;
      
      setSummaryData({
        one_line_summary: summary?.[0] || "Summary generated successfully.",
        key_highlights: key_highlights || [],
        summary: summary || []
      });
      
      setActionItems(action_items || []);
      
      setSentimentData({
        overall: sentiment?.label || "Neutral",
        score: sentiment?.score || 0.5,
        emotions: { positive: sentiment?.score, neutral: 1 - (sentiment?.score || 1) },
        sentiment_summary: "Generated based on your transcript."
      });
      
      setChaptersData(chapters || []);
      toast.success('AI Insights Generated!');
      
    } catch (err) {
      console.error(err);
      const detail = err.response?.data?.detail || err.message || 'Failed to generate insights.';
      const isQuota = detail.includes('QUOTA_EXCEEDED') || detail.includes('quota') || detail.includes('rate limit');
      const userMsg = isQuota
        ? '⚠️ Gemini API quota exceeded. Get a new API key at aistudio.google.com'
        : detail;
      toast.error(userMsg, { duration: 8000 });
      setGlobalError(isQuota ? 'Gemini API quota exceeded. Get a fresh key at aistudio.google.com and update backend/.env' : detail);
    } finally {
      setIsInsightsLoading(false);
    }
  };

  const tabs = [
    { id: 'Summary', icon: <FileText className="w-4 h-4" /> },
    { id: 'Actions', icon: <ListTodo className="w-4 h-4" /> },
    { id: 'Sentiment', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'Chapters', icon: <Settings className="w-4 h-4" /> },
    { id: 'Chat', icon: <MessagesSquare className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col font-sans relative">
      <Toaster position="top-center" toastOptions={{ style: { background: '#1A1A2E', color: '#fff', border: '1px solid #7C3AED' } }} />

      {/* TOP NAVBAR */}
      <header className="h-16 glass border-b border-white/5 flex items-center justify-between px-6 z-10 shrink-0">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-brand-gray hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3 border-l border-white/10 pl-6">
            <h1 className="font-bold text-white max-w-[200px] truncate">{originalName}</h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-white/10 text-white">EN</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {globalError ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
              <AlertTriangle className="w-4 h-4" /> Error Occurred
            </div>
          ) : isLive ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm font-medium">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
              </span>
              Transcribing...
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
              <CheckCircle2 className="w-4 h-4" /> Analysis Complete
            </div>
          )}
        </div>
      </header>

      {globalError && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 m-4 rounded-xl flex items-center gap-3 shadow-lg">
          <AlertTriangle className="w-6 h-6 flex-shrink-0" />
          <div>
            <h4 className="font-bold">Pipeline Error</h4>
            <p className="text-sm opacity-80">{globalError}</p>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 flex overflow-hidden p-4 gap-4 pb-24">
        {/* LEFT PANEL: Transcript */}
        <div className="w-[45%] h-full flex flex-col">
          <Transcript transcriptData={transcriptData} isLive={isLive} activeTime={activeTime} />
        </div>

        {/* RIGHT PANEL: Insights */}
        <div className="w-[55%] h-full flex flex-col glass rounded-2xl border border-white/5 overflow-hidden relative">
          
          {/* TABS */}
          <div className="flex items-center border-b border-white/5 bg-white/[0.02] p-2 gap-2 overflow-x-auto hide-scrollbar shrink-0">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all relative ${activeTab === tab.id ? 'text-white bg-white/10' : 'text-brand-gray hover:text-white hover:bg-white/5'}`}
              >
                {tab.icon} {tab.id}
                {activeTab === tab.id && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-cyan shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                )}
              </button>
            ))}
          </div>

          {/* TAB CONTENT */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {activeTab === 'Summary' && <SummaryCard data={summaryData} isLoading={isInsightsLoading && !globalError} />}
                
                {activeTab === 'Actions' && <ActionItems items={actionItems} isLoading={isInsightsLoading && !globalError} />}
                
                {activeTab === 'Sentiment' && <SentimentMeter data={sentimentData} isLoading={isInsightsLoading && !globalError} />}
                
                {activeTab === 'Chapters' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold mb-6">Content Chapters <span className="text-sm font-normal text-brand-gray bg-white/5 px-2 py-1 rounded ml-2">{chaptersData.length}</span></h3>
                    {isInsightsLoading && !globalError ? (
                      <div className="space-y-4">{[1,2].map(i => <div key={i} className="h-24 bg-white/5 rounded-xl animate-pulse" />)}</div>
                    ) : chaptersData.length === 0 ? (
                      <div className="text-brand-gray text-center p-8">No chapters identified.</div>
                    ) : (
                      <div className="border-l-2 border-brand-purple ml-3 space-y-8 pl-6 relative">
                        {chaptersData.map((chap, idx) => (
                          <div key={idx} className="relative glass p-4 rounded-xl border border-white/5 hover:border-brand-purple/50 cursor-pointer transition-colors group">
                            <span className="absolute -left-[31px] top-4 w-3 h-3 rounded-full bg-brand-cyan shadow-[0_0_10px_rgba(6,182,212,1)]" />
                            <div className="text-xs font-bold text-brand-purple mb-1">{chap.start_time} - {chap.end_time}</div>
                            <h4 className="font-bold text-white mb-2">{chap.topic || chap.title}</h4>
                            <p className="text-sm text-brand-gray">{chap.summary}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {activeTab === 'Chat' && <ChatBox transcript={fullTranscriptText} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 w-full h-20 glass border-t border-white/10 z-20 flex items-center justify-between px-6 shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
        <div className="w-[45%] pr-6">
          <Waveform audioUrl={audioUrl} onTimeUpdate={setActiveTime} />
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="secondary" className="hidden md:flex" onClick={() => {
            navigator.clipboard.writeText(fullTranscriptText);
            toast.success('Transcript copied!');
          }}>
            <Copy className="w-4 h-4 mr-2" /> Copy Transcript
          </Button>
          
          <Link to="/upload">
            <Button variant="secondary">
              <RefreshCw className="w-4 h-4 mr-2" /> Analyze New
            </Button>
          </Link>
          
          <ExportButton 
            filename={originalName}
            transcript={fullTranscriptText}
            summary={summaryData}
            sentiment={sentimentData}
            chapters={chaptersData}
            chatHistory={[]}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

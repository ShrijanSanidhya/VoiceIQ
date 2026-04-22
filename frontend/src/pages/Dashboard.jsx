import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, PlayCircle, BarChart3, ListTodo, MessagesSquare, FileText, Settings, Copy, RefreshCw } from 'lucide-react';
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
  const filename = location.state?.filename || 'Unknown Audio File';

  // --- Global State ---
  const [activeTab, setActiveTab] = useState('Summary');
  const [isLive, setIsLive] = useState(true);
  const [activeTime, setActiveTime] = useState(0);
  
  // --- Data States ---
  const [transcriptData, setTranscriptData] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [actionItems, setActionItems] = useState([]);
  const [sentimentData, setSentimentData] = useState(null);
  const [chaptersData, setChaptersData] = useState([]);
  
  // --- Loading States ---
  const [isInsightsLoading, setIsInsightsLoading] = useState(true);

  const wsRef = useRef(null);

  // --- Mock WebSocket / API Logic ---
  // In a real app, this connects to ws://localhost:8000/ws/transcribe
  useEffect(() => {
    let mockTimeout;
    const generateMockTranscript = async () => {
      const mockSegments = [
        { speaker: "Speaker 1", start: 0, end: 5, text: "Hello everyone, thanks for joining today's Q3 planning meeting." },
        { speaker: "Speaker 2", start: 6, end: 12, text: "Hi, glad to be here. I've reviewed the initial budget drafts you sent over." },
        { speaker: "Speaker 1", start: 13, end: 20, text: "Great. The main goal today is to finalize the marketing allocation. We need to decide if we're pushing more into Q4." }
      ];

      for (let i = 0; i < mockSegments.length; i++) {
        await new Promise(r => setTimeout(r, 2000));
        setTranscriptData(prev => [...prev, mockSegments[i]]);
      }
      setIsLive(false);
      fetchInsights();
    };

    generateMockTranscript();
    
    return () => clearTimeout(mockTimeout);
  }, []);

  const fetchInsights = async () => {
    setIsInsightsLoading(true);
    // Simulate API calls to /summarize
    setTimeout(() => {
      setSummaryData({
        one_line_summary: "The team convened to finalize the Q3 marketing budget allocation.",
        key_highlights: ["Initial drafts reviewed", "Marketing allocation is the primary bottleneck", "Potential shift of funds to Q4 discussed"],
        summary: ["Speaker 1 initiated the Q3 planning.", "Speaker 2 confirmed receipt of budget drafts.", "The primary decision pending is Q4 vs Q3 fund allocation."]
      });
      setActionItems([
        "Review the final Q4 marketing numbers by Friday.",
        "Check the budget draft constraints immediately.",
        "Schedule follow-up sync next week."
      ]);
      setSentimentData({
        overall: "Positive",
        score: 0.85,
        emotions: { happy: 0.7, engaged: 0.8, stressed: 0.2 },
        sentiment_summary: "The tone is collaborative and focused, with high engagement."
      });
      setChaptersData([
        { title: "Introduction", start_time: "00:00", end_time: "00:12", summary: "Greetings and agenda setting." },
        { title: "Budget Planning", start_time: "00:13", end_time: "00:20", summary: "Discussion on marketing allocation." }
      ]);
      setIsInsightsLoading(false);
      toast.success('AI Insights Generated!');
    }, 4000);
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
            <h1 className="font-bold text-white max-w-[200px] truncate">{filename}</h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-white/10 text-white">EN</span>
            <span className="px-2 py-0.5 rounded text-xs bg-white/10 text-brand-gray">12m 45s</span>
            <span className="px-2 py-0.5 rounded text-xs bg-white/10 text-brand-gray">2 Speakers</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isLive ? (
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
                {activeTab === 'Summary' && <SummaryCard data={summaryData} isLoading={isInsightsLoading} />}
                
                {activeTab === 'Actions' && <ActionItems items={actionItems} isLoading={isInsightsLoading} />}
                
                {activeTab === 'Sentiment' && <SentimentMeter data={sentimentData} isLoading={isInsightsLoading} />}
                
                {activeTab === 'Chapters' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold mb-6">Content Chapters <span className="text-sm font-normal text-brand-gray bg-white/5 px-2 py-1 rounded ml-2">{chaptersData.length}</span></h3>
                    {isInsightsLoading ? (
                      <div className="space-y-4">{[1,2].map(i => <div key={i} className="h-24 bg-white/5 rounded-xl animate-pulse" />)}</div>
                    ) : (
                      <div className="border-l-2 border-brand-purple ml-3 space-y-8 pl-6 relative">
                        {chaptersData.map((chap, idx) => (
                          <div key={idx} className="relative glass p-4 rounded-xl border border-white/5 hover:border-brand-purple/50 cursor-pointer transition-colors group">
                            <span className="absolute -left-[31px] top-4 w-3 h-3 rounded-full bg-brand-cyan shadow-[0_0_10px_rgba(6,182,212,1)]" />
                            <div className="text-xs font-bold text-brand-purple mb-1">{chap.start_time} - {chap.end_time}</div>
                            <h4 className="font-bold text-white mb-2">{chap.title}</h4>
                            <p className="text-sm text-brand-gray">{chap.summary}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {activeTab === 'Chat' && <ChatBox transcript={transcriptData.map(t => t.text).join(' ')} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 w-full h-20 glass border-t border-white/10 z-20 flex items-center justify-between px-6 shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
        <div className="w-[45%] pr-6">
          <Waveform onTimeUpdate={setActiveTime} />
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="secondary" className="hidden md:flex" onClick={() => {
            navigator.clipboard.writeText(transcriptData.map(t => t.text).join(' '));
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
            filename={filename}
            transcript={transcriptData.map(t => t.text).join('\n')}
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

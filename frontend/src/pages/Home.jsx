import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Mic, FileText, Users, MessageSquare, Globe, FileOutput, ArrowRight } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';

const Home = () => {
  const location = useLocation();

  // Handle scroll-to-section when navigated from another page (e.g. via Navbar)
  useEffect(() => {
    const scrollTo = location.state?.scrollTo;
    if (scrollTo) {
      setTimeout(() => {
        const el = document.getElementById(scrollTo);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location.state]);

  const features = [
    { icon: <Mic />, title: "Real-Time Transcription", desc: "Watch your audio convert to text word by word in real time" },
    { icon: <FileText />, title: "AI Summarization", desc: "Get bullet point summaries and key highlights instantly" },
    { icon: <Users />, title: "Speaker Detection", desc: "Know exactly who said what throughout the conversation" },
    { icon: <MessageSquare />, title: "Chat with Audio", desc: "Ask any question about your audio content" },
    { icon: <Globe />, title: "Multi-Language", desc: "Supports Hindi and English automatically" },
    { icon: <FileOutput />, title: "Export PDF Report", desc: "Download a beautiful professional report in one click" }
  ];

  const stats = [
    { value: "10x", label: "Faster than manual notes" },
    { value: "99%", label: "Accuracy" },
    { value: "10+", label: "Languages" },
    { value: "100%", label: "Free" }
  ];

  return (
    <div className="min-h-screen bg-brand-dark overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-purple/20 blur-[120px] animate-pulse-slow" />
      <div className="absolute top-[40%] right-[-10%] w-[30%] h-[30%] rounded-full bg-brand-cyan/20 blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-32 pb-20 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
          <span className="text-sm font-medium text-brand-gray">VoiceIQ 2.0 is now live</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-6xl md:text-8xl font-extrabold tracking-tight mb-6"
        >
          Turn Any Audio Into <br />
          <span className="gradient-text">Actionable Insights</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-xl text-brand-gray max-w-2xl mb-10 leading-relaxed"
        >
          Upload any lecture, meeting or podcast. Get real-time transcripts, 
          AI summaries, and actionable insights in seconds.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link to="/upload">
            <Button variant="primary" className="text-lg px-8 py-4">
              Try VoiceIQ Free <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Button 
            variant="secondary" 
            className="text-lg px-8 py-4"
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
          >
            See How It Works
          </Button>
        </motion.div>

        {/* Floating Cards Demo */}
        <div className="relative w-full max-w-4xl mt-24 h-64 md:h-80">
          <motion.div 
            className="absolute left-[10%] top-[20%] w-64 glass p-4 rounded-xl z-10"
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="h-2 w-12 bg-brand-purple/50 rounded mb-4" />
            <div className="space-y-2">
              <div className="h-2 w-full bg-white/10 rounded" />
              <div className="h-2 w-4/5 bg-white/10 rounded" />
              <div className="h-2 w-full bg-white/10 rounded" />
            </div>
          </motion.div>

          <motion.div 
            className="absolute right-[10%] top-[0%] w-72 glass p-6 rounded-xl border border-brand-cyan/30 glow-cyan z-20"
            animate={{ y: [10, -10, 10] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <h3 className="font-bold mb-3 gradient-text">Key Highlights</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-cyan" /> <div className="h-2 w-3/4 bg-white/20 rounded" /></li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-cyan" /> <div className="h-2 w-5/6 bg-white/20 rounded" /></li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-cyan" /> <div className="h-2 w-2/3 bg-white/20 rounded" /></li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="text-4xl md:text-5xl font-extrabold gradient-text mb-2">{stat.value}</div>
                <div className="text-sm font-medium text-brand-gray uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Everything you need</h2>
          <p className="text-brand-gray text-lg max-w-2xl mx-auto">Powerful features wrapped in an elegant, simple to use interface.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <Card key={idx} delay={idx * 0.1} className="group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-purple/20 to-brand-cyan/20 flex items-center justify-center mb-6 text-brand-cyan group-hover:scale-110 transition-transform">
                {feat.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feat.title}</h3>
              <p className="text-brand-gray leading-relaxed">{feat.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-20 mb-20 relative">
        <div className="glass rounded-3xl p-12 md:p-20 text-center relative overflow-hidden border-brand-purple/20 glow">
          <div className="absolute inset-0 bg-brand-gradient opacity-5" />
          <h2 className="text-3xl md:text-4xl font-bold mb-16 relative z-10">How It Works</h2>
          
          <div className="flex flex-col md:flex-row justify-between items-center relative z-10 gap-10">
            {['Upload', 'AI Process', 'Get Insights'].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center relative z-10 w-full">
                <div className="w-16 h-16 rounded-full bg-brand-dark border-2 border-brand-purple flex items-center justify-center text-xl font-bold mb-4 shadow-[0_0_15px_rgba(124,58,237,0.5)]">
                  {idx + 1}
                </div>
                <h3 className="text-xl font-bold mb-2">{step}</h3>
                <p className="text-brand-gray text-sm">Lightning fast execution locally.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Mic className="text-brand-cyan w-5 h-5" />
              <span className="font-bold text-lg">VoiceIQ</span>
            </div>
            <p className="text-brand-gray text-sm text-center">
              &copy; {new Date().getFullYear()} VoiceIQ. AI-Powered Audio Intelligence Platform. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/ShrijanSanidhya/VoiceIQ"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-gray text-sm font-medium hover:text-white transition-colors flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

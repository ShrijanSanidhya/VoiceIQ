import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';
import axios from 'axios';

const ChatBox = ({ transcript }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedQuestions = [
    "What were the main decisions?",
    "Who spoke the most?",
    "What are the next steps?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (text = input) => {
    if (!text.trim() || !transcript) return;
    
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Build proper history array per your langchain service
      const history = messages.map(m => ({
        role: m.role === 'user' ? 'human' : 'ai',
        content: m.content
      }));

      const res = await axios.post('http://localhost:8000/chat', {
        question: text,
        transcript: transcript,
        chat_history: history
      });

      setMessages(prev => [...prev, { role: 'ai', content: res.data.answer }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I encountered an error answering that question." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-250px)]">
      <div className="flex-1 overflow-y-auto space-y-6 pb-6 pr-2">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-purple/20 to-brand-cyan/20 flex items-center justify-center text-brand-cyan">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Chat with your Audio</h3>
              <p className="text-brand-gray max-w-sm">Ask any question about the meeting, speakers, decisions, or topics discussed.</p>
            </div>
            <div className="flex flex-col gap-2 w-full max-w-sm">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="glass text-sm text-left py-3 px-4 rounded-xl hover:border-brand-purple/50 transition-colors text-brand-cyan hover:text-white"
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-gradient-to-br from-brand-purple to-[#5b21b6] text-white rounded-br-none' : 'glass border border-white/5 rounded-bl-none'}`}>
                {msg.role === 'ai' && <div className="text-xs font-bold text-brand-cyan mb-1 flex items-center gap-1"><Sparkles className="w-3 h-3"/> AI Assistant</div>}
                <div className="leading-relaxed text-sm md:text-base whitespace-pre-wrap">{msg.content}</div>
                {msg.role === 'ai' && (
                  <div className="mt-3 pt-3 border-t border-white/10 text-xs text-brand-gray">
                    Source: Context analyzed from transcript via LangChain
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="glass border border-white/5 rounded-2xl rounded-bl-none p-4 flex gap-1">
              <span className="w-2 h-2 rounded-full bg-brand-cyan animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-brand-cyan animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-brand-cyan animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="pt-4 border-t border-white/10 mt-auto">
        <div className="relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about speakers, topics, decisions..." 
            className="w-full bg-brand-dark glass rounded-xl py-4 pl-4 pr-12 focus:outline-none border border-white/10 focus:border-brand-purple transition-all text-white placeholder-brand-gray/50"
          />
          <button 
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-brand-purple hover:bg-brand-cyan transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;

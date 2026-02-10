
import React, { useState, useRef, useEffect } from 'react';
import { Send, X, RotateCcw, Leaf, User, Info, Sparkles, MessageCircle } from 'lucide-react';
import { Message } from '../types';
import { GoogleGenAI } from '@google/genai';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Welcome to ጀማሪAI. I'm your specialized academic companion. How can I assist your studies today?",
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: input,
        config: {
          systemInstruction: 'You are ጀማሪAI, a highly professional academic assistant for Adama Science and Technology University (ASTU). Provide scholarly, accurate, and concise information about campus life, the schools (EECS, Mechanical, Applied Sciences, etc.), and academic policy. Tone: Dignified, helpful, scholarly.',
          temperature: 0.7,
        }
      });
      const assistantMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: response.text || "I'm sorry, I couldn't retrieve that info.", timestamp: new Date() };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      const errorMsg: Message = { id: 'err', role: 'assistant', content: "My connection to the ASTU Registry is temporarily unstable.", timestamp: new Date() };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end pointer-events-none">
      {isOpen && (
        <div className="pointer-events-auto w-[90vw] sm:w-[450px] h-[700px] max-h-[85vh] bg-white dark:bg-teal-950 rounded-[3.5rem] shadow-[0_32px_128px_-12px_rgba(85,107,47,0.3)] border border-teal-100 dark:border-teal-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom-12 duration-500 mb-6">
          <div className="bg-teal-500 p-8 text-white flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                <MessageCircle size={24} />
              </div>
              <div>
                <h3 className="font-black text-xl font-display leading-none">ASTU Companion</h3>
                <div className="flex items-center gap-2 opacity-60 mt-1">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Digital Registry Active</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setMessages([messages[0]])} className="p-2.5 hover:bg-white/10 rounded-xl transition-colors"><RotateCcw size={18} /></button>
              <button onClick={() => setIsOpen(false)} className="p-2.5 hover:bg-white/10 rounded-xl transition-colors"><X size={20} /></button>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 scroll-smooth bg-teal-50/20 dark:bg-teal-950">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4`}>
                <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-clay-500 text-white' : 'bg-white dark:bg-teal-800 text-teal-500 border border-teal-100'}`}>
                    {msg.role === 'user' ? <User size={18} /> : <Leaf size={18} />}
                  </div>
                  <div className={`p-5 rounded-[2.2rem] text-sm leading-relaxed font-medium shadow-sm ${msg.role === 'user' ? 'bg-teal-500 text-white rounded-tr-none' : 'bg-white dark:bg-teal-900 text-teal-950 dark:text-teal-50 rounded-tl-none border border-teal-50'}`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-teal-900 px-6 py-4 rounded-3xl flex gap-2 items-center border border-teal-100">
                  <div className="w-1.5 h-1.5 bg-teal-300 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            )}
          </div>

          <div className="p-10 bg-white dark:bg-teal-950 border-t border-teal-100 dark:border-teal-800 space-y-6">
            <div className="flex flex-wrap gap-2">
              {['Syllabus Search', 'Library Map', 'EECS Schedule'].map(s => (
                <button key={s} onClick={() => setInput(s)} className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-teal-50 dark:bg-teal-900 border border-teal-100 rounded-full hover:bg-teal-500 hover:text-white transition-all">{s}</button>
              ))}
            </div>
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Query your ASTU Companion..."
                className="w-full bg-teal-50/50 dark:bg-teal-900 border border-teal-100 rounded-[2rem] py-4 pl-6 pr-14 text-sm font-bold outline-none focus:ring-4 focus:ring-teal-50"
              />
              <button onClick={handleSend} disabled={!input.trim() || isTyping} className="absolute right-2.5 top-1/2 -translate-y-1/2 w-10 h-10 bg-teal-500 text-white rounded-[1.2rem] flex items-center justify-center hover:scale-105 transition-all disabled:opacity-20 shadow-lg shadow-teal-100">
                <Send size={18} />
              </button>
            </div>
            <div className="flex items-center justify-center gap-2 opacity-30 text-[10px] font-black uppercase tracking-widest"><Info size={12} /> ASTU Specialized Intelligence</div>
          </div>
        </div>
      )}

      <button onClick={() => setIsOpen(!isOpen)} className={`pointer-events-auto p-5 rounded-[2.5rem] shadow-2xl flex items-center justify-center transition-all duration-700 hover:scale-110 active:scale-90 ${isOpen ? 'bg-white text-teal-500 rotate-90' : 'bg-teal-500 text-white'}`}>
        {isOpen ? <X size={32} /> : <MessageCircle size={32} />}
      </button>
    </div>
  );
};

export default ChatWidget;


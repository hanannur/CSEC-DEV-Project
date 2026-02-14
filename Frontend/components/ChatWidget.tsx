
// import React, { useState, useRef, useEffect } from 'react';
// import { Send, X, RotateCcw, Leaf, User, Info, Sparkles, MessageCircle, Loader2 } from 'lucide-react';
// import { Message } from '../types';
// import api from '../services/api';
// import { useNavigate } from 'react-router-dom';

// const ChatWidget: React.FC = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [input, setInput] = useState('');
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: '1',
//       role: 'assistant',
//       content: "Welcome to ጀማሪAI. I'm your specialized academic companion. How can I assist your studies today?",
//       timestamp: new Date()
//     }
//   ]);
//   const [isThinking, setIsThinking] = useState(false);
//   const [hasToken, setHasToken] = useState<boolean>(!!localStorage.getItem('token'));
//   const scrollRef = useRef<HTMLDivElement>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchHistory();
//   }, []);

//   const fetchHistory = async () => {
//     // Require authentication for chat history
//     const token = localStorage.getItem('token');
//     setHasToken(!!token);
//     if (!token) {
//       setMessages([{
//         id: '1',
//         role: 'assistant',
//         content: "Please sign in to access your ASTU Companion chat history.",
//         timestamp: new Date()
//       }]);
//       return;
//     }

//     try {
//       const response = await api.get('/chat/history');
//       if (response.data && response.data.messages) {
//         const mapped = response.data.messages.map((m: any, i: number) => ({
//           id: i.toString(),
//           role: m.role,
//           content: m.content,
//           timestamp: new Date(m.timestamp)
//         }));
//         setMessages(mapped);
//       }
//     } catch (error) {
//       console.error('Failed to fetch history:', error);
//     }
//   };

//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
//     }
//   }, [messages, isThinking]);

//   const handleSend = async () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       navigate('/login');
//       return;
//     }

//     if (!input.trim() || isThinking) return;
//     const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date() };
//     setMessages(prev => [...prev, userMsg]);
//     setInput('');
//     setIsThinking(true);

//     try {
//       const response = await api.post('/chat/ask', { question: input });
//       const assistantMsg: Message = {
//         id: (Date.now() + 1).toString(),
//         role: 'assistant',
//         content: response.data.answer,
//         timestamp: new Date()
//       };
//       setMessages(prev => [...prev, assistantMsg]);
//     } catch (error) {
//       const errorMsg: Message = {
//         id: 'err',
//         role: 'assistant',
//         content: "Identity link interrupted. Please verify your connection to the ASTU Excellence Engine.",
//         timestamp: new Date()
//       };
//       setMessages(prev => [...prev, errorMsg]);
//     } finally {
//       setIsThinking(false);
//     }
//   };

//   const clearChat = async () => {
//     if (!window.confirm('Wipe learning history?')) return;
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         navigate('/login');
//         return;
//       }
//       await api.delete('/chat/history');
//       setMessages([{
//         id: '1',
//         role: 'assistant',
//         content: "Session reset. I am ጀማሪAI, ready for specialized inquiry.",
//         timestamp: new Date()
//       }]);
//     } catch (error) {
//       console.error('Failed to clear history:', error);
//     }
//   };

//   return (
//     <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end pointer-events-none">
//       {isOpen && (
//         <div className="pointer-events-auto w-[90vw] sm:w-[450px] h-[700px] max-h-[85vh] bg-white dark:bg-teal-950 rounded-[3.5rem] shadow-[0_32px_128px_-12px_rgba(85,107,47,0.3)] border border-teal-100 dark:border-teal-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom-12 duration-500 mb-6">
//           <div className="bg-teal-500 p-8 text-white flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
//                 <MessageCircle size={24} />
//               </div>
//               <div>
//                 <h3 className="font-black text-xl font-display leading-none">ASTU Companion</h3>
//                 <div className="flex items-center gap-2 opacity-60 mt-1">
//                   <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
//                   <span className="text-[10px] font-black uppercase tracking-widest">Digital Registry Active</span>
//                 </div>
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               <button onClick={clearChat} className="p-2.5 hover:bg-white/10 rounded-xl transition-colors"><RotateCcw size={18} /></button>
//               <button onClick={() => setIsOpen(false)} className="p-2.5 hover:bg-white/10 rounded-xl transition-colors"><X size={20} /></button>
//             </div>
//           </div>

//           <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 scroll-smooth bg-teal-50/20 dark:bg-teal-950">
//             {messages.map((msg) => (
//               <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4`}>
//                 <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
//                   <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-clay-500 text-white' : 'bg-white dark:bg-teal-800 text-teal-500 border border-teal-100'}`}>
//                     {msg.role === 'user' ? <User size={18} /> : <Leaf size={18} />}
//                   </div>
//                   <div className={`p-5 rounded-[2.2rem] text-sm leading-relaxed font-medium shadow-sm ${msg.role === 'user' ? 'bg-teal-500 text-white rounded-tr-none' : 'bg-white dark:bg-teal-900 text-teal-950 dark:text-teal-50 rounded-tl-none border border-teal-50'}`}>
//                     {msg.content}
//                   </div>
//                 </div>
//               </div>
//             ))}
//             {isThinking && (
//               <div className="flex justify-start">
//                 <div className="bg-white dark:bg-teal-900 px-6 py-4 rounded-3xl flex gap-3 items-center border border-teal-100 italic text-teal-500 text-xs font-bold">
//                   <Loader2 size={14} className="animate-spin" />
//                   Processing Excellence Data...
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="p-10 bg-white dark:bg-teal-950 border-t border-teal-100 dark:border-teal-800 space-y-6">
            
//             <div className="relative">
//               <input
//                 type="text"
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyDown={(e) => e.key === 'Enter' && handleSend()}
//                 placeholder="Query your ASTU Companion..."
//                 className="w-full bg-teal-50/50 dark:bg-teal-900 border border-teal-100 rounded-[2rem] py-4 pl-6 pr-14 text-sm font-bold outline-none focus:ring-4 focus:ring-teal-50"
//               />
//               <button onClick={handleSend} disabled={!input.trim() || isThinking} className="absolute right-2.5 top-1/2 -translate-y-1/2 w-10 h-10 bg-teal-500 text-white rounded-[1.2rem] flex items-center justify-center hover:scale-105 transition-all disabled:opacity-20 shadow-lg shadow-teal-100">
//                 <Send size={18} />
//               </button>
//             </div>
//             <div className="flex items-center justify-center gap-2 opacity-30 text-[10px] font-black uppercase tracking-widest"><Info size={12} /> ASTU Specialized Intelligence</div>
//           </div>
//         </div>
//       )}

//       <button onClick={() => setIsOpen(!isOpen)} className={`pointer-events-auto p-5 rounded-[2.5rem] shadow-2xl flex items-center justify-center transition-all duration-700 hover:scale-110 active:scale-90 ${isOpen ? 'bg-white text-teal-500 rotate-90' : 'bg-teal-500 text-white'}`}>
//         {isOpen ? <X size={32} /> : <MessageCircle size={32} />}
//       </button>
//     </div>
//   );
// };

// export default ChatWidget;



// import React, { useState, useRef, useEffect } from 'react';
// import { Send, X, RotateCcw, Leaf, User, Info, MessageCircle, Loader2 } from 'lucide-react';
// import { Message } from '../types';
// import api from '../services/api';
// import { useNavigate } from 'react-router-dom';

// // --- NEW FORMATTING COMPONENT ---
// const FormattedContent: React.FC<{ content: string }> = ({ content }) => {
//   const lines = content.split('\n');

//   return (
//     <div className="space-y-2">
//       {lines.map((line, index) => {
//         // Handle Bullet Points
//         if (line.trim().startsWith('*') || line.trim().startsWith('-')) {
//           const text = line.replace(/^[*-]\s*/, '');
//           return (
//             <div key={index} className="flex gap-2 ml-2">
//               <span className="text-teal-500 font-black">•</span>
//               <span className="flex-1">{renderBold(text)}</span>
//             </div>
//           );
//         }

//         // Handle Empty lines (Paragraph spacing)
//         if (line.trim() === '') return <div key={index} className="h-2" />;

//         // Standard line
//         return (
//           <p key={index} className="leading-relaxed">
//             {renderBold(line)}
//           </p>
//         );
//       })}
//     </div>
//   );
// };

// // Helper to turn **text** into <strong> tags
// const renderBold = (text: string) => {
//   const parts = text.split(/(\*\*.*?\*\*)/g);
//   return parts.map((part, i) => {
//     if (part.startsWith('**') && part.endsWith('**')) {
//       return (
//         <strong key={i} className="font-black text-teal-600 dark:text-teal-400">
//           {part.slice(2, -2)}
//         </strong>
//       );
//     }
//     return part;
//   });
// };
// // --------------------------------

// const ChatWidget: React.FC = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [input, setInput] = useState('');
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: '1',
//       role: 'assistant',
//       content: "Welcome to **ጀማሪAI**. I'm your specialized academic companion. How can I assist your **ASTU** studies today?",
//       timestamp: new Date()
//     }
//   ]);
//   const [isThinking, setIsThinking] = useState(false);
//   const [hasToken, setHasToken] = useState<boolean>(!!localStorage.getItem('token'));
//   const scrollRef = useRef<HTMLDivElement>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchHistory();
//   }, []);

//   const fetchHistory = async () => {
//     const token = localStorage.getItem('token');
//     setHasToken(!!token);
//     if (!token) {
//       setMessages([{
//         id: '1',
//         role: 'assistant',
//         content: "Please sign in to access your ASTU Companion chat history.",
//         timestamp: new Date()
//       }]);
//       return;
//     }

//     try {
//       const response = await api.get('/chat/history');
//       if (response.data && response.data.messages) {
//         const mapped = response.data.messages.map((m: any, i: number) => ({
//           id: i.toString(),
//           role: m.role,
//           content: m.content,
//           timestamp: new Date(m.timestamp)
//         }));
//         setMessages(mapped);
//       }
//     } catch (error) {
//       console.error('Failed to fetch history:', error);
//     }
//   };

//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
//     }
//   }, [messages, isThinking]);

//   const handleSend = async () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       navigate('/login');
//       return;
//     }

//     if (!input.trim() || isThinking) return;
//     const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date() };
//     setMessages(prev => [...prev, userMsg]);
//     setInput('');
//     setIsThinking(true);

//     try {
//       const response = await api.post('/chat/ask', { question: input });
//       const assistantMsg: Message = {
//         id: (Date.now() + 1).toString(),
//         role: 'assistant',
//         content: response.data.answer,
//         timestamp: new Date()
//       };
//       setMessages(prev => [...prev, assistantMsg]);
//     } catch (error) {
//       const errorMsg: Message = {
//         id: 'err',
//         role: 'assistant',
//         content: "Identity link interrupted. Please verify your connection to the ASTU Excellence Engine.",
//         timestamp: new Date()
//       };
//       setMessages(prev => [...prev, errorMsg]);
//     } finally {
//       setIsThinking(false);
//     }
//   };

//   const clearChat = async () => {
//     if (!window.confirm('Wipe learning history?')) return;
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         navigate('/login');
//         return;
//       }
//       await api.delete('/chat/history');
//       setMessages([{
//         id: '1',
//         role: 'assistant',
//         content: "Session reset. I am ጀማሪAI, ready for specialized inquiry.",
//         timestamp: new Date()
//       }]);
//     } catch (error) {
//       console.error('Failed to clear history:', error);
//     }
//   };

//   return (
//     <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end pointer-events-none">
//       {isOpen && (
//         <div className="pointer-events-auto w-[90vw] sm:w-[450px] h-[700px] max-h-[85vh] bg-white dark:bg-teal-950 rounded-[3.5rem] shadow-[0_32px_128px_-12px_rgba(85,107,47,0.3)] border border-teal-100 dark:border-teal-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom-12 duration-500 mb-6">
//           <div className="bg-teal-500 p-8 text-white flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
//                 <MessageCircle size={24} />
//               </div>
//               <div>
//                 <h3 className="font-black text-xl font-display leading-none">ASTU Companion</h3>
//                 <div className="flex items-center gap-2 opacity-60 mt-1">
//                   <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
//                   <span className="text-[10px] font-black uppercase tracking-widest">Digital Registry Active</span>
//                 </div>
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               <button onClick={clearChat} className="p-2.5 hover:bg-white/10 rounded-xl transition-colors"><RotateCcw size={18} /></button>
//               <button onClick={() => setIsOpen(false)} className="p-2.5 hover:bg-white/10 rounded-xl transition-colors"><X size={20} /></button>
//             </div>
//           </div>

//           <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 scroll-smooth bg-teal-50/20 dark:bg-teal-950">
//             {messages.map((msg) => (
//               <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4`}>
//                 <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
//                   <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-clay-500 text-white' : 'bg-white dark:bg-teal-800 text-teal-500 border border-teal-100'}`}>
//                     {msg.role === 'user' ? <User size={18} /> : <Leaf size={18} />}
//                   </div>
//                   <div className={`p-5 rounded-[2.2rem] text-sm leading-relaxed font-medium shadow-sm ${msg.role === 'user' ? 'bg-teal-500 text-white rounded-tr-none' : 'bg-white dark:bg-teal-900 text-teal-950 dark:text-teal-50 rounded-tl-none border border-teal-50'}`}>
//                     {/* UPDATED: Content is now passed through the formatter */}
//                     <FormattedContent content={msg.content} />
//                   </div>
//                 </div>
//               </div>
//             ))}
//             {isThinking && (
//               <div className="flex justify-start">
//                 <div className="bg-white dark:bg-teal-900 px-6 py-4 rounded-3xl flex gap-3 items-center border border-teal-100 italic text-teal-500 text-xs font-bold">
//                   <Loader2 size={14} className="animate-spin" />
//                   Processing Excellence Data...
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="p-10 bg-white dark:bg-teal-950 border-t border-teal-100 dark:border-teal-800 space-y-6">
//             <div className="relative">
//               <input
//                 type="text"
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyDown={(e) => e.key === 'Enter' && handleSend()}
//                 placeholder="Query your ASTU Companion..."
//                 className="w-full bg-teal-50/50 dark:bg-teal-900 border border-teal-100 rounded-[2rem] py-4 pl-6 pr-14 text-sm font-bold outline-none focus:ring-4 focus:ring-teal-50"
//               />
//               <button onClick={handleSend} disabled={!input.trim() || isThinking} className="absolute right-2.5 top-1/2 -translate-y-1/2 w-10 h-10 bg-teal-500 text-white rounded-[1.2rem] flex items-center justify-center hover:scale-105 transition-all disabled:opacity-20 shadow-lg shadow-teal-100">
//                 <Send size={18} />
//               </button>
//             </div>
//             <div className="flex items-center justify-center gap-2 opacity-30 text-[10px] font-black uppercase tracking-widest"><Info size={12} /> ASTU Specialized Intelligence</div>
//           </div>
//         </div>
//       )}

//       <button onClick={() => setIsOpen(!isOpen)} className={`pointer-events-auto p-5 rounded-[2.5rem] shadow-2xl flex items-center justify-center transition-all duration-700 hover:scale-110 active:scale-90 ${isOpen ? 'bg-white text-teal-500 rotate-90' : 'bg-teal-500 text-white'}`}>
//         {isOpen ? <X size={32} /> : <MessageCircle size={32} />}
//       </button>
//     </div>
//   );
// };

// export default ChatWidget;

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, X, RotateCcw, Leaf, User, Info, MessageCircle, 
  Loader2, Menu, Plus, Trash2, Edit3, MessageSquare, ChevronLeft 
} from 'lucide-react';
import { Message } from '../types';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

// --- FORMATTING HELPERS ---
const FormattedContent: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n');
  return (
    <div className="space-y-2">
      {lines.map((line, index) => {
        if (line.trim().startsWith('*') || line.trim().startsWith('-')) {
          const text = line.replace(/^[*-]\s*/, '');
          return (
            <div key={index} className="flex gap-2 ml-2">
              <span className="text-teal-500 font-black">•</span>
              <span className="flex-1">{renderBold(text)}</span>
            </div>
          );
        }
        if (line.trim() === '') return <div key={index} className="h-2" />;
        return <p key={index} className="leading-relaxed">{renderBold(line)}</p>;
      })}
    </div>
  );
};

const renderBold = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-black text-teal-600 dark:text-teal-400">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

interface ChatSession {
  _id: string;
  title: string;
  updatedAt: string;
}

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) fetchSessions();
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const fetchSessions = async () => {
    try {
      const res = await api.get('/chat/sessions');
      setSessions(res.data);
    } catch (e) { console.error("History failed"); }
  };

  const loadSession = async (id: string) => {
    setActiveSessionId(id);
    setIsSidebarOpen(false);
    try {
      const res = await api.get(`/chat/history/${id}`);
      setMessages(res.data.messages.map((m: any, i: number) => ({
        id: i.toString(),
        role: m.role,
        content: m.content,
        timestamp: new Date(m.timestamp)
      })));
    } catch (e) { console.error("Load failed"); }
  };

  const createNewChat = () => {
    setActiveSessionId(null);
    setMessages([{ id: '1', role: 'assistant', content: "ጀማሪAI is ready. Ask anything..", timestamp: new Date() }]);
    setIsSidebarOpen(false);
  };

  const handleSend = async () => {
    if (!input.trim() || isThinking) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    try {
      const res = await api.post('/chat/ask', { question: input, sessionId: activeSessionId });
      if (!activeSessionId && res.data.sessionId) {
        setActiveSessionId(res.data.sessionId);
        fetchSessions();
      }
      setMessages(prev => [...prev, { id: 'ai', role: 'assistant', content: res.data.answer, timestamp: new Date() }]);
    } catch (e) { console.error("Send failed"); }
    finally { setIsThinking(false); }
  };

  // UI Grouping
  const groupSessions = () => {
    const groups: Record<string, ChatSession[]> = { Today: [], Yesterday: [], Previous: [] };
    const today = new Date().toDateString();
    sessions.forEach(s => {
      const d = new Date(s.updatedAt).toDateString();
      if (d === today) groups.Today.push(s);
      else groups.Previous.push(s);
    });
    return groups;
  };

  const grouped = groupSessions();

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end pointer-events-none">
      {isOpen && (
        <div className="pointer-events-auto w-[90vw] sm:w-[450px] h-[750px] max-h-[85vh] bg-white dark:bg-teal-950 rounded-[3rem] shadow-2xl border border-teal-100 dark:border-teal-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom-12 relative">
          
          {/* SIDEBAR OVERLAY / DRAWER */}
          <div 
            className={`absolute inset-0 z-[60] bg-teal-950/40 backdrop-blur-sm transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
            onClick={() => setIsSidebarOpen(false)} 
          />
          
          <div className={`absolute top-0 left-0 bottom-0 z-[70] w-72 bg-white dark:bg-teal-900 border-r border-teal-100 dark:border-teal-800 transition-transform duration-300 ease-in-out transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
            <div className="p-6 border-b border-teal-50 dark:border-teal-800 flex items-center justify-between bg-teal-50/20">
              <span className="font-black text-[10px] uppercase tracking-widest text-teal-600">History</span>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-teal-100 dark:hover:bg-teal-800 rounded-xl"><ChevronLeft size={20}/></button>
            </div>
            
            <button onClick={createNewChat} className="m-4 flex items-center justify-center gap-2 p-4 bg-teal-500 text-white rounded-2xl font-bold shadow-lg shadow-teal-100 dark:shadow-none hover:bg-teal-600 transition-all">
              <Plus size={18} /> New Chat
            </button>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {Object.entries(grouped).map(([label, items]) => items.length > 0 && (
                <div key={label} className="space-y-2">
                  <h4 className="text-[10px] font-black text-teal-300 uppercase tracking-widest ml-2">{label}</h4>
                  {items.map(s => (
                    <div 
                      key={s._id} 
                      onClick={() => loadSession(s._id)}
                      className={`group p-3 rounded-xl cursor-pointer transition-all border ${activeSessionId === s._id ? 'bg-teal-500 text-white border-teal-400' : 'hover:bg-teal-50 dark:hover:bg-teal-800 border-transparent'}`}
                    >
                      <p className="text-xs font-bold truncate">{s.title || "New Chat"}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* CHAT HEADER */}
          <div className="bg-teal-500 p-6 text-white flex items-center justify-between shrink-0 relative z-10">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(true)} className="p-2.5 bg-white/20 rounded-xl hover:bg-white/30 transition-all">
                <Menu size={22} />
              </button>
              <div>
                <h3 className="font-black text-lg font-display leading-none">ጀማሪAI</h3>
                <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mt-1">Specialized Intelligence</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2.5 hover:bg-white/10 rounded-xl transition-colors"><X size={24} /></button>
          </div>

          {/* CHAT AREA */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-teal-50/20 dark:bg-teal-950 scrollbar-hide">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-clay-500 text-white' : 'bg-white dark:bg-teal-800 text-teal-500 border border-teal-100'}`}>
                    {msg.role === 'user' ? <User size={16} /> : <Leaf size={16} />}
                  </div>
                  <div className={`p-4 rounded-[1.8rem] text-sm shadow-sm ${msg.role === 'user' ? 'bg-teal-500 text-white rounded-tr-none' : 'bg-white dark:bg-teal-900 text-teal-950 dark:text-teal-50 rounded-tl-none border border-teal-50'}`}>
                    <FormattedContent content={msg.content} />
                  </div>
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-teal-900 px-5 py-3 rounded-2xl flex gap-2 items-center border border-teal-100 italic text-teal-500 text-[11px] font-bold">
                  <Loader2 size={12} className="animate-spin" /> Thinking...
                </div>
              </div>
            )}
          </div>

          {/* INPUT AREA */}
          <div className="p-6 md:p-10 bg-white dark:bg-teal-950 border-t border-teal-100 dark:border-teal-800 shrink-0">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Query your companion..."
                className="w-full bg-teal-50/50 dark:bg-teal-900 border border-teal-100 rounded-[2rem] py-4 pl-6 pr-14 text-sm font-bold outline-none"
              />
              <button onClick={handleSend} disabled={!input.trim() || isThinking} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-teal-500 text-white rounded-2xl flex items-center justify-center hover:scale-105 transition-all">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING BUTTON */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`pointer-events-auto p-5 rounded-[2.2rem] shadow-2xl flex items-center justify-center transition-all duration-700 hover:scale-110 active:scale-90 ${isOpen ? 'bg-white text-teal-500 translate-y-2' : 'bg-teal-500 text-white'}`}
      >
        {isOpen ? <X size={32} /> : <MessageCircle size={32} />}
      </button>
    </div>
  );
};

export default ChatWidget;

import React from 'react';
import { User } from '../types';
import { Calendar, Bell, Search, ChevronRight, MapPin, Clock, ExternalLink, Leaf, GraduationCap } from 'lucide-react';

interface Props {
  user: User | null;
}

const StudentDashboard: React.FC<Props> = ({ user }) => {
  const userName = user?.name || 'Scholar';
  const userAvatar = user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop';

  return (
    <div className="min-h-screen paper-texture dark:bg-teal-950 px-6 lg:px-16 py-12 space-y-12 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-end gap-10">
        <div className="space-y-2">
          <h1 className="text-5xl lg:text-6xl font-black font-display text-teal-950 dark:text-teal-50 leading-none tracking-tighter">
            Academic <br />
            <span className="text-teal-500 italic serif font-light">Journey</span>
          </h1>
          <p className="text-teal-400 font-bold uppercase tracking-[0.2em] text-[10px]">{userName} • EECS Scholar • Semester I</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-initial">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-teal-300" size={20} />
            <input
              type="text"
              placeholder="Search ASTU Resources..."
              className="w-full md:w-96 bg-white dark:bg-teal-900 pl-14 pr-6 py-4 rounded-[2rem] outline-none focus:ring-4 focus:ring-teal-100 border border-teal-100 dark:border-teal-800 font-bold text-sm shadow-sm"
            />
          </div>
          <button className="relative p-4 bg-white dark:bg-teal-900 border border-teal-100 dark:border-teal-800 rounded-[1.5rem] hover:bg-teal-50 transition-all shadow-sm">
            <Bell size={24} className="text-teal-500" />
            <span className="absolute top-3 right-3 w-3 h-3 bg-clay-500 border-2 border-white dark:border-teal-950 rounded-full" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <section className="bg-white dark:bg-teal-900/40 rounded-[3rem] border border-teal-100 dark:border-teal-800 shadow-sm p-10">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-teal-50 dark:bg-teal-900 rounded-[1.5rem] text-teal-500">
                  <Calendar size={28} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-black font-display text-teal-950 dark:text-teal-50">Course Schedule</h3>
              </div>
            </div>

            <div className="space-y-6">
              {[
                { title: 'Artificial Intelligence (EECS312)', time: '08:30 AM', loc: 'Block 2, R304', color: 'bg-teal-500' },
                { title: 'Network Security Lab', time: '01:30 PM', loc: 'EECS Computer Lab 2', color: 'bg-clay-500' },
                { title: 'Embedded Systems', time: '04:00 PM', loc: 'Main Seminar Hall', color: 'bg-teal-700' },
              ].map((event, i) => (
                <div key={i} className="group flex items-center gap-8 p-6 hover:bg-teal-50 dark:hover:bg-teal-800/50 rounded-[2.5rem] transition-all cursor-pointer border border-transparent hover:border-teal-100">
                  <div className={`w-16 h-16 ${event.color} rounded-[1.8rem] flex items-center justify-center text-white font-black text-xl shadow-xl shrink-0`}>
                    {event.time.split(':')[0]}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-teal-950 dark:text-teal-50 group-hover:text-teal-500 transition-colors">{event.title}</h4>
                    <div className="flex items-center gap-6 mt-2 text-[10px] font-bold text-teal-400 uppercase tracking-widest">
                      <span className="flex items-center gap-1.5"><Clock size={16} /> {event.time}</span>
                      <span className="flex items-center gap-1.5"><MapPin size={16} /> {event.loc}</span>
                    </div>
                  </div>
                  <ChevronRight size={24} className="text-teal-200 group-hover:text-teal-500 transition-all translate-x-0 group-hover:translate-x-2" />
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-12">
          <section className="bg-teal-500 rounded-[3.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10 text-center space-y-6 py-6">
              <div className="w-28 h-28 rounded-[2rem] bg-white/20 p-1 mx-auto backdrop-blur-lg border border-white/20">
                <img src={userAvatar} alt="Profile" className="w-full h-full rounded-[1.8rem] object-cover" />
              </div>
              <h3 className="text-3xl font-black font-display">{userName}</h3>
              <p className="text-teal-100/60 font-black uppercase tracking-[0.2em] text-[10px]">ASTU Student Identity</p>
            </div>
          </section>

          <section className="bg-white dark:bg-teal-900/40 rounded-[3rem] border border-teal-100 dark:border-teal-800 shadow-sm p-10">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-4 bg-clay-50 dark:bg-teal-950 rounded-[1.5rem] text-clay-500">
                <GraduationCap size={28} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-black font-display text-teal-950 dark:text-teal-50">Knowledge Base</h3>
            </div>
            <div className="space-y-6">
              {[
                { title: 'EECS Curriculum 2024', type: 'Syllabus' },
                { title: 'ASTU Student Policy', type: 'Policy' },
                { title: 'Digital Library Guide', type: 'Guide' },
              ].map((doc, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-teal-50 dark:bg-teal-950 rounded-2xl flex items-center justify-center text-teal-300 group-hover:text-teal-500 transition-all">
                      <Leaf size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-teal-950 dark:text-teal-50 group-hover:text-teal-500 transition-colors text-sm">{doc.title}</p>
                      <p className="text-[10px] text-teal-400 font-black uppercase tracking-widest mt-1">{doc.type}</p>
                    </div>
                  </div>
                  <ExternalLink size={18} className="text-teal-200" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;


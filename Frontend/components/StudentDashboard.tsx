
import React from 'react';
import { User } from '../types';
import { Calendar, Bell, Search, ChevronRight, MapPin, Clock, ExternalLink, Leaf, GraduationCap, Building2, Cpu, Microscope, Server, Newspaper } from 'lucide-react';

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

      <section className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h2 className="text-3xl font-black font-display text-teal-900 dark:text-teal-50">Academic Fields</h2>
            <p className="text-teal-500 font-medium">Explore the specialized colleges and departments at ASTU.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Pre-Engineering Section */}
          <div className="bg-[#f0f1e8] dark:bg-teal-900/30 p-10 rounded-[3.5rem] border-2 border-white dark:border-teal-800 shadow-xl space-y-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-teal-500 rounded-2xl text-white shadow-lg">
                <Cpu size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-black font-display text-teal-950 dark:text-teal-50">Pre-Engineering</h3>
                <p className="text-teal-600 dark:text-teal-400 text-sm font-bold uppercase tracking-widest">3 Specialized Colleges</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { name: 'CoEEC', full: 'Electrical & Computing', icon: Server },
                { name: 'CoCCA', full: 'Civil & Architecture', icon: Building2 },
                { name: 'CoMME', full: 'Mechanical & Materials', icon: Microscope },
              ].map((school, i) => (
                <div key={i} className="bg-white dark:bg-teal-900 p-6 rounded-3xl border border-teal-50 dark:border-teal-800 hover:shadow-xl transition-all cursor-pointer group">
                  <school.icon size={24} className="text-teal-500 mb-4 group-hover:scale-110 transition-transform" />
                  <p className="font-black text-teal-950 dark:text-white text-lg leading-tight">{school.name}</p>
                  <p className="text-[10px] text-teal-400 font-bold uppercase tracking-wide mt-1">{school.full}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pre-Science Section */}
          <div className="bg-white dark:bg-teal-900/40 p-10 rounded-[3.5rem] border border-teal-100 dark:border-teal-800 shadow-sm space-y-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-clay-500 rounded-2xl text-white shadow-lg">
                <Microscope size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-black font-display text-teal-950 dark:text-teal-50">Pre-Science</h3>
                <p className="text-teal-400 font-bold uppercase tracking-widest text-sm">7 Specialized Departments</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                'Applied Mathematics', 'Applied Physics', 'Pharmacy', 'Applied Chemistry',
                'Applied Biology', 'Applied Geology', 'Industrial Chemistry'
              ].map((dept, i) => (
                <div key={i} className="bg-teal-50/50 dark:bg-teal-800/50 p-4 rounded-2xl border border-teal-100 dark:border-teal-700 hover:bg-teal-500 hover:text-white transition-all cursor-pointer text-center">
                  <p className="text-[10px] font-black uppercase tracking-tight leading-tight">{dept}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* University News Section */}
          <section className="bg-white dark:bg-teal-900/40 rounded-[3rem] border border-teal-100 dark:border-teal-800 shadow-sm p-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black font-display text-teal-950 dark:text-teal-50 flex items-center gap-4">
                <Newspaper size={28} className="text-teal-500" />
                University News
              </h3>
              <button className="text-[10px] font-black uppercase tracking-widest text-teal-400 hover:text-teal-700">View All</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { title: 'ASTU Graduation Ceremony 2024 Schedule Announced', date: 'Oct 14', cat: 'Academics' },
                { title: 'New Research Partnership with Global Tech Institute', date: 'Oct 12', cat: 'Research' },
              ].map((news, i) => (
                <div key={i} className="flex gap-4 group cursor-pointer p-4 hover:bg-teal-50 dark:hover:bg-teal-800/50 rounded-2xl transition-all border border-transparent hover:border-teal-50">
                  <div className="w-12 h-12 bg-teal-50 dark:bg-teal-900 rounded-xl flex-shrink-0 flex flex-col items-center justify-center border border-teal-100 dark:border-teal-800 group-hover:bg-teal-500 group-hover:text-white transition-all">
                    <span className="text-sm font-black leading-none">{news.date.split(' ')[1]}</span>
                    <span className="text-[7px] uppercase font-black tracking-widest">{news.date.split(' ')[0]}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[8px] font-black uppercase tracking-widest text-teal-400">{news.cat}</span>
                    <h4 className="text-sm font-bold text-teal-950 dark:text-teal-100 group-hover:text-teal-500 transition-colors leading-tight line-clamp-2">{news.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </section>

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


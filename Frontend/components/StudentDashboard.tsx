import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { 
  Calendar, Bell, Search, ChevronRight, MapPin, Clock, ExternalLink, 
  Leaf, GraduationCap, Building2, Cpu, Microscope, Server, Newspaper, 
  Loader2, X, Info, BookOpen, Layers
} from 'lucide-react';
import api from '../services/api';

interface Props { user: User | null; }

const StudentDashboard: React.FC<Props> = ({ user }) => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Department Modal States
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [deptDocs, setDeptDocs] = useState<any[]>([]);
  const [deptInfo, setDeptInfo] = useState<any>(null);
  const [deptName, setDeptName] = useState('');
  const [deptLoading, setDeptLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [annRes, schRes] = await Promise.all([
          api.get('/student/news'),
          api.get('/student/schedule')
        ]);
        setAnnouncements(annRes.data);
        setSchedule(schRes.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeptClick = async (category: string, displayName: string) => {
    setDeptLoading(true);
    setDeptName(displayName);
    setShowDeptModal(true);
    try {
      const res = await api.get(`/student/documents?category=${encodeURIComponent(category)}`);
      // res.data now contains both { info, documents } from our new backend route
      setDeptInfo(res.data.info);
      setDeptDocs(res.data.documents);
    } catch (error) {
      setDeptInfo(null);
      setDeptDocs([]);
    } finally {
      setDeptLoading(false);
    }
  };

  const userName = user?.name || 'Scholar';

  return (
    <div className="min-h-screen paper-texture dark:bg-teal-950 px-6 lg:px-16 py-12 max-w-7xl mx-auto space-y-12">
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row justify-between items-end gap-10">
        <div className="space-y-2">
          <h1 className="text-5xl lg:text-6xl font-black font-display text-teal-950 dark:text-teal-50 leading-none tracking-tighter">
            Academic <br />
            <span className="text-teal-500 italic serif font-light">Journey</span>
          </h1>
          <p className="text-teal-400 font-bold uppercase tracking-[0.2em] text-[10px]">{userName} • ASTU Student</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-initial">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-teal-300" size={20} />
            <input type="text" placeholder="Search Resources..." className="w-full md:w-96 bg-white dark:bg-teal-900 pl-14 pr-6 py-4 rounded-[2rem] border border-teal-100 dark:border-teal-800 outline-none font-bold text-sm shadow-sm" />
          </div>
        </div>
      </header>

      {/* ACADEMIC FIELDS GRID */}
      <section className="space-y-8">
        <h2 className="text-3xl font-black font-display text-teal-900 dark:text-teal-50">Academic Streams</h2>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          {/* Pre-Engineering Card */}
          <div className="bg-[#f0f1e8] dark:bg-teal-900/30 p-10 rounded-[3.5rem] border-2 border-white shadow-xl space-y-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-teal-500 rounded-2xl text-white shadow-lg"><Cpu size={28} /></div>
              <h3 className="text-2xl font-black font-display text-teal-950 dark:text-teal-50">Pre-Engineering</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[{id: 'CoEEC', n: 'Electrical & Computing', i: Server}, {id: 'CoCCA', n: 'Civil & Architecture', i: Building2}, {id: 'CoMME', n: 'Mechanical & Materials', i: Microscope}].map((s, idx) => (
                <div key={idx} onClick={() => handleDeptClick(s.id, s.id)} className="bg-white dark:bg-teal-900 p-6 rounded-3xl border border-teal-50 dark:border-teal-800 hover:shadow-2xl transition-all cursor-pointer group">
                  <s.i size={24} className="text-teal-500 mb-4 group-hover:scale-110 transition-transform" />
                  <p className="font-black text-teal-950 dark:text-white text-lg leading-tight">{s.id}</p>
                  <p className="text-[9px] text-teal-400 font-bold uppercase mt-1">{s.n}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pre-Science Card */}
          <div className="bg-white dark:bg-teal-900/40 p-10 rounded-[3.5rem] border border-teal-100 shadow-sm space-y-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-clay-500 rounded-2xl text-white shadow-lg"><Microscope size={28} /></div>
              <h3 className="text-2xl font-black font-display text-teal-950 dark:text-teal-50">Pre-Science</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {['Applied Mathematics', 'Applied Physics', 'Pharmacy', 'Applied Chemistry', 'Applied Biology', 'Applied Geology', 'Industrial Chemistry'].map((dept) => (
                <div key={dept} onClick={() => handleDeptClick(dept, dept)} className="bg-teal-50/50 dark:bg-teal-800/50 p-4 rounded-2xl border border-teal-100 hover:bg-teal-500 hover:text-white transition-all cursor-pointer text-center">
                  <p className="text-[9px] font-black uppercase tracking-tighter leading-tight">{dept}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DETAILED DEPARTMENT MODAL (Scrollable) */}
      {showDeptModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10 bg-teal-950/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-teal-900 w-full max-w-4xl max-h-[90vh] rounded-[3.5rem] shadow-2xl border-4 border-white dark:border-teal-800 overflow-hidden flex flex-col">
            
            {/* Modal Header */}
            <div className="p-8 md:p-10 border-b border-teal-50 dark:border-teal-800 flex items-center justify-between bg-teal-50/30 dark:bg-teal-950/30">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-teal-500 rounded-2xl text-white shadow-xl rotate-[-3deg]"><Info size={24} /></div>
                <div>
                  <h3 className="text-3xl md:text-4xl font-black font-display text-teal-950 dark:text-teal-50 leading-none">{deptName}</h3>
                  <p className="text-teal-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Departmental Intelligence & Resources</p>
                </div>
              </div>
              <button onClick={() => setShowDeptModal(false)} className="p-4 hover:bg-teal-100 dark:hover:bg-teal-800 rounded-3xl transition-all text-teal-400"><X size={32} /></button>
            </div>

            {/* Modal Content Area (Long & Scrollable) */}
            <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12 scrollbar-hide">
              {deptLoading ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-6">
                  <Loader2 className="animate-spin text-teal-500" size={60} strokeWidth={3} />
                  <p className="text-teal-400 font-black uppercase tracking-widest animate-pulse">Accessing Records...</p>
                </div>
              ) : (
                <>
                  {/* Part 1: Description */}
                  <section className="space-y-6 animate-in slide-in-from-bottom-8 duration-500">
                    <div className="flex items-center gap-3 text-teal-400 mb-2">
                      <BookOpen size={18} />
                      <span className="text-xs font-black uppercase tracking-widest">About the Academic Field</span>
                    </div>
                    <p className="text-xl md:text-2xl text-teal-900 dark:text-teal-100 font-medium leading-relaxed italic border-l-4 border-teal-500 pl-6 py-2">
                      {deptInfo?.description || "Description currently unavailable for this field."}
                    </p>
                  </section>

                  {/* Part 2: Sub-Departments (If any) */}
                  {deptInfo?.departments && (
                    <section className="space-y-6 animate-in slide-in-from-bottom-10 duration-700">
                      <div className="flex items-center gap-3 text-teal-400">
                        <Layers size={18} />
                        <span className="text-xs font-black uppercase tracking-widest">Specialized Departments</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {deptInfo.departments.map((d: string, i: number) => (
                          <div key={i} className="flex items-center gap-4 p-5 bg-teal-50/50 dark:bg-teal-800/20 rounded-3xl border border-teal-100 dark:border-teal-700">
                            <div className="w-3 h-3 rounded-full bg-teal-500 shadow-sm" />
                            <span className="text-lg font-bold text-teal-900 dark:text-teal-50">{d}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Part 3: Focus Areas (Chips) */}
                  <section className="space-y-4 animate-in slide-in-from-bottom-12 duration-1000">
                    <span className="text-[10px] font-black uppercase tracking-widest text-teal-400 block">Core Research Focus</span>
                    <div className="flex flex-wrap gap-3">
                      {deptInfo?.focus.map((f: string, i: number) => (
                        <span key={i} className="px-6 py-3 bg-teal-900 text-teal-100 text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg border border-teal-700">
                          {f}
                        </span>
                      ))}
                    </div>
                  </section>

                  
                </>
              )}
            </div>

            {/* Modal Footer Decorative Bar */}
            <div className="bg-teal-500 h-3 w-full" />
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;

// import React from 'react';
// import { User } from '../types';
// import { Calendar, Bell, Search, ChevronRight, User as UserIcon, MapPin, Clock, ExternalLink, Leaf, GraduationCap, Building2, Cpu, Microscope, Server, Newspaper, Loader2, X } from 'lucide-react';
// import { useState, useEffect } from 'react';
// import api from '../services/api';

// interface Props {
//   user: User | null;
// }


// const StudentDashboard: React.FC<Props> = ({ user }) => {
//   const [announcements, setAnnouncements] = useState<any[]>([]);
//   const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
//   const [schedule, setSchedule] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [showAllEvents, setShowAllEvents] = useState(false);
//   const [allEvents, setAllEvents] = useState<any[]>([]);

//   // Department document modal state
//   const [showDeptModal, setShowDeptModal] = useState(false);
//   const [deptDocs, setDeptDocs] = useState<any[]>([]);
//   const [deptName, setDeptName] = useState('');
//   const [deptLoading, setDeptLoading] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [annRes, schRes, calRes] = await Promise.all([
//           api.get('/student/news'),
//           api.get('/student/schedule'),
//           api.get('/calendar/upcoming')
//         ]);
//         setAnnouncements(annRes.data);
//         setSchedule(schRes.data);
//         setUpcomingEvents(calRes.data.upcoming || []);
//       } catch (error) {
//         console.error('Error fetching dashboard data:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const fetchAllEvents = async () => {
//     try {
//       const res = await api.get('/calendar/all');
//       setAllEvents(res.data);
//       setShowAllEvents(true);
//     } catch (error) {
//       console.error('Error fetching all events:', error);
//     }
//   };

//   const userName = user?.name || 'Scholar';
//   const userAvatar = user?.avatar || '';

//   // Handler for department/college button click
//   const handleDeptClick = async (category: string, displayName: string) => {
//     setDeptLoading(true);
//     setDeptName(displayName);
//     setShowDeptModal(true);
//     try {
//       const res = await api.get(`/student/documents?category=${encodeURIComponent(category)}`);
//       setDeptDocs(res.data);
//     } catch (error) {
//       setDeptDocs([]);
//     } finally {
//       setDeptLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen paper-texture dark:bg-teal-950 px-6 lg:px-16 py-12 space-y-12 max-w-7xl mx-auto">
//       <header className="flex flex-col md:flex-row justify-between items-end gap-10">
//         <div className="space-y-2">
//           <h1 className="text-5xl lg:text-6xl font-black font-display text-teal-950 dark:text-teal-50 leading-none tracking-tighter">
//             Academic <br />
//             <span className="text-teal-500 italic serif font-light">Journey</span>
//           </h1>
//           <p className="text-teal-400 font-bold uppercase tracking-[0.2em] text-[10px]">{userName} • EECS Scholar • Semester I</p>
//         </div>
//         <div className="flex items-center gap-4 w-full md:w-auto">
//           <div className="relative flex-1 md:flex-initial">
//             <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-teal-300" size={20} />
//             <input
//               type="text"
//               placeholder="Search ASTU Resources..."
//               className="w-full md:w-96 bg-white dark:bg-teal-900 pl-14 pr-6 py-4 rounded-[2rem] outline-none focus:ring-4 focus:ring-teal-100 border border-teal-100 dark:border-teal-800 font-bold text-sm shadow-sm"
//             />
//           </div>
//           <button className="relative p-4 bg-white dark:bg-teal-900 border border-teal-100 dark:border-teal-800 rounded-[1.5rem] hover:bg-teal-50 transition-all shadow-sm">
//             <Bell size={24} className="text-teal-500" />
//             <span className="absolute top-3 right-3 w-3 h-3 bg-clay-500 border-2 border-white dark:border-teal-950 rounded-full" />
//           </button>
//         </div>
//       </header>

//       <section className="space-y-8">
//         <div className="flex flex-col md:flex-row justify-between items-end gap-4">
//           <div>
//             <h2 className="text-3xl font-black font-display text-teal-900 dark:text-teal-50">Academic Fields</h2>
//             <p className="text-teal-500 font-medium">Explore the specialized colleges and departments at ASTU.</p>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
//           {/* Pre-Engineering Section */}
//           <div className="bg-[#f0f1e8] dark:bg-teal-900/30 p-10 rounded-[3.5rem] border-2 border-white dark:border-teal-800 shadow-xl space-y-8">
//             <div className="flex items-center gap-4">
//               <div className="p-4 bg-teal-500 rounded-2xl text-white shadow-lg">
//                 <Cpu size={28} />
//               </div>
//               <div>
//                 <h3 className="text-2xl font-black font-display text-teal-950 dark:text-teal-50">Pre-Engineering</h3>
//                 <p className="text-teal-600 dark:text-teal-400 text-sm font-bold uppercase tracking-widest">3 Specialized Colleges</p>
//               </div>
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//               {[
//                 { name: 'CoEEC', full: 'Electrical & Computing', icon: Server },
//                 { name: 'CoCCA', full: 'Civil & Architecture', icon: Building2 },
//                 { name: 'CoMME', full: 'Mechanical & Materials', icon: Microscope },
//               ].map((school, i) => (
//                 <div
//                   key={i}
//                   className="bg-white dark:bg-teal-900 p-6 rounded-3xl border border-teal-50 dark:border-teal-800 hover:shadow-xl transition-all cursor-pointer group"
//                   onClick={() => handleDeptClick(school.name, school.full)}
//                 >
//                   <school.icon size={24} className="text-teal-500 mb-4 group-hover:scale-110 transition-transform" />
//                   <p className="font-black text-teal-950 dark:text-white text-lg leading-tight">{school.name}</p>
//                   <p className="text-[10px] text-teal-400 font-bold uppercase tracking-wide mt-1">{school.full}</p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Pre-Science Section */}
//           <div className="bg-white dark:bg-teal-900/40 p-10 rounded-[3.5rem] border border-teal-100 dark:border-teal-800 shadow-sm space-y-8">
//             <div className="flex items-center gap-4">
//               <div className="p-4 bg-clay-500 rounded-2xl text-white shadow-lg">
//                 <Microscope size={28} />
//               </div>
//               <div>
//                 <h3 className="text-2xl font-black font-display text-teal-950 dark:text-teal-50">Pre-Science</h3>
//                 <p className="text-teal-400 font-bold uppercase tracking-widest text-sm">7 Specialized Departments</p>
//               </div>
//             </div>
//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//               {[
//                 'Applied Mathematics', 'Applied Physics', 'Pharmacy', 'Applied Chemistry',
//                 'Applied Biology', 'Applied Geology', 'Industrial Chemistry'
//               ].map((dept, i) => (
//                 <div
//                   key={i}
//                   className="bg-teal-50/50 dark:bg-teal-800/50 p-4 rounded-2xl border border-teal-100 dark:border-teal-700 hover:bg-teal-500 hover:text-white transition-all cursor-pointer text-center"
//                   onClick={() => handleDeptClick(dept, dept)}
//                 >
//                   <p className="text-[10px] font-black uppercase tracking-tight leading-tight">{dept}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
//         <div className="lg:col-span-2 space-y-12">
//           {/* University News Section */}
//           <section className="bg-white dark:bg-teal-900/40 rounded-[3rem] border border-teal-100 dark:border-teal-800 shadow-sm p-10">
//             <div className="flex items-center justify-between mb-8">
//               <h3 className="text-2xl font-black font-display text-teal-950 dark:text-teal-50 flex items-center gap-4">
//                 <Newspaper size={28} className="text-teal-500" />
//                 University News
//               </h3>
//               <button
//                 onClick={fetchAllEvents}
//                 className="text-[10px] font-black uppercase tracking-widest text-teal-400 hover:text-teal-700"
//               >
//                 View All
//               </button>
//             </div>

//             {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               {isLoading ? (
//                 <div className="col-span-2 flex justify-center py-8">
//                   <Loader2 className="animate-spin text-teal-500" size={32} />
//                 </div>
//               ) : upcomingEvents.length > 0 ? (
//                 upcomingEvents.map((event, i) => (
//                   <div key={i} className={`flex gap-4 group cursor-pointer p-4 hover:bg-teal-50 dark:hover:bg-teal-800/50 rounded-2xl transition-all border ${event.isToday ? 'border-clay-500 bg-clay-50/30' : 'border-transparent hover:border-teal-50'}`}>
//                     <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex flex-col items-center justify-center border transition-all ${event.isToday ? 'bg-clay-500 text-white border-clay-600' : 'bg-teal-50 dark:bg-teal-900 border-teal-100 dark:border-teal-800 group-hover:bg-teal-500 group-hover:text-white'}`}>
//                       <span className="text-sm font-black leading-none">{event.date.split('-')[2]}</span>
//                       <span className="text-[7px] uppercase font-black tracking-widest">
//                         {new Date(event.date).toLocaleString('default', { month: 'short' })}
//                       </span>
//                     </div>
//                     <div className="space-y-1">
//                       <div className="flex items-center gap-2">
//                         <span className="text-[8px] font-black uppercase tracking-widest text-teal-400">Academic Calendar</span>
//                         {event.isToday && <span className="text-[8px] font-black uppercase tracking-widest text-clay-500 animate-pulse">● Today</span>}
//                       </div>
//                       <h4 className="text-sm font-bold text-teal-950 dark:text-teal-100 group-hover:text-teal-500 transition-colors leading-tight line-clamp-2">{event.title}</h4>
//                       <p className="text-[10px] text-teal-400 line-clamp-1">{event.description}</p>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p className="col-span-2 text-center text-teal-400 font-medium py-8">No upcoming events found.</p>
//               )}
//             </div> */}
//           </section>

//           <section className="bg-white dark:bg-teal-900/40 rounded-[3rem] border border-teal-100 dark:border-teal-800 shadow-sm p-10">
//             <div className="flex items-center justify-between mb-12">
//               <div className="flex items-center gap-4">
//                 <div className="p-4 bg-teal-50 dark:bg-teal-900 rounded-[1.5rem] text-teal-500">
//                   <Calendar size={28} strokeWidth={1.5} />
//                 </div>
//                 <h3 className="text-2xl font-black font-display text-teal-950 dark:text-teal-50">Course Schedule</h3>
//               </div>
//             </div>

//             <div className="space-y-6">
//               {isLoading ? (
//                 <div className="flex justify-center py-8">
//                   <Loader2 className="animate-spin text-teal-500" size={32} />
//                 </div>
//               ) : schedule.length > 0 ? (
//                 schedule.map((event, i) => (
//                   <div key={event._id || i} className="group flex items-center gap-8 p-6 hover:bg-teal-50 dark:hover:bg-teal-800/50 rounded-[2.5rem] transition-all cursor-pointer border border-transparent hover:border-teal-100">
//                     <div className={`w-16 h-16 ${event.color || 'bg-teal-500'} rounded-[1.8rem] flex items-center justify-center text-white font-black text-xl shadow-xl shrink-0`}>
//                       {event.time.split(':')[0]}
//                     </div>
//                     <div className="flex-1">
//                       <h4 className="text-xl font-bold text-teal-950 dark:text-teal-50 group-hover:text-teal-500 transition-colors">{event.title}</h4>
//                       <div className="flex items-center gap-6 mt-2 text-[10px] font-bold text-teal-400 uppercase tracking-widest">
//                         <span className="flex items-center gap-1.5"><Clock size={16} /> {event.time}</span>
//                         <span className="flex items-center gap-1.5"><MapPin size={16} /> {event.location || event.loc}</span>
//                       </div>
//                     </div>
//                     <ChevronRight size={24} className="text-teal-200 group-hover:text-teal-500 transition-all translate-x-0 group-hover:translate-x-2" />
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-center text-teal-400 font-medium py-8">No classes scheduled for today.</p>
//               )}
//             </div>
//           </section>
//         </div>

//         <div className="space-y-12">
//           {/* <section className="bg-teal-500 rounded-[3.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
//             <div className="relative z-10 text-center space-y-6 py-6">
//               <div className="w-28 h-28 rounded-[2rem] bg-white/20 p-1 mx-auto backdrop-blur-lg border border-white/20 flex items-center justify-center">
//                 {user?.avatar ? (
//                   <img src={user.avatar} alt="Profile" className="w-full h-full rounded-[1.8rem] object-cover" />
//                 ) : (
//                   <UserIcon className="text-white w-12 h-12" />
//                 )}
//               </div>
//               <h3 className="text-3xl font-black font-display">{userName}</h3>
//               <p className="text-teal-100/60 font-black uppercase tracking-[0.2em] text-[10px]">ASTU Student Identity</p>
//             </div>
//           </section> */}

//           <section className="bg-white dark:bg-teal-900/40 rounded-[3rem] border border-teal-100 dark:border-teal-800 shadow-sm p-10">
//             <div className="flex items-center gap-4 mb-10">
//               <div className="p-4 bg-clay-50 dark:bg-teal-950 rounded-[1.5rem] text-clay-500">
//                 <GraduationCap size={28} strokeWidth={1.5} />
//               </div>
//               <h3 className="text-2xl font-black font-display text-teal-950 dark:text-teal-50">Knowledge Base</h3>
//             </div>
//             <div className="space-y-6">
//               {[
//                 { title: 'EECS Curriculum 2024', type: 'Syllabus' },
//                 { title: 'ASTU Student Policy', type: 'Policy' },
//                 { title: 'Digital Library Guide', type: 'Guide' },
//               ].map((doc, i) => (
//                 <div key={i} className="flex items-center justify-between group cursor-pointer">
//                   <div className="flex items-center gap-4">
//                     <div className="w-12 h-12 bg-teal-50 dark:bg-teal-950 rounded-2xl flex items-center justify-center text-teal-300 group-hover:text-teal-500 transition-all">
//                       <Leaf size={20} />
//                     </div>
//                     <div>
//                       <p className="font-bold text-teal-950 dark:text-teal-50 group-hover:text-teal-500 transition-colors text-sm">{doc.title}</p>
//                       <p className="text-[10px] text-teal-400 font-black uppercase tracking-widest mt-1">{doc.type}</p>
//                     </div>
//                   </div>
//                   <ExternalLink size={18} className="text-teal-200" />
//                 </div>
//               ))}
//             </div>
//           </section>
//         </div>
//       </div>

//       {/* View All Modal */}
//       {showAllEvents && (
//         <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-teal-950/40 backdrop-blur-sm animate-in fade-in duration-300">
//           <div className="bg-white dark:bg-teal-900 w-full max-w-4xl max-h-[80vh] rounded-[4rem] shadow-2xl border-4 border-white dark:border-teal-800 overflow-hidden flex flex-col">
//             <div className="p-10 border-b border-teal-50 flex items-center justify-between">
//               <div>
//                 <h3 className="text-3xl font-black font-display text-teal-950 dark:text-teal-50">Academic Calendar</h3>
//                 <p className="text-teal-500 font-medium italic">Complete view of all scheduled university events.</p>
//               </div>
//               <button
//                 onClick={() => setShowAllEvents(false)}
//                 className="p-4 hover:bg-teal-50 rounded-2xl transition-all text-teal-400"
//               >
//                 <X size={32} />
//               </button>
//             </div>
//             <div className="flex-1 overflow-y-auto p-10 space-y-6">
//               {allEvents.map((event, i) => (
//                 <div key={i} className={`flex items-center justify-between p-6 rounded-3xl border transition-all ${event.isToday ? 'bg-clay-50 border-clay-200' : 'bg-white dark:bg-teal-800/50 border-teal-50'}`}>
//                   <div className="flex items-center gap-8">
//                     <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-white shadow-lg ${event.isToday ? 'bg-clay-500' : 'bg-teal-500'}`}>
//                       <span className="text-xl font-black leading-none">{event.date.split('-')[2]}</span>
//                       <span className="text-[10px] uppercase font-black">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
//                     </div>
//                     <div>
//                       <h4 className="text-xl font-black text-teal-950 dark:text-teal-50">{event.title}</h4>
//                       <p className="text-sm text-teal-500 font-medium">{event.description}</p>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-[10px] font-black uppercase tracking-widest text-teal-400">{event.date}</p>
//                     {event.isToday && <p className="text-[10px] font-black uppercase tracking-widest text-clay-500 mt-1 animate-pulse">Happening Today</p>}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Department Documents Modal */}
//       {showDeptModal && (
//         <div className="fixed inset-0 z-[201] flex items-center justify-center p-6 bg-teal-950/40 backdrop-blur-sm animate-in fade-in duration-300">
//           <div className="bg-white dark:bg-teal-900 w-full max-w-2xl max-h-[80vh] rounded-[3rem] shadow-2xl border-4 border-white dark:border-teal-800 overflow-hidden flex flex-col">
//             <div className="p-8 border-b border-teal-50 flex items-center justify-between">
//               <div>
//                 <h3 className="text-2xl font-black font-display text-teal-950 dark:text-teal-50">{deptName} Documents</h3>
//                 <p className="text-teal-500 font-medium italic">Syllabi, guides, and resources for this department.</p>
//               </div>
//               <button
//                 onClick={() => setShowDeptModal(false)}
//                 className="p-3 hover:bg-teal-50 rounded-2xl transition-all text-teal-400"
//               >
//                 <X size={28} />
//               </button>
//             </div>
//             <div className="flex-1 overflow-y-auto p-8 space-y-4">
//               {deptLoading ? (
//                 <div className="flex justify-center py-8"><Loader2 className="animate-spin text-teal-500" size={32} /></div>
//               ) : deptDocs.length > 0 ? (
//                 deptDocs.map((doc: any, i: number) => (
//                   <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-teal-100 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-800/30">
//                     <div>
//                       <p className="font-bold text-teal-950 dark:text-teal-50 text-sm">{doc.name}</p>
//                       <p className="text-[10px] text-teal-400 font-black uppercase tracking-widest mt-1">Uploaded {new Date(doc.createdAt).toLocaleDateString()}</p>
//                     </div>
//                     <a
//                       href={doc.path.replace('backend/', '')}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="flex items-center gap-2 text-teal-500 hover:text-teal-700 font-bold text-xs"
//                     >
//                       <ExternalLink size={16} /> View
//                     </a>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-center text-teal-400 font-medium py-8">No documents found for this department.</p>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StudentDashboard;




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

                  {/* Part 4: File Resources */}
                  {/* <section className="space-y-6 pt-10 border-t border-teal-50 dark:border-teal-800">
                    <h4 className="text-xl font-black font-display text-teal-950 dark:text-teal-50">Scholarly Documents</h4>
                    <div className="grid grid-cols-1 gap-4">
                      {deptDocs.length > 0 ? deptDocs.map((doc, i) => (
                        <div key={i} className="group flex items-center justify-between p-6 rounded-[2.5rem] border-2 border-teal-50 dark:border-teal-800 bg-white dark:bg-teal-900/50 hover:border-teal-500 transition-all">
                          <div className="flex items-center gap-5">
                            <div className="p-4 bg-teal-50 dark:bg-teal-800 rounded-2xl text-teal-500 group-hover:bg-teal-500 group-hover:text-white transition-all">
                              <Newspaper size={24} />
                            </div>
                            <div>
                              <p className="font-bold text-teal-950 dark:text-teal-50 text-lg group-hover:text-teal-600 transition-colors">{doc.name}</p>
                              <p className="text-[10px] text-teal-400 font-black uppercase tracking-widest mt-1">Uploaded: {new Date(doc.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <a href={doc.path} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-4 bg-teal-500 text-white rounded-2xl hover:bg-teal-600 shadow-xl shadow-teal-100 dark:shadow-none transition-all">
                            <ExternalLink size={20} />
                          </a>
                        </div>
                      )) : (
                        <p className="text-center text-teal-400 font-medium py-10 bg-teal-50/20 rounded-[2.5rem] border-2 border-dashed border-teal-100">No documents found for this category.</p>
                      )}
                    </div>
                  </section> */}
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
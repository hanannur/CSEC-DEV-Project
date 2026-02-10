
import React from 'react';
import { View } from '../types';
import { Sparkles, Cpu, Microscope, Building2, ShieldCheck, UserCircle2, ArrowRight, ExternalLink, GraduationCap, Users, Newspaper, MessageSquare } from 'lucide-react';

interface Props {
  onNavigate: (view: View) => void;
}

const LandingPage: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="relative overflow-hidden selection:bg-teal-200 selection:text-teal-900">
      {/* Enhanced Background with Blur and Gradient */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/gate1.jpg"
          alt="ASTU Gate"
          className="w-full h-full object-cover opacity-70 dark:opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/20 to-white/60 dark:from-teal-950/90 dark:via-teal-950/60 dark:to-teal-950/80" />
        {/* Vignette Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-transparent to-white/40 dark:from-teal-950/40 dark:via-transparent dark:to-teal-950/40" />
      </div>
      <div className="absolute top-0 right-0 -z-10 w-[800px] h-[800px] bg-teal-100/30 dark:bg-teal-900/10 rounded-full blur-[120px]" />

      {/* Hero Section with Glassmorphism */}
      <section className="max-w-7xl mx-auto px-6 lg:px-16 py-12 lg:py-24 flex flex-col lg:flex-row items-center gap-16">
        {/* Left Content with Glass Panel */}
        <div className="flex-1 text-center lg:text-left space-y-8 relative">
          {/* Glassmorphism Background Panel */}
          <div className="absolute inset-0 -z-10 bg-white/60 dark:bg-teal-900/30 backdrop-blur-xl rounded-[4rem] shadow-2xl border border-white/50 dark:border-teal-700/30 -m-8 lg:-m-12" />

          <div className="relative z-10 p-8 lg:p-12">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-2xl bg-teal-50/80 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 border border-teal-100/50 dark:border-teal-800/50 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-sm">
              <Sparkles size={14} className="text-teal-500" />
              <span>Adama Science and Technology University</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black font-display text-teal-900 dark:text-white leading-[1.1] tracking-tighter">
              Innovation for <br />
              <span className="text-teal-500 italic serif font-light">Sustainable Progress.</span>
            </h1>
            <p className="text-lg text-teal-700/80 dark:text-teal-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              FreshStart AI is the digital heartbeat of ASTU, integrating RAG-powered scholarly intelligence with modern university management.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => onNavigate(View.LOGIN)}
                className="px-10 py-5 bg-teal-500 hover:bg-teal-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-teal-200/50 hover:shadow-2xl hover:shadow-teal-300/50 flex items-center justify-center gap-3 transition-all hover:scale-105"
              >
                Access the Portal <ArrowRight size={18} />
              </button>
              <button
                className="px-10 py-5 bg-white/90 dark:bg-teal-900/80 backdrop-blur-md border-2 border-teal-100/50 dark:border-teal-800/50 hover:bg-teal-50 text-teal-900 dark:text-white rounded-3xl font-black text-xs uppercase tracking-widest transition-all hover:scale-105 shadow-lg"
              >
                Academic Calendar
              </button>
            </div>
          </div>
        </div>

        {/* Right Image Card with local image */}
        <div className="flex-1 relative">
          <div className="relative z-10 p-4 bg-white/40 dark:bg-teal-900/40 backdrop-blur-2xl rounded-[3.5rem] shadow-2xl border border-white/40 dark:border-teal-800/40">
            <img
              src="/gate1.jpg"
              alt="ASTU Main Entrance"
              className="rounded-[3rem] w-full h-[500px] object-cover"
            />
            <div className="absolute -bottom-8 -left-8 bg-teal-500 text-white p-8 rounded-[3rem] shadow-2xl hidden lg:block rotate-[-3deg] backdrop-blur-sm">
              <p className="text-[10px] uppercase tracking-widest font-black opacity-80 mb-2">Research Centers</p>
              <p className="text-2xl font-black font-display">8 Specialized Hubs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Bar (Mimicking ASTU home) */}
      <section className="bg-teal-900 text-white py-12 px-6 lg:px-16 mb-20">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Admissions', icon: UserCircle2 },
            { label: 'E-Learning', icon: GraduationCap },
            { label: 'Research', icon: Microscope },
            { label: 'Library', icon: Building2 },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-4 group cursor-pointer">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-teal-500 transition-all border border-white/5">
                <item.icon size={28} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-teal-300 group-hover:text-white transition-colors">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Schools Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-16 py-20 mb-20">
        <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-16">
          <div className="max-w-2xl">
            <h2 className="text-4xl lg:text-6xl font-black font-display text-teal-900 dark:text-teal-50 leading-none mb-6">Our Schools & <br /><span className="text-teal-500 italic">Academic Excellence.</span></h2>
            <p className="text-teal-600 dark:text-teal-400 text-lg font-medium leading-relaxed">Dedicated to producing high-caliber human power in various fields of science and technology.</p>
          </div>
          <button className="flex items-center gap-2 px-8 py-4 border-2 border-teal-50 text-teal-500 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-teal-50 transition-all">
            View All Programs <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[
            {
              school: 'Electrical & Computing',
              icon: Cpu,
              desc: 'Pioneering in Computer Science, Software, and Artificial Intelligence.',
              image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop'
            },
            {
              school: 'Mechanical & Materials',
              icon: Building2,
              desc: 'Advanced research in Automotive, Materials, and Aerospace systems.',
              image: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?q=80&w=1974&auto=format&fit=crop'
            },
            {
              school: 'Applied Natural Science',
              icon: Microscope,
              desc: 'Fundamental sciences meeting industrial application in biology and physics.',
              image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=2070&auto=format&fit=crop'
            }
          ].map((school, i) => (
            <div key={i} className="group bg-white dark:bg-teal-950 rounded-[3rem] border border-teal-100 dark:border-teal-800 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
              <div className="h-48 overflow-hidden relative">
                <img src={school.image} alt={school.school} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-teal-900/20" />
                <div className="absolute top-6 left-6 bg-white/90 p-3 rounded-2xl text-teal-900 shadow-xl">
                  <school.icon size={24} />
                </div>
              </div>
              <div className="p-10">
                <h3 className="text-2xl font-black mb-4 font-display text-teal-950 dark:text-teal-50">{school.school}</h3>
                <p className="text-teal-600 dark:text-teal-400 font-medium leading-relaxed mb-8">{school.desc}</p>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-teal-400 group-hover:text-teal-700 transition-colors">
                  Learn More <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Announcements Section (Mimicking ASTU News) */}
      <section className="bg-teal-50 dark:bg-teal-900/10 py-24 px-6 lg:px-16 mb-20 rounded-[5rem]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-20">
          <div className="lg:col-span-2 space-y-12">
            <div className="flex items-center justify-between">
              <h3 className="text-3xl font-black font-display text-teal-900 dark:text-teal-50 flex items-center gap-4">
                <Newspaper size={32} className="text-teal-500" />
                University News
              </h3>
              <button className="text-[10px] font-black uppercase tracking-widest text-teal-400 hover:text-teal-700">All News</button>
            </div>

            <div className="space-y-8">
              {[
                { title: 'ASTU Graduation Ceremony 2024 Schedule Announced', date: 'October 14, 2024', cat: 'Academics' },
                { title: 'New Research Partnership with Global Tech Institute', date: 'October 12, 2024', cat: 'Research' },
                { title: 'Innovation Week: Student Prototype Showcase', date: 'October 10, 2024', cat: 'Events' },
              ].map((news, i) => (
                <div key={i} className="flex gap-8 group cursor-pointer">
                  <div className="w-16 h-16 bg-white dark:bg-teal-800 rounded-2xl flex-shrink-0 flex flex-col items-center justify-center border border-teal-100 dark:border-teal-800 shadow-sm group-hover:bg-teal-500 group-hover:text-white transition-all">
                    <span className="text-lg font-black leading-none">{news.date.split(' ')[1].replace(',', '')}</span>
                    <span className="text-[8px] uppercase font-black tracking-widest">{news.date.split(' ')[0]}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[8px] font-black uppercase tracking-widest text-teal-400">{news.cat}</span>
                    <h4 className="text-xl font-bold text-teal-900 dark:text-teal-100 group-hover:text-teal-500 transition-colors leading-tight">{news.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-teal-950 p-10 rounded-[3rem] border border-teal-100 dark:border-teal-800 shadow-xl self-start">
            <h3 className="text-2xl font-black font-display mb-8">Quick Portal Access</h3>
            <div className="space-y-4">
              <button onClick={() => onNavigate(View.LOGIN)} className="w-full flex items-center justify-between p-6 bg-teal-50 dark:bg-teal-900 rounded-2xl group hover:bg-teal-500 hover:text-white transition-all">
                <div className="flex items-center gap-4">
                  <UserCircle2 size={24} />
                  <span className="font-bold">Student Portal</span>
                </div>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => onNavigate(View.LOGIN)} className="w-full flex items-center justify-between p-6 bg-teal-50 dark:bg-teal-900 rounded-2xl group hover:bg-teal-500 hover:text-white transition-all">
                <div className="flex items-center gap-4">
                  <ShieldCheck size={24} />
                  <span className="font-bold">Staff Portal</span>
                </div>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer (Already styled ASTU-like) */}
      <footer className="bg-teal-950 text-white py-24 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-1 md:col-span-2 space-y-8">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-2xl">
                <img src="/astuLogo.jpg" alt="ASTU Logo" className="w-8 h-8 object-contain" />
              </div>
              <span className="text-3xl font-bold font-display uppercase tracking-tighter">ASTU FreshStart</span>
            </div>
            <p className="text-teal-400 max-w-sm text-lg font-medium leading-relaxed">Adama Science and Technology University is a premier destination for higher education in engineering and technology in Ethiopia.</p>
            <div className="flex items-center gap-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-teal-500">Contact Us</span>
              <a href="mailto:info@astu.edu.et" className="text-sm font-bold hover:text-teal-300 transition-colors">info@astu.edu.et</a>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-8 text-teal-500 uppercase tracking-widest text-[10px]">Academic Resources</h4>
            <ul className="text-teal-300 space-y-4 font-bold text-sm">
              <li className="hover:text-white cursor-pointer transition-colors">Digital Library</li>
              <li className="hover:text-white cursor-pointer transition-colors">E-Learning Portal</li>
              <li className="hover:text-white cursor-pointer transition-colors">Admission Hub</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-8 text-teal-500 uppercase tracking-widest text-[10px]">Quick Links</h4>
            <ul className="text-teal-300 space-y-4 font-bold text-sm">
              <li className="hover:text-white cursor-pointer transition-colors">Campus Maps</li>
              <li className="hover:text-white cursor-pointer transition-colors">Registrar Office</li>
              <li className="hover:text-white cursor-pointer transition-colors">ASTU Official Site <ExternalLink size={14} className="inline ml-1" /></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between text-[10px] font-black uppercase tracking-widest text-teal-600 gap-8">
          <p>© 2024 FreshStart AI for Adama Science & Technology University. All Rights Reserved.</p>
          <div className="flex gap-8">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

const ChevronRight = ({ size, className }: { size: number, className: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export default LandingPage;


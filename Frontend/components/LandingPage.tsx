
import React from 'react';
// View import removed
import { Sparkles, Cpu, Microscope, Building2, ShieldCheck, UserCircle2, ArrowRight, ExternalLink, GraduationCap, Users, Newspaper, MessageSquare } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
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
              <span>OFFICIAL ASTU FRESH STUDENT ASSISTANT</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black font-display text-teal-900 dark:text-white leading-[1.1] tracking-tighter">
              Your First Year Journey<br />
              <span className="text-teal-500 italic serif font-light">Starts Here</span>
            </h1>
            <p className="text-lg text-teal-700/80 dark:text-teal-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              ጀማሪAI is ASTU’s digital assistant designed for fresh students.
              Get instant answers about departments, schedules, campus services, labs, and student clubs 
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => navigate('/login')}
                className="px-10 py-5 bg-teal-500 hover:bg-teal-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-teal-200/50 hover:shadow-2xl hover:shadow-teal-300/50 flex items-center justify-center gap-3 transition-all hover:scale-105"
              >
                Start Exploring <ArrowRight size={18} />
              </button>
              {/* <button
                className="px-10 py-5 bg-white/90 dark:bg-teal-900/80 backdrop-blur-md border-2 border-teal-100/50 dark:border-teal-800/50 hover:bg-teal-50 text-teal-900 dark:text-white rounded-3xl font-black text-xs uppercase tracking-widest transition-all hover:scale-105 shadow-lg"
              >
                Academic Calendar
              </button> */}
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
              <p className="text-2xl font-black font-display">Explore ASTU Innovation Hubs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Bar (Mimicking ASTU home) */}
      {/* <section className="bg-teal-900 text-white py-12 px-6 lg:px-16 mb-20">
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
      </section> */}



      {/* Footer (Already styled ASTU-like) */}
      <footer className="bg-teal-950 text-white py-24 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-1 md:col-span-2 space-y-8">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-2xl">
                <img src="/astuLogo.jpg" alt="ASTU Logo" className="w-8 h-8 object-contain" />
              </div>
              <span className="text-3xl font-bold font-display uppercase tracking-tighter">ጀማሪAI</span>
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
          <p>© 2024 ጀማሪAI for Adama Science & Technology University. All Rights Reserved.</p>
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


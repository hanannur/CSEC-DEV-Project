
import React, { useState } from 'react';
import { View, User } from '../types';
import { UserCircle2, ShieldCheck, ArrowRight, Lock, Mail, Github, Loader2, CheckCircle2 } from 'lucide-react';

interface Props {
  onLogin: (user: User) => void;
  onNavigate: (view: View) => void;
}

const LoginPage: React.FC<Props> = ({ onLogin, onNavigate }) => {
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [isSignup, setIsSignup] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStatus, setAuthStatus] = useState<string>('');
  const [provider, setProvider] = useState<'google' | 'github' | 'email' | null>(null);

  const simulateLogin = (selectedProvider: 'google' | 'github' | 'email') => {
    setIsAuthenticating(true);
    setProvider(selectedProvider);

    const steps = [
      'Contacting Provider...',
      'Verifying Credentials...',
      'Syncing ASTU Profile...',
      'Finalizing Secure Session...'
    ];

    steps.forEach((step, index) => {
      setTimeout(() => setAuthStatus(step), index * 800);
    });

    setTimeout(() => {
      const mockUser: User = {
        name: role === 'student' ? 'Amanuel Tadesse' : 'Dr. Elias Thorne',
        email: role === 'student' ? 'amanuel.t@astu.edu.et' : 'e.thorne@astu.edu.et',
        role: role,
        avatar: role === 'student'
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop'
          : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop',
        provider: selectedProvider
      };
      onLogin(mockUser);
    }, 3500);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 relative">
      {isAuthenticating && (
        <div className="fixed inset-0 z-[100] bg-white/80 dark:bg-teal-950/80 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-300">
          <div className="max-w-sm w-full p-12 bg-white dark:bg-teal-900 rounded-[3.5rem] shadow-2xl border border-teal-100 dark:border-teal-800 text-center space-y-8">
            <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-teal-100 dark:border-teal-800 rounded-full" />
              <div className="absolute inset-0 border-4 border-teal-500 rounded-full border-t-transparent animate-spin" />
              {provider === 'google' ? (
                <img src="https://www.google.com/favicon.ico" className="w-8 h-8 relative z-10" alt="Google" />
              ) : provider === 'github' ? (
                <Github size={32} className="relative z-10 text-teal-900 dark:text-teal-50" />
              ) : (
                <img src="/astuLogo.jpg" alt="ASTU Logo" className="relative z-10 w-8 h-8 object-contain" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-black font-display text-teal-900 dark:text-teal-50 mb-2">{authStatus}</h3>
              <p className="text-sm font-medium text-teal-400">Securely authenticating with ASTU Registry...</p>
            </div>
          </div>
        </div>
      )}

      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-30">
        <div className="absolute top-20 left-20 w-96 h-96 bg-teal-200 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-clay-100 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-[1000px] grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-teal-900 rounded-[3rem] shadow-[0_32px_128px_-12px_rgba(85,107,47,0.2)] overflow-hidden border border-teal-100 dark:border-teal-800">
        {/* Left Side */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-teal-500 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 left-10 w-40 h-40 border-4 border-white rounded-full" />
            <div className="absolute bottom-20 right-10 w-60 h-60 border-4 border-white rounded-full" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-12">
              <div className="bg-white p-3 rounded-2xl shadow-xl shadow-teal-900/20 rotate-[-4deg] hover:rotate-0 transition-transform duration-500">
                <img src="/astuLogo.jpg" alt="ASTU Logo" className="w-10 h-10 object-contain" />
              </div>
              <span className="text-3xl font-black font-display uppercase tracking-tighter">ጀማሪAI</span>
            </div>
            <h2 className="text-5xl font-black font-display leading-[1.1] mb-6">
              Empowering <br />
              <span className="text-teal-200 italic font-light serif">Scholars.</span>
            </h2>
            <p className="text-teal-100 text-lg font-medium opacity-80 max-w-sm">
              Unified authentication for the Adama Science and Technology University excellence engine.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-4 text-sm font-bold uppercase tracking-widest opacity-60">
            <span>Official Identity Gateway</span>
            <div className="w-10 h-px bg-white" />
            <span>v2.4.0</span>
          </div>
        </div>

        {/* Right Side */}
        <div className="p-12 lg:p-16 flex flex-col justify-center">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-black font-display text-teal-900 dark:text-teal-50 mb-2">
              {isSignup ? 'New Enrollment' : 'Identity Access'}
            </h1>
            <p className="text-teal-400 font-medium">Verify your role within the university ecosystem.</p>
          </div>

          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setRole('student')}
              className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all font-bold text-sm ${role === 'student'
                ? 'border-teal-500 bg-teal-50 text-teal-900 shadow-md'
                : 'border-teal-50 text-teal-400 hover:border-teal-200'
                }`}
            >
              <UserCircle2 size={20} />
              Student
            </button>
            <button
              onClick={() => setRole('admin')}
              className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all font-bold text-sm ${role === 'admin'
                ? 'border-teal-500 bg-teal-50 text-teal-900 shadow-md'
                : 'border-teal-50 text-teal-400 hover:border-teal-200'
                }`}
            >
              <ShieldCheck size={20} />
              Staff
            </button>
          </div>

          <div className="space-y-5 mb-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-400 ml-4">Corporate Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-300" size={18} />
                <input
                  type="email"
                  placeholder="id@astu.edu.et"
                  className="w-full bg-teal-50/50 dark:bg-teal-950 border border-teal-100 dark:border-teal-800 rounded-2xl py-4 pl-12 pr-6 outline-none focus:ring-4 focus:ring-teal-50 text-sm font-bold transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-400 ml-4">Secure Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-300" size={18} />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-teal-50/50 dark:bg-teal-950 border border-teal-100 dark:border-teal-800 rounded-2xl py-4 pl-12 pr-6 outline-none focus:ring-4 focus:ring-teal-50 text-sm font-bold transition-all"
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => simulateLogin('email')}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-teal-100 flex items-center justify-center gap-2 transition-all mb-6"
          >
            {isSignup ? 'Register Portal' : 'Secure Sign In'}
            <ArrowRight size={18} />
          </button>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-teal-50" />
            <span className="text-[10px] font-black uppercase tracking-widest text-teal-300">Social Federated ID</span>
            <div className="flex-1 h-px bg-teal-50" />
          </div>

          <div className="flex gap-4 mb-10">
            <button
              onClick={() => simulateLogin('github')}
              className="flex-1 flex items-center justify-center p-4 border border-teal-50 rounded-2xl hover:bg-teal-50 transition-all group"
            >
              <Github size={20} className="text-teal-900 dark:text-teal-100 group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={() => simulateLogin('google')}
              className="flex-1 flex items-center justify-center p-4 border border-teal-50 rounded-2xl hover:bg-teal-50 transition-all group"
            >
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all group-hover:scale-110" alt="Google" />
            </button>
          </div>

          <p className="text-center text-sm font-medium text-teal-400">
            {isSignup ? 'Already have an account?' : 'New to ጀማሪAI?'}
            <button
              onClick={() => onNavigate(View.REGISTER)}
              className="ml-2 text-teal-500 dark:text-teal-300 font-black hover:underline"
            >
              {isSignup ? 'Login' : 'Start Enrollment'}
            </button>
          </p>
        </div>
      </div >
    </div >
  );
};

export default LoginPage;


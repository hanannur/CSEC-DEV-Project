
import React, { useState } from 'react';
import { View, User } from '../types';
import { UserCircle2, ShieldCheck, ArrowRight, Lock, Mail, Github, User as UserIcon, AlertCircle } from 'lucide-react';
import api from '../services/api';

interface Props {
    onNavigate: (view: View) => void;
    onLogin: (user: User) => void;
}

const RegisterPage: React.FC<Props> = ({ onNavigate, onLogin }) => {
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [authStatus, setAuthStatus] = useState<string>('');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsAuthenticating(true);
        setError('');

        const steps = [
            'Initializing Enrollment...',
            'Validating Credentials...',
            'Syncing ASTU Profile...',
            'Securing Account...'
        ];

        steps.forEach((step, index) => {
            setTimeout(() => setAuthStatus(step), index * 800);
        });

        try {
            const response = await api.post('/auth/register', { name, email, password });
            onLogin(response.data);
        } catch (err: any) {
            setIsAuthenticating(false);
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 relative">
            {isAuthenticating && (
                <div className="fixed inset-0 z-[100] bg-white/80 dark:bg-teal-950/80 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-300">
                    <div className="max-w-sm w-full p-12 bg-white dark:bg-teal-900 rounded-[3.5rem] shadow-2xl border border-teal-100 dark:border-teal-800 text-center space-y-8">
                        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                            <div className="absolute inset-0 border-4 border-teal-100 dark:border-teal-800 rounded-full" />
                            <div className="absolute inset-0 border-4 border-teal-500 rounded-full border-t-transparent animate-spin" />
                            <img src="/astuLogo.jpg" alt="ASTU Logo" className="relative z-10 w-8 h-8 object-contain" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black font-display text-teal-900 dark:text-teal-50 mb-2">{authStatus}</h3>
                            <p className="text-sm font-medium text-teal-400">Securely registering with ASTU Registry...</p>
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
                            Join the <br />
                            <span className="text-teal-200 italic font-light serif">Community.</span>
                        </h2>
                        <p className="text-teal-100 text-lg font-medium opacity-80 max-w-sm">
                            Create your official account to access the Adama Science and Technology University digital ecosystem.
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
                            New Enrollment
                        </h1>
                        <p className="text-teal-400 font-medium">Create your official university identity.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl flex items-center gap-3 text-red-500 text-sm font-bold animate-in slide-in-from-top-2">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-5 mb-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-400 ml-4">Full Name</label>
                            <div className="relative">
                                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-300" size={18} />
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your full name"
                                    className="w-full bg-teal-50/50 dark:bg-teal-950 border border-teal-100 dark:border-teal-800 rounded-2xl py-4 pl-12 pr-6 outline-none focus:ring-4 focus:ring-teal-50 text-sm font-bold transition-all"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-400 ml-4">Corporate Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-300" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="id@astu.edu.et"
                                    className="w-full bg-teal-50/50 dark:bg-teal-950 border border-teal-100 dark:border-teal-800 rounded-2xl py-4 pl-12 pr-6 outline-none focus:ring-4 focus:ring-teal-50 text-sm font-bold transition-all"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-400 ml-4">Secure Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-300" size={18} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-teal-50/50 dark:bg-teal-950 border border-teal-100 dark:border-teal-800 rounded-2xl py-4 pl-12 pr-6 outline-none focus:ring-4 focus:ring-teal-50 text-sm font-bold transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-teal-500 hover:bg-teal-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-teal-100 flex items-center justify-center gap-2 transition-all mb-6"
                        >
                            Register Portal
                            <ArrowRight size={18} />
                        </button>
                    </form>

                    <p className="text-center text-sm font-medium text-teal-400">
                        Already have an account?
                        <button
                            onClick={() => onNavigate(View.LOGIN)}
                            className="ml-2 text-teal-500 dark:text-teal-300 font-black hover:underline"
                        >
                            Login
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;

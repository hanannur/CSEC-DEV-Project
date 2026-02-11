
import React, { useState, useEffect } from 'react';
import { View, User } from './types';
import LandingPage from './components/LandingPage';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ChatWidget from './components/ChatWidget';
import { Sun, Moon, LogIn, ShieldAlert, LogOut, User as UserIcon } from 'lucide-react';
import api from './services/api';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.LANDING);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/auth/me');
          setCurrentUser(response.data);
          // Removed auto-redirect to dashboard to keep landing page as default
        } catch (error) {
          localStorage.removeItem('token');
          setCurrentUser(null);
        }
      }
    };
    checkAuth();
  }, []);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    if ((user as any).token) {
      localStorage.setItem('token', (user as any).token);
    }
    setView(user.role === 'admin' ? View.ADMIN_DASHBOARD : View.STUDENT_DASHBOARD);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setView(View.LANDING);
  };

  const renderView = () => {
    switch (view) {
      case View.LANDING:
        return <LandingPage onNavigate={setView} />;
      case View.LOGIN:
        return <LoginPage onLogin={handleLoginSuccess} onNavigate={setView} />;
      case View.REGISTER:
        return <RegisterPage onLogin={handleLoginSuccess} onNavigate={setView} />;
      case View.STUDENT_DASHBOARD:
        return <StudentDashboard user={currentUser} />;
      case View.ADMIN_DASHBOARD:
        return <AdminDashboard user={currentUser} />;
      default:
        return <LandingPage onNavigate={setView} />;
    }
  };

  const isPortal = view === View.STUDENT_DASHBOARD || view === View.ADMIN_DASHBOARD;

  return (
    <div className="min-h-screen font-sans text-teal-900 dark:text-teal-50">
      <nav className="fixed top-0 left-0 right-0 z-50 glass h-20 flex items-center justify-between px-6 lg:px-16">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setView(View.LANDING)}
        >
          <div className="bg-white p-2 rounded-2xl group-hover:rotate-12 transition-all duration-300 shadow-md">
            <img src="/astuLogo.jpg" alt="ASTU Logo" className="w-10 h-10 object-contain" />
          </div>
          <span className="text-2xl font-bold font-display tracking-tight text-teal-900 dark:text-teal-50">
            ጀማሪ<span className="text-teal-500 italic">AI</span>
          </span>
        </div>

        <div className="flex items-center gap-4 lg:gap-10">
          <div className="hidden md:flex gap-8">
            <button
              onClick={() => setView(View.LANDING)}
              className={`hover:text-teal-500 transition-colors font-bold text-xs uppercase tracking-widest ${view === View.LANDING ? 'text-teal-500' : 'text-teal-400'}`}
            >
              Home
            </button>

            {currentUser && (
              <>
                {currentUser.role === 'student' && (
                  <button
                    onClick={() => setView(View.STUDENT_DASHBOARD)}
                    className={`hover:text-teal-500 transition-colors font-bold text-xs uppercase tracking-widest ${view === View.STUDENT_DASHBOARD ? 'text-teal-500 underline underline-offset-8' : 'text-teal-400'}`}
                  >
                    Student Portal
                  </button>
                )}
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => setView(View.ADMIN_DASHBOARD)}
                    className={`hover:text-teal-500 transition-colors font-bold text-xs uppercase tracking-widest flex items-center gap-2 ${view === View.ADMIN_DASHBOARD ? 'text-teal-500 underline underline-offset-8' : 'text-teal-400'}`}
                  >
                    <ShieldAlert size={14} />
                    Admin Hub
                  </button>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl hover:bg-teal-100 dark:hover:bg-teal-800 transition-colors text-teal-500"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {view === View.LOGIN || view === View.REGISTER ? (
              <button
                onClick={() => setView(View.LANDING)}
                className="text-teal-400 hover:text-teal-900 dark:hover:text-white font-black text-xs uppercase tracking-widest transition-all"
              >
                Back
              </button>
            ) : currentUser ? (
              <div className="flex items-center gap-4 pl-4 border-l border-teal-100 dark:border-teal-800">
                <div className="hidden lg:block text-right">
                  <p className="text-xs font-black text-teal-900 dark:text-teal-50">{currentUser.name}</p>
                  <p className="text-[8px] font-bold text-teal-400 uppercase tracking-widest">{currentUser.role}</p>
                </div>
                <img src={currentUser.avatar} className="w-10 h-10 rounded-xl object-cover border border-teal-100" alt="Avatar" />
                <button
                  onClick={handleLogout}
                  className="p-2.5 bg-teal-50 dark:bg-teal-900 text-teal-500 rounded-xl hover:bg-clay-50 hover:text-clay-500 transition-all"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setView(View.LOGIN)}
                className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2.5 rounded-2xl font-bold transition-all shadow-lg hover:shadow-teal-200 flex items-center gap-2"
              >
                <LogIn size={18} />
                Portal Login
              </button>
            ) /* Changed back logic and replaced isPortal check with currentUser check */}
          </div>
        </div>
      </nav>

      <main className="pt-20 min-h-screen">
        {renderView()}
      </main>

      {view === View.STUDENT_DASHBOARD && <ChatWidget />}
    </div>
  );
};

export default App;


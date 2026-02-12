import React, { useState, useEffect } from 'react';
import { User } from './types';
import LandingPage from './components/LandingPage';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ChatWidget from './components/ChatWidget';
import { Sun, Moon, LogIn, ShieldAlert, LogOut, User as UserIcon } from 'lucide-react';
import api from './services/api';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
    if (user.token) {
      localStorage.setItem('token', user.token);
    }
    navigate(user.role === 'admin' ? '/admin' : '/student');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen font-sans text-teal-900 dark:text-teal-50">
      <nav className="fixed top-0 left-0 right-0 z-50 glass h-20 flex items-center justify-between px-6 lg:px-16">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate('/')}
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
              onClick={() => navigate('/')}
              className={`hover:text-teal-500 transition-colors font-bold text-xs uppercase tracking-widest ${location.pathname === '/' ? 'text-teal-500' : 'text-teal-400'}`}
            >
              Home
            </button>

            {currentUser && (
              <>
                {currentUser.role === 'student' && (
                  <button
                    onClick={() => navigate('/student')}
                    className={`hover:text-teal-500 transition-colors font-bold text-xs uppercase tracking-widest ${location.pathname === '/student' ? 'text-teal-500 underline underline-offset-8' : 'text-teal-400'}`}
                  >
                    Student Portal
                  </button>
                )}
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => navigate('/admin')}
                    className={`hover:text-teal-500 transition-colors font-bold text-xs uppercase tracking-widest flex items-center gap-2 ${location.pathname === '/admin' ? 'text-teal-500 underline underline-offset-8' : 'text-teal-400'}`}
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

            {location.pathname === '/login' || location.pathname === '/register' ? (
              <button
                onClick={() => navigate('/')}
                className="text-teal-400 hover:text-teal-900 dark:hover:text-white font-black text-xs uppercase tracking-widest transition-all"
              >
                Back
              </button>
            ) : currentUser ? (
              <div className="flex items-center gap-4 pl-4 border-l border-teal-100 dark:border-teal-800">
                <div className="hidden lg:block text-right">
                  <p className="text-xs font-black text-teal-900 dark:text-teal-50">{currentUser.name}</p>
                  <p className="text-teal-400 text-[10px] uppercase font-bold tracking-widest">{currentUser.role}</p>
                </div>
                <div className="w-10 h-10 rounded-full border border-teal-100 bg-teal-50 dark:bg-teal-900 flex items-center justify-center text-teal-500">
                  <UserIcon size={20} />
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2.5 bg-teal-50 dark:bg-teal-900 text-teal-500 rounded-xl hover:bg-clay-50 hover:text-clay-500 transition-all"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2.5 rounded-2xl font-bold transition-all shadow-lg hover:shadow-teal-200 flex items-center gap-2"
              >
                <LogIn size={18} />
                Portal Login
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-20 min-h-screen">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage onLogin={handleLoginSuccess} />} />
          <Route path="/register" element={<RegisterPage onLogin={handleLoginSuccess} />} />
          <Route
            path="/student"
            element={currentUser ? <StudentDashboard user={currentUser} /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin"
            element={currentUser ? <AdminDashboard user={currentUser} /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {location.pathname === '/student' && <ChatWidget />}
    </div>
  );
};

export default App;


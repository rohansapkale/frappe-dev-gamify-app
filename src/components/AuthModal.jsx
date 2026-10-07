import React, { useState } from 'react';
import { 
  X, 
  User, 
  LogIn, 
  UserPlus, 
  Shield, 
  Sparkles, 
  Key, 
  Mail,
  Lock,
  Briefcase, 
  CheckCircle2, 
  AlertCircle,
  LogOut
} from 'lucide-react';
import { authStorage } from '../utils/authStorage';
import { sounds } from '../utils/soundEffects';
import { triggerConfetti } from '../utils/confettiHelper';
import { useTheme } from '../context/ThemeContext';

const AVATARS = ['👨‍💻', '👩‍💻', '🧙‍♂️', '⚡', '🚀', '🛡️', '🎯', '👑', '🤖'];
const ROLES = ['Frappe Developer', 'ERPNext Architect', 'System Manager', 'Full-Stack Frappe Engineer'];
const SPECIALIZATIONS = [
  'Custom App Architecture',
  'Desk UI & Client Scripts',
  'Accounts & GL Engines',
  'Server Controllers & Hooks',
  'REST APIs & Background Jobs'
];

export default function AuthModal({ currentUser, onLoginSuccess, onLogout, onClose }) {
  const { isDark } = useTheme();
  const [tab, setTab] = useState('switch'); // 'switch' | 'login' | 'signup' | 'google'
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(ROLES[0]);
  const [specialization, setSpecialization] = useState(SPECIALIZATIONS[0]);
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [error, setError] = useState(null);

  // Google modal inputs
  const [googleEmail, setGoogleEmail] = useState(currentUser?.email || 'developer@gmail.com');
  const [googleName, setGoogleName] = useState(currentUser?.name || 'Frappe Enthusiast');

  const allUsers = authStorage.getAllUsers();

  const handleLogin = (e) => {
    e?.preventDefault();
    setError(null);
    if (!identifier.trim()) {
      setError('Please enter your username or email address.');
      return;
    }

    const res = authStorage.login(identifier, password);
    if (res.success) {
      sounds.playSuccess();
      onLoginSuccess(res.user);
      onClose();
    } else {
      sounds.playError();
      setError(res.message);
    }
  };

  const handleSignup = (e) => {
    e?.preventDefault();
    setError(null);
    if (!identifier.trim()) {
      setError('Username is required.');
      return;
    }

    const res = authStorage.signup({
      username: identifier,
      email: email,
      password: password,
      name: name || identifier,
      role,
      specialization,
      avatar
    });

    if (res.success) {
      sounds.playLevelUp();
      triggerConfetti();
      onLoginSuccess(res.user);
      onClose();
    } else {
      sounds.playError();
      setError(res.message);
    }
  };

  const handleGoogleAuth = () => {
    sounds.playSuccess();
    const res = authStorage.loginWithGoogle({
      email: googleEmail,
      name: googleName,
      avatar: '🌐',
      googleId: `g_${Date.now()}`
    });

    triggerConfetti();
    onLoginSuccess(res.user);
    onClose();
  };

  const handleQuickSwitch = (user) => {
    sounds.playClick();
    const res = authStorage.login(user.username, user.password || '');
    if (res.success) {
      onLoginSuccess(res.user);
      onClose();
    }
  };

  const handleLogoutAction = () => {
    sounds.playClick();
    if (onLogout) {
      onLogout();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className={`border rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-slide-down transition-colors ${
        isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900 shadow-slate-300/60'
      }`}>
        
        {/* Modal Header */}
        <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl border flex items-center justify-center text-lg ${
              isDark ? 'bg-blue-600/20 text-blue-400 border-blue-500/30' : 'bg-blue-50 text-blue-600 border-blue-200'
            }`}>
              {currentUser?.avatar || '👤'}
            </div>
            <div>
              <h3 className={`text-sm font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                {currentUser ? `Developer Profile: ${currentUser.name}` : 'Developer Account'}
              </h3>
              <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {currentUser?.role} • Lvl {currentUser?.level || 1}
              </p>
            </div>
          </div>

          <button
            onClick={() => { sounds.playClick(); onClose(); }}
            className={`p-1 rounded-lg cursor-pointer transition-colors ${
              isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className={`flex rounded-xl p-1 border text-xs font-semibold ${
          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
        }`}>
          <button
            onClick={() => { sounds.playClick(); setTab('switch'); setError(null); }}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              tab === 'switch' ? 'bg-blue-600 text-white shadow' : (isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900')
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Switch</span>
          </button>
          <button
            onClick={() => { sounds.playClick(); setTab('login'); setError(null); }}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              tab === 'login' ? 'bg-blue-600 text-white shadow' : (isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900')
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            onClick={() => { sounds.playClick(); setTab('signup'); setError(null); }}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              tab === 'signup' ? 'bg-blue-600 text-white shadow' : (isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900')
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register</span>
          </button>
        </div>

        {/* Google Quick Sign-In Option */}
        <button
          type="button"
          onClick={() => { sounds.playClick(); setTab('google'); }}
          className={`w-full py-2 px-3 font-bold text-xs rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-sm border cursor-pointer ${
            isDark 
              ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700' 
              : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300'
          }`}
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Continue with Google</span>
        </button>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Tab: Google Details */}
        {tab === 'google' && (
          <div className={`space-y-3 p-3 border rounded-2xl ${
            isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className={`text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Google Developer Authorization</div>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Google Display Name"
                value={googleName}
                onChange={(e) => setGoogleName(e.target.value)}
                className={`w-full rounded-lg px-3 py-1.5 text-xs border ${
                  isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
              <input
                type="email"
                placeholder="Google Email (e.g. dev@gmail.com)"
                value={googleEmail}
                onChange={(e) => setGoogleEmail(e.target.value)}
                className={`w-full rounded-lg px-3 py-1.5 text-xs border ${
                  isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>
            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer"
            >
              Sign In with Google
            </button>
          </div>
        )}

        {/* Tab 1: Sign In */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-3">
            <div className="space-y-1">
              <label className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Username or Email</label>
              <input
                type="text"
                placeholder="e.g. rohan_frappe or rohan@frappe.io"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className={`w-full rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500 border ${
                  isDark ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div className="space-y-1">
              <label className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500 border ${
                  isDark ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/25 transition-all mt-2 cursor-pointer"
            >
              Sign In to FrappeQuest
            </button>
          </form>
        )}

        {/* Tab 2: Register */}
        {tab === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-3">
            <div className="space-y-1">
              <label className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Select Avatar</label>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {AVATARS.map(av => (
                  <button
                    type="button"
                    key={av}
                    onClick={() => { sounds.playClick(); setAvatar(av); }}
                    className={`w-9 h-9 text-lg rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
                      avatar === av ? 'border-blue-500 bg-blue-500/20 scale-110' : (isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-100')
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Username *</label>
                <input
                  type="text"
                  placeholder="e.g. dev_ankit"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className={`w-full rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500 border ${
                    isDark ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>
              <div className="space-y-1">
                <label className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ankit Verma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500 border ${
                    isDark ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Email</label>
                <input
                  type="email"
                  placeholder="dev@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500 border ${
                    isDark ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>
              <div className="space-y-1">
                <label className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500 border ${
                    isDark ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Frappe / ERPNext Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={`w-full rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500 border cursor-pointer ${
                  isDark ? 'bg-slate-950 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                {ROLES.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/25 transition-all mt-2 cursor-pointer"
            >
              Register & Start Ranking
            </button>
          </form>
        )}

        {/* Tab 3: Quick Profiles */}
        {tab === 'switch' && (
          <div className="space-y-2">
            <span className={`text-[11px] block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Switch immediately between pre-configured community profiles:
            </span>
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {allUsers.map(u => {
                const isActive = currentUser && u.id === currentUser.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => handleQuickSwitch(u)}
                    className={`w-full text-left p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                      isActive 
                        ? (isDark ? 'bg-blue-600/20 border-blue-500 text-blue-200' : 'bg-blue-50 border-blue-500 text-blue-900 font-semibold')
                        : (isDark ? 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700')
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{u.avatar}</span>
                      <div>
                        <div className={`text-xs font-bold flex items-center gap-1.5 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                          <span>{u.name}</span>
                          <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>(@{u.username})</span>
                        </div>
                        <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {u.role} • <span className="text-purple-500 font-semibold">{u.xp} XP</span>
                        </div>
                      </div>
                    </div>

                    {isActive && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white font-bold text-[9px] uppercase">
                        Active
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Logout Option */}
            {currentUser && (
              <div className={`pt-2 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <button
                  type="button"
                  onClick={handleLogoutAction}
                  className="w-full py-2 px-3 rounded-xl bg-red-950/30 hover:bg-red-900/40 border border-red-500/30 text-red-400 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out of Session</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

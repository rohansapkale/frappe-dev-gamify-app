import React, { useState } from 'react';
import { 
  X, 
  User, 
  LogIn, 
  UserPlus, 
  Shield, 
  Sparkles, 
  Key, 
  Briefcase, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { authStorage } from '../utils/authStorage';
import { sounds } from '../utils/soundEffects';

const AVATARS = ['👨‍💻', '👩‍💻', '🧙‍♂️', '⚡', '🚀', '🛡️', '🎯', '👑'];
const ROLES = ['Frappe Developer', 'ERPNext Architect', 'System Manager', 'Full-Stack Engineer'];
const SPECIALIZATIONS = [
  'Custom App Architecture',
  'Accounts & GL Engines',
  'Desk UI & Client Scripts',
  'Security & Whitelisting',
  'Stock & Manufacturing Workflows'
];

export default function AuthModal({ currentUser, onLoginSuccess, onClose }) {
  const [tab, setTab] = useState('login'); // 'login' | 'signup' | 'switch'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState(ROLES[0]);
  const [specialization, setSpecialization] = useState(SPECIALIZATIONS[0]);
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [error, setError] = useState(null);

  const allUsers = authStorage.getAllUsers();

  const handleLogin = (e) => {
    e?.preventDefault();
    setError(null);
    if (!username.trim()) {
      setError('Please enter your username');
      return;
    }

    const res = authStorage.login(username, password);
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
    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    const res = authStorage.signup({
      username,
      name: name || username,
      role,
      specialization,
      avatar
    });

    if (res.success) {
      sounds.playLevelUp();
      onLoginSuccess(res.user);
      onClose();
    } else {
      sounds.playError();
      setError(res.message);
    }
  };

  const handleQuickSwitch = (user) => {
    sounds.playClick();
    const res = authStorage.login(user.username, '');
    if (res.success) {
      onLoginSuccess(res.user);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-slide-down">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                {tab === 'login' ? 'Developer Sign In' : tab === 'signup' ? 'Create Developer Profile' : 'Switch Active Profile'}
              </h3>
              <p className="text-[11px] text-slate-400">Track your individual XP, rank, and daily streak</p>
            </div>
          </div>

          <button
            onClick={() => { sounds.playClick(); onClose(); }}
            className="p-1 text-slate-400 hover:text-slate-200 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => { sounds.playClick(); setTab('login'); setError(null); }}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              tab === 'login' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            onClick={() => { sounds.playClick(); setTab('signup'); setError(null); }}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              tab === 'signup' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register</span>
          </button>
          <button
            onClick={() => { sounds.playClick(); setTab('switch'); setError(null); }}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              tab === 'switch' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Quick Profiles</span>
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Tab 1: Sign In */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-medium">Username</label>
              <input
                type="text"
                placeholder="e.g. rohan_frappe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-medium">Password (Optional in Sandbox)</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/25 transition-all mt-2"
            >
              Sign In to FrappeQuest
            </button>
          </form>
        )}

        {/* Tab 2: Register */}
        {tab === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-medium">Select Avatar</label>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {AVATARS.map(av => (
                  <button
                    type="button"
                    key={av}
                    onClick={() => { sounds.playClick(); setAvatar(av); }}
                    className={`w-9 h-9 text-lg rounded-xl flex items-center justify-center border transition-all ${
                      avatar === av ? 'border-blue-500 bg-blue-500/20 scale-110' : 'border-slate-800 bg-slate-950'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Username *</label>
                <input
                  type="text"
                  placeholder="e.g. dev_ankit"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ankit Verma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-medium">Frappe / ERPNext Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                {ROLES.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-medium">Domain Specialization</label>
              <select
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                {SPECIALIZATIONS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/25 transition-all mt-2"
            >
              Register & Start Ranking
            </button>
          </form>
        )}

        {/* Tab 3: Quick Profiles */}
        {tab === 'switch' && (
          <div className="space-y-2">
            <span className="text-[11px] text-slate-400 block mb-1">
              Switch immediately between pre-configured community profiles to test rankings:
            </span>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {allUsers.map(u => {
                const isActive = u.id === currentUser.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => handleQuickSwitch(u)}
                    className={`w-full text-left p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                      isActive 
                        ? 'bg-blue-600/20 border-blue-500 text-blue-200' 
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{u.avatar}</span>
                      <div>
                        <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                          <span>{u.name}</span>
                          <span className="text-[10px] text-slate-400">(@{u.username})</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {u.role} • <span className="text-purple-400 font-semibold">{u.xp} XP</span>
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
          </div>
        )}
      </div>
    </div>
  );
}

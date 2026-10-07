import React, { useState } from 'react';
import { 
  User, 
  LogIn, 
  UserPlus, 
  Shield, 
  Sparkles, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Compass, 
  Trophy, 
  Zap, 
  Flame,
  Brain,
  Code2,
  Sun,
  Moon,
  Loader2,
  ExternalLink,
  HelpCircle,
  Check,
  KeyRound
} from 'lucide-react';
import { authStorage } from '../utils/authStorage';
import { sounds } from '../utils/soundEffects';
import { triggerConfetti } from '../utils/confettiHelper';
import { useTheme } from '../context/ThemeContext';
import { getGoogleClientId, saveGoogleClientId, launchGoogleOAuthPopup } from '../utils/googleAuth';
import UserAvatar from './UserAvatar';

const AVATARS = ['👨‍💻', '👩‍💻', '🧙‍♂️', '⚡', '🚀', '🛡️', '🎯', '👑', '🤖'];
const ROLES = [
  'Frappe Developer', 
  'ERPNext Architect', 
  'System Manager', 
  'Full-Stack Frappe Engineer'
];
const SPECIALIZATIONS = [
  'Custom App Architecture',
  'Desk UI & Client Scripts',
  'Accounts & GL Engines',
  'Server Controllers & Hooks',
  'REST APIs & Background Jobs'
];

export default function AuthGateway({ onAuthSuccess }) {
  const { theme, toggleTheme, isDark } = useTheme();
  const [tab, setTab] = useState('login'); // 'login' | 'signup' | 'profiles'
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Login State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register State
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupRole, setSignupRole] = useState(ROLES[0]);
  const [signupSpecialization, setSignupSpecialization] = useState(SPECIALIZATIONS[0]);
  const [signupAvatar, setSignupAvatar] = useState(AVATARS[0]);

  // Real Google Sign-in State
  const [googleClientIdInput, setGoogleClientIdInput] = useState(() => getGoogleClientId());
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState(null);
  const [showSetupGuide, setShowSetupGuide] = useState(false);

  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const allUsers = authStorage.getAllUsers();

  // 1. Handle Standard Login
  const handleLoginSubmit = (e) => {
    e?.preventDefault();
    setError(null);

    if (!loginIdentifier.trim()) {
      sounds.playError();
      setError('Please enter your username or email address.');
      return;
    }

    const res = authStorage.login(loginIdentifier, loginPassword);
    if (res.success) {
      sounds.playSuccess();
      triggerConfetti();
      onAuthSuccess(res.user);
    } else {
      sounds.playError();
      setError(res.message);
    }
  };

  // 2. Handle Register
  const handleSignupSubmit = (e) => {
    e?.preventDefault();
    setError(null);

    if (!signupUsername.trim()) {
      sounds.playError();
      setError('Please provide a unique username.');
      return;
    }

    if (!signupPassword.trim() || signupPassword.length < 4) {
      sounds.playError();
      setError('Password must be at least 4 characters long.');
      return;
    }

    const res = authStorage.signup({
      username: signupUsername,
      email: signupEmail,
      password: signupPassword,
      name: signupName,
      role: signupRole,
      specialization: signupSpecialization,
      avatar: signupAvatar
    });

    if (res.success) {
      sounds.playLevelUp();
      triggerConfetti();
      onAuthSuccess(res.user);
    } else {
      sounds.playError();
      setError(res.message);
    }
  };

  // 3. Real Google Identity Services (GIS) & OAuth 2.0 Flow
  const handleContinueWithGoogle = async () => {
    setError(null);
    setGoogleError(null);
    sounds.playClick();

    const activeClientId = getGoogleClientId();
    if (!activeClientId) {
      // Prompt user to provide Client ID or 1-click test with verified Google account
      setShowGoogleModal(true);
      return;
    }

    setIsGoogleLoading(true);
    try {
      const result = await launchGoogleOAuthPopup(activeClientId);
      setIsGoogleLoading(false);

      if (result.success && result.user) {
        sounds.playSuccess();
        triggerConfetti();
        const res = authStorage.loginWithGoogle(result.user);
        onAuthSuccess(res.user);
      } else if (result.needConfig) {
        setShowGoogleModal(true);
      } else {
        sounds.playError();
        setError(result.error || 'Google authentication was closed or could not be completed.');
      }
    } catch (err) {
      setIsGoogleLoading(false);
      sounds.playError();
      setError(err?.message || 'Google authentication encountered an error.');
    }
  };

  const handleSaveAndLaunchGoogleOAuth = async (e) => {
    e?.preventDefault();
    setGoogleError(null);

    const cleanClientId = (googleClientIdInput || '').trim();
    if (!cleanClientId) {
      setGoogleError('Please enter a valid Google OAuth Client ID.');
      sounds.playError();
      return;
    }

    saveGoogleClientId(cleanClientId);
    setIsGoogleLoading(true);

    try {
      const result = await launchGoogleOAuthPopup(cleanClientId);
      setIsGoogleLoading(false);

      if (result.success && result.user) {
        sounds.playSuccess();
        triggerConfetti();
        setShowGoogleModal(false);
        const res = authStorage.loginWithGoogle(result.user);
        onAuthSuccess(res.user);
      } else {
        sounds.playError();
        setGoogleError(result.error || 'Google authentication window was closed or origin was unauthorized.');
      }
    } catch (err) {
      setIsGoogleLoading(false);
      sounds.playError();
      setGoogleError(err?.message || 'Failed to authenticate with Google.');
    }
  };

  const handleVerifiedDemoGoogleAuth = () => {
    sounds.playSuccess();
    triggerConfetti();
    setShowGoogleModal(false);
    const res = authStorage.loginWithGoogle({
      email: 'rohan.sapkale@gmail.com',
      name: 'Rohan Sapkale',
      avatar: '👨‍💻',
      googleId: 'google-rohan-sapkale-verified'
    });
    onAuthSuccess(res.user);
  };

  // 4. Handle Demo / Guest Access
  const handleGuestAccess = () => {
    sounds.playClick();
    const guestUser = authStorage.loginAsGuest();
    triggerConfetti();
    onAuthSuccess(guestUser);
  };

  // 5. Handle Community Profile Click
  const handleSelectPreseededProfile = (user) => {
    sounds.playClick();
    const res = authStorage.login(user.username, user.password || '');
    if (res.success) {
      triggerConfetti();
      onAuthSuccess(res.user);
    }
  };

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden selection:bg-blue-600 selection:text-white">
      {/* Top Floating Theme Switcher */}
      <div className="absolute top-4 right-4 z-30">
        <button
          type="button"
          onClick={toggleTheme}
          className="px-3 py-1.5 rounded-xl border border-slate-700/80 bg-slate-900/80 backdrop-blur-md text-slate-300 hover:text-white shadow-lg transition-all flex items-center gap-2 cursor-pointer group text-xs font-semibold"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? (
            <>
              <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-indigo-400 group-hover:-rotate-12 transition-transform" />
              <span>Dark Mode</span>
            </>
          )}
        </button>
      </div>

      {/* Background Ambience & Cyber Grid Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.18),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Brand Hero & Value Proposition */}
        <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Next-Gen Frappe Framework Training</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 shadow-xl shadow-blue-500/30 border border-blue-400/40 flex items-center justify-center text-white font-black text-2xl">
                F
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-300 via-indigo-200 to-purple-300 bg-clip-text text-transparent">
                FrappeQuest
              </h1>
            </div>
            <p className="text-sm text-slate-300 font-medium">
              The Gamified ERPNext Developer RPG & Virtual Desk Simulator
            </p>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Create your developer profile to unlock interactive Frappe Desk missions, run real client & server scripts, level up your Developer Rank, and master the Frappe ecosystem.
          </p>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5 pt-2">
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <Code2 className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-200">Interactive Desk Sandbox</div>
                <div className="text-[11px] text-slate-400">Live Monaco editor with virtual form preview</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                <Brain className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-200">Dr. Frappe AI Companion</div>
                <div className="text-[11px] text-slate-400">Intelligent code analysis & IQ growth metrics</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <Trophy className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-200">RPG Career Progression</div>
                <div className="text-[11px] text-slate-400">From Desk Newbie to Frappe Grandmaster</div>
              </div>
            </div>
          </div>

          {/* Instant Guest / Explorer Button */}
          <div className="pt-2">
            <button
              onClick={handleGuestAccess}
              className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-blue-300 transition-colors group cursor-pointer"
            >
              <Compass className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
              <span>Just browsing? <strong className="underline underline-offset-2 text-slate-200 group-hover:text-blue-300">Explore as Guest Developer</strong></span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right Column: Authentication Card */}
        <div className="lg:col-span-7">
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-blue-950/50 backdrop-blur-xl relative">
            
            {/* Top Navigation Tabs */}
            <div className="flex rounded-2xl bg-slate-950/80 p-1 border border-slate-800 mb-6 text-xs font-semibold">
              <button
                type="button"
                onClick={() => { sounds.playClick(); setTab('login'); setError(null); }}
                className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-2 ${
                  tab === 'login' 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => { sounds.playClick(); setTab('signup'); setError(null); }}
                className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-2 ${
                  tab === 'signup' 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register</span>
              </button>

              <button
                type="button"
                onClick={() => { sounds.playClick(); setTab('profiles'); setError(null); }}
                className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-2 ${
                  tab === 'profiles' 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Quick Profiles</span>
              </button>
            </div>

            {/* Error Message Alert */}
            {error && (
              <div className="mb-5 p-3 rounded-xl bg-red-950/50 border border-red-500/50 text-red-300 text-xs flex items-center gap-2.5 animate-slide-down">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Universal "Continue with Google" Button */}
            {tab !== 'profiles' && (
              <div className="space-y-4 mb-6">
                <button
                  type="button"
                  disabled={isGoogleLoading}
                  onClick={handleContinueWithGoogle}
                  className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-white/5 transition-all hover:scale-[1.01] active:scale-[0.99] border border-slate-200 cursor-pointer disabled:opacity-75 disabled:cursor-wait"
                >
                  {isGoogleLoading ? (
                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                  ) : (
                    /* Google SVG Icon */
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  )}
                  <span>{isGoogleLoading ? 'Connecting to Google Accounts...' : 'Continue with Google'}</span>
                </button>

                <div className="relative flex items-center justify-center">
                  <div className="border-t border-slate-800 w-full" />
                  <span className="bg-slate-900 px-3 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                    Or with credentials
                  </span>
                  <div className="border-t border-slate-800 w-full" />
                </div>
              </div>
            )}

            {/* TAB 1: SIGN IN */}
            {tab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    <span>Username or Email</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. rohan_frappe or rohan@frappe.io"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-blue-400" />
                      <span>Password</span>
                    </label>
                    <span className="text-[10px] text-slate-400">Demo pwd: password123</span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In & Enter Frappe Desk</span>
                </button>
              </form>
            )}

            {/* TAB 2: REGISTER */}
            {tab === 'signup' && (
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                {/* Avatar Picker */}
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">Choose Developer Avatar</label>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {AVATARS.map(av => (
                      <button
                        type="button"
                        key={av}
                        onClick={() => { sounds.playClick(); setSignupAvatar(av); }}
                        className={`w-9 h-9 text-lg rounded-xl flex items-center justify-center border transition-all ${
                          signupAvatar === av 
                            ? 'border-blue-500 bg-blue-500/20 scale-110 shadow-sm shadow-blue-500/30' 
                            : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                        }`}
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Username & Full Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-300 font-medium">Username *</label>
                    <input
                      type="text"
                      placeholder="e.g. rohan_frappe"
                      value={signupUsername}
                      onChange={(e) => setSignupUsername(e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-300 font-medium">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Rohan Sapkale"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Email & Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-300 font-medium">Email Address</label>
                    <input
                      type="email"
                      placeholder="dev@example.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-300 font-medium">Password *</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Role & Specialization */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-300 font-medium">Frappe / ERPNext Role</label>
                    <select
                      value={signupRole}
                      onChange={(e) => setSignupRole(e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                    >
                      {ROLES.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-300 font-medium">Domain Specialization</label>
                    <select
                      value={signupSpecialization}
                      onChange={(e) => setSignupSpecialization(e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                    >
                      {SPECIALIZATIONS.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Create Developer Profile & Begin Quest</span>
                </button>
              </form>
            )}

            {/* TAB 3: QUICK PROFILES */}
            {tab === 'profiles' && (
              <div className="space-y-3">
                <span className="text-xs text-slate-400 block mb-2">
                  Jump right into action using pre-configured developer ranks & progress:
                </span>
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {allUsers.map(u => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleSelectPreseededProfile(u)}
                      className="w-full text-left p-3 rounded-2xl border border-slate-800 bg-slate-950/80 hover:border-blue-500/60 hover:bg-slate-800/50 flex items-center justify-between transition-all group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="p-1 bg-slate-900 rounded-xl border border-slate-800 group-hover:scale-105 transition-transform flex items-center justify-center">
                          <UserAvatar avatar={u.avatar} size="sm" />
                        </span>
                        <div>
                          <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                            <span>{u.name}</span>
                            <span className="text-[10px] text-slate-400">(@{u.username})</span>
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {u.role} • <span className="text-purple-400 font-semibold">{u.xp} XP</span> • <span className="text-blue-400">{u.rankTitle}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 group-hover:translate-x-1 transition-transform">
                        <span>Select</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Real Google Identity Services (GIS) & OAuth 2.0 Setup / Authorization Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl shadow-blue-900/40 animate-slide-down relative text-slate-100 my-8">
            
            {/* Modal Header */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-white flex items-center justify-center shadow-lg shadow-white/10 border border-slate-200">
                <svg className="w-7 h-7" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-100">
                Connect Real Google Account
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sign in with your genuine Google account via official Google Identity Services & OAuth 2.0.
              </p>
            </div>

            {/* Error Notification */}
            {googleError && (
              <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/50 text-red-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{googleError}</span>
              </div>
            )}

            {/* Client ID Configuration Form */}
            <form onSubmit={handleSaveAndLaunchGoogleOAuth} className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-blue-400" />
                    <span>Google OAuth Client ID</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowSetupGuide(!showSetupGuide)}
                    className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                  >
                    <HelpCircle className="w-3 h-3" />
                    <span>{showSetupGuide ? 'Hide guide' : 'Setup guide (60s)'}</span>
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="e.g. 123456789-abcdefg.apps.googleusercontent.com"
                  value={googleClientIdInput}
                  onChange={(e) => setGoogleClientIdInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />

                {/* Collapsible Google Cloud setup instructions */}
                {showSetupGuide && (
                  <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-800/40 text-[11px] text-slate-300 space-y-2 animate-slide-down">
                    <div className="font-semibold text-blue-300">Quick Google Cloud Setup:</div>
                    <ol className="list-decimal pl-4 space-y-1 text-slate-400">
                      <li>Visit <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer" className="text-blue-400 underline inline-flex items-center gap-0.5">Google Cloud Console <ExternalLink className="w-2.5 h-2.5" /></a></li>
                      <li>Click <strong>Create Credentials &gt; OAuth client ID</strong> (Web application).</li>
                      <li>In <strong>Authorized JavaScript origins</strong>, add:</li>
                    </ol>
                    <div className="bg-slate-950 p-2 rounded-lg font-mono text-[10px] text-slate-300 space-y-1">
                      <div>http://localhost:5173</div>
                      <div>https://frappe-dev-gamify-app.vercel.app</div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isGoogleLoading}
                  className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-wait"
                >
                  {isGoogleLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Opening Google Accounts Picker...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save & Open Real Google Sign-In</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Instant Verified Account Fallback (never blocks the user) */}
            <div className="space-y-2 pt-1 border-t border-slate-800">
              <span className="text-[11px] text-slate-400 block text-center">
                Need to test immediately without configuring Google Cloud?
              </span>
              <button
                type="button"
                onClick={handleVerifiedDemoGoogleAuth}
                className="w-full py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>⚡ Continue with Verified Google Account (Rohan Sapkale)</span>
              </button>
            </div>

            {/* Close Button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => { setShowGoogleModal(false); setGoogleError(null); }}
                className="w-full py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

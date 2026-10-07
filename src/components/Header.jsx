import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Flame, 
  Coins, 
  Trophy, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  Terminal, 
  HelpCircle, 
  GitBranch, 
  Layers,
  RotateCcw,
  User,
  LogOut,
  ChevronDown,
  Target,
  Zap,
  Bot,
  Brain,
  Sun,
  Moon
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { agentBrain } from '../utils/agentBrain';
import { useTheme } from '../context/ThemeContext';

export default function Header({
  currentUser,
  userStats,
  currentMode,
  setCurrentMode,
  soundEnabled,
  setSoundEnabled,
  onOpenAchievements,
  onOpenAuthModal,
  onLogout,
  onResetProgress
}) {
  const { xp, level, rank, coins, streak, completedQuests } = userStats;
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [agentIq, setAgentIq] = useState(() => agentBrain.getState()?.iq || 105);
  const { theme, toggleTheme, isDark } = useTheme();

  useEffect(() => {
    const unsub = agentBrain.subscribe(st => {
      if (st?.iq) setAgentIq(st.iq);
    });
    return unsub;
  }, []);

  const xpCurrentLevel = xp - (rank.minXp || 0);
  const nextRankMin = rank.nextMinXp || (rank.minXp + 400);
  const xpNeeded = nextRankMin - (rank.minXp || 0);
  const progressPercent = Math.min(100, Math.max(0, Math.round((xpCurrentLevel / xpNeeded) * 100)));

  const handleToggleSound = () => {
    const newState = sounds.toggleSound();
    setSoundEnabled(newState);
  };

  const navItems = [
    { id: 'quests', label: 'Quest Line & Drills', icon: Layers, count: completedQuests.length },
    { id: 'agent', label: 'AI Mentor & IQ Journey', icon: Bot, isHighlight: true, badge: `${agentIq} IQ` },
    { id: 'quiz', label: 'Daily 10-MCQ Bug Hunt', icon: HelpCircle },
    { id: 'leaderboard', label: 'Global Leaderboard', icon: Trophy },
    { id: 'sandbox', label: 'Desk Sandbox', icon: Terminal },
    { id: 'docs', label: 'API Pulse & Docs', icon: BookOpen },
    { id: 'tree', label: 'Skill Tree RPG', icon: GitBranch },
  ];



  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b px-4 lg:px-8 py-3 transition-colors ${
      isDark ? 'bg-slate-950/90 border-slate-800/80 text-white' : 'bg-white/95 border-slate-200 shadow-xs text-slate-800'
    }`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand Logo & User Profile Badge */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 shadow-lg shadow-blue-500/25 border border-blue-400/30">
            <span className="font-extrabold text-white text-lg tracking-wider">F</span>
            <div className={`absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 animate-pulse ${
              isDark ? 'border-slate-950' : 'border-white'
            }`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                FrappeQuest
              </h1>
              <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full border ${
                isDark ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}>
                ERPNext Dev RPG
              </span>
            </div>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Master Frappe Desk, Client Scripts & Server Controllers</p>
          </div>
        </div>

        {/* Gamification & User Profile Hub */}
        <div className={`flex items-center flex-wrap gap-2 md:gap-3 border px-3 py-1.5 rounded-2xl shadow-inner transition-colors ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          
          {/* User Profile Selector Pill */}
          <div className={`relative pr-2 border-r ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <button
              onClick={() => { sounds.playClick(); setProfileDropdown(!profileDropdown); }}
              className={`flex items-center gap-2 p-1 rounded-xl transition-colors text-left cursor-pointer ${
                isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-200/60'
              }`}
              title="Click to manage profile or sign out"
            >
              <div className="relative">
                <span className="text-2xl">{currentUser?.avatar || '👨‍💻'}</span>
                {currentUser?.authProvider === 'google' && (
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-[9px] font-bold text-blue-600">G</span>
                  </span>
                )}
              </div>
              <div className="hidden sm:block">
                <div className={`text-xs font-bold flex items-center gap-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  <span>{currentUser?.name || 'Developer'}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${profileDropdown ? 'rotate-180' : ''} ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                </div>
                <div className="text-[10px] text-blue-500 font-semibold">{currentUser?.role || 'Frappe Dev'}</div>
              </div>
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdown && (
              <div className={`absolute left-0 top-full mt-2 w-56 border rounded-2xl p-2 shadow-2xl z-50 animate-slide-down ${
                isDark ? 'bg-slate-900 border-slate-700/80 shadow-slate-950/80' : 'bg-white border-slate-200 shadow-slate-300/40'
              }`}>
                <div className={`p-2.5 rounded-xl mb-1.5 border ${
                  isDark ? 'bg-slate-950/60 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}>
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <span>{currentUser?.name}</span>
                    {currentUser?.authProvider === 'google' && (
                      <span className="px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-500 text-[9px] font-bold border border-blue-500/30">
                        Google
                      </span>
                    )}
                  </div>
                  <div className={`text-[10px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>@{currentUser?.username || 'dev'}</div>
                  <div className="text-[10px] text-purple-500 font-semibold mt-1">
                    {rank.title} • {xp} XP
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setProfileDropdown(false);
                    onOpenAuthModal();
                  }}
                  className={`w-full text-left p-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                    isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-blue-500" />
                  <span>Switch Account / Manage</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setProfileDropdown(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full text-left p-2 rounded-xl text-xs font-semibold text-red-500 hover:text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors cursor-pointer mt-1"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-500" />
                  <span>Log Out of Session</span>
                </button>
              </div>
            )}
          </div>

          {/* Level & Rank Progress */}
          <div className={`flex items-center gap-2 pr-2 border-r ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <span className="text-xl" title={rank.title}>{rank.icon}</span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Lvl {level}</span>
                <span className="text-[11px] font-semibold text-purple-500">{rank.title}</span>
              </div>
              <div className={`w-20 md:w-24 h-1.5 rounded-full overflow-hidden mt-0.5 ${
                isDark ? 'bg-slate-800' : 'bg-slate-200'
              }`}>
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* XP */}
          <div className="flex items-center gap-1.5 px-1.5" title="Experience Points">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{xp}</span>
            <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>XP</span>
          </div>

          {/* Streak */}
          <div className="flex items-center gap-1.5 px-1.5" title="Daily Active Streak">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500/30" />
            <span className="text-xs font-bold text-amber-500">{streak}</span>
            <span className={`text-[10px] hidden sm:inline ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Days</span>
          </div>

          {/* Coins */}
          <div className="flex items-center gap-1.5 px-1.5" title="Frappe Coins">
            <Coins className="w-4 h-4 text-yellow-500" />
            <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400">{coins}</span>
          </div>

          {/* Frappe Dev IQ */}
          <button
            onClick={() => { sounds.playClick(); setCurrentMode('agent'); }}
            className={`flex items-center gap-1.5 px-2.5 py-1 border rounded-lg text-xs font-bold transition-all hover:scale-105 cursor-pointer ${
              isDark 
                ? 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border-blue-500/30' 
                : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'
            }`}
            title="Dr. Frappe Developer IQ Matrix & Career Journey"
          >
            <Brain className="w-3.5 h-3.5 text-blue-500" />
            <span>{agentIq} IQ</span>
          </button>

          {/* Trophy / Badges Button */}
          <button
            onClick={() => { sounds.playClick(); onOpenAchievements(); }}
            className={`flex items-center gap-1 px-2.5 py-1 border rounded-lg text-xs font-semibold transition-all hover:scale-105 cursor-pointer ${
              isDark 
                ? 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border-purple-500/30' 
                : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-purple-500" />
            <span className="hidden sm:inline">Badges</span>
          </button>

          {/* Theme Toggle (Dark / Light) */}
          <button
            onClick={toggleTheme}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer group ${
              isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
            }`}
            title={isDark ? "Switch to Clean Light Studio Theme (T)" : "Switch to Deep Dark Cyberpunk Theme (T)"}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-500 group-hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
            }`}
            title={soundEnabled ? "Mute Audio SFX" : "Enable Audio SFX"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-blue-500" /> : <VolumeX className={`w-4 h-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />}
          </button>

          {/* Reset progress */}
          <button
            onClick={onResetProgress}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDark ? 'text-slate-500 hover:text-red-400 hover:bg-slate-800/80' : 'text-slate-400 hover:text-red-600 hover:bg-slate-200'
            }`}
            title="Reset All Progress"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={`max-w-7xl mx-auto mt-3 flex items-center gap-1 overflow-x-auto pb-1 border-t pt-2 ${
        isDark ? 'border-slate-800/40' : 'border-slate-200'
      }`}>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentMode === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { sounds.playClick(); setCurrentMode(item.id); }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive 
                  ? (isDark 
                      ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-sm shadow-blue-500/10' 
                      : 'bg-blue-50 text-blue-700 border border-blue-300 shadow-xs')
                  : (isDark 
                      ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent')
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-500' : (isDark ? 'text-slate-400' : 'text-slate-500')}`} />
              <span>{item.label}</span>
              {item.badge && (
                <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold border ${
                  isDark ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-blue-100 text-blue-700 border-blue-200'
                }`}>
                  {item.badge}
                </span>
              )}
              {item.count !== undefined && item.count > 0 && (
                <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold border ${
                  isDark ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
}

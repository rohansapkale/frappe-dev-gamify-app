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
  Brain
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { agentBrain } from '../utils/agentBrain';

export default function Header({
  currentUser,
  userStats,
  currentMode,
  setCurrentMode,
  soundEnabled,
  setSoundEnabled,
  onOpenAchievements,
  onOpenAuthModal,
  onResetProgress
}) {
  const { xp, level, rank, coins, streak, completedQuests } = userStats;
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [agentIq, setAgentIq] = useState(() => agentBrain.getState()?.iq || 105);

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
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand Logo & User Profile Badge */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 shadow-lg shadow-blue-500/25 border border-blue-400/30">
            <span className="font-extrabold text-white text-lg tracking-wider">F</span>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                FrappeQuest
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                ERPNext Dev RPG
              </span>
            </div>
            <p className="text-xs text-slate-400">Master Frappe Desk, Client Scripts & Server Controllers</p>
          </div>
        </div>

        {/* Gamification & User Profile Hub */}
        <div className="flex items-center flex-wrap gap-2 md:gap-3 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-2xl shadow-inner">
          
          {/* User Profile Selector Pill */}
          <div className="relative pr-2 border-r border-slate-800">
            <button
              onClick={() => { sounds.playClick(); onOpenAuthModal(); }}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-800 transition-colors text-left"
              title="Click to switch profile or sign in"
            >
              <span className="text-2xl">{currentUser?.avatar || '👨‍💻'}</span>
              <div className="hidden sm:block">
                <div className="text-xs font-bold text-slate-200 flex items-center gap-1">
                  <span>{currentUser?.name || 'Developer'}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>
                <div className="text-[10px] text-blue-400 font-semibold">{currentUser?.role || 'Frappe Dev'}</div>
              </div>
            </button>
          </div>

          {/* Level & Rank Progress */}
          <div className="flex items-center gap-2 pr-2 border-r border-slate-800">
            <span className="text-xl" title={rank.title}>{rank.icon}</span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-200">Lvl {level}</span>
                <span className="text-[11px] font-semibold text-purple-400">{rank.title}</span>
              </div>
              <div className="w-20 md:w-24 bg-slate-800 h-1.5 rounded-full overflow-hidden mt-0.5">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* XP */}
          <div className="flex items-center gap-1.5 px-1.5" title="Experience Points">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold text-slate-200">{xp}</span>
            <span className="text-[10px] text-slate-400">XP</span>
          </div>

          {/* Streak */}
          <div className="flex items-center gap-1.5 px-1.5" title="Daily Active Streak">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500/30" />
            <span className="text-xs font-bold text-amber-400">{streak}</span>
            <span className="text-[10px] text-slate-400 hidden sm:inline">Days</span>
          </div>

          {/* Coins */}
          <div className="flex items-center gap-1.5 px-1.5" title="Frappe Coins">
            <Coins className="w-4 h-4 text-yellow-400" />
            <span className="text-xs font-bold text-yellow-400">{coins}</span>
          </div>

          {/* Frappe Dev IQ */}
          <button
            onClick={() => { sounds.playClick(); setCurrentMode('agent'); }}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg text-xs font-bold transition-all hover:scale-105"
            title="Dr. Frappe Developer IQ Matrix & Career Journey"
          >
            <Brain className="w-3.5 h-3.5 text-blue-400" />
            <span>{agentIq} IQ</span>
          </button>

          {/* Trophy / Badges Button */}
          <button
            onClick={() => { sounds.playClick(); onOpenAchievements(); }}
            className="flex items-center gap-1 px-2.5 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg text-xs font-semibold transition-all hover:scale-105"
          >
            <Trophy className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">Badges</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            title={soundEnabled ? "Mute Audio SFX" : "Enable Audio SFX"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-blue-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Reset progress */}
          <button
            onClick={onResetProgress}
            className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800/80 rounded-lg transition-colors"
            title="Reset All Progress"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto mt-3 flex items-center gap-1 overflow-x-auto pb-1 border-t border-slate-800/40 pt-2">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentMode === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { sounds.playClick(); setCurrentMode(item.id); }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isActive 
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-sm shadow-blue-500/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
              {item.badge && (
                <span className="px-1.5 py-0.2 text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full font-bold">
                  {item.badge}
                </span>
              )}
              {item.count !== undefined && item.count > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full font-bold">
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

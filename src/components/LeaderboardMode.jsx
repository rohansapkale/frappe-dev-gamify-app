import React, { useState } from 'react';
import { 
  Trophy, 
  Crown, 
  Sparkles, 
  Flame, 
  Coins, 
  Award, 
  CheckCircle2, 
  Search, 
  TrendingUp,
  Shield,
  Layers
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export default function LeaderboardMode({ leaderboard = [], currentUserId }) {
  const [filter, setFilter] = useState('xp'); // 'xp' | 'streak' | 'quests'
  const [search, setSearch] = useState('');

  const sortedList = [...leaderboard].sort((a, b) => {
    if (filter === 'streak') return (b.streak || 0) - (a.streak || 0);
    if (filter === 'quests') return (b.completedQuests?.length || 0) - (a.completedQuests?.length || 0);
    return (b.xp || 0) - (a.xp || 0);
  }).filter(u => {
    return search === '' || 
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase());
  });

  const top3 = sortedList.slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Frappe & ERPNext Global Developer Hall of Fame</span>
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
              Global Rankings
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time developer rankings based on completed missions, code accuracy, and daily streaks.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => { sounds.playClick(); setFilter('xp'); }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              filter === 'xp' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Total XP
          </button>
          <button
            onClick={() => { sounds.playClick(); setFilter('streak'); }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 ${
              filter === 'streak' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Streak</span>
          </button>
          <button
            onClick={() => { sounds.playClick(); setFilter('quests'); }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 ${
              filter === 'quests' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Quests</span>
          </button>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      {top3.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
          
          {/* 2nd Place (Silver) */}
          <div className="glass-panel p-5 text-center flex flex-col items-center justify-between border-slate-700 md:order-1 order-2 relative">
            <div className="absolute -top-4 w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-400 flex items-center justify-center font-bold text-slate-200 text-sm shadow-md">
              2
            </div>
            <div className="text-4xl my-2">{top3[1]?.avatar || '👩‍💻'}</div>
            <div>
              <h4 className="text-sm font-bold text-slate-100">{top3[1]?.name}</h4>
              <p className="text-[11px] text-slate-400">@{top3[1]?.username} • {top3[1]?.role}</p>
              <div className="mt-2 text-xs font-bold text-slate-300 bg-slate-800/80 px-3 py-1 rounded-full inline-block">
                {top3[1]?.xp} XP
              </div>
            </div>
          </div>

          {/* 1st Place (Gold Champion) */}
          <div className="glass-panel p-6 text-center flex flex-col items-center justify-between border-amber-500/50 bg-gradient-to-b from-amber-950/30 to-slate-900 md:order-2 order-1 relative shadow-xl shadow-amber-500/10 md:-translate-y-3">
            <div className="absolute -top-5 w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 border-2 border-white flex items-center justify-center font-extrabold text-slate-950 text-base shadow-lg animate-bounce">
              👑
            </div>
            <div className="text-5xl my-2">{top3[0]?.avatar || '👨‍💻'}</div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                Grandmaster #1
              </span>
              <h4 className="text-base font-extrabold text-white">{top3[0]?.name}</h4>
              <p className="text-xs text-slate-400">@{top3[0]?.username} • {top3[0]?.role}</p>
              <div className="mt-2 text-xs font-bold text-amber-300 bg-amber-500/20 border border-amber-500/40 px-4 py-1 rounded-full inline-block">
                {top3[0]?.xp} XP • {top3[0]?.streak} Day Streak 🔥
              </div>
            </div>
          </div>

          {/* 3rd Place (Bronze) */}
          <div className="glass-panel p-5 text-center flex flex-col items-center justify-between border-amber-900/60 md:order-3 order-3 relative">
            <div className="absolute -top-4 w-8 h-8 rounded-full bg-amber-900 border-2 border-amber-600 flex items-center justify-center font-bold text-amber-200 text-sm shadow-md">
              3
            </div>
            <div className="text-4xl my-2">{top3[2]?.avatar || '⚡'}</div>
            <div>
              <h4 className="text-sm font-bold text-slate-100">{top3[2]?.name}</h4>
              <p className="text-[11px] text-slate-400">@{top3[2]?.username} • {top3[2]?.role}</p>
              <div className="mt-2 text-xs font-bold text-amber-500 bg-amber-950/40 px-3 py-1 rounded-full inline-block">
                {top3[2]?.xp} XP
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="glass-panel overflow-hidden">
        
        {/* Table Header & Search */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>Developer Standings</span>
          </h3>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search developer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-slate-800/80">
          {sortedList.map((user, index) => {
            const isMe = user.id === currentUserId;
            const rankNumber = index + 1;

            return (
              <div
                key={user.id}
                className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                  isMe 
                    ? 'bg-blue-600/15 border-l-4 border-blue-500' 
                    : 'hover:bg-slate-800/30'
                }`}
              >
                {/* Left: Rank & User Details */}
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                    rankNumber === 1 ? 'bg-amber-500 text-slate-950' :
                    rankNumber === 2 ? 'bg-slate-400 text-slate-950' :
                    rankNumber === 3 ? 'bg-amber-700 text-white' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    #{rankNumber}
                  </span>

                  <span className="text-2xl shrink-0">{user.avatar || '👨‍💻'}</span>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                        <span>{user.name}</span>
                        {isMe && (
                          <span className="px-1.5 py-0.2 rounded bg-blue-500 text-white font-extrabold text-[9px] uppercase tracking-wider">
                            YOU
                          </span>
                        )}
                      </h4>
                      <span className="text-xs text-slate-400">@{user.username}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span className="text-blue-400 font-semibold">{user.role}</span>
                      <span>•</span>
                      <span className="text-purple-400">{user.rankTitle || `Lvl ${user.level || 1}`}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Stats (XP, Streak, Quests, Badges) */}
                <div className="flex items-center gap-4 sm:gap-6 self-end sm:self-center">
                  
                  {/* Streak */}
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-400" title="Active Streak">
                    <Flame className="w-4 h-4 fill-amber-500/20" />
                    <span>{user.streak || 0}d</span>
                  </div>

                  {/* Quests Cleared */}
                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-400" title="Quests Mastered">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{user.completedQuests?.length || 0}</span>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-1 text-xs font-bold text-purple-400" title="Badges Unlocked">
                    <Award className="w-4 h-4" />
                    <span>{user.unlockedBadges?.length || 0}</span>
                  </div>

                  {/* XP */}
                  <div className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-bold text-blue-400 min-w-[90px] justify-end">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{user.xp || 0} XP</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

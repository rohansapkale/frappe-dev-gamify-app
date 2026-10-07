import React from 'react';
import { BADGES, DEVELOPER_RANKS } from '../data/achievements';
import { 
  X, 
  Trophy, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Flame, 
  Award,
  Crown
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { useTheme } from '../context/ThemeContext';

export default function AchievementsModal({ 
  userStats, 
  unlockedBadges = [], 
  onClose 
}) {
  const { isDark } = useTheme();
  const { xp, level, rank } = userStats;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className={`border rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 animate-slide-down my-8 max-h-[90vh] overflow-y-auto transition-colors ${
        isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900 shadow-slate-300/60'
      }`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between border-b pb-4 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
              isDark ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-purple-50 text-purple-700 border-purple-200'
            }`}>
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-base font-bold flex items-center gap-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                <span>Developer Achievements & Ranks</span>
              </h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Your journey across the Frappe & ERPNext developer path</p>
            </div>
          </div>

          <button
            onClick={() => { sounds.playClick(); onClose(); }}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDark ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Developer Ranks Ladder */}
        <div className="space-y-3">
          <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <Crown className="w-3.5 h-3.5 text-amber-500" />
            <span>Developer Rank Ladder</span>
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {DEVELOPER_RANKS.map(r => {
              const isCurrent = r.level === level;
              const isPassed = level > r.level;

              return (
                <div
                  key={r.level}
                  className={`p-3 rounded-xl border text-center relative transition-colors ${
                    isCurrent 
                      ? (isDark ? 'bg-blue-600/20 border-blue-500 ring-1 ring-blue-500 shadow-md shadow-blue-500/20' : 'bg-blue-50 border-blue-500 ring-1 ring-blue-500 shadow-xs')
                      : isPassed 
                      ? (isDark ? 'bg-slate-900/90 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700')
                      : (isDark ? 'bg-slate-950/40 border-slate-800/60 opacity-50' : 'bg-slate-100/60 border-slate-200 opacity-50')
                  }`}
                >
                  <div className="text-2xl mb-1">{r.icon}</div>
                  <div className={`text-xs font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{r.title}</div>
                  <div className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Lvl {r.level} • {r.minXp} XP</div>
                  {isCurrent && (
                    <span className="absolute -top-2 right-2 px-1.5 py-0.2 bg-blue-600 text-white font-bold text-[9px] rounded-full uppercase">
                      Current
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Badges Showcase */}
        <div className="space-y-3">
          <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <Award className="w-3.5 h-3.5 text-purple-500" />
            <span>Mastery Badges ({unlockedBadges.length} / {BADGES.length} Unlocked)</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BADGES.map(badge => {
              const isUnlocked = unlockedBadges.includes(badge.id);

              return (
                <div
                  key={badge.id}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all ${
                    isUnlocked
                      ? (isDark ? 'bg-slate-900/90 border-purple-500/40 shadow-sm shadow-purple-500/10' : 'bg-white border-purple-300 shadow-xs')
                      : (isDark ? 'bg-slate-950/40 border-slate-800/60 opacity-50' : 'bg-slate-50 border-slate-200 opacity-50')
                  }`}
                >
                  <div className={`text-2xl shrink-0 p-1.5 rounded-lg border ${
                    isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
                  }`}>
                    {badge.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h5 className={`text-xs font-bold truncate ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                        {badge.name}
                      </h5>
                      {isUnlocked ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      ) : (
                        <Lock className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                      )}
                    </div>
                    <p className={`text-[11px] leading-snug mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {badge.description}
                    </p>
                    <span className={`inline-block mt-1.5 text-[9px] px-1.5 py-0.5 rounded border ${
                      isDark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {badge.category}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

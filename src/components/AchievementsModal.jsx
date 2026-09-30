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

export default function AchievementsModal({ 
  userStats, 
  unlockedBadges = [], 
  onClose 
}) {
  const { xp, level, rank } = userStats;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 animate-slide-down my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>Developer Achievements & Ranks</span>
              </h3>
              <p className="text-xs text-slate-400">Your journey across the Frappe & ERPNext developer path</p>
            </div>
          </div>

          <button
            onClick={() => { sounds.playClick(); onClose(); }}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Developer Ranks Ladder */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Developer Rank Ladder</span>
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {DEVELOPER_RANKS.map(r => {
              const isCurrent = r.level === level;
              const isPassed = level > r.level;

              return (
                <div
                  key={r.level}
                  className={`p-3 rounded-xl border text-center relative ${
                    isCurrent 
                      ? 'bg-blue-600/20 border-blue-500 ring-1 ring-blue-500 shadow-md shadow-blue-500/20' 
                      : isPassed 
                      ? 'bg-slate-900/90 border-slate-800 text-slate-300' 
                      : 'bg-slate-950/40 border-slate-800/60 opacity-50'
                  }`}
                >
                  <div className="text-2xl mb-1">{r.icon}</div>
                  <div className="text-xs font-bold text-slate-100">{r.title}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Lvl {r.level} • {r.minXp} XP</div>
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
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-purple-400" />
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
                      ? 'bg-slate-900/90 border-purple-500/40 shadow-sm shadow-purple-500/10'
                      : 'bg-slate-950/40 border-slate-800/60 opacity-50'
                  }`}
                >
                  <div className="text-2xl shrink-0 p-1.5 bg-slate-950 rounded-lg border border-slate-800">
                    {badge.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h5 className="text-xs font-bold text-slate-200 truncate">
                        {badge.name}
                      </h5>
                      {isUnlocked ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                      {badge.description}
                    </p>
                    <span className="inline-block mt-1.5 text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
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

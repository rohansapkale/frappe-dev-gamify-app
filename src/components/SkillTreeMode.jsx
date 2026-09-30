import React from 'react';
import { SKILL_TREE } from '../data/achievements';
import { 
  GitBranch, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  Code2, 
  Layers, 
  Sliders, 
  Table, 
  Server, 
  Database, 
  Cpu, 
  Crown,
  ChevronDown
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

const ICON_MAP = {
  Code2,
  Layers,
  Sliders,
  Table,
  Server,
  Database,
  Cpu,
  Crown
};

export default function SkillTreeMode({ unlockedSkills = [], userXp = 0, onUnlockSkill }) {
  // Group skills by tier
  const tiers = [1, 2, 3, 4, 5].map(tierNum => ({
    tierNum,
    skills: SKILL_TREE.filter(s => s.tier === tierNum)
  }));

  const isSkillUnlocked = (skill) => {
    return unlockedSkills.includes(skill.id);
  };

  const canUnlockSkill = (skill) => {
    if (isSkillUnlocked(skill)) return false;
    if (!skill.unlockedBy) return true;
    return unlockedSkills.includes(skill.unlockedBy);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-indigo-400" />
              <span>Frappe Developer Skill Tree RPG</span>
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">
              Progression
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Unlock developer nodes along your journey from Desk Newbie to Frappe Grandmaster.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold">Mastery Nodes:</span>
          <span className="text-xs font-bold text-indigo-400">{unlockedSkills.length} / {SKILL_TREE.length}</span>
        </div>
      </div>

      {/* Skill Tree Visual Grid */}
      <div className="space-y-8 relative">
        {tiers.map(({ tierNum, skills }) => (
          <div key={tierNum} className="space-y-3">
            
            {/* Tier Header */}
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-800 text-blue-400 flex items-center justify-center text-xs font-bold font-mono">
                T{tierNum}
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Tier {tierNum} {tierNum === 1 ? '• Foundations' : tierNum === 5 ? '• Grandmastery' : '• Specializations'}
              </h3>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            {/* Tier Nodes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.map(skill => {
                const IconComponent = ICON_MAP[skill.icon] || Code2;
                const unlocked = isSkillUnlocked(skill);
                const claimable = canUnlockSkill(skill);

                return (
                  <div
                    key={skill.id}
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between relative overflow-hidden ${
                      unlocked
                        ? 'bg-slate-900/90 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                        : claimable
                        ? 'bg-slate-900/60 border-blue-500/40 hover:border-blue-400'
                        : 'bg-slate-950/40 border-slate-800/60 opacity-60'
                    }`}
                  >
                    <div>
                      {/* Node Header */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          unlocked ? 'bg-indigo-500/20 text-indigo-300' :
                          claimable ? 'bg-blue-500/20 text-blue-300 animate-pulse' :
                          'bg-slate-800 text-slate-500'
                        }`}>
                          <IconComponent className="w-4 h-4" />
                        </div>

                        <div className="flex items-center gap-1">
                          {unlocked ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Mastered
                            </span>
                          ) : claimable ? (
                            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[10px] font-bold animate-pulse">
                              Available
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-500 text-[10px] font-bold flex items-center gap-1">
                              <Lock className="w-3 h-3" /> Locked
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Title & Description */}
                      <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                        {skill.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {skill.description}
                      </p>
                    </div>

                    {/* Footer & Action */}
                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs font-bold text-purple-400">
                        <Sparkles className="w-3 h-3" />
                        <span>+{skill.xpReward} XP</span>
                      </div>

                      {claimable && !unlocked && (
                        <button
                          onClick={() => {
                            sounds.playLevelUp();
                            onUnlockSkill(skill);
                          }}
                          className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-500/25 transition-all hover:scale-105"
                        >
                          Unlock Node
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

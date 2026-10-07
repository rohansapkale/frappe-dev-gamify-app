import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  X, 
  Brain, 
  Target,
  Maximize2
} from 'lucide-react';
import { agentBrain, AGENT_MOODS } from '../utils/agentBrain';
import { sounds } from '../utils/soundEffects';
import { useTheme } from '../context/ThemeContext';
import AgentMentorStudio from './AgentMentorStudio';

export default function AgentCompanion({
  currentQuest,
  currentCode,
  lastValidation,
  onSelectQuest
}) {
  const [brainState, setBrainState] = useState(() => agentBrain.getState());
  const [studioOpen, setStudioOpen] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(true);
  const [minimized, setMinimized] = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    const unsubscribe = agentBrain.subscribe(newState => {
      setBrainState({ ...newState });
      setBubbleVisible(true);
    });
    return unsubscribe;
  }, []);

  const mood = brainState?.currentMood || AGENT_MOODS.IDLE;
  const rank = agentBrain.getRankForIQ(brainState?.iq || 105);

  const getMoodAura = () => {
    switch (mood) {
      case AGENT_MOODS.EXCITED:
        return 'from-emerald-500 to-teal-500 shadow-emerald-500/50';
      case AGENT_MOODS.WARNING:
        return 'from-amber-500 to-orange-500 shadow-amber-500/50';
      case AGENT_MOODS.COACHING:
        return 'from-purple-600 to-indigo-600 shadow-purple-500/50';
      case AGENT_MOODS.THINKING:
        return 'from-cyan-500 to-blue-500 shadow-cyan-500/50';
      case AGENT_MOODS.PROUD:
        return 'from-yellow-400 to-amber-500 shadow-yellow-400/50';
      default:
        return 'from-blue-600 to-indigo-600 shadow-blue-500/40';
    }
  };

  const handleOpenStudio = (initialAction = null) => {
    sounds.playClick();
    setStudioOpen(true);
    if (initialAction) {
      agentBrain.askAgent({
        prompt: initialAction,
        currentQuest,
        currentCode,
        lastValidation
      });
    }
  };

  return (
    <>
      {/* Floating Interactive Widget at bottom-right */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5 max-w-sm sm:max-w-md pointer-events-none">
        
        {/* Real-Time Talkative Speech Bubble */}
        {bubbleVisible && !minimized && brainState?.speech && (
          <div className={`pointer-events-auto backdrop-blur-md rounded-2xl p-3.5 shadow-2xl text-xs space-y-2.5 animate-slide-down transition-all dr-frappe-bubble ${
            isDark 
              ? 'bg-[#0b1120]/95 border border-blue-500/40 shadow-blue-900/40 text-slate-200' 
              : 'bg-white/95 border border-slate-300 shadow-slate-400/20 text-slate-800'
          }`}>
            <div className={`flex items-center justify-between border-b pb-1.5 ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-extrabold text-blue-500 text-[11px] tracking-wide uppercase">
                  Dr. Frappe (AI Mentor)
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setBubbleVisible(false)}
                  className={`p-0.5 rounded transition-colors cursor-pointer ${
                    isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-800'
                  }`}
                  title="Dismiss message"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p className={`leading-relaxed font-sans ${isDark ? 'text-slate-100' : 'text-slate-700'}`}>
              {brainState.speech}
            </p>

            {/* Quick Action Chips directly inside speech bubble */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <button
                onClick={() => handleOpenStudio('How to tackle this quest step by step')}
                className={`px-2.5 py-1 rounded-lg border font-semibold text-[11px] flex items-center gap-1 transition-all active:scale-95 cursor-pointer ${
                  isDark 
                    ? 'bg-blue-600/20 hover:bg-blue-600/40 border-blue-500/30 text-blue-300' 
                    : 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700'
                }`}
              >
                <Target className="w-3 h-3 text-blue-500" />
                <span>Coach Me</span>
              </button>
              <button
                onClick={() => handleOpenStudio('Review my current code for any syntax errors or missing logic')}
                className={`px-2.5 py-1 rounded-lg border font-semibold text-[11px] flex items-center gap-1 transition-all active:scale-95 cursor-pointer ${
                  isDark 
                    ? 'bg-purple-600/20 hover:bg-purple-600/40 border-purple-500/30 text-purple-300' 
                    : 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700'
                }`}
              >
                <Sparkles className="w-3 h-3 text-purple-500" />
                <span>Review Code</span>
              </button>
              <button
                onClick={() => handleOpenStudio()}
                className={`px-2 py-1 rounded-lg text-[11px] transition-all ml-auto cursor-pointer ${
                  isDark 
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900'
                }`}
                title="Open full mentor studio"
              >
                <Maximize2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Floating Avatar Trigger Button */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Quick IQ Pill */}
          <button
            onClick={() => handleOpenStudio()}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer ${
              isDark 
                ? 'bg-slate-900/90 hover:bg-slate-800 border-blue-500/30 text-slate-200' 
                : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800 shadow-slate-300/40'
            }`}
            title="Click to view your Frappe Developer IQ breakdown"
          >
            <Brain className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-blue-500">{brainState?.iq || 105} IQ</span>
            <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>• {rank.badge}</span>
          </button>

          {/* Dr. Frappe Animated Orb */}
          <button
            onClick={() => {
              if (bubbleVisible) {
                handleOpenStudio();
              } else {
                setBubbleVisible(true);
                sounds.playClick();
              }
            }}
            className={`relative w-14 h-14 rounded-2xl bg-gradient-to-tr ${getMoodAura()} text-white p-0.5 shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group cursor-pointer`}
            title="Chat with Dr. Frappe (AI Mentor)"
          >
            <div className={`w-full h-full rounded-[14px] flex items-center justify-center relative overflow-hidden transition-colors dr-frappe-orb-inner ${
              isDark ? 'bg-slate-950' : 'bg-white'
            }`}>
              <Bot className={`w-7 h-7 group-hover:rotate-12 transition-transform duration-300 ${
                isDark ? 'text-white' : 'text-blue-600'
              }`} />
              <div className={`absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border animate-pulse ${
                isDark ? 'border-slate-950' : 'border-white'
              }`} />
            </div>
          </button>
        </div>

      </div>

      {/* Full AI Mentor Studio Modal */}
      <AgentMentorStudio
        isOpen={studioOpen}
        onClose={() => setStudioOpen(false)}
        currentQuest={currentQuest}
        currentCode={currentCode}
        lastValidation={lastValidation}
        onSelectQuest={onSelectQuest}
      />
    </>
  );
}

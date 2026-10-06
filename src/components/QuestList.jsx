import React, { useState } from 'react';
import { 
  TRACKS, 
  QUESTS 
} from '../data/quests';
import { 
  Sparkles, 
  Coins, 
  CheckCircle2, 
  Search, 
  Terminal, 
  Server, 
  Briefcase, 
  Cpu, 
  FileText, 
  Target,
  ChevronRight,
  Filter,
  Flame,
  Award,
  Zap
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

const TRACK_ICONS = {
  'interview-mastery': Target,
  'client-scripts': Terminal,
  'server-scripts': Server,
  'erpnext-scenarios': Briefcase,
  'api-integrations': Cpu,
  'reports-jinja': FileText,
  'crm-automations': Zap,
};


export default function QuestList({ completedQuests = [], onSelectQuest }) {
  const [selectedTrack, setSelectedTrack] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredQuests = QUESTS.filter(q => {
    const matchTrack = selectedTrack === 'all' || q.trackId === selectedTrack;
    const matchDiff = selectedDifficulty === 'all' || q.level.toLowerCase() === selectedDifficulty.toLowerCase();
    const matchSearch = searchQuery === '' || 
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.doctype.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTrack && matchDiff && matchSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* 1. Track Highlights Banner Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {TRACKS.map(track => {
          const Icon = TRACK_ICONS[track.id] || Terminal;
          const trackQuests = QUESTS.filter(q => q.trackId === track.id);
          const trackCompleted = trackQuests.filter(q => completedQuests.includes(q.id)).length;
          const isSelected = selectedTrack === track.id;

          return (
            <button
              key={track.id}
              onClick={() => {
                sounds.playClick();
                setSelectedTrack(selectedTrack === track.id ? 'all' : track.id);
              }}
              className={`text-left p-3.5 rounded-xl border transition-all relative overflow-hidden group ${
                isSelected
                  ? 'bg-slate-900 border-blue-500 shadow-lg shadow-blue-500/20 ring-1 ring-blue-500'
                  : 'bg-slate-900/60 hover:bg-slate-800/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center shadow-inner"
                  style={{ backgroundColor: `${track.color}20`, color: track.color }}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                  {trackCompleted}/{trackQuests.length} Done
                </span>
              </div>
              <h3 className="text-xs font-bold text-slate-100 group-hover:text-blue-400 transition-colors line-clamp-1">
                {track.title}
              </h3>
              <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                {track.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* 2. Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search quest, DocType, API..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              <span className="hidden sm:inline">Level:</span>
            </span>
            {['all', 'Beginner', 'Intermediate', 'Advanced'].map(diff => (
              <button
                key={diff}
                onClick={() => { sounds.playClick(); setSelectedDifficulty(diff); }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all capitalize ${
                  selectedDifficulty === diff 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          {selectedTrack !== 'all' && (
            <button
              onClick={() => { sounds.playClick(); setSelectedTrack('all'); }}
              className="text-[11px] text-blue-400 hover:underline ml-2"
            >
              Clear Track
            </button>
          )}
        </div>
      </div>

      {/* 3. Quest Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredQuests.map((quest, index) => {
          const isCompleted = completedQuests.includes(quest.id);
          const track = TRACKS.find(t => t.id === quest.trackId);
          const Icon = TRACK_ICONS[quest.trackId] || Terminal;

          return (
            <div
              key={quest.id}
              onClick={() => {
                sounds.playClick();
                onSelectQuest(quest);
              }}
              className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group flex flex-col justify-between ${
                isCompleted 
                  ? 'bg-slate-900/80 border-emerald-500/40 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10'
                  : quest.trackId === 'interview-mastery'
                  ? 'bg-gradient-to-br from-red-950/20 via-slate-900/90 to-orange-950/20 border-red-500/40 hover:border-red-400 hover:shadow-xl hover:shadow-red-500/10'
                  : 'bg-slate-900/60 border-slate-800/90 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10'
              }`}
            >
              {/* Header Badges */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs"
                      style={{ backgroundColor: `${track?.color}25`, color: track?.color }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {quest.doctype}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {quest.trackId === 'interview-mastery' && (
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-red-500/20 text-red-300 border border-red-500/40 rounded">
                        Interview Drill
                      </span>
                    )}

                    {/* Language Badge */}
                    <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${
                      quest.language === 'python' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                      quest.language === 'javascript' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                    }`}>
                      {quest.language.toUpperCase()}
                    </span>

                    {/* Level Badge */}
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      quest.level === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                      quest.level === 'Intermediate' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' :
                      'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                    }`}>
                      {quest.level}
                    </span>
                  </div>
                </div>

                {/* Title & Summary */}
                <h4 className="text-base font-bold text-slate-100 group-hover:text-blue-400 transition-colors flex items-center gap-2">
                  <span>{quest.title}</span>
                  {isCompleted && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                </h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {quest.summary}
                </p>
              </div>

              {/* Bottom Metadata & Action */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs font-bold text-purple-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>+{quest.xp} XP</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-yellow-400">
                    <Coins className="w-3.5 h-3.5" />
                    <span>+{quest.coins} FC</span>
                  </div>
                </div>

                <button 
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isCompleted 
                      ? 'bg-emerald-500/20 text-emerald-300 group-hover:bg-emerald-500 group-hover:text-white'
                      : quest.trackId === 'interview-mastery'
                      ? 'bg-red-600/30 text-red-200 group-hover:bg-red-600 group-hover:text-white'
                      : 'bg-blue-600/20 text-blue-300 group-hover:bg-blue-600 group-hover:text-white'
                  }`}
                >
                  <span>{isCompleted ? 'Replay Drill' : 'Start Drill'}</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

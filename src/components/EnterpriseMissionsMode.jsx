import React, { useState, useMemo } from 'react';
import { 
  MISSION_CATEGORIES, 
  ENTERPRISE_MISSIONS 
} from '../data/enterpriseMissions';
import { 
  ShieldCheck, 
  Terminal, 
  Server, 
  Layers, 
  Clock, 
  Cpu, 
  Database, 
  FileText, 
  Activity, 
  CheckCircle2, 
  Sparkles, 
  Coins, 
  Copy, 
  Check, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Award, 
  Zap, 
  Play, 
  BookOpen, 
  ArrowRight,
  Code2,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { triggerConfetti } from '../utils/confettiHelper';
import { useTheme } from '../context/ThemeContext';

const CATEGORY_ICONS = {
  'client-scripts': Terminal,
  'server-controllers': Server,
  'events-hooks': Layers,
  'scheduler-jobs': Clock,
  'apis-integrations': Cpu,
  'permissions-security': ShieldCheck,
  'database-performance': Database,
  'workflows-reporting': FileText,
  'debugging-deployment': Activity,
};

const DIFFICULTY_COLORS = {
  'Easy': 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  'Medium': 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  'Hard': 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  'Expert': 'text-purple-500 bg-purple-500/10 border-purple-500/20',
};

const LANGUAGE_BADGES = {
  'javascript': { label: 'Client JS', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
  'python': { label: 'Python Controller', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  'json': { label: 'Schema JSON', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  'sql': { label: 'SQL Tuning', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  'jinja': { label: 'Jinja Print', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
};

export default function EnterpriseMissionsMode({ 
  currentUser, 
  masteredMissions = [], 
  onToggleMasterMission, 
  onTryInSandbox 
}) {
  const { isDark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all'); // 'all' | 'mastered' | 'unsolved'
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMissionId, setExpandedMissionId] = useState(ENTERPRISE_MISSIONS[0]?.id || null);
  const [copiedId, setCopiedId] = useState(null);

  // Filter missions dynamically
  const filteredMissions = useMemo(() => {
    return ENTERPRISE_MISSIONS.filter(m => {
      const matchCat = selectedCategory === 'all' || m.categoryId === selectedCategory;
      const matchDiff = selectedDifficulty === 'all' || m.difficulty === selectedDifficulty;
      const isMastered = masteredMissions.includes(m.id);
      const matchStatus = selectedStatus === 'all' || 
        (selectedStatus === 'mastered' && isMastered) || 
        (selectedStatus === 'unsolved' && !isMastered);
      const matchSearch = !searchQuery.trim() || 
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.doctype.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCat && matchDiff && matchStatus && matchSearch;
    });
  }, [selectedCategory, selectedDifficulty, selectedStatus, searchQuery, masteredMissions]);

  const masteredCount = masteredMissions.length;
  const totalCount = ENTERPRISE_MISSIONS.length;
  const progressPercent = Math.round((masteredCount / totalCount) * 100);

  const handleCopyCode = (mission) => {
    sounds.playClick();
    navigator.clipboard.writeText(mission.codeSnippet);
    setCopiedId(mission.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleToggleMaster = (mission) => {
    const isNowMastered = !masteredMissions.includes(mission.id);
    if (isNowMastered) {
      sounds.playSuccess();
      triggerConfetti();
    } else {
      sounds.playClick();
    }
    if (onToggleMasterMission) {
      onToggleMasterMission(mission.id, isNowMastered, mission.xp, mission.coins);
    }
  };

  const handleSendToSandbox = (mission) => {
    sounds.playClick();
    if (onTryInSandbox) {
      onTryInSandbox(mission.codeSnippet, mission.doctype);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header Banner & Architecture Mastery Gauge */}
      <div className={`p-6 rounded-2xl border relative overflow-hidden transition-all ${
        isDark 
          ? 'bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border-indigo-500/30 shadow-xl' 
          : 'bg-gradient-to-br from-blue-50/90 via-indigo-50/50 to-white border-blue-200 shadow-sm'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Enterprise 50 Architecture Mission Suite</span>
            </div>
            <h1 className={`text-2xl lg:text-3xl font-extrabold tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Production ERPNext & Frappe Scenario Bank
            </h1>
            <p className={`text-xs lg:text-sm leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Master 50 real-world, high-stakes architectural scenarios: from zero-loss table migrations and Redis caching to resilient IoT scale ingestion, workflow segregation of duties, and idempotent scheduler crons.
            </p>
          </div>

          {/* Progress Overview Card */}
          <div className={`flex items-center gap-4 p-4 rounded-xl border ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className={isDark ? 'text-slate-800' : 'text-slate-200'}
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-indigo-500 transition-all duration-700 ease-out"
                  strokeDasharray={`${progressPercent}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className={`absolute text-xs font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {progressPercent}%
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-500">
                <Award className="w-4 h-4" />
                <span>{masteredCount} of {totalCount} Mastered</span>
              </div>
              <div className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {masteredCount >= 40 ? '🏆 Principal Architect' : masteredCount >= 20 ? '⭐ Senior Engineer' : '🌱 Associate Developer'}
              </div>
              <div className="flex items-center gap-3 mt-1.5 text-[10px] font-semibold">
                <span className="flex items-center gap-1 text-amber-500">
                  <Sparkles className="w-3 h-3" /> {masteredCount * 100} XP
                </span>
                <span className="flex items-center gap-1 text-emerald-500">
                  <Coins className="w-3 h-3" /> {masteredCount * 40} Coins
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Category Selector Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
        <button
          onClick={() => {
            sounds.playClick();
            setSelectedCategory('all');
          }}
          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? (isDark 
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30' 
                  : 'bg-indigo-600 text-white border-indigo-600 shadow-xs')
              : (isDark 
                  ? 'bg-slate-900/70 hover:bg-slate-800 text-slate-300 border-slate-800' 
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs')
          }`}
        >
          <div className="text-[11px] font-bold">All 50</div>
          <div className="text-[10px] opacity-75">Scenarios</div>
        </button>

        {MISSION_CATEGORIES.map(cat => {
          const Icon = CATEGORY_ICONS[cat.id] || Terminal;
          const isSelected = selectedCategory === cat.id;
          const catMissions = ENTERPRISE_MISSIONS.filter(m => m.categoryId === cat.id);
          const catMastered = catMissions.filter(m => masteredMissions.includes(m.id)).length;

          return (
            <button
              key={cat.id}
              onClick={() => {
                sounds.playClick();
                setSelectedCategory(cat.id);
              }}
              className={`p-2 rounded-xl border text-left transition-all cursor-pointer relative group ${
                isSelected
                  ? (isDark 
                      ? 'bg-indigo-950/60 border-indigo-500 text-white ring-1 ring-indigo-500 shadow-md' 
                      : 'bg-indigo-50 border-indigo-400 text-indigo-950 ring-1 ring-indigo-400')
                  : (isDark 
                      ? 'bg-slate-900/60 hover:bg-slate-800/60 text-slate-300 border-slate-800 hover:border-slate-700' 
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs')
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <Icon className="w-3.5 h-3.5" style={{ color: cat.color }} />
                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                  catMastered === cat.count 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : (isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600')
                }`}>
                  {catMastered}/{cat.count}
                </span>
              </div>
              <div className="text-[10.5px] font-bold line-clamp-1 group-hover:text-indigo-400 transition-colors">
                {cat.name.split(' ')[0]}
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Search & Difficulty Filters Bar */}
      <div className={`p-3.5 rounded-xl border flex flex-col md:flex-row items-center justify-between gap-3 ${
        isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 50 scenarios by topic, DocType, SQL..."
            className={`w-full pl-9 pr-3 py-1.5 rounded-lg text-xs border outline-none transition-all ${
              isDark 
                ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500' 
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500'
            }`}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span className="text-[11px] font-semibold">Filter:</span>
          </div>

          {/* Difficulty Dropdown / Buttons */}
          {['all', 'Easy', 'Medium', 'Hard', 'Expert'].map(diff => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer whitespace-nowrap ${
                selectedDifficulty === diff
                  ? (isDark ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-indigo-600 text-white border-indigo-600')
                  : (isDark ? 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200')
              }`}
            >
              {diff === 'all' ? 'All Difficulties' : diff}
            </button>
          ))}

          {/* Status Filter */}
          <button
            onClick={() => setSelectedStatus(selectedStatus === 'all' ? 'mastered' : selectedStatus === 'mastered' ? 'unsolved' : 'all')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              selectedStatus !== 'all'
                ? (isDark ? 'bg-emerald-600/30 text-emerald-400 border-emerald-500' : 'bg-emerald-100 text-emerald-800 border-emerald-300')
                : (isDark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200')
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>{selectedStatus === 'all' ? 'Status: All' : selectedStatus === 'mastered' ? 'Mastered Only' : 'Unsolved Only'}</span>
          </button>
        </div>
      </div>

      {/* 4. Filtered Scenarios List */}
      <div className="space-y-4">
        {filteredMissions.length === 0 ? (
          <div className={`p-12 text-center rounded-2xl border ${
            isDark ? 'bg-slate-900/50 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
          }`}>
            <HelpCircle className="w-10 h-10 mx-auto mb-3 opacity-40 text-indigo-400" />
            <h3 className="text-sm font-bold">No Enterprise Scenarios Matched</h3>
            <p className="text-xs mt-1">Try clearing your search query or switching category filters.</p>
          </div>
        ) : (
          filteredMissions.map((mission) => {
            const isExpanded = expandedMissionId === mission.id;
            const isMastered = masteredMissions.includes(mission.id);
            const CategoryIcon = CATEGORY_ICONS[mission.categoryId] || Terminal;
            const diffClass = DIFFICULTY_COLORS[mission.difficulty] || DIFFICULTY_COLORS['Medium'];
            const langBadge = LANGUAGE_BADGES[mission.language] || LANGUAGE_BADGES['python'];

            return (
              <div
                key={mission.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isExpanded
                    ? (isDark 
                        ? 'bg-slate-900 border-indigo-500/50 shadow-lg ring-1 ring-indigo-500/30' 
                        : 'bg-white border-indigo-300 shadow-md ring-1 ring-indigo-300')
                    : (isDark 
                        ? 'bg-slate-900/60 hover:bg-slate-900 border-slate-800 hover:border-slate-700' 
                        : 'bg-white hover:bg-slate-50/80 border-slate-200 shadow-xs')
                }`}
              >
                {/* Scenario Header Bar */}
                <div
                  onClick={() => {
                    sounds.playClick();
                    setExpandedMissionId(isExpanded ? null : mission.id);
                  }}
                  className="p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    {/* Number Badge */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 border ${
                      isMastered
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : (isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-200')
                    }`}>
                      {isMastered ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : `#${mission.number}`}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${diffClass}`}>
                          {mission.difficulty}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${langBadge.color}`}>
                          {langBadge.label}
                        </span>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {mission.doctype}
                        </span>
                      </div>

                      <h3 className={`text-sm sm:text-base font-bold ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}>
                        {mission.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleMaster(mission);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                        isMastered
                          ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm shadow-emerald-500/30'
                          : (isDark 
                              ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' 
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200')
                      }`}
                    >
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isMastered ? 'text-white' : 'text-slate-400'}`} />
                      <span>{isMastered ? 'Mastered' : 'Mark Mastered'}</span>
                    </button>

                    <div className={`p-1.5 rounded-lg ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Scenario Expanded Body */}
                {isExpanded && (
                  <div className={`px-4 pb-5 sm:px-6 sm:pb-6 pt-2 border-t space-y-5 animate-fade-in ${
                    isDark ? 'border-slate-800/80 bg-slate-950/40' : 'border-slate-100 bg-slate-50/50'
                  }`}>
                    
                    {/* The Interview Question & Context */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
                        <HelpCircle className="w-4 h-4" />
                        <span>The Technical Interview Scenario</span>
                      </div>
                      <div className={`p-3.5 rounded-xl border text-xs sm:text-sm font-semibold leading-relaxed ${
                        isDark ? 'bg-indigo-950/20 border-indigo-500/30 text-indigo-200' : 'bg-indigo-50/80 border-indigo-200 text-indigo-900'
                      }`}>
                        "{mission.question}"
                      </div>
                      <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        <strong className="text-slate-200">Production Context:</strong> {mission.problemStatement}
                      </p>
                    </div>

                    {/* Architectural Guide */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                        <BookOpen className="w-4 h-4" />
                        <span>Architectural Solution & Best Practice</span>
                      </div>
                      <div className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1.5 whitespace-pre-line ${
                        isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-xs'
                      }`}>
                        {mission.architectureGuide}
                      </div>
                    </div>

                    {/* Production Code Snippet */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                          <Code2 className="w-4 h-4" />
                          <span>Production Implementation Code ({mission.language.toUpperCase()})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {onTryInSandbox && (
                            <button
                              onClick={() => handleSendToSandbox(mission)}
                              className="px-2.5 py-1 text-[11px] font-bold rounded-lg border bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border-blue-500/30 flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <Play className="w-3 h-3" />
                              <span>Test in Desk Sandbox</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleCopyCode(mission)}
                            className="px-2.5 py-1 text-[11px] font-bold rounded-lg border bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700 flex items-center gap-1 transition-all cursor-pointer"
                          >
                            {copiedId === mission.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Code</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <pre className={`p-4 rounded-xl font-mono text-[11.5px] leading-relaxed overflow-x-auto border ${
                        isDark ? 'bg-slate-950 text-slate-200 border-slate-800' : 'bg-slate-900 text-slate-100 border-slate-800'
                      }`}>
                        <code>{mission.codeSnippet}</code>
                      </pre>
                    </div>

                    {/* Key Takeaway Box */}
                    <div className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
                      isDark ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    }`}>
                      <Zap className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold">Key Architectural Takeaway:</strong> {mission.keyTakeaway}
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}

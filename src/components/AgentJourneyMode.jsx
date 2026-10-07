import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Bot, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  ArrowRight 
} from 'lucide-react';
import { agentBrain } from '../utils/agentBrain';
import { sounds } from '../utils/soundEffects';
import { triggerConfetti } from '../utils/confettiHelper';
import { useTheme } from '../context/ThemeContext';

export default function AgentJourneyMode({
  currentUser,
  onSelectQuest
}) {
  const [brainState, setBrainState] = useState(() => agentBrain.getState());
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'timeline' | 'sparring' | 'blindspots'
  const [currentDrill, setCurrentDrill] = useState(null);
  const [drillFeedback, setDrillFeedback] = useState(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const unsubscribe = agentBrain.subscribe(newState => {
      setBrainState({ ...newState });
    });
    return unsubscribe;
  }, []);

  const rank = agentBrain.getRankForIQ(brainState?.iq || 105);

  const sampleDrills = [
    {
      id: 'drill-01',
      question: 'Which method should you use on a Client Script to dynamically filter a Link field modal based on other document values?',
      options: [
        'frm.set_query("fieldname", () => ({ filters: { ... } }))',
        'frm.filter_link("fieldname", "DocType", { ... })',
        'frappe.db.get_link_filters("fieldname")',
        'frm.doc.fieldname.apply_filters({ ... })'
      ],
      correctIndex: 0,
      explanation: 'In Frappe Desk, frm.set_query binds a dynamic filter callback to the Link field lookup dialog.'
    },
    {
      id: 'drill-02',
      question: 'In a DocType Python controller, what is the critical difference between frappe.msgprint() and frappe.throw()?',
      options: [
        'frappe.throw() aborts the database transaction and rolls back changes; frappe.msgprint() only displays a popup.',
        'frappe.msgprint() only works in JavaScript; frappe.throw() only works in SQL.',
        'frappe.throw() permanently disables the document; frappe.msgprint() saves it.',
        'There is no functional difference; they are aliases.'
      ],
      correctIndex: 0,
      explanation: 'frappe.throw raises a frappe.ValidationError which cancels the transaction and reverts all DB mutations.'
    },
    {
      id: 'drill-03',
      question: 'Why should you prefer frappe.db.get_value("Item", item_code, ["item_name", "standard_rate"], as_dict=True) over frappe.get_doc("Item", item_code) when querying only two fields?',
      options: [
        'get_value queries only the requested columns in SQL, avoiding the heavy memory and child-table loading of get_doc.',
        'get_doc does not work on standard ERPNext DocTypes.',
        'get_value automatically commits the transaction to the database.',
        'get_doc requires root MySQL administrator privileges.'
      ],
      correctIndex: 0,
      explanation: 'frappe.get_doc loads all fields, child tables, and document permissions, whereas frappe.db.get_value issues a lean SELECT query.'
    }
  ];

  const handleStartDrill = () => {
    const random = sampleDrills[Math.floor(Math.random() * sampleDrills.length)];
    setCurrentDrill(random);
    setDrillFeedback(null);
    sounds.playClick();
  };

  const handleSelectOption = (idx) => {
    if (!currentDrill || drillFeedback) return;
    const isCorrect = idx === currentDrill.correctIndex;

    if (isCorrect) {
      sounds.playSuccess();
      triggerConfetti();
      agentBrain.boostIQ(3, 'interview-mastery', 'Answered Rapid-Fire Frappe IQ Drill');
      setDrillFeedback({
        correct: true,
        message: `🎯 Excellent! That's 100% correct (+3 Frappe IQ). ${currentDrill.explanation}`
      });
    } else {
      sounds.playError();
      setDrillFeedback({
        correct: false,
        message: `❌ Not quite. ${currentDrill.explanation}`
      });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Hero Command Bar: Dr. Frappe & Developer IQ */}
      <div className={`rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border transition-colors ${
        isDark 
          ? 'bg-gradient-to-r from-blue-950/60 via-indigo-950/40 to-purple-950/60 border-blue-500/30' 
          : 'bg-gradient-to-r from-blue-50 via-indigo-50/70 to-purple-50 border-blue-200'
      }`}>
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/30">
                <Bot className="w-9 h-9 sm:w-11 sm:h-11 animate-pulse" />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className={`relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 ${
                  isDark ? 'border-slate-900' : 'border-white'
                }`}></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className={`text-xl sm:text-2xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Dr. Frappe AI Career Center
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  isDark 
                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' 
                    : 'bg-blue-100 text-blue-700 border-blue-200'
                }`}>
                  Live Coach
                </span>
              </div>
              <p className={`text-xs sm:text-sm mt-1 max-w-xl ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Continuous cognitive evaluation of your Frappe & ERPNext development trajectory, mental models, and real-time Developer IQ.
              </p>
            </div>
          </div>

          {/* Frappe IQ Score Badge */}
          <div className={`rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-xl shrink-0 border transition-colors ${
            isDark 
              ? 'bg-slate-900/90 border-blue-500/40 text-white' 
              : 'bg-white border-slate-200 shadow-slate-200 text-slate-800'
          }`}>
            <div className={`relative flex items-center justify-center w-16 h-16 rounded-full border-4 border-blue-500 shadow-lg shadow-blue-500/20 ${
              isDark ? 'bg-slate-950' : 'bg-slate-50'
            }`}>
              <div className="text-center">
                <span className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{brainState?.iq || 105}</span>
                <span className="text-[9px] font-bold text-blue-500 block uppercase">IQ</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl">{rank.badge}</span>
                <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{rank.title}</h3>
              </div>
              <p className={`text-[11px] max-w-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {rank.description}
              </p>
            </div>
          </div>

        </div>

        {/* Live speech bubble from Dr. Frappe */}
        {brainState?.speech && (
          <div className={`mt-6 rounded-2xl p-4 text-xs flex items-start gap-3 border transition-colors ${
            isDark 
              ? 'bg-slate-900/80 border-slate-800 text-slate-200' 
              : 'bg-white/95 border-slate-200 shadow-sm text-slate-800'
          }`}>
            <span className="text-lg">💬</span>
            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-blue-500">
                Dr. Frappe's Real-Time Observation:
              </div>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-100' : 'text-slate-700'}`}>
                "{brainState.speech}"
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 2. Navigation Tabs */}
      <div className={`flex items-center gap-2 border-b pb-2 overflow-x-auto ${
        isDark ? 'border-slate-800' : 'border-slate-200'
      }`}>
        {[
          { id: 'overview', label: 'Cognitive IQ Matrix', icon: Brain },
          { id: 'timeline', label: 'Developer Journey Log', icon: TrendingUp },
          { id: 'blindspots', label: 'Blindspot Diagnostics', icon: AlertTriangle, count: brainState?.blindspots?.length },
          { id: 'sparring', label: 'AI Sparring & Rapid Drills', icon: Zap }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { sounds.playClick(); setActiveTab(tab.id); }}
              className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : (isDark 
                      ? 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800' 
                      : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 shadow-xs')
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] bg-amber-500/20 text-amber-500 rounded-full font-bold">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Tab Displays */}
      
      {/* TAB 1: COGNITIVE IQ MATRIX */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { key: 'clientScripting', title: 'Client-Side Reactivity', score: brainState?.iqBreakdown?.clientScripting || 60, desc: 'Mastery of Form Events, Dynamic Fields, Child Tables & Desk UI', color: 'from-blue-500 to-cyan-500' },
              { key: 'serverPython', title: 'Python Controllers & Hooks', score: brainState?.iqBreakdown?.serverPython || 50, desc: 'Lifecycle validation, Doc Events, before_save, docstatus guards', color: 'from-purple-500 to-indigo-500' },
              { key: 'ormDatabase', title: 'Frappe ORM & Query IQ', score: brainState?.iqBreakdown?.ormDatabase || 55, desc: 'db.get_value, SQL filters, link querying, indexing strategies', color: 'from-emerald-500 to-teal-500' },
              { key: 'erpArchitecture', title: 'ERPNext Business Logic', score: brainState?.iqBreakdown?.erpArchitecture || 48, desc: 'GL balancing, stock transactions, multi-currency, and workflows', color: 'from-amber-500 to-orange-500' },
              { key: 'debuggingVelocity', title: 'Debugging & Recovery Velocity', score: brainState?.iqBreakdown?.debuggingVelocity || 70, desc: 'Speed of diagnosing syntax errors and overcoming test failures', color: 'from-rose-500 to-pink-500' }
            ].map(pillar => (
              <div key={pillar.key} className={`p-5 space-y-3 rounded-2xl border transition-colors ${
                isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="flex items-center justify-between">
                  <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>{pillar.title}</h4>
                  <span className="text-sm font-mono font-black text-blue-500">{pillar.score} / 100</span>
                </div>
                <div className={`w-full h-2.5 rounded-full overflow-hidden border ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
                }`}>
                  <div
                    className={`h-full bg-gradient-to-r ${pillar.color} rounded-full transition-all duration-700`}
                    style={{ width: `${pillar.score}%` }}
                  />
                </div>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Community Percentile Comparison Card */}
          <div className={`p-6 flex flex-col md:flex-row items-center justify-between gap-6 rounded-2xl border transition-colors ${
            isDark 
              ? 'bg-slate-900/80 border-blue-500/20' 
              : 'bg-gradient-to-r from-blue-50/80 to-purple-50/80 border-blue-200 shadow-sm'
          }`}>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500">
                Peer Distribution & Percentile
              </span>
              <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                How Your Frappe IQ Compares Globally
              </h3>
              <p className={`text-xs max-w-xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Calculated against 4,200+ simulated developer submissions across real-world Frappe custom apps and ERPNext production scenarios.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-black text-emerald-500">Top 15%</div>
                <div className={`text-[10px] font-bold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Percentile</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-purple-500">{currentUser?.completedQuests?.length || 0}</div>
                <div className={`text-[10px] font-bold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Missions Solved</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DEVELOPER JOURNEY TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Chronological Career Journey
            </h4>
            <span className="text-xs font-mono font-bold text-blue-500">
              {brainState?.journeyMilestones?.length || 0} Events Traced
            </span>
          </div>

          <div className={`relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 ${
            isDark ? 'before:bg-slate-800' : 'before:bg-slate-200'
          }`}>
            {(brainState?.journeyMilestones || []).map((m, idx) => (
              <div key={m.id || idx} className="relative group">
                <span className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 border-blue-500 flex items-center justify-center text-[10px] group-hover:scale-125 transition-transform ${
                  isDark ? 'bg-slate-900' : 'bg-white'
                }`} />
                <div className={`p-4 rounded-xl space-y-1.5 transition-all border ${
                  isDark 
                    ? 'bg-slate-900/90 border-slate-800/80 hover:border-blue-500/40' 
                    : 'bg-white border-slate-200 hover:border-blue-300 shadow-sm'
                }`}>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{m.icon || '🚀'}</span>
                      <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{m.title}</span>
                    </div>
                    <span className={`text-[10px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {new Date(m.timestamp).toLocaleDateString()} {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className={`text-xs pl-7 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {m.details}
                  </p>
                  {m.iqDelta > 0 && (
                    <div className="pl-7 pt-1">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                        <TrendingUp className="w-3 h-3" />
                        <span>+{m.iqDelta} Frappe IQ</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: BLINDSPOTS & DIAGNOSTICS */}
      {activeTab === 'blindspots' && (
        <div className="space-y-4">
          <div className="space-y-1">
            <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Targeted Blindspots & Friction Analysis</span>
            </h4>
            <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
              Areas where your code has encountered test assertion failures or deprecated API calls.
            </p>
          </div>

          {brainState?.blindspots && brainState.blindspots.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {brainState.blindspots.map((spot, i) => (
                <div key={i} className={`p-5 rounded-2xl space-y-3 border ${
                  isDark ? 'bg-slate-900 border-amber-500/30' : 'bg-white border-amber-300 shadow-sm'
                }`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                        <AlertTriangle className="w-5 h-5" />
                      </span>
                      <div>
                        <h5 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{spot.title}</h5>
                        <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">
                          Severity: {spot.severity}
                        </span>
                      </div>
                    </div>

                    {spot.recommendedQuest && (
                      <button
                        onClick={() => onSelectQuest && onSelectQuest(spot.recommendedQuest)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-blue-500/25 shrink-0 cursor-pointer"
                      >
                        <span>Fix This Weakness</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <p className={`text-xs leading-relaxed p-3.5 rounded-xl border ${
                    isDark 
                      ? 'bg-slate-950/60 text-slate-300 border-slate-800' 
                      : 'bg-amber-50/50 text-slate-700 border-amber-200'
                  }`}>
                    {spot.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-16 rounded-3xl space-y-3 border ${
              isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h5 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>No Critical Blindspots Detected!</h5>
              <p className={`text-xs max-w-md mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Dr. Frappe has not detected any recurring assertion errors. You're building clean, idiomatic Frappe solutions!
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: AI SPARRING & RAPID DRILLS */}
      {activeTab === 'sparring' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <Zap className="w-4 h-4 text-yellow-500" />
                <span>Interactive AI Sparring & Rapid-Fire Drills</span>
              </h4>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                Sharpen your problem-solving speed and mental models with real technical questions from Dr. Frappe.
              </p>
            </div>

            <button
              onClick={handleStartDrill}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/25 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{currentDrill ? 'Next Drill' : 'Start Sparring'}</span>
            </button>
          </div>

          {currentDrill ? (
            <div className={`p-6 space-y-4 rounded-2xl border transition-colors ${
              isDark ? 'bg-slate-900/80 border-blue-500/30' : 'bg-white border-blue-200 shadow-sm'
            }`}>
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">
                Dr. Frappe's Technical Drill:
              </span>
              <h3 className={`text-base font-bold leading-relaxed ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {currentDrill.question}
              </h3>

              <div className="grid grid-cols-1 gap-2.5 pt-2">
                {currentDrill.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={!!drillFeedback}
                    className={`p-3.5 rounded-xl border text-left text-xs font-mono transition-all flex items-start gap-3 cursor-pointer ${
                      drillFeedback
                        ? idx === currentDrill.correctIndex
                          ? (isDark ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200' : 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold')
                          : (isDark ? 'bg-slate-900/60 border-slate-800 text-slate-400 opacity-60' : 'bg-slate-100 border-slate-200 text-slate-400 opacity-60')
                        : (isDark 
                            ? 'bg-slate-900/90 hover:bg-slate-800 border-slate-800 hover:border-blue-500/50 text-slate-200' 
                            : 'bg-slate-50 hover:bg-blue-50/50 border-slate-200 hover:border-blue-300 text-slate-800 shadow-xs')
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-lg border font-bold text-[10px] flex items-center justify-center shrink-0 ${
                      isDark 
                        ? 'bg-slate-800 border-slate-700 text-slate-300' 
                        : 'bg-white border-slate-300 text-slate-700'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1">{opt}</span>
                  </button>
                ))}
              </div>

              {drillFeedback && (
                <div className={`p-4 rounded-xl text-xs leading-relaxed space-y-1 border ${
                  drillFeedback.correct 
                    ? (isDark ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' : 'bg-emerald-50 border-emerald-300 text-emerald-900')
                    : (isDark ? 'bg-rose-950/40 border-rose-500/40 text-rose-200' : 'bg-rose-50 border-rose-300 text-rose-900')
                }`}>
                  <div className="font-bold flex items-center gap-1.5">
                    {drillFeedback.correct ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertTriangle className="w-4 h-4 text-rose-500" />}
                    <span>Dr. Frappe's Review:</span>
                  </div>
                  <p>{drillFeedback.message}</p>
                </div>
              )}
            </div>
          ) : (
            <div className={`text-center py-16 rounded-3xl space-y-4 border ${
              isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <Brain className="w-12 h-12 text-blue-500 mx-auto" />
              <h5 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Ready for a Technical Sparring Round?</h5>
              <p className={`text-xs max-w-sm mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Test your instincts on dynamic link filters, transactions, docstatus workflows, and ORM query efficiency!
              </p>
              <button
                onClick={handleStartDrill}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-blue-500/30 transition-all cursor-pointer"
              >
                Launch Rapid Drill
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

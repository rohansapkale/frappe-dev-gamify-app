import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  Lightbulb, 
  Brain, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ArrowRight, 
  TrendingUp, 
  Code2, 
  Award, 
  ChevronRight, 
  Zap, 
  RefreshCw,
  X,
  Target,
  Layers,
  BookOpen
} from 'lucide-react';
import { agentBrain, AGENT_MOODS, IQ_LEVEL_TITLES } from '../utils/agentBrain';
import { sounds } from '../utils/soundEffects';
import { useTheme } from '../context/ThemeContext';

export default function AgentMentorStudio({
  isOpen,
  onClose,
  currentQuest,
  currentCode,
  lastValidation,
  onSelectQuest
}) {
  const { isDark } = useTheme();
  const [brainState, setBrainState] = useState(() => agentBrain.getState());
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'iq' | 'journey' | 'blueprint' | 'blindspots'
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const unsubscribe = agentBrain.subscribe(newState => {
      setBrainState({ ...newState });
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (activeTab === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [brainState?.chatMessages, activeTab, isTyping]);

  if (!isOpen) return null;

  const rank = agentBrain.getRankForIQ(brainState?.iq || 105);

  const handleSendMessage = async (text) => {
    const msg = text || inputMessage;
    if (!msg.trim()) return;

    sounds.playClick();
    setInputMessage('');
    setIsTyping(true);

    try {
      await agentBrain.askAgent({
        prompt: msg,
        currentQuest,
        currentCode,
        lastValidation
      });
      sounds.playAgentSpeak();
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  const quickPrompts = [
    { label: '🎯 How to Tackle This Quest', prompt: 'Break down how to tackle this quest step by step with the mental model' },
    { label: '🔍 Review My Code', prompt: 'Review my current code for any Frappe syntax errors or missing logic' },
    { label: '💡 Hint Without Answer', prompt: 'Give me a conceptual hint for this quest without giving away the full code' },
    { label: '🧠 Test My Frappe IQ', prompt: 'Give me a rapid-fire Frappe technical drill to test my knowledge' },
    { label: '📊 Analyze My Weaknesses', prompt: 'What are my biggest Frappe blindspots and how do I improve?' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-slide-down">
      <div className={`border rounded-2xl w-full max-w-5xl h-[88vh] flex flex-col shadow-2xl overflow-hidden transition-colors dr-frappe-studio ${
        isDark 
          ? 'bg-[#0b1120] border-blue-500/40 shadow-blue-500/20 text-slate-100' 
          : 'bg-white border-slate-300 shadow-slate-400/20 text-slate-800'
      }`}>
        
        {/* Modal Header */}
        <div className={`border-b px-4 sm:px-6 py-3.5 flex items-center justify-between shrink-0 transition-colors ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className={`relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 ${
                  isDark ? 'border-slate-900' : 'border-white'
                }`}></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`text-base font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <span>Dr. Frappe</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 font-bold">
                    AI Frappe Mentor & IQ Engine
                  </span>
                </h2>
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Tracking your Frappe journey • Real-time Code Doctor & Cognitive Radar
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border ${
              isDark ? 'bg-slate-800/80 border-slate-700/80 text-slate-200' : 'bg-white border-slate-300 text-slate-800 shadow-sm'
            }`}>
              <span className="text-lg">{rank.badge}</span>
              <div>
                <div className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Frappe Dev IQ</div>
                <div className="text-xs font-black text-blue-500 flex items-center gap-1">
                  <span>{brainState?.iq || 105}</span>
                  <span className={`text-[10px] font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>• {rank.title}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => { sounds.playClick(); onClose(); }}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Studio Navigation Tabs */}
        <div className={`border-b px-4 sm:px-6 flex items-center gap-1 overflow-x-auto shrink-0 transition-colors ${
          isDark ? 'bg-slate-900/50 border-slate-800/80' : 'bg-slate-100/80 border-slate-200'
        }`}>
          {[
            { id: 'chat', label: 'Interactive AI Coach', icon: Bot },
            { id: 'blueprint', label: 'Tackle This Quest', icon: Target },
            { id: 'iq', label: 'Frappe Developer IQ Matrix', icon: Brain },
            { id: 'journey', label: 'Career Journey Timeline', icon: TrendingUp },
            { id: 'blindspots', label: 'Blindspots & Diagnostics', icon: AlertTriangle, count: brainState?.blindspots?.length }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { sounds.playClick(); setActiveTab(tab.id); }}
                className={`flex items-center gap-2 py-3 px-3.5 border-b-2 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? (isDark ? 'border-blue-500 text-blue-300 bg-blue-500/10' : 'border-blue-600 text-blue-700 bg-blue-50')
                    : (isDark ? 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40' : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/50')
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-500' : (isDark ? 'text-slate-500' : 'text-slate-400')}`} />
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

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* TAB 1: INTERACTIVE AI COACH & CHAT */}
          {activeTab === 'chat' && (
            <div className="h-full flex flex-col justify-between space-y-4">
              
              {/* Quick Prompt Recommendation Chips */}
              <div className="space-y-1.5 shrink-0">
                <span className={`text-[11px] font-bold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Interactive Mentoring Actions:
                </span>
                <div className="flex flex-wrap gap-2">
                  {quickPrompts.map((qp, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(qp.prompt)}
                      className={`px-3 py-1.5 rounded-xl border text-xs transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer ${
                        isDark 
                          ? 'bg-slate-900 hover:bg-slate-800 border-slate-700/80 text-slate-300 hover:text-blue-300 hover:border-blue-500/40' 
                          : 'bg-white hover:bg-blue-50 border-slate-300 text-slate-700 hover:text-blue-700 hover:border-blue-400 shadow-sm'
                      }`}
                    >
                      <span>{qp.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Thread */}
              <div className={`flex-1 overflow-y-auto space-y-3.5 pr-2 p-4 rounded-2xl border min-h-[280px] transition-colors dr-frappe-chat-area ${
                isDark ? 'bg-slate-950/40 border-slate-800/60' : 'bg-slate-50/80 border-slate-200'
              }`}>
                {brainState?.chatMessages?.map((msg, index) => {
                  const isAgent = msg.sender === 'agent';
                  return (
                    <div
                      key={index}
                      className={`flex gap-3 ${isAgent ? 'items-start' : 'items-start flex-row-reverse'}`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isAgent 
                          ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20' 
                          : 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                      }`}>
                        {isAgent ? <Bot className="w-4 h-4" /> : <Code2 className="w-4 h-4" />}
                      </div>

                      <div className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed space-y-1 dr-frappe-agent-msg ${
                        isAgent
                          ? (isDark ? 'bg-slate-900 border border-slate-800 text-slate-200' : 'bg-white border border-slate-200 text-slate-800 shadow-sm')
                          : 'bg-blue-600 text-white'
                      }`}>
                        <div className={`flex items-center justify-between gap-4 text-[10px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          <span>{isAgent ? 'Dr. Frappe' : 'You'}</span>
                          <span>{msg.timestamp}</span>
                        </div>
                        <div className="whitespace-pre-line font-sans">
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                      <Bot className="w-4 h-4 animate-spin" />
                    </div>
                    <div className={`rounded-2xl px-4 py-2.5 text-xs flex items-center gap-2 border ${
                      isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600 shadow-sm'
                    }`}>
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                      <span>Dr. Frappe is analyzing your request...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className={`shrink-0 flex items-center gap-2 border rounded-2xl p-2 transition-colors ${
                isDark ? 'bg-slate-900/90 border-slate-800 shadow-inner' : 'bg-white border-slate-300 shadow-sm'
              }`}>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                  placeholder="Ask Dr. Frappe anything: 'Why did my set_query fail?', 'Explain child tables'..."
                  className={`flex-1 bg-transparent px-3 py-1.5 text-xs focus:outline-none ${
                    isDark ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'
                  }`}
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isTyping}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/25 active:scale-95 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Ask Coach</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: TACKLE THIS QUEST (Mental Model & Step-by-Step Blueprint) */}
          {activeTab === 'blueprint' && (
            <div className="space-y-4">
              {currentQuest ? (
                (() => {
                  const blueprint = agentBrain.getProblemBlueprint(currentQuest);
                  return (
                    <div className="space-y-4">
                      {/* Quest Meta Banner */}
                      <div className={`p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 border transition-colors ${
                        isDark 
                          ? 'bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-purple-900/30 border-blue-500/30' 
                          : 'bg-gradient-to-r from-blue-50 via-indigo-50/60 to-purple-50 border-blue-200'
                      }`}>
                        <div>
                          <span className={`text-[10px] font-bold uppercase tracking-widest block ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                            Active Problem Strategy
                          </span>
                          <h3 className={`text-base font-extrabold mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {currentQuest.title}
                          </h3>
                          <p className={`text-xs mt-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                            Target DocType: <span className="text-blue-500 font-semibold">{currentQuest.doctype}</span> • Domain: <span className="text-purple-500 font-semibold">{blueprint.trackTitle}</span>
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            handleSendMessage(`Review my current code for "${currentQuest.title}"`);
                            setActiveTab('chat');
                          }}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shrink-0 transition-colors shadow-lg shadow-blue-500/20 cursor-pointer"
                        >
                          <Code2 className="w-4 h-4" />
                          <span>Check My Code</span>
                        </button>
                      </div>

                      {/* Mental Model Breakdown */}
                      <div className={`p-4 rounded-2xl space-y-2 border transition-colors ${
                        isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <div className={`flex items-center gap-2 text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                          <Brain className="w-4 h-4 text-purple-500" />
                          <span>The Frappe Mental Model (What happens under the hood)</span>
                        </div>
                        <p className={`text-xs leading-relaxed p-3 rounded-xl border ${
                          isDark 
                            ? 'bg-slate-950/60 text-slate-300 border-slate-800' 
                            : 'bg-white text-slate-700 border-slate-200 shadow-sm'
                        }`}>
                          {blueprint.mentalModel}
                        </p>
                      </div>

                      {/* Step-by-Step Battle Plan */}
                      <div className="space-y-3">
                        <span className={`text-xs font-bold uppercase tracking-wider block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          Architectural Battle Plan (Step-by-Step):
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {blueprint.battlePlan.map((step, idx) => (
                            <div key={idx} className={`p-4 rounded-xl space-y-2 border transition-colors ${
                              isDark 
                                ? 'bg-slate-900/90 border-slate-800' 
                                : 'bg-white border-slate-200 shadow-sm'
                            }`}>
                              <div className="flex items-center justify-between">
                                <span className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-500 font-bold text-xs flex items-center justify-center">
                                  {step.step}
                                </span>
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Phase {step.step}</span>
                              </div>
                              <h4 className={`text-xs font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{step.title}</h4>
                              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                {step.instruction}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Gotchas to Avoid */}
                      <div className={`p-4 rounded-xl space-y-2 border ${
                        isDark 
                          ? 'bg-amber-950/20 border-amber-500/30 text-amber-200' 
                          : 'bg-amber-50 border-amber-300 text-amber-900'
                      }`}>
                        <div className={`flex items-center gap-2 text-xs font-bold ${isDark ? 'text-amber-400' : 'text-amber-800'}`}>
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                          <span>Common Pitfalls to Avoid in this Problem:</span>
                        </div>
                        <ul className="space-y-1.5">
                          {blueprint.commonGotchas.map((gotcha, i) => (
                            <li key={i} className="text-xs flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                              <span>{gotcha}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="text-center py-12 space-y-3">
                  <Target className={`w-12 h-12 mx-auto ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                  <h4 className={`text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>No Active Quest Selected</h4>
                  <p className={`text-xs max-w-sm mx-auto ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                    Select any quest from the Quest Line, and Dr. Frappe will instantly generate a tailored mental model and step-by-step strategy for you!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FRAPPE DEVELOPER IQ MATRIX */}
          {activeTab === 'iq' && (
            <div className="space-y-6">
              
              {/* Top Hero IQ Gauge */}
              <div className={`p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 border shadow-xl transition-colors ${
                isDark 
                  ? 'bg-gradient-to-r from-blue-900/40 via-purple-900/30 to-slate-900/60 border-blue-500/30' 
                  : 'bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 border-blue-200'
              }`}>
                <div className="flex items-center gap-5">
                  <div className={`relative flex items-center justify-center w-24 h-24 rounded-full border-4 border-blue-500 shadow-xl shadow-blue-500/20 shrink-0 ${
                    isDark ? 'bg-slate-950' : 'bg-white'
                  }`}>
                    <div className="text-center">
                      <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{brainState?.iq || 105}</span>
                      <span className="text-[10px] font-bold text-blue-500 block uppercase">IQ INDEX</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{rank.badge}</span>
                      <h3 className={`text-xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>{rank.title}</h3>
                    </div>
                    <p className={`text-xs mt-1 max-w-md ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {rank.description}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-[11px] text-emerald-500 font-semibold">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Top 12% among simulated community ERPNext developers</span>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border text-center shrink-0 w-full md:w-auto ${
                  isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                  <span className={`text-[10px] uppercase font-bold tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Next IQ Promotion
                  </span>
                  <div className="text-sm font-bold text-purple-500 mt-0.5">
                    {IQ_LEVEL_TITLES.find(t => t.min > (brainState?.iq || 105))?.title || 'Max Level Contributor'}
                  </div>
                  <span className={`text-xs mt-1 block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    Target: {IQ_LEVEL_TITLES.find(t => t.min > (brainState?.iq || 105))?.min || 160} IQ
                  </span>
                </div>
              </div>

              {/* 5-Pillar Skill Radar Bars */}
              <div className="space-y-3">
                <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span>Cognitive Pillar Breakdown (5-Dimensional Skill Matrix)</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: 'clientScripting', label: 'Client-Side Reactivity & UI Desk', desc: 'Form events, dynamic field toggles, custom buttons', color: 'from-blue-500 to-cyan-500' },
                    { key: 'serverPython', label: 'Python Controllers & Doc Lifecycle', desc: 'Hooks, before_save, validate, throws, docstatus', color: 'from-purple-500 to-indigo-500' },
                    { key: 'ormDatabase', label: 'Frappe ORM & Query Performance', desc: 'db.get_value, SQL filters, link filtering, indexing', color: 'from-emerald-500 to-teal-500' },
                    { key: 'erpArchitecture', label: 'ERPNext Business Logic & Workflows', desc: 'Financial balance, stock ledger, CRM transitions', color: 'from-amber-500 to-orange-500' },
                    { key: 'debuggingVelocity', label: 'Debugging Intuition & Recovery Speed', desc: 'Rapid syntax resolution, first-try completion velocity', color: 'from-rose-500 to-pink-500' }
                  ].map(pillar => {
                    const val = brainState?.iqBreakdown?.[pillar.key] || 70;
                    return (
                      <div key={pillar.key} className={`p-4 rounded-xl space-y-2 border transition-colors ${
                        isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                      }`}>
                        <div className="flex items-center justify-between text-xs">
                          <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{pillar.label}</span>
                          <span className="font-mono font-bold text-blue-500">{val} / 100</span>
                        </div>
                        <div className={`w-full h-2 rounded-full overflow-hidden border ${
                          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
                        }`}>
                          <div
                            className={`h-full bg-gradient-to-r ${pillar.color} rounded-full transition-all duration-700`}
                            style={{ width: `${val}%` }}
                          />
                        </div>
                        <p className={`text-[11px] leading-tight ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {pillar.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CAREER JOURNEY TIMELINE */}
          {activeTab === 'journey' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Chronological Developer Journey Log
                  </h4>
                  <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                    Traced automatically by Dr. Frappe across your quest completions and diagnostic discoveries.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-blue-500">
                  {brainState?.journeyMilestones?.length || 0} Milestones Logged
                </span>
              </div>

              <div className={`relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 ${
                isDark ? 'before:bg-slate-800' : 'before:bg-slate-200'
              }`}>
                {(brainState?.journeyMilestones || []).map((milestone, idx) => (
                  <div key={milestone.id || idx} className="relative group">
                    <span className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 border-blue-500 flex items-center justify-center text-[10px] group-hover:scale-125 transition-transform ${
                      isDark ? 'bg-slate-900' : 'bg-white'
                    }`} />
                    
                    <div className={`p-3.5 rounded-xl space-y-1 transition-all border ${
                      isDark 
                        ? 'bg-slate-900/90 border-slate-800/80 hover:border-blue-500/40' 
                        : 'bg-white border-slate-200 hover:border-blue-300 shadow-sm'
                    }`}>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{milestone.icon || '🚀'}</span>
                          <span className={`font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{milestone.title}</span>
                        </div>
                        <span className={`text-[10px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          {new Date(milestone.timestamp).toLocaleDateString()} {new Date(milestone.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className={`text-xs pl-6 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        {milestone.details}
                      </p>
                      {milestone.iqDelta > 0 && (
                        <div className="pl-6 pt-1">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <TrendingUp className="w-3 h-3" />
                            <span>+{milestone.iqDelta} Frappe IQ</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: BLINDSPOTS & DIAGNOSTICS */}
          {activeTab === 'blindspots' && (
            <div className="space-y-4">
              <div>
                <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>AI Blindspots & Improvement Opportunities</span>
                </h4>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                  Dr. Frappe monitors your syntax failures and assertion mistakes to uncover gaps in your Frappe mental model.
                </p>
              </div>

              {brainState?.blindspots && brainState.blindspots.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {brainState.blindspots.map((spot, i) => (
                    <div key={i} className={`p-4 rounded-xl space-y-3 border ${
                      isDark ? 'bg-slate-900 border-amber-500/30' : 'bg-white border-amber-300 shadow-sm'
                    }`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                            <AlertTriangle className="w-4 h-4" />
                          </span>
                          <div>
                            <h5 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{spot.title}</h5>
                            <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">
                              Severity: {spot.severity}
                            </span>
                          </div>
                        </div>

                        {spot.recommendedQuest && (
                          <button
                            onClick={() => {
                              onSelectQuest && onSelectQuest(spot.recommendedQuest);
                              onClose();
                            }}
                            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer shadow-sm"
                          >
                            <span>Launch Fix Drill</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <p className={`text-xs leading-relaxed p-3 rounded-lg border ${
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
                <div className={`text-center py-10 rounded-2xl space-y-3 border ${
                  isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                  <h5 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>No Critical Blindspots Detected!</h5>
                  <p className={`text-xs max-w-md mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Your recent test runs are exceptionally clean. Continue solving quests to unlock higher-tier ERPNext scenarios.
                  </p>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

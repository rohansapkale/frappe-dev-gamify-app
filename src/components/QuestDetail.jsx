import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Play, 
  RotateCcw, 
  HelpCircle, 
  CheckCircle2, 
  Sparkles, 
  Coins, 
  ExternalLink, 
  Copy, 
  Check, 
  Code2, 
  Info,
  BookOpen,
  Award,
  Search,
  ListOrdered,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import DeskSimulator from './DeskSimulator';
import ConsoleOutput from './ConsoleOutput';
import { executeAndValidateQuest, VirtualFrappeContext } from '../utils/frappeSimulator';
import { sounds } from '../utils/soundEffects';
import { agentBrain } from '../utils/agentBrain';
import AgentMentorStudio from './AgentMentorStudio';
import { Bot, Brain, Target, AlertTriangle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function QuestDetail({
  quest,
  isCompleted,
  onBack,
  onCompleteQuest
}) {
  const { isDark } = useTheme();
  const [code, setCode] = useState(quest.starterCode);
  const [showHint, setShowHint] = useState(false);
  const [showDirections, setShowDirections] = useState(true);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [executing, setExecuting] = useState(false);
  
  // AI Mentor & Diagnostic State
  const [showStudio, setShowStudio] = useState(false);
  const [codeReview, setCodeReview] = useState(null);
  const [symbolInspection, setSymbolInspection] = useState(null);
  const [diagnostic, setDiagnostic] = useState(null);
  const [brainSpeech, setBrainSpeech] = useState('');
  
  // Simulator State
  const [logs, setLogs] = useState([]);
  const [validationResult, setValidationResult] = useState(null);
  const [simContext, setSimContext] = useState(null);
  const [docState, setDocState] = useState(quest.testDoc);
  const [buttons, setButtons] = useState([]);
  const [fieldProps, setFieldProps] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [prompts, setPrompts] = useState([]);

  // Initialize fresh simulation context and notify Dr. Frappe when quest changes
  useEffect(() => {
    setCode(quest.starterCode);
    setShowHint(false);
    setShowDirections(true);
    setValidationResult(null);
    setCodeReview(null);
    setSymbolInspection(null);
    setDiagnostic(null);
    initSimulator(quest.starterCode);
    agentBrain.onQuestSelected(quest);

    const unsub = agentBrain.subscribe((st) => {
      setBrainSpeech(st?.speech || '');
    });
    return unsub;
  }, [quest.id]);

  const initSimulator = (currentCode) => {
    const context = new VirtualFrappeContext(quest.testDoc);
    setSimContext(context);
    setDocState(context.doc);
    setLogs([
      {
        type: 'info',
        message: `Initialized virtual Desk for DocType '${quest.doctype}' [${quest.testDoc.name}]`,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
    setButtons([]);
    setFieldProps({});
    setAlerts([]);
    setPrompts([]);
  };


  const handleRunCode = () => {
    sounds.playClick();
    setExecuting(true);
    setCodeReview(null);

    setTimeout(() => {
      const result = executeAndValidateQuest(quest, code);
      setLogs(result.logs);
      setValidationResult({
        success: result.success,
        message: result.message
      });

      if (result.context) {
        setSimContext(result.context);
        setDocState({ ...result.context.doc });
        setButtons([...result.context.buttons]);
        setFieldProps({ ...result.context.fieldProperties });
        setAlerts([...result.context.alerts]);
        setPrompts([...result.context.prompts]);
        
        if (result.context.automationSimulator?.testRunResults?.stepResults) {
          setStepResults(result.context.automationSimulator.testRunResults.stepResults);
        }
      }

      // Notify Dr. Frappe AI Engine
      agentBrain.onExecutionCompleted({
        quest,
        userCode: code,
        success: result.success,
        message: result.message,
        logs: result.logs
      });

      if (result.success) {
        sounds.playSuccess();
        setDiagnostic(null);
        onCompleteQuest(quest);
      } else {
        sounds.playError();
        const cat = agentBrain.categorizeError(result.message, code);
        const diag = agentBrain.diagnoseError(quest, code, result.message, cat);
        setDiagnostic(diag);
      }

      setExecuting(false);
    }, 150);
  };

  const handleReviewMyCode = () => {
    sounds.playAgentSpeak();
    const rev = agentBrain.reviewCode(quest, code);
    setCodeReview(rev);
    if (rev.inspection) {
      setSymbolInspection(rev.inspection);
    }
  };

  const handleInspectMissingSymbols = () => {
    sounds.playAgentSpeak();
    const inspection = agentBrain.inspectCodeForMissingSymbols(quest, code);
    setSymbolInspection(inspection);
    if (inspection.drFrappeSpeech) {
      agentBrain.setSpeech(inspection.drFrappeSpeech, inspection.hasMissing ? 'warning' : 'proud');
    }
  };

  const handleResetCode = () => {
    sounds.playClick();
    setCode(quest.starterCode);
    initSimulator(quest.starterCode);
    setValidationResult(null);
  };

  const handleCopySnippet = () => {
    if (quest.docReference?.codeSnippet) {
      navigator.clipboard.writeText(quest.docReference.codeSnippet);
      setCopiedSnippet(true);
      sounds.playCoin();
      setTimeout(() => setCopiedSnippet(false), 2000);
    }
  };

  // Live interaction callbacks on Desk Simulator
  const handleFieldChange = (fieldname, value) => {
    if (simContext) {
      simContext.doc[fieldname] = value;
      simContext.triggerFieldChange(fieldname);
      setDocState({ ...simContext.doc });
      setFieldProps({ ...simContext.fieldProperties });
    }
  };

  const handleChildFieldChange = (rowIndex, fieldname, value) => {
    if (simContext && simContext.doc.items && simContext.doc.items[rowIndex]) {
      const row = simContext.doc.items[rowIndex];
      row[fieldname] = value;
      simContext.triggerChildEvent(row.doctype, fieldname, row.doctype, row.name);
      setDocState({ ...simContext.doc });
    }
  };

  const handleExecuteButton = (btn) => {
    if (btn && btn.action) {
      try {
        btn.action();
        if (simContext) {
          setDocState({ ...simContext.doc });
          setAlerts([...simContext.alerts]);
          setPrompts([...simContext.prompts]);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-4">
      
      {/* 1. Mission Header Bar */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-2xl border transition-colors ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { sounds.playClick(); onBack(); }}
            className={`p-2 rounded-xl transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer ${
              isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quests</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`text-base md:text-lg font-extrabold flex items-center gap-2 ${
                isDark ? 'text-slate-100' : 'text-slate-900'
              }`}>
                <span>{quest.title}</span>
                {isCompleted && (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Completed</span>
                  </span>
                )}
              </h2>
            </div>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              DocType: <span className="text-blue-500 font-semibold">{quest.doctype}</span> • Level: <span className="text-purple-500 font-semibold">{quest.level}</span>
            </p>
          </div>
        </div>

        {/* Rewards */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-500 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>+{quest.xp} XP</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-bold">
            <Coins className="w-4 h-4 text-amber-500" />
            <span>+{quest.coins} FC</span>
          </div>
        </div>
      </div>

      {/* 2. Main 2-Column Responsive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Briefing, Objectives & Code Editor (7 cols) */}
        <div className="lg:col-span-6 xl:col-span-7 space-y-4 flex flex-col">
          
          {/* Mission Narrative & Objectives Card */}
          <div className={`p-4 space-y-3 rounded-2xl border transition-colors ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className={`flex items-center justify-between border-b pb-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                isDark ? 'text-slate-200' : 'text-slate-800'
              }`}>
                <Info className="w-4 h-4 text-blue-500" />
                <span>Mission Briefing & Scenario</span>
              </h3>
            </div>
            
            <div className={`text-xs whitespace-pre-line leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {quest.briefing}
            </div>

            {/* Objectives Checklist */}
            <div className={`p-3 rounded-xl border space-y-2 ${
              isDark ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className={`text-[11px] font-bold uppercase tracking-wider block ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Target Objectives:
              </span>
              <ul className="space-y-1.5">
                {quest.objectives.map((obj, i) => (
                  <li key={i} className={`text-xs flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Directional Steps & Guidance (Not Full Code) */}
            <div className={`p-3.5 rounded-2xl border transition-colors ${
              isDark ? 'bg-indigo-950/20 border-indigo-500/30' : 'bg-indigo-50/70 border-indigo-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-2 text-xs font-bold ${isDark ? 'text-indigo-300' : 'text-indigo-800'}`}>
                  <HelpCircle className="w-4 h-4 text-indigo-500" />
                  <span>Directional Steps & Guidance (Not Full Code)</span>
                </div>
                <button
                  onClick={() => setShowDirections(!showDirections)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    isDark 
                      ? 'bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30' 
                      : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                  }`}
                >
                  <span>{showDirections ? 'Hide Directions' : 'View Directions'}</span>
                  {showDirections ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {showDirections && (
                <div className="mt-3 space-y-2 animate-slide-down">
                  <p className={`text-[11px] ${isDark ? 'text-indigo-300/80' : 'text-indigo-900/80'}`}>
                    Follow these step-by-step architectural directions to implement the logic yourself:
                  </p>
                  <div className="space-y-1.5">
                    {(quest.hints || quest.objectives || []).map((hint, idx) => (
                      <div key={idx} className={`p-2.5 rounded-xl text-xs flex items-start gap-2.5 border ${
                        isDark ? 'bg-slate-950/60 border-slate-800 text-slate-300' : 'bg-white border-indigo-100 text-slate-700 shadow-xs'
                      }`}>
                        <span className="w-5 h-5 rounded-lg bg-indigo-500/20 text-indigo-500 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{hint}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Official Frappe Docs Reference Card (Pseudocode Pattern) */}
            {quest.docReference && (
              <div className={`rounded-xl p-3.5 space-y-2.5 border ${
                isDark ? 'bg-blue-950/20 border-blue-500/30' : 'bg-blue-50/70 border-blue-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    <div>
                      <div className={`text-xs font-bold ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>
                        {quest.docReference.title}
                      </div>
                      <span className="text-[10px] font-medium text-blue-500/90">
                        Pseudocode & Architecture Pattern (Not full code)
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleCopySnippet}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      isDark ? 'bg-blue-600/20 text-blue-300 hover:bg-blue-600/40 border border-blue-500/30' : 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-300/60'
                    }`}
                    title="Copy architectural pseudocode pattern"
                  >
                    {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSnippet ? 'Pattern Copied!' : 'Copy Pattern'}</span>
                  </button>
                </div>
                <div className={`text-[11px] italic ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  💡 Architectural template with placeholders (e.g. &lt;DocType&gt;, &lt;target_field&gt;). Adapt into real code in your editor.
                </div>
                <pre className={`p-2.5 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed border ${
                  isDark ? 'bg-slate-950 text-slate-300 border-slate-800' : 'bg-white border-blue-200/80 text-slate-800 shadow-xs'
                }`}>
                  {quest.docReference.codeSnippet}
                </pre>
              </div>
            )}
          </div>

          {/* 1.5. Dr. Frappe AI Copilot & Real-Time Strategy Bar */}
          <div className={`rounded-2xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border shadow-md transition-colors ${
            isDark 
              ? 'bg-gradient-to-r from-blue-950/50 via-indigo-950/40 to-purple-950/50 border-blue-500/30' 
              : 'bg-gradient-to-r from-blue-50 via-indigo-50/70 to-purple-50 border-blue-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-500/25">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500">Dr. Frappe AI Copilot</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <p className={`text-xs line-clamp-1 font-sans ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                  {brainSpeech || `Ready to inspect your script for "${quest.title}". Need a symbol check or code review?`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 flex-wrap">
              <button
                onClick={handleInspectMissingSymbols}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
                  isDark 
                    ? 'bg-amber-600/20 hover:bg-amber-600/40 border-amber-500/40 text-amber-300' 
                    : 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-800 shadow-xs'
                }`}
                title="Inspect code for missing functions, methods, or attributes"
              >
                <Search className="w-3.5 h-3.5 text-amber-500" />
                <span>Check Missing Symbols</span>
              </button>
              <button
                onClick={handleReviewMyCode}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
                  isDark 
                    ? 'bg-purple-600/20 hover:bg-purple-600/40 border-purple-500/40 text-purple-300' 
                    : 'bg-white hover:bg-purple-50 border-purple-300 text-purple-700 shadow-xs'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                <span>Review Code</span>
              </button>
              <button
                onClick={() => setShowStudio(true)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
                  isDark 
                    ? 'bg-blue-600/20 hover:bg-blue-600/40 border-blue-500/40 text-blue-300' 
                    : 'bg-white hover:bg-blue-50 border-blue-300 text-blue-700 shadow-xs'
                }`}
              >
                <Target className="w-3.5 h-3.5 text-blue-500" />
                <span>Tackle in Studio</span>
              </button>
            </div>
          </div>

          {/* Dr. Frappe Missing Symbols & Architecture Inspector Result */}
          {symbolInspection && (
            <div className={`border rounded-2xl p-4 space-y-3 animate-slide-down transition-colors ${
              isDark 
                ? symbolInspection.hasMissing ? 'bg-slate-900 border-amber-500/40' : 'bg-slate-900 border-emerald-500/40'
                : symbolInspection.hasMissing ? 'bg-amber-50/50 border-amber-300 shadow-md' : 'bg-emerald-50/50 border-emerald-300 shadow-md'
            }`}>
              <div className={`flex items-center justify-between border-b pb-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <div className="flex items-center gap-2">
                  <Bot className={`w-4 h-4 ${symbolInspection.hasMissing ? 'text-amber-500' : 'text-emerald-500'}`} />
                  <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Dr. Frappe Code Inspection: Missing Functions & Attributes
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    symbolInspection.hasMissing 
                      ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' 
                      : 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                  }`}>
                    {symbolInspection.score}% Architecture Match
                  </span>
                </div>
                <button 
                  onClick={() => setSymbolInspection(null)} 
                  className={`text-xs cursor-pointer ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-800'}`}
                >
                  Dismiss
                </button>
              </div>

              {/* Status Message */}
              <div className={`p-3 rounded-xl text-xs leading-relaxed border ${
                isDark ? 'bg-slate-950/70 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
              }`}>
                {symbolInspection.drFrappeSpeech}
              </div>

              {/* Breakdown Cards if missing */}
              {symbolInspection.hasMissing ? (
                <div className="space-y-2 text-xs">
                  {symbolInspection.missingFunctions.length > 0 && (
                    <div className={`p-3 rounded-xl border space-y-1.5 ${
                      isDark ? 'bg-rose-950/20 border-rose-500/30 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-900'
                    }`}>
                      <div className="font-bold flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-rose-500">
                        <span>🔴 Missing Function / Lifecycle Hook</span>
                      </div>
                      {symbolInspection.missingFunctions.map((fn, idx) => (
                        <div key={idx} className="space-y-0.5 pl-2 border-l-2 border-rose-500/40">
                          <div className="font-mono font-bold">{fn.label || fn.name}</div>
                          <div className="text-[11px] opacity-90">{fn.purpose}</div>
                          <div className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">👉 Direction: {fn.direction}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {symbolInspection.missingMethods.length > 0 && (
                    <div className={`p-3 rounded-xl border space-y-1.5 ${
                      isDark ? 'bg-amber-950/20 border-amber-500/30 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-900'
                    }`}>
                      <div className="font-bold flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-amber-500">
                        <span>🟠 Missing API Method</span>
                      </div>
                      {symbolInspection.missingMethods.map((m, idx) => (
                        <div key={idx} className="space-y-0.5 pl-2 border-l-2 border-amber-500/40">
                          <div className="font-mono font-bold">{m.label || m.name}</div>
                          <div className="text-[11px] opacity-90">{m.purpose}</div>
                          <div className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">👉 Direction: {m.direction}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {symbolInspection.missingAttributes.length > 0 && (
                    <div className={`p-3 rounded-xl border space-y-1.5 ${
                      isDark ? 'bg-yellow-950/20 border-yellow-500/30 text-yellow-300' : 'bg-yellow-50 border-yellow-200 text-yellow-900'
                    }`}>
                      <div className="font-bold flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-yellow-500">
                        <span>🟡 Missing Attribute / Parameter Property</span>
                      </div>
                      {symbolInspection.missingAttributes.map((attr, idx) => (
                        <div key={idx} className="space-y-0.5 pl-2 border-l-2 border-yellow-500/40">
                          <div className="font-mono font-bold">{attr.label || attr.name}</div>
                          <div className="text-[11px] opacity-90">{attr.purpose}</div>
                          <div className="text-[11px] font-semibold text-yellow-600 dark:text-yellow-400">👉 Direction: {attr.direction}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className={`p-3 rounded-xl border flex items-center gap-2 text-xs ${
                  isDark ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300' : 'bg-emerald-100/70 border-emerald-300 text-emerald-800'
                }`}>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>All expected lifecycle functions, API methods, and attributes are in place! Execute your test to verify behavior.</span>
                </div>
              )}
            </div>
          )}

          {/* Code Review Result Card */}
          {codeReview && (
            <div className={`border rounded-2xl p-4 space-y-3 animate-slide-down transition-colors ${
              isDark ? 'bg-slate-900 border-purple-500/40' : 'bg-white border-purple-300 shadow-md'
            }`}>
              <div className={`flex items-center justify-between border-b pb-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Dr. Frappe's Code Review</span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-500 text-[10px] font-bold">
                    Rating: {codeReview.rating} ({codeReview.score}/100)
                  </span>
                </div>
                <button onClick={() => setCodeReview(null)} className={`text-xs cursor-pointer ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-800'}`}>
                  Dismiss
                </button>
              </div>
              <div className="space-y-1.5">
                {codeReview.positives.map((p, i) => (
                  <div key={i} className="text-xs text-emerald-500">{p}</div>
                ))}
                {codeReview.issues.map((issue, i) => (
                  <div key={i} className="text-xs text-amber-500">{issue}</div>
                ))}
              </div>
              <p className={`text-xs p-2.5 rounded-xl border ${
                isDark ? 'bg-slate-950/60 text-slate-300 border-slate-800' : 'bg-purple-50/50 text-slate-700 border-purple-200'
              }`}>
                {codeReview.summary}
              </p>
            </div>
          )}

          {/* AI Diagnostic Card (Shown upon failure) */}
          {diagnostic && (
            <div className={`border rounded-2xl p-4 space-y-3 animate-slide-down transition-colors ${
              isDark ? 'bg-slate-900 border-rose-500/40' : 'bg-white border-rose-300 shadow-md'
            }`}>
              <div className={`flex items-center justify-between border-b pb-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  <span className="text-xs font-bold text-rose-500">Dr. Frappe Diagnostic: {diagnostic.category}</span>
                </div>
                <button
                  onClick={() => setShowStudio(true)}
                  className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-500 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Coach Me Through This</span>
                  <Sparkles className="w-3 h-3 text-rose-500" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className={`p-2.5 rounded-xl border ${
                  isDark ? 'bg-slate-950/70 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  <span className={`font-bold block text-[10px] uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>What Happened:</span>
                  {diagnostic.explanation}
                </div>

                <div className={`p-2.5 rounded-xl border ${
                  isDark ? 'bg-blue-950/20 border-blue-500/20 text-blue-200' : 'bg-blue-50 border-blue-200 text-blue-800'
                }`}>
                  <span className="text-blue-500 font-bold block text-[10px] uppercase">Frappe Mental Model:</span>
                  {diagnostic.mentalModel}
                </div>

                <div className={`p-2.5 rounded-xl border ${
                  isDark ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-200' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                }`}>
                  <span className="text-emerald-500 font-bold block text-[10px] uppercase">How to Fix It:</span>
                  {diagnostic.actionStep}
                </div>
              </div>
            </div>
          )}

          {/* Interactive Code Editor */}
          <div className={`flex-1 flex flex-col overflow-hidden rounded-2xl border transition-colors ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            
            {/* Editor Top Bar */}
            <div className={`px-4 py-2.5 border-b flex items-center justify-between ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-800'
            }`}>
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-purple-500" />
                <span className="text-xs font-mono font-bold">
                  {quest.language === 'python' ? `${quest.doctype.toLowerCase().replace(/ /g, '_')}.py` : 'client_script.js'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                    isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 shadow-xs'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5 text-yellow-500" />
                  <span>{showHint ? 'Hide Hint' : 'Hint'}</span>
                </button>
                <button
                  onClick={handleResetCode}
                  className={`p-1.5 rounded transition-colors cursor-pointer ${
                    isDark ? 'text-slate-400 hover:text-red-400 hover:bg-slate-800' : 'text-slate-400 hover:text-red-600 hover:bg-slate-200'
                  }`}
                  title="Reset code to starter template"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Hint Drawer */}
            {showHint && (
              <div className={`border-b p-3 text-xs space-y-2 animate-slide-down ${
                isDark ? 'bg-amber-950/30 border-amber-500/30 text-amber-200' : 'bg-amber-50 border-amber-300 text-amber-900'
              }`}>
                <div className="font-bold flex items-center gap-1 text-amber-500">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Solution Snippet Hint:</span>
                </div>
                <pre className={`p-2 rounded font-mono text-[11px] overflow-x-auto ${
                  isDark ? 'bg-slate-950/90 text-amber-100' : 'bg-white border border-amber-200 text-amber-900 shadow-xs'
                }`}>
                  {quest.solutionCode}
                </pre>
                <button
                  onClick={() => { setCode(quest.solutionCode); setShowHint(false); sounds.playCoin(); }}
                  className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/40 text-amber-700 dark:text-amber-300 text-[11px] font-bold rounded cursor-pointer"
                >
                  Load Solution into Editor
                </button>
              </div>
            )}

            {/* Textarea Code Input */}
            <div className="relative flex-1 min-h-[260px] bg-[#070b14]">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="w-full h-full min-h-[260px] p-4 bg-transparent text-slate-100 font-mono text-xs leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                placeholder="Write your Frappe script here..."
              />
            </div>

            {/* Editor Action Footer */}
            <div className={`p-3 border-t flex items-center justify-between ${
              isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className={`text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Press Run to compile & test assertions
              </span>

              <button
                onClick={handleRunCode}
                disabled={executing}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{executing ? 'Executing...' : 'Run & Validate Quest'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Virtual Frappe Desk & Console Output (5 cols) */}
        <div className="lg:col-span-6 xl:col-span-5 space-y-4 flex flex-col">
          
          {/* Virtual Frappe Desk Simulator */}
          <div className="min-h-[380px] flex-1">
            <DeskSimulator
              doc={docState}
              buttons={buttons}
              fieldProperties={fieldProps}
              alerts={alerts}
              prompts={prompts}
              onFieldChange={handleFieldChange}
              onChildFieldChange={handleChildFieldChange}
              onExecuteButton={handleExecuteButton}
              onClosePrompt={() => setPrompts([])}
            />
          </div>

          {/* Console / Assertion Tests */}
          <div className="h-64">
            <ConsoleOutput
              logs={logs}
              validationResult={validationResult}
              docState={docState}
              onClearLogs={() => setLogs([])}
            />
          </div>
        </div>
      </div>

      {/* Dr. Frappe Mentor Studio Modal */}
      <AgentMentorStudio
        isOpen={showStudio}
        onClose={() => setShowStudio(false)}
        currentQuest={quest}
        currentCode={code}
        lastValidation={validationResult}
        onSelectQuest={() => setShowStudio(false)}
      />
    </div>
  );
}


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
  Award
} from 'lucide-react';
import DeskSimulator from './DeskSimulator';
import ConsoleOutput from './ConsoleOutput';
import { executeAndValidateQuest, VirtualFrappeContext } from '../utils/frappeSimulator';
import { sounds } from '../utils/soundEffects';

export default function QuestDetail({
  quest,
  isCompleted,
  onBack,
  onCompleteQuest
}) {
  const [code, setCode] = useState(quest.starterCode);
  const [showHint, setShowHint] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [executing, setExecuting] = useState(false);
  
  // Simulator State
  const [logs, setLogs] = useState([]);
  const [validationResult, setValidationResult] = useState(null);
  const [simContext, setSimContext] = useState(null);
  const [docState, setDocState] = useState(quest.testDoc);
  const [buttons, setButtons] = useState([]);
  const [fieldProps, setFieldProps] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [prompts, setPrompts] = useState([]);

  // Initialize fresh simulation context when quest changes
  useEffect(() => {
    setCode(quest.starterCode);
    setShowHint(false);
    setValidationResult(null);
    initSimulator(quest.starterCode);
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
      }

      if (result.success) {
        sounds.playSuccess();
        onCompleteQuest(quest);
      } else {
        sounds.playError();
      }

      setExecuting(false);
    }, 150);
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { sounds.playClick(); onBack(); }}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors flex items-center gap-1 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quests</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base md:text-lg font-extrabold text-slate-100 flex items-center gap-2">
                <span>{quest.title}</span>
                {isCompleted && (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Completed</span>
                  </span>
                )}
              </h2>
            </div>
            <p className="text-xs text-slate-400">DocType: <span className="text-blue-400 font-semibold">{quest.doctype}</span> • Level: <span className="text-purple-400 font-semibold">{quest.level}</span></p>
          </div>
        </div>

        {/* Rewards */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>+{quest.xp} XP</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>+{quest.coins} FC</span>
          </div>
        </div>
      </div>

      {/* 2. Main 2-Column Responsive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Briefing, Objectives & Code Editor (7 cols) */}
        <div className="lg:col-span-6 xl:col-span-7 space-y-4 flex flex-col">
          
          {/* Mission Narrative & Objectives Card */}
          <div className="glass-panel p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-400" />
                <span>Mission Briefing & Scenario</span>
              </h3>
            </div>
            
            <div className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
              {quest.briefing}
            </div>

            {/* Objectives Checklist */}
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Target Objectives:
              </span>
              <ul className="space-y-1.5">
                {quest.objectives.map((obj, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Official Frappe Docs Reference Card */}
            {quest.docReference && (
              <div className="bg-blue-950/20 border border-blue-500/30 rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-300">
                    <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                    <span>{quest.docReference.title}</span>
                  </div>
                  <button
                    onClick={handleCopySnippet}
                    className="flex items-center gap-1 px-2 py-0.5 rounded bg-blue-600/20 text-blue-300 hover:bg-blue-600/40 text-[11px] font-medium transition-colors"
                  >
                    {copiedSnippet ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSnippet ? 'Copied!' : 'Copy Snippet'}</span>
                  </button>
                </div>
                <pre className="p-2 bg-slate-950 rounded text-slate-300 font-mono text-[11px] overflow-x-auto">
                  {quest.docReference.codeSnippet}
                </pre>
              </div>
            )}
          </div>

          {/* Interactive Code Editor */}
          <div className="glass-panel flex-1 flex flex-col overflow-hidden">
            
            {/* Editor Top Bar */}
            <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-mono font-bold text-slate-200">
                  {quest.language === 'python' ? `${quest.doctype.toLowerCase().replace(/ /g, '_')}.py` : 'client_script.js'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-yellow-400" />
                  <span>{showHint ? 'Hide Hint' : 'Hint'}</span>
                </button>
                <button
                  onClick={handleResetCode}
                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition-colors"
                  title="Reset code to starter template"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Hint Drawer */}
            {showHint && (
              <div className="bg-amber-950/30 border-b border-amber-500/30 p-3 text-xs text-amber-200 space-y-2 animate-slide-down">
                <div className="font-bold flex items-center gap-1 text-amber-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Solution Snippet Hint:</span>
                </div>
                <pre className="p-2 bg-slate-950/90 rounded font-mono text-[11px] text-amber-100 overflow-x-auto">
                  {quest.solutionCode}
                </pre>
                <button
                  onClick={() => { setCode(quest.solutionCode); setShowHint(false); sounds.playCoin(); }}
                  className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 text-[11px] font-bold rounded"
                >
                  Load Solution into Editor
                </button>
              </div>
            )}

            {/* Textarea Code Input with line numbers feel */}
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
            <div className="bg-slate-900/90 p-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">
                Press Run to compile & test assertions
              </span>

              <button
                onClick={handleRunCode}
                disabled={executing}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
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
    </div>
  );
}

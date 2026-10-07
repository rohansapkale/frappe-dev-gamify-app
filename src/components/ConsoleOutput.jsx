import React, { useState } from 'react';
import { Terminal, CheckCircle2, XCircle, Code2, Trash2, ShieldCheck } from 'lucide-react';

export default function ConsoleOutput({ logs = [], validationResult = null, docState = null, onClearLogs }) {
  const [activeTab, setActiveTab] = useState('trace'); // 'trace' | 'assertions' | 'doc'

  const getLogBadge = (type) => {
    switch (type) {
      case 'frappe':
        return <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold text-[10px]">FRAPPE API</span>;
      case 'success':
        return <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">SUCCESS</span>;
      case 'warn':
        return <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-[10px]">WARN</span>;
      case 'error':
        return <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-bold text-[10px]">ERROR</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 font-bold text-[10px]">INFO</span>;
    }
  };

  return (
    <div className="terminal-window flex flex-col h-full bg-[#070b14] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      
      {/* Terminal Top Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-xs font-mono text-slate-400 font-semibold ml-2 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-blue-400" />
            <span>Frappe Runtime Console</span>
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('trace')}
            className={`px-2 py-0.5 text-[11px] font-mono rounded transition-colors ${
              activeTab === 'trace' ? 'bg-blue-600/30 text-blue-300 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Trace ({logs.length})
          </button>
          <button
            onClick={() => setActiveTab('assertions')}
            className={`px-2 py-0.5 text-[11px] font-mono rounded transition-colors flex items-center gap-1 ${
              activeTab === 'assertions' 
                ? (validationResult?.success ? 'bg-emerald-600/30 text-emerald-300 font-bold' : 'bg-amber-600/30 text-amber-300 font-bold') 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Assertions</span>
            {validationResult && (
              validationResult.success 
                ? <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                : <XCircle className="w-3 h-3 text-red-400" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('doc')}
            className={`px-2 py-0.5 text-[11px] font-mono rounded transition-colors ${
              activeTab === 'doc' ? 'bg-purple-600/30 text-purple-300 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Doc JSON
          </button>

          {logs.length > 0 && (
            <button
              onClick={onClearLogs}
              className="p-1 text-slate-500 hover:text-red-400 rounded transition-colors ml-2"
              title="Clear Console"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Terminal Content Body */}
      <div className="flex-1 p-3 overflow-y-auto font-mono text-xs space-y-2">
        
        {/* Tab 1: Trace Logs */}
        {activeTab === 'trace' && (
          <>
            {logs.length === 0 ? (
              <div className="text-slate-600 italic py-6 text-center">
                Press "Run & Validate Quest" to execute the script in the virtual Frappe runtime.
              </div>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2 py-0.5 hover:bg-slate-900/40 px-1 rounded">
                  <span className="text-slate-600 text-[10px] select-none">{log.timestamp}</span>
                  {getLogBadge(log.type)}
                  <span className={`flex-1 break-all ${
                    log.type === 'error' ? 'text-red-400 font-semibold' :
                    log.type === 'success' ? 'text-emerald-300' :
                    log.type === 'frappe' ? 'text-cyan-300' : 'text-slate-300'
                  }`}>
                    {log.message}
                  </span>
                </div>
              ))
            )}
          </>
        )}

        {/* Tab 2: Validation & Assertions */}
        {activeTab === 'assertions' && (
          <div className="space-y-3 py-2">
            {!validationResult ? (
              <div className="text-slate-600 italic text-center py-6">
                No validation run performed yet.
              </div>
            ) : validationResult.success ? (
              <div className="p-3 bg-emerald-950/30 border border-emerald-500/40 rounded-lg text-emerald-200 space-y-1">
                <div className="flex items-center gap-2 font-bold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ALL TEST ASSERTIONS PASSED!</span>
                </div>
                <p className="text-xs text-emerald-300">{validationResult.message}</p>
              </div>
            ) : (
              <div className="p-3 bg-red-950/30 border border-red-500/40 rounded-lg text-red-200 space-y-1">
                <div className="flex items-center gap-2 font-bold text-red-400">
                  <XCircle className="w-4 h-4" />
                  <span>TEST ASSERTION FAILED</span>
                </div>
                <p className="text-xs text-red-300">{validationResult.message}</p>
                <p className="text-[11px] text-slate-400 pt-1">
                  💡 Hint: Review the acceptance criteria in the briefing or click "Need a Hint?".
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Doc JSON Inspector */}
        {activeTab === 'doc' && (
          <div className="space-y-1">
            <div className="text-[11px] text-slate-400 flex items-center justify-between pb-1 border-b border-slate-800">
              <span>In-Memory Document State (frm.doc)</span>
              <span className="text-purple-400">{docState?.doctype || 'Document'}</span>
            </div>
            <pre className="p-2 bg-slate-950 rounded text-slate-300 text-[11px] overflow-x-auto">
              {JSON.stringify(docState || {}, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

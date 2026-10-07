import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  Layers, 
  Sparkles, 
  Code2, 
  FileCode, 
  Terminal, 
  Check, 
  Copy,
  BookOpen
} from 'lucide-react';
import DeskSimulator from './DeskSimulator';
import ConsoleOutput from './ConsoleOutput';
import { VirtualFrappeContext } from '../utils/frappeSimulator';
import { sounds } from '../utils/soundEffects';
import { useTheme } from '../context/ThemeContext';

const SAMPLE_DOCTYPES = {
  'Sales Order': {
    doctype: 'Sales Order',
    name: 'SO-2026-7701',
    customer: 'Aether Logistics Corp',
    status: 'Draft',
    docstatus: 0,
    grand_total: 18500,
    customer_notes: '',
    items: [
      { name: 'row-1', item_code: 'SERVER-BLADE-X', qty: 2, rate: 4500, discount_amount: 500, amount: 8500 },
      { name: 'row-2', item_code: 'MONITOR-4K', qty: 4, rate: 500, discount_amount: 0, amount: 2000 }
    ]
  },
  'Customer': {
    doctype: 'Customer',
    name: 'CUST-0099',
    customer_name: 'Starlight Global',
    customer_type: 'Company',
    tax_id: 'US-9912048',
    company_registration_no: 'REG-5521-X'
  },
  'Quotation': {
    doctype: 'Quotation',
    name: 'QTN-2026-4402',
    party_name: 'Solaris Cybernetics',
    status: 'Open',
    docstatus: 1,
    grand_total: 34000,
    items: [
      { name: 'row-1', item_code: 'MACBOOK-PRO', qty: 10, rate: 2000, discount_amount: 1000, amount: 19000 },
      { name: 'row-2', item_code: 'ITM-FIBER-01', qty: 100, rate: 45, discount_amount: 0, amount: 4500 }
    ]
  }
};

const TEMPLATES = [
  {
    name: 'Add Custom Button',
    code: `frappe.ui.form.on(frm.doctype, {
    refresh(frm) {
        // Add custom button inside Actions dropdown
        frm.add_custom_button('Fast Approve', () => {
            frm.set_value('status', 'Submitted');
            frappe.show_alert('Document approved successfully!', 5);
        }, 'Actions');
    }
});`
  },
  {
    name: 'Dynamic Field Rules',
    code: `frappe.ui.form.on(frm.doctype, {
    refresh(frm) {
        // Toggle field requirement and display
        frm.set_df_property('customer_notes', 'reqd', 1);
        frappe.show_alert('Customer notes is now mandatory');
    }
});`
  },
  {
    name: 'Interactive Prompt Modal',
    code: `frappe.ui.form.on(frm.doctype, {
    refresh(frm) {
        frm.add_custom_button('Apply Custom Discount', () => {
            frappe.prompt([
                { label: 'Discount %', fieldname: 'pct', fieldtype: 'Currency', default: 10 },
                { label: 'Approval Reason', fieldname: 'reason', fieldtype: 'Data', reqd: 1 }
            ], (values) => {
                frm.set_value('customer_notes', 'Discount: ' + values.pct + '% (' + values.reason + ')');
                frappe.show_alert('Discount applied to document!');
            }, 'Apply Discount', 'Apply');
        }, 'Actions');
    }
});`
  },
  {
    name: 'Dashboard Headline',
    code: `frappe.ui.form.on(frm.doctype, {
    refresh(frm) {
        frm.dashboard.set_headline(
            '<span style="color: #60a5fa; font-weight: bold;">⚡ Notice:</span> Expedited priority processing active for this document.'
        );
        frappe.show_alert('Headline banner mounted!');
    }
});`
  }
];

export default function SandboxMode({ onSandboxAction }) {
  const { isDark } = useTheme();
  const [selectedDocType, setSelectedDocType] = useState('Sales Order');
  const [code, setCode] = useState(TEMPLATES[0].code);
  const [copied, setCopied] = useState(false);

  // Simulator Context State
  const [logs, setLogs] = useState([]);
  const [simContext, setSimContext] = useState(null);
  const [docState, setDocState] = useState(SAMPLE_DOCTYPES['Sales Order']);
  const [buttons, setButtons] = useState([]);
  const [fieldProps, setFieldProps] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [prompts, setPrompts] = useState([]);

  const handleDocTypeChange = (newDocType) => {
    setSelectedDocType(newDocType);
    const newDoc = SAMPLE_DOCTYPES[newDocType];
    setDocState(newDoc);
    setButtons([]);
    setFieldProps({});
    setAlerts([]);
    setLogs([
      {
        type: 'info',
        message: `Switched DocType context to '${newDocType}'`,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  };

  const handleRunSandbox = () => {
    sounds.playClick();
    const context = new VirtualFrappeContext(docState);
    const frm = context.createVirtualFrm();
    const frappe = context.createVirtualFrappe(frm);
    const _ = (t) => t;
    const locals = context.locals;

    try {
      const fn = new Function('frappe', 'frm', '_', 'locals', code);
      fn(frappe, frm, _, locals);

      setSimContext(context);
      setDocState({ ...context.doc });
      setButtons([...context.buttons]);
      setFieldProps({ ...context.fieldProperties });
      setAlerts([...context.alerts]);
      setPrompts([...context.prompts]);
      setLogs(context.logs);

      sounds.playSuccess();
      if (onSandboxAction) onSandboxAction();

    } catch (err) {
      sounds.playError();
      context.log('error', `Sandbox Runtime Error: ${err.message}`);
      setLogs(context.logs);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    sounds.playCoin();
    setTimeout(() => setCopied(false), 2000);
  };

  // Desk Simulator Event Handlers
  const handleFieldChange = (fieldname, value) => {
    if (simContext) {
      simContext.doc[fieldname] = value;
      simContext.triggerFieldChange(fieldname);
      setDocState({ ...simContext.doc });
      setFieldProps({ ...simContext.fieldProperties });
    } else {
      setDocState(prev => ({ ...prev, [fieldname]: value }));
    }
  };

  const handleChildFieldChange = (rowIndex, fieldname, value) => {
    if (docState.items && docState.items[rowIndex]) {
      const items = [...docState.items];
      items[rowIndex] = { ...items[rowIndex], [fieldname]: value };
      setDocState(prev => ({ ...prev, items }));
      if (simContext) {
        simContext.triggerChildEvent(items[rowIndex].doctype, fieldname, items[rowIndex].doctype, items[rowIndex].name);
      }
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
      
      {/* Sandbox Header */}
      <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl border transition-colors ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div>
          <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            <Terminal className="w-5 h-5 text-blue-500" />
            <span>Freeform Frappe Desk Sandbox</span>
          </h2>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Write any client script snippet, toggle fields, add buttons, and test Frappe UI reactions in real time.
          </p>
        </div>

        {/* DocType Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Active DocType:</span>
          <select
            value={selectedDocType}
            onChange={(e) => handleDocTypeChange(e.target.value)}
            className={`font-bold text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500 border cursor-pointer ${
              isDark ? 'bg-slate-950 border-slate-700 text-blue-300' : 'bg-slate-50 border-slate-300 text-blue-700'
            }`}
          >
            {Object.keys(SAMPLE_DOCTYPES).map(dt => (
              <option key={dt} value={dt}>{dt}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Snippet Template Quick Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className={`text-xs font-bold uppercase tracking-wider whitespace-nowrap ${
          isDark ? 'text-slate-500' : 'text-slate-500'
        }`}>
          Load Template:
        </span>
        {TEMPLATES.map((tmpl, idx) => (
          <button
            key={idx}
            onClick={() => { sounds.playClick(); setCode(tmpl.code); }}
            className={`px-3 py-1 border rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              isDark 
                ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-blue-300 border-slate-800' 
                : 'bg-white hover:bg-slate-100 text-slate-700 hover:text-blue-700 border-slate-200 shadow-xs'
            }`}
          >
            <Sparkles className="w-3 h-3 text-purple-500" />
            <span>{tmpl.name}</span>
          </button>
        ))}
      </div>

      {/* 2-Column Responsive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left: Code Editor */}
        <div className={`lg:col-span-6 xl:col-span-7 flex flex-col overflow-hidden min-h-[420px] rounded-2xl border transition-colors ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          
          <div className={`px-4 py-2.5 border-b flex items-center justify-between ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-blue-500" />
              <span className={`text-xs font-mono font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                custom_script_{selectedDocType.toLowerCase().replace(/ /g, '_')}.js
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                  isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-xs'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={() => setCode(TEMPLATES[0].code)}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  isDark ? 'text-slate-400 hover:text-red-400 hover:bg-slate-800' : 'text-slate-500 hover:text-red-500 hover:bg-slate-200'
                }`}
                title="Reset"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex-1 bg-[#070b14] p-2">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="w-full h-full min-h-[300px] p-3 bg-transparent text-slate-100 font-mono text-xs leading-relaxed resize-none focus:outline-none"
              placeholder="// Write your Frappe client script..."
            />
          </div>

          <div className={`p-3 border-t flex items-center justify-between ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              frappe and frm are bound in sandbox scope
            </span>

            <button
              onClick={handleRunSandbox}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Run in Sandbox</span>
            </button>
          </div>
        </div>

        {/* Right: Desk Simulator & Console Output */}
        <div className="lg:col-span-6 xl:col-span-5 space-y-4 flex flex-col">
          <div className="min-h-[360px]">
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

          <div className="h-56">
            <ConsoleOutput
              logs={logs}
              validationResult={null}
              docState={docState}
              onClearLogs={() => setLogs([])}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

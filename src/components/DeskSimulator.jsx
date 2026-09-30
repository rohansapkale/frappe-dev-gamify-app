import React, { useState } from 'react';
import { 
  ChevronDown, 
  Save, 
  Printer, 
  RotateCw, 
  Search, 
  Bell, 
  User, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  X,
  Layers,
  Sparkles,
  MousePointerClick
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export default function DeskSimulator({
  doc,
  buttons = [],
  fieldProperties = {},
  alerts = [],
  messages = [],
  prompts = [],
  onFieldChange,
  onChildFieldChange,
  onExecuteButton,
  onClosePrompt
}) {
  const [openGroup, setOpenGroup] = useState(null);
  const [activeTab, setActiveTab] = useState('details');

  // Categorize buttons into ungrouped vs grouped
  const standaloneButtons = buttons.filter(b => !b.group);
  const groupedButtons = buttons.reduce((acc, b) => {
    if (b.group) {
      if (!acc[b.group]) acc[b.group] = [];
      acc[b.group].push(b);
    }
    return acc;
  }, {});

  const getStatusClass = (status, docstatus) => {
    if (docstatus === 1 || status === 'Submitted' || status === 'Active') return 'frappe-status-submitted';
    if (docstatus === 2 || status === 'Cancelled') return 'frappe-status-cancelled';
    return 'frappe-status-draft';
  };

  const isFieldRequired = (fieldName) => {
    return fieldProperties[fieldName]?.reqd === 1;
  };

  const isFieldHidden = (fieldName) => {
    return fieldProperties[fieldName]?.hidden === 1;
  };

  return (
    <div className="frappe-desk-view flex flex-col h-full relative">
      
      {/* 1. Frappe Top Navbar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-slate-100 bg-slate-800/80 px-2 py-1 rounded">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Frappe Desk</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-slate-400">
            <span>Desk</span>
            <span>/</span>
            <span>{doc.doctype || 'Document'}</span>
            <span>/</span>
            <span className="text-blue-400 font-semibold">{doc.name || 'NEW-DOC'}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1 bg-slate-950/80 border border-slate-800 px-2.5 py-1 rounded-md text-slate-400">
            <Search className="w-3 h-3 text-slate-500" />
            <span className="text-[11px]">Search or type a command (Ctrl + G)</span>
          </div>
          <button className="p-1 text-slate-400 hover:text-slate-200">
            <Bell className="w-3.5 h-3.5" />
          </button>
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center font-bold text-[11px] text-white">
            E
          </div>
        </div>
      </div>

      {/* 2. Document Page Header */}
      <div className="frappe-desk-header flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-100">
                {doc.customer_name || doc.party_name || doc.name || doc.doctype}
              </h2>
              <span className={`frappe-badge-status ${getStatusClass(doc.status, doc.docstatus)}`}>
                {doc.status || (doc.docstatus === 1 ? 'Submitted' : 'Draft')}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">{doc.doctype} • {doc.name}</p>
          </div>
        </div>

        {/* Action Button Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          
          {/* Standard Save/Reload buttons */}
          <button className="frappe-btn frappe-btn-default text-xs py-1 px-2.5">
            <Save className="w-3 h-3 text-slate-400" />
            <span>Save</span>
          </button>

          {/* Grouped Dropdowns (e.g., 'Actions', 'Create') */}
          {Object.keys(groupedButtons).map(groupName => (
            <div key={groupName} className="relative">
              <button
                onClick={() => { sounds.playClick(); setOpenGroup(openGroup === groupName ? null : groupName); }}
                className="frappe-btn frappe-btn-default text-xs py-1 px-2.5 flex items-center gap-1.5 border-blue-500/40 text-blue-300 bg-blue-950/40 hover:bg-blue-900/40"
              >
                <Sparkles className="w-3 h-3 text-blue-400" />
                <span>{groupName}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {openGroup === groupName && (
                <div className="absolute right-0 mt-1 w-48 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl py-1 z-30 animate-slide-down">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    {groupName} Menu
                  </div>
                  {groupedButtons[groupName].map(btn => (
                    <button
                      key={btn.id}
                      onClick={() => {
                        sounds.playClick();
                        setOpenGroup(null);
                        onExecuteButton(btn);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-blue-600/30 hover:text-blue-200 flex items-center gap-2 transition-colors"
                    >
                      <MousePointerClick className="w-3 h-3 text-purple-400" />
                      <span>{btn.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Standalone Custom Buttons (Added by frm.add_custom_button) */}
          {standaloneButtons.map(btn => (
            <button
              key={btn.id}
              onClick={() => {
                sounds.playClick();
                onExecuteButton(btn);
              }}
              className="frappe-btn frappe-btn-custom text-xs py-1 px-3 flex items-center gap-1.5 font-semibold"
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>{btn.label}</span>
            </button>
          ))}

          {buttons.length === 0 && (
            <span className="text-[11px] text-slate-500 italic px-1">
              (No custom buttons added yet)
            </span>
          )}
        </div>
      </div>

      {/* 3. Form Body Content */}
      <div className="frappe-desk-body flex-1 overflow-y-auto space-y-4">
        
        {/* Headline / Banner if set */}
        {doc.headline && (
          <div 
            className="p-3 bg-blue-950/40 border border-blue-500/30 rounded-lg text-xs text-blue-200 flex items-center gap-2"
            dangerouslySetInnerHTML={{ __html: doc.headline }}
          />
        )}

        {/* Main Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
          
          {/* Customer / Party Name */}
          {(doc.customer || doc.customer_name || doc.party_name) && (
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                <span>Customer</span>
                <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                readOnly
                value={doc.customer || doc.customer_name || doc.party_name || ''}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          )}

          {/* Customer Type (For Dynamic Fields Quest) */}
          {doc.doctype === 'Customer' && (
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                <span>Customer Type</span>
                <span className="text-red-400">*</span>
              </label>
              <select
                value={doc.customer_type || 'Individual'}
                onChange={(e) => onFieldChange('customer_type', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-blue-300 font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="Individual">Individual</option>
                <option value="Company">Company</option>
              </select>
            </div>
          )}

          {/* Tax ID */}
          {!isFieldHidden('tax_id') && (doc.doctype === 'Customer' || doc.tax_id !== undefined) && (
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <span>Tax ID / VAT No</span>
                  {isFieldRequired('tax_id') && <span className="text-red-400 font-bold">* (Mandatory)</span>}
                </span>
                {isFieldRequired('tax_id') && (
                  <span className="text-[10px] text-amber-400 font-semibold">reqd: 1</span>
                )}
              </label>
              <input
                type="text"
                value={doc.tax_id || ''}
                onChange={(e) => onFieldChange('tax_id', e.target.value)}
                placeholder={isFieldRequired('tax_id') ? "Enter mandatory Tax ID..." : "Optional Tax ID"}
                className={`w-full bg-slate-950 border rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none ${
                  isFieldRequired('tax_id') ? 'border-amber-500/50 bg-amber-950/10' : 'border-slate-800'
                }`}
              />
            </div>
          )}

          {/* Company Registration No */}
          {!isFieldHidden('company_registration_no') && (doc.doctype === 'Customer' || doc.company_registration_no !== undefined) && (
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
                <span>Company Registration No</span>
                <span className="text-[10px] text-emerald-400 font-semibold">visible</span>
              </label>
              <input
                type="text"
                value={doc.company_registration_no || ''}
                onChange={(e) => onFieldChange('company_registration_no', e.target.value)}
                placeholder="e.g. US-REG-88219"
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          )}

          {/* Customer Notes */}
          {doc.customer_notes !== undefined && (
            <div className="space-y-1 md:col-span-2">
              <label className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
                <span>Customer Notes & VIP Directives</span>
                {doc.customer_notes?.includes('VIP') && (
                  <span className="text-[10px] text-purple-300 font-bold bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/40">
                    VIP Mode Active
                  </span>
                )}
              </label>
              <textarea
                rows={2}
                value={doc.customer_notes || ''}
                onChange={(e) => onFieldChange('customer_notes', e.target.value)}
                placeholder="Notes for order fulfillment..."
                className={`w-full bg-slate-950 border rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none ${
                  doc.customer_notes?.includes('VIP') 
                    ? 'border-purple-500/60 bg-purple-950/20 text-purple-200 font-medium' 
                    : 'border-slate-800'
                }`}
              />
            </div>
          )}

          {/* Discount Percentage / Total */}
          {doc.discount_percentage !== undefined && (
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-400">Discount Percentage (%)</label>
              <input
                type="number"
                value={doc.discount_percentage || 0}
                onChange={(e) => onFieldChange('discount_percentage', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200"
              />
            </div>
          )}

          {/* Grand / Total Amount */}
          {(doc.grand_total !== undefined || doc.total_amount !== undefined) && (
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-400">Total Amount</label>
              <div className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-bold text-emerald-400">
                ${Number(doc.total_amount !== undefined ? doc.total_amount : doc.grand_total || 0).toLocaleString()}
              </div>
            </div>
          )}
        </div>

        {/* Child Table: Items Grid */}
        {doc.items && Array.isArray(doc.items) && (
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span>Items Child Table ({doc.doctype} Item)</span>
              </h3>
              <span className="text-[11px] text-slate-500">Edit Qty/Rate to trigger child table script</span>
            </div>

            <div className="overflow-x-auto border border-slate-800 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-2">Item Code</th>
                    <th className="p-2 w-20">Qty</th>
                    <th className="p-2 w-24">Rate ($)</th>
                    <th className="p-2 w-24">Discount ($)</th>
                    <th className="p-2 w-24 text-right">Amount ($)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {doc.items.map((item, idx) => (
                    <tr key={item.name || idx} className="hover:bg-slate-800/30">
                      <td className="p-2 font-mono text-[11px] text-blue-300">{item.item_code || item.item_name}</td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={item.qty}
                          onChange={(e) => onChildFieldChange(idx, 'qty', Number(e.target.value))}
                          className="w-16 bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-xs text-slate-100"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={item.rate}
                          onChange={(e) => onChildFieldChange(idx, 'rate', Number(e.target.value))}
                          className="w-20 bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-xs text-slate-100"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={item.discount_amount || 0}
                          onChange={(e) => onChildFieldChange(idx, 'discount_amount', Number(e.target.value))}
                          className="w-20 bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-xs text-slate-100"
                        />
                      </td>
                      <td className="p-2 text-right font-semibold text-emerald-400">
                        ${Number(item.amount || 0).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 4. Live Frappe Alert Toast Overlay (frappe.show_alert) */}
      {alerts.length > 0 && (
        <div className="absolute top-14 right-4 z-40 space-y-2 max-w-sm pointer-events-none">
          {alerts.map((alert, idx) => (
            <div
              key={idx}
              className="bg-slate-900/95 border border-blue-500/50 text-slate-100 p-3 rounded-lg shadow-2xl flex items-center gap-2.5 animate-slide-down pointer-events-auto backdrop-blur-md"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-xs font-medium">{alert.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* 5. Live Frappe Prompt / Modal Dialog (frappe.prompt) */}
      {prompts.length > 0 && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-5 shadow-2xl space-y-4 animate-slide-down">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-400" />
                <span>{prompts[0].title || 'Frappe Prompt Dialog'}</span>
              </h3>
              <button 
                onClick={onClosePrompt}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {(prompts[0].fields || []).map(f => (
                <div key={f.fieldname} className="space-y-1">
                  <label className="text-xs text-slate-300 font-medium">
                    {f.label} {f.reqd && <span className="text-red-400">*</span>}
                  </label>
                  <input
                    type={f.fieldtype === 'Date' ? 'date' : (f.fieldtype === 'Currency' ? 'number' : 'text')}
                    defaultValue={prompts[0].defaultValues?.[f.fieldname] || ''}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={onClosePrompt}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-800 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  sounds.playSuccess();
                  if (prompts[0].callback) prompts[0].callback(prompts[0].defaultValues);
                  onClosePrompt();
                }}
                className="px-4 py-1.5 text-xs text-white bg-blue-600 hover:bg-blue-500 font-semibold rounded shadow-md"
              >
                Submit Dialog
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

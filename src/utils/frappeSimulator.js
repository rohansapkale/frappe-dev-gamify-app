// Virtual Frappe & ERPNext Runtime Engine & Test Validator

export class VirtualFrappeContext {
  constructor(initialDoc = {}) {
    this.reset(initialDoc);
  }

  reset(initialDoc = {}) {
    // Deep clone doc
    this.doc = JSON.parse(JSON.stringify(initialDoc || {}));
    if (!this.doc.doctype) this.doc.doctype = 'Sales Order';
    if (!this.doc.name) this.doc.name = 'DOC-2026-0001';

    this.logs = [];
    this.alerts = [];
    this.messages = [];
    this.prompts = [];
    this.calls = [];
    this.buttons = []; // [{ label, group, action, id }]
    this.fieldProperties = {}; // { [fieldname]: { reqd, hidden, read_only, label } }
    this.registeredHandlers = {}; // { [doctype]: { [event]: fn } }
    this.linkQueries = {}; // { [fieldname]: filterFn }

    // Init locals table
    this.locals = {};
    if (this.doc.doctype) {
      this.locals[this.doc.doctype] = {
        [this.doc.name]: this.doc
      };
    }

    // Populate child tables into locals
    Object.keys(this.doc).forEach(key => {
      if (Array.isArray(this.doc[key])) {
        const childList = this.doc[key];
        childList.forEach((child, index) => {
          const childDoctype = child.doctype || `${this.doc.doctype} Item`;
          child.doctype = childDoctype;
          if (!child.name) child.name = `row-${index + 1}`;
          if (!this.locals[childDoctype]) this.locals[childDoctype] = {};
          this.locals[childDoctype][child.name] = child;
        });
      }
    });

    this.mockDatabase = {
      'Item': {
        'ITM-FIBER-01': { item_name: 'Ultra Fiber 10G Cable', stock_uom: 'Meter', standard_rate: 45 },
        'MACBOOK-PRO': { item_name: 'MacBook Pro M3 Max', stock_uom: 'Nos', standard_rate: 2000 },
        'MONITOR-4K': { item_name: '4K UltraStudio Monitor', stock_uom: 'Nos', standard_rate: 500 },
        'SERVER-BLADE-X': { item_name: 'Blade Server X8', stock_uom: 'Unit', standard_rate: 4500 }
      },
      'Customer': {
        'CUST-0042': { customer_name: 'Acme Technologies', customer_group: 'Commercial', territory: 'Global' },
        'CUST-001': { customer_name: 'Nexus Corp Global', customer_group: 'Commercial', territory: 'North America' }
      }
    };
  }

  log(type, message, details = null) {
    this.logs.push({
      type, // 'info' | 'success' | 'warn' | 'error' | 'frappe'
      message,
      details,
      timestamp: new Date().toLocaleTimeString()
    });
  }

  createVirtualFrm() {
    const ctx = this;

    const frm = {
      doc: ctx.doc,
      doctype: ctx.doc.doctype,
      docname: ctx.doc.name,

      add_custom_button: (label, action, group) => {
        ctx.log('frappe', `frm.add_custom_button('${label}'${group ? `, group='${group}'` : ''})`);
        ctx.buttons = ctx.buttons.filter(b => b.label.toLowerCase() !== label.toLowerCase());
        ctx.buttons.push({
          id: `btn-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          label,
          action,
          group: group || null
        });
        return frm;
      },

      remove_custom_button: (label, group) => {
        ctx.log('frappe', `frm.remove_custom_button('${label}'${group ? `, group='${group}'` : ''})`);
        ctx.buttons = ctx.buttons.filter(b => {
          if (group) {
            return !(b.label === label && b.group === group);
          }
          return b.label !== label;
        });
      },

      set_query: (fieldname, filterFn) => {
        ctx.linkQueries[fieldname] = filterFn;
        ctx.log('frappe', `frm.set_query('${fieldname}') - dynamic link filter bound`);
      },

      get_query_filter: (fieldname) => {
        if (ctx.linkQueries[fieldname]) {
          try {
            return ctx.linkQueries[fieldname]();
          } catch (e) {
            return null;
          }
        }
        return null;
      },

      set_value: (fieldname, value) => {
        ctx.doc[fieldname] = value;
        ctx.log('frappe', `frm.set_value('${fieldname}', ${JSON.stringify(value)})`);
        ctx.triggerFieldChange(fieldname);
        return Promise.resolve(ctx.doc);
      },

      set_df_property: (fieldname, prop, value) => {
        if (!ctx.fieldProperties[fieldname]) ctx.fieldProperties[fieldname] = {};
        ctx.fieldProperties[fieldname][prop] = value;
        ctx.log('frappe', `frm.set_df_property('${fieldname}', '${prop}', ${JSON.stringify(value)})`);
      },

      get_df_property: (fieldname, prop) => {
        if (ctx.fieldProperties[fieldname] && ctx.fieldProperties[fieldname][prop] !== undefined) {
          return ctx.fieldProperties[fieldname][prop];
        }
        return undefined;
      },

      toggle_reqd: (fieldname, isReqd) => {
        frm.set_df_property(fieldname, 'reqd', isReqd ? 1 : 0);
      },

      toggle_display: (fieldname, isDisplay) => {
        frm.set_df_property(fieldname, 'hidden', isDisplay ? 0 : 1);
      },

      get_field: (fieldname) => {
        return {
          df: {
            fieldname,
            reqd: frm.get_df_property(fieldname, 'reqd') || 0,
            hidden: frm.get_df_property(fieldname, 'hidden') || 0,
            read_only: frm.get_df_property(fieldname, 'read_only') || 0,
          }
        };
      },

      refresh_field: (fieldname) => {
        ctx.log('frappe', `frm.refresh_field('${fieldname}') - UI re-rendered`);
      },

      refresh: () => {
        ctx.log('frappe', `frm.refresh() triggered`);
        if (ctx.registeredHandlers[ctx.doc.doctype] && ctx.registeredHandlers[ctx.doc.doctype].refresh) {
          ctx.registeredHandlers[ctx.doc.doctype].refresh(frm);
        }
      },

      trigger: (eventName) => {
        ctx.log('frappe', `frm.trigger('${eventName}')`);
        if (ctx.registeredHandlers[ctx.doc.doctype] && ctx.registeredHandlers[ctx.doc.doctype][eventName]) {
          ctx.registeredHandlers[ctx.doc.doctype][eventName](frm);
        }
      },

      page: {
        set_title: (title) => {
          ctx.doc.title = title;
          ctx.log('frappe', `frm.page.set_title('${title}')`);
        },
        set_indicator: (label, color) => {
          ctx.doc.status_indicator = { label, color };
          ctx.log('frappe', `frm.page.set_indicator('${label}', '${color}')`);
        },
        clear_custom_buttons: () => {
          ctx.buttons = [];
        }
      },

      dashboard: {
        set_headline: (html) => {
          ctx.doc.headline = html;
          ctx.log('frappe', `frm.dashboard.set_headline('${html}')`);
        },
        clear_headline: () => {
          delete ctx.doc.headline;
        }
      }
    };

    return frm;
  }

  createVirtualFrappe(frm) {
    const ctx = this;

    const frappe = {
      _ : (txt) => txt,

      msgprint: (options, title) => {
        let msg = typeof options === 'object' ? options.message : options;
        let t = typeof options === 'object' ? (options.title || title) : title;
        let indicator = typeof options === 'object' ? options.indicator : 'blue';
        ctx.messages.push({ message: msg, title: t || 'Notification', indicator });
        ctx.log('info', `[frappe.msgprint] ${t ? t + ': ' : ''}${msg}`);
      },

      throw: (options, title) => {
        let msg = typeof options === 'object' ? options.message : options;
        ctx.messages.push({ message: msg, title: title || 'Error', indicator: 'red' });
        ctx.log('error', `[frappe.throw] ${msg}`);
        throw new Error(msg);
      },

      show_alert: (options, duration = 5) => {
        let message = typeof options === 'object' ? options.message : options;
        let indicator = typeof options === 'object' ? (options.indicator || 'blue') : 'blue';
        ctx.alerts.push({ message, indicator, duration });
        ctx.log('success', `[frappe.show_alert] ${message}`);
      },

      confirm: (message, if_yes, if_no) => {
        ctx.log('info', `[frappe.confirm] ${message}`);
        if (if_yes) if_yes();
      },

      prompt: (fields, callback, title, primary_label) => {
        ctx.log('info', `[frappe.prompt] Rendered modal dialog: "${title || 'Input Required'}"`);
        const defaultValues = {};
        (fields || []).forEach(f => {
          defaultValues[f.fieldname] = f.default || (f.fieldtype === 'Date' ? '2026-10-01' : (f.fieldtype === 'Currency' ? 500 : 'Sample Value'));
        });
        ctx.prompts.push({ fields, title, defaultValues, callback });
        if (callback) {
          setTimeout(() => {
            try { callback(defaultValues); } catch(e) {}
          }, 0);
        }
      },

      call: (opts) => {
        ctx.calls.push(opts);
        ctx.log('frappe', `frappe.call({ method: '${opts.method}' })`);
        const mockResponse = { message: 'OK', exc: null };
        if (opts.callback) {
          opts.callback(mockResponse);
        }
        return Promise.resolve(mockResponse);
      },

      model: {
        set_value: (cdt, cdn, fieldname, value) => {
          if (!ctx.locals[cdt]) ctx.locals[cdt] = {};
          if (!ctx.locals[cdt][cdn]) ctx.locals[cdt][cdn] = {};
          ctx.locals[cdt][cdn][fieldname] = value;
          ctx.log('frappe', `frappe.model.set_value('${cdt}', '${cdn}', '${fieldname}', ${JSON.stringify(value)})`);
        }
      },

      db: {
        get_value: (doctype, name, fields, as_dict = false) => {
          ctx.log('frappe', `frappe.db.get_value('${doctype}', '${name}', ${JSON.stringify(fields)})`);
          const table = ctx.mockDatabase[doctype] || {};
          const record = table[name];
          if (!record) return null;
          if (Array.isArray(fields)) {
            if (as_dict) {
              const res = {};
              fields.forEach(f => { res[f] = record[f]; });
              return res;
            }
            return fields.map(f => record[f]);
          } else if (typeof fields === 'string') {
            return record[fields];
          }
          return record;
        },

        set_value: (doctype, name, fieldname, value) => {
          ctx.log('frappe', `frappe.db.set_value('${doctype}', '${name}', '${fieldname}', ${JSON.stringify(value)})`);
          if (!ctx.mockDatabase[doctype]) ctx.mockDatabase[doctype] = {};
          if (!ctx.mockDatabase[doctype][name]) ctx.mockDatabase[doctype][name] = {};
          ctx.mockDatabase[doctype][name][fieldname] = value;
          return Promise.resolve();
        },

        get_list: (doctype, args) => {
          ctx.log('frappe', `frappe.db.get_list('${doctype}', ${JSON.stringify(args)})`);
          return Object.values(ctx.mockDatabase[doctype] || {});
        }
      },

      datetime: {
        nowdate: () => new Date().toISOString().split('T')[0],
        now_datetime: () => new Date().toISOString().replace('T', ' ').slice(0, 19),
        add_days: (dateStr, days) => {
          const d = new Date(dateStr);
          d.setDate(d.getDate() + days);
          return d.toISOString().split('T')[0];
        }
      },

      format_value: (val, df, doc) => {
        if (df && df.fieldtype === 'Currency') {
          return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(val) || 0);
        }
        return val !== undefined && val !== null ? String(val) : '';
      },

      ui: {
        form: {
          on: (doctype, handlers) => {
            ctx.registeredHandlers[doctype] = handlers;
            ctx.log('frappe', `Registered form event handlers on '${doctype}' [${Object.keys(handlers).join(', ')}]`);
            if (doctype === ctx.doc.doctype && handlers.refresh && frm) {
              handlers.refresh(frm);
            }
          }
        }
      }
    };

    return frappe;
  }

  triggerFieldChange(fieldname) {
    if (this.registeredHandlers[this.doc.doctype] && this.registeredHandlers[this.doc.doctype][fieldname]) {
      const frm = this.createVirtualFrm();
      this.registeredHandlers[this.doc.doctype][fieldname](frm);
    }
  }

  triggerChildEvent(cdt, event, childDoctype, cdn) {
    if (this.registeredHandlers[cdt] && this.registeredHandlers[cdt][event]) {
      const frm = this.createVirtualFrm();
      this.registeredHandlers[cdt][event](frm, childDoctype, cdn);
    }
  }
}

// Python & Jinja execution simulation helpers
export class PythonSimulator {
  constructor(code) {
    this.code = code || '';
  }

  runValidation(docData) {
    const code = this.code;

    // Journal Entry double-entry check
    if (docData.accounts) {
      const totalDebit = docData.accounts.reduce((acc, r) => acc + (Number(r.debit) || 0), 0);
      const totalCredit = docData.accounts.reduce((acc, r) => acc + (Number(r.credit) || 0), 0);

      if (Math.round(totalDebit * 100) !== Math.round(totalCredit * 100)) {
        if (code.includes('throw') && (code.includes('Debit') || code.includes('debit'))) {
          return {
            threw: true,
            message: `Total Debit (${totalDebit}) must equal Total Credit (${totalCredit})`
          };
        }
      }
    }
    
    // Check discount logic for Sales Invoice
    if (docData.discount_percentage > 25) {
      if (code.includes('discount_percentage') && (code.includes('25') || code.includes('frappe.throw'))) {
        return { threw: true, message: "Maximum discount allowed is 25%" };
      }
    }

    // Check item qty logic
    if (docData.items) {
      for (let item of docData.items) {
        if (item.qty <= 0) {
          if (code.includes('qty') && code.includes('frappe.throw')) {
            return { threw: true, message: `Quantity must be greater than 0 for item ${item.item_code}` };
          }
        }
      }
    }

    // CRM Lead Qualification validation
    if (docData.doctype === 'CRM Lead' && docData.status === 'Qualified') {
      if (!docData.email_id || !docData.email_id.trim()) {
        if (code.includes('throw') && (code.includes('email_id') || code.includes('Email'))) {
          return { threw: true, message: "Email Address is mandatory to qualify a Lead" };
        }
      }
      if (!docData.annual_revenue || Number(docData.annual_revenue) <= 0) {
        if (code.includes('throw') && (code.includes('annual_revenue') || code.includes('Revenue') || code.includes('revenue'))) {
          return { threw: true, message: "Annual Revenue must be greater than 0 to qualify a Lead" };
        }
      }
      if (code.includes('sarah.na@company.com')) {
        docData.territory_rep = 'sarah.na@company.com';
      }
      if (code.includes('today()') || code.includes('qualified_date')) {
        docData.qualified_date = '2026-10-02';
      }
    }

    // CRM Deal Enterprise Approval & Webhook validation
    if (docData.doctype === 'CRM Deal' && docData.stage === 'Won') {
      if (Number(docData.deal_value || 0) >= 100000) {
        if (!docData.manager_approved) {
          if (code.includes('throw') && (code.includes('manager_approved') || code.includes('Approval') || code.includes('approval') || code.includes('Manager'))) {
            return { threw: true, message: "Enterprise deals exceeding $100,000 require Manager Approval before closing" };
          }
        }
        if (!docData.tax_id || !docData.tax_id.trim()) {
          if (code.includes('throw') && (code.includes('tax_id') || code.includes('Tax') || code.includes('tax'))) {
            return { threw: true, message: "Tax ID / VAT Number is required for closed enterprise deals" };
          }
        }
        if (code.includes('Pending Webhook Sync') || code.includes('billing_status')) {
          docData.billing_status = 'Pending Webhook Sync';
        }
      }
    }

    return { threw: false, message: 'Valid' };
  }

  runFunction(funcName, args) {
    const code = this.code;
    if (funcName === 'sync_item_stock') {
      const [item_code, warehouse, updated_qty] = args;
      if (item_code === 'NON-EXISTENT') {
        return { threw: true, message: `Item ${item_code} not found` };
      }
      if (code.includes('get_value') && code.includes('set_value')) {
        return {
          status: 'success',
          item_name: 'Ultra Fiber 10G Cable',
          stock_uom: 'Meter',
          qty: updated_qty
        };
      }
    }
    return { status: 'unknown' };
  }
}

export class JinjaSimulator {
  constructor(template) {
    this.template = template || '';
  }

  render(doc) {
    let t = this.template;

    // Replace basic {{ doc.field }}
    t = t.replace(/\{\{\s*doc\.([a-zA-Z0-9_]+)\s*\}\}/g, (match, field) => {
      return doc[field] !== undefined ? doc[field] : '';
    });

    // Replace currency formatting {{ frappe.format_value(..., {"fieldtype": "Currency"}) }}
    t = t.replace(/\{\{\s*frappe\.format_value\((doc|item)\.([a-zA-Z0-9_]+)[^}]+\)\s*\}\}/g, (match, target, field) => {
      let val = 0;
      if (target === 'doc') val = doc[field] || 0;
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    });

    // Loop emulation
    if (t.includes('{% for item in doc.items %}')) {
      let loopBody = '';
      (doc.items || []).forEach(item => {
        let rowHtml = `<tr><td>${item.item_name}</td><td>${item.qty}</td><td>$${item.rate}</td></tr>`;
        loopBody += rowHtml;
      });
      t = t.replace(/\{%\s*for\s+item\s+in\s+doc\.items\s*%\}([\s\S]*?)\{%\s*endfor\s*%\}/g, loopBody);
    }

    // Conditionals {% if doc.discount_amount > 0 %}
    if (doc.discount_amount > 0) {
      t = t.replace(/\{%\s*if\s+doc\.discount_amount\s*>\s*0\s*%\}/g, '');
      t = t.replace(/\{%\s*endif\s*%\}/g, '');
    }

    return t;
  }
}

export class RestApiSimulator {
  constructor(code) {
    this.code = code;
  }

  testQuery(funcName) {
    const code = this.code;
    return {
      called: code.includes('/api/resource/Customer'),
      url: code
    };
  }
}

// Master Workflow Automation Engine based on Frappe CRM Automations Architecture
export class WorkflowAutomationSimulator {
  constructor(context) {
    this.context = context;
    this.testRunResults = null;
  }

  interpolate(text, doc, runContext = {}) {
    if (!text || typeof text !== 'string') return text;
    return text.replace(/\{\{\s*([a-zA-Z0-9_\.]+)\s*\}\}/g, (match, path) => {
      // support doc.field
      if (path.startsWith('doc.')) {
        const field = path.replace('doc.', '');
        return doc[field] !== undefined ? doc[field] : '';
      }
      // support trigger.field
      if (path.startsWith('trigger.')) {
        const field = path.replace('trigger.', '');
        return doc[field] !== undefined ? doc[field] : '';
      }
      // support context.steps.step_name.prop
      if (path.startsWith('context.steps.')) {
        const parts = path.split('.');
        const stepName = parts[2];
        const prop = parts[3];
        return runContext.steps?.[stepName]?.[prop] !== undefined ? runContext.steps[stepName][prop] : '';
      }
      if (doc[path] !== undefined) return doc[path];
      return match;
    });
  }

  evaluateCondition(conditionStr, doc) {
    if (!conditionStr) return true;
    try {
      // Clean up common Jinja / python syntax
      const expr = conditionStr
        .replace(/\band\b/g, '&&')
        .replace(/\bor\b/g, '||')
        .replace(/\bnot\b/g, '!');
      const fn = new Function('doc', `return Boolean(${expr});`);
      return fn(doc);
    } catch (e) {
      if (conditionStr.includes('doc.source == "Website"')) return doc.source === 'Website';
      if (conditionStr.includes('doc.status == "New"')) return doc.status === 'New';
      if (conditionStr.includes('doc.status == "Qualified"')) return doc.status === 'Qualified';
      if (conditionStr.includes('doc.stage == "Won"')) return doc.stage === 'Won';
      return true;
    }
  }

  runTestRun(definition, initialDoc, options = { simulateEvent: false }) {
    const ctx = this.context;
    const workingDoc = JSON.parse(JSON.stringify(initialDoc || {}));
    const originalDoc = JSON.parse(JSON.stringify(initialDoc || {}));
    const stepResults = [];
    const runContext = { steps: {}, event: {} };

    ctx.log('info', `▶ [Test Run Started] Running automation '${definition.title || 'Automation'}' against ${definition.doctype} [${workingDoc.name || 'NEW'}]`);

    // 1. Evaluate Filters
    let passedFilters = true;
    if (definition.condition) {
      passedFilters = this.evaluateCondition(definition.condition, workingDoc);
    } else if (definition.filters && Array.isArray(definition.filters)) {
      for (const filter of definition.filters) {
        const fieldVal = workingDoc[filter.field || filter.fieldname];
        const targetVal = filter.value;
        const op = filter.operator || '==';
        if (op === '==' || op === 'Equals' || op === '=') {
          if (fieldVal !== targetVal) passedFilters = false;
        }
      }
    }

    if (!passedFilters) {
      ctx.log('warn', `[Filters] Document does not match automation filters. Run skipped.`);
      return {
        passed: false,
        skipped: true,
        reason: 'Filters did not match',
        stepResults: []
      };
    } else {
      ctx.log('success', `✔ [Filters Passed] Trigger conditions verified for ${workingDoc.name}`);
    }

    // Helper to execute steps recursively (for If/Else and Wait for Event branches)
    const executeSteps = (stepsList, branchLabel = '') => {
      if (!stepsList || !Array.isArray(stepsList)) return;

      for (let i = 0; i < stepsList.length; i++) {
        const step = stepsList[i];
        const actionType = (step.action || '').toLowerCase();
        const blockType = (step.block || '').toLowerCase();
        const stepName = step.step_name || step.name || `step_${i + 1}`;

        // ACTION: Email the Lead or Deal
        if (actionType.includes('email')) {
          const recipient = workingDoc.email_id || `${workingDoc.name.toLowerCase()}@example.com`;
          const templateName = step.email_template || step.template || 'Default Template';
          const subject = this.interpolate(step.subject || `Update on ${workingDoc.doctype}`, workingDoc, runContext);
          ctx.log('success', `✉ [Action: Email the Lead or Deal] Prepared email via template '${templateName}' to <${recipient}> (Simulated in Test Run)`);
          runContext.steps[stepName] = {
            communication: { id: `COMM-${Date.now()}`, recipient, subject, template: templateName }
          };
          stepResults.push({
            id: step.id || stepName,
            name: stepName,
            title: 'Email the Lead or Deal',
            type: 'action',
            status: 'Success',
            details: `Simulated email to ${recipient} using '${templateName}'`
          });
        }

        // ACTION: Notify in CRM
        else if (actionType.includes('notify') || actionType === 'notify_in_crm') {
          const recipient = step.recipients || 'Document owner';
          const msg = this.interpolate(step.message || step.notification || 'New CRM Notification', workingDoc, runContext);
          ctx.messages.push({ message: msg, title: 'CRM Notification Bell', indicator: 'blue' });
          ctx.alerts.push({ message: msg, indicator: 'blue', duration: 6 });
          ctx.log('success', `🔔 [Action: Notify in CRM] Notification added to CRM bell for [${recipient}]: "${msg}"`);
          stepResults.push({
            id: step.id || stepName,
            name: stepName,
            title: 'Notify in CRM',
            type: 'action',
            status: 'Success',
            details: `Alerted ${recipient}: "${msg}"`
          });
        }

        // ACTION: Adjust Lead Score
        else if (actionType.includes('adjust') || actionType.includes('score')) {
          const amount = Number(step.amount) || 0;
          const old_value = Number(workingDoc.lead_score) || 0;
          let new_value = old_value + amount;
          if (step.min_score !== undefined) new_value = Math.max(step.min_score, new_value);
          if (step.max_score !== undefined) new_value = Math.min(step.max_score, new_value);
          workingDoc.lead_score = new_value;
          runContext.steps[stepName] = { old_value, new_value, delta: amount };
          ctx.log('success', `📈 [Action: Adjust Lead Score] Lead score updated from ${old_value} to ${new_value} (delta: ${amount >= 0 ? '+' : ''}${amount})`);
          stepResults.push({
            id: step.id || stepName,
            name: stepName,
            title: 'Adjust Lead Score',
            type: 'action',
            status: 'Success',
            details: `Score: ${old_value} ➔ ${new_value} (${amount >= 0 ? '+' : ''}${amount})`
          });
        }

        // ACTION: Set Lead Temperature
        else if (actionType.includes('temperature')) {
          const temp = step.temperature || 'Hot';
          const old_temp = workingDoc.temperature || 'Warm';
          workingDoc.temperature = temp;
          runContext.steps[stepName] = { old_value: old_temp, new_value: temp };
          ctx.log('success', `🌡️ [Action: Set Lead Temperature] Temperature marked as '${temp}'`);
          stepResults.push({
            id: step.id || stepName,
            name: stepName,
            title: 'Set Lead Temperature',
            type: 'action',
            status: 'Success',
            details: `Temperature set to ${temp}`
          });
        }

        // ACTION: Convert Lead to Deal
        else if (actionType.includes('convert') || actionType.includes('deal')) {
          workingDoc.status = 'Converted';
          const dealDoc = {
            doctype: 'CRM Deal',
            name: `DEAL-${Date.now().toString().slice(-4)}`,
            deal_name: `${workingDoc.lead_name || workingDoc.name} Deal`,
            deal_owner: workingDoc.lead_owner,
            organization: workingDoc.organization || workingDoc.lead_name,
            probability: 20,
            stage: 'Prospecting'
          };
          const resName = step.name_the_result || step.result_name || 'deal';
          runContext.steps[resName] = dealDoc;
          runContext.deal = dealDoc;
          ctx.log('success', `💼 [Action: Convert Lead to Deal] Lead converted into new Deal [${dealDoc.name}]. Result saved as '${resName}'.`);
          stepResults.push({
            id: step.id || stepName,
            name: stepName,
            title: 'Convert Lead to Deal',
            type: 'action',
            status: 'Success',
            details: `Created Deal ${dealDoc.name} for ${dealDoc.organization}`
          });
        }

        // ACTION: Create Document (e.g. ToDo or CRM Task)
        else if (actionType.includes('create document') || actionType.includes('create_document')) {
          const targetDocType = step.document_type || step.doctype || 'ToDo';
          const rawFields = step.field_values || step.fields || {};
          const evaluatedFields = {};
          Object.keys(rawFields).forEach(k => {
            evaluatedFields[k] = this.interpolate(rawFields[k], workingDoc, runContext);
          });
          const createdDoc = {
            doctype: targetDocType,
            name: `${targetDocType.toUpperCase()}-${Date.now().toString().slice(-4)}`,
            ...evaluatedFields
          };
          const resName = step.name_the_result || step.result_name || 'created_doc';
          runContext.steps[resName] = createdDoc;
          ctx.log('success', `📝 [Action: Create Document] Created ${targetDocType} [${createdDoc.name}]: "${createdDoc.title || createdDoc.name}"`);
          stepResults.push({
            id: step.id || stepName,
            name: stepName,
            title: `Create Document (${targetDocType})`,
            type: 'action',
            status: 'Success',
            details: `Created ${targetDocType} linked to ${workingDoc.name}`
          });
        }

        // ACTION: Assign to User
        else if (actionType.includes('assign')) {
          const assignee = step.assign_to || step.user || 'sales-rep@company.com';
          workingDoc.assigned_to = assignee;
          ctx.log('success', `👤 [Action: Assign to User] Assigned record to [${assignee}]`);
          stepResults.push({
            id: step.id || stepName,
            name: stepName,
            title: 'Assign to User',
            type: 'action',
            status: 'Success',
            details: `Assigned to ${assignee}`
          });
        }

        // ACTION: Call Webhook
        else if (actionType.includes('webhook')) {
          const url = this.interpolate(step.url || 'https://api.example.com/webhook', workingDoc, runContext);
          const method = step.method || 'POST';
          ctx.log('info', `🌐 [Action: Call Webhook] (Test Run Dry-Run) Would call ${method} ${url}. Request not sent during test run.`);
          runContext.steps[stepName] = { status_code: 200, response: { ok: true, simulated: true } };
          stepResults.push({
            id: step.id || stepName,
            name: stepName,
            title: 'Call Webhook',
            type: 'action',
            status: 'Simulated',
            details: `DRY RUN: ${method} ${url}`
          });
        }

        // BLOCK: Wait
        else if (blockType === 'wait') {
          const duration = step.wait || step.duration || 1;
          const unit = step.unit || 'Days';
          ctx.log('info', `⏳ [Block: Wait] Pausing run for ${duration} ${unit} (Simulated in Test Run)`);
          stepResults.push({
            id: step.id || stepName,
            name: stepName,
            title: `Wait ${duration} ${unit}`,
            type: 'block',
            status: 'Simulated',
            details: `Paused for ${duration} ${unit} (simulated)`
          });
        }

        // BLOCK: If / Else
        else if (blockType.includes('if') || blockType === 'if_else') {
          const cond = step.condition || 'true';
          const condResult = this.evaluateCondition(cond, workingDoc);
          ctx.log('info', `🔀 [Block: If / Else] Condition '${cond}' evaluated to: ${condResult ? 'TRUE' : 'FALSE'}`);
          stepResults.push({
            id: step.id || stepName,
            name: stepName,
            title: `If / Else (${cond})`,
            type: 'block',
            status: 'Success',
            details: `Branch taken: ${condResult ? 'True' : 'False'}`
          });

          if (condResult && (step.true_branch || step.steps_true)) {
            executeSteps(step.true_branch || step.steps_true, 'True Branch');
          } else if (!condResult && (step.false_branch || step.steps_false)) {
            executeSteps(step.false_branch || step.steps_false, 'False Branch');
          }
        }

        // BLOCK: Wait for event
        else if (blockType.includes('event') || blockType === 'wait_for_event') {
          const eventName = step.wait_for || 'The prospect replied';
          const timeout = step.timeout || 3;
          const unit = step.unit || 'Days';
          const isEventHappened = Boolean(options.simulateEvent);

          ctx.log('info', `⏱ [Block: Wait for event] Waiting for '${eventName}' (Timeout: ${timeout} ${unit})`);

          if (isEventHappened) {
            ctx.log('success', `⚡ [Wait for event] Event '${eventName}' happened! Following 'Event happened' branch.`);
            stepResults.push({
              id: step.id || stepName,
              name: stepName,
              title: `Wait for event (${eventName})`,
              type: 'block',
              status: 'Success',
              details: `Branch: Event happened`
            });
            if (step.event_happened_branch || step.on_event) {
              executeSteps(step.event_happened_branch || step.on_event, 'Event happened');
            }
          } else {
            ctx.log('warn', `⌛ [Wait for event] (Test Run Default) Timed out after ${timeout} ${unit}. Following 'Timed out' branch.`);
            stepResults.push({
              id: step.id || stepName,
              name: stepName,
              title: `Wait for event (${eventName})`,
              type: 'block',
              status: 'Simulated',
              details: `Branch: Timed out`
            });
            if (step.timed_out_branch || step.on_timeout) {
              executeSteps(step.timed_out_branch || step.on_timeout, 'Timed out');
            }
          }
        }
      }
    };

    executeSteps(definition.steps);

    // 4. Test Run Rollback
    ctx.log('info', `🛡️ [Test Run Rollback] Test execution finished. All modifications to ${workingDoc.doctype} [${workingDoc.name}] rolled back to initial state.`);
    ctx.log('success', `✨ Test run completed with 0 errors. No emails dispatched, no database rows committed.`);

    this.testRunResults = {
      automationTitle: definition.title,
      workingDocState: workingDoc,
      rolledBackDoc: originalDoc,
      stepResults,
      runContext
    };

    return this.testRunResults;
  }
}

// Master execution and validation runner
export function executeAndValidateQuest(quest, userCode) {
  const context = new VirtualFrappeContext(quest.testDoc);
  const frm = context.createVirtualFrm();
  context.frm = frm;
  const frappe = context.createVirtualFrappe(frm);
  const _ = (str) => str;
  const locals = context.locals;

  // Initialize Automation Simulator
  context.automationSimulator = new WorkflowAutomationSimulator(context);

  // Extend virtual frappe with CRM Automation helper
  frappe.crm = {
    automation: (def) => {
      context.automationDefinition = def;
      context.log('frappe', `frappe.crm.automation('${def.title || 'Workflow Automation'}') registered`);
      return context.automationSimulator.runTestRun(def, quest.testDoc);
    }
  };

  try {
    if (quest.language === 'javascript' || quest.language === 'json' || quest.language === 'automation') {
      let isJson = false;
      let parsedJson = null;
      try {
        const trimmed = userCode.trim();
        if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
          parsedJson = JSON.parse(trimmed);
          isJson = true;
        }
      } catch (e) {
        isJson = false;
      }

      if (isJson && parsedJson) {
        context.automationDefinition = parsedJson;
        context.automationSimulator.runTestRun(parsedJson, quest.testDoc);
      } else {
        const sandboxFn = new Function(
          'frappe',
          'frm',
          '_',
          'locals',
          `
          try {
            ${userCode}
          } catch(err) {
            throw err;
          }
          `
        );
        sandboxFn(frappe, frm, _, locals);
      }

    } else if (quest.language === 'python') {
      context.pythonRunner = new PythonSimulator(userCode);
      context.log('info', `[Frappe Python Runtime] Parsing DocType Controller...`);
    } else if (quest.language === 'html') {
      context.jinjaRenderer = new JinjaSimulator(userCode);
      context.log('info', `[Frappe Jinja Engine] Compiling Print Format Template...`);
    }

    context.fetchSimulator = new RestApiSimulator(userCode);

    // Run Quest specific validation
    const validationResult = quest.validate(context.logs, context);
    return {
      success: validationResult.pass,
      message: validationResult.message || validationResult.error,
      logs: context.logs,
      context,
      frm: context.createVirtualFrm()
    };

  } catch (err) {
    context.log('error', `Execution Error: ${err.message}`);
    return {
      success: false,
      message: `Syntax / Runtime Error: ${err.message}`,
      logs: context.logs,
      context,
      frm: context.createVirtualFrm()
    };
  }
}


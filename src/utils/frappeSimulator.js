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

// Master execution and validation runner
export function executeAndValidateQuest(quest, userCode) {
  const context = new VirtualFrappeContext(quest.testDoc);
  const frm = context.createVirtualFrm();
  const frappe = context.createVirtualFrappe(frm);
  const _ = (str) => str;
  const locals = context.locals;

  try {
    if (quest.language === 'javascript') {
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

    } else if (quest.language === 'python') {
      context.pythonRunner = new PythonSimulator(userCode);
      context.log('info', `[Frappe Python Runtime] Parsing DocType Controller...`);
    } else if (quest.language === 'html') {
      context.jinjaRenderer = new JinjaSimulator(userCode);
      context.log('info', `[Frappe Jinja Engine] Compiling Print Format Template...`);
    }

    context.fetchSimulator = new RestApiSimulator(userCode);
    context.triggerFieldChange = (field) => context.triggerFieldChange(field);
    context.triggerChildEvent = (cdt, event, childDoctype, cdn) => context.triggerChildEvent(cdt, event, childDoctype, cdn);

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

// Comprehensive Frappe & ERPNext Quest Catalog with Interview Mastery Track

export const TRACKS = [
  {
    id: 'interview-mastery',
    title: 'Frappe & ERPNext Interview Mastery',
    description: 'Solve classic technical interview challenges: Link filtering, autonaming, GL balancing, and security traps.',
    icon: 'Target',
    color: '#ef4444',
    gradient: 'from-red-500/20 to-orange-500/20',
  },
  {
    id: 'client-scripts',
    title: 'Client Scripting & Desk UI',
    description: 'Master frappe.ui.form, custom buttons, dynamic field behaviors, and child table events.',
    icon: 'Terminal',
    color: '#3b82f6',
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    id: 'server-scripts',
    title: 'Server Python & DocType Lifecycle',
    description: 'Master Python controllers, validate/before_save hooks, Frappe ORM, and database queries.',
    icon: 'Server',
    color: '#8b5cf6',
    gradient: 'from-purple-500/20 to-indigo-500/20',
  },
  {
    id: 'erpnext-scenarios',
    title: 'ERPNext Business Logic & Workflows',
    description: 'Solve real-world ERPNext scenarios: Quotations, Invoices, Stock validations, and Workflows.',
    icon: 'Briefcase',
    color: '#10b981',
    gradient: 'from-emerald-500/20 to-teal-500/20',
  },
  {
    id: 'api-integrations',
    title: 'Frappe REST API & Background Jobs',
    description: 'Master frappe.call, REST API endpoints, webhooks, and asynchronous background tasks with enqueue.',
    icon: 'Cpu',
    color: '#f59e0b',
    gradient: 'from-amber-500/20 to-orange-500/20',
  },
  {
    id: 'reports-jinja',
    title: 'Print Formats & Reports Mastery',
    description: 'Craft beautiful Jinja2 print templates and powerful Script/Query Reports with charts.',
    icon: 'FileText',
    color: '#ec4899',
    gradient: 'from-pink-500/20 to-rose-500/20',
  },
];

export const QUESTS = [
  // TRACK 0: INTERVIEW MASTERY (Top-priority for technical interviews & problem solving)
  {
    id: 'int-01-link-field-query',
    trackId: 'interview-mastery',
    title: 'Interview Drill: Dynamic Link Field Filter',
    level: 'Intermediate',
    xp: 250,
    coins: 100,
    doctype: 'Sales Order',
    language: 'javascript',
    summary: 'Filter the customer Link field on Sales Order to only show active Commercial customers in North America.',
    briefing: `### 🎯 Technical Interview Scenario:
The interviewer asks: *"How do you restrict a Link field on a Frappe Form so that the modal dropdown only displays records matching dynamic multi-field criteria without modifying core DocType definitions?"*

Your Task on the **Sales Order** Client Script:
1. In the \`refresh(frm)\` handler, apply \`frm.set_query('customer', ...)\`.
2. The query must return filter criteria:
   - \`disabled: 0\`
   - \`customer_group: 'Commercial'\`
   - \`territory: 'North America'\`
3. Show an alert confirmation: \`frappe.show_alert('Customer link filter applied!', 5)\`.`,
    objectives: [
      'Use `frm.set_query("customer", function() { return { filters: { ... } }; })`',
      'Set filters for `disabled: 0`, `customer_group: "Commercial"`, and `territory: "North America"`',
      'Trigger `frappe.show_alert("Customer link filter applied!", 5)`'
    ],
    docReference: {
      title: 'Frappe Form API: frm.set_query',
      url: 'https://frappeframework.com/docs/user/en/api/form#frmset_query',
      codeSnippet: `frappe.ui.form.on('Sales Order', {
    refresh(frm) {
        frm.set_query('customer', () => {
            return {
                filters: {
                    'disabled': 0,
                    'customer_group': 'Commercial',
                    'territory': 'North America'
                }
            };
        });
        frappe.show_alert('Customer link filter applied!', 5);
    }
});`
    },
    starterCode: `frappe.ui.form.on('Sales Order', {
    refresh(frm) {
        // TODO: Apply dynamic link query filter on 'customer' field
        
    }
});`,
    solutionCode: `frappe.ui.form.on('Sales Order', {
    refresh(frm) {
        frm.set_query('customer', () => {
            return {
                filters: {
                    'disabled': 0,
                    'customer_group': 'Commercial',
                    'territory': 'North America'
                }
            };
        });
        frappe.show_alert('Customer link filter applied!', 5);
    }
});`,
    testDoc: {
      doctype: 'Sales Order',
      name: 'SO-2026-INT01',
      customer: 'Nexus Global',
      status: 'Draft'
    },
    validate: (logs, context) => {
      const { frm, alerts } = context;
      const queryFilter = frm.get_query_filter ? frm.get_query_filter('customer') : context.linkQueries?.customer;
      
      const filterCalled = logs.some(l => l.message.includes('frm.set_query') && l.message.includes('customer'));
      if (!filterCalled && !queryFilter) {
        return { pass: false, error: "frm.set_query('customer', ...) was not invoked in the refresh handler." };
      }
      const alertFound = alerts.some(a => a.message && a.message.includes('filter applied'));
      if (!alertFound) {
        return { pass: false, error: "frappe.show_alert was not called with the required confirmation message." };
      }
      return { pass: true, message: "A+! You nailed the classic Link Field Filter interview challenge with standard Frappe conventions!" };
    }
  },

  {
    id: 'int-02-gl-balance-guard',
    trackId: 'interview-mastery',
    title: 'Interview Drill: General Ledger Balancing Guard',
    level: 'Advanced',
    xp: 320,
    coins: 130,
    doctype: 'Journal Entry',
    language: 'python',
    summary: 'Write Python validate hook ensuring total debit equals total credit and throwing formatted errors on mismatch.',
    briefing: `### 🎯 Technical Interview Scenario:
The interviewer asks: *"In ERPNext Accounting controllers, how do you prevent unbalanced journal entries from ever being saved to the database, ensuring double-entry bookkeeping integrity?"*

Your Task in \`journal_entry.py\`:
1. In the \`validate(self)\` controller method, calculate:
   - \`total_debit = sum(row.debit or 0 for row in self.accounts)\`
   - \`total_credit = sum(row.credit or 0 for row in self.accounts)\`
2. If \`round(total_debit, 2) != round(total_credit, 2)\`, abort with:
   \`frappe.throw(_("Total Debit ({0}) must equal Total Credit ({1})").format(total_debit, total_credit))\`
3. If balanced, set \`self.total_amount = total_debit\`.`,
    objectives: [
      'Define `validate(self)` controller lifecycle hook',
      'Compute sums over child table `self.accounts`',
      'Use `frappe.throw(_("Total Debit ({0}) must equal Total Credit ({1})").format(total_debit, total_credit))` on mismatch'
    ],
    docReference: {
      title: 'ERPNext Accounting Validation Principles',
      url: 'https://docs.frappe.io/erpnext/introduction',
      codeSnippet: `import frappe
from frappe import _
from frappe.model.document import Document

class JournalEntry(Document):
    def validate(self):
        total_debit = sum((row.debit or 0) for row in self.accounts)
        total_credit = sum((row.credit or 0) for row in self.accounts)
        
        if round(total_debit, 2) != round(total_credit, 2):
            frappe.throw(_("Total Debit ({0}) must equal Total Credit ({1})").format(total_debit, total_credit))
            
        self.total_amount = total_debit`
    },
    starterCode: `import frappe
from frappe import _
from frappe.model.document import Document

class JournalEntry(Document):
    def validate(self):
        # TODO: Calculate debit vs credit balance and throw error on mismatch
        pass`,
    solutionCode: `import frappe
from frappe import _
from frappe.model.document import Document

class JournalEntry(Document):
    def validate(self):
        total_debit = sum((row.debit or 0) for row in self.accounts)
        total_credit = sum((row.credit or 0) for row in self.accounts)
        
        if round(total_debit, 2) != round(total_credit, 2):
            frappe.throw(_("Total Debit ({0}) must equal Total Credit ({1})").format(total_debit, total_credit))
            
        self.total_amount = total_debit`,
    testDoc: {
      doctype: 'Journal Entry',
      name: 'JV-2026-0001',
      accounts: [
        { account: 'Bank Account - TG', debit: 5000, credit: 0 },
        { account: 'Debtors - TG', debit: 0, credit: 4000 }
      ]
    },
    validate: (logs, context) => {
      const { pythonRunner } = context;
      // Test unbalanced: 5000 vs 4000
      const res1 = pythonRunner.runValidation({
        doctype: 'Journal Entry',
        accounts: [
          { debit: 5000, credit: 0 },
          { debit: 0, credit: 4000 }
        ]
      });
      if (!res1.threw || !res1.message.includes('Debit')) {
        return { pass: false, error: "Validation failed to throw an error when total debit != total credit." };
      }

      // Test balanced: 3500 vs 3500
      const res2 = pythonRunner.runValidation({
        doctype: 'Journal Entry',
        accounts: [
          { debit: 3500, credit: 0 },
          { debit: 0, credit: 3500 }
        ]
      });
      if (res2.threw) {
        return { pass: false, error: `Balanced entry threw an unexpected error: ${res2.message}` };
      }

      return { pass: true, message: "Perfect! You demonstrated core ERPNext financial accounting and transaction guard principles!" };
    }
  },

  {
    id: 'int-03-autoname-series',
    trackId: 'interview-mastery',
    title: 'Interview Drill: Custom Autoname Generator',
    level: 'Intermediate',
    xp: 280,
    coins: 110,
    doctype: 'Custom Ticket',
    language: 'python',
    summary: 'Implement custom autoname(self) controller method using make_autoname for prefixed date-based series.',
    briefing: `### 🎯 Technical Interview Scenario:
The interviewer asks: *"When creating a custom DocType in Frappe, how do you dynamically set document names to follow the company pattern \`TICK-.YYYY.-.MM.-.#####\` (e.g. \`TICK-2026-09-00001\`)?"*

Your Task in \`custom_ticket.py\`:
1. Implement \`autoname(self)\` on the Document class.
2. Use \`frappe.model.naming.make_autoname\` to set \`self.name = make_autoname('TICK-.YYYY.-.MM.-.#####')\`.`,
    objectives: [
      'Import `from frappe.model.naming import make_autoname`',
      'Implement `def autoname(self):` on the Document class',
      'Set `self.name = make_autoname("TICK-.YYYY.-.MM.-.#####")`'
    ],
    docReference: {
      title: 'Frappe DocType Naming: autoname()',
      url: 'https://frappeframework.com/docs/user/en/basics/doctypes/naming',
      codeSnippet: `import frappe
from frappe.model.document import Document
from frappe.model.naming import make_autoname

class CustomTicket(Document):
    def autoname(self):
        self.name = make_autoname('TICK-.YYYY.-.MM.-.#####')`
    },
    starterCode: `import frappe
from frappe.model.document import Document
from frappe.model.naming import make_autoname

class CustomTicket(Document):
    def autoname(self):
        # TODO: Generate series name using make_autoname
        pass`,
    solutionCode: `import frappe
from frappe.model.document import Document
from frappe.model.naming import make_autoname

class CustomTicket(Document):
    def autoname(self):
        self.name = make_autoname('TICK-.YYYY.-.MM.-.#####')`,
    testDoc: {
      doctype: 'Custom Ticket',
      subject: 'Server latency in Singapore cluster'
    },
    validate: (logs, context) => {
      const code = context.pythonRunner?.code || '';
      if (!code.includes('autoname') || !code.includes('make_autoname')) {
        return { pass: false, error: "autoname(self) method or make_autoname function call is missing." };
      }
      if (!code.includes('TICK-.YYYY.-.MM.-.#####') && !code.includes('TICK-')) {
        return { pass: false, error: "make_autoname must format the series as 'TICK-.YYYY.-.MM.-.#####'." };
      }
      return { pass: true, message: "Sensational! Autonaming conventions are essential for ERPNext enterprise deployments." };
    }
  },

  // TRACK 1: Client Scripting
  {
    id: 'cs-01-custom-button',
    trackId: 'client-scripts',
    title: 'The Royal Custom Button',
    level: 'Beginner',
    xp: 150,
    coins: 60,
    doctype: 'Sales Order',
    language: 'javascript',
    summary: 'Add a custom button on the Sales Order form to quickly mark the order as VIP Priority.',
    briefing: `The Sales Director at TechVanguard ERP needs a one-click button labeled **"VIP Priority"** under the standard **"Actions"** button group on the Sales Order form.
When clicked, it should:
1. Set the \`customer_notes\` field on the form to \`"★ VIP Priority Client - Rush Delivery"\`.
2. Display a friendly Frappe alert \`frappe.show_alert('Order marked as VIP Priority!', 5)\`.`,
    objectives: [
      'Hook into `frappe.ui.form.on("Sales Order", { refresh(frm) { ... } })`',
      'Use `frm.add_custom_button("VIP Priority", callback, "Actions")`',
      'Inside the callback, update `frm.set_value("customer_notes", "★ VIP Priority Client - Rush Delivery")`',
      'Trigger `frappe.show_alert("Order marked as VIP Priority!", 5)`'
    ],
    docReference: {
      title: 'Frappe Form API: frm.add_custom_button',
      url: 'https://frappeframework.com/docs/user/en/api/form#frmadd_custom_button',
      codeSnippet: `frappe.ui.form.on('DocType Name', {
    refresh(frm) {
        frm.add_custom_button('Button Label', () => {
            frm.set_value('field_name', 'New Value');
            frappe.show_alert('Message', 5);
        }, 'Actions');
    }
});`
    },
    starterCode: `frappe.ui.form.on('Sales Order', {
    refresh(frm) {
        // TODO: Add the 'VIP Priority' button under 'Actions' group
        
    }
});`,
    solutionCode: `frappe.ui.form.on('Sales Order', {
    refresh(frm) {
        frm.add_custom_button('VIP Priority', () => {
            frm.set_value('customer_notes', '★ VIP Priority Client - Rush Delivery');
            frappe.show_alert('Order marked as VIP Priority!', 5);
        }, 'Actions');
    }
});`,
    testDoc: {
      doctype: 'Sales Order',
      name: 'SO-2026-0089',
      customer: 'Nexus Corp Global',
      status: 'Draft',
      grand_total: 14500,
      customer_notes: '',
      delivery_date: '2026-10-15'
    },
    validate: (logs, context) => {
      const { frm, alerts, buttons } = context;
      const btn = buttons.find(b => b.label.toLowerCase() === 'vip priority');
      if (!btn) {
        return { pass: false, error: "Custom button 'VIP Priority' was not created with frm.add_custom_button." };
      }
      if (btn.group && btn.group.toLowerCase() !== 'actions') {
        return { pass: false, error: `Button must be grouped under 'Actions', but was placed under '${btn.group}'` };
      }
      btn.action();
      if (frm.doc.customer_notes !== '★ VIP Priority Client - Rush Delivery') {
        return { pass: false, error: "Clicking 'VIP Priority' did not update customer_notes to '★ VIP Priority Client - Rush Delivery'" };
      }
      const alertFound = alerts.some(a => a.message && a.message.includes('VIP Priority'));
      if (!alertFound) {
        return { pass: false, error: "frappe.show_alert was not called with the required confirmation message." };
      }
      return { pass: true, message: "Magnificent! The custom button is active and properly updates the form state with an alert." };
    }
  },

  {
    id: 'cs-02-dynamic-fields',
    trackId: 'client-scripts',
    title: 'The Shape-Shifting Fields',
    level: 'Intermediate',
    xp: 200,
    coins: 80,
    doctype: 'Customer',
    language: 'javascript',
    summary: 'Dynamically toggle field requirement and visibility based on Customer Type selection.',
    briefing: `In ERPNext Customer records, when \`customer_type\` is changed to **"Company"**:
1. The field \`tax_id\` must become **mandatory** (\`reqd = 1\`).
2. The field \`company_registration_no\` must become **visible** (\`hidden = 0\`).
When \`customer_type\` is **"Individual"**:
1. The field \`tax_id\` becomes **optional** (\`reqd = 0\`).
2. The field \`company_registration_no\` becomes **hidden** (\`hidden = 1\`).`,
    objectives: [
      'Listen for `customer_type` field changes using `frappe.ui.form.on("Customer", { customer_type(frm) { ... } })`',
      'Also run logic on `refresh(frm)` so existing records initialize correctly',
      'Use `frm.set_df_property(fieldname, property, value)` or `frm.toggle_reqd` / `frm.toggle_display`'
    ],
    docReference: {
      title: 'Frappe Form API: Field Properties',
      url: 'https://frappeframework.com/docs/user/en/api/form#frmset_df_property',
      codeSnippet: `frappe.ui.form.on('Customer', {
    refresh(frm) {
        frm.trigger('customer_type');
    },
    customer_type(frm) {
        const isCompany = frm.doc.customer_type === 'Company';
        frm.set_df_property('tax_id', 'reqd', isCompany ? 1 : 0);
        frm.set_df_property('company_registration_no', 'hidden', isCompany ? 0 : 1);
    }
});`
    },
    starterCode: `frappe.ui.form.on('Customer', {
    refresh(frm) {
        frm.trigger('customer_type');
    },
    customer_type(frm) {
        // TODO: Toggle tax_id reqd and company_registration_no visibility
        
    }
});`,
    solutionCode: `frappe.ui.form.on('Customer', {
    refresh(frm) {
        frm.trigger('customer_type');
    },
    customer_type(frm) {
        const isCompany = frm.doc.customer_type === 'Company';
        frm.set_df_property('tax_id', 'reqd', isCompany ? 1 : 0);
        frm.set_df_property('company_registration_no', 'hidden', isCompany ? 0 : 1);
    }
});`,
    testDoc: {
      doctype: 'Customer',
      name: 'CUST-0042',
      customer_name: 'Acme Technologies',
      customer_type: 'Individual',
      tax_id: '',
      company_registration_no: ''
    },
    validate: (logs, context) => {
      const { frm } = context;
      frm.doc.customer_type = 'Company';
      if (context.triggerFieldChange) context.triggerFieldChange('customer_type');
      
      const taxReqd = frm.get_df_property('tax_id', 'reqd');
      const compHidden = frm.get_df_property('company_registration_no', 'hidden');

      if (!taxReqd) {
        return { pass: false, error: "When customer_type is 'Company', 'tax_id' was not set to mandatory (reqd = 1)." };
      }
      if (compHidden) {
        return { pass: false, error: "When customer_type is 'Company', 'company_registration_no' was not made visible (hidden = 0)." };
      }

      frm.doc.customer_type = 'Individual';
      if (context.triggerFieldChange) context.triggerFieldChange('customer_type');

      const taxReqd2 = frm.get_df_property('tax_id', 'reqd');
      const compHidden2 = frm.get_df_property('company_registration_no', 'hidden');

      if (taxReqd2) {
        return { pass: false, error: "When customer_type is 'Individual', 'tax_id' should not be mandatory." };
      }
      if (!compHidden2) {
        return { pass: false, error: "When customer_type is 'Individual', 'company_registration_no' should be hidden." };
      }

      return { pass: true, message: "Outstanding! Dynamic field validation and visibility are synchronized with customer type!" };
    }
  },

  {
    id: 'cs-03-child-table-calc',
    trackId: 'client-scripts',
    title: 'The Child Table Calculator',
    level: 'Intermediate',
    xp: 250,
    coins: 100,
    doctype: 'Quotation',
    language: 'javascript',
    summary: 'Calculate line item discounts and update the main form total on child table row changes.',
    briefing: `When an item row is modified in a Quotation's \`items\` child table (\`Quotation Item\`):
1. Calculate the item row's \`amount = (row.qty * row.rate) - (row.discount_amount || 0)\`.
2. Sum all row \`amount\` values and update the main form's \`total_amount\` field.
3. Refresh the fields using \`frm.refresh_field('items')\` and \`frm.refresh_field('total_amount')\`.`,
    objectives: [
      'Hook child table events with `frappe.ui.form.on("Quotation Item", { qty(frm, cdt, cdn) {...}, rate(frm, cdt, cdn) {...} })`',
      'Use `frappe.model.set_value(cdt, cdn, "amount", calculatedAmount)` or `locals[cdt][cdn].amount = ...`',
      'Recalculate the sum across `frm.doc.items` and set `frm.set_value("total_amount", total)`'
    ],
    docReference: {
      title: 'Child Table Scripts in Frappe',
      url: 'https://frappeframework.com/docs/user/en/api/form#child-table-events',
      codeSnippet: `function update_totals(frm, cdt, cdn) {
    let row = locals[cdt][cdn];
    let amount = (row.qty * row.rate) - (row.discount_amount || 0);
    frappe.model.set_value(cdt, cdn, 'amount', amount);
    
    let sum = 0;
    (frm.doc.items || []).forEach(d => { sum += (d.amount || 0); });
    frm.set_value('total_amount', sum);
}

frappe.ui.form.on('Quotation Item', {
    qty(frm, cdt, cdn) { update_totals(frm, cdt, cdn); },
    rate(frm, cdt, cdn) { update_totals(frm, cdt, cdn); },
    discount_amount(frm, cdt, cdn) { update_totals(frm, cdt, cdn); }
});`
    },
    starterCode: `frappe.ui.form.on('Quotation Item', {
    qty(frm, cdt, cdn) {
        // TODO: calculate row amount and update main form total_amount
    },
    rate(frm, cdt, cdn) {
        // TODO: calculate row amount and update main form total_amount
    }
});`,
    solutionCode: `function update_totals(frm, cdt, cdn) {
    let row = locals[cdt][cdn];
    let amount = (row.qty * row.rate) - (row.discount_amount || 0);
    frappe.model.set_value(cdt, cdn, 'amount', amount);
    
    let sum = 0;
    (frm.doc.items || []).forEach(d => {
        sum += (d.amount || 0);
    });
    frm.set_value('total_amount', sum);
}

frappe.ui.form.on('Quotation Item', {
    qty(frm, cdt, cdn) { update_totals(frm, cdt, cdn); },
    rate(frm, cdt, cdn) { update_totals(frm, cdt, cdn); },
    discount_amount(frm, cdt, cdn) { update_totals(frm, cdt, cdn); }
});`,
    testDoc: {
      doctype: 'Quotation',
      name: 'QTN-2026-0012',
      party_name: 'Solaris Systems',
      total_amount: 0,
      items: [
        { name: 'row-1', item_code: 'MACBOOK-PRO', qty: 2, rate: 2000, discount_amount: 200, amount: 0 },
        { name: 'row-2', item_code: 'MONITOR-4K', qty: 3, rate: 500, discount_amount: 0, amount: 0 }
      ]
    },
    validate: (logs, context) => {
      const { frm, triggerChildEvent } = context;
      if (triggerChildEvent) {
        triggerChildEvent('Quotation Item', 'qty', 'Quotation Item', 'row-1');
        triggerChildEvent('Quotation Item', 'qty', 'Quotation Item', 'row-2');
      }

      const item1 = frm.doc.items.find(i => i.name === 'row-1');
      const item2 = frm.doc.items.find(i => i.name === 'row-2');

      const expectedItem1 = (2 * 2000) - 200; // 3800
      const expectedItem2 = (3 * 500) - 0;    // 1500
      const expectedTotal = 3800 + 1500;       // 5300

      if (item1.amount !== expectedItem1) {
        return { pass: false, error: `Row 1 amount should be ${expectedItem1} (2 * 2000 - 200), but got ${item1.amount}` };
      }
      if (item2.amount !== expectedItem2) {
        return { pass: false, error: `Row 2 amount should be ${expectedItem2} (3 * 500), but got ${item2.amount}` };
      }
      if (frm.doc.total_amount !== expectedTotal) {
        return { pass: false, error: `Main form total_amount should be ${expectedTotal}, but got ${frm.doc.total_amount}` };
      }

      return { pass: true, message: "Brilliant! Child table calculation & document total aggregation are working flawlessly!" };
    }
  },

  // TRACK 2: Server-Side Python
  {
    id: 'py-01-doc-events',
    trackId: 'server-scripts',
    title: 'The Sentinel of Validation',
    level: 'Beginner',
    xp: 200,
    coins: 75,
    doctype: 'Sales Invoice',
    language: 'python',
    summary: 'Write a DocType validate hook in Python to prevent negative quantities and enforce discount caps.',
    briefing: `In ERPNext's \`Sales Invoice\` controller (\`sales_invoice.py\`), implement the \`validate(self)\` method:
1. Ensure no item in \`self.items\` has \`qty <= 0\`. If violated, throw:
   \`frappe.throw(_("Quantity must be greater than 0 for item {0}").format(item.item_code))\`
2. Ensure \`self.discount_percentage\` does not exceed \`25.0\` percent. If it exceeds 25, throw:
   \`frappe.throw(_("Maximum discount allowed is 25%"))\``,
    objectives: [
      'Define `validate(self)` on the DocType controller class',
      'Iterate through `self.items` and validate `item.qty > 0`',
      'Check `self.discount_percentage <= 25`',
      'Use `frappe.throw(_("..."))` to abort saving and show an error modal'
    ],
    docReference: {
      title: 'Frappe Document Lifecycle: validate()',
      url: 'https://frappeframework.com/docs/user/en/guides/basics/doctype-controller',
      codeSnippet: `import frappe
from frappe import _
from frappe.model.document import Document

class SalesInvoice(Document):
    def validate(self):
        if (self.discount_percentage or 0) > 25:
            frappe.throw(_("Maximum discount allowed is 25%"))
            
        for item in self.items:
            if (item.qty or 0) <= 0:
                frappe.throw(_("Quantity must be greater than 0 for item {0}").format(item.item_code))`
    },
    starterCode: `import frappe
from frappe import _
from frappe.model.document import Document

class SalesInvoice(Document):
    def validate(self):
        # TODO: Validate item quantities > 0 and discount_percentage <= 25
        pass`,
    solutionCode: `import frappe
from frappe import _
from frappe.model.document import Document

class SalesInvoice(Document):
    def validate(self):
        if (self.discount_percentage or 0) > 25:
            frappe.throw(_("Maximum discount allowed is 25%"))
            
        for item in self.items:
            if (item.qty or 0) <= 0:
                frappe.throw(_("Quantity must be greater than 0 for item {0}").format(item.item_code))`,
    testDoc: {
      doctype: 'Sales Invoice',
      name: 'SINV-2026-003',
      customer: 'Globex Corp',
      discount_percentage: 30,
      items: [
        { item_code: 'SERVER-BLADE-X', qty: -1, rate: 4500 }
      ]
    },
    validate: (logs, context) => {
      const { pythonRunner } = context;
      const res1 = pythonRunner.runValidation({
        discount_percentage: 30,
        items: [{ item_code: 'ITEM-1', qty: 2 }]
      });
      if (!res1.threw || !res1.message.includes('25%')) {
        return { pass: false, error: "Validation failed to throw error when discount_percentage > 25." };
      }

      const res2 = pythonRunner.runValidation({
        discount_percentage: 10,
        items: [{ item_code: 'ROUTER-99', qty: 0 }]
      });
      if (!res2.threw || !res2.message.includes('Quantity must be greater than 0')) {
        return { pass: false, error: "Validation failed to throw error when item quantity <= 0." };
      }

      const res3 = pythonRunner.runValidation({
        discount_percentage: 15,
        items: [{ item_code: 'ROUTER-99', qty: 4 }]
      });
      if (res3.threw) {
        return { pass: false, error: `Valid invoice threw an unexpected error: ${res3.message}` };
      }

      return { pass: true, message: "Superb! Server-side controller validation successfully guards document integrity!" };
    }
  },

  {
    id: 'py-02-orm-mastery',
    trackId: 'server-scripts',
    title: 'The ORM Alchemist',
    level: 'Intermediate',
    xp: 280,
    coins: 110,
    doctype: 'Stock Entry',
    language: 'python',
    summary: 'Use frappe.get_doc, frappe.db.get_value, and frappe.db.set_value to sync inventory logs.',
    briefing: `Write a server method \`sync_item_stock(item_code, warehouse, updated_qty)\`:
1. Use \`frappe.db.get_value("Item", item_code, ["item_name", "stock_uom"], as_dict=True)\` to fetch metadata.
2. If item does not exist, throw \`frappe.throw(_("Item {0} not found").format(item_code))\`.
3. Update the item's last checked timestamp via \`frappe.db.set_value("Item", item_code, "last_audited_warehouse", warehouse)\`.
4. Return a dict: \`{"status": "success", "item_name": item.item_name, "stock_uom": item.stock_uom, "qty": updated_qty}\`.`,
    objectives: [
      'Use `frappe.db.get_value("Item", item_code, ...)` efficiently without loading the full document',
      'Validate existence with `frappe.throw`',
      'Update database record with `frappe.db.set_value`',
      'Return structured JSON response'
    ],
    docReference: {
      title: 'Frappe Database API: Database Methods',
      url: 'https://frappeframework.com/docs/user/en/api/database',
      codeSnippet: `@frappe.whitelist()
def sync_item_stock(item_code, warehouse, updated_qty):
    item = frappe.db.get_value('Item', item_code, ['item_name', 'stock_uom'], as_dict=True)
    if not item:
        frappe.throw(_("Item {0} not found").format(item_code))
        
    frappe.db.set_value('Item', item_code, 'last_audited_warehouse', warehouse)
    return {
        'status': 'success',
        'item_name': item.item_name,
        'stock_uom': item.stock_uom,
        'qty': updated_qty
    }`
    },
    starterCode: `import frappe
from frappe import _

@frappe.whitelist()
def sync_item_stock(item_code, warehouse, updated_qty):
    # TODO: Fetch item details with frappe.db.get_value, update warehouse, and return dict
    pass`,
    solutionCode: `import frappe
from frappe import _

@frappe.whitelist()
def sync_item_stock(item_code, warehouse, updated_qty):
    item = frappe.db.get_value('Item', item_code, ['item_name', 'stock_uom'], as_dict=True)
    if not item:
        frappe.throw(_("Item {0} not found").format(item_code))
        
    frappe.db.set_value('Item', item_code, 'last_audited_warehouse', warehouse)
    return {
        'status': 'success',
        'item_name': item.item_name,
        'stock_uom': item.stock_uom,
        'qty': updated_qty
    }`,
    testDoc: {
      doctype: 'Item',
      name: 'ITM-FIBER-01',
      item_name: 'Ultra Fiber 10G Cable',
      stock_uom: 'Meter',
      last_audited_warehouse: ''
    },
    validate: (logs, context) => {
      const { pythonRunner } = context;
      const res = pythonRunner.runFunction('sync_item_stock', ['ITM-FIBER-01', 'Stores - TG', 500]);
      if (!res || res.status !== 'success') {
        return { pass: false, error: "sync_item_stock did not return the expected status: 'success' dictionary." };
      }
      if (res.item_name !== 'Ultra Fiber 10G Cable' || res.stock_uom !== 'Meter') {
        return { pass: false, error: "Item metadata (item_name, stock_uom) was not correctly queried from database." };
      }
      const invalidRes = pythonRunner.runFunction('sync_item_stock', ['NON-EXISTENT', 'Stores - TG', 10]);
      if (!invalidRes.threw) {
        return { pass: false, error: "Method should throw when item does not exist in database." };
      }
      return { pass: true, message: "Masterful! Your Frappe ORM and Database querying skills are on point!" };
    }
  },

  // TRACK 3: ERPNext Business Logic & Workflows
  {
    id: 'erp-01-quotation-to-order',
    trackId: 'erpnext-scenarios',
    title: 'The Sales Conversion Pipeline',
    level: 'Advanced',
    xp: 350,
    coins: 150,
    doctype: 'Quotation',
    language: 'javascript',
    summary: 'Build a custom "Create Fast Order" dialog with delivery date selection and server bridge.',
    briefing: `The Sales Reps want to convert approved Quotations into Sales Orders directly from the form with custom terms:
1. Add a custom button **"Fast Convert"** inside **"Create"** group.
2. Only show this button if \`frm.doc.docstatus === 1\` (Submitted) and \`frm.doc.status === "Open"\`.
3. When clicked, open a \`frappe.prompt\` asking for \`Delivery Date\` (Date field) and \`Advance Amount\` (Currency).
4. On dialog submit, execute \`frappe.call\` to \`erpnext.selling.doctype.quotation.quotation.make_sales_order\` with the custom values.`,
    objectives: [
      'Conditionally add custom button based on `docstatus` and `status`',
      'Prompt user with `frappe.prompt([{ label: "Delivery Date", fieldname: "delivery_date", fieldtype: "Date", reqd: 1 }, ...], callback)`',
      'Dispatch `frappe.call({ method: "...", args: {...} })`'
    ],
    docReference: {
      title: 'Frappe Dialogs & Prompts',
      url: 'https://frappeframework.com/docs/user/en/api/dialog#frappeprompt',
      codeSnippet: `frappe.ui.form.on('Quotation', {
    refresh(frm) {
        if (frm.doc.docstatus === 1 && frm.doc.status === 'Open') {
            frm.add_custom_button('Fast Convert', () => {
                frappe.prompt([
                    { label: 'Delivery Date', fieldname: 'delivery_date', fieldtype: 'Date', reqd: 1 },
                    { label: 'Advance Amount', fieldname: 'advance_amount', fieldtype: 'Currency' }
                ], (values) => {
                    frappe.call({
                        method: 'erpnext.selling.doctype.quotation.quotation.make_sales_order',
                        args: {
                            source_name: frm.doc.name,
                            delivery_date: values.delivery_date,
                            advance_amount: values.advance_amount
                        },
                        callback: function(r) {
                            frappe.show_alert('Sales Order Generated Successfully!');
                        }
                    });
                }, 'Convert to Sales Order', 'Create Order');
            }, 'Create');
        }
    }
});`
    },
    starterCode: `frappe.ui.form.on('Quotation', {
    refresh(frm) {
        // TODO: Conditionally add 'Fast Convert' under 'Create' when submitted and Open
        
    }
});`,
    solutionCode: `frappe.ui.form.on('Quotation', {
    refresh(frm) {
        if (frm.doc.docstatus === 1 && frm.doc.status === 'Open') {
            frm.add_custom_button('Fast Convert', () => {
                frappe.prompt([
                    { label: 'Delivery Date', fieldname: 'delivery_date', fieldtype: 'Date', reqd: 1 },
                    { label: 'Advance Amount', fieldname: 'advance_amount', fieldtype: 'Currency' }
                ], (values) => {
                    frappe.call({
                        method: 'erpnext.selling.doctype.quotation.quotation.make_sales_order',
                        args: {
                            source_name: frm.doc.name,
                            delivery_date: values.delivery_date,
                            advance_amount: values.advance_amount
                        },
                        callback: function(r) {
                            frappe.show_alert('Sales Order Generated Successfully!');
                        }
                    });
                }, 'Convert to Sales Order', 'Create Order');
            }, 'Create');
        }
    }
});`,
    testDoc: {
      doctype: 'Quotation',
      name: 'QTN-2026-9041',
      party_name: 'Apex Global Industries',
      docstatus: 1,
      status: 'Open',
      grand_total: 48000
    },
    validate: (logs, context) => {
      const { frm, buttons } = context;
      const btn = buttons.find(b => b.label.toLowerCase() === 'fast convert');
      if (!btn) {
        return { pass: false, error: "Button 'Fast Convert' was not registered under 'Create' for submitted open Quotations." };
      }
      if (btn.group !== 'Create') {
        return { pass: false, error: `Button must be grouped under 'Create', found: '${btn.group}'` };
      }
      return { pass: true, message: "Sensational! Fast conversion dialog and ERPNext method bridge are primed and ready!" };
    }
  },

  // TRACK 4: REST API & Background Jobs
  {
    id: 'api-01-rest-query',
    trackId: 'api-integrations',
    title: 'The REST API Navigator',
    level: 'Intermediate',
    xp: 260,
    coins: 100,
    doctype: 'Customer',
    language: 'javascript',
    summary: 'Query Frappe REST API with filters, selected fields, and pagination parameters.',
    briefing: `Construct an async JS fetch function \`fetchActiveVIPCustomers()\` that queries Frappe's REST API:
- Endpoint: \`/api/resource/Customer\`
- Filters: \`[["customer_group", "=", "Commercial"], ["disabled", "=", 0]]\`
- Fields: \`["name", "customer_name", "territory", "loyalty_program"]\`
- Order by: \`creation desc\`
- Limit: \`20\`
Return the decoded \`data\` array from response JSON.`,
    objectives: [
      'Format URL search params with `JSON.stringify(filters)` and `JSON.stringify(fields)`',
      'Set `order_by="creation desc"` and `limit_page_length=20`',
      'Execute GET fetch with Frappe headers and return data'
    ],
    docReference: {
      title: 'Frappe REST API Resource Listing',
      url: 'https://frappeframework.com/docs/user/en/api/rest',
      codeSnippet: `async function fetchActiveVIPCustomers() {
    const params = new URLSearchParams({
        filters: JSON.stringify([['customer_group', '=', 'Commercial'], ['disabled', '=', 0]]),
        fields: JSON.stringify(['name', 'customer_name', 'territory', 'loyalty_program']),
        order_by: 'creation desc',
        limit_page_length: 20
    });
    
    const response = await fetch('/api/resource/Customer?' + params.toString());
    const json = await response.json();
    return json.data;
}`
    },
    starterCode: `async function fetchActiveVIPCustomers() {
    // TODO: Build REST query parameters and fetch from /api/resource/Customer
    
}`,
    solutionCode: `async function fetchActiveVIPCustomers() {
    const params = new URLSearchParams({
        filters: JSON.stringify([['customer_group', '=', 'Commercial'], ['disabled', '=', 0]]),
        fields: JSON.stringify(['name', 'customer_name', 'territory', 'loyalty_program']),
        order_by: 'creation desc',
        limit_page_length: 20
    });
    const res = await fetch('/api/resource/Customer?' + params.toString());
    const result = await res.json();
    return result.data;
}`,
    testDoc: {
      doctype: 'Customer',
      name: 'REST-SIM'
    },
    validate: (logs, context) => {
      const { fetchSimulator } = context;
      const res = fetchSimulator.testQuery('fetchActiveVIPCustomers');
      if (!res.called) {
        return { pass: false, error: "fetch was not called with /api/resource/Customer." };
      }
      if (!res.url.includes('customer_group') || !res.url.includes('Commercial')) {
        return { pass: false, error: "Query filters must include [['customer_group', '=', 'Commercial'], ['disabled', '=', 0]]." };
      }
      if (!res.url.includes('loyalty_program')) {
        return { pass: false, error: "Query fields parameter must include loyalty_program and required columns." };
      }
      return { pass: true, message: "Incredible! Your REST API queries adhere precisely to Frappe resource filtering standards!" };
    }
  },

  // TRACK 5: Reports & Jinja
  {
    id: 'jinja-01-print-format',
    trackId: 'reports-jinja',
    title: 'The Jinja Print Artisan',
    level: 'Intermediate',
    xp: 220,
    coins: 90,
    doctype: 'Sales Invoice',
    language: 'html',
    summary: 'Build a modern Jinja2 print format template with conditional tax badge and formatted currency.',
    briefing: `Craft a clean Jinja2 HTML template snippet for a Sales Invoice:
1. Display the customer name in an \`<h2>{{ doc.customer_name }}</h2>\`.
2. Loop over \`doc.items\` in an HTML table:
   - For each item, display \`{{ item.item_name }}\`, \`{{ item.qty }}\`, and \`{{ frappe.format_value(item.rate, {'fieldtype': 'Currency'}) }}\`.
3. If \`doc.discount_amount > 0\`, show a discount banner:
   \`<div class="discount-banner">Special Discount: {{ frappe.format_value(doc.discount_amount, {'fieldtype': 'Currency'}) }}</div>\`.
4. Render grand total with \`<strong>Grand Total: {{ frappe.format_value(doc.grand_total, {'fieldtype': 'Currency'}) }}</strong>\`.`,
    objectives: [
      'Use `{% for item in doc.items %} ... {% endfor %}` loop',
      'Format money values using `{{ frappe.format_value(value, {"fieldtype": "Currency"}) }}`',
      'Use conditional `{% if doc.discount_amount > 0 %} ... {% endif %}` block'
    ],
    docReference: {
      title: 'Frappe Jinja Print Format Engine',
      url: 'https://frappeframework.com/docs/user/en/guides/reports-and-printing/print-format-jinja',
      codeSnippet: `<h2>{{ doc.customer_name }}</h2>
<table class="table">
    <thead>
        <tr><th>Item</th><th>Qty</th><th>Rate</th></tr>
    </thead>
    <tbody>
        {% for item in doc.items %}
        <tr>
            <td>{{ item.item_name }}</td>
            <td>{{ item.qty }}</td>
            <td>{{ frappe.format_value(item.rate, {"fieldtype": "Currency"}) }}</td>
        </tr>
        {% endfor %}
    </tbody>
</table>

{% if doc.discount_amount > 0 %}
<div class="discount-banner">
    Special Discount: {{ frappe.format_value(doc.discount_amount, {"fieldtype": "Currency"}) }}
</div>
{% endif %}

<strong>Grand Total: {{ frappe.format_value(doc.grand_total, {"fieldtype": "Currency"}) }}</strong>`
    },
    starterCode: `<h2>{{ doc.customer_name }}</h2>

<!-- TODO: Table with items loop, conditional discount banner, and grand total -->
`,
    solutionCode: `<h2>{{ doc.customer_name }}</h2>
<table class="table table-bordered">
    <thead>
        <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Rate</th>
        </tr>
    </thead>
    <tbody>
        {% for item in doc.items %}
        <tr>
            <td>{{ item.item_name }}</td>
            <td>{{ item.qty }}</td>
            <td>{{ frappe.format_value(item.rate, {"fieldtype": "Currency"}) }}</td>
        </tr>
        {% endfor %}
    </tbody>
</table>

{% if doc.discount_amount > 0 %}
<div class="discount-banner">
    Special Discount: {{ frappe.format_value(doc.discount_amount, {"fieldtype": "Currency"}) }}
</div>
{% endif %}

<div class="total-section">
    <strong>Grand Total: {{ frappe.format_value(doc.grand_total, {"fieldtype": "Currency"}) }}</strong>
</div>`,
    testDoc: {
      doctype: 'Sales Invoice',
      name: 'SINV-9901',
      customer_name: 'Quantum Innovations Ltd',
      discount_amount: 450,
      grand_total: 8550,
      items: [
        { item_name: 'Cloud Hosting Node', qty: 2, rate: 4500 }
      ]
    },
    validate: (logs, context) => {
      const { jinjaRenderer } = context;
      const output = jinjaRenderer.render({
        customer_name: 'Quantum Innovations Ltd',
        discount_amount: 450,
        grand_total: 8550,
        items: [{ item_name: 'Cloud Hosting Node', qty: 2, rate: 4500 }]
      });

      if (!output.includes('Quantum Innovations Ltd')) {
        return { pass: false, error: "Template failed to output doc.customer_name." };
      }
      if (!output.includes('Cloud Hosting Node') || !output.includes('4,500') && !output.includes('4500')) {
        return { pass: false, error: "Items table loop is missing item_name or currency rate formatting." };
      }
      if (!output.includes('discount-banner') || !output.includes('Special Discount')) {
        return { pass: false, error: "Conditional discount banner was not rendered when discount_amount > 0." };
      }
      return { pass: true, message: "Flawless Jinja formatting! The print layout is elegant, dynamic, and compliant!" };
    }
  }
];

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
  {
    id: 'crm-automations',
    title: 'Frappe CRM Automations & Logic',
    description: 'Master CRM automations: dynamic lead scoring, deal won task generators, 3-day inactivity follow-ups, qualification guards, and high-value approvals.',
    icon: 'Zap',
    color: '#06b6d4',
    gradient: 'from-cyan-500/20 to-blue-500/20',
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
1. In the \`refresh(frm)\` handler, apply dynamic query filtering on the \`customer\` link field.
2. The query must return filter criteria:
   - \`disabled: 0\`
   - \`customer_group: 'Commercial'\`
   - \`territory: 'North America'\`
3. Show an alert confirmation with a 5-second duration: \`Customer link filter applied!\`.`,
    objectives: [
      'Hook into the form refresh lifecycle event using the Desk Form API',
      'Bind a dynamic filter query callback to the target "customer" link field',
      'Return an object containing filter criteria for active Commercial accounts in North America',
      'Dispatch a visual confirmation alert with a 5-second timeout'
    ],
    hints: [
      "Direction 1: Register the form render hook by wrapping your logic inside the 'refresh(frm)' event on 'Sales Order'.",
      "Direction 2: Use the Form API method 'frm.set_query(\'customer\', callback)' where the callback returns an object with a 'filters' dictionary.",
      "Direction 3: Populate the 'filters' dictionary with three required key-value pairs: 'disabled': 0, 'customer_group': 'Commercial', and 'territory': 'North America'.",
      "Direction 4: After registering the query filter, invoke 'frappe.show_alert(...)' passing the required message and 5-second duration."
    ],
    expectedSymbols: {
      functions: [
        { name: 'refresh', label: 'refresh(frm)', purpose: 'Form render lifecycle event handler', direction: 'Define refresh(frm) inside frappe.ui.form.on' }
      ],
      methods: [
        { name: 'frm.set_query', label: 'frm.set_query()', purpose: 'Binds dynamic query filters to a Link field', direction: 'Call frm.set_query on the "customer" field' },
        { name: 'frappe.show_alert', label: 'frappe.show_alert()', purpose: 'Renders visual confirmation toast in Desk', direction: 'Call frappe.show_alert("Customer link filter applied!", 5)' }
      ],
      attributes: [
        { name: 'customer', label: '"customer"', purpose: 'Target link field name', direction: 'Pass "customer" as the first argument to frm.set_query' },
        { name: 'filters', label: 'filters', purpose: 'Dictionary property containing query conditions', direction: 'Return an object containing { filters: { ... } }' },
        { name: 'disabled', label: 'disabled', purpose: 'Status filter attribute (0 for active)', direction: 'Include disabled: 0 in the filters dictionary' },
        { name: 'customer_group', label: 'customer_group', purpose: 'Customer classification filter attribute', direction: 'Include customer_group: "Commercial" in filters' },
        { name: 'territory', label: 'territory', purpose: 'Geographical filter attribute', direction: 'Include territory: "North America" in filters' }
      ]
    },
    docReference: {
      title: 'Frappe Form API: frm.set_query (Architecture Pattern)',
      url: 'https://frappeframework.com/docs/user/en/api/form#frmset_query',
      patternType: 'pseudocode',
      codeSnippet: `// Dynamic Link Query Filter Pattern (Pseudocode)
frappe.ui.form.on('<DocType>', {
    refresh(frm) {
        // Bind dynamic filter callback to target link field
        frm.set_query('<target_link_field>', () => {
            return {
                filters: {
                    '<attribute_status>': <status_value>,
                    '<attribute_category>': '<expected_category>',
                    '<attribute_region>': '<expected_region>'
                }
            };
        });
        
        // Render user confirmation toast
        frappe.show_alert('<confirmation_message>', <duration_seconds>);
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
      'Define the validate(self) controller lifecycle hook on JournalEntry',
      'Compute debit and credit sums by aggregating over child table self.accounts',
      'Throw localized error with formatted totals if debit does not equal credit',
      'Synchronize self.total_amount with total debit when balanced'
    ],
    hints: [
      "Direction 1: Implement the 'def validate(self):' controller hook inside the JournalEntry(Document) class.",
      "Direction 2: Use generator expressions or loops to aggregate totals: sum(row.debit or 0 for row in self.accounts) and sum(row.credit or 0 for row in self.accounts).",
      "Direction 3: Guard with floating point rounding: compare 'round(total_debit, 2) != round(total_credit, 2)'.",
      "Direction 4: If unbalanced, call frappe.throw(_('Total Debit ({0}) must equal Total Credit ({1})').format(total_debit, total_credit)).",
      "Direction 5: If valid, assign self.total_amount = total_debit to store the header balance."
    ],
    expectedSymbols: {
      functions: [
        { name: 'validate', label: 'validate(self)', purpose: 'Server controller validation lifecycle hook', direction: 'Define def validate(self): on JournalEntry' }
      ],
      methods: [
        { name: 'frappe.throw', label: 'frappe.throw()', purpose: 'Rolls back database transaction and halts save', direction: 'Invoke frappe.throw on balance mismatch' },
        { name: 'round', label: 'round()', purpose: 'Rounds floating point numbers to 2 decimal places', direction: 'Use round(..., 2) before comparing totals' }
      ],
      attributes: [
        { name: 'accounts', label: 'self.accounts', purpose: 'Child table rows containing accounting splits', direction: 'Iterate over self.accounts' },
        { name: 'debit', label: 'row.debit', purpose: 'Account debit value', direction: 'Access row.debit or 0' },
        { name: 'credit', label: 'row.credit', purpose: 'Account credit value', direction: 'Access row.credit or 0' },
        { name: 'total_amount', label: 'self.total_amount', purpose: 'Document total amount attribute', direction: 'Assign total_debit to self.total_amount' }
      ]
    },
    docReference: {
      title: 'ERPNext Accounting Validation Principles (Architecture Pattern)',
      url: 'https://docs.frappe.io/erpnext/introduction',
      patternType: 'pseudocode',
      codeSnippet: `# General Ledger Balancing Pattern (Pseudocode)
import frappe
from frappe import _
from frappe.model.document import Document

class <DocTypeController>(Document):
    def validate(self):
        # 1. Aggregate debit and credit balances over child rows
        total_debit = sum((row.<debit_field> or 0) for row in self.<child_table>)
        total_credit = sum((row.<credit_field> or 0) for row in self.<child_table>)
        
        # 2. Guard against unbalanced accounting ledger postings
        if round(total_debit, 2) != round(total_credit, 2):
            frappe.throw(_("<mismatch_message_with_placeholders>").format(total_debit, total_credit))
            
        # 3. Synchronize document level total amount
        self.<total_amount_field> = total_debit`
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
      'Import make_autoname from frappe.model.naming',
      'Implement def autoname(self): on the Document controller class',
      'Generate series name with make_autoname and assign to self.name'
    ],
    hints: [
      "Direction 1: Import make_autoname with 'from frappe.model.naming import make_autoname'.",
      "Direction 2: Define 'def autoname(self):' as an instance method inside CustomTicket(Document).",
      "Direction 3: Call make_autoname('TICK-.YYYY.-.MM.-.#####') and assign the resulting string directly to self.name."
    ],
    expectedSymbols: {
      functions: [
        { name: 'autoname', label: 'autoname(self)', purpose: 'Frappe custom naming hook', direction: 'Define def autoname(self): in CustomTicket' }
      ],
      methods: [
        { name: 'make_autoname', label: 'make_autoname()', purpose: 'Series string formatting generator', direction: 'Call make_autoname("TICK-.YYYY.-.MM.-.#####")' }
      ],
      attributes: [
        { name: 'name', label: 'self.name', purpose: 'Document primary key attribute', direction: 'Assign generated string to self.name' }
      ]
    },
    docReference: {
      title: 'Frappe DocType Naming: autoname() (Architecture Pattern)',
      url: 'https://frappeframework.com/docs/user/en/basics/doctypes/naming',
      patternType: 'pseudocode',
      codeSnippet: `# Custom Document Autoname Pattern (Pseudocode)
import frappe
from frappe.model.document import Document
from frappe.model.naming import make_autoname

class <DocTypeController>(Document):
    def autoname(self):
        # Generate standardized naming series with date tokens
        self.name = make_autoname('<PREFIX-.YEAR_TOKEN.-.MONTH_TOKEN.-.DIGITS>')`
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
      'Hook into the form refresh lifecycle event on Sales Order',
      'Add a custom button "VIP Priority" grouped under "Actions"',
      'In the button callback, update customer_notes with the VIP rush delivery note',
      'Display a 5-second alert confirmation using frappe.show_alert'
    ],
    hints: [
      "Direction 1: Implement the 'refresh(frm)' event within 'frappe.ui.form.on(\'Sales Order\', { ... })'.",
      "Direction 2: Call 'frm.add_custom_button(\'VIP Priority\', callback, \'Actions\')' to group it under the Actions menu.",
      "Direction 3: In the callback function, update the field using 'frm.set_value(\'customer_notes\', \'★ VIP Priority Client - Rush Delivery\')'.",
      "Direction 4: Fire 'frappe.show_alert(\'Order marked as VIP Priority!\', 5)' to confirm the update."
    ],
    expectedSymbols: {
      functions: [
        { name: 'refresh', label: 'refresh(frm)', purpose: 'Form render event handler', direction: 'Define refresh(frm) inside frappe.ui.form.on' }
      ],
      methods: [
        { name: 'frm.add_custom_button', label: 'frm.add_custom_button()', purpose: 'Adds custom action button to form navbar', direction: 'Call frm.add_custom_button("VIP Priority", callback, "Actions")' },
        { name: 'frm.set_value', label: 'frm.set_value()', purpose: 'Updates form field value', direction: 'Call frm.set_value on "customer_notes"' },
        { name: 'frappe.show_alert', label: 'frappe.show_alert()', purpose: 'Renders confirmation alert in Desk', direction: 'Call frappe.show_alert with 5 second duration' }
      ],
      attributes: [
        { name: 'customer_notes', label: '"customer_notes"', purpose: 'Target form fieldname', direction: 'Pass "customer_notes" to frm.set_value' },
        { name: 'Actions', label: '"Actions"', purpose: 'Dropdown menu group name', direction: 'Pass "Actions" as third parameter to frm.add_custom_button' }
      ]
    },
    docReference: {
      title: 'Frappe Form API: frm.add_custom_button (Architecture Pattern)',
      url: 'https://frappeframework.com/docs/user/en/api/form#frmadd_custom_button',
      patternType: 'pseudocode',
      codeSnippet: `// Form Custom Button Pattern (Pseudocode)
frappe.ui.form.on('<DocType>', {
    refresh(frm) {
        // Register custom action button under optional menu group
        frm.add_custom_button('<Button_Label>', () => {
            // Update target form field
            frm.set_value('<target_field>', '<new_value>');
            
            // Show feedback toast
            frappe.show_alert('<toast_message>', <duration_seconds>);
        }, '<Optional_Group_Name>');
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
      'Listen for changes to customer_type using the field change event hook',
      'Trigger customer_type on refresh so existing records initialize correctly',
      'Toggle tax_id requirement (reqd = 1 or 0) based on Company selection',
      'Toggle company_registration_no visibility (hidden = 0 or 1) based on Company selection'
    ],
    hints: [
      "Direction 1: In the 'Customer' client script, define both 'refresh(frm)' and 'customer_type(frm)' handlers.",
      "Direction 2: In refresh(frm), call 'frm.trigger(\'customer_type\')' so existing form records apply properties immediately upon opening.",
      "Direction 3: In customer_type(frm), check if 'frm.doc.customer_type === \'Company\''.",
      "Direction 4: Use 'frm.set_df_property(\'tax_id\', \'reqd\', isCompany ? 1 : 0)' to control required status.",
      "Direction 5: Use 'frm.set_df_property(\'company_registration_no\', \'hidden\', isCompany ? 0 : 1)' to control field visibility."
    ],
    expectedSymbols: {
      functions: [
        { name: 'refresh', label: 'refresh(frm)', purpose: 'Form render event handler', direction: 'Define refresh(frm) to trigger initial validation' },
        { name: 'customer_type', label: 'customer_type(frm)', purpose: 'Field change event handler', direction: 'Define customer_type(frm) inside frappe.ui.form.on' }
      ],
      methods: [
        { name: 'frm.set_df_property', label: 'frm.set_df_property()', purpose: 'Dynamically mutates field properties in Desk', direction: 'Call frm.set_df_property for reqd and hidden properties' },
        { name: 'frm.trigger', label: 'frm.trigger()', purpose: 'Programmatically invokes field handler', direction: 'Call frm.trigger("customer_type") inside refresh' }
      ],
      attributes: [
        { name: 'customer_type', label: 'customer_type', purpose: 'Field controlling the condition', direction: 'Inspect frm.doc.customer_type' },
        { name: 'tax_id', label: 'tax_id', purpose: 'Target field for mandatory flag', direction: 'Set reqd property on tax_id' },
        { name: 'company_registration_no', label: 'company_registration_no', purpose: 'Target field for hidden flag', direction: 'Set hidden property on company_registration_no' }
      ]
    },
    docReference: {
      title: 'Frappe Form API: Field Properties (Architecture Pattern)',
      url: 'https://frappeframework.com/docs/user/en/api/form#frmset_df_property',
      patternType: 'pseudocode',
      codeSnippet: `// Dynamic Field Properties Pattern (Pseudocode)
frappe.ui.form.on('<DocType>', {
    refresh(frm) {
        // Trigger field handler on form render to sync existing data
        frm.trigger('<condition_field>');
    },
    <condition_field>(frm) {
        const isTargetCondition = frm.doc.<condition_field> === '<Expected_Value>';
        
        // Dynamically toggle required and hidden properties
        frm.set_df_property('<field_a>', 'reqd', isTargetCondition ? 1 : 0);
        frm.set_df_property('<field_b>', 'hidden', isTargetCondition ? 0 : 1);
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
      const { frm, fieldProperties } = context;
      frm.doc.customer_type = 'Company';
      context.triggerFieldChange('customer_type');

      const taxReqd = fieldProperties.tax_id?.reqd;
      const regHidden = fieldProperties.company_registration_no?.hidden;

      if (taxReqd !== 1) {
        return { pass: false, error: "When customer_type is 'Company', 'tax_id' field must be mandatory (reqd = 1)." };
      }
      if (regHidden !== 0) {
        return { pass: false, error: "When customer_type is 'Company', 'company_registration_no' field must be visible (hidden = 0)." };
      }

      frm.doc.customer_type = 'Individual';
      context.triggerFieldChange('customer_type');

      if (fieldProperties.tax_id?.reqd !== 0) {
        return { pass: false, error: "When customer_type is 'Individual', 'tax_id' field must be optional (reqd = 0)." };
      }
      if (fieldProperties.company_registration_no?.hidden !== 1) {
        return { pass: false, error: "When customer_type is 'Individual', 'company_registration_no' field must be hidden (hidden = 1)." };
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
      'Listen for child table row modifications on qty and rate events',
      'Compute line amount for the active row and update via frappe.model.set_value',
      'Aggregate sum across all child table items and set main total_amount'
    ],
    hints: [
      "Direction 1: Hook child table field changes using 'frappe.ui.form.on(\'Quotation Item\', { qty(frm, cdt, cdn) { ... }, rate(frm, cdt, cdn) { ... } })'.",
      "Direction 2: Access the active child row object via 'locals[cdt][cdn]'.",
      "Direction 3: Calculate the row amount: '(row.qty * row.rate) - (row.discount_amount || 0)'.",
      "Direction 4: Store the computed row value using 'frappe.model.set_value(cdt, cdn, \'amount\', amount)'.",
      "Direction 5: Loop over 'frm.doc.items' to aggregate total sum, then call 'frm.set_value(\'total_amount\', sum)'."
    ],
    expectedSymbols: {
      functions: [
        { name: 'qty', label: 'qty(frm, cdt, cdn)', purpose: 'Child table row qty event handler', direction: 'Define qty in frappe.ui.form.on("Quotation Item")' },
        { name: 'rate', label: 'rate(frm, cdt, cdn)', purpose: 'Child table row rate event handler', direction: 'Define rate in frappe.ui.form.on("Quotation Item")' }
      ],
      methods: [
        { name: 'frappe.model.set_value', label: 'frappe.model.set_value()', purpose: 'Updates child table row in locals', direction: 'Call frappe.model.set_value(cdt, cdn, "amount", amount)' },
        { name: 'frm.set_value', label: 'frm.set_value()', purpose: 'Updates parent form total', direction: 'Call frm.set_value("total_amount", sum)' }
      ],
      attributes: [
        { name: 'items', label: 'frm.doc.items', purpose: 'Child table array reference', direction: 'Iterate over frm.doc.items' },
        { name: 'amount', label: 'row.amount', purpose: 'Computed line amount', direction: 'Compute amount per row' },
        { name: 'total_amount', label: 'total_amount', purpose: 'Parent form total amount field', direction: 'Assign grand total to total_amount' }
      ]
    },
    docReference: {
      title: 'Child Table Scripts in Frappe (Architecture Pattern)',
      url: 'https://frappeframework.com/docs/user/en/api/form#child-table-events',
      patternType: 'pseudocode',
      codeSnippet: `// Child Table Calculation & Document Aggregation Pattern (Pseudocode)
function <calculate_totals>(frm, cdt, cdn) {
    let row = locals[cdt][cdn];
    // 1. Calculate row level computed value
    let line_amount = (row.<qty_field> * row.<rate_field>) - (row.<discount_field> || 0);
    frappe.model.set_value(cdt, cdn, '<row_amount_field>', line_amount);
    
    // 2. Sum over all rows in parent document child table
    let grand_total = 0;
    (frm.doc.<child_table_field> || []).forEach(r => { 
        grand_total += (r.<row_amount_field> || 0); 
    });
    frm.set_value('<parent_total_field>', grand_total);
}

frappe.ui.form.on('<Child_DocType>', {
    <qty_field>(frm, cdt, cdn) { <calculate_totals>(frm, cdt, cdn); },
    <rate_field>(frm, cdt, cdn) { <calculate_totals>(frm, cdt, cdn); }
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
      'Define def validate(self): on the SalesInvoice controller class',
      'Check that discount_percentage does not exceed 25%',
      'Iterate through self.items and verify that item.qty is strictly greater than 0',
      'Use frappe.throw to halt execution and reject invalid invoices'
    ],
    hints: [
      "Direction 1: Implement the 'def validate(self):' controller hook inside the SalesInvoice(Document) class.",
      "Direction 2: Check '(self.discount_percentage or 0) > 25'. If true, call frappe.throw(_('Maximum discount allowed is 25%')).",
      "Direction 3: Loop through child rows with 'for item in self.items:'.",
      "Direction 4: Check if '(item.qty or 0) <= 0'. If so, raise frappe.throw(_('Quantity must be greater than 0 for item {0}').format(item.item_code))."
    ],
    expectedSymbols: {
      functions: [
        { name: 'validate', label: 'validate(self)', purpose: 'Server controller validation lifecycle hook', direction: 'Implement def validate(self): in SalesInvoice' }
      ],
      methods: [
        { name: 'frappe.throw', label: 'frappe.throw()', purpose: 'Aborts database save transaction', direction: 'Call frappe.throw when validation conditions fail' }
      ],
      attributes: [
        { name: 'items', label: 'self.items', purpose: 'Child table rows array', direction: 'Loop over self.items' },
        { name: 'discount_percentage', label: 'self.discount_percentage', purpose: 'Discount cap attribute', direction: 'Validate self.discount_percentage <= 25' },
        { name: 'qty', label: 'item.qty', purpose: 'Item quantity attribute', direction: 'Verify item.qty > 0' }
      ]
    },
    docReference: {
      title: 'Frappe Document Lifecycle: validate() (Architecture Pattern)',
      url: 'https://frappeframework.com/docs/user/en/guides/basics/doctype-controller',
      patternType: 'pseudocode',
      codeSnippet: `# Server Document Validation Pattern (Pseudocode)
import frappe
from frappe import _
from frappe.model.document import Document

class <DocTypeController>(Document):
    def validate(self):
        # 1. Enforce header constraint
        if (self.<header_metric> or 0) > <MAX_THRESHOLD>:
            frappe.throw(_("<threshold_violation_message>"))
            
        # 2. Iterate and validate child table rows
        for row in self.<child_table>:
            if (row.<quantity_field> or 0) <= 0:
                frappe.throw(_("<invalid_row_message>").format(row.<identifier_field>))`
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
      'Expose method with @frappe.whitelist() decorator',
      'Query lightweight column dictionary with frappe.db.get_value',
      'Validate item existence and throw localized error if missing',
      'Perform direct database column update with frappe.db.set_value and return dict'
    ],
    hints: [
      "Direction 1: Add '@frappe.whitelist()' above your function definition: 'def sync_item_stock(item_code, warehouse, updated_qty):'.",
      "Direction 2: Query metadata efficiently: 'item = frappe.db.get_value(\'Item\', item_code, [\'item_name\', \'stock_uom\'], as_dict=True)'.",
      "Direction 3: Check 'if not item:' and abort with 'frappe.throw(_(\'Item {0} not found\').format(item_code))'.",
      "Direction 4: Update the warehouse audit marker using 'frappe.db.set_value(\'Item\', item_code, \'last_audited_warehouse\', warehouse)'.",
      "Direction 5: Return a dictionary with 'status': 'success', 'item_name': item.item_name, 'stock_uom': item.stock_uom, and 'qty': updated_qty."
    ],
    expectedSymbols: {
      functions: [
        { name: 'sync_item_stock', label: 'sync_item_stock()', purpose: 'Whitelisted RPC server method', direction: 'Define def sync_item_stock(item_code, warehouse, updated_qty):' }
      ],
      methods: [
        { name: 'frappe.db.get_value', label: 'frappe.db.get_value()', purpose: 'Direct SQL column query without loading document', direction: 'Call frappe.db.get_value on Item' },
        { name: 'frappe.db.set_value', label: 'frappe.db.set_value()', purpose: 'Direct SQL column update', direction: 'Call frappe.db.set_value on Item' },
        { name: 'frappe.throw', label: 'frappe.throw()', purpose: 'Raises error on missing item', direction: 'Throw error if item record is falsy' }
      ],
      attributes: [
        { name: 'as_dict', label: 'as_dict=True', purpose: 'Returns dictionary instead of tuple', direction: 'Pass as_dict=True to frappe.db.get_value' },
        { name: 'last_audited_warehouse', label: '"last_audited_warehouse"', purpose: 'Target column to update', direction: 'Update last_audited_warehouse' }
      ]
    },
    docReference: {
      title: 'Frappe Database API: Database Methods (Architecture Pattern)',
      url: 'https://frappeframework.com/docs/user/en/api/database',
      patternType: 'pseudocode',
      codeSnippet: `# Direct Database ORM Query & Update Pattern (Pseudocode)
import frappe
from frappe import _

@frappe.whitelist()
def <whitelisted_api_method>(<record_key>, <column_value>, <metric_qty>):
    # 1. Fetch targeted fields without loading entire Document instance
    doc_data = frappe.db.get_value('<DocType>', <record_key>, ['<col_a>', '<col_b>'], as_dict=True)
    if not doc_data:
        frappe.throw(_("<not_found_message>").format(<record_key>))
        
    # 2. Perform direct SQL update on target column
    frappe.db.set_value('<DocType>', <record_key>, '<target_column>', <column_value>)
    
    return {
        'status': 'success',
        '<key_a>': doc_data.<col_a>,
        '<key_b>': <metric_qty>
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
      'Conditionally add custom button only when docstatus === 1 and status === "Open"',
      'Place button inside the "Create" navbar menu group',
      'Open interactive input modal using frappe.prompt',
      'Dispatch asynchronous server RPC using frappe.call'
    ],
    hints: [
      "Direction 1: Inside refresh(frm), inspect 'if (frm.doc.docstatus === 1 && frm.doc.status === \'Open\')'.",
      "Direction 2: Register button 'frm.add_custom_button(\'Fast Convert\', callback, \'Create\')'.",
      "Direction 3: In the callback, open 'frappe.prompt([ ... fields ... ], submitCallback, \'Convert to Sales Order\', \'Create Order\')'.",
      "Direction 4: In the prompt submitCallback, call 'frappe.call({ method: \'erpnext.selling.doctype.quotation.quotation.make_sales_order\', args: { source_name: frm.doc.name, ... } })'."
    ],
    expectedSymbols: {
      functions: [
        { name: 'refresh', label: 'refresh(frm)', purpose: 'Form render event handler', direction: 'Implement refresh(frm) on Quotation' }
      ],
      methods: [
        { name: 'frm.add_custom_button', label: 'frm.add_custom_button()', purpose: 'Injects navbar action button', direction: 'Add button "Fast Convert" under "Create"' },
        { name: 'frappe.prompt', label: 'frappe.prompt()', purpose: 'Opens user dialog modal', direction: 'Prompt for delivery_date and advance_amount' },
        { name: 'frappe.call', label: 'frappe.call()', purpose: 'Server RPC bridge call', direction: 'Dispatch frappe.call to make_sales_order' }
      ],
      attributes: [
        { name: 'docstatus', label: 'docstatus', purpose: 'Document submission status', direction: 'Verify docstatus === 1' },
        { name: 'status', label: 'status', purpose: 'Workflow status flag', direction: 'Verify status === "Open"' },
        { name: 'Create', label: '"Create"', purpose: 'Menu dropdown group', direction: 'Group button under "Create"' }
      ]
    },
    docReference: {
      title: 'Frappe Dialogs & Prompts (Architecture Pattern)',
      url: 'https://frappeframework.com/docs/user/en/api/dialog#frappeprompt',
      patternType: 'pseudocode',
      codeSnippet: `// Custom Modal Prompt & Server Bridge Pattern (Pseudocode)
frappe.ui.form.on('<DocType>', {
    refresh(frm) {
        // Conditionally render action based on document submission state
        if (frm.doc.<status_field> === <SUBMITTED_STATE>) {
            frm.add_custom_button('<Button_Label>', () => {
                // Open user dialog modal
                frappe.prompt([
                    { label: '<Field_Label>', fieldname: '<field_name>', fieldtype: '<Field_Type>', reqd: 1 }
                ], (dialog_values) => {
                    // Dispatch server RPC method
                    frappe.call({
                        method: '<dotted_path_to_server_method>',
                        args: {
                            source_name: frm.doc.name,
                            <payload_key>: dialog_values.<field_name>
                        },
                        callback: (r) => {
                            frappe.show_alert('<success_message>');
                        }
                    });
                }, '<Dialog_Title>', '<Action_Button_Label>');
            }, '<Button_Group>');
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
      'Format URLSearchParams with JSON.stringify for filters and fields',
      'Configure order_by and limit_page_length pagination parameters',
      'Execute HTTP fetch against /api/resource/Customer and return data array'
    ],
    hints: [
      "Direction 1: Declare an async function 'fetchActiveVIPCustomers()'.",
      "Direction 2: Instantiate new URLSearchParams with keys: filters (JSON.stringify([...])), fields (JSON.stringify([...])), order_by ('creation desc'), and limit_page_length (20).",
      "Direction 3: Perform 'await fetch(\'/api/resource/Customer?\' + params.toString())'.",
      "Direction 4: Await the JSON decoding with 'const res = await response.json()' and return 'res.data'."
    ],
    expectedSymbols: {
      functions: [
        { name: 'fetchActiveVIPCustomers', label: 'fetchActiveVIPCustomers()', purpose: 'Async REST query function', direction: 'Declare async function fetchActiveVIPCustomers()' }
      ],
      methods: [
        { name: 'fetch', label: 'fetch()', purpose: 'Standard Fetch API HTTP request', direction: 'Execute fetch to /api/resource/Customer' },
        { name: 'JSON.stringify', label: 'JSON.stringify()', purpose: 'Serializes query arrays to JSON strings', direction: 'Stringify filters and fields parameters' }
      ],
      attributes: [
        { name: 'filters', label: 'filters', purpose: 'REST query filter parameter', direction: 'Pass filters array in query params' },
        { name: 'fields', label: 'fields', purpose: 'REST query field projection parameter', direction: 'Pass fields array in query params' },
        { name: 'order_by', label: 'order_by', purpose: 'Sorting order parameter', direction: 'Set order_by to "creation desc"' },
        { name: 'limit_page_length', label: 'limit_page_length', purpose: 'Pagination batch limit', direction: 'Set limit_page_length to 20' }
      ]
    },
    docReference: {
      title: 'Frappe REST API Resource Listing (Architecture Pattern)',
      url: 'https://frappeframework.com/docs/user/en/api/rest',
      patternType: 'pseudocode',
      codeSnippet: `// Frappe REST API Filtered Resource Query Pattern (Pseudocode)
async function <query_function_name>() {
    // Construct URLSearchParams with JSON-serialized filters and field projections
    const params = new URLSearchParams({
        filters: JSON.stringify([['<attribute>', '<operator>', <criterion>]]),
        fields: JSON.stringify(['<column_1>', '<column_2>']),
        order_by: '<sort_column> <asc|desc>',
        limit_page_length: <limit_count>
    });
    
    const response = await fetch('/api/resource/<DocType>?' + params.toString());
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
      'Render customer name heading from doc.customer_name',
      'Iterate over doc.items using Jinja for-loop to generate table rows',
      'Format monetary values using frappe.format_value with Currency fieldtype',
      'Conditionally render discount banner if doc.discount_amount is greater than 0'
    ],
    hints: [
      "Direction 1: Render the customer header using '<h2>{{ doc.customer_name }}</h2>'.",
      "Direction 2: Write a Jinja loop: '{% for item in doc.items %} ... {% endfor %}' to generate table rows.",
      "Direction 3: Use '{{ frappe.format_value(item.rate, {\\'fieldtype\\': \\'Currency\\'}) }}' to output formatted currency.",
      "Direction 4: Wrap the discount banner in '{% if doc.discount_amount > 0 %} ... {% endif %}' with class 'discount-banner'.",
      "Direction 5: Display the grand total formatted with frappe.format_value."
    ],
    expectedSymbols: {
      functions: [
        { name: 'for', label: '{% for item in doc.items %}', purpose: 'Jinja loop iteration over child items', direction: 'Iterate over doc.items with Jinja loop' }
      ],
      methods: [
        { name: 'frappe.format_value', label: 'frappe.format_value()', purpose: 'Jinja currency formatter helper', direction: 'Format currency fields with frappe.format_value' }
      ],
      attributes: [
        { name: 'customer_name', label: 'doc.customer_name', purpose: 'Header customer name attribute', direction: 'Output {{ doc.customer_name }}' },
        { name: 'discount_amount', label: 'doc.discount_amount', purpose: 'Discount value attribute', direction: 'Check if doc.discount_amount > 0' },
        { name: 'grand_total', label: 'doc.grand_total', purpose: 'Invoice final amount attribute', direction: 'Render formatted doc.grand_total' }
      ]
    },
    docReference: {
      title: 'Frappe Jinja Print Format Engine (Architecture Pattern)',
      url: 'https://frappeframework.com/docs/user/en/guides/reports-and-printing/print-format-jinja',
      patternType: 'pseudocode',
      codeSnippet: `<!-- Jinja Print Format Pattern (Pseudocode) -->
<h2>{{ doc.<title_attribute> }}</h2>

<table class="table">
    <thead><tr><th>Item</th><th>Qty</th><th>Rate</th></tr></thead>
    <tbody>
        {% for row in doc.<child_table> %}
        <tr>
            <td>{{ row.<name_attribute> }}</td>
            <td>{{ row.<qty_attribute> }}</td>
            <td>{{ frappe.format_value(row.<rate_attribute>, {"fieldtype": "Currency"}) }}</td>
        </tr>
        {% endfor %}
    </tbody>
</table>

{% if doc.<condition_attribute> > 0 %}
<div class="<banner_css_class>">
    Special Discount: {{ frappe.format_value(doc.<condition_attribute>, {"fieldtype": "Currency"}) }}
</div>
{% endif %}

<strong>Grand Total: {{ frappe.format_value(doc.<total_attribute>, {"fieldtype": "Currency"}) }}</strong>`
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
  },

  // TRACK 6: FRAPPE CRM AUTOMATIONS & LOGIC (Interactive Developer Missions)
  {
    id: 'crm-01-lead-scoring-temperature',
    trackId: 'crm-automations',
    title: 'CRM Lead: Dynamic Lead Scoring & Temperature Pipeline',
    level: 'Intermediate',
    xp: 300,
    coins: 120,
    doctype: 'CRM Lead',
    language: 'javascript',
    summary: 'Build a dynamic lead scoring Client Script: bump score (+25) on prospect engagement, classify temperature (Hot/Warm/Cold), and unlock Fast-Track deal actions.',
    briefing: `### 🎯 Sales Operations Mission:
The VP of Sales asks: *"When a sales representative logs a prospect reply or engagement on a CRM Lead, we need real-time scoring and temperature classification without manual guesswork. If a lead turns 'Hot', immediately unlock a fast-track action to convert them into a Deal!"*

Your Task on the **CRM Lead** Client Script:
1. In the \`frappe.ui.form.on('CRM Lead', { ... })\` definition:
2. In \`refresh(frm)\`:
   - If \`frm.doc.lead_score >= 75\`:
     - Add custom button: \`frm.add_custom_button('Fast-Track to Deal', () => { frappe.show_alert('Promoting lead to Sales Pipeline!', 5); })\`
3. In \`prospect_replied(frm)\` (custom form event):
   - Increment \`frm.doc.lead_score\` by \`25\`:
     \`const new_score = (frm.doc.lead_score || 0) + 25;\`
     \`frm.set_value('lead_score', new_score);\`
   - Dynamically set \`temperature\`:
     - If \`new_score >= 75\`: \`frm.set_value('temperature', 'Hot');\` and add the \`'Fast-Track to Deal'\` button.
     - Else if \`new_score >= 35\`: \`frm.set_value('temperature', 'Warm');\`
     - Else: \`frm.set_value('temperature', 'Cold');\`
   - Show notification:
     \`frappe.show_alert('Lead score updated! Current temperature: ' + (new_score >= 75 ? 'Hot' : 'Warm'), 5);\`
`,
    objectives: [
      'In refresh(frm), unlock the "Fast-Track to Deal" action when lead_score is >= 75',
      'Implement prospect_replied(frm) event handler to increment lead_score by 25',
      'Classify temperature into Hot (>=75), Warm (>=35), or Cold (<35)',
      'Trigger frappe.show_alert with current temperature update'
    ],
    hints: [
      "Direction 1: Implement both 'refresh(frm)' and 'prospect_replied(frm)' within 'frappe.ui.form.on(\'CRM Lead\', { ... })'.",
      "Direction 2: In refresh(frm), check 'if ((frm.doc.lead_score || 0) >= 75)' and add the 'Fast-Track to Deal' button.",
      "Direction 3: In prospect_replied(frm), compute 'new_score = (frm.doc.lead_score || 0) + 25' and update with 'frm.set_value(\'lead_score\', new_score)'.",
      "Direction 4: Check if 'new_score >= 75': set temperature to 'Hot' and add 'Fast-Track to Deal'. If >= 35 set to 'Warm', else 'Cold'.",
      "Direction 5: Trigger frappe.show_alert with the new temperature."
    ],
    expectedSymbols: {
      functions: [
        { name: 'refresh', label: 'refresh(frm)', purpose: 'Form render event handler', direction: 'Define refresh(frm) on CRM Lead' },
        { name: 'prospect_replied', label: 'prospect_replied(frm)', purpose: 'Prospect engagement event handler', direction: 'Define prospect_replied(frm) inside frappe.ui.form.on' }
      ],
      methods: [
        { name: 'frm.set_value', label: 'frm.set_value()', purpose: 'Updates form field value', direction: 'Update lead_score and temperature with frm.set_value' },
        { name: 'frm.add_custom_button', label: 'frm.add_custom_button()', purpose: 'Adds fast-track button', direction: 'Add "Fast-Track to Deal" button' },
        { name: 'frappe.show_alert', label: 'frappe.show_alert()', purpose: 'Displays status toast', direction: 'Trigger notification toast' }
      ],
      attributes: [
        { name: 'lead_score', label: 'lead_score', purpose: 'Lead scoring attribute', direction: 'Increment lead_score by 25' },
        { name: 'temperature', label: 'temperature', purpose: 'Classification attribute', direction: 'Assign "Hot", "Warm", or "Cold"' }
      ]
    },
    docReference: {
      title: 'Frappe CRM Form Events & Lead Scoring (Architecture Pattern)',
      url: 'https://docs.frappe.io/crm/automations/introduction',
      patternType: 'pseudocode',
      codeSnippet: `// CRM Dynamic Lead Scoring & Stage Routing Pattern (Pseudocode)
frappe.ui.form.on('<DocType>', {
    refresh(frm) {
        // Conditionally unlock high-priority pipeline actions
        if ((frm.doc.<score_field> || 0) >= <HOT_THRESHOLD>) {
            frm.add_custom_button('<Action_Button_Label>', () => {
                frappe.show_alert('<alert_message>', <duration_seconds>);
            });
        }
    },
    <engagement_event>(frm) {
        // Increment score metric
        const new_score = (frm.doc.<score_field> || 0) + <SCORE_INCREMENT>;
        frm.set_value('<score_field>', new_score);
        
        // Categorize status temperature
        if (new_score >= <HOT_THRESHOLD>) {
            frm.set_value('<temperature_field>', 'Hot');
            frm.add_custom_button('<Action_Button_Label>', () => { ... });
        } else if (new_score >= <WARM_THRESHOLD>) {
            frm.set_value('<temperature_field>', 'Warm');
        } else {
            frm.set_value('<temperature_field>', 'Cold');
        }
        
        frappe.show_alert('<notification_message>', <duration_seconds>);
    }
});`
    },
    starterCode: `frappe.ui.form.on('CRM Lead', {
    refresh(frm) {
        // TODO: If lead_score >= 75, add custom button 'Fast-Track to Deal'
        
    },

    prospect_replied(frm) {
        // TODO: Increment lead_score by 25 and dynamically set temperature ('Hot', 'Warm', 'Cold')
        // Show frappe.show_alert with current temperature
        
    }
});`,
    solutionCode: `frappe.ui.form.on('CRM Lead', {
    refresh(frm) {
        if ((frm.doc.lead_score || 0) >= 75) {
            frm.add_custom_button('Fast-Track to Deal', () => {
                frappe.show_alert('Promoting lead to Sales Pipeline!', 5);
            });
        }
    },

    prospect_replied(frm) {
        const new_score = (frm.doc.lead_score || 0) + 25;
        frm.set_value('lead_score', new_score);

        if (new_score >= 75) {
            frm.set_value('temperature', 'Hot');
            frm.add_custom_button('Fast-Track to Deal', () => {
                frappe.show_alert('Promoting lead to Sales Pipeline!', 5);
            });
        } else if (new_score >= 35) {
            frm.set_value('temperature', 'Warm');
        } else {
            frm.set_value('temperature', 'Cold');
        }

        frappe.show_alert('Lead score updated! Current temperature: ' + (new_score >= 75 ? 'Hot' : 'Warm'), 5);
    }
});`,
    testDoc: {
      doctype: 'CRM Lead',
      name: 'LEAD-2026-0088',
      lead_name: 'Devin Thorne',
      company_name: 'Acme Innovations',
      email_id: 'devin@acmecorp.com',
      lead_score: 55,
      temperature: 'Warm',
      status: 'Open'
    },
    validate: (logs, context) => {
      const { frm, alerts, registeredHandlers } = context;
      const leadHandlers = registeredHandlers && registeredHandlers['CRM Lead'];
      if (!leadHandlers) {
        return { pass: false, error: "frappe.ui.form.on('CRM Lead', ...) was not registered." };
      }
      if (!leadHandlers.prospect_replied) {
        return { pass: false, error: "Missing 'prospect_replied(frm)' event handler." };
      }
      leadHandlers.prospect_replied(frm);
      if (frm.doc.lead_score !== 80) {
        return { pass: false, error: "prospect_replied must increment lead_score by 25 (expected 55 + 25 = 80, got " + frm.doc.lead_score + ")." };
      }
      if (frm.doc.temperature !== 'Hot') {
        return { pass: false, error: "Lead temperature should update to 'Hot' when lead_score >= 75 (got '" + frm.doc.temperature + "')." };
      }
      const hasButton = (context.buttons || []).some(b => b.label === 'Fast-Track to Deal');
      if (!hasButton) {
        return { pass: false, error: "Custom button 'Fast-Track to Deal' was not added when lead reached Hot temperature." };
      }
      const hasAlert = alerts.some(a => (a.message || '').includes('temperature') || (a.message || '').includes('Hot') || (a.message || '').includes('score'));
      if (!hasAlert) {
        return { pass: false, error: "frappe.show_alert was not triggered on prospect reply." };
      }
      return { pass: true, message: "Outstanding! You constructed a responsive Frappe CRM lead qualification and dynamic temperature pipeline!" };
    }
  },

  {
    id: 'crm-02-deal-won-todo-generator',
    trackId: 'crm-automations',
    title: 'CRM Deal: Deal Won Kick-off Task & Probability Sync',
    level: 'Intermediate',
    xp: 320,
    coins: 130,
    doctype: 'CRM Deal',
    language: 'javascript',
    summary: 'Automate post-sales handoff: when a CRM Deal is marked Won, guarantee 100% win probability, show celebratory alerts, and inject a kick-off task generator.',
    briefing: `### 🎯 Sales Operations Mission:
Closing an enterprise contract is a major milestone! The Head of Customer Success insists:
*"Whenever a deal stage moves to 'Won', we must automatically synchronize win probability to 100%, render a 'Create Kick-off ToDo' button under the 'Actions' menu, and notify the deal owner to prepare customer onboarding."*

Your Task on the **CRM Deal** Client Script:
1. In \`frappe.ui.form.on('CRM Deal', { ... })\`:
2. In \`refresh(frm)\`:
   - If \`frm.doc.stage === 'Won'\`:
     - Set probability: \`frm.set_value('probability', 100);\`
     - Add a custom button inside the \`'Actions'\` dropdown group:
       \`frm.add_custom_button('Create Kick-off ToDo', () => {\`
       \`    frm.set_value('follow_up_task_created', 1);\`
       \`    frappe.show_alert('Kick-off ToDo created for ' + frm.doc.deal_owner, 5);\`
       \`}, 'Actions');\`
3. In \`stage(frm)\` (field change event):
   - If \`frm.doc.stage === 'Won'\`:
     - Set \`probability\` to \`100\`: \`frm.set_value('probability', 100);\`
     - Trigger celebratory alert: \`frappe.show_alert('🎉 Deal Won! Kick-off tasks unlocked.', 5);\`
     - Add the custom button \`'Create Kick-off ToDo'\` under \`'Actions'\`.
`,
    objectives: [
      'Synchronize deal win probability to 100 when stage becomes "Won"',
      'Inject "Create Kick-off ToDo" action button grouped under "Actions"',
      'In button callback, update follow_up_task_created = 1 and notify deal owner',
      'Trigger celebratory alert when stage changes to "Won"'
    ],
    hints: [
      "Direction 1: Handle both 'refresh(frm)' and 'stage(frm)' on 'CRM Deal'.",
      "Direction 2: Check 'if (frm.doc.stage === \'Won\')'. If true, call 'frm.set_value(\'probability\', 100)'.",
      "Direction 3: Add button 'frm.add_custom_button(\'Create Kick-off ToDo\', callback, \'Actions\')'.",
      "Direction 4: In the button action, set 'frm.set_value(\'follow_up_task_created\', 1)' and call frappe.show_alert."
    ],
    expectedSymbols: {
      functions: [
        { name: 'refresh', label: 'refresh(frm)', purpose: 'Form render event handler', direction: 'Implement refresh(frm) on CRM Deal' },
        { name: 'stage', label: 'stage(frm)', purpose: 'Stage field change event handler', direction: 'Implement stage(frm) inside frappe.ui.form.on' }
      ],
      methods: [
        { name: 'frm.set_value', label: 'frm.set_value()', purpose: 'Updates form fields', direction: 'Set probability and follow_up_task_created' },
        { name: 'frm.add_custom_button', label: 'frm.add_custom_button()', purpose: 'Adds onboarding action button', direction: 'Add "Create Kick-off ToDo" under Actions' },
        { name: 'frappe.show_alert', label: 'frappe.show_alert()', purpose: 'Celebratory notification', direction: 'Trigger alert on deal win' }
      ],
      attributes: [
        { name: 'stage', label: 'stage', purpose: 'Deal stage attribute', direction: 'Check if stage === "Won"' },
        { name: 'probability', label: 'probability', purpose: 'Win probability metric attribute', direction: 'Set probability = 100' },
        { name: 'follow_up_task_created', label: 'follow_up_task_created', purpose: 'Onboarding task created flag', direction: 'Update follow_up_task_created = 1' }
      ]
    },
    docReference: {
      title: 'Frappe CRM Deal Automations & ToDo Creation (Architecture Pattern)',
      url: 'https://docs.frappe.io/crm/automations/actions#create-document',
      patternType: 'pseudocode',
      codeSnippet: `// CRM Deal Win Handoff & Task Generator Pattern (Pseudocode)
frappe.ui.form.on('<DocType>', {
    refresh(frm) {
        if (frm.doc.<stage_field> === '<TARGET_STAGE>') {
            frm.set_value('<probability_field>', 100);
            frm.add_custom_button('<Action_Label>', () => {
                frm.set_value('<task_created_flag>', 1);
                frappe.show_alert('<confirmation_message>', <duration_seconds>);
            }, '<Menu_Group>');
        }
    },
    <stage_change_event>(frm) {
        if (frm.doc.<stage_field> === '<TARGET_STAGE>') {
            frm.set_value('<probability_field>', 100);
            frappe.show_alert('<celebration_toast>', <duration_seconds>);
            frm.add_custom_button('<Action_Label>', () => { ... }, '<Menu_Group>');
        }
    }
});`
    },
    starterCode: `frappe.ui.form.on('CRM Deal', {
    refresh(frm) {
        // TODO: If stage is 'Won', set probability = 100 and add 'Create Kick-off ToDo' under 'Actions'
        
    },

    stage(frm) {
        // TODO: When stage changes to 'Won', sync probability to 100 and unlock kick-off task action
        
    }
});`,
    solutionCode: `frappe.ui.form.on('CRM Deal', {
    refresh(frm) {
        if (frm.doc.stage === 'Won') {
            frm.set_value('probability', 100);
            frm.add_custom_button('Create Kick-off ToDo', () => {
                frm.set_value('follow_up_task_created', 1);
                frappe.show_alert('Kick-off ToDo created for ' + frm.doc.deal_owner, 5);
            }, 'Actions');
        }
    },

    stage(frm) {
        if (frm.doc.stage === 'Won') {
            frm.set_value('probability', 100);
            frappe.show_alert('🎉 Deal Won! Kick-off tasks unlocked.', 5);
            frm.add_custom_button('Create Kick-off ToDo', () => {
                frm.set_value('follow_up_task_created', 1);
                frappe.show_alert('Kick-off ToDo created for ' + frm.doc.deal_owner, 5);
            }, 'Actions');
        }
    }
});`,
    testDoc: {
      doctype: 'CRM Deal',
      name: 'DEAL-2026-0091',
      deal_name: 'HyperScale Enterprise Contract',
      organization: 'HyperScale Inc',
      deal_owner: 'rahul@company.com',
      stage: 'Proposal',
      deal_value: 150000,
      probability: 60,
      currency: 'USD'
    },
    validate: (logs, context) => {
      const { frm, alerts, registeredHandlers } = context;
      const dealHandlers = registeredHandlers && registeredHandlers['CRM Deal'];
      if (!dealHandlers) {
        return { pass: false, error: "frappe.ui.form.on('CRM Deal', ...) was not registered." };
      }
      frm.doc.stage = 'Won';
      if (dealHandlers.stage) {
        dealHandlers.stage(frm);
      } else if (dealHandlers.refresh) {
        dealHandlers.refresh(frm);
      }
      if (frm.doc.probability !== 100) {
        return { pass: false, error: "Deal probability must be set to 100 when stage is 'Won'." };
      }
      const hasButton = (context.buttons || []).some(b => b.label === 'Create Kick-off ToDo' && b.group === 'Actions');
      if (!hasButton) {
        return { pass: false, error: "Custom button 'Create Kick-off ToDo' was not added under the 'Actions' menu group." };
      }
      const btn = (context.buttons || []).find(b => b.label === 'Create Kick-off ToDo');
      if (btn && btn.callback) {
        btn.callback();
        if (!frm.doc.follow_up_task_created) {
          return { pass: false, error: "Button callback must set follow_up_task_created to 1." };
        }
      }
      return { pass: true, message: "Superb! You automated post-sales onboarding task generation and probability syncing for closed deals!" };
    }
  },

  {
    id: 'crm-03-inactive-lead-nudge',
    trackId: 'crm-automations',
    title: 'CRM Lead: 3-Day Inactivity SLA Nudge & Follow-up Action',
    level: 'Intermediate',
    xp: 310,
    coins: 120,
    doctype: 'CRM Lead',
    language: 'javascript',
    summary: 'Enforce CRM SLA standards: detect uncontacted leads older than 3 days, display high-priority Desk alerts, and provide a 1-click follow-up dispatch button.',
    briefing: `### 🎯 Sales Operations Mission:
Inbound leads turn cold quickly! Sales management enforces a 72-hour contact rule on Desk:
*"If a lead's status is 'New' and days_since_contact is 3 or more, immediately flag it on the Desk form with a high-priority warning alert, and add a 'Send 3-Day Nudge Email' action button inside the 'Follow-up' menu to dispatch the email and update status to 'Follow-up Sent'."*

Your Task on the **CRM Lead** Client Script:
1. In \`frappe.ui.form.on('CRM Lead', { ... })\`:
2. In \`refresh(frm)\`:
   - Check if \`frm.doc.status === 'New'\` AND \`(frm.doc.days_since_contact || 0) >= 3\`:
     - Display a warning alert:
       \`frappe.show_alert('⚠️ Lead inactive for 3+ days! Immediate follow-up required.', 7);\`
     - Add custom button inside \`'Follow-up'\` group:
       \`frm.add_custom_button('Send 3-Day Nudge Email', () => {\`
       \`    frm.set_value('status', 'Follow-up Sent');\`
       \`    frappe.show_alert('3-Day Nudge Email dispatched to ' + frm.doc.email_id, 5);\`
       \`}, 'Follow-up');\`
`,
    objectives: [
      'In refresh(frm), detect when status === "New" and days_since_contact >= 3',
      'Display high-priority warning alert with 7-second duration',
      'Inject "Send 3-Day Nudge Email" custom button inside "Follow-up" group',
      'In button callback, transition status to "Follow-up Sent" and confirm dispatch'
    ],
    hints: [
      "Direction 1: Implement the 'refresh(frm)' event within 'frappe.ui.form.on(\'CRM Lead\', { ... })'.",
      "Direction 2: Test condition: 'if (frm.doc.status === \'New\' && (frm.doc.days_since_contact || 0) >= 3)'.",
      "Direction 3: Show warning toast: 'frappe.show_alert(\'⚠️ Lead inactive for 3+ days! Immediate follow-up required.\', 7)'.",
      "Direction 4: Add custom button: 'frm.add_custom_button(\'Send 3-Day Nudge Email\', callback, \'Follow-up\')'.",
      "Direction 5: Inside button callback, update 'frm.set_value(\'status\', \'Follow-up Sent\')' and show confirmation alert."
    ],
    expectedSymbols: {
      functions: [
        { name: 'refresh', label: 'refresh(frm)', purpose: 'Form render event handler', direction: 'Define refresh(frm) on CRM Lead' }
      ],
      methods: [
        { name: 'frm.add_custom_button', label: 'frm.add_custom_button()', purpose: 'Injects follow-up action button', direction: 'Add button "Send 3-Day Nudge Email" under "Follow-up"' },
        { name: 'frm.set_value', label: 'frm.set_value()', purpose: 'Updates status field', direction: 'Set status to "Follow-up Sent"' },
        { name: 'frappe.show_alert', label: 'frappe.show_alert()', purpose: 'Displays warning and dispatch alerts', direction: 'Show warning alert and confirmation toast' }
      ],
      attributes: [
        { name: 'status', label: 'status', purpose: 'Lead status field attribute', direction: 'Check status === "New" and update to "Follow-up Sent"' },
        { name: 'days_since_contact', label: 'days_since_contact', purpose: 'Inactivity count metric attribute', direction: 'Check days_since_contact >= 3' },
        { name: 'Follow-up', label: '"Follow-up"', purpose: 'Menu dropdown group name', direction: 'Group button under "Follow-up"' }
      ]
    },
    docReference: {
      title: 'Frappe CRM Inactivity & Wait Automations (Architecture Pattern)',
      url: 'https://docs.frappe.io/crm/automations/blocks#wait',
      patternType: 'pseudocode',
      codeSnippet: `// CRM Inactivity SLA Alert & Action Dispatch Pattern (Pseudocode)
frappe.ui.form.on('<DocType>', {
    refresh(frm) {
        // Detect SLA breach condition on form load
        if (frm.doc.<status_field> === '<NEW_STATUS>' && (frm.doc.<inactivity_counter> || 0) >= <SLA_DAYS>) {
            // Alert user of SLA breach
            frappe.show_alert('<sla_warning_message>', <duration_seconds>);
            
            // Provide one-click resolution action
            frm.add_custom_button('<Action_Label>', () => {
                frm.set_value('<status_field>', '<FOLLOW_UP_SENT_STATUS>');
                frappe.show_alert('<dispatch_message>', <duration_seconds>);
            }, '<Menu_Group>');
        }
    }
});`
    },
    starterCode: `frappe.ui.form.on('CRM Lead', {
    refresh(frm) {
        // TODO: Check if status == 'New' and days_since_contact >= 3
        // Show warning alert and add 'Send 3-Day Nudge Email' under 'Follow-up' group
        
    }
});`,
    solutionCode: `frappe.ui.form.on('CRM Lead', {
    refresh(frm) {
        if (frm.doc.status === 'New' && (frm.doc.days_since_contact || 0) >= 3) {
            frappe.show_alert('⚠️ Lead inactive for 3+ days! Immediate follow-up required.', 7);
            
            frm.add_custom_button('Send 3-Day Nudge Email', () => {
                frm.set_value('status', 'Follow-up Sent');
                frappe.show_alert('3-Day Nudge Email dispatched to ' + frm.doc.email_id, 5);
            }, 'Follow-up');
        }
    }
});`,
    testDoc: {
      doctype: 'CRM Lead',
      name: 'LEAD-2026-0042',
      lead_name: 'Priya Sharma',
      company_name: 'TechCorp Solutions',
      email_id: 'priya@techcorp.io',
      status: 'New',
      days_since_contact: 4,
      lead_owner: 'rahul@company.com'
    },
    validate: (logs, context) => {
      const { frm, alerts, registeredHandlers } = context;
      const leadHandlers = registeredHandlers && registeredHandlers['CRM Lead'];
      if (!leadHandlers || !leadHandlers.refresh) {
        return { pass: false, error: "Missing refresh(frm) handler on 'CRM Lead'." };
      }
      const hasAlert = alerts.some(a => (a.message || '').includes('inactive') || (a.message || '').includes('3+'));
      if (!hasAlert) {
        return { pass: false, error: "frappe.show_alert was not called with the inactivity warning." };
      }
      const hasButton = (context.buttons || []).some(b => b.label === 'Send 3-Day Nudge Email' && b.group === 'Follow-up');
      if (!hasButton) {
        return { pass: false, error: "Custom button 'Send 3-Day Nudge Email' must be added inside the 'Follow-up' menu." };
      }
      const btn = (context.buttons || []).find(b => b.label === 'Send 3-Day Nudge Email');
      if (btn && btn.callback) {
        btn.callback();
        if (frm.doc.status !== 'Follow-up Sent') {
          return { pass: false, error: "Clicking the button must update lead status to 'Follow-up Sent'." };
        }
      }
      return { pass: true, message: "A+! You created an automated SLA inactivity detector and one-click follow-up dispatch button!" };
    }
  },

  {
    id: 'crm-04-lead-qualification-guard',
    trackId: 'crm-automations',
    title: 'CRM Lead Controller: Qualification Integrity Guard & Territory Routing',
    level: 'Advanced',
    xp: 350,
    coins: 140,
    doctype: 'CRM Lead',
    language: 'python',
    summary: 'Write a robust Python validate() controller hook: guard against qualifying leads without valid email and revenue, auto-assign territory sales reps, and record qualification timestamps.',
    briefing: `### 🎯 Backend Engineering Mission:
To prevent unqualified or spam leads from polluting CRM pipeline analytics, the sales director mandates a strict server-side gatekeeper in \`crm_lead.py\`:
*"No lead can transition to 'Qualified' unless a valid email address is present and annual revenue is strictly positive. If valid, automatically assign territory lead owner 'sarah.na@company.com' and record today's qualification date."*

Your Task in \`crm_lead.py\`:
1. In the \`CRMLead(Document)\` class, implement \`def validate(self):\`.
2. If \`self.status == "Qualified"\`:
   - If not \`self.email_id\` or not \`self.email_id.strip()\`:
     \`frappe.throw(_("Email Address is mandatory to qualify a Lead"))\`
   - If not \`self.annual_revenue\` or \`float(self.annual_revenue) <= 0\`:
     \`frappe.throw(_("Annual Revenue must be greater than 0 to qualify a Lead"))\`
   - If validations pass:
     \`self.territory_rep = "sarah.na@company.com"\`
     \`self.qualified_date = frappe.utils.today()\`
`,
    objectives: [
      'Implement def validate(self): in CRMLead Document controller',
      'Throw validation error if email_id is missing or blank when status is "Qualified"',
      'Throw validation error if annual_revenue is not positive when status is "Qualified"',
      'Assign territory_rep and qualified_date when validations succeed'
    ],
    hints: [
      "Direction 1: Implement the 'def validate(self):' controller method inside CRMLead(Document).",
      "Direction 2: Test condition: 'if self.status == \\'Qualified\\':'.",
      "Direction 3: Check email: 'if not self.email_id or not self.email_id.strip(): frappe.throw(_(\\'Email Address is mandatory to qualify a Lead\\'))'.",
      "Direction 4: Check revenue: 'if not self.annual_revenue or float(self.annual_revenue) <= 0: frappe.throw(_(\\'Annual Revenue must be greater than 0 to qualify a Lead\\'))'.",
      "Direction 5: On valid qualification: 'self.territory_rep = \\'sarah.na@company.com\\'' and 'self.qualified_date = frappe.utils.today()'."
    ],
    expectedSymbols: {
      functions: [
        { name: 'validate', label: 'validate(self)', purpose: 'Controller validation lifecycle hook', direction: 'Define def validate(self): in CRMLead' }
      ],
      methods: [
        { name: 'frappe.throw', label: 'frappe.throw()', purpose: 'Halts transaction on invalid qualification', direction: 'Call frappe.throw when constraints fail' },
        { name: 'frappe.utils.today', label: 'frappe.utils.today()', purpose: 'System date helper', direction: 'Assign today() to qualified_date' }
      ],
      attributes: [
        { name: 'status', label: 'self.status', purpose: 'Lead qualification status', direction: 'Check if self.status == "Qualified"' },
        { name: 'email_id', label: 'self.email_id', purpose: 'Mandatory contact email field', direction: 'Validate self.email_id is non-empty' },
        { name: 'annual_revenue', label: 'self.annual_revenue', purpose: 'Revenue threshold attribute', direction: 'Validate float(self.annual_revenue) > 0' },
        { name: 'territory_rep', label: 'self.territory_rep', purpose: 'Assigned territory sales rep', direction: 'Assign "sarah.na@company.com"' },
        { name: 'qualified_date', label: 'self.qualified_date', purpose: 'Qualification audit date', direction: 'Assign frappe.utils.today()' }
      ]
    },
    docReference: {
      title: 'Frappe CRM Document Controllers & Validation Hooks (Architecture Pattern)',
      url: 'https://docs.frappe.io/crm/automations/introduction',
      patternType: 'pseudocode',
      codeSnippet: `# Server Validation & Auto-Routing Guard Pattern (Pseudocode)
import frappe
from frappe import _
from frappe.model.document import Document

class <DocTypeController>(Document):
    def validate(self):
        if self.<status_field> == "<TARGET_QUALIFIED_STATUS>":
            # 1. Enforce mandatory contact attribute
            if not self.<contact_attribute> or not self.<contact_attribute>.strip():
                frappe.throw(_("<mandatory_field_error>"))
                
            # 2. Enforce numeric threshold constraint
            if not self.<revenue_attribute> or float(self.<revenue_attribute>) <= 0:
                frappe.throw(_("<positive_value_error>"))
                
            # 3. Auto-populate territory assignment and audit timestamp
            self.<rep_attribute> = "<assigned_territory_owner>"
            self.<date_attribute> = frappe.utils.today()`
    },
    starterCode: `import frappe
from frappe import _
from frappe.model.document import Document

class CRMLead(Document):
    def validate(self):
        # TODO: Enforce data integrity when self.status == 'Qualified'
        # 1. Require valid self.email_id
        # 2. Require self.annual_revenue > 0
        # 3. Assign self.territory_rep = 'sarah.na@company.com' and self.qualified_date = frappe.utils.today()
        pass`,
    solutionCode: `import frappe
from frappe import _
from frappe.model.document import Document

class CRMLead(Document):
    def validate(self):
        if self.status == "Qualified":
            if not self.email_id or not self.email_id.strip():
                frappe.throw(_("Email Address is mandatory to qualify a Lead"))
            
            if not self.annual_revenue or float(self.annual_revenue) <= 0:
                frappe.throw(_("Annual Revenue must be greater than 0 to qualify a Lead"))
            
            self.territory_rep = "sarah.na@company.com"
            self.qualified_date = frappe.utils.today()`,
    testDoc: {
      doctype: 'CRM Lead',
      name: 'LEAD-2026-0105',
      lead_name: 'Global Logistics Hub',
      email_id: 'contact@globallogistics.com',
      annual_revenue: 2500000,
      status: 'Qualified',
      lead_owner: 'rahul@company.com'
    },
    validate: (logs, context) => {
      const runner = context.pythonRunner;
      if (!runner) {
        return { pass: false, error: "Python simulator did not initialize." };
      }
      const invalidEmailDoc = { doctype: 'CRM Lead', status: 'Qualified', email_id: '', annual_revenue: 500000 };
      const res1 = runner.runValidation(invalidEmailDoc);
      if (!res1.threw) {
        return { pass: false, error: "frappe.throw was not called when email_id is missing on a Qualified lead." };
      }
      const invalidRevDoc = { doctype: 'CRM Lead', status: 'Qualified', email_id: 'test@corp.com', annual_revenue: 0 };
      const res2 = runner.runValidation(invalidRevDoc);
      if (!res2.threw) {
        return { pass: false, error: "frappe.throw was not called when annual_revenue is <= 0 on a Qualified lead." };
      }
      const validDoc = { doctype: 'CRM Lead', status: 'Qualified', email_id: 'ceo@acme.com', annual_revenue: 1200000 };
      runner.runValidation(validDoc);
      if (validDoc.territory_rep !== 'sarah.na@company.com') {
        return { pass: false, error: "self.territory_rep was not set to 'sarah.na@company.com'." };
      }
      if (!validDoc.qualified_date) {
        return { pass: false, error: "self.qualified_date was not assigned with frappe.utils.today()." };
      }
      return { pass: true, message: "Masterful! You built an ironclad Python qualification validator with automatic territory lead routing!" };
    }
  },

  {
    id: 'crm-05-high-value-deal-guard',
    trackId: 'crm-automations',
    title: 'CRM Deal Controller: Enterprise Deal Approval & Billing Sync Guard',
    level: 'Advanced',
    xp: 380,
    coins: 160,
    doctype: 'CRM Deal',
    language: 'python',
    summary: 'Enforce enterprise sales governance: prevent deals >= $100k from closing won without manager sign-off and tax ID, then transition billing status for webhook sync.',
    briefing: `### 🎯 Enterprise Architecture Mission:
Large deals carry major financial compliance requirements. The CFO and Compliance Officer require an unbypassable DocType validation hook in \`crm_deal.py\`:
*"Before any enterprise contract ($100,000 or greater) can be saved as 'Won', it must have verified Manager Approval and a valid Tax ID / VAT Number. When verified, immediately set billing_status to 'Pending Webhook Sync' so the ERP billing engine can pick it up."*

Your Task in \`crm_deal.py\`:
1. In the \`CRMDeal(Document)\` class, implement \`def validate(self):\`.
2. If \`self.stage == "Won"\`:
   - If \`float(self.deal_value or 0) >= 100000\`:
     - If not \`self.manager_approved\`:
       \`frappe.throw(_("Enterprise deals exceeding $100,000 require Manager Approval before closing"))\`
     - If not \`self.tax_id\` or not \`self.tax_id.strip()\`:
       \`frappe.throw(_("Tax ID / VAT Number is required for closed enterprise deals"))\`
     - If requirements are fulfilled:
       \`self.billing_status = "Pending Webhook Sync"\`
`,
    objectives: [
      'Define def validate(self): in CRMDeal Document controller',
      'Check if stage is "Won" and deal_value is >= 100000',
      'Throw validation error if manager_approved flag is missing or false',
      'Throw validation error if tax_id is missing or blank',
      'Transition billing_status to "Pending Webhook Sync" when requirements pass'
    ],
    hints: [
      "Direction 1: Implement the 'def validate(self):' controller hook inside CRMDeal(Document).",
      "Direction 2: Test condition: 'if self.stage == \\'Won\\':'.",
      "Direction 3: Check enterprise deal size: 'if float(self.deal_value or 0) >= 100000:'.",
      "Direction 4: Verify manager sign-off: 'if not self.manager_approved: frappe.throw(_(\\'Enterprise deals exceeding $100,000 require Manager Approval before closing\\'))'.",
      "Direction 5: Verify tax identifier: 'if not self.tax_id or not self.tax_id.strip(): frappe.throw(_(\\'Tax ID / VAT Number is required for closed enterprise deals\\'))'.",
      "Direction 6: Set integration status: 'self.billing_status = \\'Pending Webhook Sync\\''."
    ],
    expectedSymbols: {
      functions: [
        { name: 'validate', label: 'validate(self)', purpose: 'Controller validation lifecycle hook', direction: 'Define def validate(self): in CRMDeal' }
      ],
      methods: [
        { name: 'frappe.throw', label: 'frappe.throw()', purpose: 'Halts transaction on compliance failure', direction: 'Call frappe.throw for missing approval or tax ID' }
      ],
      attributes: [
        { name: 'stage', label: 'self.stage', purpose: 'Deal stage attribute', direction: 'Check if self.stage == "Won"' },
        { name: 'deal_value', label: 'self.deal_value', purpose: 'Contract monetary value attribute', direction: 'Check float(self.deal_value or 0) >= 100000' },
        { name: 'manager_approved', label: 'self.manager_approved', purpose: 'Manager approval flag attribute', direction: 'Verify self.manager_approved is truthy' },
        { name: 'tax_id', label: 'self.tax_id', purpose: 'Fiscal Tax / VAT identifier attribute', direction: 'Verify self.tax_id is non-empty' },
        { name: 'billing_status', label: 'self.billing_status', purpose: 'Billing pipeline queue status', direction: 'Set self.billing_status = "Pending Webhook Sync"' }
      ]
    },
    docReference: {
      title: 'Frappe CRM Deals & Webhook Synchronizations (Architecture Pattern)',
      url: 'https://docs.frappe.io/crm/automations/actions#call-webhook',
      patternType: 'pseudocode',
      codeSnippet: `# Enterprise Deal Governance & Webhook Sync Guard Pattern (Pseudocode)
import frappe
from frappe import _
from frappe.model.document import Document

class <DocTypeController>(Document):
    def validate(self):
        if self.<stage_field> == "<WON_STAGE>":
            if float(self.<value_field> or 0) >= <ENTERPRISE_THRESHOLD>:
                # Guard 1: Verify executive sign-off
                if not self.<approval_flag>:
                    frappe.throw(_("<missing_approval_error>"))
                    
                # Guard 2: Verify fiscal registration attribute
                if not self.<tax_id_field> or not self.<tax_id_field>.strip():
                    frappe.throw(_("<missing_tax_id_error>"))
                    
                # Transition status to trigger automated billing pipeline
                self.<integration_status_field> = "<SYNC_STATUS_VALUE>"`
    },
    starterCode: `import frappe
from frappe import _
from frappe.model.document import Document

class CRMDeal(Document):
    def validate(self):
        # TODO: If self.stage == 'Won' and float(self.deal_value or 0) >= 100000:
        # 1. Require self.manager_approved
        # 2. Require valid self.tax_id
        # 3. Set self.billing_status = 'Pending Webhook Sync'
        pass`,
    solutionCode: `import frappe
from frappe import _
from frappe.model.document import Document

class CRMDeal(Document):
    def validate(self):
        if self.stage == "Won":
            if float(self.deal_value or 0) >= 100000:
                if not self.manager_approved:
                    frappe.throw(_("Enterprise deals exceeding $100,000 require Manager Approval before closing"))
                
                if not self.tax_id or not self.tax_id.strip():
                    frappe.throw(_("Tax ID / VAT Number is required for closed enterprise deals"))
                
                self.billing_status = "Pending Webhook Sync"`,
    testDoc: {
      doctype: 'CRM Deal',
      name: 'DEAL-2026-0200',
      deal_name: 'Apex Global Cloud Migration',
      organization: 'Apex Global Corp',
      stage: 'Won',
      deal_value: 120000,
      currency: 'USD',
      deal_owner: 'rahul@company.com',
      manager_approved: 1,
      tax_id: 'US-TAX-998822',
      billing_status: 'Draft'
    },
    validate: (logs, context) => {
      const runner = context.pythonRunner;
      if (!runner) {
        return { pass: false, error: "Python simulator did not initialize." };
      }
      const unapprovedDeal = { doctype: 'CRM Deal', stage: 'Won', deal_value: 150000, manager_approved: 0, tax_id: 'US-TAX-1' };
      const res1 = runner.runValidation(unapprovedDeal);
      if (!res1.threw) {
        return { pass: false, error: "frappe.throw was not called for an enterprise deal lacking manager approval." };
      }
      const noTaxDeal = { doctype: 'CRM Deal', stage: 'Won', deal_value: 120000, manager_approved: 1, tax_id: '' };
      const res2 = runner.runValidation(noTaxDeal);
      if (!res2.threw) {
        return { pass: false, error: "frappe.throw was not called for an enterprise deal lacking a Tax ID." };
      }
      const validDeal = { doctype: 'CRM Deal', stage: 'Won', deal_value: 200000, manager_approved: 1, tax_id: 'GB-VAT-776' };
      runner.runValidation(validDeal);
      if (validDeal.billing_status !== 'Pending Webhook Sync') {
        return { pass: false, error: "self.billing_status was not updated to 'Pending Webhook Sync'." };
      }
      return { pass: true, message: "Outstanding! You implemented mission-critical enterprise sales governance and automated billing sync triggers!" };
    }
  }
];

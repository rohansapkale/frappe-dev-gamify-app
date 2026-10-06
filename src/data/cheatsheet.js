// Interactive Frappe & ERPNext Documentation & Cheatsheet Database

export const CHEATSHEETS = [
  {
    category: 'Client Script: Form API (frm)',
    items: [
      {
        name: 'frm.add_custom_button',
        syntax: `frm.add_custom_button(label, action, group)`,
        description: 'Adds a custom action button to the Form page header, optionally inside a dropdown group.',
        example: `frm.add_custom_button(__('Generate Payment Link'), () => {
    frappe.show_alert(__('Payment link sent to customer'));
}, __('Actions'));`,
        tags: ['UI', 'Buttons', 'Form']
      },
      {
        name: 'frm.set_value',
        syntax: `frm.set_value(fieldname, value)`,
        description: 'Sets the value of a field and marks the document as dirty/modified.',
        example: `frm.set_value('status', 'In Progress');
frm.set_value('posting_date', frappe.datetime.nowdate());`,
        tags: ['Form', 'Fields', 'Data']
      },
      {
        name: 'frm.set_df_property',
        syntax: `frm.set_df_property(fieldname, property, value)`,
        description: 'Dynamically updates field properties like reqd, hidden, read_only, options, or label.',
        example: `frm.set_df_property('vat_registration_no', 'reqd', 1);
frm.set_df_property('discount_section', 'hidden', 0);`,
        tags: ['Form', 'Fields', 'Dynamic UI']
      },
      {
        name: 'frm.set_query',
        syntax: `frm.set_query(fieldname, () => { return { filters: { ... } } })`,
        description: 'Applies dynamic filter criteria to a Link field dialog picker.',
        example: `frm.set_query('customer', () => {
    return {
        filters: {
            'disabled': 0,
            'territory': 'North America'
        }
    };
});`,
        tags: ['Form', 'Link Field', 'Filtering']
      },
      {
        name: 'frm.refresh_field',
        syntax: `frm.refresh_field(fieldname)`,
        description: 'Forces the UI to re-render the specific field or child table grid after programmatically changing values.',
        example: `locals[cdt][cdn].rate = 120;
frm.refresh_field('items');`,
        tags: ['Form', 'Rendering', 'Child Table']
      }
    ]
  },
  {
    category: 'Client Script: Global frappe APIs',
    items: [
      {
        name: 'frappe.msgprint & frappe.throw',
        syntax: `frappe.msgprint(message, title)`,
        description: 'Displays a standard popup modal message with support for HTML and markdown formatting.',
        example: `frappe.msgprint({
    title: __('Notification'),
    message: __('Quotation converted successfully!'),
    indicator: 'green'
});`,
        tags: ['Dialog', 'Alerts', 'UI']
      },
      {
        name: 'frappe.call',
        syntax: `frappe.call({ method, args, callback, freeze, freeze_message })`,
        description: 'Asynchronously calls a whitelisted Python backend method via RPC/AJAX.',
        example: `frappe.call({
    method: 'erpnext.accounts.doctype.sales_invoice.sales_invoice.make_payment',
    args: { invoice_id: frm.doc.name },
    freeze: true,
    freeze_message: __('Processing Payment...'),
    callback: function(r) {
        if (!r.exc) {
            frappe.show_alert(__('Payment entry created: ') + r.message);
        }
    }
});`,
        tags: ['AJAX', 'RPC', 'Backend Bridge']
      },
      {
        name: 'frappe.prompt',
        syntax: `frappe.prompt(fields, callback, title, primary_action_label)`,
        description: 'Renders an interactive popup dialog with form inputs for rapid user input gathering.',
        example: `frappe.prompt([
    { label: 'Reason for Cancellation', fieldname: 'reason', fieldtype: 'Small Text', reqd: 1 }
], (values) => {
    console.log(values.reason);
}, __('Cancel Order'), __('Proceed'));`,
        tags: ['Dialog', 'Forms', 'User Input']
      }
    ]
  },
  {
    category: 'Server Python: DocType Controller & ORM',
    items: [
      {
        name: 'Document Lifecycle Hooks',
        syntax: `def validate(self), def before_save(self), def on_submit(self), def on_cancel(self)`,
        description: 'Standard event methods executed on DocType controller classes.',
        example: `class SalesOrder(Document):
    def validate(self):
        if self.grand_total < 0:
            frappe.throw(_("Grand total cannot be negative."))
            
    def on_submit(self):
        self.update_stock_ledger()`,
        tags: ['Python', 'Controller', 'Hooks']
      },
      {
        name: 'frappe.get_doc & frappe.new_doc',
        syntax: `frappe.get_doc(doctype, name) / frappe.new_doc(doctype)`,
        description: 'Loads an existing document model or instantiates a new document in memory.',
        example: `doc = frappe.new_doc('Customer')
doc.customer_name = 'Starlight Enterprises'
doc.customer_group = 'Commercial'
doc.insert()
frappe.db.commit()`,
        tags: ['Python', 'ORM', 'CRUD']
      },
      {
        name: 'frappe.db.get_value & set_value',
        syntax: `frappe.db.get_value(doctype, name, fieldname) / set_value(doctype, name, field, val)`,
        description: 'High performance direct database read and write without instantiating entire document trees.',
        example: `# Read single or multiple fields as dictionary:
item = frappe.db.get_value('Item', 'ITM-001', ['item_name', 'standard_rate'], as_dict=True)

# Direct update:
frappe.db.set_value('Item', 'ITM-001', 'disabled', 1)`,
        tags: ['Python', 'Database', 'Performance']
      },
      {
        name: '@frappe.whitelist',
        syntax: `@frappe.whitelist(allow_guest=False)`,
        description: 'Exposes Python functions to client-side `frappe.call` and REST API endpoints.',
        example: `@frappe.whitelist()
def calculate_custom_tax(amount, tax_tier):
    rate = 0.18 if tax_tier == 'Standard' else 0.05
    return amount * rate`,
        tags: ['Python', 'API', 'Security']
      }
    ]
  },
  {
    category: 'Frappe Hooks & Background Jobs',
    items: [
      {
        name: 'hooks.py: doc_events',
        syntax: `doc_events = { 'DocType': { 'event': 'dotted.path.to.handler' } }`,
        description: 'Attaches custom app methods to standard ERPNext doctype events without modifying core code.',
        example: `doc_events = {
    "Sales Invoice": {
        "on_submit": "my_custom_app.events.invoice.send_tax_report",
        "validate": "my_custom_app.events.invoice.check_credit_limit"
    }
}`,
        tags: ['Hooks', 'Architecture', 'Extensibility']
      },
      {
        name: 'frappe.enqueue',
        syntax: `frappe.enqueue(method, queue='default', timeout=300, **kwargs)`,
        description: 'Dispatches long-running operations asynchronously to Redis workers.',
        example: `frappe.enqueue(
    'my_custom_app.tasks.sync_with_shopify',
    queue='long',
    timeout=1800,
    store_id='US-01'
)`,
        tags: ['Workers', 'Redis', 'Async']
      }
    ]
  },
  {
    category: 'Frappe CRM: Workflow Automations & Rules',
    items: [
      {
        name: 'Workflow Automation Architecture',
        syntax: `Settings > Automation & Rules > Workflow Automations`,
        description: 'Visual flow automation system consisting of Trigger (Event), Filters, Flow Blocks (If/Else, Wait), Actions, and Run As permissions.',
        example: `// Example: Welcome new website leads flow
frappe.crm.automation({
    title: 'Welcome new website leads',
    doctype: 'CRM Lead',
    event: 'Record is created',
    filters: [{ field: 'source', operator: 'Equals', value: 'Website' }],
    run_as: 'Automation User',
    steps: [
        { action: 'Email the Lead or Deal', email_template: 'Web Lead Welcome' },
        { block: 'Wait', wait: 2, unit: 'Days' },
        { block: 'If / Else', condition: 'doc.status == "New"', true_branch: [
            { action: 'Notify in CRM', recipients: 'Document owner', message: '{{ doc.lead_name }} has not been contacted yet' }
        ]}
    ]
});`,
        tags: ['CRM', 'Workflow', 'Automations']
      },
      {
        name: 'Jinja Templating & Context Passing',
        syntax: `{{ doc.field_name }} | {{ trigger.name }} | {{ context.steps.step_name.prop }}`,
        description: 'Dynamic field interpolation in subjects, messages, and webhook payloads. Steps access outputs of earlier named steps.',
        example: `// Access record field:
"Welcome to Acme, {{ doc.first_name }}"

// Access output from an earlier step named 'score_boost':
"Lead {{ doc.lead_name }} is now at {{ context.steps.score_boost.new_value }} points"`,
        tags: ['CRM', 'Jinja', 'Context']
      },
      {
        name: 'Wait for Event Block',
        syntax: `Wait for event (wait_for, belonging_to, timeout, unit)`,
        description: 'Pauses run until an event arrives (e.g. prospect replied) or timeout expires. Branching splits into Event Happened vs Timed Out.',
        example: `{
    block: 'Wait for event',
    wait_for: 'The prospect replied',
    belonging_to: 'This email thread',
    timeout: 3,
    unit: 'Days',
    event_happened_branch: [
        { action: 'Adjust Lead Score', amount: 10 },
        { action: 'Set Lead Temperature', temperature: 'Hot' }
    ],
    timed_out_branch: [
        { action: 'Notify in CRM', recipients: 'Document owner', message: 'No reply in 3 days' }
    ]
}`,
        tags: ['CRM', 'Blocks', 'Events']
      },
      {
        name: 'CRM Actions vs Core Actions',
        syntax: `CRM: Email, Score, Temperature, Convert | Core: Create Document, Webhook, Assign`,
        description: 'CRM actions target leads/deals specifically; Core actions work across any DocType (creating ToDos, updating fields, HTTP webhooks).',
        example: `// Create Document (ToDo linked to Deal)
{
    action: 'Create Document',
    document_type: 'ToDo',
    field_values: {
        title: 'Kick-off call with {{ doc.organization }}',
        reference_doctype: 'CRM Deal',
        reference_docname: '{{ doc.name }}',
        assigned_to: '{{ doc.deal_owner }}'
    }
}`,
        tags: ['CRM', 'Actions', 'ToDo']
      },
      {
        name: 'Test Run & Safety Rollback',
        syntax: `Test Run Tab > Select Record > Start Test Run`,
        description: 'Runs entire automation against an existing record, simulating wait times, previewing webhook payloads, and immediately rolling back all database mutations.',
        example: `// In Test Run:
// 1. Wait blocks are simulated (no real delay)
// 2. Wait for event takes 'Timed out' branch by default
// 3. Webhooks report payload without network dispatch
// 4. All modified fields revert to original values on completion`,
        tags: ['CRM', 'Test Run', 'Rollback']
      }
    ]
  }
];


// Daily Frappe & ERPNext Technical Interview Questions & Bug Hunt Challenges

export const QUIZZES = [
  {
    id: 'quiz-01-whitelist',
    category: 'Full-Stack & Security',
    difficulty: 'Easy',
    xp: 50,
    coins: 20,
    question: 'Technical Interview: Why does calling a custom Python function via `frappe.call({ method: "myapp.api.get_balance" })` return HTTP 403 / "Not Permitted"?',
    options: [
      'The function file is not imported inside __init__.py',
      'The Python function is missing the @frappe.whitelist() decorator',
      'The user does not have System Manager role',
      'Client scripts cannot make HTTP requests to Python methods'
    ],
    correctIndex: 1,
    explanation: 'In Frappe Framework, any Python method accessible via client-side `frappe.call` or REST API must be explicitly decorated with `@frappe.whitelist()`. If omitted, Frappe raises a PermissionError for security.'
  },
  {
    id: 'quiz-02-child-table-refresh',
    category: 'Client Scripting',
    difficulty: 'Medium',
    xp: 75,
    coins: 30,
    question: 'Technical Interview: You updated child table rows in a Client Script via `locals[cdt][cdn].rate = 500;` but the UI grid does not reflect the change. What is missing?',
    options: [
      'frm.save() must be called immediately',
      'frm.refresh_field("items") was not called to re-render the grid',
      'locals is read-only and cannot be mutated',
      'You must reload the entire browser page'
    ],
    correctIndex: 1,
    explanation: 'Modifying the data model directly or via `frappe.model.set_value` updates the in-memory doc, but you must invoke `frm.refresh_field("items")` (or the specific child table fieldname) so the Grid UI re-renders with new values.'
  },
  {
    id: 'quiz-03-before-save-vs-validate',
    category: 'DocType Controller',
    difficulty: 'Medium',
    xp: 75,
    coins: 30,
    question: 'Technical Interview: What is the exact execution order and role distinction between `validate()` and `before_save()` controller events?',
    options: [
      '`validate()` only runs in Javascript, whereas `before_save()` runs in Python',
      '`validate()` runs first where business validations happen; `before_save()` runs right before database insertion/update',
      '`before_save()` runs before `validate()`',
      '`validate()` cannot call `frappe.throw()`'
    ],
    correctIndex: 1,
    explanation: 'In the DocType controller lifecycle, `validate()` is called first where business validations happen. `before_save()` is called subsequently right before writing changes into the SQL database.'
  },
  {
    id: 'quiz-04-db-get-value',
    category: 'Database & Performance',
    difficulty: 'Easy',
    xp: 50,
    coins: 20,
    question: 'Technical Interview: Which is the most performant way in Frappe to retrieve only the `customer_name` and `credit_limit` of a Customer without loading full child tables?',
    options: [
      'frappe.get_doc("Customer", "CUST-001")',
      'frappe.db.get_value("Customer", "CUST-001", ["customer_name", "credit_limit"], as_dict=True)',
      'frappe.get_all("Customer", limit=1)',
      'frappe.db.sql("select * from `tabCustomer`")'
    ],
    correctIndex: 1,
    explanation: '`frappe.db.get_value("DocType", name, fields, as_dict=True)` executes a lightweight SQL SELECT query for only the requested columns and skips instantiating the complete Document class and child tables.'
  },
  {
    id: 'quiz-05-custom-button-group',
    category: 'Client Scripting',
    difficulty: 'Easy',
    xp: 50,
    coins: 20,
    question: 'Technical Interview: How do you create a button inside a dropdown group labeled "Utilities" on a Frappe Form?',
    options: [
      'frm.add_button("Sync", callback, group="Utilities")',
      'frm.add_custom_button("Sync", callback, "Utilities")',
      'frm.create_group_button("Utilities", "Sync", callback)',
      'frappe.ui.toolbar.add_item("Utilities", "Sync", callback)'
    ],
    correctIndex: 1,
    explanation: 'The standard Frappe API syntax is `frm.add_custom_button(label, callback, group)`. Passing the group string (e.g. "Utilities" or "Actions") nests the button cleanly inside that dropdown group.'
  },
  {
    id: 'quiz-06-hooks-doc-events',
    category: 'Frappe Hooks',
    difficulty: 'Hard',
    xp: 100,
    coins: 40,
    question: 'Technical Interview: Where and how do you configure custom backend hooks so your app runs a function whenever standard ERPNext `Sales Invoice` is submitted?',
    options: [
      'In `patches.txt` under `[on_submit]`',
      'In `hooks.py` under `doc_events = {"Sales Invoice": {"on_submit": "my_app.events.on_invoice_submit"}}`',
      'In `config/desktop.py`',
      'Inside the client script DocType'
    ],
    correctIndex: 1,
    explanation: 'In Frappe apps, `hooks.py` is the central registry. Under `doc_events`, you map DocTypes and event names (`on_submit`, `before_save`, `on_cancel`, `autoname`, etc.) to Python dotted paths.'
  },
  {
    id: 'quiz-07-frappe-enqueue',
    category: 'Background Jobs',
    difficulty: 'Hard',
    xp: 100,
    coins: 40,
    question: 'Technical Interview: When sending 5,000 automated emails or syncing a large catalog without blocking the user interface, what should you use?',
    options: [
      'frappe.async_run()',
      'frappe.enqueue("my_app.tasks.send_bulk_emails", queue="long", timeout=3000)',
      'frappe.threading.Thread()',
      'frappe.db.commit()'
    ],
    correctIndex: 1,
    explanation: '`frappe.enqueue()` pushes the task into Frappe’s Redis Queue (RQ) background workers (queues: default, short, long). This frees the HTTP worker and prevents gateway timeout errors.'
  },
  {
    id: 'quiz-08-jinja-formatting',
    category: 'Print Formats',
    difficulty: 'Medium',
    xp: 60,
    coins: 25,
    question: 'Technical Interview: In a Jinja Print Format, how do you format a numeric value `doc.outstanding_amount` using Frappe’s currency formatter and currency symbol?',
    options: [
      '{{ doc.outstanding_amount | currency }}',
      '{{ frappe.format_value(doc.outstanding_amount, {"fieldtype": "Currency"}, doc) }}',
      '{{ frappe.currency(doc.outstanding_amount) }}',
      '{{ "$ " + doc.outstanding_amount }}'
    ],
    correctIndex: 1,
    explanation: '`frappe.format_value(val, df, doc)` is Frappe’s official Jinja formatter helper, respecting user currency formatting preferences, number formats, and precision.'
  },
  {
    id: 'quiz-09-db-set-value-modified',
    category: 'Database Optimization',
    difficulty: 'Hard',
    xp: 90,
    coins: 35,
    question: 'Technical Interview: When updating a field via `frappe.db.set_value`, how do you prevent updating the document’s `modified` timestamp (e.g. for background counters)?',
    options: [
      'frappe.db.set_value(doctype, name, field, val, update_modified=False)',
      'frappe.db.set_value(doctype, name, field, val, silent=True)',
      'doc.flags.ignore_modified = True',
      'It is impossible to skip updating modified'
    ],
    correctIndex: 0,
    explanation: 'Passing `update_modified=False` into `frappe.db.set_value(doctype, name, fieldname, value, update_modified=False)` updates the database column directly without altering the `modified` and `modified_by` metadata.'
  },
  {
    id: 'quiz-10-permission-query-conditions',
    category: 'Security & Permissions',
    difficulty: 'Hard',
    xp: 110,
    coins: 45,
    question: 'Technical Interview: How do you implement dynamic Row-Level Security in hooks.py so sales reps only see Customers in their assigned territory?',
    options: [
      'permission_query_conditions = {"Customer": "my_app.permissions.get_customer_conditions"}',
      'row_level_security = {"Customer": "territory == user.territory"}',
      'doc_events = {"Customer": {"on_query": "filter_territory"}}',
      'frappe.set_user_permissions()'
    ],
    correctIndex: 0,
    explanation: 'In `hooks.py`, `permission_query_conditions` attaches a Python function that returns an SQL WHERE clause fragment (e.g. `\`tabCustomer\`.territory IN ("North America")`), applying row-level filtering at the SQL level.'
  }
];

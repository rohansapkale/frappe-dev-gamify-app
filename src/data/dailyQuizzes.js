// Comprehensive 50+ Frappe & ERPNext Technical Interview MCQ Bank
// Generates a fresh, deterministic 10-Question Bug Hunt for each day of the year

export const MASTER_QUESTION_POOL = [
  // SECTION 1: Client Scripting & Desk UI (1-10)
  {
    id: 'mcq-01-whitelist',
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
    id: 'mcq-02-child-table-refresh',
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
    id: 'mcq-03-set-query-link',
    category: 'Client Scripting',
    difficulty: 'Medium',
    xp: 75,
    coins: 30,
    question: 'Technical Interview: How do you filter a Link field `customer` on a Form so it only returns records where `territory` is "Europe"?',
    options: [
      'frm.set_filter("customer", "territory", "Europe")',
      'frm.set_query("customer", () => ({ filters: { territory: "Europe" } }))',
      'frappe.db.filter_link("customer", { territory: "Europe" })',
      'frm.fields_dict["customer"].options.where("territory = Europe")'
    ],
    correctIndex: 1,
    explanation: '`frm.set_query(fieldname, callback)` is the standard Frappe API method for binding dynamic search filters to Link fields on form initialization or field triggers.'
  },
  {
    id: 'mcq-04-custom-button-group',
    category: 'Client Scripting',
    difficulty: 'Easy',
    xp: 50,
    coins: 20,
    question: 'Technical Interview: How do you place a custom button labeled "Fast Dispatch" inside the "Actions" dropdown group on a Frappe Form?',
    options: [
      'frm.add_button("Fast Dispatch", callback, group="Actions")',
      'frm.add_custom_button("Fast Dispatch", callback, "Actions")',
      'frm.page.create_group_action("Actions", "Fast Dispatch", callback)',
      'frappe.ui.toolbar.add_item("Actions", "Fast Dispatch", callback)'
    ],
    correctIndex: 1,
    explanation: 'The Frappe syntax is `frm.add_custom_button(label, callback, group)`. Specifying `"Actions"` as the 3rd parameter nests the button inside the Actions dropdown menu.'
  },
  {
    id: 'mcq-05-toggle-field-properties',
    category: 'Client Scripting',
    difficulty: 'Easy',
    xp: 50,
    coins: 20,
    question: 'Technical Interview: Which method dynamically makes a field mandatory on a Form without reloading?',
    options: [
      'frm.set_df_property("vat_id", "reqd", 1)',
      'frm.fields_dict["vat_id"].mandatory = true',
      'frm.doc.vat_id_reqd = 1',
      'frappe.meta.set_mandatory("vat_id", true)'
    ],
    correctIndex: 0,
    explanation: '`frm.set_df_property(fieldname, property, value)` or `frm.toggle_reqd(fieldname, true)` updates the DocField schema properties dynamically on the active Form.'
  },

  // SECTION 2: DocType Controller & Python Lifecycle (11-20)
  {
    id: 'mcq-06-validate-vs-before-save',
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
    id: 'mcq-07-before-submit-vs-on-submit',
    category: 'DocType Controller',
    difficulty: 'Medium',
    xp: 75,
    coins: 30,
    question: 'Technical Interview: In a submittable DocType, what is the difference between `before_submit()` and `on_submit()`?',
    options: [
      '`before_submit()` runs before `docstatus` is changed to 1; `on_submit()` runs after `docstatus = 1` within the transaction',
      '`before_submit()` commits the database transaction immediately',
      '`on_submit()` only runs in background worker queues',
      '`before_submit()` is only for client-side JavaScript'
    ],
    correctIndex: 0,
    explanation: '`before_submit()` executes while docstatus is still 0 (Draft) right before status elevation. `on_submit()` runs when docstatus is 1, ideal for creating linked General Ledger or Stock Ledger entries.'
  },
  {
    id: 'mcq-08-autoname-series',
    category: 'DocType Controller',
    difficulty: 'Medium',
    xp: 75,
    coins: 30,
    question: 'Technical Interview: In a Python controller, which standard method generates custom date-stamped series names like `INV-.YYYY.-.#####`?',
    options: [
      'def autoname(self): self.name = make_autoname("INV-.YYYY.-.#####")',
      'def set_name(self): self.id = frappe.generate_uuid()',
      'def before_insert(self): self.name = "INV-" + frappe.datetime.nowdate()',
      'def generate_id(self): return make_autoname("INV-.YYYY.-.#####")'
    ],
    correctIndex: 0,
    explanation: '`autoname(self)` using `from frappe.model.naming import make_autoname` is Frappe’s official controller hook for custom document naming formats.'
  },
  {
    id: 'mcq-09-flags-ignore-permissions',
    category: 'DocType Controller',
    difficulty: 'Hard',
    xp: 90,
    coins: 35,
    question: 'Technical Interview: How do you save a document in a background script while bypassing role-permission checks?',
    options: [
      'doc.flags.ignore_permissions = True; doc.save()',
      'doc.save(as_admin=True)',
      'frappe.set_user("Administrator"); doc.save()',
      'doc.bypass_security().save()'
    ],
    correctIndex: 0,
    explanation: 'Setting `doc.flags.ignore_permissions = True` instructs the ORM to bypass user permission checks for that specific save/insert execution.'
  },
  {
    id: 'mcq-10-on-cancel-hook',
    category: 'DocType Controller',
    difficulty: 'Medium',
    xp: 75,
    coins: 30,
    question: 'Technical Interview: What happens when a submitted ERPNext Sales Invoice is cancelled by the user?',
    options: [
      'The document row is deleted from the `tabSales Invoice` database table',
      '`docstatus` is set to 2 (Cancelled) and `on_cancel()` controller event executes reverse GL/Stock entries',
      'The document is renamed with prefix CANCELLED-',
      'Cancelling a submitted invoice is impossible in ERPNext'
    ],
    correctIndex: 1,
    explanation: 'In Frappe/ERPNext submittable documents, cancellation sets `docstatus = 2` and triggers `on_cancel()`, which automatically posts reverse GL/Stock ledger balancing entries.'
  },

  // SECTION 3: Database & ORM Performance (21-30)
  {
    id: 'mcq-11-db-get-value-perf',
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
    id: 'mcq-12-db-set-value-modified',
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
    id: 'mcq-13-sql-injection-prevention',
    category: 'Database Security',
    difficulty: 'Hard',
    xp: 100,
    coins: 40,
    question: 'Technical Interview: Which `frappe.db.sql` invocation safely parameterizes user inputs to prevent SQL Injection?',
    options: [
      'frappe.db.sql(f"SELECT name FROM `tabItem` WHERE item_code = \'{user_input}\'")',
      'frappe.db.sql("SELECT name FROM `tabItem` WHERE item_code = %s", (user_input,))',
      'frappe.db.sql("SELECT name FROM `tabItem` WHERE item_code = " + user_input)',
      'frappe.db.sql("SELECT name FROM `tabItem` WHERE item_code = %(user_input)")'
    ],
    correctIndex: 1,
    explanation: 'Passing parameterized arguments as a tuple/dictionary (`frappe.db.sql(query, values)`) allows the MySQL/PostgreSQL database driver to safely escape and sanitize user parameters.'
  },
  {
    id: 'mcq-14-query-builder-pypika',
    category: 'Database & Performance',
    difficulty: 'Medium',
    xp: 75,
    coins: 30,
    question: 'Technical Interview: What is `frappe.qb` in modern Frappe v14/v15?',
    options: [
      'A Redis caching wrapper',
      'Frappe’s type-safe, database-agnostic Query Builder powered by PyPika',
      'A GraphQL query parser',
      'A frontend search index engine'
    ],
    correctIndex: 1,
    explanation: '`frappe.qb` is Frappe Framework’s Query Builder (PyPika), providing a fluent Python syntax for building SQL queries that work seamlessly across both MariaDB and PostgreSQL.'
  },
  {
    id: 'mcq-15-db-exists',
    category: 'Database & Performance',
    difficulty: 'Easy',
    xp: 50,
    coins: 20,
    question: 'Technical Interview: How do you verify if a Customer record named "CUST-9901" exists in the database with minimum overhead?',
    options: [
      'bool(frappe.get_doc("Customer", "CUST-9901"))',
      'frappe.db.exists("Customer", "CUST-9901")',
      'len(frappe.get_all("Customer", filters={"name": "CUST-9901"})) > 0',
      'frappe.db.count("Customer", "CUST-9901") == 1'
    ],
    correctIndex: 1,
    explanation: '`frappe.db.exists("DocType", name_or_filters)` runs a fast `SELECT 1 ... LIMIT 1` query and returns the document name if found or `None` if absent.'
  },

  // SECTION 4: ERPNext Business Workflows & Architecture (31-40)
  {
    id: 'mcq-16-gl-entry-invariants',
    category: 'ERPNext Accounting',
    difficulty: 'Hard',
    xp: 100,
    coins: 40,
    question: 'Technical Interview: In ERPNext General Ledger accounting, what fundamental invariant must be satisfied by every posted transaction?',
    options: [
      'The total debit amount across all GL entries must equal the total credit amount in the company base currency',
      'Every invoice must have a positive tax percentage',
      'Every GL entry must link to a supplier',
      'The payment must precede the invoice'
    ],
    correctIndex: 0,
    explanation: 'Double-entry bookkeeping requires that the sum of debit entries equals the sum of credit entries for every transaction before it is committed to the General Ledger.'
  },
  {
    id: 'mcq-17-stock-valuation-methods',
    category: 'ERPNext Stock',
    difficulty: 'Medium',
    xp: 75,
    coins: 30,
    question: 'Technical Interview: Which stock valuation methods are supported natively out-of-the-box by ERPNext?',
    options: [
      'FIFO (First-In, First-Out) and Moving Average',
      'LIFO only',
      'Random Selection only',
      'Fixed Standard Cost only'
    ],
    correctIndex: 0,
    explanation: 'ERPNext supports FIFO (First-In, First-Out) and Moving Average valuation methods, automatically calculated on every Stock Ledger Entry (SLE).'
  },
  {
    id: 'mcq-18-sales-flow-order',
    category: 'ERPNext Selling',
    difficulty: 'Easy',
    xp: 50,
    coins: 20,
    question: 'Technical Interview: What is the standard progressive document cycle in the ERPNext Selling workflow?',
    options: [
      'Lead ➔ Opportunity ➔ Quotation ➔ Sales Order ➔ Delivery Note ➔ Sales Invoice',
      'Sales Invoice ➔ Quotation ➔ Lead ➔ Delivery Note',
      'Quotation ➔ Supplier ➔ Sales Order ➔ Stock Entry',
      'Opportunity ➔ Purchase Order ➔ Sales Invoice'
    ],
    correctIndex: 0,
    explanation: 'The standard ERPNext sales lifecycle starts with CRM (Lead/Opportunity), moves to Quotation negotiation, confirms with a Sales Order, fulfills via Delivery Note, and bills with Sales Invoice.'
  },
  {
    id: 'mcq-19-pricing-rules',
    category: 'ERPNext Pricing',
    difficulty: 'Medium',
    xp: 75,
    coins: 30,
    question: 'Technical Interview: How does ERPNext Pricing Rule prioritize when multiple rules match a single item?',
    options: [
      'Alphabetical order of Rule Name',
      'Highest Priority integer defined in the Pricing Rule document',
      'The oldest created rule always wins',
      'All discounts are multiplied together'
    ],
    correctIndex: 1,
    explanation: 'In ERPNext, Pricing Rules contain a `priority` integer field. When multiple rules match, the rule with the highest priority integer is applied.'
  },
  {
    id: 'mcq-20-make-mapped-doc',
    category: 'ERPNext Architecture',
    difficulty: 'Hard',
    xp: 110,
    coins: 45,
    question: 'Technical Interview: What helper utility does ERPNext use to convert a Quotation into a Sales Order with field mapping?',
    options: [
      'frappe.model.mapper.get_mapped_doc',
      'frappe.clone_document_with_map',
      'frappe.transform_doctype',
      'frappe.db.copy_records'
    ],
    correctIndex: 0,
    explanation: '`from frappe.model.mapper import get_mapped_doc` is Frappe’s standard mapping engine that maps headers, child tables, and field aliases between source and target DocTypes.'
  },

  // SECTION 5: Hooks, Background Workers & Extensibility (41-50)
  {
    id: 'mcq-21-hooks-doc-events',
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
    id: 'mcq-22-frappe-enqueue-queues',
    category: 'Background Jobs',
    difficulty: 'Hard',
    xp: 100,
    coins: 40,
    question: 'Technical Interview: What are the three standard Redis background queues available in `frappe.enqueue`?',
    options: [
      'default, short, long',
      'fast, medium, slow',
      'high, normal, low',
      'sync, async, batch'
    ],
    correctIndex: 0,
    explanation: 'Frappe’s background worker architecture uses Redis Queue (RQ) with three standard queues: `default` (300s timeout), `short` (300s), and `long` (1500s timeout).'
  },
  {
    id: 'mcq-23-override-doctype-class',
    category: 'Frappe Hooks',
    difficulty: 'Hard',
    xp: 110,
    coins: 45,
    question: 'Technical Interview: How do you completely override a standard ERPNext Python DocType Controller class with your custom subclass?',
    options: [
      'In `hooks.py`: `override_doctype_class = {"Sales Invoice": "my_app.overrides.CustomSalesInvoice"}`',
      'Replace the file inside `apps/erpnext`',
      'Use `@frappe.override_class` decorator',
      'In `patches.txt`'
    ],
    correctIndex: 0,
    explanation: '`override_doctype_class` in `hooks.py` enables clean OOP inheritance to extend or override standard ERPNext controller methods without touching core repository code.'
  },
  {
    id: 'mcq-24-scheduler-events',
    category: 'Frappe Hooks',
    difficulty: 'Medium',
    xp: 80,
    coins: 30,
    question: 'Technical Interview: How do you schedule a Python task to run automatically every night at midnight?',
    options: [
      'In `hooks.py`: `scheduler_events = {"daily": ["my_app.tasks.nightly_sync"]}`',
      'Add a `while True:` loop in `__init__.py`',
      'In `crontab.txt`',
      'Call `frappe.schedule_timer("24h")`'
    ],
    correctIndex: 0,
    explanation: '`scheduler_events` in `hooks.py` hooks into Frappe’s Celery/Cron scheduler with intervals like `all`, `hourly`, `daily`, `weekly`, and `monthly`.'
  },
  {
    id: 'mcq-25-permission-query-conditions',
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

// Helper: Seeded pseudo-random selector based on Date string (YYYY-MM-DD)
export function getDailyQuizSet(dateString) {
  const targetDate = dateString || new Date().toISOString().split('T')[0];
  
  // Calculate a deterministic numerical hash from the date string
  let hash = 0;
  for (let i = 0; i < targetDate.length; i++) {
    hash = ((hash << 5) - hash) + targetDate.charCodeAt(i);
    hash |= 0;
  }
  hash = Math.abs(hash);

  // Pick exactly 10 distinct questions deterministically from pool
  const pool = [...MASTER_QUESTION_POOL];
  const selected = [];
  const count = Math.min(10, pool.length);

  for (let i = 0; i < count; i++) {
    const index = (hash + i * 7) % pool.length;
    selected.push(pool[index]);
    pool.splice(index, 1);
  }

  return {
    date: targetDate,
    questions: selected,
    totalQuestions: selected.length,
    maxPossibleXp: selected.reduce((sum, q) => sum + q.xp, 0),
    maxPossibleCoins: selected.reduce((sum, q) => sum + q.coins, 0)
  };
}

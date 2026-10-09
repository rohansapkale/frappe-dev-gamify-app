// Enterprise 50-Scenario Mission Bank for Frappe & ERPNext Architecture
// Real-world scenarios spanning Core Desk, Python Controllers, Hooks, Schedulers, APIs, Security, and Migrations.

export const MISSION_CATEGORIES = [
  { id: 'client-scripts', name: 'Client Scripts & Form Behavior', icon: 'Terminal', count: 6, color: '#3b82f6' },
  { id: 'server-controllers', name: 'Server Scripts & Controllers', icon: 'Server', count: 6, color: '#8b5cf6' },
  { id: 'events-hooks', name: 'Document Events & Hooks', icon: 'Layers', count: 6, color: '#10b981' },
  { id: 'scheduler-jobs', name: 'Schedulers & Background Jobs', icon: 'Clock', count: 6, color: '#f59e0b' },
  { id: 'apis-integrations', name: 'APIs & Integrations', icon: 'Cpu', count: 6, color: '#06b6d4' },
  { id: 'permissions-security', name: 'Permissions & Security', icon: 'ShieldCheck', count: 6, color: '#ef4444' },
  { id: 'database-performance', name: 'Database & Performance', icon: 'Database', count: 5, color: '#ec4899' },
  { id: 'workflows-reporting', name: 'Workflows, Reports & Printing', icon: 'FileText', count: 4, color: '#6366f1' },
  { id: 'debugging-deployment', name: 'Debugging, Testing & DevOps', icon: 'Activity', count: 5, color: '#14b8a6' },
];

export const ENTERPRISE_MISSIONS = [
  // =========================================================================
  // SECTION 1: CLIENT SCRIPTS & FORM BEHAVIOR (Scenarios 1 - 6)
  // =========================================================================
  {
    id: 'mission-01',
    number: 1,
    title: 'Auto-Populate Quality Metrics on Batch Entry',
    category: 'Client Scripts & Form Behavior',
    categoryId: 'client-scripts',
    difficulty: 'Easy',
    doctype: 'Quality Inspection',
    language: 'javascript',
    xp: 100,
    coins: 40,
    question: 'On the Quality Inspection form, the moisture percentage must be auto-filled from the linked Lab Test entry when the lab test is selected. How would you implement this in a client script?',
    problemStatement: `An industrial quality control department records material batches. When an inspector selects an approved Lab Test Entry on the Quality Inspection form, the recorded moisture percentage and purity metrics must immediately populate the form fields without requiring a manual page refresh.`,
    architectureGuide: `In Frappe Desk UI, you can populate linked master fields through two standard mechanisms:
1. 'frm.add_fetch(link_field, source_field, target_field)' registered inside the form 'setup' or 'onload' lifecycle hook. This is declarative, cached by Desk, and executes automatically when the link field value changes.
2. An explicit field change event handler 'lab_test(frm)' using 'frappe.db.get_value()' when conditional logic or field transformations are required before setting the value.`,
    codeSnippet: `// Standard Declarative Fetching Approach
frappe.ui.form.on('Quality Inspection', {
    setup(frm) {
        // Automatically fetch 'moisture_percent' from linked 'Lab Test' doc
        frm.add_fetch('lab_test', 'moisture_percent', 'moisture_percentage');
    },

    // Alternative: Programmatic trigger with custom transformation
    lab_test(frm) {
        if (!frm.doc.lab_test) return;
        
        frappe.db.get_value('Lab Test', frm.doc.lab_test, ['moisture_percent', 'status'])
            .then(({ message }) => {
                if (message) {
                    frm.set_value('moisture_percentage', message.moisture_percent);
                    frm.refresh_field('moisture_percentage');
                }
            });
    }
});`,
    keyTakeaway: 'Use frm.add_fetch() in setup() for zero-overhead declarative field copying; use frappe.db.get_value() in field change handlers if data validation is required.'
  },

  {
    id: 'mission-02',
    number: 2,
    title: 'Conditional Dynamic Field Visibility Based on Due Date',
    category: 'Client Scripts & Form Behavior',
    categoryId: 'client-scripts',
    difficulty: 'Easy',
    doctype: 'Tenant Lease Account',
    language: 'javascript',
    xp: 100,
    coins: 40,
    question: 'A tenant lease account form should show the "Late Fee" field only when the due date has passed. How would you implement this?',
    problemStatement: `Property management operators generate monthly facility dues. The "Late Fee" numeric input should remain completely hidden from the form layout unless the current date has exceeded the invoice's specified 'due_date'. If the date is past due, the field must appear dynamically.`,
    architectureGuide: `Use 'frm.set_df_property(fieldname, property, value)' inside both the 'refresh(frm)' and 'due_date(frm)' events. Compare 'frm.doc.due_date' with 'frappe.datetime.get_today()'. Always toggle both hidden and reqd properties appropriately so hidden fields do not block submission.`,
    codeSnippet: `frappe.ui.form.on('Tenant Lease Account', {
    refresh(frm) {
        frm.trigger('toggle_late_fee_visibility');
    },

    due_date(frm) {
        frm.trigger('toggle_late_fee_visibility');
    },

    toggle_late_fee_visibility(frm) {
        if (!frm.doc.due_date) {
            frm.set_df_property('late_fee', 'hidden', 1);
            return;
        }

        const isOverdue = frappe.datetime.get_diff(frappe.datetime.get_today(), frm.doc.due_date) > 0;
        
        // Show field only when current date has passed the due date
        frm.set_df_property('late_fee', 'hidden', isOverdue ? 0 : 1);
        frm.refresh_field('late_fee');
    }
});`,
    keyTakeaway: 'Invoke dynamic visibility checks via frm.set_df_property() inside both refresh() and field change handlers, using frappe.datetime.get_diff().'
  },

  {
    id: 'mission-03',
    number: 3,
    title: 'Live Real-Time Amount Calculation on Contract Form',
    category: 'Client Scripts & Form Behavior',
    categoryId: 'client-scripts',
    difficulty: 'Medium',
    doctype: 'Commercial Contract',
    language: 'javascript',
    xp: 120,
    coins: 50,
    question: 'On the Commercial Contract form, the total amount should update live as the user changes quantity or rate. Which events and methods would you use?',
    problemStatement: `In a high-velocity B2B wholesale contract desk, sales traders adjust quantity and negotiated unit rates. The total contract amount and calculated taxes must update instantly in the UI without requiring document saves or server roundtrips.`,
    architectureGuide: `Bind client script handlers to both 'contracted_qty(frm)' and 'unit_rate(frm)'. Compute the arithmetic product using 'flt()' to safeguard against null/undefined values, assign the result with 'frm.set_value()', and trigger any dependent tax calculation subroutines.`,
    codeSnippet: `frappe.ui.form.on('Commercial Contract', {
    contracted_qty(frm) {
        frm.trigger('calculate_totals');
    },

    unit_rate(frm) {
        frm.trigger('calculate_totals');
    },

    calculate_totals(frm) {
        const qty = flt(frm.doc.contracted_qty, 2);
        const rate = flt(frm.doc.unit_rate, 2);
        const subtotal = flt(qty * rate, 2);

        frm.set_value('total_amount', subtotal);
        
        // Compute standard 5% trade excise tax if applicable
        const taxRate = flt(frm.doc.tax_percent || 0);
        const taxAmount = flt((subtotal * taxRate) / 100, 2);
        frm.set_value('tax_amount', taxAmount);
        frm.set_value('grand_total', subtotal + taxAmount);
    }
});`,
    keyTakeaway: 'Always parse numbers using flt() to prevent NaN; bind calculation subroutines to both input field triggers and the refresh event.'
  },

  {
    id: 'mission-04',
    number: 4,
    title: 'Context-Sensitive "Generate Receipt" Button',
    category: 'Client Scripts & Form Behavior',
    categoryId: 'client-scripts',
    difficulty: 'Easy',
    doctype: 'Facility Maintenance Bill',
    language: 'javascript',
    xp: 100,
    coins: 40,
    question: 'Add a "Generate Receipt" button to the Facility Maintenance Bill form, shown only when the bill status is "Paid."',
    problemStatement: `Facility operations officers manage periodic maintenance bills. To prevent accidental receipt printing before payment verification, the Desk form toolbar must show a "Generate Receipt" primary action button only after the bill status changes to "Paid".`,
    architectureGuide: `Use 'frm.add_custom_button(label, callback, group)' inside the 'refresh(frm)' event. Wrap the button creation inside a strict conditional guard: 'if (frm.doc.docstatus === 1 && frm.doc.status === "Paid")'. Do not render custom action buttons for draft or cancelled records.`,
    codeSnippet: `frappe.ui.form.on('Facility Maintenance Bill', {
    refresh(frm) {
        // Render action button only for submitted, paid invoices
        if (!frm.is_new() && frm.doc.status === 'Paid') {
            frm.add_custom_button(__('Generate Receipt'), () => {
                frappe.new_doc('Payment Receipt', {
                    reference_doctype: frm.doc.doctype,
                    reference_name: frm.doc.name,
                    client: frm.doc.client_account,
                    amount_received: frm.doc.paid_amount
                });
            }, __('Actions')).addClass('btn-primary');
        }
    }
});`,
    keyTakeaway: 'Check docstatus === 1 and status === "Paid" inside refresh(frm) before calling frm.add_custom_button() to maintain clean Desk state.'
  },

  {
    id: 'mission-05',
    number: 5,
    title: 'Locking Sensitive Field After Initial Document Save',
    category: 'Client Scripts & Form Behavior',
    categoryId: 'client-scripts',
    difficulty: 'Medium',
    doctype: 'Gate Weighment Entry',
    language: 'javascript',
    xp: 110,
    coins: 45,
    question: 'The weighbridge operator should not be able to edit the net weight after the first save. How would you lock that field in the UI?',
    problemStatement: `Logistics transport hubs record bulk carrier weights. The operator enters initial gross and tare weights upon truck arrival. Once the document has been saved to the database (even in Draft mode), the 'net_weight' field must be permanently locked against manual tampering in the browser.`,
    architectureGuide: `Check 'frm.is_new()'. If false, the document has already been inserted into the database. Use 'frm.set_df_property("net_weight", "read_only", 1)' to toggle read-only state. Combine this with backend controller validation ('validate()') to prevent direct API spoofing.`,
    codeSnippet: `frappe.ui.form.on('Gate Weighment Entry', {
    refresh(frm) {
        // If document already exists in DB, permanently lock net_weight in Desk UI
        if (!frm.is_new()) {
            frm.set_df_property('net_weight', 'read_only', 1);
            frm.set_df_property('gross_weight', 'read_only', 1);
            frm.set_df_property('tare_weight', 'read_only', 1);
            frm.refresh_fields(['net_weight', 'gross_weight', 'tare_weight']);
        }
    }
});`,
    keyTakeaway: 'Use !frm.is_new() inside refresh(frm) with frm.set_df_property(field, "read_only", 1) for client locking, paired with controller validate() guards.'
  },

  {
    id: 'mission-06',
    number: 6,
    title: 'Automatic Address Resolution from Selected Buyer Record',
    category: 'Client Scripts & Form Behavior',
    categoryId: 'client-scripts',
    difficulty: 'Medium',
    doctype: 'Wholesale Trade Order',
    language: 'javascript',
    xp: 120,
    coins: 50,
    question: 'When a user selects a buyer account, the delivery address should fill automatically from the buyer\'s master record. How would you do this?',
    problemStatement: `Wholesale trade orders require accurate dispatch destinations. When a sales coordinator selects a client from the 'buyer' Link field, the system should pull the primary warehouse address and contact phone without manual input.`,
    architectureGuide: `Use 'frm.add_fetch("buyer", "primary_address", "dispatch_address")' in 'setup(frm)' for standard field syncing, or query 'frappe.contacts.get_default_address()' / 'frappe.db.get_value()' inside the 'buyer(frm)' trigger if address lines require formatting.`,
    codeSnippet: `frappe.ui.form.on('Wholesale Trade Order', {
    setup(frm) {
        // Fast declarative link fetch
        frm.add_fetch('buyer', 'tax_id', 'buyer_tax_id');
    },

    buyer(frm) {
        if (!frm.doc.buyer) {
            frm.set_value('dispatch_address', '');
            return;
        }

        // Fetch formatted address from master
        frappe.call({
            method: 'frappe.contacts.doctype.address.address.get_default_address',
            args: {
                doctype: 'Customer',
                name: frm.doc.buyer
            },
            callback(r) {
                if (r.message) {
                    frm.set_value('dispatch_address', r.message);
                }
            }
        });
    }
});`,
    keyTakeaway: 'Use frappe.contacts.doctype.address API for standard ERPNext address resolution, or frm.add_fetch() for direct Link field attributes.'
  },

  // =========================================================================
  // SECTION 2: SERVER SCRIPTS & CONTROLLERS (Scenarios 7 - 12)
  // =========================================================================
  {
    id: 'mission-07',
    number: 7,
    title: 'Pre-Submission Delivery Date Validation',
    category: 'Server Scripts & Controllers',
    categoryId: 'server-controllers',
    difficulty: 'Easy',
    doctype: 'Forward Trade Contract',
    language: 'python',
    xp: 110,
    coins: 45,
    question: 'A forward contract must not be submitted if the delivery date is earlier than today. Where would you add this check, and why there?',
    problemStatement: `Commercial trade agreements cannot guarantee retrospective delivery dates. If a contract is submitted with a 'delivery_date' in the past, the transaction must be blocked with an informative error message.`,
    architectureGuide: `Place this validation in the controller's 'validate(self)' or 'before_submit(self)' method. The 'validate()' method runs both on save and on submit, ensuring bad data cannot enter the system via UI, REST API, or background tasks. Use 'frappe.utils.getdate()' to compare dates accurately without timezone drift.`,
    codeSnippet: `import frappe
from frappe import _
from frappe.model.document import Document
from frappe.utils import getdate, today

class ForwardTradeContract(Document):
    def validate(self):
        self.validate_delivery_date()

    def validate_delivery_date(self):
        if not self.delivery_date:
            frappe.throw(_("Delivery Due Date is mandatory before finalizing contract"))

        # Block past delivery dates on submission or save
        if getdate(self.delivery_date) < getdate(today()):
            frappe.throw(
                _("Delivery Date {0} cannot be in the past. Current date is {1}.")
                .format(self.delivery_date, today()),
                title=_("Invalid Contract Term")
            )`,
    keyTakeaway: 'Always validate business invariants in controller validate() or before_submit() using getdate() to prevent date string parsing errors.'
  },

  {
    id: 'mission-08',
    number: 8,
    title: 'Idempotent Late Fee Calculation to Prevent Double-Charging',
    category: 'Server Scripts & Controllers',
    categoryId: 'server-controllers',
    difficulty: 'Medium',
    doctype: 'Property Lease Bill',
    language: 'python',
    xp: 130,
    coins: 55,
    question: 'Lease bills need a late fee of 2% per month on unpaid amounts. Where would you calculate this, and how would you avoid double-charging if the bill is saved twice?',
    problemStatement: `A property leasing system assesses late fees on delinquent accounts. If an operator edits and saves a bill multiple times, the 2% fee must not compound repeatedly or duplicate previous charges.`,
    architectureGuide: `Calculate fees inside 'before_save(self)' or 'validate(self)'. To guarantee idempotency:
1. Always compute late fee strictly from the immutable 'base_rent_amount' rather than mutating the current grand total.
2. Maintain explicit tracking fields: 'late_fee_applied' and 'base_rent_amount'.`,
    codeSnippet: `import frappe
from frappe.model.document import Document
from frappe.utils import getdate, today, date_diff, flt

class PropertyLeaseBill(Document):
    def validate(self):
        self.calculate_late_fee()

    def calculate_late_fee(self):
        # Calculate strictly from original base rent to prevent double-charging on re-save
        base_rent = flt(self.base_rent_amount)
        self.late_fee = 0.0

        if self.due_date and getdate(today()) > getdate(self.due_date):
            days_overdue = date_diff(today(), self.due_date)
            # Calculate months overdue (30-day billing cycle)
            months_overdue = max(1, days_overdue // 30)
            
            # Idempotent 2% flat per month on original base rent
            self.late_fee = flt(base_rent * 0.02 * months_overdue, 2)
            self.is_overdue = 1

        self.grand_total = base_rent + self.late_fee`,
    keyTakeaway: 'Ensure calculation idempotency by deriving fees from immutable base figures (base_rent_amount) rather than cumulative mutating totals.'
  },

  {
    id: 'mission-09',
    number: 9,
    title: 'Physical Dispatch Weighment Sanity Validation',
    category: 'Server Scripts & Controllers',
    categoryId: 'server-controllers',
    difficulty: 'Easy',
    doctype: 'Material Dispatch Note',
    language: 'python',
    xp: 100,
    coins: 40,
    question: 'Material dispatch entries should reject any truck whose gross weight is lower than its tare weight. Write the logic you would use.',
    problemStatement: `In physical warehouse dispatch operations, trucks enter empty (tare weight) and exit loaded (gross weight). A gross weight lower than or equal to the tare weight indicates instrument malfunction, data entry error, or theft.`,
    architectureGuide: `Enforce this rule in the controller 'validate(self)' method. Cast both values with 'flt()' before comparison, calculate 'net_weight = gross_weight - tare_weight', and abort with 'frappe.throw()' if the invariant is violated.`,
    codeSnippet: `import frappe
from frappe import _
from frappe.model.document import Document
from frappe.utils import flt

class MaterialDispatchNote(Document):
    def validate(self):
        self.validate_weights()

    def validate_weights(self):
        gross = flt(self.gross_weight, 3)
        tare = flt(self.tare_weight, 3)

        if gross <= 0 or tare <= 0:
            frappe.throw(_("Both Gross Weight and Tare Weight must be positive values."))

        if gross <= tare:
            frappe.throw(
                _("Gross Weight ({0} MT) cannot be less than or equal to Tare Weight ({1} MT). Net weight must be positive.")
                .format(gross, tare),
                title=_("Weighment Sanity Failure")
            )

        # Securely set derived net weight
        self.net_weight = flt(gross - tare, 3)`,
    keyTakeaway: 'Use flt(x, precision) and raise clear, localized frappe.throw() exceptions inside controller validate() before DB commit.'
  },

  {
    id: 'mission-10',
    number: 10,
    title: 'Financial Allocation Reversal on Contract Cancellation',
    category: 'Server Scripts & Controllers',
    categoryId: 'server-controllers',
    difficulty: 'Hard',
    doctype: 'Commercial Sales Agreement',
    language: 'python',
    xp: 150,
    coins: 60,
    question: 'When a commercial agreement is cancelled, the linked advance payment should be released back to the buyer\'s account. Which lifecycle method handles this, and what must you check first?',
    problemStatement: `An enterprise trading partner deposits an advance earnest payment linked to a high-value sales contract. If the contract is cancelled, the tied advance allocation must be unlinked and credited back to the buyer's unallocated deposit ledger.`,
    architectureGuide: `Use the 'on_cancel(self)' controller lifecycle hook. Before unlinking:
1. Verify that downstream material dispatches or delivery notes have not already been submitted against this contract.
2. Update the linked Payment Entry references atomically using 'frappe.db.set_value()' or reverse the allocation record.`,
    codeSnippet: `import frappe
from frappe import _
from frappe.model.document import Document

class CommercialSalesAgreement(Document):
    def on_cancel(self):
        self.assert_no_active_dispatches()
        self.release_advance_allocations()

    def assert_no_active_dispatches(self):
        active_dispatches = frappe.db.get_all(
            'Material Dispatch Note',
            filters={'contract_reference': self.name, 'docstatus': 1},
            pluck='name'
        )
        if active_dispatches:
            frappe.throw(
                _("Cannot cancel contract: Active submitted dispatches exist ({0}). Cancel dispatches first.")
                .format(", ".join(active_dispatches))
            )

    def release_advance_allocations(self):
        if not self.advance_payment_entry:
            return

        # Restore unallocated balance on the linked Payment Entry
        pe = frappe.get_doc("Payment Entry", self.advance_payment_entry)
        pe.flags.ignore_validate = True
        pe.remarks = f"Advance released due to cancellation of {self.name}"
        # Set allocation reference to null
        frappe.db.set_value("Payment Entry", pe.name, "allocated_contract", None)
        frappe.msgprint(_("Advance payment {0} has been unlinked and returned to buyer credit.").format(pe.name))`,
    keyTakeaway: 'Implement reversal logic in on_cancel(self), ensuring pre-flight checks verify that dependent submitted documents do not block cancellation.'
  },

  {
    id: 'mission-11',
    number: 11,
    title: 'Controller-Level Enforcement for Inactive Account Exclusions',
    category: 'Server Scripts & Controllers',
    categoryId: 'server-controllers',
    difficulty: 'Medium',
    doctype: 'Enterprise Client Account',
    language: 'python',
    xp: 120,
    coins: 50,
    question: 'A client account is marked as "Inactive." Their future bills should stop being generated automatically. How would you enforce this at the controller level?',
    problemStatement: `When commercial clients terminate service, their status switches to "Inactive". To protect against accidental billing runs or automated script bugs, the system must enforce at the controller level that no new bill can ever be created or saved for an Inactive client.`,
    architectureGuide: `Enforce this in the child document controller ('PeriodicBillingRun' or 'FacilityMaintenanceBill') inside 'validate(self)'. Query the client status via 'frappe.db.get_value(doctype, name, "status")'. If inactive, raise a validation error. Also filter out inactive accounts in scheduled batch queries.`,
    codeSnippet: `import frappe
from frappe import _
from frappe.model.document import Document

class PeriodicBillingInvoice(Document):
    def validate(self):
        self.validate_client_status()

    def validate_client_status(self):
        if not self.client_account:
            return

        client_status = frappe.db.get_value("Enterprise Client Account", self.client_account, "status")
        
        if client_status in ["Inactive", "Suspended", "Terminated"]:
            frappe.throw(
                _("Cannot generate or save billing invoices for {0} client account: {1}")
                .format(client_status, self.client_account),
                title=_("Inactive Account Billing Guard")
            )`,
    keyTakeaway: 'Guard against automated job errors by validating referenced master document states in validate() before allowing document creation.'
  },

  {
    id: 'mission-12',
    number: 12,
    title: 'Multi-Field Composite Uniqueness Validation Across Facilities',
    category: 'Server Scripts & Controllers',
    categoryId: 'server-controllers',
    difficulty: 'Medium',
    doctype: 'Manufacturing Batch Lot',
    language: 'python',
    xp: 120,
    coins: 50,
    question: 'The system needs to prevent two production lots from sharing the same batch number within the same facility. How would you validate this?',
    problemStatement: `In a multi-plant manufacturing setup, lot batch numbers may repeat across different plants, but within any single facility, a 'batch_number' must be strictly unique to avoid quality trace mix-ups.`,
    architectureGuide: `In the 'validate(self)' controller method, check database existence using 'frappe.db.exists()'. Exclude the current record ('name != self.name') so updates to existing documents don't self-conflict. For high-concurrency safety, add a database composite UNIQUE index on '(facility, batch_number)'.`,
    codeSnippet: `import frappe
from frappe import _
from frappe.model.document import Document

class ManufacturingBatchLot(Document):
    def validate(self):
        self.validate_unique_batch_per_facility()

    def validate_unique_batch_per_facility(self):
        if not self.facility or not self.batch_number:
            return

        # Query database for duplicate active lot in same facility
        duplicate_lot = frappe.db.exists(
            "Manufacturing Batch Lot",
            {
                "facility": self.facility,
                "batch_number": self.batch_number,
                "name": ["!=", self.name]  # Exclude current document during edits
            }
        )

        if duplicate_lot:
            frappe.throw(
                _("Batch Number '{0}' is already assigned to active Lot '{1}' in Facility '{2}'. Batch numbers must be unique per facility.")
                .format(self.batch_number, duplicate_lot, self.facility),
                title=_("Duplicate Batch Number Detected")
            )`,
    keyTakeaway: 'Use frappe.db.exists(doctype, {fields, "name": ["!=", self.name]}) inside validate() to enforce multi-field composite uniqueness.'
  },

  // =========================================================================
  // SECTION 3: DOCUMENT EVENTS & HOOKS (Scenarios 13 - 18)
  // =========================================================================
  {
    id: 'mission-13',
    number: 13,
    title: 'Buyer Credit Exposure Update Hook on Contract Submission',
    category: 'Document Events & Hooks',
    categoryId: 'events-hooks',
    difficulty: 'Medium',
    doctype: 'Commercial Contract',
    language: 'python',
    xp: 130,
    coins: 55,
    question: 'Whenever a commercial contract is submitted, the buyer\'s credit exposure should be updated. Which document event would you hook into, and how would you register it?',
    problemStatement: `Risk management policies mandate that whenever a forward purchase agreement is finalized, the buyer's outstanding credit exposure ledger must immediately increment by the contract's total value.`,
    architectureGuide: `Hook into the 'on_submit' event in your app's 'hooks.py' file using 'doc_events'. Under the hook handler function, recalculate and persist the buyer's credit exposure. Also hook into 'on_cancel' to reverse the credit impact upon contract cancellation.`,
    codeSnippet: `# 1. In your custom app's hooks.py:
doc_events = {
    "Commercial Contract": {
        "on_submit": "trade_engine.events.contract.update_buyer_exposure_on_submit",
        "on_cancel": "trade_engine.events.contract.update_buyer_exposure_on_cancel"
    }
}

# 2. In trade_engine/events/contract.py:
import frappe
from frappe.utils import flt

def update_buyer_exposure_on_submit(doc, method):
    adjust_buyer_exposure(doc.buyer, flt(doc.grand_total))

def update_buyer_exposure_on_cancel(doc, method):
    adjust_buyer_exposure(doc.buyer, -flt(doc.grand_total))

def adjust_buyer_exposure(buyer_name, delta_amount):
    current_exposure = flt(frappe.db.get_value("Customer", buyer_name, "credit_exposure"))
    new_exposure = max(0.0, current_exposure + delta_amount)
    frappe.db.set_value("Customer", buyer_name, "credit_exposure", new_exposure)`,
    keyTakeaway: 'Register doc_events in hooks.py for on_submit and on_cancel to ensure external ledger updates remain in lockstep with document status changes.'
  },

  {
    id: 'mission-14',
    number: 14,
    title: 'Atomic Dues Deduction on Payment Entry Confirmation',
    category: 'Document Events & Hooks',
    categoryId: 'events-hooks',
    difficulty: 'Medium',
    doctype: 'Payment Entry',
    language: 'python',
    xp: 120,
    coins: 50,
    question: 'When a payment is received, the client\'s dues balance should decrease. Where would you put this logic, and why?',
    problemStatement: `Enterprise subscription accounts track running dues. When an accounts clerk submits an official Payment Entry tied to a client contract, the client balance must immediately decrement.`,
    architectureGuide: `Place this in the 'on_submit' hook of 'Payment Entry'. In Frappe/ERPNext, standard General Ledger (GL) entries already handle accounts receivable, but if a custom 'Outstanding Dues' tracking DocType exists, hook into 'on_submit' and 'on_cancel' to keep custom running balances accurate.`,
    codeSnippet: `# In hooks.py:
doc_events = {
    "Payment Entry": {
        "on_submit": "billing_app.events.payment.decrement_client_dues",
        "on_cancel": "billing_app.events.payment.increment_client_dues"
    }
}

# In billing_app/events/payment.py:
import frappe
from frappe.utils import flt

def decrement_client_dues(doc, method):
    if doc.party_type == "Customer" and doc.party:
        amount_paid = flt(doc.received_amount or doc.paid_amount)
        current_dues = flt(frappe.db.get_value("Customer", doc.party, "outstanding_dues"))
        frappe.db.set_value("Customer", doc.party, "outstanding_dues", max(0.0, current_dues - amount_paid))

def increment_client_dues(doc, method):
    if doc.party_type == "Customer" and doc.party:
        amount_paid = flt(doc.received_amount or doc.paid_amount)
        current_dues = flt(frappe.db.get_value("Customer", doc.party, "outstanding_dues"))
        frappe.db.set_value("Customer", doc.party, "outstanding_dues", current_dues + amount_paid)`,
    keyTakeaway: 'Always pair on_submit hooks with symmetric on_cancel hooks to prevent accounting balance drift when transactions are voided.'
  },

  {
    id: 'mission-15',
    number: 15,
    title: 'Guaranteed Stock Restoration on Document Cancellation',
    category: 'Document Events & Hooks',
    categoryId: 'events-hooks',
    difficulty: 'Hard',
    doctype: 'Stock Movement Entry',
    language: 'python',
    xp: 140,
    coins: 60,
    question: 'A stock entry is cancelled. The stock quantity must be restored. How would you make sure this happens even if the cancellation is triggered from a script?',
    problemStatement: `Warehouse stock balances are posted via stock ledgers. If an automated script, REST API caller, or Desk user cancels a submitted stock movement document, the inventory quantities in the source warehouse must be restored immediately.`,
    architectureGuide: `Implement stock reversal in the controller's 'on_cancel(self)' method or via 'Stock Ledger Entry (SLE)' reposting. Because 'doc.cancel()' triggers 'on_cancel()' and registered hooks irrespective of whether the call came from the Desk UI or a background script, controller-level logic guarantees inventory restoration.`,
    codeSnippet: `import frappe
from frappe.model.document import Document

class StockMovementEntry(Document):
    def on_cancel(self):
        # Guaranteed execution on ANY cancellation: UI, REST API, or Python script
        self.repost_stock_ledger_entries(is_cancelled=True)

    def repost_stock_ledger_entries(self, is_cancelled=False):
        for item in self.items:
            # Create reversing Stock Ledger Entry (negated quantity)
            sle = frappe.new_doc("Stock Ledger Entry")
            sle.item_code = item.item_code
            sle.warehouse = item.source_warehouse
            sle.actual_qty = item.qty if is_cancelled else -item.qty
            sle.voucher_type = self.doctype
            sle.voucher_no = self.name
            sle.posting_date = frappe.utils.today()
            sle.flags.ignore_permissions = True
            sle.submit()`,
    keyTakeaway: 'Place ledger adjustments in the DocType controller on_cancel() method rather than in client script buttons to guarantee execution across all callers.'
  },

  {
    id: 'mission-16',
    number: 16,
    title: 'Resilient Asynchronous Dispatch for External SMS/Webhooks',
    category: 'Document Events & Hooks',
    categoryId: 'events-hooks',
    difficulty: 'Hard',
    doctype: 'Periodic Billing Invoice',
    language: 'python',
    xp: 140,
    coins: 60,
    question: 'You need to send an SMS to a client after each bill is generated. Which hook would you use, and what should happen if the SMS gateway is down?',
    problemStatement: `When monthly facility bills are submitted, an instant SMS alert is dispatched to the client. If the third-party SMS gateway experiences latency, network drops, or HTTP 500 errors, the core database invoice transaction must NOT be rolled back or aborted.`,
    architectureGuide: `Use the 'on_submit' or 'after_insert' document event. NEVER call synchronous external HTTP endpoints inside the main database transaction. Instead, use 'frappe.enqueue()' to delegate the SMS delivery to a background queue, wrapped in robust try/except blocks with error logging.`,
    codeSnippet: `# In hooks.py:
doc_events = {
    "Periodic Billing Invoice": {
        "on_submit": "billing_app.events.notifications.enqueue_client_sms"
    }
}

# In billing_app/events/notifications.py:
import frappe
import requests

def enqueue_client_sms(doc, method):
    # Delegate to asynchronous worker queue; main DB transaction completes immediately
    frappe.enqueue(
        "billing_app.events.notifications.send_sms_worker",
        queue="short",
        timeout=60,
        invoice_name=doc.name,
        client_phone=doc.contact_phone,
        bill_amount=doc.grand_total
    )

def send_sms_worker(invoice_name, client_phone, bill_amount):
    try:
        payload = {"to": client_phone, "message": f"Invoice {invoice_name} for \${bill_amount} is ready."}
        response = requests.post("https://api.sms-gateway.example.com/send", json=payload, timeout=10)
        response.raise_for_status()
    except Exception as exc:
        # Gateway failure is logged; invoice in database is completely safe and committed
        frappe.log_error(
            title=f"SMS Delivery Failed for {invoice_name}",
            message=frappe.get_traceback()
        )`,
    keyTakeaway: 'Offload external API calls using frappe.enqueue() so external downtime never blocks or rolls back database transactions.'
  },

  {
    id: 'mission-17',
    number: 17,
    title: 'Extending Standard ERPNext Sales Invoice Without Core Editing',
    category: 'Document Events & Hooks',
    categoryId: 'events-hooks',
    difficulty: 'Medium',
    doctype: 'Sales Invoice',
    language: 'python',
    xp: 130,
    coins: 55,
    question: 'The company wants a standard ERPNext Sales Invoice to carry a custom "Trade Reference" field and validate it. How would you do this without editing ERPNext?',
    problemStatement: `A wholesale trading firm needs every standard ERPNext Sales Invoice to require a valid, approved 'Trade Reference Contract' before submission. Modifying core ERPNext files directly is strictly prohibited to preserve upgradeability.`,
    architectureGuide: `Implement the extension in two clean, non-intrusive steps:
1. Export a **Custom Field** via your custom app's 'fixtures' in 'hooks.py'.
2. Intercept the standard document's validation lifecycle by adding a 'validate' hook under 'doc_events' in 'hooks.py'.`,
    codeSnippet: `# 1. In your custom app hooks.py:
fixtures = [
    {
        "dt": "Custom Field",
        "filters": [["name", "in", ["Sales Invoice-trade_reference"]]]
    }
]

doc_events = {
    "Sales Invoice": {
        "validate": "trade_app.overrides.sales_invoice.validate_trade_reference"
    }
}

# 2. In trade_app/overrides/sales_invoice.py:
import frappe
from frappe import _

def validate_trade_reference(doc, method):
    if not doc.trade_reference:
        return

    # Verify that linked Trade Contract exists and is currently submitted/active
    contract_status = frappe.db.get_value("Commercial Contract", doc.trade_reference, "docstatus")
    if contract_status != 1:
        frappe.throw(
            _("Referenced Trade Contract '{0}' must be submitted and active before billing.")
            .format(doc.trade_reference),
            title=_("Invalid Contract Reference")
        )`,
    keyTakeaway: 'Extend standard ERPNext DocTypes cleanly using Custom Field fixtures and hooks.py doc_events without ever touching upstream code.'
  },

  {
    id: 'mission-18',
    number: 18,
    title: 'Overriding Core Controller Classes for Credit Limit Governance',
    category: 'Document Events & Hooks',
    categoryId: 'events-hooks',
    difficulty: 'Hard',
    doctype: 'Customer',
    language: 'python',
    xp: 140,
    coins: 60,
    question: 'Override the default behavior of the Customer controller so that the customer\'s credit limit cannot exceed the limit set by the finance head. What approach would you take?',
    problemStatement: `Standard ERPNext allows Sales Managers to configure customer credit limits. The finance department mandates a strict ceiling: no credit limit can exceed the pre-approved maximum set in the company's financial governance master.`,
    architectureGuide: `Use the 'override_doctype_class' configuration in 'hooks.py'. Create a custom class that inherits from the original 'erpnext.selling.doctype.customer.customer.Customer'. Override the 'validate(self)' method to enforce your governance check, and call 'super().validate()' to preserve standard ERPNext behavior.`,
    codeSnippet: `# 1. In hooks.py:
override_doctype_class = {
    "Customer": "enterprise_governance.overrides.customer.CustomCustomer"
}

# 2. In enterprise_governance/overrides/customer.py:
import frappe
from frappe import _
from frappe.utils import flt
from erpnext.selling.doctype.customer.customer import Customer

class CustomCustomer(Customer):
    def validate(self):
        # Execute standard ERPNext customer validations first
        super().validate()
        self.enforce_finance_head_credit_ceiling()

    def enforce_finance_head_credit_ceiling(self):
        max_allowed_limit = flt(frappe.db.get_single_value("Credit Policy Settings", "max_customer_credit_limit"))
        
        if max_allowed_limit > 0 and flt(self.custom_credit_limit) > max_allowed_limit:
            frappe.throw(
                _("Proposed credit limit of {0} exceeds the corporate ceiling of {1} set by the Finance Director.")
                .format(self.custom_credit_limit, max_allowed_limit),
                title=_("Credit Governance Breach")
            )`,
    keyTakeaway: 'Use override_doctype_class in hooks.py to subclass standard DocType controllers while calling super() to preserve upstream functionality.'
  },

  // =========================================================================
  // SECTION 4: SCHEDULERS & BACKGROUND JOBS (Scenarios 19 - 24)
  // =========================================================================
  {
    id: 'mission-19',
    number: 19,
    title: 'Monthly Recurring Billing Engine with Idempotency Locks',
    category: 'Schedulers & Background Jobs',
    categoryId: 'scheduler-jobs',
    difficulty: 'Medium',
    doctype: 'Facility Maintenance Bill',
    language: 'python',
    xp: 130,
    coins: 55,
    question: 'Every month on the 1st, recurring maintenance bills should be generated for all active enterprise units. How would you schedule this, and how would you prevent duplicate bills if the job runs twice?',
    problemStatement: `A recurring billing engine generates monthly invoices for hundreds of commercial units on the 1st of each month. If a bench worker restarts, or an administrator accidentally triggers the scheduler task twice, no unit should ever receive duplicate invoices.`,
    architectureGuide: `Configure a 'monthly' or cron-based scheduler event in 'hooks.py'. Inside the billing generator, enforce idempotency by checking 'frappe.db.exists("Facility Maintenance Bill", {"billing_cycle": current_month, "unit": unit.name})' before inserting any invoice. Wrap individual unit generations in safe commits.`,
    codeSnippet: `# 1. In hooks.py:
scheduler_events = {
    "cron": {
        "0 0 1 * *": [
            "facility_billing.tasks.generate_monthly_unit_bills"
        ]
    }
}

# 2. In facility_billing/tasks.py:
import frappe
from frappe.utils import nowdate, getdate

def generate_monthly_unit_bills():
    today = getdate(nowdate())
    billing_cycle = f"{today.year}-{today.month:02d}"

    active_units = frappe.get_all("Commercial Unit", filters={"status": "Occupied"}, fields=["name", "tenant", "monthly_rent"])

    for unit in active_units:
        # Idempotency check: Skip if already generated for this cycle
        if frappe.db.exists("Facility Maintenance Bill", {"billing_cycle": billing_cycle, "unit": unit.name, "docstatus": ["!=", 2]}):
            continue

        bill = frappe.new_doc("Facility Maintenance Bill")
        bill.billing_cycle = billing_cycle
        bill.unit = unit.name
        bill.tenant = unit.tenant
        bill.base_rent_amount = unit.monthly_rent
        bill.due_date = f"{today.year}-{today.month:02d}-15"
        bill.insert(ignore_permissions=True)
        bill.submit()`,
    keyTakeaway: 'Prevent duplicate scheduler creations by checking composite existence (billing_cycle + entity) before inserting records.'
  },

  {
    id: 'mission-20',
    number: 20,
    title: 'Non-Blocking Nightly Batch Contract Expiration',
    category: 'Schedulers & Background Jobs',
    categoryId: 'scheduler-jobs',
    difficulty: 'Medium',
    doctype: 'Commercial Contract',
    language: 'python',
    xp: 120,
    coins: 50,
    question: 'A nightly job should mark contracts as "Expired" when their delivery window closes. How would you run it without blocking the server?',
    problemStatement: `An enterprise trading exchange manages tens of thousands of forward trade contracts. Every night at midnight, contracts whose expiration dates have passed must transition to "Expired" without consuming main HTTP worker threads or causing memory exhaustion.`,
    architectureGuide: `Register the task under 'daily_long' in 'hooks.py' or use 'cron'. Query records using chunked pagination ('limit_page_length=500') rather than loading all rows into RAM. Use 'frappe.db.set_value()' for bulk status updates or enqueue child chunks to the 'long' Redis queue.`,
    codeSnippet: `# In hooks.py:
scheduler_events = {
    "daily_long": [
        "trade_app.tasks.expire_closed_contracts"
    ]
}

# In trade_app/tasks.py:
import frappe
from frappe.utils import today

def expire_closed_contracts():
    chunk_size = 500
    while True:
        # Chunked query to avoid RAM explosion
        expired_batch = frappe.get_all(
            "Commercial Contract",
            filters={
                "status": "Active",
                "delivery_due_date": ["<", today()],
                "docstatus": 1
            },
            pluck="name",
            limit_page_length=chunk_size
        )

        if not expired_batch:
            break

        for contract_name in expired_batch:
            frappe.db.set_value("Commercial Contract", contract_name, "status", "Expired", update_modified=False)

        frappe.db.commit()`,
    keyTakeaway: 'Use daily_long scheduler events with chunked pagination and update_modified=False to process large record volumes efficiently.'
  },

  {
    id: 'mission-21',
    number: 21,
    title: 'Scheduled Executive Morning Report Dispatcher',
    category: 'Schedulers & Background Jobs',
    categoryId: 'scheduler-jobs',
    difficulty: 'Medium',
    doctype: 'Stock Ledger Entry',
    language: 'python',
    xp: 120,
    coins: 50,
    question: 'Daily reports of plant inventory movements need to be emailed to the plant director at 7 AM. How would you schedule and deliver this?',
    problemStatement: `Manufacturing leadership needs an executive email summary every morning at 07:00 AM sharp, detailing previous-day stock receipts, issues, and closing balances for key warehouses.`,
    architectureGuide: `Use a standard 5-part cron syntax '"0 7 * * *"' under 'scheduler_events.cron' in 'hooks.py'. In the task function, aggregate movement rows using 'frappe.db.sql' or 'frappe.qb', format the HTML body using 'frappe.render_template', and dispatch using 'frappe.sendmail(now=True)'.`,
    codeSnippet: `# 1. In hooks.py:
scheduler_events = {
    "cron": {
        "0 7 * * *": [
            "plant_ops.tasks.send_daily_inventory_summary"
        ]
    }
}

# 2. In plant_ops/tasks.py:
import frappe
from frappe.utils import add_days, today

def send_daily_inventory_summary():
    yesterday = add_days(today(), -1)
    
    movements = frappe.db.sql("""
        SELECT item_code, warehouse, SUM(actual_qty) as total_change
        FROM "tabStock Ledger Entry"
        WHERE posting_date = %s
        GROUP BY item_code, warehouse
    """, (yesterday,), as_dict=True)

    recipient = frappe.db.get_single_value("Plant Settings", "director_email")
    if not recipient:
        return

    frappe.sendmail(
        recipients=[recipient],
        subject=f"Daily Plant Stock Movement Summary - {yesterday}",
        template="plant_daily_stock_digest",
        args={"movements": movements, "report_date": yesterday},
        now=True
    )`,
    keyTakeaway: 'Schedule precise delivery times using cron in hooks.py and format executive digests with frappe.render_template and frappe.sendmail.'
  },

  {
    id: 'mission-22',
    number: 22,
    title: 'Asynchronous Chunked Bulk Import with Real-Time Progress',
    category: 'Schedulers & Background Jobs',
    categoryId: 'scheduler-jobs',
    difficulty: 'Hard',
    doctype: 'Historical Payment Record',
    language: 'python',
    xp: 150,
    coins: 60,
    question: 'The bulk import of 50,000 historical payment records is timing out in the browser. How would you move it to a background job and let the user track progress?',
    problemStatement: `Importing 50,000 legacy payment vouchers via standard browser HTTP requests causes gateway 504 timeouts. The import must run asynchronously on worker processes while broadcasting real-time progress percentages to the user's Desk browser.`,
    architectureGuide: `Offload execution using 'frappe.enqueue(..., queue="long")'. Process the payload in batches (e.g. 100 rows per batch). After each batch, emit a real-time WebSocket event via 'frappe.publish_realtime("import_progress", {"progress": percent}, user=frappe.session.user)'. The Desk UI listens to this event to render a live progress bar.`,
    codeSnippet: `# Server API Endpoint:
import frappe

@frappe.whitelist()
def start_legacy_import(file_url):
    frappe.enqueue(
        "migration_app.importer.process_bulk_payments",
        queue="long",
        timeout=3600,
        file_url=file_url,
        user=frappe.session.user
    )
    return {"message": "Import queued in background"}

# Worker implementation:
def process_bulk_payments(file_url, user):
    rows = parse_file(file_url)  # 50,000 rows
    total = len(rows)

    for idx, row in enumerate(rows):
        create_payment_entry(row)

        if idx % 200 == 0 or idx == total - 1:
            frappe.db.commit()
            percent = int(((idx + 1) / total) * 100)
            
            # Emit live WebSocket message to browser Desk
            frappe.publish_realtime(
                "import_progress",
                {"current": idx + 1, "total": total, "percent": percent},
                user=user
            )`,
    keyTakeaway: 'Use frappe.enqueue(queue="long") combined with frappe.publish_realtime() to process high-volume datasets without browser timeouts.'
  },

  {
    id: 'mission-23',
    number: 23,
    title: 'Silent Background Job Failure Diagnostics & Alerting',
    category: 'Schedulers & Background Jobs',
    categoryId: 'scheduler-jobs',
    difficulty: 'Medium',
    doctype: 'Scheduled Job Log',
    language: 'python',
    xp: 120,
    coins: 50,
    question: 'A scheduled job failed silently last week. How would you find out why, and how would you set up alerts for future failures?',
    problemStatement: `A critical nightly settlement task stopped running without notifying system administrators. The engineering team must inspect diagnostic logs to pinpoint the root cause and configure automated alerting for any future job failure.`,
    architectureGuide: `Investigate failures via the **Scheduled Job Log** and **Error Log** DocTypes in Desk. To establish automated alerts, register a failure handler using the 'on_failure' parameter in 'frappe.enqueue()' or monitor 'Scheduled Job Type' records using a sentinel cron that emails DevOps on failed job logs.`,
    codeSnippet: `# 1. Diagnostic Query for Root Cause:
import frappe

def inspect_failed_jobs():
    failed_runs = frappe.get_all(
        "Scheduled Job Log",
        filters={"status": "Failed"},
        fields=["scheduled_job_type", "details", "creation"],
        order_by="creation desc",
        limit=10
    )
    return failed_runs

# 2. Automated Sentinel Monitor in hooks.py:
scheduler_events = {
    "hourly": [
        "ops_alert.monitoring.check_job_failures_and_alert"
    ]
}

# In ops_alert/monitoring.py:
def check_job_failures_and_alert():
    recent_errors = frappe.get_all(
        "Scheduled Job Log",
        filters={"status": "Failed", "creation": [">", frappe.utils.add_to_date(now=True, hours=-1)]},
        fields=["name", "scheduled_job_type", "details"]
    )
    if recent_errors:
        frappe.sendmail(
            recipients=["devops@company.com"],
            subject=f"CRITICAL: {len(recent_errors)} Background Jobs Failed on Site",
            message=f"Details: {recent_errors}"
        )`,
    keyTakeaway: 'Inspect Scheduled Job Log and Error Log DocTypes in Desk; configure a sentinel cron to alert on status="Failed" runs.'
  },

  {
    id: 'mission-24',
    number: 24,
    title: 'Fault-Tolerant Bulk Settlements with Isolated Transactions',
    category: 'Schedulers & Background Jobs',
    categoryId: 'scheduler-jobs',
    difficulty: 'Hard',
    doctype: 'Supplier Settlement Batch',
    language: 'python',
    xp: 140,
    coins: 60,
    question: 'Monthly procurement settlements must be calculated for hundreds of independent suppliers, and the job should retry if one supplier\'s record fails. How would you structure this?',
    problemStatement: `During monthly supplier payouts, hundreds of individual settlement vouchers are computed. If a single supplier has bad bank data or validation errors, the entire batch must NOT crash, and failed entries must record error details for targeted retries.`,
    architectureGuide: `Iterate through suppliers in an isolated loop. Wrap each settlement inside a 'try/except' block. On success, call 'frappe.db.commit()'. On failure, call 'frappe.db.rollback()', log the exception to a child error log table, and continue processing remaining suppliers.`,
    codeSnippet: `import frappe

def execute_monthly_supplier_settlement_batch(batch_name):
    suppliers = frappe.get_all("Supplier", filters={"is_active": 1}, pluck="name")
    
    success_count = 0
    failed_suppliers = []

    for supplier in suppliers:
        # Isolate database transaction per supplier
        try:
            calculate_and_post_settlement(supplier)
            frappe.db.commit()  # Persist this successful transaction
            success_count += 1
        except Exception as err:
            frappe.db.rollback()  # Rollback ONLY this failed supplier
            frappe.log_error(title=f"Settlement Failed: {supplier}", message=frappe.get_traceback())
            failed_suppliers.append({"supplier": supplier, "error": str(err)})

    # Record summary on parent batch
    frappe.db.set_value("Supplier Settlement Batch", batch_name, {
        "successful_records": success_count,
        "failed_records": len(failed_suppliers),
        "status": "Partially Failed" if failed_suppliers else "Completed"
    })
    frappe.db.commit()`,
    keyTakeaway: 'Isolate bulk sub-transactions with per-item try/except blocks, calling frappe.db.commit() on success and frappe.db.rollback() on failure.'
  },

  // =========================================================================
  // SECTION 5: APIS & INTEGRATIONS (Scenarios 25 - 30)
  // =========================================================================
  {
    id: 'mission-25',
    number: 25,
    title: 'Industrial Hardware IoT Ingestion Endpoint',
    category: 'APIs & Integrations',
    categoryId: 'apis-integrations',
    difficulty: 'Medium',
    doctype: 'Gate Weighment Entry',
    language: 'python',
    xp: 130,
    coins: 55,
    question: 'An automated scale sends weight readings to your system over HTTP. Design the whitelisted endpoint that receives these readings and stores them.',
    problemStatement: `An automated weighbridge indicator transmits JSON payloads over HTTP POST upon vehicle departure containing sensor ID, gross weight, and vehicle tag. Design a secure, authenticated Frappe endpoint to ingest these readings.`,
    architectureGuide: `Use '@frappe.whitelist(methods=["POST"])'. Authenticate the request via custom header tokens or standard Frappe API keys ('token api_key:api_secret'). Validate input types strictly, parse numbers using 'flt()', and insert a new DocType record within a managed transaction.`,
    codeSnippet: `import frappe
from frappe import _
from frappe.utils import flt

@frappe.whitelist(methods=["POST"])
def ingest_weighment_reading(scale_id, vehicle_number, gross_weight, tare_weight=0):
    # Verify scale API token
    auth_header = frappe.get_request_header("X-Scale-Token")
    expected_token = frappe.conf.get("scale_integration_token")
    
    if not auth_header or auth_header != expected_token:
        frappe.throw(_("Unauthorized hardware integration scale client"), frappe.AuthenticationError)

    # Validate numeric payloads
    gross = flt(gross_weight)
    tare = flt(tare_weight)
    if gross <= 0:
        frappe.throw(_("Gross weight must be greater than zero"), frappe.ValidationError)

    doc = frappe.new_doc("Gate Weighment Entry")
    doc.scale_identifier = scale_id
    doc.vehicle_plate = vehicle_number.strip().upper()
    doc.gross_weight = gross
    doc.tare_weight = tare
    doc.net_weight = max(0.0, gross - tare)
    doc.reading_source = "IoT Automation API"
    doc.insert(ignore_permissions=True)

    return {
        "status": "success",
        "voucher_id": doc.name,
        "recorded_net_weight": doc.net_weight
    }`,
    keyTakeaway: 'Decorate integration endpoints with @frappe.whitelist(methods=["POST"]), enforce header token checks, and sanitize input types.'
  },

  {
    id: 'mission-26',
    number: 26,
    title: 'Secure Client Portal API & IDOR Prevention',
    category: 'APIs & Integrations',
    categoryId: 'apis-integrations',
    difficulty: 'Medium',
    doctype: 'Tenant Lease Account',
    language: 'python',
    xp: 130,
    coins: 55,
    question: 'A mobile app needs to show a client their own dues and receipts. How would you expose this data securely?',
    problemStatement: `A customer-facing mobile application displays invoice ledgers and payment receipts. The REST API must strictly prevent Insecure Direct Object Reference (IDOR) attacks where a user tampers with parameters to view another client's financial records.`,
    architectureGuide: `Decorate the method with '@frappe.whitelist()'. NEVER accept the target client/customer name from URL query parameters. Instead, resolve the authenticated identity server-side via 'frappe.session.user', map it to their linked Customer record, and filter queries strictly by that resolved ID.`,
    codeSnippet: `import frappe
from frappe import _

@frappe.whitelist()
def get_my_account_statements():
    # 1. Resolve current authenticated session user (never trust client-supplied client_id)
    current_user = frappe.session.user
    if current_user == "Guest":
        frappe.throw(_("Authentication required to access statements"), frappe.AuthenticationError)

    # 2. Map authenticated user to their official Customer record
    client_name = frappe.db.get_value("Customer", {"portal_user": current_user}, "name")
    if not client_name:
        frappe.throw(_("No customer profile linked to active account"), frappe.PermissionError)

    # 3. Query records strictly bound to this verified client
    invoices = frappe.get_all(
        "Periodic Billing Invoice",
        filters={"client_account": client_name, "docstatus": 1},
        fields=["name", "posting_date", "grand_total", "status", "due_date"],
        order_by="posting_date desc",
        limit_page_length=50
    )

    return {
        "client": client_name,
        "invoices": invoices
    }`,
    keyTakeaway: 'Always derive ownership from frappe.session.user rather than query arguments to prevent IDOR security vulnerabilities.'
  },

  {
    id: 'mission-27',
    number: 27,
    title: 'Cryptographic Payment Webhook Authentication & Idempotency',
    category: 'APIs & Integrations',
    categoryId: 'apis-integrations',
    difficulty: 'Hard',
    doctype: 'Payment Entry',
    language: 'python',
    xp: 150,
    coins: 60,
    question: 'An external bank system must confirm payments into an account. How would you authenticate its callbacks, and how would you prevent the same payment being recorded twice?',
    problemStatement: `A commercial banking partner fires HTTP webhook callbacks upon settlement clearance. Due to network retries, the bank may deliver identical webhooks multiple times. The endpoint must verify the cryptographic signature and guarantee zero duplicate credit postings.`,
    architectureGuide: `Implement HMAC-SHA256 signature verification using the shared webhook secret. Enforce idempotency by extracting the bank's unique 'transaction_reference' and checking if a Payment Entry with that reference already exists in the database before processing.`,
    codeSnippet: `import frappe
import hmac
import hashlib
from frappe import _

@frappe.whitelist(allow_guest=True, methods=["POST"])
def bank_payment_callback():
    # 1. Verify HMAC Signature
    signature = frappe.get_request_header("X-Bank-Signature")
    raw_payload = frappe.request.get_data()
    secret = frappe.conf.get("bank_webhook_secret", "").encode("utf-8")
    
    computed_sig = hmac.new(secret, raw_payload, hashlib.sha256).hexdigest()
    if not signature or not hmac.compare_digest(signature, computed_sig):
        frappe.throw(_("Invalid webhook signature"), frappe.AuthenticationError)

    data = frappe.local.form_dict
    bank_txn_id = data.get("transaction_id")
    amount = frappe.utils.flt(data.get("amount"))
    client_account = data.get("client_id")

    # 2. Idempotency Check: Prevent duplicate payment creation
    existing_entry = frappe.db.exists("Payment Entry", {"reference_no": bank_txn_id, "docstatus": ["!=", 2]})
    if existing_entry:
        return {"status": "ignored", "reason": "Already processed", "payment_entry": existing_entry}

    # 3. Create payment record atomically
    pe = frappe.new_doc("Payment Entry")
    pe.payment_type = "Receive"
    pe.party_type = "Customer"
    pe.party = client_account
    pe.paid_amount = amount
    pe.received_amount = amount
    pe.reference_no = bank_txn_id
    pe.insert(ignore_permissions=True)
    pe.submit()

    return {"status": "success", "payment_entry": pe.name}`,
    keyTakeaway: 'Authenticate external webhooks using hmac.compare_digest() and check unique transaction references before creating records.'
  },

  {
    id: 'mission-28',
    number: 28,
    title: 'High-Performance Filtered Logistics Dispatch API',
    category: 'APIs & Integrations',
    categoryId: 'apis-integrations',
    difficulty: 'Medium',
    doctype: 'Material Dispatch Note',
    language: 'python',
    xp: 120,
    coins: 50,
    question: 'A third-party logistics provider needs the list of dispatched material packages for a given date. How would you design the API response and filter it?',
    problemStatement: `A third-party carrier platform queries your site daily to synchronize delivery manifests. The endpoint must accept date filters, return only essential fields (avoiding full document payloads), and support pagination for high performance.`,
    architectureGuide: `Use '@frappe.whitelist()'. Accept 'dispatch_date', 'page', and 'page_size'. Execute queries using 'frappe.get_all()' with an explicit 'fields' list rather than loading full document models via 'frappe.get_doc()', minimizing database IO and JSON serialization overhead.`,
    codeSnippet: `import frappe
from frappe.utils import getdate

@frappe.whitelist(methods=["GET"])
def get_dispatches_for_carrier(dispatch_date=None, page=1, page_size=100):
    date_filter = getdate(dispatch_date) if dispatch_date else frappe.utils.today()
    limit_start = (int(page) - 1) * int(page_size)

    dispatches = frappe.get_all(
        "Material Dispatch Note",
        filters={
            "dispatch_date": date_filter,
            "docstatus": 1
        },
        fields=[
            "name as dispatch_id",
            "vehicle_plate",
            "carrier_partner",
            "destination_warehouse",
            "net_weight",
            "package_count",
            "status"
        ],
        start=limit_start,
        page_length=int(page_size),
        order_by="creation asc"
    )

    total_count = frappe.db.count("Material Dispatch Note", {"dispatch_date": date_filter, "docstatus": 1})

    return {
        "date": str(date_filter),
        "total_records": total_count,
        "page": int(page),
        "results": dispatches
    }`,
    keyTakeaway: 'Use frappe.get_all() with explicit fields and limit_start / page_length to serve fast, lean JSON payloads to external systems.'
  },

  {
    id: 'mission-29',
    number: 29,
    title: 'High-Frequency Pricing Rate Endpoint with Redis Caching',
    category: 'APIs & Integrations',
    categoryId: 'apis-integrations',
    difficulty: 'Hard',
    doctype: 'Commodity Benchmark Price',
    language: 'python',
    xp: 140,
    coins: 60,
    question: 'The frontend wrapper calls a commodity price endpoint frequently. How would you reduce the load on the database?',
    problemStatement: `A public trading dashboard polls official commodity benchmark prices every 2 seconds across thousands of client browsers. Executing raw SQL queries for every request causes severe database lock contention and CPU spikes.`,
    architectureGuide: `Leverage Frappe's in-memory Redis cache via 'frappe.cache().get_value()'. If the cached key exists, return it instantly without touching MariaDB. If absent, execute the database query, populate Redis with a 30-second TTL ('expires_in_sec=30'), and invalidate the key on price master updates.`,
    codeSnippet: `import frappe

CACHE_KEY = "benchmark_prices_live"

@frappe.whitelist(allow_guest=True)
def get_live_benchmark_rates():
    cache = frappe.cache()
    
    # 1. Attempt to serve from in-memory Redis cache
    cached_rates = cache.get_value(CACHE_KEY)
    if cached_rates:
        return {"data": cached_rates, "source": "redis_cache"}

    # 2. Cache miss: Read from database
    rates = frappe.get_all(
        "Commodity Benchmark Price",
        filters={"is_active": 1},
        fields=["commodity_code", "current_spot_rate", "currency", "last_updated"]
    )

    # 3. Store in Redis with a 30-second TTL
    cache.set_value(CACHE_KEY, rates, expires_in_sec=30)

    return {"data": rates, "source": "database"}

# Hook on master update to invalidate cache instantly
def on_price_update(doc, method):
    frappe.cache().delete_value(CACHE_KEY)`,
    keyTakeaway: 'Wrap high-frequency read endpoints with frappe.cache().get_value() and invalidate via on_update hooks to protect database performance.'
  },

  {
    id: 'mission-30',
    number: 30,
    title: 'Defensive Input Sanitization & Payload Type Assertions',
    category: 'APIs & Integrations',
    categoryId: 'apis-integrations',
    difficulty: 'Medium',
    doctype: 'Periodic Billing Invoice',
    language: 'python',
    xp: 120,
    coins: 50,
    question: 'A whitelisted function that updates billing payments was called with a missing amount argument and caused a bad record. How would you validate inputs before the write?',
    problemStatement: `An external integration fired a billing update API call with missing or malformed payload arguments, inserting zero-amount corrupted entries into the ledger. The endpoint must implement strict defensive validation before modifying database records.`,
    architectureGuide: `Validate all required parameters at the very top of the whitelisted function. Enforce presence, check string types with '.strip()', convert numbers with 'flt()', and verify minimum bounds (> 0). Raise explicit 'frappe.ValidationError' exceptions to reject malformed calls before initiating DB writes.`,
    codeSnippet: `import frappe
from frappe import _
from frappe.utils import flt

@frappe.whitelist(methods=["POST"])
def record_bill_payment(invoice_id=None, amount=None, payment_ref=None):
    # 1. Mandatory argument assertions
    if not invoice_id or not str(invoice_id).strip():
        frappe.throw(_("Invoice ID is mandatory"), frappe.MandatoryError)

    if amount is None:
        frappe.throw(_("Payment amount is mandatory"), frappe.MandatoryError)

    # 2. Type casting and range validation
    parsed_amount = flt(amount)
    if parsed_amount <= 0:
        frappe.throw(_("Payment amount must be strictly greater than zero"), frappe.ValidationError)

    if not payment_ref or not str(payment_ref).strip():
        frappe.throw(_("Payment Reference / Transaction ID is required"), frappe.MandatoryError)

    # 3. Verify target invoice exists and is unpaid
    invoice = frappe.get_doc("Periodic Billing Invoice", invoice_id)
    if invoice.docstatus != 1 or invoice.status == "Paid":
        frappe.throw(_("Cannot apply payment: Invoice {0} is not in an unpaid state").format(invoice_id))

    invoice.paid_amount = flt(invoice.paid_amount) + parsed_amount
    if invoice.paid_amount >= flt(invoice.grand_total):
        invoice.status = "Paid"
    invoice.save(ignore_permissions=True)

    return {"status": "success", "invoice": invoice.name, "updated_status": invoice.status}`,
    keyTakeaway: 'Assert required parameters, cast types with flt(), and validate business states before executing any database mutation.'
  },

  // =========================================================================
  // SECTION 6: PERMISSIONS & SECURITY (Scenarios 31 - 36)
  // =========================================================================
  {
    id: 'mission-31',
    number: 31,
    title: 'Field-Level Permission Restrictions via Permlevels',
    category: 'Permissions & Security',
    categoryId: 'permissions-security',
    difficulty: 'Medium',
    doctype: 'Wholesale Sales Order',
    language: 'json',
    xp: 120,
    coins: 50,
    question: 'Only the plant accountant should see commercial sales prices, but the store keeper must see quantities. How would you configure this?',
    problemStatement: `In a manufacturing plant, warehouse storekeepers inspect sales order line items to pack and dispatch physical goods, but corporate confidentiality dictates that commercial selling rates, margins, and totals must be hidden from their view.`,
    architectureGuide: `Use Frappe's **Permission Levels (Permlevels)**:
1. Assign general fields (item_code, qty, warehouse) to **Permlevel 0** and grant Read access to both 'Stock User' and 'Accounts User'.
2. Assign sensitive commercial fields (rate, amount, grand_total, discount) to **Permlevel 1**.
3. In the **Role Permission Manager**, grant Permlevel 1 Read access ONLY to the 'Accounts User' and 'Accounts Manager' roles.`,
    codeSnippet: `/* Configuration in DocType JSON or Role Permission Manager: */

// 1. In DocType Schema:
// field: "qty" -> permlevel: 0
// field: "warehouse" -> permlevel: 0
// field: "rate" -> permlevel: 1
// field: "amount" -> permlevel: 1

// 2. Role Permission Entries:
[
  {
    "role": "Stock User",
    "permlevel": 0,
    "read": 1,
    "write": 0
  },
  {
    "role": "Accounts User",
    "permlevel": 0,
    "read": 1,
    "write": 1
  },
  {
    "role": "Accounts User",
    "permlevel": 1,
    "read": 1,
    "write": 1
  }
]`,
    keyTakeaway: 'Isolate sensitive monetary fields to Permlevel 1 and grant Permlevel 1 access exclusively to authorized financial roles in Role Permission Manager.'
  },

  {
    id: 'mission-32',
    number: 32,
    title: 'Row-Level Multi-Tenant Security via User Permissions',
    category: 'Permissions & Security',
    categoryId: 'permissions-security',
    difficulty: 'Medium',
    doctype: 'Facility Management Unit',
    language: 'python',
    xp: 120,
    coins: 50,
    question: 'A facility supervisor should see only the units in their own building. What combination of role permissions and user permissions would you use?',
    problemStatement: `A property conglomerate operates 20 distinct commercial facilities. Supervisors assigned to "Facility North" must be strictly prevented from viewing, querying, or editing assets and tenants belonging to "Facility South".`,
    architectureGuide: `Combine **Role Permissions** with **User Permissions**:
1. Ensure the 'Facility Unit' DocType has a Link field to 'Facility Building'.
2. In **Role Permission Manager**, ensure the 'Facility Supervisor' role has 'Apply User Permissions' enabled on the 'Facility Building' doctype link.
3. In Desk, create a **User Permission** record linking the supervisor's user account to their specific 'Facility Building' master record.`,
    codeSnippet: `# Programmatic creation of User Permission:
import frappe

def restrict_supervisor_to_building(user_email, building_name):
    # Verify User Permission does not already exist
    if not frappe.db.exists("User Permission", {"user": user_email, "allow": "Facility Building", "for_value": building_name}):
        user_perm = frappe.new_doc("User Permission")
        user_perm.user = user_email
        user_perm.allow = "Facility Building"
        user_perm.for_value = building_name
        # Apply strict restriction across all linked DocTypes
        user_perm.apply_to_all_doctypes = 1
        user_perm.insert(ignore_permissions=True)
        frappe.msgprint(f"User {user_email} restricted to building {building_name}")`,
    keyTakeaway: 'Enable "Apply User Permissions" on Role Permissions and assign User Permission records linking the user to their designated master entity.'
  },

  {
    id: 'mission-33',
    number: 33,
    title: 'Segregation of Duties: Restricting Self-Approval in Workflows',
    category: 'Permissions & Security',
    categoryId: 'permissions-security',
    difficulty: 'Medium',
    doctype: 'Commercial Contract',
    language: 'python',
    xp: 130,
    coins: 55,
    question: 'A trade broker must not be able to approve their own contracts. How would you enforce this with workflows and permissions?',
    problemStatement: `Corporate compliance rules mandate a strict Segregation of Duties (SoD). Even if a senior broker has the "Trade Manager" role, they must be blocked from approving any contract where they themselves are listed as the creator/owner.`,
    architectureGuide: `Enforce this rule through two complementary layers:
1. In the **Workflow Transition Action**, set transition conditions such as 'doc.owner != frappe.session.user'.
2. In the controller's 'before_workflow_action(self)' or 'validate(self)', verify that if transitioning to "Approved", 'self.owner != frappe.session.user'.`,
    codeSnippet: `import frappe
from frappe import _
from frappe.model.document import Document

class CommercialContract(Document):
    def validate(self):
        self.enforce_segregation_of_duties()

    def enforce_segregation_of_duties(self):
        # Prevent self-approval during workflow transitions
        if self.workflow_state == "Approved":
            if self.owner == frappe.session.user and not frappe.is_system_manager():
                frappe.throw(
                    _("Segregation of Duties violation: You cannot approve contract {0} because you created it.")
                    .format(self.name),
                    title=_("Approval Blocked")
                )`,
    keyTakeaway: 'Add doc.owner != frappe.session.user to workflow transition conditions and enforce in controller validate() to guarantee compliance.'
  },

  {
    id: 'mission-34',
    number: 34,
    title: 'Restricted Auditor Read-Only Role Profile',
    category: 'Permissions & Security',
    categoryId: 'permissions-security',
    difficulty: 'Easy',
    doctype: 'General Ledger Entry',
    language: 'json',
    xp: 100,
    coins: 40,
    question: 'An auditor needs to read all records but must not change any. How would you set this up without giving them a broad role?',
    problemStatement: `An external statutory auditor requires full inspection access across contracts, invoices, and ledger entries for an audit period, but must be barred from editing, creating, submitting, cancelling, or exporting documents.`,
    architectureGuide: `Create a dedicated custom role called **"Financial Auditor"**:
1. In **Role Permission Manager**, grant this role 'Read' and 'Print' permissions only across the required DocTypes.
2. Ensure 'Write', 'Create', 'Submit', 'Cancel', 'Amend', and 'Delete' checkboxes are unchecked.
3. Uncheck 'Export' permissions to comply with corporate data loss prevention policies.`,
    codeSnippet: `/* Role Permission Setup for Financial Auditor: */
{
  "role": "Financial Auditor",
  "doctype": "General Ledger Entry",
  "permissions": {
    "read": 1,
    "print": 1,
    "report": 1,
    "write": 0,
    "create": 0,
    "submit": 0,
    "cancel": 0,
    "delete": 0,
    "export": 0,
    "share": 0
  }
}`,
    keyTakeaway: 'Create a tailored "Financial Auditor" role with only Read, Print, and Report permissions enabled, unchecking Write, Submit, and Export.'
  },

  {
    id: 'mission-35',
    number: 35,
    title: 'Data Masking of Sensitive PII in Aggregated Financial Reports',
    category: 'Permissions & Security',
    categoryId: 'permissions-security',
    difficulty: 'Medium',
    doctype: 'Periodic Billing Invoice',
    language: 'python',
    xp: 120,
    coins: 50,
    question: 'The finance analytics team needs to see the total of dues, but not individual client names. How would you hide the sensitive fields?',
    problemStatement: `An operations analytics group builds cash-flow forecasts from billing datasets. Privacy regulations mandate that personally identifiable information (client full name, tax ID, phone) must be masked or omitted from analytical reports.`,
    architectureGuide: `Create a custom **Script Report**. Instead of returning individual row records, write an aggregation query using SQL 'SUM(grand_total) GROUP BY billing_cycle, region'. If row-level tracking is required, mask names using pseudonymized hashes ('SHA256(client_name)') or omit the client column based on user role.`,
    codeSnippet: `import frappe

def execute(filters=None):
    columns = [
        {"label": "Billing Cycle", "fieldname": "billing_cycle", "fieldtype": "Data", "width": 140},
        {"label": "Region", "fieldname": "region", "fieldtype": "Data", "width": 140},
        {"label": "Total Active Accounts", "fieldname": "account_count", "fieldtype": "Int", "width": 160},
        {"label": "Aggregated Outstanding Dues", "fieldname": "total_dues", "fieldtype": "Currency", "width": 200}
    ]

    # Aggregated SQL query - strictly omits client names and PII
    data = frappe.db.sql("""
        SELECT 
            billing_cycle,
            facility_region as region,
            COUNT(name) as account_count,
            SUM(grand_total - paid_amount) as total_dues
        FROM "tabPeriodic Billing Invoice"
        WHERE docstatus = 1
        GROUP BY billing_cycle, facility_region
        ORDER BY billing_cycle DESC
    """, as_dict=True)

    return columns, data`,
    keyTakeaway: 'Use custom Script Reports with SQL GROUP BY aggregations to present high-level financials without exposing underlying PII columns.'
  },

  {
    id: 'mission-36',
    number: 36,
    title: 'Diagnosing Cross-Facility Data Leakage in Multi-Plant Setups',
    category: 'Permissions & Security',
    categoryId: 'permissions-security',
    difficulty: 'Medium',
    doctype: 'Commercial Contract',
    language: 'python',
    xp: 130,
    coins: 55,
    question: 'A user reports that they can see contracts from another facility. What would you check first?',
    problemStatement: `An operations officer assigned to Plant A reports seeing draft and submitted contracts belonging to Plant B. You must systematically audit the permission hierarchy to diagnose where the restriction failed.`,
    architectureGuide: `Execute a systematic 4-step permission audit:
1. **User Permissions**: Verify that an active User Permission exists for the user on 'Plant / Facility'.
2. **Apply User Permissions Checkbox**: Open Role Permission Manager for 'Commercial Contract'; check whether 'Apply User Permissions' is actually ticked for the user's role on the 'Plant' link field.
3. **Role Inheritance**: Check if the user possesses a privileged role (e.g. 'System Manager' or 'All') that bypasses user permission restrictions.
4. **Field Configuration**: Verify the 'plant' field in the DocType schema has 'Ignore User Permissions' unticked.`,
    codeSnippet: `# Diagnostic script to execute via bench console:
import frappe

def audit_user_facility_permissions(user_email, doctype="Commercial Contract"):
    print(f"=== AUDITING PERMISSIONS FOR {user_email} ON {doctype} ===")
    
    # 1. Check assigned roles
    roles = frappe.get_roles(user_email)
    print("Assigned Roles:", roles)

    # 2. Check active user permissions
    user_perms = frappe.get_all("User Permission", filters={"user": user_email}, fields=["allow", "for_value", "applicable_for"])
    print("Active User Permissions:", user_perms)

    # 3. Check Role Permission Manager rules for these roles
    rules = frappe.get_all("Custom DocPerm", filters={"parent": doctype, "role": ["in", roles]}, fields=["role", "apply_user_permissions"])
    print("Role Rules (Apply User Perms):", rules)`,
    keyTakeaway: 'Audit User Permissions, verify "Apply User Permissions" is enabled on the role, and confirm the user lacks bypass roles like System Manager.'
  },

  // =========================================================================
  // SECTION 7: DATABASE & PERFORMANCE (Scenarios 37 - 41)
  // =========================================================================
  {
    id: 'mission-37',
    number: 37,
    title: 'High-Volume Stock Ledger Optimization at 3M+ Rows',
    category: 'Database & Performance',
    categoryId: 'database-performance',
    difficulty: 'Expert',
    doctype: 'Stock Ledger Entry',
    language: 'sql',
    xp: 160,
    coins: 70,
    question: 'The Stock Ledger table has grown to 3 million rows and the stock balance report takes minutes to load. What steps would you take?',
    problemStatement: `An enterprise manufacturing warehouse table holds 3,000,000+ Stock Ledger Entry rows. Generating historical valuation and balance reports triggers disk swaps, full table scans, and web worker timeouts.`,
    architectureGuide: `Execute a multi-stage optimization plan:
1. **Composite Database Indexing**: Add a dedicated compound index on '(item_code, warehouse, posting_date, posting_time)'.
2. **Query Refactoring**: Eliminate subqueries and 'SELECT *'; rewrite using 'frappe.qb' (PyPika QueryBuilder) selecting only required summary columns.
3. **Pre-aggregated Summary Tables**: Implement an end-of-month stock balance snapshot ledger table so reports only scan entries since the last monthly snapshot.`,
    codeSnippet: `-- 1. Add optimal composite index via database migration patch:
ALTER TABLE "tabStock Ledger Entry" 
ADD INDEX "idx_item_warehouse_posting" ("item_code", "warehouse", "posting_date", "posting_time");

-- 2. Optimized balance calculation query utilizing composite index:
SELECT 
    item_code, 
    warehouse, 
    SUM(actual_qty) as current_qty, 
    SUM(stock_value_difference) as total_value
FROM "tabStock Ledger Entry" FORCE INDEX ("idx_item_warehouse_posting")
WHERE item_code = 'RAW-MAT-001' 
  AND warehouse = 'Main Plant - WH' 
  AND posting_date <= '2026-10-01'
GROUP BY item_code, warehouse;`,
    keyTakeaway: 'Add composite indexes on (item, warehouse, date), leverage monthly snapshot tables, and eliminate SELECT * scans.'
  },

  {
    id: 'mission-38',
    number: 38,
    title: 'Zero-Downtime Safe Column Renaming on Large Production Tables',
    category: 'Database & Performance',
    categoryId: 'database-performance',
    difficulty: 'Hard',
    doctype: 'Enterprise Client Account',
    language: 'json',
    xp: 140,
    coins: 60,
    question: 'You need to rename a field on a production DocType with 20,000 existing records. How would you do it safely?',
    problemStatement: `A production database holds 20,000 enterprise client accounts. A legacy column 'registration_num' must be renamed to 'corporate_tax_id'. Simply changing the fieldname in DocType JSON will cause Frappe to drop the old column and create a blank new one, resulting in immediate data loss!`,
    architectureGuide: `Use Frappe's built-in safe renaming attribute:
1. In the DocType JSON schema, change 'fieldname' to 'corporate_tax_id'.
2. Add the attribute '"oldfieldname": "registration_num"'.
3. When 'bench migrate' runs, Frappe's schema syncer detects 'oldfieldname' and executes a safe SQL 'ALTER TABLE tab... CHANGE COLUMN' statement, preserving all 20,000 historical rows with zero data loss.`,
    codeSnippet: `/* In doctype JSON definition (e.g. enterprise_client_account.json): */
{
  "fields": [
    {
      "fieldname": "corporate_tax_id",
      "oldfieldname": "registration_num",  /* CRITICAL: Preserves historical data */
      "fieldtype": "Data",
      "label": "Corporate Tax ID",
      "reqd": 1,
      "unique": 1
    }
  ]
}

/* During 'bench migrate', Frappe executes:
   ALTER TABLE "tabEnterprise Client Account" 
   CHANGE COLUMN "registration_num" "corporate_tax_id" VARCHAR(140); */`,
    keyTakeaway: 'Always specify "oldfieldname": "old_name" in the DocType field definition before bench migrate to safely alter columns without data loss.'
  },

  {
    id: 'mission-39',
    number: 39,
    title: 'Writing Idempotent Database Migration Patches',
    category: 'Database & Performance',
    categoryId: 'database-performance',
    difficulty: 'Hard',
    doctype: 'Customer',
    language: 'python',
    xp: 140,
    coins: 60,
    question: 'A patch must split a combined "Address" field into "Street" and "City" for all existing records. How would you write and test that patch?',
    problemStatement: `A legacy app stored combined addresses as "123 Industrial Way, Metropolis". A new architecture requires distinct 'street' and 'city' columns across 15,000 records. The migration patch must be idempotent (safe to run multiple times without data corruption) and performant.`,
    architectureGuide: `Write a standard Python patch registered in 'patches.txt'. Use 'frappe.reload_doc()' to ensure new columns exist in MariaDB before migrating data. Check whether records have already been migrated to maintain idempotency. Update in chunked batches rather than calling 'doc.save()' on 15,000 rows.`,
    codeSnippet: `# 1. In patches.txt:
# my_app.patches.v2_0.split_customer_addresses

# 2. In my_app/patches/v2_0/split_customer_addresses.py:
import frappe

def execute():
    # Ensure new schema columns exist in database
    frappe.reload_doc("selling", "doctype", "customer")

    # Fetch records that haven't been split yet
    customers = frappe.db.sql("""
        SELECT name, legacy_address 
        FROM "tabCustomer" 
        WHERE (street IS NULL OR street = '') 
          AND legacy_address IS NOT NULL AND legacy_address != ''
    """, as_dict=True)

    for cust in customers:
        raw_address = cust.legacy_address.strip()
        parts = [p.strip() for p in raw_address.split(",") if p.strip()]

        street = parts[0] if parts else raw_address
        city = parts[1] if len(parts) > 1 else "Unknown"

        frappe.db.set_value("Customer", cust.name, {
            "street": street,
            "city": city
        }, update_modified=False)

    frappe.db.commit()`,
    keyTakeaway: 'Reload DocType schemas before migrating data, use SQL filters to process only unmigrated rows, and update with update_modified=False.'
  },

  {
    id: 'mission-40',
    number: 40,
    title: 'Heavy Query Result Caching & Dynamic Invalidation',
    category: 'Database & Performance',
    categoryId: 'database-performance',
    difficulty: 'Medium',
    doctype: 'Facility Maintenance Bill',
    language: 'python',
    xp: 130,
    coins: 55,
    question: 'Several operational reports run the same heavy query repeatedly. How would you cache the results and when would you invalidate them?',
    problemStatement: `Three distinct executive management reports execute an identical, expensive multi-table SQL join calculating trailing-12-month facility dues. Running this multi-second query on every page visit degrades database responsiveness.`,
    architectureGuide: `Store the JSON-serialized query results in Frappe's Redis cache using 'frappe.cache().set_value(cache_key, result, expires_in_sec=3600)'. Invalidate the cache whenever any underlying record changes by registering a hook on 'Facility Maintenance Bill' for 'on_update' and 'on_cancel'.`,
    codeSnippet: `import frappe

CACHE_KEY_DUES = "reports_t12m_dues_summary"

def get_t12m_dues_summary():
    cache = frappe.cache()
    cached = cache.get_value(CACHE_KEY_DUES)
    if cached:
        return cached

    # Expensive heavy query
    data = frappe.db.sql("""
        SELECT 
            b.facility_region,
            SUM(b.grand_total) as billed,
            SUM(b.paid_amount) as collected,
            SUM(b.grand_total - b.paid_amount) as outstanding
        FROM "tabFacility Maintenance Bill" b
        WHERE b.posting_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
          AND b.docstatus = 1
        GROUP BY b.facility_region
    """, as_dict=True)

    # Cache for 1 hour
    cache.set_value(CACHE_KEY_DUES, data, expires_in_sec=3600)
    return data

# Invalidation Hook (in hooks.py doc_events on_update / on_cancel):
def clear_dues_report_cache(doc, method):
    frappe.cache().delete_value(CACHE_KEY_DUES)`,
    keyTakeaway: 'Cache expensive query outputs in Redis with TTLs, and invalidate cache keys immediately via on_update / on_cancel document hooks.'
  },

  {
    id: 'mission-41',
    number: 41,
    title: 'Audited Corrections on Submitted Invoices vs Direct SQL Updates',
    category: 'Database & Performance',
    categoryId: 'database-performance',
    difficulty: 'Hard',
    doctype: 'Sales Invoice',
    language: 'python',
    xp: 140,
    coins: 60,
    question: 'A one-time fix is needed to correct wrong tax amounts on submitted invoices. Why is directly editing the database risky here, and what safer approach would you use?',
    problemStatement: `Due to a misconfigured tax template, 50 submitted sales invoices were posted with an incorrect 5% tax instead of 18%. A junior developer suggests running 'UPDATE tabSales Invoice SET tax_amount = ...' directly in MariaDB. Why is this dangerous, and how do you resolve it properly?`,
    architectureGuide: `Direct SQL updates on submitted DocTypes break ERP accounting integrity:
1. **Broken Double-Entry Ledgers**: Invoices post immutable General Ledger Entries (GLE). Modifying the invoice table leaves GL debits/credits unbalanced.
2. **Audit Trail Destruction**: Direct SQL bypasses Frappe's version history, audit logs, and electronic signature logs.
3. **Safe Resolution**: Cancel and Amend the invoice, or post an adjusting **Credit Note / Journal Entry** to debit/credit the difference transparently.`,
    codeSnippet: `import frappe
from frappe.utils import flt

def correct_tax_via_adjusting_journal_entry(invoice_name, tax_difference):
    inv = frappe.get_doc("Sales Invoice", invoice_name)
    if inv.docstatus != 1:
        return

    # Create an audited adjusting Journal Entry rather than corrupting DB with direct SQL
    je = frappe.new_doc("Journal Entry")
    je.voucher_type = "Journal Entry"
    je.posting_date = frappe.utils.today()
    je.user_remark = f"Audited tax adjustment for submitted invoice {invoice_name}"

    je.append("accounts", {
        "account": inv.debit_to,
        "party_type": "Customer",
        "party": inv.customer,
        "debit_in_account_currency": flt(tax_difference),
        "credit_in_account_currency": 0
    })
    je.append("accounts", {
        "account": "Tax Duties and Recoveries - WH",
        "debit_in_account_currency": 0,
        "credit_in_account_currency": flt(tax_difference)
    })

    je.insert()
    je.submit()
    frappe.msgprint(f"Audited Journal Entry {je.name} posted to correct invoice {invoice_name}")`,
    keyTakeaway: 'Never run raw UPDATE queries on submitted documents; preserve double-entry audit trails via Credit Notes or adjusting Journal Entries.'
  },

  // =========================================================================
  // SECTION 8: WORKFLOWS, REPORTS & PRINTING (Scenarios 42 - 45)
  // =========================================================================
  {
    id: 'mission-42',
    number: 42,
    title: 'Multi-Tier Conditional Approval Workflow Configuration',
    category: 'Workflows, Reports & Printing',
    categoryId: 'workflows-reporting',
    difficulty: 'Medium',
    doctype: 'Forward Trade Contract',
    language: 'json',
    xp: 130,
    coins: 55,
    question: 'A contract needs approval first from the manager, then from the finance head, and the amount decides whether the second approval is required. How would you model this in a workflow?',
    problemStatement: `Commercial trade contracts require tiered authorization:
- Contracts under $50,000 only need Manager Approval.
- Contracts $50,000 and above must be approved by the Manager AND then escalated to the Chief Financial Officer (CFO).`,
    architectureGuide: `Model this using Frappe's **Workflow States** and **Workflow Transitions**:
1. States: 'Draft', 'Pending Manager Approval', 'Pending CFO Approval', 'Approved'.
2. Transitions:
   - From 'Pending Manager Approval' to 'Approved' with condition 'doc.grand_total < 50000'.
   - From 'Pending Manager Approval' to 'Pending CFO Approval' with condition 'doc.grand_total >= 50000'.
   - From 'Pending CFO Approval' to 'Approved' allowed only for role 'CFO'.`,
    codeSnippet: `/* Workflow Transition Definition in Frappe Workflow: */
[
  {
    "state": "Pending Manager Approval",
    "action": "Approve",
    "next_state": "Approved",
    "allowed": "Commercial Manager",
    "condition": "doc.grand_total < 50000"
  },
  {
    "state": "Pending Manager Approval",
    "action": "Approve",
    "next_state": "Pending CFO Approval",
    "allowed": "Commercial Manager",
    "condition": "doc.grand_total >= 50000"
  },
  {
    "state": "Pending CFO Approval",
    "action": "Finalize Approval",
    "next_state": "Approved",
    "allowed": "Chief Financial Officer",
    "condition": ""
  }
]`,
    keyTakeaway: 'Use Workflow Transition conditions (doc.grand_total >= 50000) to branch approval paths based on financial thresholds.'
  },

  {
    id: 'mission-43',
    number: 43,
    title: 'Script Report vs Query Report for Dynamic Manufacturing Yields',
    category: 'Workflows, Reports & Printing',
    categoryId: 'workflows-reporting',
    difficulty: 'Medium',
    doctype: 'Manufacturing Batch Lot',
    language: 'python',
    xp: 130,
    coins: 55,
    question: 'The management wants a report showing each production lot\'s yield percentage, grouped by supplier, with a date filter. Which report type would you choose and why?',
    problemStatement: `Plant management requires an interactive report displaying input vs output material quantities, calculating yield percentages, grouping dynamically by supplier grade, and rendering visual performance charts.`,
    architectureGuide: `Choose a **Script Report** (Python + JS) over a standard Query Report (pure SQL):
- **Why**: Script Reports allow programmatic data transformation, conditional formatting (color-coding low yields in red), multi-level grouping logic, and custom Frappe Charts integration that standard SQL Query Reports cannot achieve.`,
    codeSnippet: `# In manufacturing_yield_report.py:
import frappe
from frappe.utils import flt

def execute(filters=None):
    columns = [
        {"label": "Supplier", "fieldname": "supplier", "fieldtype": "Link", "options": "Supplier", "width": 160},
        {"label": "Lot Number", "fieldname": "lot_no", "fieldtype": "Data", "width": 140},
        {"label": "Input Raw (MT)", "fieldname": "input_qty", "fieldtype": "Float", "width": 120},
        {"label": "Output Yield (MT)", "fieldname": "output_qty", "fieldtype": "Float", "width": 120},
        {"label": "Yield %", "fieldname": "yield_pct", "fieldtype": "Percent", "width": 100}
    ]

    query_filters = {}
    if filters.get("from_date") and filters.get("to_date"):
        query_filters["posting_date"] = ["between", [filters.from_date, filters.to_date]]

    lots = frappe.get_all("Manufacturing Batch Lot", filters=query_filters, fields=["supplier", "lot_no", "input_qty", "output_qty"])

    data = []
    for lot in lots:
        input_mt = flt(lot.input_qty)
        output_mt = flt(lot.output_qty)
        yield_pct = flt((output_mt / input_mt) * 100, 2) if input_mt > 0 else 0.0

        data.append({
            "supplier": lot.supplier,
            "lot_no": lot.lot_no,
            "input_qty": input_mt,
            "output_qty": output_mt,
            "yield_pct": yield_pct
        })

    # Optional: Build visual chart for Desk
    chart = {
        "data": {
            "labels": [d["lot_no"] for d in data[:10]],
            "datasets": [{"name": "Yield %", "values": [d["yield_pct"] for d in data[:10]]}]
        },
        "type": "bar"
    }

    return columns, data, None, chart`,
    keyTakeaway: 'Choose Script Reports whenever dynamic business calculations, chart rendering, or multi-field transformations are required.'
  },

  {
    id: 'mission-44',
    number: 44,
    title: 'Dynamic Jinja Print Format with Payment QR Code Generation',
    category: 'Workflows, Reports & Printing',
    categoryId: 'workflows-reporting',
    difficulty: 'Medium',
    doctype: 'Facility Maintenance Bill',
    language: 'jinja',
    xp: 130,
    coins: 55,
    question: 'The bill print format must show the client\'s name, unit number, dues breakdown, and a dynamic QR code for payment. How would you build it?',
    problemStatement: `A property billing print format must render a professional invoice layout in Desk and PDF output, including tenant details, line-item charge breakdowns, and a scannable digital payment QR code embedded directly into the document.`,
    architectureGuide: `Build a **Custom Print Format** using HTML and **Jinja2**:
1. Iterate over billing line items using '{% for item in doc.items %}'.
2. Use Jinja filters such as '{{ doc.due_date | format_date }}' and '{{ doc.grand_total | format_currency(doc.currency) }}'.
3. Generate payment QR codes using Frappe's built-in QR generator or an inline SVG data URI computed in a server method.`,
    codeSnippet: `<!-- Custom Jinja Print Format HTML -->
<div class="print-format-container">
    <div class="header">
        <h2>FACILITY MAINTENANCE INVOICE</h2>
        <p><strong>Invoice No:</strong> {{ doc.name }}</p>
        <p><strong>Date:</strong> {{ doc.posting_date | format_date }}</p>
    </div>

    <div class="client-info">
        <p><strong>Client Name:</strong> {{ doc.client_name }}</p>
        <p><strong>Commercial Unit:</strong> {{ doc.unit_number }}</p>
        <p><strong>Payment Due:</strong> {{ doc.due_date | format_date }}</p>
    </div>

    <table class="table table-bordered">
        <thead>
            <tr>
                <th>Charge Description</th>
                <th class="text-right">Amount ({{ doc.currency }})</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Monthly Base Facility Charge</td>
                <td class="text-right">{{ doc.base_rent_amount | format_currency(doc.currency) }}</td>
            </tr>
            {% if doc.late_fee %}
            <tr>
                <td>Late Payment Surcharge</td>
                <td class="text-right">{{ doc.late_fee | format_currency(doc.currency) }}</td>
            </tr>
            {% endif %}
            <tr class="font-weight-bold">
                <td>Total Balance Payable</td>
                <td class="text-right">{{ doc.grand_total | format_currency(doc.currency) }}</td>
            </tr>
        </tbody>
    </table>

    <div class="payment-qr text-center">
        <p>Scan to Pay Instantly:</p>
        <!-- Generate QR code via server method or payment URL -->
        <img src="/api/method/billing_app.api.generate_payment_qr?docname={{ doc.name }}" alt="Payment QR" style="width: 140px; height: 140px;" />
    </div>
</div>`,
    keyTakeaway: 'Use Jinja filters (format_date, format_currency) and integrate dynamic QR code endpoints inside custom print formats.'
  },

  {
    id: 'mission-45',
    number: 45,
    title: 'Multi-Lingual Transaction Print Formats with Translation Wrappers',
    category: 'Workflows, Reports & Printing',
    categoryId: 'workflows-reporting',
    difficulty: 'Medium',
    doctype: 'Material Dispatch Note',
    language: 'jinja',
    xp: 120,
    coins: 50,
    question: 'A transport dispatch document must be printed in both English and a regional language. How would you configure this?',
    problemStatement: `An industrial logistics hub dispatches freight across multilingual jurisdictions. The printed dispatch gate pass must render labels in English and the regional language of the destination terminal based on the driver's profile or document language setting.`,
    architectureGuide: `Use Frappe's internationalization tags:
1. Wrap all text labels inside Jinja translation tags: '{{ _("Dispatch Note") }}' or specify the target language: '{{ _("Dispatch Note", lang=doc.print_language) }}'.
2. Provide translations in your custom app's 'translations/' CSV files (e.g. 'mr.csv', 'hi.csv', 'de.csv').
3. Desk automatically switches dictionary lookups based on 'doc.language' or user locale.`,
    codeSnippet: `<!-- Multilingual Jinja Template -->
<div class="dispatch-challan">
    <div class="title-block">
        <!-- Renders in English or selected language dynamically -->
        <h2>{{ _("Material Dispatch Note", lang=doc.language) }}</h2>
        <span class="badge">{{ _("Official Gate Pass", lang=doc.language) }}</span>
    </div>

    <div class="row">
        <div class="col-xs-6">
            <p><strong>{{ _("Vehicle Number", lang=doc.language) }}:</strong> {{ doc.vehicle_plate }}</p>
            <p><strong>{{ _("Driver Name", lang=doc.language) }}:</strong> {{ doc.driver_name }}</p>
        </div>
        <div class="col-xs-6">
            <p><strong>{{ _("Gross Weight", lang=doc.language) }}:</strong> {{ doc.gross_weight }} MT</p>
            <p><strong>{{ _("Tare Weight", lang=doc.language) }}:</strong> {{ doc.tare_weight }} MT</p>
            <p><strong>{{ _("Net Weight", lang=doc.language) }}:</strong> {{ doc.net_weight }} MT</p>
        </div>
    </div>
</div>`,
    keyTakeaway: 'Wrap all text in {{ _("Text", lang=doc.language) }} in Jinja and maintain translation CSV files in your custom app directory.'
  },

  // =========================================================================
  // SECTION 9: DEBUGGING, TESTING & DEPLOYMENT (Scenarios 46 - 50)
  // =========================================================================
  {
    id: 'mission-46',
    number: 46,
    title: 'Root-Cause Analysis of Opaque Server 500 Exceptions',
    category: 'Debugging, Testing & DevOps',
    categoryId: 'debugging-deployment',
    difficulty: 'Medium',
    doctype: 'Commercial Contract',
    language: 'python',
    xp: 120,
    coins: 50,
    question: 'A user says saving a contract gives "Something went wrong" with no clear message. What steps would you take to find the cause?',
    problemStatement: `A trader clicks Save on a high-value contract and encounters a generic red pop-up dialog stating "Something went wrong". The user cannot see the underlying exception. How do you systematically trace and isolate the root cause?`,
    architectureGuide: `Execute a systematic 4-tier diagnostic routine:
1. **Browser Network Tab**: Inspect the HTTP 500 POST response payload for 'exc_type' and server response JSON.
2. **Error Log DocType**: Open **Error Log List** in Desk to view full Python tracebacks captured by Frappe.
3. **Bench Log Files**: Tail server logs on the CLI: 'tail -f ~/frappe-bench/logs/frappe.log' and 'web.error.log'.
4. **Interactive Debugger**: Reproduce locally in 'bench console' or attach Python breakpoints ('breakpoint()') inside the controller 'validate()' method.`,
    codeSnippet: `# Terminal Commands for Debugging:

# 1. View live server web error logs:
bench --site my-site.local watch
tail -n 100 -f logs/web.error.log

# 2. Inspect latest Error Log entry via bench console:
bench --site my-site.local console
>>> latest_err = frappe.get_last_doc("Error Log")
>>> print("METHOD:", latest_err.method)
>>> print("TRACEBACK:\n", latest_err.error)

# 3. Simulate document validation directly in Python:
>>> doc = frappe.get_doc("Commercial Contract", "CNT-2026-001")
>>> doc.validate()`,
    keyTakeaway: 'Check Browser Network response, Desk Error Log list, and logs/web.error.log to inspect full Python stack traces.'
  },

  {
    id: 'mission-47',
    number: 47,
    title: 'Resolving Development vs Production Environment Discrepancies',
    category: 'Debugging, Testing & DevOps',
    categoryId: 'debugging-deployment',
    difficulty: 'Medium',
    doctype: 'Quality Inspection',
    language: 'python',
    xp: 120,
    coins: 50,
    question: 'A validation works on your development site but not on production. What would you check first?',
    problemStatement: `A critical quality validation rule triggers properly on your local developer machine, but when tested on the staging/production server, invalid documents save without raising errors.`,
    architectureGuide: `Check common deployment and caching synchronization gaps:
1. **Git Commit & Deployment**: Ensure the latest code branch was pulled to the server.
2. **Compiled Asset & Python Bytecode Cache**: Run 'bench build' to compile JS bundles, and restart workers via 'bench restart'.
3. **Redis App Cache**: Clear stale in-memory cached DocType definitions via 'bench --site <site> clear-cache'.
4. **Database Schema Sync**: Verify 'bench --site <site> migrate' was executed so custom fields and DocType schemas match dev.`,
    codeSnippet: `# Complete Production Refresh Routine:

# 1. Pull latest code
git pull origin main

# 2. Sync database schema, fixtures, and patches
bench --site production.local migrate

# 3. Clear Redis schema and cache keys
bench --site production.local clear-cache

# 4. Rebuild client scripts and frontend bundles
bench build

# 5. Restart supervisor worker and web processes
bench restart`,
    keyTakeaway: 'Run bench migrate, clear-cache, build, and bench restart to eliminate cache stale state between dev and production.'
  },

  {
    id: 'mission-48',
    number: 48,
    title: 'Automated Unit Testing for Time-Sensitive Calculations',
    category: 'Debugging, Testing & DevOps',
    categoryId: 'debugging-deployment',
    difficulty: 'Hard',
    doctype: 'Property Lease Bill',
    language: 'python',
    xp: 140,
    coins: 60,
    question: 'You need to write automated tests that confirm a lease bill\'s late fee is calculated correctly for a 45-day delay. How would you structure the test?',
    problemStatement: `CI/CD pipelines require automated test coverage for the penalty fee engine. The test must verify that an invoice overdue by exactly 45 days accurately calculates a 2% monthly late surcharge without waiting for real calendar time.`,
    architectureGuide: `Inherit from 'frappe.tests.utils.FrappeTestCase'. In the test method:
1. Create a mock invoice document with 'due_date' backdated using 'frappe.utils.add_days(today(), -45)'.
2. Invoke 'doc.validate()'.
3. Assert the expected late fee and total using 'self.assertEqual(doc.late_fee, expected_amount)'.
4. Tests automatically rollback after execution to leave the test database pristine.`,
    codeSnippet: `import frappe
from frappe.tests.utils import FrappeTestCase
from frappe.utils import today, add_days, flt

class TestPropertyLeaseBill(FrappeTestCase):
    def test_late_fee_calculation_45_days_overdue(self):
        # 1. Arrange: Create test bill with 45-day past due date
        bill = frappe.new_doc("Property Lease Bill")
        bill.base_rent_amount = 1000.00
        bill.due_date = add_days(today(), -45)  # Exactly 45 days overdue (1 month bracket)
        
        # 2. Act: Execute controller calculation
        bill.validate()

        # 3. Assert: 1 month of 2% on $1000 = $20.00 late fee
        expected_late_fee = 20.00
        self.assertEqual(flt(bill.late_fee, 2), expected_late_fee)
        self.assertEqual(flt(bill.grand_total, 2), 1020.00)
        self.assertEqual(bill.is_overdue, 1)

    def tearDown(self):
        # Database changes inside FrappeTestCase automatically rollback
        pass`,
    keyTakeaway: 'Use FrappeTestCase with add_days(today(), -45) to test time-sensitive business logic deterministically in CI test suites.'
  },

  {
    id: 'mission-49',
    number: 49,
    title: 'Mitigating Breaking Mandatory Schema Changes in Production',
    category: 'Debugging, Testing & DevOps',
    categoryId: 'debugging-deployment',
    difficulty: 'Hard',
    doctype: 'Commercial Contract',
    language: 'python',
    xp: 140,
    coins: 60,
    question: 'A deployment added a new required field and broke existing contract records. How would you have prevented this, and how would you recover now?',
    problemStatement: `A recent release added a new mandatory field ('tax_exemption_code', 'reqd=1') without a default value. Consequently, automated background jobs, API integrations, and updates to historical records crashed with MandatoryError.`,
    architectureGuide: `Preventative & Remediation Protocol:
1. **Prevention**: Never introduce a mandatory field without specifying a default value or running a pre-migration patch to populate legacy rows.
2. **Emergency Recovery**: Deploy a hotfix patch that updates existing rows with a sensible fallback ('tax_exemption_code = "STANDARD"').
3. **Phased Rollout**: Introduce fields as optional ('reqd=0') first, backfill data, and only enforce mandatory rules once data consistency is verified.`,
    codeSnippet: `# Emergency Remediation Patch in patches/v1_2/fix_mandatory_tax_code.py:
import frappe

def execute():
    # 1. Backfill default value across all existing historical rows in SQL directly
    frappe.db.sql("""
        UPDATE "tabCommercial Contract"
        SET tax_exemption_code = 'NOT_APPLICABLE'
        WHERE tax_exemption_code IS NULL OR tax_exemption_code = ''
    """)

    # 2. Safe reload of updated schema with default value configured
    frappe.reload_doc("trade_app", "doctype", "commercial_contract")
    frappe.db.commit()`,
    keyTakeaway: 'Never deploy reqd=1 fields without default values; backfill historical rows via migration patches before toggling mandatory enforcement.'
  },

  {
    id: 'mission-50',
    number: 50,
    title: 'Full-Lifecycle Production Release Pipeline & Rollback Strategy',
    category: 'Debugging, Testing & DevOps',
    categoryId: 'debugging-deployment',
    difficulty: 'Expert',
    doctype: 'Quality Inspection',
    language: 'python',
    xp: 160,
    coins: 70,
    question: 'Describe how you would take a major feature release from development to production, including testing, backup, and rollback procedures.',
    problemStatement: `An engineering team is deploying a major core feature update affecting financial contracts, inventory movement, and quality control to a live enterprise production instance. Outline the complete release protocol.`,
    architectureGuide: `Execute a rigorous 6-phase deployment protocol:
1. **CI/Staging Verification**: Pass automated tests ('bench run-tests') and complete staging smoke tests.
2. **Maintenance Window**: Announce downtime; enable maintenance mode via 'bench --site <site> set-maintenance-mode on'.
3. **Immutable Backup**: Create an immediate SQL snapshot and file backup via 'bench --site <site> backup --with-files'.
4. **Deploy & Migrate**: Pull code, execute 'bench --site <site> migrate', and run 'bench build'.
5. **Sanity Verification & Re-open**: Disable maintenance mode ('set-maintenance-mode off') and conduct critical path smoke testing.
6. **Rollback Plan**: If critical errors occur, restore the database backup via 'bench --site <site> restore <backup_file>'.`,
    codeSnippet: `# Production Deployment Execution Runbook:

# Step 1: Pre-deployment snapshot & maintenance mode
bench --site prod.enterprise.com set-maintenance-mode on
bench --site prod.enterprise.com backup --with-files

# Step 2: Code deployment
cd /home/frappe/frappe-bench/apps/enterprise_app
git pull origin release/v2.4.0

# Step 3: Schema migration & asset compilation
cd /home/frappe/frappe-bench
bench --site prod.enterprise.com migrate
bench build
bench restart

# Step 4: Verification & disable maintenance mode
bench --site prod.enterprise.com set-maintenance-mode off

# Step 5: Rollback Command (in case of catastrophic deployment failure)
# bench --site prod.enterprise.com restore /path/to/backup.sql.gz --with-public-files /path/to/files.tar`,
    keyTakeaway: 'Follow a strict runbook: backup with files, toggle maintenance mode, bench migrate, build, restart, and maintain tested restore scripts.'
  }
];

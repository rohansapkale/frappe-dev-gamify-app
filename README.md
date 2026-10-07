# FrappeQuest: The Gamified ERPNext & Frappe Developer RPG ⚡🎮

**FrappeQuest** is an interactive, gamified developer training web application built to help developers master the **Frappe Framework & ERPNext** development ecosystem through hands-on missions, real-time code evaluation, a simulated Frappe Desk, daily bug hunts, and an RPG progression system.

---

## 🌟 Key Features

### 1. 🎯 Core Mastery Quest Tracks
- **Track 0: Technical Interview Mastery**
  - Dynamic link field filtering, GL balancing guards, and security validation.
- **Track 1: Client Scripting & Desk UI Magic**
  - Custom Buttons & Dropdown Groups (`frm.add_custom_button('VIP Priority', fn, 'Actions')`)
  - Dynamic Field Rules (`frm.set_df_property`, `frm.toggle_reqd`, `frm.toggle_display`)
  - Child Table Calculations (`frappe.ui.form.on('DocType Item')`, row computation, and total aggregation)
- **Track 2: Server-Side Python & DocType Lifecycle**
  - Python Controller validation hooks (`validate(self)`, `before_save(self)`, `frappe.throw()`)
  - High-performance Frappe ORM (`frappe.db.get_value(as_dict=True)`, `frappe.db.set_value`)
- **Track 3: ERPNext Business Workflows**
  - Conversion pipelines, `frappe.prompt` interactive dialogs, and RPC bridges (`frappe.call`)
- **Track 4: REST API & Background Queues**
  - Resource filters, URL query formatting, and `frappe.enqueue`
- **Track 5: Print Formats & Reports**
  - Jinja2 template engineering, `frappe.format_value` currency helpers, and conditional layout rendering
- **Track 6: Frappe CRM Workflow Automations (New! ⚡)**
  - Built from official docs (`docs.frappe.io/crm/automations/introduction`):
  - Welcome new website leads with 2-day wait follow-ups
  - Prospect reply detection with Wait for Event & Hot lead scoring
  - Deal Won pipeline creating linked ToDos and triggering external billing webhooks
  - Automated Lead-to-Deal conversion and territory sales rep routing
  - Test Run sandboxing with verified zero-mutation rollback


---

### 2. 🖥️ Live Virtual Frappe Desk & Execution Engine
- **Authentic Frappe Desk Form View**: Real-time rendering of document status, breadcrumbs, action buttons, dynamic custom buttons, field requirement indicators (`reqd = 1`), and child tables.
- **Interactive Button Triggering**: When you register a custom button via `frm.add_custom_button`, it appears live in the Desk header. Clicking it executes the real callback, updating form fields and firing toast alerts!
- **Terminal Console**: Color-coded trace logs for `[FRAPPE API]`, `[SUCCESS]`, `[ERROR]`, plus assertion test results and a live JSON inspector for `frm.doc`.

---

### 3. ⚡ Visual Frappe CRM Workflow Automations Studio
- **Interactive Canvas**: Visual nodes for Triggers, Filters, Wait Blocks, If/Else branching, and CRM Actions.
- **Test Run Sandbox Simulation**: Experience Frappe CRM's dry-run engine:
  - Step-by-step canvas execution indicators (Success, Simulated, Skipped)
  - Simulated Wait intervals without delaying developers
  - Event Arrived vs Timed Out branch toggles for `Wait for event` blocks
  - Complete post-execution rollback guaranteeing zero database mutations and zero live webhook transmissions.
- **Declarative Schema Inspector**: Real-time JSON/schema synchronization.

---

### 4. 🧪 Freeform Desk Sandbox

- Experiment with any DocType (`Sales Order`, `Customer`, `Quotation`).
- Load pre-configured templates (Custom Action Buttons, Dynamic Field Rules, Prompt Modals, Dashboard Headlines).
- Write custom scripts and watch the virtual Frappe Desk react instantly.

---

### 4. 🐛 Daily Frappe Bug Hunt & Quiz Mode
- Test your instincts against real-world debugging traps:
  - Missing `@frappe.whitelist()` decorator causing 403 errors
  - Un-rendered child tables missing `frm.refresh_field('items')`
  - `validate()` vs `before_save()` lifecycle differences
  - `frappe.db.get_value` performance optimizations
  - `hooks.py` `doc_events` mapping
  - `frappe.enqueue()` asynchronous background workers

---

### 5. 📚 Frappe & ERPNext API Pulse & Cheatsheets
- Fast, searchable documentation cards across Client API (`frm.*`, `frappe.*`), Server Controller methods, Database APIs, and Hooks.
- One-click **"Copy Code"** and **"Try in Sandbox"** buttons.

---

### 6. 🏆 RPG Progression & Gamification
- **Developer Rank Ladder**: From *Desk Newbie* (Lvl 1) ➔ *Script Apprentice* (Lvl 2) ➔ *DocType Crafter* (Lvl 3) ➔ *Hook Alchemist* (Lvl 4) ➔ *ERPNext Architect* (Lvl 5) ➔ *Frappe Grandmaster* (Lvl 6).
- **Badges Vault**: Unlock achievements like *Button Smith*, *ORM Whisperer*, *Validation Sentinel*, *Bug Hunter*, and *Desk Hacker*.
- **5-Tier Visual Skill Tree**: Unlock node proficiencies and earn XP rewards.
- **Synthesized Web Audio SFX**: Audio feedback for clicks, success chimes, coin collects, and level-up fanfares.
- **Celebratory Confetti**: High-energy particle bursts on quest victories and rank promotions.

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev

# Open in browser
http://localhost:5173/
```

---



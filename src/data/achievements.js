// Badges, Developer Ranks & Achievements

export const DEVELOPER_RANKS = [
  { level: 1, title: 'Desk Newbie', minXp: 0, icon: '🌱', badge: 'Initiate' },
  { level: 2, title: 'Script Apprentice', minXp: 200, icon: '⚡', badge: 'Apprentice' },
  { level: 3, title: 'DocType Crafter', minXp: 500, icon: '🛠️', badge: 'Journeyman' },
  { level: 4, title: 'Hook Alchemist', minXp: 900, icon: '🔮', badge: 'Expert' },
  { level: 5, title: 'ERPNext Architect', minXp: 1400, icon: '🏛️', badge: 'Master' },
  { level: 6, title: 'Frappe Grandmaster', minXp: 2000, icon: '👑', badge: 'Grandmaster' },
];

export const BADGES = [
  {
    id: 'first_quest',
    name: 'First Deployment',
    description: 'Complete your first Frappe Quest successfully.',
    icon: '🚀',
    category: 'Milestone'
  },
  {
    id: 'button_smith',
    name: 'Button Smith',
    description: 'Master custom action buttons and dropdown groups on Frappe Desk.',
    icon: '🔘',
    category: 'Client UI'
  },
  {
    id: 'orm_whisperer',
    name: 'ORM Whisperer',
    description: 'Master frappe.get_doc, db.get_value, and database updates without errors.',
    icon: '⚡',
    category: 'Server'
  },
  {
    id: 'validation_sentinel',
    name: 'Validation Sentinel',
    description: 'Enforce business rule invariants with frappe.throw and validate hooks.',
    icon: '🛡️',
    category: 'Security'
  },
  {
    id: 'quiz_master',
    name: 'Bug Hunter',
    description: 'Score 100% on 3 Daily Frappe quizzes.',
    icon: '🎯',
    category: 'Knowledge'
  },
  {
    id: 'sandbox_explorer',
    name: 'Desk Hacker',
    description: 'Run 5 experimental scripts in Freeform Sandbox mode.',
    icon: '🧪',
    category: 'Exploration'
  },
  {
    id: 'streak_flame',
    name: 'Consistency Flame',
    description: 'Maintain a 3+ day streak in Frappe learning missions.',
    icon: '🔥',
    category: 'Streak'
  },
  {
    id: 'automation_architect',
    name: 'Automation Architect',
    description: 'Build and validate a Frappe CRM Workflow Automation with branching conditions and simulated rollback.',
    icon: '⚡',
    category: 'CRM Workflow'
  },
  {
    id: 'lead_flow_master',
    name: 'Flow Master',
    description: 'Configure event-driven lead scoring and automated pipeline transitions in Frappe CRM.',
    icon: '🔀',
    category: 'CRM Workflow'
  }
];

export const SKILL_TREE = [

  {
    id: 'node-client-basics',
    title: 'Client Scripting Basics',
    description: 'frappe.ui.form.on, refresh, onload, and basic form lifecycle.',
    icon: 'Code2',
    tier: 1,
    unlockedBy: null,
    xpReward: 100,
    tags: ['JS', 'Desk']
  },
  {
    id: 'node-custom-buttons',
    title: 'Custom Action Buttons',
    description: 'frm.add_custom_button, button groups, modal prompts, and user alerts.',
    icon: 'Layers',
    tier: 2,
    unlockedBy: 'node-client-basics',
    xpReward: 150,
    tags: ['UI', 'Buttons']
  },
  {
    id: 'node-dynamic-fields',
    title: 'Dynamic Field Modifiers',
    description: 'frm.set_df_property, reqd, hidden, read_only, and frm.set_query link filters.',
    icon: 'Sliders',
    tier: 2,
    unlockedBy: 'node-client-basics',
    xpReward: 150,
    tags: ['Fields', 'Validation']
  },
  {
    id: 'node-child-tables',
    title: 'Child Table Mastery',
    description: 'Grid row calculations, locals manipulation, frappe.model.set_value, and totals sync.',
    icon: 'Table',
    tier: 3,
    unlockedBy: 'node-dynamic-fields',
    xpReward: 200,
    tags: ['Grids', 'Data']
  },
  {
    id: 'node-crm-automations',
    title: 'CRM Workflow Automations Architect',
    description: 'Design visual event-driven flows with Triggers, Wait blocks, If/Else branching, Lead Scoring, and safe test-runs.',
    icon: 'Zap',
    tier: 3,
    unlockedBy: 'node-dynamic-fields',
    xpReward: 250,
    tags: ['CRM', 'Automations', 'Workflow']
  },
  {
    id: 'node-server-controllers',
    title: 'DocType Controllers & Hooks',
    description: 'Python Document class, validate, before_save, on_submit, and error handling.',
    icon: 'Server',
    tier: 2,
    unlockedBy: 'node-client-basics',
    xpReward: 200,
    tags: ['Python', 'Controllers']
  },

  {
    id: 'node-db-queries',
    title: 'High Performance Database API',
    description: 'frappe.db.get_value, frappe.db.set_value, frappe.db.sql, and query builders.',
    icon: 'Database',
    tier: 3,
    unlockedBy: 'node-server-controllers',
    xpReward: 250,
    tags: ['Database', 'ORM']
  },
  {
    id: 'node-api-background',
    title: 'REST API & Workers',
    description: 'Whitelisted RPC endpoints, REST queries, and Redis background queues with frappe.enqueue.',
    icon: 'Cpu',
    tier: 4,
    unlockedBy: 'node-db-queries',
    xpReward: 300,
    tags: ['API', 'Redis']
  },
  {
    id: 'node-frappe-architect',
    title: 'Frappe Grand Architect',
    description: 'Complete custom ERPNext app architecture, patches, hooks.py, and automated workflows.',
    icon: 'Crown',
    tier: 5,
    unlockedBy: 'node-api-background',
    xpReward: 500,
    tags: ['Mastery', 'Architecture']
  }
];

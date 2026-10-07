// Dr. Frappe: Autonomous Interactive AI Mentor, Developer IQ Engine & Journey Tracker

import { QUESTS } from '../data/quests.js';
import { sounds } from './soundEffects.js';

const STORAGE_PREFIX = 'frappequest_agent_brain_';

export const AGENT_MOODS = {
  IDLE: 'idle',
  THINKING: 'thinking',
  EXCITED: 'excited',
  COACHING: 'coaching',
  WARNING: 'warning',
  PROUD: 'proud'
};

export const IQ_LEVEL_TITLES = [
  { min: 0, max: 95, title: 'Desk Trainee', badge: '🌱', description: 'Grasping basic DocType schemas and field definitions.' },
  { min: 96, max: 110, title: 'Junior Client Scripter', badge: '⚡', description: 'Writing form refresh hooks and basic UI field controls.' },
  { min: 111, max: 125, title: 'DocType Engineer', badge: '🔧', description: 'Proficient in child tables, server events, and docstatus flows.' },
  { min: 126, max: 140, title: 'Senior Frappe Specialist', badge: '🚀', description: 'Excels at dynamic query filters, ORM efficiency, and validation guards.' },
  { min: 141, max: 155, title: 'ERPNext Lead Architect', badge: '🧠', description: 'Designs bulletproof business transactions, ledgers, and background jobs.' },
  { min: 156, max: 200, title: 'Frappe Core Guru', badge: '👑', description: 'Master-level contributor; understands Frappe internals deeply.' }
];

export class AgentBrainService {
  constructor() {
    this.currentUser = null;
    this.state = null;
    this.listeners = new Set();
  }

  // Subscribe to brain state changes for reactive UI updates
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify() {
    this.listeners.forEach(cb => cb(this.getState()));
  }

  init(user) {
    this.currentUser = user;
    const key = `${STORAGE_PREFIX}${user?.id || 'guest'}`;
    let saved = null;
    try {
      const raw = localStorage.getItem(key);
      if (raw) saved = JSON.parse(raw);
    } catch (e) {
      console.error('Agent brain storage read error:', e);
    }

    if (!saved) {
      // Initialize fresh brain profile
      const completedCount = user?.completedQuests?.length || 0;
      const initialIq = Math.min(160, 105 + (completedCount * 3));
      
      saved = {
        agentName: 'Dr. Frappe',
        agentRole: 'AI Architect & Career Mentor',
        currentMood: AGENT_MOODS.IDLE,
        speech: `Hello ${user?.name || 'Developer'}! I'm Dr. Frappe, your interactive AI mentor. I'll trace your journey, compute your Frappe Developer IQ, and guide you through complex problems step-by-step!`,
        speechHistory: [],
        iq: initialIq,
        iqBreakdown: {
          clientScripting: Math.min(95, 60 + completedCount * 4),
          serverPython: Math.min(90, 50 + completedCount * 3),
          ormDatabase: Math.min(92, 55 + completedCount * 3),
          erpArchitecture: Math.min(88, 48 + completedCount * 3),
          debuggingVelocity: 70
        },
        questStats: {}, // [questId]: { attempts: 0, failures: 0, passed: false, firstTry: false }
        errorStats: {}, // [errorType]: count
        journeyMilestones: [
          {
            id: 'm-0',
            timestamp: new Date().toISOString(),
            type: 'agent_initialized',
            title: 'AI Mentor Linked',
            details: `Dr. Frappe started tracking ${user?.name || 'Developer'}'s Frappe developer journey. Initial IQ calibrated at ${initialIq}.`,
            icon: '🤖',
            iqDelta: 0
          }
        ],
        blindspots: [],
        chatMessages: [
          {
            sender: 'agent',
            text: `Welcome! I'm watching your code live. Feel free to ask me questions anytime: how to approach a quest, why a test failed, or how to write cleaner Frappe scripts. Let's build your Frappe IQ! 🚀`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]
      };
      this.saveState(saved);
    }

    this.state = saved;
    this.evaluateBlindspots();
    this.notify();
  }

  saveState(state) {
    if (!this.currentUser) return;
    try {
      const key = `${STORAGE_PREFIX}${this.currentUser.id || 'guest'}`;
      localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {
      console.error('Agent brain storage write error:', e);
    }
  }

  getState() {
    return this.state;
  }

  // --- Dynamic Speech & Mood Engine ---
  setSpeech(speechText, mood = AGENT_MOODS.IDLE, playSound = true) {
    if (!this.state) return;
    this.state.speech = speechText;
    this.state.currentMood = mood;
    this.state.speechHistory = [
      { text: speechText, mood, timestamp: new Date().toLocaleTimeString() },
      ...(this.state.speechHistory || []).slice(0, 19)
    ];
    this.saveState(this.state);
    if (playSound && typeof sounds !== 'undefined' && sounds.playAgentSpeak) {
      sounds.playAgentSpeak();
    }
    this.notify();
  }

  // --- Event: User Selects a Quest ---
  onQuestSelected(quest) {
    if (!this.state) return;
    const isCompleted = this.currentUser?.completedQuests?.includes(quest.id);
    const questStat = this.state.questStats[quest.id] || { attempts: 0, failures: 0, passed: false };

    let speech = '';
    let mood = AGENT_MOODS.COACHING;

    if (isCompleted) {
      speech = `Ah, "${quest.title}"! You've already mastered this DocType (${quest.doctype}). Want to refactor it or challenge yourself to write it even cleaner?`;
      mood = AGENT_MOODS.PROUD;
    } else if (questStat.attempts > 0 && !questStat.passed) {
      speech = `Back to conquer "${quest.title}"! We had ${questStat.failures} failed test run(s) before. Don't worry, hit 'Coach Me' or 'Review My Code' whenever you want guidance.`;
      mood = AGENT_MOODS.THINKING;
    } else {
      // First time scenario intro
      if (quest.trackId === 'interview-mastery') {
        speech = `🎯 High-stakes Technical Drill: "${quest.title}". Top ERPNext hiring managers test this exact concept. Let's break down the logic together!`;
      } else if (quest.trackId === 'client-scripts') {
        speech = `⚡ Client Scripting Quest: We are modifying the ${quest.doctype} Desk UI. Focus on the right form event hook!`;
      } else if (quest.trackId === 'server-scripts') {
        speech = `🛡️ Server Python Controller: Remember, controller hooks run inside database transactions. Keep your validations clean!`;
      } else {
        speech = `Exciting challenge on DocType "${quest.doctype}". Take a look at the requirements, and let's craft the solution!`;
      }
    }

    this.setSpeech(speech, mood);
  }

  // --- Event: User Runs Code and Execution Finishes ---
  onExecutionCompleted({ quest, userCode, success, message, logs }) {
    if (!this.state) return;

    if (!this.state.questStats[quest.id]) {
      this.state.questStats[quest.id] = { attempts: 0, failures: 0, passed: false, firstTry: false };
    }
    const qStat = this.state.questStats[quest.id];
    qStat.attempts += 1;

    if (success) {
      const isFirstTry = qStat.failures === 0 && !qStat.passed;
      qStat.passed = true;
      qStat.firstTry = isFirstTry;

      // Calculate IQ Increase
      const iqDelta = isFirstTry ? 5 : 3;
      this.boostIQ(iqDelta, quest.trackId, `Mastered ${quest.title} ${isFirstTry ? '(First Try Bonus!)' : ''}`);

      // Record Journey Milestone
      this.recordMilestone({
        type: 'quest_cleared',
        title: `Cleared Quest: ${quest.title}`,
        details: `Successfully compiled and passed all test assertions for DocType ${quest.doctype}. Earned +${quest.xp} XP and +${iqDelta} Frappe IQ!`,
        icon: '🏆',
        iqDelta
      });

      const speech = isFirstTry
        ? `🔥 Incredible work! Perfect execution on your FIRST try! Your ${this.getTrackPillarName(quest.trackId)} IQ surged by +${iqDelta} points!`
        : `🎉 Outstanding! All test assertions passed for ${quest.doctype}. Your persistence paid off (+${iqDelta} Frappe IQ)!`;

      this.setSpeech(speech, AGENT_MOODS.EXCITED);
      this.evaluateBlindspots();

    } else {
      qStat.failures += 1;

      // Track error category
      const errorCategory = this.categorizeError(message, userCode);
      this.state.errorStats[errorCategory] = (this.state.errorStats[errorCategory] || 0) + 1;

      // Generate intelligent diagnosis
      const diagnostic = this.diagnoseError(quest, userCode, message, errorCategory);
      
      this.setSpeech(
        `⚠️ Test Assertion Failed: ${diagnostic.shortAdvice} (Click 'Agent Diagnostic' to see how to tackle this step-by-step)`,
        AGENT_MOODS.WARNING
      );

      this.evaluateBlindspots();
    }

    this.saveState(this.state);
    this.notify();
  }

  // Categorize errors for learning curve analytics
  categorizeError(message, code) {
    const msg = (message || '').toLowerCase();
    const c = (code || '').toLowerCase();

    if (msg.includes('syntax') || msg.includes('unexpected') || msg.includes('is not defined')) {
      return 'Syntax / Scope Error';
    }
    if (msg.includes('set_query') || msg.includes('filters') || c.includes('frm.set_query')) {
      return 'Dynamic Query Filtering';
    }
    if (msg.includes('cur_frm')) {
      return 'Deprecated Global Variable Usage';
    }
    if (msg.includes('throw') || msg.includes('validate') || msg.includes('validation')) {
      return 'DocType Validation & Hooks';
    }
    if (msg.includes('child') || msg.includes('item') || msg.includes('grid')) {
      return 'Child Table / Grid Manipulation';
    }
    if (msg.includes('button') || msg.includes('add_custom_button')) {
      return 'Desk Custom Buttons';
    }
    if (msg.includes('status') || msg.includes('docstatus') || msg.includes('submit')) {
      return 'Docstatus & Workflow Guard';
    }
    return 'Assertion Logic Mismatch';
  }

  // Diagnose error with high-fidelity mental model & actionable step
  diagnoseError(quest, code, rawError, category) {
    let explanation = `The simulator expected a specific state or API call on DocType '${quest.doctype}' that wasn't reached.`;
    let mentalModel = `In Frappe Desk, actions follow an event lifecycle: Form Load -> Refresh -> Field Change -> Validate -> Before Save.`;
    let actionStep = `Check your event handler parameters and verify property names.`;
    let shortAdvice = `Let's check the event name and filter syntax!`;

    // Proactively check for missing functions, methods, or attributes using Dr. Frappe
    const inspection = this.inspectCodeForMissingSymbols(quest, code);
    let missingNotes = "";
    if (inspection.hasMissing) {
      const missingNames = [
        ...inspection.missingFunctions.map(f => f.label || f.name),
        ...inspection.missingMethods.map(m => m.label || m.name),
        ...inspection.missingAttributes.map(a => a.label || a.name)
      ];
      missingNotes = `\n⚠️ Dr. Frappe identified missing component(s): ${missingNames.join(', ')}.`;
    }

    if (category === 'Dynamic Query Filtering') {
      explanation = `The Link field filter wasn't applied or returned invalid filter keys.` + missingNotes;
      mentalModel = `Frappe's 'frm.set_query' expects a callback returning an object: { filters: { fieldname: value } }.`;
      actionStep = `Ensure you returned { filters: { ... } } inside frm.set_query('${quest.doctype.toLowerCase() === 'sales order' ? 'customer' : 'item_code'}', () => ({ filters: ... })).`;
      shortAdvice = inspection.hasMissing 
        ? `Dr. Frappe note: check missing ${[...inspection.missingMethods, ...inspection.missingAttributes].map(s => s.name).join(', ')}!`
        : `Ensure frm.set_query returns a valid { filters: { ... } } dictionary!`;
    } else if (category === 'Syntax / Scope Error') {
      explanation = `JavaScript runtime encountered a syntax error or an undefined symbol: "${rawError}"` + missingNotes;
      mentalModel = `Scripts run in an isolated Virtual Desk context where only 'frappe', 'frm', and '_' are in scope.`;
      actionStep = `Look for unclosed braces '{', missing commas in objects, or misspelled variable names.`;
      shortAdvice = `Check for unclosed brackets or misspelled variables.`;
    } else if (category === 'Deprecated Global Variable Usage') {
      explanation = `Found usage of 'cur_frm'. In modern Frappe (v14/v15), 'cur_frm' causes race conditions.`;
      mentalModel = `Always accept 'frm' as the first argument in event functions: refresh(frm) { frm... }.`;
      actionStep = `Replace all occurrences of 'cur_frm' with 'frm'.`;
      shortAdvice = `Avoid 'cur_frm'! Always pass and use 'frm' directly.`;
    } else if (category === 'DocType Validation & Hooks') {
      explanation = `Validation condition failed or error was not raised with frappe.throw.` + missingNotes;
      mentalModel = `In Frappe Python & server scripts, 'frappe.throw(_("Message"))' stops execution and rolls back the database. 'frappe.msgprint' only displays an alert without aborting!`;
      actionStep = `Use frappe.throw instead of frappe.msgprint to strictly reject invalid states.`;
      shortAdvice = `Remember: frappe.throw aborts the save; frappe.msgprint does not!`;
    } else if (category === 'Desk Custom Buttons') {
      explanation = `Custom button was not registered or its action callback threw an error.` + missingNotes;
      mentalModel = `frm.add_custom_button(label, callback, group) binds an action button to the Desk navbar.`;
      actionStep = `Call frm.add_custom_button('Button Label', function() { ... }) inside the refresh(frm) event.`;
      shortAdvice = `Ensure the custom button is added inside the 'refresh' event handler.`;
    } else {
      if (missingNotes) {
        explanation += missingNotes;
      }
    }

    return {
      category,
      rawError,
      explanation,
      mentalModel,
      actionStep,
      shortAdvice,
      inspection
    };
  }

  // --- Dynamic Problem Blueprint & "How to Tackle It" ---
  getProblemBlueprint(quest) {
    if (!quest) return null;

    // Build specific blueprint based on quest
    const objectives = quest.objectives || [];
    const language = quest.language || 'javascript';

    return {
      questId: quest.id,
      title: quest.title,
      doctype: quest.doctype,
      trackTitle: this.getTrackPillarName(quest.trackId),
      mentalModel: `DocType '${quest.doctype}' is managed by Frappe's ${language === 'python' ? 'Python Controller engine' : 'Virtual Desk UI'}. When an event occurs, Frappe passes the document context and checks hooks in sequence.`,
      battlePlan: [
        {
          step: 1,
          title: 'Identify the Lifecycle Trigger',
          instruction: language === 'python' 
            ? `Locate the proper controller method: validate(self), before_save(self), or on_submit(self).`
            : `Bind your handler to the appropriate event: 'refresh(frm)' for page loads or '[fieldname](frm)' for input changes.`
        },
        {
          step: 2,
          title: 'Formulate the Core Logic',
          instruction: `Target the specific fields required: ${objectives[0] || 'Implement validation checks'}. Keep variables scoped cleanly.`
        },
        {
          step: 3,
          title: 'Provide User Feedback or Guard Rails',
          instruction: language === 'python'
            ? `If business constraints fail, abort using frappe.throw(_('Reason')). Otherwise allow the commit.`
            : `Provide feedback using frappe.show_alert(...) or update the virtual form via frm.set_value(...).`
        }
      ],
      commonGotchas: [
        `Never rely on window or DOM selectors directly (e.g. document.getElementById). Always use Frappe Form API methods.`,
        `Remember that numeric values in child tables may be strings unless parsed or properly handled.`,
        `Always call frm.refresh_field('fieldname') if modifying child table rows directly.`
      ]
    };
  }

  // --- Dr. Frappe Missing Symbols & Attributes Inspector ---
  inspectCodeForMissingSymbols(quest, userCode) {
    if (!quest || !userCode) {
      return {
        hasMissing: false,
        missingFunctions: [],
        missingMethods: [],
        missingAttributes: [],
        presentSymbols: [],
        score: 100,
        drFrappeSpeech: "Ready to inspect! Write your code and I'll analyze every function, method, and attribute.",
        drFrappeDetailedAdvice: "No code provided for inspection."
      };
    }

    const lower = userCode.toLowerCase();
    const missingFunctions = [];
    const missingMethods = [];
    const missingAttributes = [];
    const presentSymbols = [];

    const symbols = quest.expectedSymbols || { functions: [], methods: [], attributes: [] };

    // 1. Inspect required functions & lifecycle handlers
    (symbols.functions || []).forEach(fn => {
      const fnName = fn.name.toLowerCase();
      // Look for function definition patterns or function name presence
      const hasFn = lower.includes(fnName);
      if (!hasFn) {
        missingFunctions.push(fn);
      } else {
        presentSymbols.push({ ...fn, type: 'function' });
      }
    });

    // 2. Inspect required API methods
    (symbols.methods || []).forEach(m => {
      const mName = m.name.toLowerCase();
      const baseName = mName.replace(/^frappe\./, '').replace(/^frm\./, '');
      const hasMethod = lower.includes(mName) || (baseName && lower.includes(baseName));
      if (!hasMethod) {
        missingMethods.push(m);
      } else {
        presentSymbols.push({ ...m, type: 'method' });
      }
    });

    // 3. Inspect required fields, parameters, and attributes
    (symbols.attributes || []).forEach(attr => {
      const cleanName = attr.name.toLowerCase().replace(/['"]/g, '');
      const hasAttr = lower.includes(cleanName);
      if (!hasAttr) {
        missingAttributes.push(attr);
      } else {
        presentSymbols.push({ ...attr, type: 'attribute' });
      }
    });

    const totalExpected = (symbols.functions?.length || 0) + (symbols.methods?.length || 0) + (symbols.attributes?.length || 0);
    const totalMissing = missingFunctions.length + missingMethods.length + missingAttributes.length;
    const hasMissing = totalMissing > 0;
    const score = totalExpected > 0 ? Math.max(0, Math.round(((totalExpected - totalMissing) / totalExpected) * 100)) : 100;

    // Dr. Frappe's conversational speech message
    let drFrappeSpeech = "";
    if (!hasMissing) {
      drFrappeSpeech = `🌟 Brilliant work! All required functions, methods, and attributes are present in your code for "${quest.title}". Ready to run!`;
    } else {
      const missingParts = [];
      if (missingFunctions.length > 0) {
        missingParts.push(`function: ${missingFunctions.map(f => f.label || f.name).join(', ')}`);
      }
      if (missingMethods.length > 0) {
        missingParts.push(`method: ${missingMethods.map(m => m.label || m.name).join(', ')}`);
      }
      if (missingAttributes.length > 0) {
        missingParts.push(`attribute: ${missingAttributes.map(a => a.label || a.name).join(', ')}`);
      }
      drFrappeSpeech = `⚠️ Dr. Frappe alert: Missing ${missingParts.join(' | ')}. Check the directions panel for guidance!`;
    }

    // Dr. Frappe's detailed Markdown guidance
    const adviceLines = [];
    if (hasMissing) {
      adviceLines.push(`### 🤖 Dr. Frappe's Missing Symbols Diagnostic for "${quest.title}"`);
      if (missingFunctions.length > 0) {
        adviceLines.push(`\n#### 🔴 Missing Function / Lifecycle Hook:`);
        missingFunctions.forEach(f => {
          adviceLines.push(`- **\`${f.label || f.name}\`**: ${f.purpose}\n  👉 *Direction*: ${f.direction}`);
        });
      }
      if (missingMethods.length > 0) {
        adviceLines.push(`\n#### 🟠 Missing API Method:`);
        missingMethods.forEach(m => {
          adviceLines.push(`- **\`${m.label || m.name}\`**: ${m.purpose}\n  👉 *Direction*: ${m.direction}`);
        });
      }
      if (missingAttributes.length > 0) {
        adviceLines.push(`\n#### 🟡 Missing Attribute / Property:`);
        missingAttributes.forEach(a => {
          adviceLines.push(`- **\`${a.label || a.name}\`**: ${a.purpose}\n  👉 *Direction*: ${a.direction}`);
        });
      }
    } else {
      adviceLines.push(`✅ All architectural functions, methods, and attributes verified by Dr. Frappe!`);
    }

    return {
      hasMissing,
      missingFunctions,
      missingMethods,
      missingAttributes,
      presentSymbols,
      score,
      drFrappeSpeech,
      drFrappeDetailedAdvice: adviceLines.join('\n')
    };
  }

  // --- Code Reviewer & Assistant ---
  reviewCode(quest, userCode) {
    if (!userCode || !userCode.trim()) {
      return {
        rating: 'Empty',
        score: 0,
        feedback: `The editor is empty! Start with the starter template and check the mission objectives.`
      };
    }

    const issues = [];
    const positives = [];
    const lower = userCode.toLowerCase();

    // Dr. Frappe Symbol Inspection check
    const inspection = this.inspectCodeForMissingSymbols(quest, userCode);
    if (inspection.hasMissing) {
      inspection.missingFunctions.forEach(fn => {
        issues.push(`🔴 Missing Function: ${fn.label || fn.name} — ${fn.direction}`);
      });
      inspection.missingMethods.forEach(m => {
        issues.push(`🟠 Missing Method: ${m.label || m.name} — ${m.direction}`);
      });
      inspection.missingAttributes.forEach(attr => {
        issues.push(`🟡 Missing Attribute: ${attr.label || attr.name} — ${attr.direction}`);
      });
    } else {
      positives.push(`✅ All expected lifecycle functions, methods, and attributes are present!`);
    }

    // Check 1: cur_frm usage
    if (lower.includes('cur_frm')) {
      issues.push(`⚠️ Detected 'cur_frm': Avoid this deprecated global. Use 'frm' passed into your event handler.`);
    }

    // Check 2: Event handler existence
    if (quest.language === 'javascript') {
      if (!lower.includes('frappe.ui.form.on')) {
        issues.push(`⚠️ Missing 'frappe.ui.form.on': Standard Frappe client scripts must register event listeners with frappe.ui.form.on('${quest.doctype}', { ... }).`);
      } else {
        positives.push(`✅ Correctly registers 'frappe.ui.form.on' for ${quest.doctype}.`);
      }

      if (quest.id.includes('custom-button') && !lower.includes('add_custom_button')) {
        issues.push(`⚠️ The quest asks for a custom button, but 'frm.add_custom_button' was not found.`);
      }

      if (quest.id.includes('link-field') && !lower.includes('set_query')) {
        issues.push(`⚠️ For dynamic link filtering, use 'frm.set_query' to bind filter criteria.`);
      }
    } else if (quest.language === 'python') {
      if (lower.includes('frappe.msgprint') && quest.summary.toLowerCase().includes('block')) {
        issues.push(`💡 Note: If you want to strictly block saving or submission, use 'frappe.throw()' instead of 'frappe.msgprint()'.`);
      }
      if (lower.includes('def validate') || lower.includes('def before_save')) {
        positives.push(`✅ Proper controller lifecycle hook implemented.`);
      }
    }

    // Check 3: Basic balance of braces
    const openBraces = (userCode.match(/\{/g) || []).length;
    const closeBraces = (userCode.match(/\}/g) || []).length;
    if (openBraces !== closeBraces) {
      issues.push(`⚠️ Bracket mismatch: Found ${openBraces} opening '{' and ${closeBraces} closing '}'.`);
    }

    const score = Math.max(20, 100 - (issues.length * 20));
    let rating = 'Needs Polish';
    if (score >= 90) rating = 'Excellent';
    else if (score >= 70) rating = 'Solid';

    return {
      score,
      rating,
      issues,
      positives,
      inspection,
      summary: issues.length === 0
        ? `✨ Looks very clean! Your syntax, functions, and attributes align with Frappe best practices. Run the quest to test it!`
        : `Found ${issues.length} potential area(s) to refine before running test assertions.`
    };
  }

  // --- Dynamic IQ Engine & Pillars ---
  boostIQ(points, trackId, reason) {
    if (!this.state) return;
    this.state.iq = Math.round(this.state.iq + points);

    // Boost corresponding pillar
    const pillarKey = this.getPillarKeyForTrack(trackId);
    if (pillarKey && this.state.iqBreakdown[pillarKey] !== undefined) {
      this.state.iqBreakdown[pillarKey] = Math.min(100, Math.round(this.state.iqBreakdown[pillarKey] + points * 1.5));
    }
    // Also boost debugging velocity slightly on any completion
    this.state.iqBreakdown.debuggingVelocity = Math.min(100, this.state.iqBreakdown.debuggingVelocity + 1);

    this.saveState(this.state);
  }

  recordMilestone(milestone) {
    if (!this.state) return;
    const item = {
      id: `m-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...milestone
    };
    this.state.journeyMilestones = [item, ...(this.state.journeyMilestones || [])];
    this.saveState(this.state);
  }

  getPillarKeyForTrack(trackId) {
    switch (trackId) {
      case 'client-scripts': return 'clientScripting';
      case 'server-scripts': return 'serverPython';
      case 'interview-mastery': return 'ormDatabase';
      case 'erpnext-scenarios': return 'erpArchitecture';
      case 'crm-automations': return 'erpArchitecture';
      default: return 'clientScripting';
    }
  }

  getTrackPillarName(trackId) {
    switch (trackId) {
      case 'client-scripts': return 'Client-Side Reactivity';
      case 'server-scripts': return 'Python & Doc Events';
      case 'interview-mastery': return 'Database & ORM Mastery';
      case 'erpnext-scenarios': return 'ERPNext Business Architecture';
      case 'crm-automations': return 'Workflow Automations';
      default: return 'General Frappe Development';
    }
  }

  getRankForIQ(iq) {
    for (let i = IQ_LEVEL_TITLES.length - 1; i >= 0; i--) {
      if (iq >= IQ_LEVEL_TITLES[i].min) {
        return IQ_LEVEL_TITLES[i];
      }
    }
    return IQ_LEVEL_TITLES[0];
  }

  // --- Blindspot Evaluator ---
  evaluateBlindspots() {
    if (!this.state) return;
    const blindspots = [];
    const errorStats = this.state.errorStats || {};
    const questStats = this.state.questStats || {};

    // Analyze high error frequencies
    Object.entries(errorStats).forEach(([category, count]) => {
      if (count >= 2) {
        blindspots.push({
          category,
          severity: count >= 4 ? 'high' : 'medium',
          title: `Frequent Friction: ${category}`,
          description: `You've run into ${count} issues related to ${category}. Reviewing the mental model and syntax will give you an immediate IQ jump!`,
          recommendedQuest: this.findRecommendedQuestForCategory(category)
        });
      }
    });

    // Check if user has low score in any pillar
    const { clientScripting, serverPython, ormDatabase, erpArchitecture } = this.state.iqBreakdown;
    const minPillar = Object.entries({ clientScripting, serverPython, ormDatabase, erpArchitecture })
      .sort((a, b) => a[1] - b[1])[0];

    if (minPillar && minPillar[1] < 70) {
      blindspots.push({
        category: minPillar[0],
        severity: 'medium',
        title: `Pillar Growth Opportunity: ${this.getPillarDisplayName(minPillar[0])}`,
        description: `Your score in ${this.getPillarDisplayName(minPillar[0])} (${minPillar[1]}/100) is currently your lowest pillar. Balancing this will boost your overall Developer IQ to Senior level!`,
        recommendedQuest: this.findRecommendedQuestForPillar(minPillar[0])
      });
    }

    this.state.blindspots = blindspots.slice(0, 3);
    this.saveState(this.state);
  }

  getPillarDisplayName(key) {
    switch (key) {
      case 'clientScripting': return 'Client Scripts & Desk UI';
      case 'serverPython': return 'Python Controllers & Doc Events';
      case 'ormDatabase': return 'ORM & Query Performance';
      case 'erpArchitecture': return 'ERPNext Business Logic';
      case 'debuggingVelocity': return 'Debugging Intuition & Speed';
      default: return key;
    }
  }

  findRecommendedQuestForCategory(category) {
    if (category.includes('Dynamic Query')) return QUESTS.find(q => q.id === 'int-01-link-field-query');
    if (category.includes('Button')) return QUESTS.find(q => q.id === 'cs-01-custom-button');
    if (category.includes('Validation')) return QUESTS.find(q => q.id === 'py-01-doc-events');
    return QUESTS[0];
  }

  findRecommendedQuestForPillar(pillarKey) {
    switch (pillarKey) {
      case 'clientScripting': return QUESTS.find(q => q.trackId === 'client-scripts');
      case 'serverPython': return QUESTS.find(q => q.trackId === 'server-scripts');
      case 'ormDatabase': return QUESTS.find(q => q.trackId === 'interview-mastery');
      case 'erpArchitecture': return QUESTS.find(q => q.trackId === 'erpnext-scenarios');
      default: return QUESTS[0];
    }
  }

  // --- Interactive Chat & Q&A Engine ---
  async askAgent({ prompt, currentQuest, currentCode, lastValidation }) {
    if (!this.state) return 'Agent not initialized.';

    const userMsg = {
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    this.state.chatMessages = [...this.state.chatMessages, userMsg];
    this.setSpeech(`Thinking about your question... 🤔`, AGENT_MOODS.THINKING);

    // Generate intelligent response based on prompt context
    const responseText = this.generateAgentResponse(prompt, currentQuest, currentCode, lastValidation);

    const agentReply = {
      sender: 'agent',
      text: responseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    this.state.chatMessages = [...this.state.chatMessages, agentReply];
    this.setSpeech(
      responseText.length > 120 ? responseText.slice(0, 117) + '...' : responseText,
      AGENT_MOODS.COACHING
    );
    this.saveState(this.state);
    this.notify();

    return responseText;
  }

  generateAgentResponse(prompt, currentQuest, currentCode, lastValidation) {
    const q = prompt.toLowerCase();

    // 1. Request to inspect missing functions, methods, or attributes
    if (q.includes('missing') || q.includes('symbol') || q.includes('inspect') || q.includes('what am i missing') || q.includes('missing function') || q.includes('missing method') || q.includes('missing attribute')) {
      if (!currentQuest) return "Select a quest first, and I'll inspect your code for missing functions, methods, and attributes!";
      const inspection = this.inspectCodeForMissingSymbols(currentQuest, currentCode);
      return inspection.drFrappeDetailedAdvice;
    }

    // 2. Request to review current code
    if (q.includes('review') || q.includes('check my code') || q.includes('look at my code')) {
      if (!currentQuest) return "Open a quest first so I can review your code against specific requirements!";
      const review = this.reviewCode(currentQuest, currentCode);
      return `🔍 **Dr. Frappe's Code Review for "${currentQuest.title}"**:
- **Health Rating**: ${review.rating} (${review.score}/100)
${review.positives.map(p => `- ${p}`).join('\n')}
${review.issues.map(i => `- ${i}`).join('\n')}

💡 **Next Move**: ${review.summary}`;
    }

    // 3. Request for step-by-step guidance on tackling the problem
    if (q.includes('tackle') || q.includes('approach') || q.includes('how to solve') || q.includes('step by step') || q.includes('break down')) {
      if (!currentQuest) return "Select a quest from the Quest Line, and I'll lay out the exact 3-step mental blueprint to tackle it!";
      const blueprint = this.getProblemBlueprint(currentQuest);
      return `🎯 **How to Tackle "${currentQuest.title}" Step-by-Step**:

**1. Mental Model**:
${blueprint.mentalModel}

**2. Step-by-Step Battle Plan**:
${blueprint.battlePlan.map(bp => `**Step ${bp.step}: ${bp.title}**\n${bp.instruction}`).join('\n\n')}

⚠️ **Gotchas to Avoid**:
${blueprint.commonGotchas.map(g => `- ${g}`).join('\n')}

Ready to write the script? Give Step 1 a shot in the editor!`;
    }

    // 4. Request for directional hints without full code reveal
    if (q.includes('hint') || q.includes('clue') || q.includes('stuck') || q.includes('direction')) {
      if (!currentQuest) return "Pick a quest first, and I will give you progressive directional hints!";
      const hintsList = currentQuest.hints && currentQuest.hints.length > 0
        ? currentQuest.hints.join('\n\n')
        : (currentQuest.objectives || []).map((obj, i) => `Direction ${i + 1}: ${obj}`).join('\n\n');
      return `💡 **Directional Steps & Guidance for "${currentQuest.title}"**:

${hintsList}

Remember: Follow these directions to implement your script. Do not copy-paste solutions—craft the logic yourself to build your Developer IQ! 🚀`;
    }

    // 4. Inquire about Frappe IQ
    if (q.includes('iq') || q.includes('score') || q.includes('rank') || q.includes('level')) {
      const rank = this.getRankForIQ(this.state.iq);
      return `🧠 **Your Frappe Developer IQ Status**:
- **Current IQ**: **${this.state.iq}** (${rank.badge} ${rank.title})
- **Career Tier**: ${rank.description}
- **Pillar Highlights**:
  - Client Scripting: **${this.state.iqBreakdown.clientScripting}/100**
  - Python Controllers: **${this.state.iqBreakdown.serverPython}/100**
  - ORM & Database: **${this.state.iqBreakdown.ormDatabase}/100**
  - ERPNext Architecture: **${this.state.iqBreakdown.erpArchitecture}/100**
  - Debugging Intuition: **${this.state.iqBreakdown.debuggingVelocity}/100**

⚡ Tip: Completing quests on your first attempt without looking at full solutions gives the largest IQ multiplier!`;
    }

    // 5. Inquire about weaknesses or blindspots
    if (q.includes('weak') || q.includes('blindspot') || q.includes('improve') || q.includes('struggle')) {
      if (!this.state.blindspots || this.state.blindspots.length === 0) {
        return `🌟 You don't have any major blindspots detected yet! Keep solving quests, and I'll analyze any recurring syntax patterns or test assertion failures.`;
      }
      return `📊 **Your Frappe Learning Diagnostics**:
I've analyzed your test runs and identified these focus areas:
${this.state.blindspots.map((b, i) => `**${i + 1}. ${b.title}**\n${b.description}${b.recommendedQuest ? `\n👉 *Recommended Drill*: "${b.recommendedQuest.title}"` : ''}`).join('\n\n')}

Focus on these areas to reach the **ERPNext Lead Architect** level!`;
    }

    // 6. Rapid-fire drill or question
    if (q.includes('quiz') || q.includes('test me') || q.includes('drill') || q.includes('challenge me')) {
      const drills = [
        `🧠 **Rapid-Fire Frappe IQ Drill**:
*Question*: You need to prevent a user from submitting a 'Purchase Order' if total exceeds $50,000 without Director approval. Which server-side lifecycle hook should you use, and which method stops the submit?
*(Hint: Think 'before_submit' vs 'validate', and 'frappe.throw')*`,
        `🧠 **Rapid-Fire Frappe IQ Drill**:
*Question*: On a Client Script, what is the key difference between \`frm.set_value('status', 'Closed')\` and directly doing \`frm.doc.status = 'Closed'\`?
*(Hint: Think about field change triggers and dirty form flags!)*`,
        `🧠 **Rapid-Fire Frappe IQ Drill**:
*Question*: In Frappe's Python ORM, why is \`frappe.db.get_value('Customer', customer_name, ['credit_limit', 'territory'], as_dict=True)\` preferred over \`frappe.get_doc('Customer', customer_name)\` when you only need two columns?
*(Hint: N+1 query overhead and memory footprint!)*`
      ];
      return drills[Math.floor(Math.random() * drills.length)];
    }

    // 7. General Frappe Architecture / Fallback
    return `Dr. Frappe here! I'm tracking your development progress.
You can ask me to:
- 💡 **"Break down how to tackle this quest"**
- 🔍 **"Review my current code for mistakes"**
- 🧠 **"What is my Frappe IQ and weakest pillar?"**
- ⚡ **"Give me a rapid-fire Frappe interview drill"**

What would you like to explore next?`;
  }
}

export const agentBrain = new AgentBrainService();

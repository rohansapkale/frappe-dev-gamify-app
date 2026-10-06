// User Authentication, Isolated Storage & Global Leaderboard Engine

const USERS_STORAGE_KEY = 'frappequest_users_v3';
const CURRENT_SESSION_KEY = 'frappequest_active_user_v3';

// Pre-seeded community developers for realistic leaderboard rankings & demo testing
const DEFAULT_DEVELOPERS = [
  {
    id: 'user-01',
    username: 'rohan_frappe',
    email: 'rohan@frappe.io',
    password: 'password123',
    name: 'Rohan Sharma',
    role: 'Frappe Developer',
    avatar: '👨‍💻',
    specialization: 'Custom App Architecture',
    authProvider: 'local',
    xp: 2150,
    coins: 720,
    streak: 8,
    level: 6,
    rankTitle: 'Frappe Grandmaster',
    completedQuests: ['int-01-link-field-query', 'int-02-gl-balance-guard', 'int-03-autoname-series', 'cs-01-custom-button', 'cs-02-dynamic-fields', 'cs-03-child-table-calc', 'py-01-doc-events', 'py-02-orm-mastery'],
    unlockedBadges: ['first_quest', 'button_smith', 'orm_whisperer', 'validation_sentinel', 'quiz_master', 'streak_flame'],
    unlockedSkills: ['node-client-basics', 'node-custom-buttons', 'node-dynamic-fields', 'node-child-tables', 'node-server-controllers', 'node-db-queries', 'node-api-background', 'node-frappe-architect'],
    dailyQuizHistory: {
      '2026-09-30': { score: 10, total: 10, completed: true, timestamp: '2026-09-30T10:00:00Z' },
      '2026-09-29': { score: 9, total: 10, completed: true, timestamp: '2026-09-29T10:00:00Z' }
    }
  },
  {
    id: 'user-02',
    username: 'farhan_erp',
    email: 'farhan@erpnext.org',
    password: 'password123',
    name: 'Farhan Akhtar',
    role: 'ERPNext Architect',
    avatar: '🧙‍♂️',
    specialization: 'Accounts & GL Engines',
    authProvider: 'local',
    xp: 1840,
    coins: 610,
    streak: 6,
    level: 5,
    rankTitle: 'ERPNext Architect',
    completedQuests: ['int-02-gl-balance-guard', 'cs-01-custom-button', 'cs-02-dynamic-fields', 'py-01-doc-events', 'py-02-orm-mastery', 'erp-01-quotation-to-order'],
    unlockedBadges: ['first_quest', 'button_smith', 'orm_whisperer', 'validation_sentinel'],
    unlockedSkills: ['node-client-basics', 'node-custom-buttons', 'node-server-controllers', 'node-db-queries'],
    dailyQuizHistory: {
      '2026-09-30': { score: 9, total: 10, completed: true, timestamp: '2026-09-30T09:30:00Z' }
    }
  },
  {
    id: 'user-03',
    username: 'priya_core',
    email: 'priya@frappe.io',
    password: 'password123',
    name: 'Priya Nair',
    role: 'System Manager',
    avatar: '👩‍💻',
    specialization: 'Security & Whitelisting',
    authProvider: 'local',
    xp: 1420,
    coins: 480,
    streak: 5,
    level: 5,
    rankTitle: 'ERPNext Architect',
    completedQuests: ['int-01-link-field-query', 'cs-01-custom-button', 'cs-03-child-table-calc', 'py-01-doc-events'],
    unlockedBadges: ['first_quest', 'button_smith', 'validation_sentinel'],
    unlockedSkills: ['node-client-basics', 'node-custom-buttons', 'node-dynamic-fields'],
    dailyQuizHistory: {
      '2026-09-30': { score: 8, total: 10, completed: true, timestamp: '2026-09-30T11:15:00Z' }
    }
  },
  {
    id: 'user-04',
    username: 'alex_desk',
    email: 'alex@erpnext.dev',
    password: 'password123',
    name: 'Alex Rivera',
    role: 'Frappe Junior Dev',
    avatar: '🚀',
    specialization: 'Desk UI & Client Scripts',
    authProvider: 'local',
    xp: 880,
    coins: 290,
    streak: 3,
    level: 3,
    rankTitle: 'DocType Crafter',
    completedQuests: ['cs-01-custom-button', 'cs-02-dynamic-fields'],
    unlockedBadges: ['first_quest', 'button_smith'],
    unlockedSkills: ['node-client-basics', 'node-custom-buttons'],
    dailyQuizHistory: {
      '2026-09-30': { score: 7, total: 10, completed: true, timestamp: '2026-09-30T08:00:00Z' }
    }
  }
];

class AuthStorageService {
  constructor() {
    this.initStorage();
  }

  initStorage() {
    if (typeof window === 'undefined') return;
    try {
      const existing = localStorage.getItem(USERS_STORAGE_KEY);
      if (!existing) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_DEVELOPERS));
      }
    } catch (e) {
      console.error('Storage init error:', e);
    }
  }

  getAllUsers() {
    try {
      const data = localStorage.getItem(USERS_STORAGE_KEY);
      return data ? JSON.parse(data) : DEFAULT_DEVELOPERS;
    } catch (e) {
      return DEFAULT_DEVELOPERS;
    }
  }

  saveAllUsers(users) {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Save users error:', e);
    }
  }

  getCurrentUser() {
    try {
      const active = localStorage.getItem(CURRENT_SESSION_KEY);
      if (active) return JSON.parse(active);
      return null; // Return null so authentication layer is triggered if not logged in
    } catch (e) {
      return null;
    }
  }

  setCurrentUser(user) {
    try {
      if (!user) {
        localStorage.removeItem(CURRENT_SESSION_KEY);
      } else {
        localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(user));
      }
    } catch (e) {
      console.error('Set current user error:', e);
    }
  }

  login(identifier, password) {
    const users = this.getAllUsers();
    const cleanId = (identifier || '').trim().toLowerCase();
    
    if (!cleanId) {
      return { success: false, message: 'Please provide a username or email.' };
    }

    const user = users.find(u => 
      u.username?.toLowerCase() === cleanId || 
      u.email?.toLowerCase() === cleanId
    );

    if (!user) {
      return { success: false, message: 'No developer profile found with this username or email.' };
    }

    // If password was defined on the user account, verify it (ignore if empty in sandbox demo mode)
    if (user.password && password && user.password !== password) {
      return { success: false, message: 'Invalid password. Please try again.' };
    }

    this.setCurrentUser(user);
    return { success: true, user };
  }

  signup({ username, email, password, name, role, specialization, avatar }) {
    const users = this.getAllUsers();
    const cleanUsername = (username || '').trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanUsername || cleanUsername.length < 3) {
      return { success: false, message: 'Username must be at least 3 characters (letters, numbers, underscores).' };
    }

    if (users.some(u => u.username?.toLowerCase() === cleanUsername)) {
      return { success: false, message: 'Username is already claimed. Please choose another.' };
    }

    if (cleanEmail && users.some(u => u.email?.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'An account with this email address already exists.' };
    }

    const newUser = {
      id: `user-${Date.now()}`,
      username: cleanUsername,
      email: cleanEmail || `${cleanUsername}@frappequest.dev`,
      password: password || 'password123',
      name: name?.trim() || username,
      role: role || 'Frappe Developer',
      avatar: avatar || '👨‍💻',
      specialization: specialization || 'Full-Stack Frappe',
      authProvider: 'local',
      xp: 0,
      coins: 50,
      streak: 1,
      level: 1,
      rankTitle: 'Desk Newbie',
      completedQuests: [],
      unlockedBadges: [],
      unlockedSkills: ['node-client-basics'],
      dailyQuizHistory: {}
    };

    users.push(newUser);
    this.saveAllUsers(users);
    this.setCurrentUser(newUser);

    return { success: true, user: newUser };
  }

  loginWithGoogle({ email, name, avatar, googleId }) {
    const users = this.getAllUsers();
    const cleanEmail = (email || 'developer@gmail.com').trim().toLowerCase();
    
    // Check if user already exists with this email or googleId
    let user = users.find(u => 
      u.email?.toLowerCase() === cleanEmail || 
      (googleId && u.googleId === googleId)
    );

    if (user) {
      // Update google metadata if needed
      user.authProvider = 'google';
      if (avatar && !user.avatar) user.avatar = avatar;
      this.saveAllUsers(users);
      this.setCurrentUser(user);
      return { success: true, user, isNew: false };
    }

    // Create new Google-linked developer profile
    const derivedUsername = cleanEmail.split('@')[0].replace(/[^a-z0-9_]/g, '_') + '_' + Math.floor(100 + Math.random() * 900);
    const newUser = {
      id: `google-${googleId || Date.now()}`,
      googleId: googleId || `gid-${Date.now()}`,
      username: derivedUsername,
      email: cleanEmail,
      name: name || 'Google Developer',
      role: 'Frappe Developer',
      avatar: avatar || '🌐',
      specialization: 'Custom App Architecture',
      authProvider: 'google',
      xp: 0,
      coins: 50,
      streak: 1,
      level: 1,
      rankTitle: 'Desk Newbie',
      completedQuests: [],
      unlockedBadges: [],
      unlockedSkills: ['node-client-basics'],
      dailyQuizHistory: {}
    };

    users.push(newUser);
    this.saveAllUsers(users);
    this.setCurrentUser(newUser);

    return { success: true, user: newUser, isNew: true };
  }

  loginAsGuest() {
    const guestUser = {
      id: `guest-${Date.now()}`,
      username: `guest_${Math.floor(1000 + Math.random() * 9000)}`,
      email: 'guest@frappequest.dev',
      name: 'Guest Explorer',
      role: 'Frappe Explorer',
      avatar: '🚀',
      specialization: 'Desk UI & Client Scripts',
      authProvider: 'guest',
      xp: 0,
      coins: 50,
      streak: 1,
      level: 1,
      rankTitle: 'Desk Newbie',
      completedQuests: [],
      unlockedBadges: [],
      unlockedSkills: ['node-client-basics'],
      dailyQuizHistory: {}
    };

    const users = this.getAllUsers();
    users.push(guestUser);
    this.saveAllUsers(users);
    this.setCurrentUser(guestUser);
    return guestUser;
  }

  logout() {
    try {
      localStorage.removeItem(CURRENT_SESSION_KEY);
    } catch (e) {
      console.error('Logout error:', e);
    }
    return null;
  }

  updateCurrentUserData(updates) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return null;

    const updatedUser = { ...currentUser, ...updates };
    const users = this.getAllUsers();
    const index = users.findIndex(u => u.id === currentUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
    } else {
      users.push(updatedUser);
    }

    this.saveAllUsers(users);
    this.setCurrentUser(updatedUser);

    return updatedUser;
  }

  getLeaderboard() {
    const users = this.getAllUsers();
    // Sort by XP descending, then streak, then completed quests
    return [...users].sort((a, b) => {
      if (b.xp !== a.xp) return b.xp - a.xp;
      if (b.streak !== a.streak) return b.streak - a.streak;
      return (b.completedQuests?.length || 0) - (a.completedQuests?.length || 0);
    });
  }
}

export const authStorage = new AuthStorageService();

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import QuestList from './components/QuestList';
import QuestDetail from './components/QuestDetail';
import SandboxMode from './components/SandboxMode';
import DailyQuizMode from './components/DailyQuizMode';
import DocsCheatsheet from './components/DocsCheatsheet';
import SkillTreeMode from './components/SkillTreeMode';
import AchievementsModal from './components/AchievementsModal';
import LeaderboardMode from './components/LeaderboardMode';
import AuthModal from './components/AuthModal';
import AuthGateway from './components/AuthGateway';
import AgentCompanion from './components/AgentCompanion';
import AgentJourneyMode from './components/AgentJourneyMode';

import { DEVELOPER_RANKS } from './data/achievements';
import { authStorage } from './utils/authStorage';
import { triggerConfetti, triggerLevelUpConfetti } from './utils/confettiHelper';
import { sounds } from './utils/soundEffects';
import { agentBrain } from './utils/agentBrain';

// Helper function to calculate rank from XP
const getRankInfo = (currentXp = 0) => {
  let currentRank = DEVELOPER_RANKS[0];
  for (let i = DEVELOPER_RANKS.length - 1; i >= 0; i--) {
    if (currentXp >= DEVELOPER_RANKS[i].minXp) {
      currentRank = {
        ...DEVELOPER_RANKS[i],
        nextMinXp: DEVELOPER_RANKS[i + 1]?.minXp || (DEVELOPER_RANKS[i].minXp + 600)
      };
      break;
    }
  }
  return currentRank;
};

export default function App() {
  // Active User session & persistent data
  const [currentUser, setCurrentUser] = useState(() => authStorage.getCurrentUser());
  const [leaderboard, setLeaderboard] = useState(() => authStorage.getLeaderboard());

  // User stats derived from active user
  const [xp, setXp] = useState(currentUser?.xp || 0);
  const [coins, setCoins] = useState(currentUser?.coins || 50);
  const [streak, setStreak] = useState(currentUser?.streak || 1);
  const [completedQuests, setCompletedQuests] = useState(currentUser?.completedQuests || []);
  const [unlockedBadges, setUnlockedBadges] = useState(currentUser?.unlockedBadges || []);
  const [unlockedSkills, setUnlockedSkills] = useState(currentUser?.unlockedSkills || ['node-client-basics']);
  const [sandboxCount, setSandboxCount] = useState(0);

  // App Navigation & Modals
  const [currentMode, setCurrentMode] = useState('quests'); // 'quests' | 'quiz' | 'leaderboard' | 'sandbox' | 'docs' | 'tree' | 'agent'
  const [activeQuest, setActiveQuest] = useState(null);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [levelUpAlert, setLevelUpAlert] = useState(null);

  // Sandbox preloaded code (if navigated from Docs Cheatsheet)
  const [sandboxInitialCode, setSandboxInitialCode] = useState(null);

  // Initialize Dr. Frappe AI brain when user session changes
  useEffect(() => {
    if (currentUser) {
      agentBrain.init(currentUser);
    }
  }, [currentUser?.id]);

  // Sync state when active user changes
  const syncWithUser = (user) => {
    setCurrentUser(user);
    setXp(user?.xp || 0);
    setCoins(user?.coins || 50);
    setStreak(user?.streak || 1);
    setCompletedQuests(user?.completedQuests || []);
    setUnlockedBadges(user?.unlockedBadges || []);
    setUnlockedSkills(user?.unlockedSkills || ['node-client-basics']);
    setLeaderboard(authStorage.getLeaderboard());
  };

  // Log out current user and return to authentication gateway
  const handleLogout = () => {
    authStorage.logout();
    setCurrentUser(null);
    sounds.playClick();
  };

  // Persist active user data on state change
  useEffect(() => {
    if (currentUser) {
      authStorage.updateCurrentUserData({
        xp,
        coins,
        streak,
        level: getRankInfo(xp).level,
        rankTitle: getRankInfo(xp).title,
        completedQuests,
        unlockedBadges,
        unlockedSkills
      });
      setLeaderboard(authStorage.getLeaderboard());
    }
  }, [xp, coins, streak, completedQuests, unlockedBadges, unlockedSkills, currentUser?.id]);

  const rank = getRankInfo(xp);
  const level = rank.level;

  // Award XP and check level-ups
  const awardRewards = (earnedXp, earnedCoins) => {
    const oldLevel = getRankInfo(xp).level;
    const newXp = xp + earnedXp;
    const newCoins = coins + earnedCoins;
    const newLevel = getRankInfo(newXp).level;

    setXp(newXp);
    setCoins(newCoins);

    if (newLevel > oldLevel) {
      const newRank = getRankInfo(newXp);
      setLevelUpAlert(newRank);
      sounds.playLevelUp();
      triggerLevelUpConfetti();
    }
  };

  // Check and unlock badges
  const checkBadgeUnlocks = (newCompleted, currentBadges) => {
    const toUnlock = [...currentBadges];

    if (newCompleted.length >= 1 && !toUnlock.includes('first_quest')) {
      toUnlock.push('first_quest');
    }
    if (newCompleted.includes('cs-01-custom-button') && !toUnlock.includes('button_smith')) {
      toUnlock.push('button_smith');
    }
    if (newCompleted.includes('py-02-orm-mastery') && !toUnlock.includes('orm_whisperer')) {
      toUnlock.push('orm_whisperer');
    }
    if (newCompleted.includes('py-01-doc-events') && !toUnlock.includes('validation_sentinel')) {
      toUnlock.push('validation_sentinel');
    }
    if (streak >= 3 && !toUnlock.includes('streak_flame')) {
      toUnlock.push('streak_flame');
    }
    if (newCompleted.some(id => id.startsWith('crm-auto-')) && !toUnlock.includes('automation_architect')) {
      toUnlock.push('automation_architect');
    }

    setUnlockedBadges(toUnlock);
  };

  const handleCompleteQuest = (quest) => {
    const isFirstTime = !completedQuests.includes(quest.id);
    const newCompleted = isFirstTime ? [...completedQuests, quest.id] : completedQuests;
    
    if (isFirstTime) {
      setCompletedQuests(newCompleted);
      awardRewards(quest.xp, quest.coins);
      triggerConfetti();
      checkBadgeUnlocks(newCompleted, unlockedBadges);
    }
  };

  const handleDailyQuizComplete = ({ score }) => {
    // Record in user history and award completion bonus
    const bonusXp = score * 20 + 50;
    const bonusCoins = score * 5 + 20;
    awardRewards(bonusXp, bonusCoins);
    triggerConfetti();

    if (score >= 8 && !unlockedBadges.includes('quiz_master')) {
      setUnlockedBadges(prev => [...prev, 'quiz_master']);
    }
  };

  const handleQuizAnswerReward = (qXp, qCoins) => {
    awardRewards(qXp, qCoins);
    triggerConfetti();
  };

  const handleUnlockSkillNode = (skill) => {
    if (!unlockedSkills.includes(skill.id)) {
      setUnlockedSkills([...unlockedSkills, skill.id]);
      awardRewards(skill.xpReward, 50);
      triggerConfetti();
    }
  };

  const handleTryInSandbox = (codeSnippet) => {
    setSandboxInitialCode(codeSnippet);
    setCurrentMode('sandbox');
  };

  const handleSandboxRun = () => {
    const nextCount = sandboxCount + 1;
    setSandboxCount(nextCount);
    if (nextCount >= 3 && !unlockedBadges.includes('sandbox_explorer')) {
      setUnlockedBadges(prev => [...prev, 'sandbox_explorer']);
    }
  };

  const handleResetProgress = () => {
    if (window.confirm("Are you sure you want to reset your developer progress?")) {
      setXp(0);
      setCoins(0);
      setCompletedQuests([]);
      setUnlockedBadges([]);
      setUnlockedSkills(['node-client-basics']);
      sounds.playClick();
    }
  };

  // If user is not authenticated, render the Authentication Gateway
  if (!currentUser) {
    return (
      <AuthGateway 
        onAuthSuccess={(user) => syncWithUser(user)} 
      />
    );
  }

  const userStats = {
    xp,
    level,
    rank,
    coins,
    streak,
    completedQuests
  };

  return (
    <div className="min-h-screen bg-[#080c16] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* 1. Universal Top Header & Stats */}
      <Header
        currentUser={currentUser}
        userStats={userStats}
        currentMode={currentMode}
        setCurrentMode={(mode) => {
          setActiveQuest(null);
          setCurrentMode(mode);
        }}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onOpenAchievements={() => setShowAchievements(true)}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        onResetProgress={handleResetProgress}
      />

      {/* 2. Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 space-y-6">
        
        {/* Mode 1: Quests & Missions */}
        {currentMode === 'quests' && (
          !activeQuest ? (
            <QuestList
              completedQuests={completedQuests}
              onSelectQuest={(quest) => setActiveQuest(quest)}
            />
          ) : (
            <QuestDetail
              quest={activeQuest}
              isCompleted={completedQuests.includes(activeQuest.id)}
              onBack={() => setActiveQuest(null)}
              onCompleteQuest={handleCompleteQuest}
            />
          )
        )}

        {/* Mode 2: Daily 10-MCQ Bug Hunt */}
        {currentMode === 'quiz' && (
          <DailyQuizMode
            currentUser={currentUser}
            onDailyQuizComplete={handleDailyQuizComplete}
            onQuizAnswerReward={handleQuizAnswerReward}
          />
        )}

        {/* Mode 3: Global Leaderboard & Rankings */}
        {currentMode === 'leaderboard' && (
          <LeaderboardMode
            leaderboard={leaderboard}
            currentUserId={currentUser?.id}
          />
        )}

        {/* Mode 4: Freeform Desk Sandbox */}
        {currentMode === 'sandbox' && (
          <SandboxMode
            initialCode={sandboxInitialCode}
            onSandboxAction={handleSandboxRun}
          />
        )}

        {/* Mode 5: Frappe API Pulse & Docs */}
        {currentMode === 'docs' && (
          <DocsCheatsheet
            onTryInSandbox={handleTryInSandbox}
          />
        )}

        {/* Mode 6: Skill Tree RPG */}
        {currentMode === 'tree' && (
          <SkillTreeMode
            unlockedSkills={unlockedSkills}
            userXp={xp}
            onUnlockSkill={handleUnlockSkillNode}
          />
        )}

        {/* Mode 7: Dr. Frappe AI Mentor & IQ Journey */}
        {currentMode === 'agent' && (
          <AgentJourneyMode
            currentUser={currentUser}
            onSelectQuest={(quest) => {
              setActiveQuest(quest);
              setCurrentMode('quests');
            }}
          />
        )}
      </main>

      {/* 3. Level-Up Celebration Modal Toast */}
      {levelUpAlert && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-blue-500 rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl shadow-blue-500/30 animate-slide-down">
            <div className="text-5xl">{levelUpAlert.icon}</div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400">
                Rank Promotion Unlocked!
              </span>
              <h3 className="text-xl font-extrabold text-white mt-1">
                Level {levelUpAlert.level}: {levelUpAlert.title}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                You have advanced on the Frappe & ERPNext developer path!
              </p>
            </div>
            <button
              onClick={() => setLevelUpAlert(null)}
              className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              Claim Promotion
            </button>
          </div>
        </div>
      )}

      {/* 4. Achievements & Badges Modal */}
      {showAchievements && (
        <AchievementsModal
          userStats={userStats}
          unlockedBadges={unlockedBadges}
          onClose={() => setShowAchievements(false)}
        />
      )}

      {/* 5. User Authentication & Profile Switching Modal */}
      {showAuthModal && (
        <AuthModal
          currentUser={currentUser}
          onLoginSuccess={(user) => syncWithUser(user)}
          onLogout={handleLogout}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {/* 6. Footer */}
      <footer className="border-t border-slate-900 py-4 px-6 text-center text-xs text-slate-500">
        <p>FrappeQuest: The ERPNext Developer RPG • Built for Frappe & ERPNext Developers</p>
      </footer>

      {/* 7. Floating Dr. Frappe AI Companion & Real-Time Observer */}
      <AgentCompanion
        currentQuest={activeQuest}
        onSelectQuest={(quest) => {
          setActiveQuest(quest);
          setCurrentMode('quests');
        }}
      />
    </div>
  );
}

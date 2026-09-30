import React, { useState, useEffect } from 'react';
import { getDailyQuizSet } from '../data/dailyQuizzes';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Coins, 
  ArrowRight, 
  ArrowLeft,
  RotateCcw, 
  Award,
  Lightbulb,
  Calendar,
  Flame,
  Check,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export default function DailyQuizMode({ currentUser, onDailyQuizComplete, onQuizAnswerReward }) {
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [quizSet, setQuizSet] = useState(() => getDailyQuizSet(todayStr));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  
  // User answers for this day: { [questionId]: { isCorrect, selectedIndex } }
  const [answersMap, setAnswersMap] = useState({});
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  // Reload quiz set if date changes
  useEffect(() => {
    const set = getDailyQuizSet(selectedDate);
    setQuizSet(set);
    setCurrentIndex(0);
    setSelectedOption(null);
    setSubmitted(false);
    setAnswersMap({});
    setShowSummaryModal(false);
  }, [selectedDate]);

  const questions = quizSet.questions;
  const currentQuiz = questions[currentIndex];
  const isAlreadyAnswered = !!answersMap[currentQuiz?.id];

  const handleSelectOption = (idx) => {
    if (submitted || isAlreadyAnswered) return;
    sounds.playClick();
    setSelectedOption(idx);
  };

  const handleSubmit = () => {
    if (selectedOption === null || !currentQuiz) return;
    const isCorrect = selectedOption === currentQuiz.correctIndex;
    setSubmitted(true);

    const newMap = {
      ...answersMap,
      [currentQuiz.id]: { isCorrect, selectedIndex: selectedOption }
    };
    setAnswersMap(newMap);

    if (isCorrect) {
      sounds.playSuccess();
      if (onQuizAnswerReward) {
        onQuizAnswerReward(currentQuiz.xp, currentQuiz.coins);
      }
    } else {
      sounds.playError();
    }

    // Check if this was the 10th question to complete the daily set
    if (Object.keys(newMap).length === questions.length) {
      const correctCount = Object.values(newMap).filter(a => a.isCorrect).length;
      sounds.playLevelUp();
      setShowSummaryModal(true);
      if (onDailyQuizComplete) {
        onDailyQuizComplete({
          date: selectedDate,
          score: correctCount,
          total: questions.length
        });
      }
    }
  };

  const handleNext = () => {
    sounds.playClick();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      const nextQ = questions[currentIndex + 1];
      const saved = answersMap[nextQ.id];
      setSelectedOption(saved ? saved.selectedIndex : null);
      setSubmitted(!!saved);
    }
  };

  const handlePrev = () => {
    sounds.playClick();
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      const prevQ = questions[currentIndex - 1];
      const saved = answersMap[prevQ.id];
      setSelectedOption(saved ? saved.selectedIndex : null);
      setSubmitted(!!saved);
    }
  };

  const handleJumpTo = (index) => {
    sounds.playClick();
    setCurrentIndex(index);
    const targetQ = questions[index];
    const saved = answersMap[targetQ.id];
    setSelectedOption(saved ? saved.selectedIndex : null);
    setSubmitted(!!saved);
  };

  const currentSaved = answersMap[currentQuiz?.id];
  const activeSelected = submitted ? selectedOption : (currentSaved ? currentSaved.selectedIndex : selectedOption);
  const showResults = submitted || !!currentSaved;

  const totalAnswered = Object.keys(answersMap).length;
  const correctCount = Object.values(answersMap).filter(a => a.isCorrect).length;
  const accuracyPct = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* 1. Top Header & Date Picker */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-purple-400" />
              <span>Daily Frappe Bug Hunt (10 MCQs)</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
              Rotates Daily
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Solve 10 new technical interview debugging scenarios every day to boost development accuracy.
          </p>
        </div>

        {/* Date Selector & Day Stats */}
        <div className="flex items-center gap-3 bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold pr-2 border-r border-slate-800">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs text-blue-300 font-bold focus:outline-none cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-1 text-amber-400 font-bold">
            <Flame className="w-3.5 h-3.5 fill-amber-500/20" />
            <span>Score: {correctCount}/{totalAnswered}</span>
          </div>
        </div>
      </div>

      {/* 2. 10-Question Progress Stepper Bar */}
      <div className="glass-panel p-3.5 flex items-center justify-between gap-2 overflow-x-auto">
        {questions.map((q, idx) => {
          const isAnswered = !!answersMap[q.id];
          const isCorrect = answersMap[q.id]?.isCorrect;
          const isCurrent = idx === currentIndex;

          let btnStyle = 'bg-slate-950 border-slate-800 text-slate-400';
          if (isAnswered) {
            btnStyle = isCorrect 
              ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold' 
              : 'bg-red-950/60 border-red-500 text-red-300 font-bold';
          }
          if (isCurrent) {
            btnStyle += ' ring-2 ring-blue-500 shadow-md shadow-blue-500/20';
          }

          return (
            <button
              key={q.id}
              onClick={() => handleJumpTo(idx)}
              className={`w-9 h-9 rounded-xl border flex items-center justify-center text-xs font-mono font-bold transition-all shrink-0 ${btnStyle}`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* 3. Main Question Card */}
      {currentQuiz && (
        <div className="glass-panel p-6 space-y-6">
          
          {/* Category & Rewards Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-blue-300 font-semibold text-xs border border-slate-700">
                {currentQuiz.category}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                currentQuiz.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' :
                currentQuiz.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' :
                'bg-red-500/10 text-red-400'
              }`}>
                {currentQuiz.difficulty}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="text-purple-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> +{currentQuiz.xp} XP
              </span>
              <span className="text-yellow-400 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5" /> +{currentQuiz.coins} FC
              </span>
            </div>
          </div>

          {/* Question Text */}
          <div>
            <span className="text-xs text-slate-400 font-mono block mb-1">
              Bug Hunt Scenario {currentIndex + 1} of {questions.length} • {selectedDate}
            </span>
            <h3 className="text-base md:text-lg font-bold text-slate-100 leading-snug">
              {currentQuiz.question}
            </h3>
          </div>

          {/* Options List */}
          <div className="space-y-3">
            {currentQuiz.options.map((option, idx) => {
              let optionStyle = 'bg-slate-900/70 border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-800/60';
              
              if (showResults) {
                if (idx === currentQuiz.correctIndex) {
                  optionStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 shadow-sm shadow-emerald-500/20';
                } else if (idx === activeSelected && idx !== currentQuiz.correctIndex) {
                  optionStyle = 'bg-red-950/40 border-red-500 text-red-200';
                }
              } else if (idx === selectedOption) {
                optionStyle = 'bg-blue-600/20 border-blue-500 text-blue-200 shadow-sm shadow-blue-500/20';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={showResults}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between gap-3 ${optionStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-center text-xs font-mono font-bold text-slate-400 shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-xs md:text-sm font-medium">{option}</span>
                  </div>

                  {showResults && (
                    idx === currentQuiz.correctIndex ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : idx === activeSelected ? (
                      <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                    ) : null
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box (Revealed after submission) */}
          {showResults && (
            <div className="p-4 bg-slate-900/90 border border-blue-500/30 rounded-xl space-y-2 animate-slide-down">
              <div className="flex items-center gap-2 font-bold text-xs text-blue-300">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
                <span>Frappe Framework Ground Truth & Solution:</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentQuiz.explanation}
              </p>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {!showResults ? (
              <button
                onClick={handleSubmit}
                disabled={selectedOption === null}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={currentIndex === questions.length - 1}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-500/25 flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>{currentIndex === questions.length - 1 ? 'Daily Drill Complete' : 'Next Question'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 4. Daily Drill Completion Scorecard Modal */}
      {showSummaryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/50 rounded-2xl max-w-md w-full p-6 text-center space-y-5 shadow-2xl shadow-emerald-500/20 animate-slide-down">
            <div className="text-5xl">🏆</div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">
                Daily 10-MCQ Bug Hunt Cleared!
              </span>
              <h3 className="text-xl font-extrabold text-white mt-1">
                {correctCount} / 10 Correct ({accuracyPct}%)
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Great job, <span className="text-blue-400 font-bold">{currentUser?.name}</span>! Your accuracy score has been recorded to the global leaderboard.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="text-center">
                <span className="text-[10px] text-slate-400 block font-bold">Accuracy</span>
                <span className="text-sm font-extrabold text-emerald-400">{accuracyPct}%</span>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-slate-400 block font-bold">Date</span>
                <span className="text-xs font-mono text-slate-300">{selectedDate}</span>
              </div>
            </div>

            <button
              onClick={() => setShowSummaryModal(false)}
              className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              Review Explanations & Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

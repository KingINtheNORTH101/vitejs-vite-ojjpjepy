import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QUIZ_QUESTIONS } from './syllabusData';

// ─── Tom Tucker commentary (correct) ─────────────────────────────────────────
const TUCKER_CORRECT = [
  'Remarkable. A human being answered correctly. Quahog 5 News is as shocked as you are.',
  "That's correct! I'd celebrate but my face is too symmetrical to show emotion.",
  "Right answer! Even Meg could've gotten that one. You're just better at it.",
  "Excellent! I've seen smarter answers from Brian — and he's a dog. But this is close.",
  "Correct! The UPSC might actually be afraid of you. Tom Tucker certainly isn't. But still.",
  "You got it! Peter would've said 'the beer one' no matter the question. You did better.",
  "Outstanding! Stewie acknowledges this. He won't say it out loud, but he does.",
];

// ─── Tom Tucker commentary (wrong) ───────────────────────────────────────────
const TUCKER_WRONG = [
  "WRONG. Peter fell down the stairs and he's still smarter than that answer.",
  'Incorrect! That was so wrong even Meg could feel secondhand embarrassment.',
  'No. Just... no. The UPSC committee is lighting a candle for your hopes right now.',
  'WRONG! Tom Tucker is struggling to maintain his journalistic neutrality.',
  'That answer was bad. Quagmire once gave better answers on a quiz show. Think about that.',
  "Completely wrong! Even the Evil Monkey wouldn't have chosen that option.",
  "Nope! Brian is shaking his head sadly into his Scotch. That's how bad it was.",
];

// ─── Subject tag color map ────────────────────────────────────────────────────
const SUBJECT_COLORS = {
  Polity: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  History: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  Geography: 'bg-green-500/20 text-green-300 border-green-500/30',
  Economy: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  Environment: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  Science: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  Ethics: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  IR: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
};

// ─── Knee Hurt Animation (wrong answer) ──────────────────────────────────────
function KneeHurtOverlay({ onDone }) {
  const [frame, setFrame] = useState(0);
  const frames = ['🧔', '😣', '🤕', '😭', '🧔'];

  useState(() => {
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setFrame((f) => (f + 1) % frames.length);
      if (i >= 14) clearInterval(iv);
    }, 200);
    const timeout = setTimeout(onDone, 3100);
    return () => {
      clearInterval(iv);
      clearTimeout(timeout);
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-red-900/70 backdrop-blur-sm"
    >
      <motion.div
        animate={{
          x: [-12, 12, -12, 12, -10, 10, -8, 8, 0],
        }}
        transition={{ duration: 0.5, repeat: 4 }}
        className="relative bg-[#0a1628] border-4 border-red-500 rounded-3xl p-10 flex flex-col items-center gap-6 max-w-sm mx-4 shadow-2xl shadow-red-900/60"
      >
        <motion.div
          animate={{
            rotate: [-5, 5, -10, 10, -5, 5, 0],
            scale: [1, 1.1, 0.95, 1.15, 1],
          }}
          transition={{ duration: 0.4, repeat: Infinity, repeatType: 'mirror' }}
          className="text-8xl select-none"
        >
          {frames[frame]}
        </motion.div>

        <div className="text-center">
          <motion.p
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="font-display font-black text-red-400 text-2xl uppercase tracking-widest"
          >
            SSSSSS—!
          </motion.p>
          <p className="text-red-300/80 text-sm mt-2 font-medium">
            Peter's knee says: WRONG ANSWER.
          </p>
          <p className="text-red-500/60 text-xs mt-1 italic">
            You cannot skip this. Peter couldn't skip his knee pain either.
          </p>
        </div>

        <div className="w-full h-2 bg-red-900/50 rounded-full overflow-hidden border border-red-500/30">
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 3, ease: 'linear' }}
            className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-500"
          />
        </div>
        <p className="text-red-500/50 text-[10px]">
          Mandatory suffering ends in 3 seconds.
        </p>
      </motion.div>

      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: `${10 + Math.random() * 80}vw`,
            y: '110vh',
            opacity: 1,
            rotate: 0,
          }}
          animate={{
            y: '-10vh',
            rotate: Math.random() > 0.5 ? 360 : -360,
            opacity: 0,
          }}
          transition={{
            duration: 2 + Math.random(),
            delay: Math.random() * 1.5,
          }}
          className="fixed text-red-500/60 text-3xl font-black pointer-events-none select-none"
        >
          ✗
        </motion.div>
      ))}
    </motion.div>
  );
}

// ─── Giggity Overlay (correct answer) ────────────────────────────────────────
function GiggityOverlay({ xpEarned, onDone }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-green-900/60 backdrop-blur-sm"
    >
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: '50vw', y: '50vh', scale: 0, opacity: 1 }}
          animate={{
            x: `${5 + Math.random() * 90}vw`,
            y: `${5 + Math.random() * 90}vh`,
            scale: Math.random() * 2 + 0.5,
            opacity: 0,
          }}
          transition={{ duration: 1.2 + Math.random() * 0.8, ease: 'easeOut' }}
          className="fixed text-yellow-400 text-2xl pointer-events-none select-none"
        >
          ⭐
        </motion.div>
      ))}

      <motion.div
        initial={{ scale: 0.3, y: 60 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        className="relative bg-[#0a1628] border-2 border-green-400/60 rounded-3xl p-10 flex flex-col items-center gap-5 max-w-sm mx-4 shadow-2xl shadow-green-900/60"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6 }}
          className="text-8xl"
        >
          😏
        </motion.div>

        <div className="text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display font-black text-green-300 text-3xl uppercase tracking-widest"
          >
            GIGGITY!
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-green-400/80 text-sm mt-2"
          >
            Quagmire approves of your intellect.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: 'spring' }}
          className="bg-yellow-500/20 border border-yellow-400/30 rounded-xl px-6 py-3 text-center"
        >
          <p className="text-yellow-300 font-display font-black text-2xl">
            +{xpEarned} XP
          </p>
          <p className="text-yellow-500/60 text-[10px]">
            credited to your account
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          onClick={onDone}
          className="text-sm text-green-300 border border-green-400/30 hover:bg-green-500/10 px-5 py-2 rounded-xl transition-all"
        >
          Continue →
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// ─── QuizMode (main export) ───────────────────────────────────────────────────
export default function QuizMode({ addXP, playSound }) {
  const [questions] = useState(() => {
    const q = [...QUIZ_QUESTIONS];
    for (let i = q.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [q[i], q[j]] = [q[j], q[i]];
    }
    return q;
  });

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showCorrect, setShowCorrect] = useState(false);
  const [showWrong, setShowWrong] = useState(false);
  const [score, setScore] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [tuckerLine, setTuckerLine] = useState('');
  const lockedRef = useRef(false);

  const currentQ = questions[currentIdx];

  const handleAnswer = useCallback(
    (optionIdx) => {
      if (isAnswered || lockedRef.current) return;
      lockedRef.current = true;
      setSelectedOption(optionIdx);
      setIsAnswered(true);

      const isCorrect = optionIdx === currentQ.correct;
      if (isCorrect) {
        setTuckerLine(
          TUCKER_CORRECT[Math.floor(Math.random() * TUCKER_CORRECT.length)]
        );
        setScore((s) => s + 1);
        setTotalXP((x) => x + currentQ.xpReward);
        addXP(currentQ.xpReward);
        playSound('giggity.mp3');
        setShowCorrect(true);
      } else {
        setTuckerLine(
          TUCKER_WRONG[Math.floor(Math.random() * TUCKER_WRONG.length)]
        );
        playSound('peter-knee.mp3');
        setShowWrong(true);
      }
    },
    [isAnswered, currentQ, addXP, playSound]
  );

  const handleWrongDone = () => {
    setShowWrong(false);
  };

  const handleCorrectDone = () => {
    setShowCorrect(false);
    advanceQuestion();
  };

  const advanceQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTuckerLine('');
      lockedRef.current = false;
    } else {
      setShowResults(true);
    }
  };

  const restartQuiz = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowCorrect(false);
    setShowWrong(false);
    setScore(0);
    setTotalXP(0);
    setShowResults(false);
    setTuckerLine('');
    lockedRef.current = false;
  };

  if (showResults) {
    const pct = Math.round((score / questions.length) * 100);
    const grade =
      pct === 100
        ? {
            label: 'Mayor West–Tier Genius',
            color: 'text-yellow-300',
            emoji: '👑',
          }
        : pct >= 80
        ? {
            label: 'Stewie Would Reluctantly Approve',
            color: 'text-green-300',
            emoji: '👶',
          }
        : pct >= 60
        ? {
            label: 'Brian Nods Sadly Into His Drink',
            color: 'text-cyan-300',
            emoji: '🐶',
          }
        : pct >= 40
        ? {
            label: 'Joe Swanson Says: Try Again',
            color: 'text-blue-300',
            emoji: '💪',
          }
        : pct >= 20
        ? { label: 'Peak Meg Energy', color: 'text-orange-300', emoji: '😢' }
        : {
            label: "Peter's Knee Has More Dignity",
            color: 'text-red-400',
            emoji: '🤕',
          };

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto space-y-6"
      >
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0a1628] to-[#0d2244] border border-blue-500/30 rounded-3xl p-8 text-center shadow-2xl">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <motion.div
              animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-7xl mb-4"
            >
              {grade.emoji}
            </motion.div>
            <h2 className="font-display font-black text-3xl text-white mb-1">
              Quiz Complete
            </h2>
            <p className={`font-display font-bold text-xl mt-1 ${grade.color}`}>
              {grade.label}
            </p>
            <p className="text-blue-400 text-sm mt-1 italic">
              "Tom Tucker reports these results live from Quahog 5 News. He
              doesn't care."
            </p>

            <div className="grid grid-cols-3 gap-4 mt-8">
              {[
                { label: 'Correct', value: score, color: 'text-green-300' },
                {
                  label: 'Wrong',
                  value: questions.length - score,
                  color: 'text-red-400',
                },
                {
                  label: 'XP Earned',
                  value: `+${totalXP}`,
                  color: 'text-yellow-300',
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-blue-900/30 border border-blue-500/20 rounded-2xl p-4"
                >
                  <p
                    className={`font-display font-black text-3xl ${stat.color}`}
                  >
                    {stat.value}
                  </p>
                  <p className="text-blue-400 text-xs mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 h-3 bg-blue-900/50 rounded-full overflow-hidden border border-blue-500/20">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1.2, delay: 0.4 }}
                className="h-full rounded-full bg-gradient-to-r from-green-400 to-cyan-400"
              />
            </div>
            <p className="text-blue-400 text-xs mt-2">{pct}% accuracy</p>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={restartQuiz}
              className="mt-8 px-8 py-3 rounded-2xl font-display font-bold text-[#0a1628] bg-gradient-to-r from-cyan-400 to-yellow-400 hover:from-cyan-300 hover:to-yellow-300 shadow-lg shadow-cyan-500/20 transition-all"
            >
              🔁 Retry (Masochism Mode)
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  const progress = (currentIdx / questions.length) * 100;

  return (
    <>
      <AnimatePresence>
        {showWrong && <KneeHurtOverlay key="wrong" onDone={handleWrongDone} />}
      </AnimatePresence>
      <AnimatePresence>
        {showCorrect && (
          <GiggityOverlay
            key="correct"
            xpEarned={currentQ.xpReward}
            onDone={handleCorrectDone}
          />
        )}
      </AnimatePresence>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-br from-purple-900/60 to-[#0a1628] border border-purple-500/30 rounded-3xl p-6 shadow-xl shadow-purple-900/30"
        >
          <div className="absolute -top-10 -right-10 w-44 h-44 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-3xl shadow-lg">
              📺
            </div>
            <div>
              <h1 className="font-display font-black text-2xl text-white">
                Tom Tucker's Pop Quiz
              </h1>
              <p className="text-purple-300 text-sm">
                "Answer correctly or face the wrath of Peter's knee. Your
                choice."
              </p>
            </div>
            <div className="ml-auto text-right shrink-0">
              <p className="text-2xl font-display font-black text-white">
                {score}/{questions.length}
              </p>
              <p className="text-purple-400 text-xs">Score</p>
            </div>
          </div>

          <div className="mt-4 space-y-1">
            <div className="flex justify-between text-xs text-purple-400/70">
              <span>
                Question {currentIdx + 1} of {questions.length}
              </span>
              <span>{Math.round(progress)}% done</span>
            </div>
            <div className="h-2 bg-purple-900/50 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-400"
              />
            </div>
          </div>
        </motion.div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ.id}
            initial={{ opacity: 0, x: 40, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -40, scale: 0.97 }}
            transition={{ duration: 0.3 }}
            className="bg-[#0a1628]/80 border border-blue-500/20 rounded-3xl overflow-hidden shadow-xl"
          >
            <div className="px-6 pt-6 flex items-center gap-3">
              <span
                className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
                  SUBJECT_COLORS[currentQ.subject] ||
                  'bg-blue-500/20 text-blue-300 border-blue-500/30'
                }`}
              >
                {currentQ.subject}
              </span>
              <span className="text-blue-500/50 text-[11px]">
                {currentQ.xpReward} XP on the line
              </span>
            </div>

            <div className="px-6 py-5">
              <p className="text-white font-display font-bold text-xl leading-relaxed">
                {currentQ.question}
              </p>
            </div>

            <div className="px-6 pb-6 space-y-3">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correct;
                const showResult = isAnswered && !showWrong && !showCorrect;

                let optionStyle =
                  'bg-blue-900/20 border-blue-500/20 text-blue-100 hover:bg-blue-900/40 hover:border-blue-400/40 cursor-pointer';
                if (showResult) {
                  if (isCorrect) {
                    optionStyle =
                      'bg-green-500/20 border-green-400/60 text-green-200 cursor-default';
                  } else if (isSelected) {
                    optionStyle =
                      'bg-red-500/20 border-red-400/60 text-red-300 cursor-default';
                  } else {
                    optionStyle =
                      'bg-blue-900/10 border-blue-500/10 text-blue-400/50 cursor-default';
                  }
                } else if (isAnswered) {
                  optionStyle =
                    'bg-blue-900/10 border-blue-500/10 text-blue-400/30 cursor-default';
                }

                return (
                  <motion.button
                    key={idx}
                    whileHover={!isAnswered ? { scale: 1.02, x: 4 } : {}}
                    whileTap={!isAnswered ? { scale: 0.98 } : {}}
                    onClick={() => handleAnswer(idx)}
                    disabled={isAnswered}
                    className={`w-full text-left p-4 rounded-2xl border-2 flex items-center gap-4 transition-all duration-200 ${optionStyle}`}
                  >
                    <span className="shrink-0 w-8 h-8 rounded-xl bg-blue-900/40 border border-blue-500/30 flex items-center justify-center text-sm font-bold text-blue-300">
                      {['A', 'B', 'C', 'D'][idx]}
                    </span>
                    <span className="flex-1 text-sm leading-relaxed">
                      {option}
                    </span>
                    {showResult && isCorrect && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="shrink-0 text-xl"
                      >
                        ✅
                      </motion.span>
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="shrink-0 text-xl"
                      >
                        ❌
                      </motion.span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation after wrong animation clears */}
            <AnimatePresence>
              {isAnswered && !showWrong && !showCorrect && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden border-t border-blue-500/20"
                >
                  <div className="px-6 py-5 space-y-4">
                    <div className="flex gap-3 items-start bg-purple-500/10 border border-purple-500/20 rounded-2xl p-4">
                      <span className="text-2xl shrink-0">📺</span>
                      <div>
                        <p className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider mb-1">
                          Tom Tucker — Quahog 5 News
                        </p>
                        <p className="text-purple-200/90 text-sm italic">
                          "{tuckerLine}"
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-4">
                      <span className="text-2xl shrink-0">📖</span>
                      <div>
                        <p className="text-[10px] text-cyan-400 font-semibold uppercase tracking-wider mb-1">
                          UPSC Explanation
                        </p>
                        <p className="text-cyan-100/80 text-sm leading-relaxed">
                          {currentQ.explanation}
                        </p>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={advanceQuestion}
                      className="w-full py-3 rounded-2xl font-display font-bold text-[#0a1628] bg-gradient-to-r from-cyan-400 to-yellow-400 shadow-lg shadow-cyan-500/20 transition-all"
                    >
                      {currentIdx < questions.length - 1
                        ? 'Next Question →'
                        : 'See Results 🎓'}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {/* Dot tracker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center gap-2 flex-wrap"
        >
          {questions.map((q, i) => (
            <div
              key={q.id}
              className={`w-7 h-7 rounded-lg border text-[10px] flex items-center justify-center font-bold transition-all ${
                i < currentIdx
                  ? 'bg-green-500/20 border-green-500/40 text-green-300'
                  : i === currentIdx
                  ? 'bg-purple-500/30 border-purple-400/60 text-purple-200 ring-1 ring-purple-400'
                  : 'bg-blue-900/20 border-blue-500/20 text-blue-600'
              }`}
            >
              {i + 1}
            </div>
          ))}
        </motion.div>
      </div>
    </>
  );
}

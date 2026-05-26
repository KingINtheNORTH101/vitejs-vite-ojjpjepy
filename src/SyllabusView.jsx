import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Sarcastic Family Guy quotes per subject ──────────────────────────────────
const SUBJECT_ROASTS = {
  history: [
    'Stewie literally travelled through time and still failed his history exam. At least he tried.',
    "Peter once confused the Mughal Empire with a type of samosa. Don't be Peter.",
    "You're studying Ancient India. Cool. Stewie conquered the Tri-State area by age 1. What's your excuse?",
    'Brian wrote half a chapter on the Gupta period. Then got distracted by a Martini. Classic Brian.',
  ],
  polity: [
    'Peter seceded from America over a bag of chips and won. Constitutional law is basically a formality.',
    'The Indian Constitution has 395 articles. Peter can barely remember his own zip code.',
    'Stewie has read the Preamble. He finds it quaint. You should still study it.',
    'Joe Swanson IS a constitutional body. Study the real ones anyway.',
  ],
  geography: [
    "Brian thinks he's worldly because he's been to New York twice. Study all 14 topics regardless.",
    "Peter tried to navigate using a Denny's placemat. The El Niño chapter is literally about his cooking.",
    'Quahog is not on any map that matters. Neither will your answer sheet if you skip the Drainage System.',
    "Chris got lost in his own backyard. Don't be Chris. Learn the Indian Physiography.",
  ],
  economy: [
    'Quagmire makes money in ways economists refuse to model. Study the legitimate version.',
    'Peter borrowed money from the mafia to buy a candy bar. GDP accounting matters, folks.',
    "Stewie understood compound interest at age 6. You're still here reading roasts.",
    'The Reserve Bank of India would like you to know Quagmire is not a monetary policy instrument.',
  ],
  environment: [
    'Chris once hugged a tree that turned out to be a janitor. Save the planet anyway.',
    "Peter drove an SUV into a wetland 'by accident' three separate times. Ramsar wept.",
    'Brian recycles — mostly his own rejection letters, but still. Study Climate Change.',
    'The Paris Agreement did not anticipate Peter Griffin as a greenhouse gas source. Study it.',
  ],
  science: [
    'Stewie built a death ray, a time machine, and a mind control device before kindergarten. You still need to know CRISPR.',
    'Peter thought nuclear energy came from a plant that glowed. He was... half right. Study it properly.',
    "Brian's understanding of AI is based on watching The Terminator twice. Don't be Brian.",
    "The only thing Quagmire knows about space is that it's 'giggity-vast'. Study ISRO missions.",
  ],
  ir: [
    'Peter insulted the entire nation of Britain over a scone. This is why IR matters.',
    "Stewie's global domination plan is technically foreign policy. So is SAARC. Study both.",
    "Brian name-drops 'geopolitics' at parties but confuses BRICS with a wall material.",
    "Quahog's foreign relations consist of Peter yelling at the Canadian border. QUAD is more nuanced.",
  ],
  ethics: [
    "Lois is literally the only morally functional being in Quahog. She's your entire GS4 syllabus.",
    "Peter once justified eating an entire birthday cake as 'consequentialist ethics'. Kant would cry.",
    "Stewie's 'categorical imperative' is 'everything I do, everyone should do, and mostly kill Lois'. Don't cite him in the exam.",
    'Brian wrote a book about ethics. It sold 4 copies. One to himself. This subject still matters more.',
  ],
};

const COMPLETION_QUIPS = [
  'Look at you. Technically doing something. Gold star for bare minimum.',
  'One topic down. Only {remaining} more before you achieve mediocrity.',
  'Congratulations! You checked a box. Peter could do that too.',
  '{remaining} topics left. The UPSC exam date inches closer like Quagmire at a bar.',
  'Stewie weeps. Not in pride — just in general.',
  "Brian would say this calls for a Scotch. He'd be right, but finish the syllabus first.",
  'You completed something! Even Meg manages that on good days.',
];

const SECTION_HEADER_VARIANTS = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const TOPIC_VARIANTS = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.03, duration: 0.3 },
  }),
};

// ─── Topic Row ────────────────────────────────────────────────────────────────
function TopicRow({ topic, index, onToggle, color, subjectId }) {
  const [justChecked, setJustChecked] = useState(false);

  const handleToggle = () => {
    if (!topic.completed) {
      setJustChecked(true);
      setTimeout(() => setJustChecked(false), 1200);
    }
    onToggle(topic.id);
  };

  return (
    <motion.div
      custom={index}
      variants={TOPIC_VARIANTS}
      initial="hidden"
      animate="visible"
      layout
      className={`group flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
        topic.completed
          ? 'bg-green-500/10 border border-green-500/20'
          : 'hover:bg-white/5 border border-transparent'
      }`}
      onClick={handleToggle}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Custom checkbox */}
      <div className="relative shrink-0 mt-0.5">
        <motion.div
          animate={
            justChecked ? { scale: [1, 1.4, 1], rotate: [0, 15, -15, 0] } : {}
          }
          transition={{ duration: 0.4 }}
          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
            topic.completed
              ? `bg-gradient-to-br ${color} border-transparent`
              : 'border-blue-500/40 bg-blue-900/20 group-hover:border-blue-400/60'
          }`}
        >
          <AnimatePresence>
            {topic.completed && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="text-[10px] text-white font-black"
              >
                ✓
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
        {/* Pop burst on first check */}
        <AnimatePresence>
          {justChecked && (
            <motion.div
              initial={{ scale: 0.5, opacity: 1 }}
              animate={{ scale: 2.5, opacity: 0 }}
              exit={{}}
              transition={{ duration: 0.5 }}
              className={`absolute inset-0 rounded-full bg-gradient-to-br ${color} pointer-events-none`}
            />
          )}
        </AnimatePresence>
      </div>

      <span
        className={`text-sm leading-relaxed transition-all ${
          topic.completed
            ? 'line-through text-blue-500/40'
            : 'text-blue-100 group-hover:text-white'
        }`}
      >
        {topic.text}
      </span>

      {/* XP badge on hover */}
      <div className="ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[10px] text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-2 py-0.5 whitespace-nowrap">
          +5 XP
        </span>
      </div>
    </motion.div>
  );
}

// ─── Subject Panel ─────────────────────────────────────────────────────────────
function SubjectPanel({
  subject,
  isOpen,
  onToggle,
  onTopicToggle,
  addXP,
  playSound,
}) {
  const allTopics = [...subject.topics, ...subject.customTopics];
  const doneCount = allTopics.filter((t) => t.completed).length;
  const totalCount = allTopics.length;
  const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
  const roasts = SUBJECT_ROASTS[subject.id] || ['Study. Just study.'];
  const roast = roasts[Math.floor(Math.random() * roasts.length)];

  const handleTopicToggle = (topicId) => {
    const topicInMain = subject.topics.find((t) => t.id === topicId);
    const topic =
      topicInMain || subject.customTopics.find((t) => t.id === topicId);
    if (!topic) return;

    if (!topic.completed) {
      addXP(5);
      playSound('giggity.mp3');
    }
    onTopicToggle(subject.id, topicId);
  };

  return (
    <motion.div
      layout
      className={`rounded-2xl border overflow-hidden shadow-lg transition-shadow ${
        isOpen
          ? `${subject.glow} border-opacity-60 shadow-lg`
          : 'border-blue-500/20'
      } ${subject.border}`}
    >
      {/* Header */}
      <motion.button
        onClick={onToggle}
        className={`w-full text-left p-5 bg-gradient-to-r from-[#0a1628]/90 to-[#0d2244]/60 flex items-center gap-4 transition-all hover:brightness-110`}
        whileTap={{ scale: 0.99 }}
      >
        <span className="text-3xl shrink-0">{subject.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-display font-black text-white text-lg truncate">
              {subject.title}
            </h3>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                pct === 100
                  ? 'bg-green-500/30 text-green-300'
                  : pct > 60
                  ? 'bg-cyan-500/20 text-cyan-300'
                  : pct > 30
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'bg-rose-500/10 text-rose-400'
              }`}
            >
              {pct === 100 ? '🎉 DONE' : `${pct}%`}
            </span>
          </div>
          {/* Mini progress bar */}
          <div className="h-1.5 bg-blue-900/50 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${subject.color}`}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
          <p className="text-blue-400/60 text-[10px] mt-1">
            {doneCount}/{totalCount} topics
          </p>
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="text-blue-400 text-xl shrink-0"
        >
          ▾
        </motion.span>
      </motion.button>

      {/* Body */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="bg-[#080f1d]/70 border-t border-blue-500/10 p-5">
              {/* Roast quote */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 bg-gradient-to-r from-yellow-500/10 to-orange-500/5 border border-yellow-500/20 rounded-xl p-4 flex gap-3 items-start"
              >
                <span className="text-2xl shrink-0">🍺</span>
                <div>
                  <p className="text-yellow-300/90 text-xs italic leading-relaxed">
                    "{roast}"
                  </p>
                  <p className="text-yellow-600/50 text-[10px] mt-1">
                    — The Drunken Clam Motivational Dept.
                  </p>
                </div>
              </motion.div>

              {/* Topics */}
              <div className="space-y-1">
                {subject.topics.map((topic, i) => (
                  <TopicRow
                    key={topic.id}
                    topic={topic}
                    index={i}
                    onToggle={handleTopicToggle}
                    color={subject.color}
                    subjectId={subject.id}
                  />
                ))}
                {subject.customTopics.map((topic, i) => (
                  <TopicRow
                    key={topic.id}
                    topic={topic}
                    index={subject.topics.length + i}
                    onToggle={handleTopicToggle}
                    color={subject.color}
                    subjectId={subject.id}
                  />
                ))}
              </div>

              {/* Completion celebration */}
              <AnimatePresence>
                {pct === 100 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="mt-5 text-center"
                  >
                    <div className="inline-block bg-green-500/20 border border-green-400/40 rounded-2xl px-5 py-3">
                      <p className="text-green-300 font-display font-bold text-sm">
                        🎉 SECTION CLEARED
                      </p>
                      <p className="text-green-400/60 text-[10px] mt-1">
                        Even Stewie is grudgingly impressed. Don't tell him we
                        said that.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── SyllabusView (main export) ──────────────────────────────────────────────
export default function SyllabusView({
  syllabus,
  setSyllabus,
  activeSub,
  setActiveSub,
  addXP,
  playSound,
}) {
  const [openPanels, setOpenPanels] = useState(
    () => new Set(activeSub ? [activeSub] : [syllabus[0]?.id])
  );

  // Auto-scroll / open activeSub if passed in from Dashboard
  useEffect(() => {
    if (activeSub) {
      setOpenPanels((prev) => new Set([...prev, activeSub]));
      setTimeout(() => {
        document
          .getElementById(`sub-${activeSub}`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }
  }, [activeSub]);

  const togglePanel = (id) => {
    setOpenPanels((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleTopicToggle = (subjectId, topicId) => {
    setSyllabus((prev) =>
      prev.map((sub) => {
        if (sub.id !== subjectId) return sub;
        return {
          ...sub,
          topics: sub.topics.map((t) =>
            t.id === topicId ? { ...t, completed: !t.completed } : t
          ),
          customTopics: sub.customTopics.map((t) =>
            t.id === topicId ? { ...t, completed: !t.completed } : t
          ),
        };
      })
    );
  };

  // Global stats
  const allTopics = syllabus.flatMap((s) => [...s.topics, ...s.customTopics]);
  const totalDone = allTopics.filter((t) => t.completed).length;
  const totalAll = allTopics.length;
  const globalPct = totalAll > 0 ? Math.round((totalDone / totalAll) * 100) : 0;
  const remaining = totalAll - totalDone;

  const randomQuip = COMPLETION_QUIPS[
    Math.floor(Math.random() * COMPLETION_QUIPS.length)
  ].replace('{remaining}', remaining);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06 } },
  };
  const childVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-4xl mx-auto"
    >
      {/* ── Header ── */}
      <motion.div
        variants={childVariants}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a1628] to-[#0d2244] border border-blue-500/30 p-6 shadow-xl"
      >
        <div className="absolute -top-16 -right-16 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">📚</span>
            <div>
              <h1 className="font-display font-black text-3xl text-white">
                The Grind
              </h1>
              <p className="text-blue-400 text-sm mt-0.5">
                UPSC GS Syllabus — Yes, all of it. Don't look at us like that.
              </p>
            </div>
          </div>

          {/* Global Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-blue-300 font-semibold">
                Overall Coverage
              </span>
              <span className="text-blue-400">
                {totalDone} / {totalAll} topics
              </span>
            </div>
            <div className="h-4 bg-blue-900/50 rounded-full overflow-hidden border border-blue-500/20">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${globalPct}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500"
              />
            </div>
            <p className="text-yellow-400/70 text-[11px] italic text-center">
              "{randomQuip}"
            </p>
          </div>

          {/* Quick-filter badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => setOpenPanels(new Set(syllabus.map((s) => s.id)))}
              className="text-[10px] border border-blue-500/30 text-blue-300 px-3 py-1 rounded-full hover:bg-blue-500/10 transition-all"
            >
              Expand All
            </button>
            <button
              onClick={() => setOpenPanels(new Set())}
              className="text-[10px] border border-blue-500/30 text-blue-300 px-3 py-1 rounded-full hover:bg-blue-500/10 transition-all"
            >
              Collapse All
            </button>
            {syllabus.map((sub) => {
              const done = [...sub.topics, ...sub.customTopics].filter(
                (t) => t.completed
              ).length;
              const total = sub.topics.length + sub.customTopics.length;
              const pct = total > 0 ? Math.round((done / total) * 100) : 0;
              return (
                <button
                  key={sub.id}
                  onClick={() => {
                    setOpenPanels(new Set([sub.id]));
                    setTimeout(() => {
                      document
                        .getElementById(`sub-${sub.id}`)
                        ?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className={`text-[10px] px-3 py-1 rounded-full border transition-all ${
                    pct === 100
                      ? 'border-green-500/40 text-green-300 bg-green-500/10'
                      : 'border-blue-500/20 text-blue-400 hover:bg-blue-500/10'
                  }`}
                >
                  {sub.emoji} {sub.title.split(' ')[0]} {pct}%
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ── Subject Panels ── */}
      {syllabus.map((subject) => (
        <motion.div
          key={subject.id}
          id={`sub-${subject.id}`}
          variants={childVariants}
        >
          <SubjectPanel
            subject={subject}
            isOpen={openPanels.has(subject.id)}
            onToggle={() => togglePanel(subject.id)}
            onTopicToggle={handleTopicToggle}
            addXP={addXP}
            playSound={playSound}
          />
        </motion.div>
      ))}

      {/* ── Bottom Roast ── */}
      <motion.div
        variants={childVariants}
        className="text-center py-6 border border-blue-500/10 rounded-2xl bg-[#0a1628]/50"
      >
        <p className="text-4xl mb-2">🍺</p>
        <p className="text-blue-400/60 text-xs italic max-w-md mx-auto">
          "The Drunken Clam doesn't care about your study schedule. Neither does
          the UPSC. One of them is at least honest about it."
        </p>
        <p className="text-blue-600/40 text-[10px] mt-2">
          — Tom Tucker, Quahog 5 News
        </p>
      </motion.div>
    </motion.div>
  );
}

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { INITIAL_OPTIONAL } from './syllabusData';

// ─── Brian's rotating pearls of wisdom ───────────────────────────────────────
const BRIAN_QUOTES = [
  "I spent a semester at Brown auditing a Schopenhauer seminar. I can confirm that The Will to Live is far more important than whatever GDP formula you're desperately memorising right now.",
  "You know what separates the truly educated mind from the UPSC aspirant? One has read Hegel's Phenomenology of Spirit. The other is highlighting 11th-grade NCERT books in four colours.",
  "I've been working on my novel for seven years. Occasionally I pause to sip Scotch and reflect that Wittgenstein — had he appeared in UPSC Mains — would have simply written 'Whereof one cannot speak, thereof one must remain silent.' He'd have scored 158. In Philosophy.",
  'The examined life, Socrates said, is the only life worth living. The unexamined life is, broadly speaking, most GS answer copies.',
  "People ask if my novel is finished. People ask if I've studied. Both questions miss the point. The journey, much like Heidegger's Being-in-the-world, IS the destination. Also, I haven't studied.",
];

// ─── Colour palette per paper ─────────────────────────────────────────────────
const PAPER_PALETTE = {
  phil1: {
    accent: 'from-amber-400 to-yellow-300',
    border: 'border-amber-400/40',
    badge: 'bg-amber-400/15 text-amber-300 border border-amber-400/30',
    check: 'accent-amber-400',
    sectionBg: 'bg-amber-400/5',
    sectionBorder: 'border-amber-400/20',
    glow: 'shadow-amber-400/20',
    dot: 'bg-amber-400',
  },
  phil2: {
    accent: 'from-cyan-400 to-sky-300',
    border: 'border-cyan-400/40',
    badge: 'bg-cyan-400/15 text-cyan-300 border border-cyan-400/30',
    check: 'accent-cyan-400',
    sectionBg: 'bg-cyan-400/5',
    sectionBorder: 'border-cyan-400/20',
    glow: 'shadow-cyan-400/20',
    dot: 'bg-cyan-400',
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function buildInitialChecked(papers) {
  const checked = {};
  papers.forEach((paper) =>
    paper.sections.forEach((sec) =>
      [...sec.topics, ...(sec.customTopics || [])].forEach((t) => {
        checked[t.id] = t.completed;
      })
    )
  );
  return checked;
}

// ─── Topic Checkbox Row ───────────────────────────────────────────────────────
function TopicRow({ topic, checked, onToggle, accent, dotColor }) {
  return (
    <motion.label
      layout
      whileHover={{ x: 4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="flex items-start gap-3 cursor-pointer group rounded-xl px-3 py-2.5 hover:bg-white/5 transition-colors"
    >
      {/* Custom checkbox */}
      <div className="relative mt-0.5 shrink-0">
        <input
          type="checkbox"
          checked={!!checked[topic.id]}
          onChange={() => onToggle(topic.id)}
          className="sr-only"
        />
        <motion.div
          animate={{
            backgroundColor: checked[topic.id] ? '#facc15' : 'transparent',
            borderColor: checked[topic.id] ? '#facc15' : '#4b6a9b',
            scale: checked[topic.id] ? [1, 1.2, 1] : 1,
          }}
          transition={{ duration: 0.2 }}
          className="w-5 h-5 rounded-md border-2 flex items-center justify-center"
        >
          <AnimatePresence>
            {checked[topic.id] && (
              <motion.svg
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.15 }}
                viewBox="0 0 10 8"
                className="w-3 h-3 fill-none stroke-[#0a1628] stroke-2"
              >
                <polyline points="1,4 4,7 9,1" />
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Topic text */}
      <span
        className={`text-sm leading-snug transition-all duration-300 ${
          checked[topic.id]
            ? 'line-through text-blue-700/50'
            : 'text-blue-100 group-hover:text-white'
        }`}
      >
        {topic.text}
      </span>
    </motion.label>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function SectionCard({
  section,
  checked,
  onToggle,
  palette,
  xpPerTopic,
  addXP,
  playSound,
}) {
  const allTopics = [...section.topics, ...(section.customTopics || [])];
  const doneCount = allTopics.filter((t) => checked[t.id]).length;
  const pct =
    allTopics.length > 0 ? Math.round((doneCount / allTopics.length) * 100) : 0;

  const handleToggle = (id) => {
    const wasChecked = checked[id];
    onToggle(id);
    if (!wasChecked) {
      addXP(xpPerTopic);
      playSound && playSound('correct.mp3');
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border ${palette.sectionBorder} ${palette.sectionBg} overflow-hidden`}
    >
      {/* Section header */}
      <div className="px-4 py-3 flex items-center justify-between gap-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full shrink-0 ${palette.dot}`} />
          <h4 className="font-display font-bold text-white text-sm">
            {section.heading}
          </h4>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${palette.badge}`}
          >
            {doneCount}/{allTopics.length}
          </span>
        </div>
      </div>

      {/* Progress strip */}
      <div className="h-1 bg-blue-900/40">
        <motion.div
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full bg-gradient-to-r ${palette.accent}`}
        />
      </div>

      {/* Topics */}
      <div className="p-2 space-y-0.5">
        {allTopics.map((topic) => (
          <TopicRow
            key={topic.id}
            topic={topic}
            checked={checked}
            onToggle={handleToggle}
            palette={palette}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function OptionalSubject({
  optional = INITIAL_OPTIONAL,
  setOptional,
  addXP,
  playSound,
}) {
  const [checked, setChecked] = useState(() =>
    buildInitialChecked(optional.papers)
  );
  const [quoteIdx] = useState(() =>
    Math.floor(Math.random() * BRIAN_QUOTES.length)
  );
  const [expandedPaper, setExpandedPaper] = useState('phil1');

  const handleToggle = (id) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Overall stats
  const { totalTopics, doneTopics } = useMemo(() => {
    let total = 0,
      done = 0;
    optional.papers.forEach((p) =>
      p.sections.forEach((s) => {
        const topics = [...s.topics, ...(s.customTopics || [])];
        total += topics.length;
        done += topics.filter((t) => checked[t.id]).length;
      })
    );
    return { totalTopics: total, doneTopics: done };
  }, [checked, optional.papers]);

  const overallPct =
    totalTopics > 0 ? Math.round((doneTopics / totalTopics) * 100) : 0;

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-4xl mx-auto"
    >
      {/* ── Hero Header ──────────────────────────────────────────────── */}
      <motion.div
        variants={cardVariants}
        className="relative overflow-hidden rounded-3xl border border-yellow-400/30 bg-gradient-to-br from-[#0a1628] via-[#0f1e36] to-[#0a1628] shadow-xl shadow-yellow-400/10"
      >
        {/* Glow blobs */}
        <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-yellow-400/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-56 h-56 rounded-full bg-amber-500/8 blur-3xl pointer-events-none" />

        {/* Gold gradient top stripe */}
        <div className="h-1 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500" />

        <div className="relative z-10 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Brian character */}
            <motion.div
              whileHover={{ scale: 1.06, rotate: [-1, 1, -1, 0] }}
              className="shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 border-yellow-400/40 bg-blue-900/30 flex items-center justify-center"
            >
              <img
                src={optional.characterImg || '/images/brian-philosopher.png'}
                alt={optional.characterAlt || 'Brian'}
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden w-full h-full items-center justify-center text-5xl">
                🐶
              </div>
            </motion.div>

            {/* Title + quote */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-widest text-yellow-500/80">
                  Optional Subject
                </span>
                <span className="w-1 h-1 rounded-full bg-yellow-500/50" />
                <span className="text-xs text-yellow-400/60">
                  Brian's Pretension Corner™
                </span>
              </div>
              <h1 className="font-display font-black text-3xl sm:text-4xl text-white leading-tight">
                🏛️ Philosophy
              </h1>
              <p className="text-yellow-300/70 text-xs mt-1 font-medium">
                UPSC Mains — Paper 1 & Paper 2
              </p>

              {/* Brian quote */}
              <motion.blockquote
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-3 italic text-sm text-yellow-100/80 border-l-2 border-yellow-400/50 pl-3 leading-relaxed"
              >
                "{BRIAN_QUOTES[quoteIdx]}"
                <footer className="not-italic text-yellow-500/60 text-[11px] mt-1">
                  — Brian Griffin, unfinished novelist & armchair philosopher
                </footer>
              </motion.blockquote>
            </div>
          </div>

          {/* Overall progress */}
          <div className="mt-6 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-blue-300 font-semibold">
                📊 Overall Progress
              </span>
              <span className="text-blue-400">
                {doneTopics} / {totalTopics} topics ·{' '}
                <span className="text-yellow-300 font-bold">{overallPct}%</span>
              </span>
            </div>
            <div className="h-3 bg-blue-900/60 rounded-full overflow-hidden border border-yellow-400/20">
              <motion.div
                animate={{ width: `${overallPct}%` }}
                initial={{ width: 0 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 shadow-sm shadow-yellow-400/40"
              />
            </div>
            {overallPct === 0 && (
              <p className="text-blue-500/60 text-[11px] italic text-center mt-1">
                Brian hasn't started his novel either. You're in good company.
                Bad company, but good company.
              </p>
            )}
            {overallPct === 100 && (
              <p className="text-yellow-300 text-[11px] font-bold text-center mt-1">
                🎉 PHILOSOPHY COMPLETE. Brian is weeping. His novel remains
                unfinished.
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Paper Tabs ──────────────────────────────────────────────────── */}
      <motion.div variants={cardVariants} className="flex gap-2">
        {optional.papers.map((paper) => {
          const pal = PAPER_PALETTE[paper.id] || PAPER_PALETTE.phil1;
          const allT = paper.sections.flatMap((s) => [
            ...s.topics,
            ...(s.customTopics || []),
          ]);
          const doneT = allT.filter((t) => checked[t.id]).length;
          const pct =
            allT.length > 0 ? Math.round((doneT / allT.length) * 100) : 0;
          const active = expandedPaper === paper.id;

          return (
            <motion.button
              key={paper.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setExpandedPaper(active ? null : paper.id)}
              className={`flex-1 rounded-2xl p-4 text-left border transition-all duration-200 ${
                active
                  ? `bg-gradient-to-br from-[#0a1628] to-[#0f1e36] ${pal.border} shadow-lg ${pal.glow}`
                  : 'bg-[#0a1628]/50 border-blue-500/10 hover:border-blue-500/25'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p
                    className={`font-display font-bold text-sm leading-tight ${
                      active ? 'text-white' : 'text-blue-400'
                    }`}
                  >
                    {paper.title}
                  </p>
                  <p className="text-blue-500/60 text-[10px] mt-0.5">
                    {doneT}/{allT.length} topics
                  </p>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-1">
                  <span
                    className={`text-xs font-black ${
                      active ? 'text-yellow-300' : 'text-blue-500'
                    }`}
                  >
                    {pct}%
                  </span>
                  <span
                    className={`text-[11px] transition-transform ${
                      active ? 'rotate-180' : ''
                    }`}
                  >
                    ▾
                  </span>
                </div>
              </div>
              {/* Mini progress bar */}
              <div className="mt-2 h-1 bg-blue-900/50 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${pct}%` }}
                  className={`h-full rounded-full bg-gradient-to-r ${pal.accent}`}
                />
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      {/* ── Sections for active paper ──────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {optional.papers.map((paper) => {
          if (paper.id !== expandedPaper) return null;
          const pal = PAPER_PALETTE[paper.id] || PAPER_PALETTE.phil1;

          return (
            <motion.div
              key={paper.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              {paper.sections.map((section) => (
                <SectionCard
                  key={section.id}
                  section={section}
                  checked={checked}
                  onToggle={handleToggle}
                  palette={pal}
                  xpPerTopic={15}
                  addXP={addXP}
                  playSound={playSound}
                />
              ))}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* ── Footer wisdom ───────────────────────────────────────────────── */}
      <motion.div
        variants={cardVariants}
        className="bg-[#0a1628]/60 border border-blue-500/10 rounded-2xl p-4 text-center"
      >
        <p className="text-blue-500/50 text-xs italic">
          📖 "Philosophy is the love of wisdom. UPSC is the wisdom of studying
          philosophy only if it gets you marks." — Peter Griffin (probably)
        </p>
        <p className="text-blue-600/40 text-[10px] mt-1">
          Each topic checked = +15 XP · Brian gets +0 XP because he's not real
        </p>
      </motion.div>
    </motion.div>
  );
}

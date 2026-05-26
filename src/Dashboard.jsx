import { motion } from 'framer-motion';
import { getLevelInfo, LEVELS } from './App';
import { useEvilMode } from './App';

// ─── Flavour text ──────────────────────────────────────────────────────────────
const LEVEL_ROASTS = {
  Meg: 'Truly tragic. The syllabus has seen better aspirants.',
  Chris: "Progress! You're now as smart as Chris on a good day.",
  Cleveland: 'Steady. Cleveland once read a newspaper and nothing exploded.',
  'Joe Swanson': 'Disabled by laziness no more! Joe would be proud.',
  Quagmire: "Giggity! You're somehow doing better than expected.",
  'Brian Griffin': 'Writing a novel AND studying? Brian would respect this.',
  'Stewie Griffin': 'Excellent. World domination begins with GS Paper 1.',
  'Lois Griffin':
    'Holding everything together. The backbone of Quahog salutes you.',
  'Peter Griffin': 'Against all odds, Peter has left the building.',
  'Evil Monkey': 'The finger is now pointing at the UPSC exam.',
  Death: "You've studied so much, Death himself is taking notes.",
  'Mayor West': 'PEAK. You are Adam West. Quahog is yours.',
};

const CHARACTER_IMGS = {
  Meg: '/images/meg-sad.png',
  Chris: '/images/chris-happy.png',
  Cleveland: '/images/cleveland-smile.png',
  'Joe Swanson': '/images/joe-salute.png',
  Quagmire: '/images/quagmire-thumbs.png',
  'Brian Griffin': '/images/brian-read.png',
  'Stewie Griffin': '/images/stewie-plan.png',
  'Lois Griffin': '/images/lois-proud.png',
  'Peter Griffin': '/images/peter-beer.png',
  'Evil Monkey': '/images/evil-monkey.png',
  Death: '/images/death-scythe.png',
  'Mayor West': '/images/mayor-west.png',
};

const CHAR_FALLBACK = {
  Meg: '😢',
  Chris: '😄',
  Cleveland: '😊',
  'Joe Swanson': '💪',
  Quagmire: '😏',
  'Brian Griffin': '🐶',
  'Stewie Griffin': '👶',
  'Lois Griffin': '👩',
  'Peter Griffin': '🧔',
  'Evil Monkey': '🐒',
  Death: '💀',
  'Mayor West': '👴',
};

// ─── Comic-book spring ─────────────────────────────────────────────────────────
const COMIC_SPRING = { type: 'spring', stiffness: 400, damping: 20 };

// ─── Comic-book 3D card wrapper ────────────────────────────────────────────────
// Pops the card toward the viewer on hover, slaps on a thick black border
// and a hard offset shadow — like a Sunday-strip panel deciding it's better than you.
function ComicCard({
  children,
  className = '',
  onClick,
  evilMode,
  intensity = 1,
}) {
  const shadowColor = evilMode ? 'rgba(180,0,0,0.9)' : 'rgba(0,0,0,1)';
  const borderColor = evilMode ? '#7f1d1d' : '#000';

  return (
    <motion.div
      onClick={onClick}
      whileHover={{
        y: -6 * intensity,
        rotateX: 3 * intensity,
        rotateY: -2 * intensity,
        scale: 1.025 * intensity,
        boxShadow: `${8 * intensity}px ${8 * intensity}px 0px ${shadowColor}`,
        borderColor,
      }}
      whileTap={{
        y: -1,
        scale: 0.98,
        boxShadow: `2px 2px 0px ${shadowColor}`,
      }}
      transition={COMIC_SPRING}
      style={{
        perspective: 800,
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: 'transparent',
      }}
      className={`cursor-pointer transition-colors duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ value, label, valueClass, evilMode }) {
  return (
    <ComicCard
      evilMode={evilMode}
      intensity={0.9}
      className="rounded-2xl"
      style={{ borderColor: 'transparent' }}
    >
      <div
        className="rounded-2xl p-5 flex flex-col items-center justify-center gap-1 text-center transition-colors duration-500"
        style={{
          backgroundColor: evilMode
            ? 'rgba(19,0,0,0.80)'
            : 'rgba(10,22,40,0.70)',
          border: 'inherit',
        }}
      >
        <span className={`text-3xl font-display font-black ${valueClass}`}>
          {value}
        </span>
        <span className="text-blue-400 text-xs">{label}</span>
      </div>
    </ComicCard>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard({
  user,
  xp,
  ales,
  syllabus,
  setView,
  setActiveSub,
}) {
  const { current, next, progress } = getLevelInfo(xp);
  const { evilMode } = useEvilMode();

  // Completion stats
  const allTopics = syllabus.flatMap((s) => [...s.topics, ...s.customTopics]);
  const completedCount = allTopics.filter((t) => t.completed).length;
  const totalCount = allTopics.length;
  const completionPct =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const roast = LEVEL_ROASTS[current.name] || 'Keep going.';
  const charImg = CHARACTER_IMGS[current.name] || '';

  // Evil-mode override colours
  const accentText = evilMode ? 'text-red-400' : 'text-cyan-300';
  const accentBg = evilMode ? 'bg-red-900/20' : 'bg-blue-500/20';
  const accentBorder = evilMode ? 'border-red-600/40' : 'border-blue-500/30';
  const cardBg = evilMode ? 'rgba(19,0,0,0.75)' : 'rgba(10,22,40,0.70)';
  const barGradient = evilMode
    ? 'linear-gradient(to right, #dc2626, #7f1d1d)'
    : 'linear-gradient(to right, #22d3ee, #facc15)';
  const heroGradient = evilMode
    ? 'linear-gradient(135deg, #0a0000 0%, #1a0000 100%)'
    : 'linear-gradient(135deg, #0a1628 0%, #0d2244 100%)';
  const glowColor = evilMode ? 'rgba(220,38,38,0.12)' : 'rgba(6,182,212,0.10)';

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
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
      className="space-y-8"
    >
      {/* ── Hero ─────────────────────────────────── */}
      <motion.div variants={cardVariants}>
        <ComicCard
          evilMode={evilMode}
          intensity={0.8}
          className="rounded-3xl overflow-hidden"
        >
          <div
            className="relative overflow-hidden border transition-colors duration-500"
            style={{
              background: heroGradient,
              borderColor: evilMode
                ? 'rgba(220,38,38,0.35)'
                : 'rgba(59,130,246,0.3)',
              borderRadius: 'inherit',
            }}
          >
            {/* Glow blobs */}
            <div
              className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl pointer-events-none"
              style={{ backgroundColor: glowColor }}
            />
            <div
              className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full blur-3xl pointer-events-none"
              style={{
                backgroundColor: evilMode
                  ? 'rgba(127,0,0,0.08)'
                  : 'rgba(250,204,21,0.08)',
              }}
            />

            <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
              {/* Character portrait */}
              <motion.div
                whileHover={{ scale: 1.07, rotate: [-2, 2, -2, 0] }}
                className={`relative shrink-0 w-28 h-28 rounded-2xl overflow-hidden border-2 flex items-center justify-center ${
                  evilMode
                    ? 'border-red-600/50 bg-red-950/30'
                    : 'border-cyan-500/40 bg-blue-900/30'
                }`}
              >
                <img
                  src={charImg}
                  alt={current.name}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden w-full h-full items-center justify-center text-5xl">
                  {CHAR_FALLBACK[current.name] || '🎓'}
                </div>
              </motion.div>

              {/* Text */}
              <div className="flex-1 text-center sm:text-left">
                <p
                  className={`text-sm font-medium ${
                    evilMode ? 'text-red-400' : 'text-blue-400'
                  }`}
                >
                  {evilMode ? 'OPERATIVE IDENTIFIED:' : 'Welcome back,'}
                </p>
                <h1 className="font-display font-black text-3xl sm:text-4xl text-white mt-0.5">
                  {user}
                </h1>
                <p
                  className={`text-sm italic mt-1 ${
                    evilMode ? 'text-red-300' : 'text-cyan-300'
                  }`}
                >
                  "
                  {evilMode
                    ? 'Excellent. Your mediocrity amuses me. — Stewie'
                    : roast}
                  "
                </p>

                {/* XP bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`font-semibold ${
                        evilMode ? 'text-red-300' : 'text-blue-300'
                      }`}
                    >
                      Level {current.level}: {current.name}
                    </span>
                    <span
                      className={evilMode ? 'text-red-400' : 'text-blue-400'}
                    >
                      {xp} / {next.minXP} XP
                    </span>
                  </div>
                  <div
                    className="h-3 rounded-full overflow-hidden border"
                    style={{
                      backgroundColor: evilMode
                        ? 'rgba(127,0,0,0.3)'
                        : 'rgba(30,58,138,0.6)',
                      borderColor: evilMode
                        ? 'rgba(220,38,38,0.25)'
                        : 'rgba(59,130,246,0.2)',
                    }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full rounded-full shadow-sm"
                      style={{ background: barGradient }}
                    />
                  </div>
                  <p
                    className="text-[10px]"
                    style={{
                      color: evilMode
                        ? 'rgba(248,113,113,0.5)'
                        : 'rgba(147,197,253,0.7)',
                    }}
                  >
                    Next: Level {next.level} – {next.name}
                  </p>
                </div>
              </div>

              {/* Ale counter */}
              <motion.div
                whileHover={{
                  scale: 1.08,
                  y: -4,
                  boxShadow: evilMode
                    ? '6px 6px 0px rgba(0,0,0,1)'
                    : '6px 6px 0px rgba(0,0,0,1)',
                  borderColor: evilMode ? '#7f1d1d' : '#000',
                }}
                whileTap={{ scale: 0.96, y: 0 }}
                transition={COMIC_SPRING}
                style={{ border: '2px solid transparent' }}
                className={`shrink-0 rounded-2xl p-4 flex flex-col items-center gap-1 ${
                  evilMode ? 'bg-red-950/40' : 'bg-yellow-500/10'
                }`}
              >
                <span className="text-3xl">{evilMode ? '💀' : '🍺'}</span>
                <span
                  className={`font-display font-black text-2xl ${
                    evilMode ? 'text-red-300' : 'text-yellow-300'
                  }`}
                >
                  {ales}
                </span>
                <span
                  className="text-[10px] uppercase tracking-wider"
                  style={{
                    color: evilMode
                      ? 'rgba(252,165,165,0.6)'
                      : 'rgba(234,179,8,0.7)',
                  }}
                >
                  {evilMode ? 'Skulls Collected' : 'Pawtucket Ales'}
                </span>
              </motion.div>
            </div>
          </div>
        </ComicCard>
      </motion.div>

      {/* ── Quick Stats ──────────────────────────── */}
      <motion.div
        variants={cardVariants}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        <StatCard
          value={xp}
          label="Total XP"
          valueClass={evilMode ? 'text-red-300' : 'text-cyan-300'}
          evilMode={evilMode}
        />
        <StatCard
          value={ales}
          label={evilMode ? 'Skulls' : 'Pawtucket Ales'}
          valueClass={evilMode ? 'text-red-400' : 'text-yellow-300'}
          evilMode={evilMode}
        />
        <StatCard
          value={completedCount}
          label="Topics Done"
          valueClass="text-green-300"
          evilMode={evilMode}
        />
        <StatCard
          value={`${completionPct}%`}
          label="Syllabus Covered"
          valueClass="text-purple-300"
          evilMode={evilMode}
        />
      </motion.div>

      {/* ── Overall progress bar ─────────────────── */}
      <motion.div variants={cardVariants}>
        <ComicCard evilMode={evilMode} intensity={0.7} className="rounded-2xl">
          <div
            className="rounded-2xl p-5 border transition-colors duration-500"
            style={{
              backgroundColor: cardBg,
              borderColor: evilMode
                ? 'rgba(220,38,38,0.2)'
                : 'rgba(59,130,246,0.2)',
            }}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-display font-bold text-white text-sm">
                {evilMode
                  ? '🔴 Domination Progress'
                  : '📊 Overall Syllabus Progress'}
              </h3>
              <span
                className={`text-xs ${
                  evilMode ? 'text-red-400' : 'text-blue-400'
                }`}
              >
                {completedCount} / {totalCount} topics
              </span>
            </div>
            <div
              className="h-4 rounded-full overflow-hidden border"
              style={{
                backgroundColor: evilMode
                  ? 'rgba(127,0,0,0.3)'
                  : 'rgba(30,58,138,0.6)',
                borderColor: evilMode
                  ? 'rgba(220,38,38,0.2)'
                  : 'rgba(59,130,246,0.2)',
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionPct}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{
                  background: evilMode
                    ? 'linear-gradient(to right, #dc2626, #ef4444, #b91c1c)'
                    : 'linear-gradient(to right, #4ade80, #22d3ee, #3b82f6)',
                }}
              />
            </div>
            {completionPct === 0 && (
              <p
                className="text-xs mt-2 italic text-center"
                style={{
                  color: evilMode
                    ? 'rgba(248,113,113,0.5)'
                    : 'rgba(147,197,253,0.5)',
                }}
              >
                {evilMode
                  ? 'My interns had more initiative. Disappointing.'
                  : "Peter hasn't started either. Except Peter has an excuse (beer). What's yours?"}
              </p>
            )}
            {completionPct === 100 && (
              <p className="text-green-300 text-xs mt-2 font-bold text-center">
                🎉 FULL SYLLABUS CLEARED. Mayor West is writing you a personal
                letter.
              </p>
            )}
          </div>
        </ComicCard>
      </motion.div>

      {/* ── Level Roadmap ─────────────────────────── */}
      <motion.div variants={cardVariants}>
        <ComicCard evilMode={evilMode} intensity={0.6} className="rounded-2xl">
          <div
            className="rounded-2xl p-5 border transition-colors duration-500"
            style={{
              backgroundColor: cardBg,
              borderColor: evilMode
                ? 'rgba(220,38,38,0.2)'
                : 'rgba(59,130,246,0.2)',
            }}
          >
            <h3 className="font-display font-bold text-white text-sm mb-4">
              {evilMode
                ? '💀 Villainy Ladder – Quahog Edition'
                : '🗺️ Level Roadmap – Quahog Edition'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {LEVELS.map((lvl) => {
                const unlocked = xp >= lvl.minXP;
                const isCurrent = current.level === lvl.level;
                return (
                  <motion.div
                    key={lvl.level}
                    whileHover={{
                      scale: 1.12,
                      y: -3,
                      boxShadow: evilMode
                        ? '3px 3px 0px rgba(0,0,0,1)'
                        : '3px 3px 0px rgba(0,0,0,1)',
                      borderColor: '#000',
                    }}
                    transition={COMIC_SPRING}
                    style={{ border: '2px solid transparent' }}
                    className={`text-[11px] rounded-xl px-3 py-1.5 font-bold transition-all cursor-default ${
                      isCurrent
                        ? evilMode
                          ? 'bg-red-900/40 text-red-200'
                          : 'bg-cyan-500/20 text-cyan-200'
                        : unlocked
                        ? evilMode
                          ? 'bg-red-950/40 text-red-400'
                          : 'bg-green-500/10 text-green-300'
                        : evilMode
                        ? 'bg-black/30 text-red-900'
                        : 'bg-blue-900/20 text-blue-600'
                    }`}
                  >
                    {unlocked ? '✓' : '🔒'} Lv.{lvl.level} {lvl.name}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </ComicCard>
      </motion.div>

      {/* ── Subject Cards ─────────────────────────── */}
      <motion.div variants={cardVariants}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-black text-xl text-white">
            {evilMode ? '🔴 Target Subjects' : '📚 Your Subjects'}
          </h2>
          <motion.button
            whileHover={{
              scale: 1.07,
              y: -3,
              boxShadow: '5px 5px 0px rgba(0,0,0,1)',
              borderColor: '#000',
            }}
            whileTap={{
              scale: 0.95,
              y: 0,
              boxShadow: '1px 1px 0px rgba(0,0,0,1)',
            }}
            transition={COMIC_SPRING}
            onClick={() => setView('syllabus')}
            style={{ border: '2px solid transparent' }}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
              evilMode
                ? 'text-red-400 hover:text-red-300'
                : 'text-cyan-400 hover:text-cyan-300'
            }`}
          >
            View All →
          </motion.button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {syllabus.map((sub) => {
            const total = sub.topics.length + sub.customTopics.length;
            const done = [...sub.topics, ...sub.customTopics].filter(
              (t) => t.completed
            ).length;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;

            return (
              <motion.button
                key={sub.id}
                whileHover={{
                  scale: 1.04,
                  y: -6,
                  rotateX: 4,
                  rotateY: -3,
                  boxShadow: evilMode
                    ? '8px 8px 0px rgba(0,0,0,1)'
                    : '8px 8px 0px rgba(0,0,0,1)',
                  borderColor: '#000',
                }}
                whileTap={{
                  scale: 0.97,
                  y: 0,
                  boxShadow: '2px 2px 0px rgba(0,0,0,1)',
                }}
                transition={COMIC_SPRING}
                onClick={() => {
                  setActiveSub(sub.id);
                  setView('syllabus');
                }}
                style={{ perspective: 800, border: '2px solid transparent' }}
                className={`group text-left bg-gradient-to-br ${sub.color} p-[1px] rounded-2xl shadow-lg ${sub.glow}`}
              >
                <div
                  className="rounded-2xl p-4 h-full flex flex-col gap-3 transition-colors duration-500"
                  style={{ backgroundColor: evilMode ? '#130000' : '#0a1628' }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{sub.emoji}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        pct === 100
                          ? 'bg-green-500/20 text-green-300'
                          : pct > 50
                          ? evilMode
                            ? 'bg-red-500/20 text-red-300'
                            : 'bg-cyan-500/20 text-cyan-300'
                          : 'bg-blue-900/40 text-blue-400'
                      }`}
                    >
                      {pct}%
                    </span>
                  </div>
                  <div>
                    <p className="font-display font-bold text-sm text-white leading-tight">
                      {sub.title}
                    </p>
                    <p className="text-blue-400 text-[10px] mt-1">
                      {done}/{total} topics
                    </p>
                  </div>
                  <div className="h-1.5 bg-blue-900/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${sub.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-blue-500/70 italic line-clamp-2">
                    {evilMode ? 'Target acquired. Proceed.' : sub.snarkyDesc}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* ── CTA Row ───────────────────────────────── */}
      <motion.div
        variants={cardVariants}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3"
      >
        {/* Quiz CTA */}
        <motion.button
          whileHover={{
            scale: 1.04,
            y: -7,
            rotateX: 5,
            rotateY: -3,
            boxShadow: '8px 8px 0px rgba(0,0,0,1)',
            borderColor: '#000',
          }}
          whileTap={{
            scale: 0.97,
            y: 0,
            boxShadow: '2px 2px 0px rgba(0,0,0,1)',
          }}
          transition={COMIC_SPRING}
          onClick={() => setView('quiz')}
          style={{ perspective: 800, border: '2px solid transparent' }}
          className={`rounded-2xl p-5 text-left shadow-lg border-purple-500/30 hover:shadow-purple-500/40 transition-shadow ${
            evilMode
              ? 'bg-gradient-to-br from-red-950 to-red-900 border border-red-800'
              : 'bg-gradient-to-br from-purple-600 to-pink-600 border border-purple-500/30 shadow-purple-900/30'
          }`}
        >
          <span className="text-3xl">{evilMode ? '🎯' : '🧠'}</span>
          <p className="font-display font-bold text-white mt-2">
            {evilMode ? "Stewie's Interrogation" : "Tom Tucker's Pop Quiz"}
          </p>
          <p
            className={`text-xs mt-1 ${
              evilMode ? 'text-red-300' : 'text-purple-300'
            }`}
          >
            {evilMode
              ? 'Answer correctly, or face consequences. Unpleasant ones.'
              : "Answer or face Peter's knee animation. Your choice."}
          </p>
        </motion.button>

        {/* Optional CTA */}
        <motion.button
          whileHover={{
            scale: 1.04,
            y: -7,
            rotateX: 5,
            rotateY: 2,
            boxShadow: '8px 8px 0px rgba(0,0,0,1)',
            borderColor: '#000',
          }}
          whileTap={{
            scale: 0.97,
            y: 0,
            boxShadow: '2px 2px 0px rgba(0,0,0,1)',
          }}
          transition={COMIC_SPRING}
          onClick={() => setView('optional')}
          style={{ perspective: 800, border: '2px solid transparent' }}
          className={`rounded-2xl p-5 text-left shadow-lg transition-shadow ${
            evilMode
              ? 'bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-600 shadow-zinc-900/30'
              : 'bg-gradient-to-br from-amber-600 to-orange-600 border border-amber-500/30 shadow-amber-900/30'
          }`}
        >
          <span className="text-3xl">🏛️</span>
          <p className="font-display font-bold text-white mt-2">
            {evilMode ? "Brian's Pretension Corner" : 'Philosophy Optional'}
          </p>
          <p
            className={`text-xs mt-1 ${
              evilMode ? 'text-zinc-400' : 'text-amber-200'
            }`}
          >
            {evilMode
              ? 'Brian. Still working on that novel. Still insufferable.'
              : "Brian spent 5 years on his novel. Don't be Brian."}
          </p>
        </motion.button>

        {/* Study tip */}
        <motion.div
          whileHover={{
            scale: 1.02,
            y: -4,
            boxShadow: '6px 6px 0px rgba(0,0,0,1)',
            borderColor: '#000',
          }}
          whileTap={{ scale: 0.98, y: 0 }}
          transition={COMIC_SPRING}
          style={{ border: '2px solid transparent' }}
          className="rounded-2xl p-5 transition-colors duration-500"
          css={{ backgroundColor: cardBg }}
          // inline style for dynamic bg:
          // (Tailwind can't do dynamic values, so we do this inline)
        >
          <div
            style={{ backgroundColor: cardBg, borderRadius: 'inherit' }}
            className="-m-5 p-5 rounded-2xl h-full"
          >
            <span className="text-3xl">{evilMode ? '📡' : '📖'}</span>
            <p className="font-display font-bold text-white mt-2">
              {evilMode ? 'Intel Report' : 'Study Tip'}
            </p>
            <p
              className={`text-xs mt-1 italic ${
                evilMode ? 'text-red-400/80' : 'text-blue-400'
              }`}
            >
              {evilMode
                ? '"The enemy (the UPSC board) expects you to be unprepared. Prove them right. Or don\'t." — Stewie'
                : '"The Pomodoro Technique: 25 min study, 5 min stare at wall like Peter. Repeat."'}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

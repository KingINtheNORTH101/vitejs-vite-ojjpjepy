import { motion, AnimatePresence } from 'framer-motion';
import { getLevelInfo } from './App';
import { useEvilMode } from './App';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Hub', icon: '🍺' },
  { id: 'syllabus', label: 'Syllabus', icon: '📚' },
  { id: 'quiz', label: 'Pop Quiz', icon: '🧠' },
  { id: 'optional', label: 'Optional', icon: '🏛️' },
];

// ─── Comic-book 3D hover spring config ───────────────────────────────────────
const COMIC_SPRING = { type: 'spring', stiffness: 420, damping: 22 };

// ─── Ray Gun SVG icon (Stewie-approved) ──────────────────────────────────────
function RayGunIcon({ active, evilMode }) {
  return (
    <svg
      viewBox="0 0 28 20"
      className="w-6 h-5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Barrel */}
      <rect
        x="1"
        y="7"
        width="16"
        height="6"
        rx="2"
        fill={active ? (evilMode ? '#dc2626' : '#22d3ee') : '#334155'}
        stroke={active ? (evilMode ? '#7f1d1d' : '#0e7490') : '#1e293b'}
        strokeWidth="1.2"
      />
      {/* Muzzle tip */}
      <rect
        x="17"
        y="8.5"
        width="5"
        height="3"
        rx="1"
        fill={active ? (evilMode ? '#ef4444' : '#67e8f9') : '#475569'}
      />
      {/* Emitter dot */}
      <circle
        cx="22.5"
        cy="10"
        r="1.2"
        fill={active ? (evilMode ? '#fca5a5' : '#fff') : '#64748b'}
      />
      {/* Handle */}
      <rect
        x="5"
        y="13"
        width="5"
        height="6"
        rx="1.5"
        fill={active ? (evilMode ? '#b91c1c' : '#0891b2') : '#1e293b'}
        stroke={active ? (evilMode ? '#7f1d1d' : '#0e7490') : '#0f172a'}
        strokeWidth="1"
      />
      {/* Energy bolt (only when active) */}
      {active && (
        <>
          <line
            x1="22"
            y1="10"
            x2="26"
            y2="10"
            stroke={evilMode ? '#fca5a5' : '#e0f2fe'}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle
            cx="26.5"
            cy="10"
            r="0.9"
            fill={evilMode ? '#f87171' : '#bae6fd'}
          />
        </>
      )}
    </svg>
  );
}

// ─── Evil-mode toggle button ──────────────────────────────────────────────────
function EvilToggle({ evilMode, onToggle }) {
  return (
    <motion.button
      onClick={onToggle}
      whileHover={{
        scale: 1.08,
        y: -2,
        boxShadow: evilMode
          ? '4px 4px 0px rgba(0,0,0,1)'
          : '4px 4px 0px rgba(0,0,0,1)',
      }}
      whileTap={{ scale: 0.93, y: 0, boxShadow: '1px 1px 0px rgba(0,0,0,1)' }}
      transition={COMIC_SPRING}
      title={
        evilMode
          ? 'Disarm Stewie (disable evil mode)'
          : "Activate Stewie's Armory"
      }
      aria-label="Toggle evil mode"
      className={`relative flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 font-bold text-xs transition-colors duration-300 ${
        evilMode
          ? 'bg-red-950 border-red-600 text-red-300 shadow-red-900/60'
          : 'bg-slate-800 border-slate-600 text-slate-300'
      }`}
    >
      <RayGunIcon active={evilMode} evilMode={evilMode} />

      {/* Pill track */}
      <div
        className={`w-9 h-5 rounded-full border-2 transition-colors duration-300 relative ${
          evilMode
            ? 'bg-red-700 border-red-500'
            : 'bg-slate-700 border-slate-500'
        }`}
      >
        <motion.div
          animate={{ x: evilMode ? 16 : 2 }}
          transition={COMIC_SPRING}
          className={`absolute top-0.5 w-3.5 h-3.5 rounded-full shadow-md ${
            evilMode ? 'bg-red-300' : 'bg-slate-400'
          }`}
        />
      </div>

      {/* Label */}
      <AnimatePresence mode="wait">
        <motion.span
          key={evilMode ? 'evil' : 'normal'}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.15 }}
          className="hidden lg:inline whitespace-nowrap"
        >
          {evilMode ? '🔴 EVIL MODE' : "Stewie's Armory"}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
export default function Navbar({ user, xp, ales, view, setView, onLogout }) {
  const { current } = getLevelInfo(xp);
  const { evilMode, toggleEvilMode } = useEvilMode();

  // Comic-book nav item style
  const navItemClass = (active) =>
    `px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all border-2 ${
      active
        ? evilMode
          ? 'bg-red-900/60 text-red-300 border-red-600'
          : 'bg-blue-500/20 text-cyan-300 border-blue-500/70'
        : evilMode
        ? 'text-red-400/70 hover:text-red-300 border-transparent hover:border-red-800 hover:bg-red-950/40'
        : 'text-blue-300/70 hover:text-blue-200 border-transparent hover:border-blue-500/30 hover:bg-white/5'
    }`;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b transition-colors duration-500"
      style={{
        backgroundColor: evilMode ? 'rgba(10,0,0,0.92)' : 'rgba(8,15,29,0.90)',
        borderColor: evilMode ? 'rgba(220,38,38,0.25)' : 'rgba(59,130,246,0.2)',
      }}
    >
      {/* Evil-mode animated red scanner line at very top */}
      <AnimatePresence>
        {evilMode && (
          <motion.div
            key="scanner"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-800 via-red-500 to-red-800 origin-left"
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        {/* ── Logo ── */}
        <motion.button
          whileHover={{
            scale: 1.06,
            y: -2,
            boxShadow: evilMode
              ? '5px 5px 0px rgba(0,0,0,1)'
              : '5px 5px 0px rgba(0,0,0,1)',
          }}
          whileTap={{
            scale: 0.95,
            y: 0,
            boxShadow: '1px 1px 0px rgba(0,0,0,1)',
          }}
          transition={COMIC_SPRING}
          onClick={() => setView('dashboard')}
          className={`flex items-center gap-2 shrink-0 px-2 py-1 rounded-xl border-2 transition-colors duration-300 ${
            evilMode ? 'border-red-900/60' : 'border-transparent'
          }`}
        >
          <span className="text-2xl">{evilMode ? '💀' : '🍺'}</span>
          <div className="hidden sm:block">
            <span
              className="font-display font-black text-lg bg-clip-text text-transparent bg-gradient-to-r transition-all duration-500"
              style={{
                backgroundImage: evilMode
                  ? 'linear-gradient(to right, #ef4444, #dc2626)'
                  : 'linear-gradient(to right, #22d3ee, #facc15)',
              }}
            >
              {evilMode ? 'UPSC Quahog: EVIL' : 'UPSC Quahog'}
            </span>
          </div>
        </motion.button>

        {/* ── Nav items ── */}
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{
                scale: 1.08,
                y: -3,
                rotate: [-0.5, 0.5, 0],
                boxShadow: evilMode
                  ? '4px 4px 0px rgba(0,0,0,1)'
                  : '4px 4px 0px rgba(0,0,0,1)',
              }}
              whileTap={{
                scale: 0.94,
                y: 0,
                boxShadow: '1px 1px 0px rgba(0,0,0,1)',
              }}
              transition={COMIC_SPRING}
              onClick={() => setView(item.id)}
              className={navItemClass(view === item.id)}
            >
              <span>{item.icon}</span>
              <span className="hidden md:inline">{item.label}</span>
            </motion.button>
          ))}
        </nav>

        {/* ── Right cluster ── */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Ale counter */}
          <motion.div
            whileHover={{
              scale: 1.06,
              y: -2,
              boxShadow: '4px 4px 0px rgba(0,0,0,1)',
            }}
            transition={COMIC_SPRING}
            className={`hidden sm:flex items-center gap-2 border-2 rounded-full px-3 py-1 transition-colors duration-300 ${
              evilMode
                ? 'bg-red-950/60 border-red-800/50'
                : 'bg-yellow-500/10 border-yellow-500/20'
            }`}
          >
            <span className="text-sm">{evilMode ? '☠️' : '🍺'}</span>
            <span
              className={`text-xs font-black ${
                evilMode ? 'text-red-300' : 'text-yellow-300'
              }`}
            >
              {ales}
            </span>
          </motion.div>

          {/* Level badge */}
          <motion.div
            whileHover={{
              scale: 1.06,
              y: -2,
              boxShadow: '4px 4px 0px rgba(0,0,0,1)',
            }}
            transition={COMIC_SPRING}
            className={`hidden sm:flex items-center gap-2 border-2 rounded-full px-3 py-1 transition-colors duration-300 ${
              evilMode
                ? 'bg-red-950/40 border-red-900/40'
                : 'bg-blue-500/10 border-blue-500/20'
            }`}
          >
            <span
              className={`text-xs font-bold ${
                evilMode ? 'text-red-400' : 'text-blue-300'
              }`}
            >
              Lv.{current.level}
            </span>
            <span
              className={`text-xs font-black ${
                evilMode ? 'text-red-200' : 'text-blue-100'
              }`}
            >
              {current.name}
            </span>
          </motion.div>

          {/* ── Stewie's Ray-Gun Toggle ── */}
          <EvilToggle evilMode={evilMode} onToggle={toggleEvilMode} />

          {/* Quit */}
          <motion.button
            whileHover={{
              scale: 1.08,
              y: -2,
              boxShadow: '4px 4px 0px rgba(0,0,0,1)',
            }}
            whileTap={{
              scale: 0.93,
              y: 0,
              boxShadow: '1px 1px 0px rgba(0,0,0,1)',
            }}
            transition={COMIC_SPRING}
            onClick={onLogout}
            className={`text-xs font-bold border-2 rounded-lg px-2.5 py-1.5 transition-all duration-300 ${
              evilMode
                ? 'text-red-400 border-red-800/50 hover:border-red-600 hover:bg-red-950'
                : 'text-rose-400/70 hover:text-rose-300 border-rose-500/20 hover:border-rose-500/40'
            }`}
          >
            {evilMode ? 'RETREAT' : 'Quit'}
          </motion.button>
        </div>
      </div>
    </header>
  );
}

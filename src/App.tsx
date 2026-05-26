import {
  useState,
  useEffect,
  useCallback,
  useRef,
  createContext,
  useContext,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LoginScreen from './LoginScreen';
import Dashboard from './Dashboard';
import SyllabusView from './SyllabusView';
import QuizMode from './QuizMode';
import OptionalSubject from './OptionalSubject';
import Navbar from './Navbar';
import { INITIAL_SYLLABUS, INITIAL_OPTIONAL } from './syllabusData';

// ─── LocalStorage helpers ────────────────────────────────────────────────────
export const ls = {
  get: (key, fallback = null) => {
    try {
      const v = localStorage.getItem(key);
      return v !== null ? JSON.parse(v) : fallback;
    } catch {
      return fallback;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  },
};

// ─── Dark Mode Context (Stewie's Armory) ─────────────────────────────────────
export const DarkModeContext = createContext({
  evilMode: false,
  toggleEvilMode: () => {},
});
export const useEvilMode = () => useContext(DarkModeContext);

// ─── XP / Level system ───────────────────────────────────────────────────────
export const LEVELS = [
  { level: 1, name: 'Meg', minXP: 0 },
  { level: 5, name: 'Chris', minXP: 200 },
  { level: 10, name: 'Cleveland', minXP: 600 },
  { level: 15, name: 'Joe Swanson', minXP: 1200 },
  { level: 20, name: 'Quagmire', minXP: 2000 },
  { level: 30, name: 'Brian Griffin', minXP: 3500 },
  { level: 40, name: 'Stewie Griffin', minXP: 5500 },
  { level: 50, name: 'Lois Griffin', minXP: 8000 },
  { level: 60, name: 'Peter Griffin', minXP: 11000 },
  { level: 75, name: 'Evil Monkey', minXP: 15000 },
  { level: 90, name: 'Death', minXP: 20000 },
  { level: 100, name: 'Mayor West', minXP: 27000 },
];

export function getLevelInfo(xp) {
  let current = LEVELS[0];
  let next = LEVELS[1];
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].minXP) {
      current = LEVELS[i];
      next = LEVELS[i + 1] || LEVELS[LEVELS.length - 1];
    }
  }
  const progress =
    next === current
      ? 100
      : Math.min(
          100,
          ((xp - current.minXP) / (next.minXP - current.minXP)) * 100
        );
  return { current, next, progress };
}

// ─── Audio Hook ──────────────────────────────────────────────────────────────
export function useAudio() {
  const audioRef = useRef(null);
  const playSound = useCallback((filename) => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      const audio = new Audio(`/sounds/${filename}`);
      audio.volume = 0.5;
      audio.play().catch(() => {});
      audioRef.current = audio;
    } catch {}
  }, []);
  return { playSound };
}

// ─── TV Static / CRT Channel-change transition ────────────────────────────────
// Each "page" tears out with a horizontal scan-line wipe + noise flash,
// then the new page slams in from below. It's exactly what happens when
// Peter sits on the remote and changes the channel by accident.
const CRT_OVERLAY_VARIANTS = {
  hidden: { opacity: 0 },
  flash: {
    opacity: [0, 1, 0.7, 1, 0],
    scaleY: [1, 1.04, 0.98, 1.02, 1],
    transition: {
      duration: 0.38,
      times: [0, 0.15, 0.4, 0.65, 1],
      ease: 'linear',
    },
  },
};

const pageVariants = {
  initial: {
    opacity: 0,
    y: 28,
    scaleX: 0.97,
    filter: 'brightness(2) contrast(0) blur(2px)',
  },
  animate: {
    opacity: 1,
    y: 0,
    scaleX: 1,
    filter: 'brightness(1) contrast(1) blur(0px)',
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
      filter: { duration: 0.25 },
    },
  },
  exit: {
    opacity: 0,
    scaleX: 1.02,
    scaleY: 0.02, // collapses to a horizontal scan-line like a CRT shutting off
    filter: 'brightness(4) saturate(0)',
    transition: { duration: 0.18, ease: 'easeIn' },
  },
};

// Renders the white horizontal "static flash" bar that sweeps across on exit
function StaticFlash({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="static-flash"
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: [0, 1, 1, 0], scaleY: [0, 1, 1, 0] }}
          transition={{ duration: 0.32, times: [0, 0.1, 0.7, 1] }}
          className="fixed inset-0 z-[999] pointer-events-none"
          style={{
            background:
              'repeating-linear-gradient(0deg, rgba(255,255,255,0.07) 0px, rgba(255,255,255,0.07) 2px, transparent 2px, transparent 4px), rgba(255,255,255,0.85)',
            mixBlendMode: 'screen',
          }}
        />
      )}
    </AnimatePresence>
  );
}

// ─── Evil-mode CSS class injector ────────────────────────────────────────────
// Rather than maintaining two full class lists everywhere, we inject a
// `data-evil` attribute on <html> and drive theme via CSS custom properties.
// Component code reads `evilMode` from context for the few structural changes.
function EvilModeStylesheet({ evilMode }) {
  return (
    <style>{`
      :root {
        --bg-base:       ${evilMode ? '#0a0000' : '#0d1b2a'};
        --bg-card:       ${evilMode ? '#130000' : '#0a1628'};
        --border-accent: ${
          evilMode ? 'rgba(220,38,38,0.35)' : 'rgba(59,130,246,0.2)'
        };
        --text-accent:   ${evilMode ? '#f87171' : '#67e8f9'};
        --glow-color:    ${
          evilMode ? 'rgba(220,38,38,0.15)' : 'rgba(6,182,212,0.1)'
        };
        --bar-from:      ${evilMode ? '#dc2626' : '#22d3ee'};
        --bar-to:        ${evilMode ? '#7f1d1d' : '#facc15'};
      }
    `}</style>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(() => ls.get('qhUser', null));
  const [xp, setXp] = useState(() => ls.get('qhXP', 0));
  const [ales, setAles] = useState(() => ls.get('qhAles', 0));
  const [syllabus, setSyllabus] = useState(() =>
    ls.get('qhSyllabus', INITIAL_SYLLABUS)
  );
  const [optional, setOptional] = useState(() =>
    ls.get('qhOptional', INITIAL_OPTIONAL)
  );
  const [view, setView] = useState('dashboard');
  const [activeSub, setActiveSub] = useState(null);
  const [evilMode, setEvilMode] = useState(() => ls.get('qhEvilMode', false));
  const [staticFlash, setStaticFlash] = useState(false);
  const { playSound } = useAudio();

  // Persist
  useEffect(() => {
    ls.set('qhUser', user);
  }, [user]);
  useEffect(() => {
    ls.set('qhXP', xp);
  }, [xp]);
  useEffect(() => {
    ls.set('qhAles', ales);
  }, [ales]);
  useEffect(() => {
    ls.set('qhSyllabus', syllabus);
  }, [syllabus]);
  useEffect(() => {
    ls.set('qhOptional', optional);
  }, [optional]);
  useEffect(() => {
    ls.set('qhEvilMode', evilMode);
  }, [evilMode]);

  const addXP = useCallback((amount) => {
    setXp((prev) => prev + amount);
    setAles((prev) => prev + Math.ceil(amount / 10));
  }, []);

  // Intercept view changes to fire the static flash
  const handleSetView = useCallback(
    (nextView) => {
      if (nextView === view) return;
      setStaticFlash(true);
      setTimeout(() => {
        setStaticFlash(false);
        setView(nextView);
      }, 180);
    },
    [view]
  );

  const toggleEvilMode = useCallback(() => setEvilMode((p) => !p), []);

  const handleLogin = (username) => {
    setUser(username);
    setView('dashboard');
  };
  const handleLogout = () => {
    setUser(null);
    setView('dashboard');
  };

  if (!user) {
    return (
      <DarkModeContext.Provider value={{ evilMode, toggleEvilMode }}>
        <EvilModeStylesheet evilMode={evilMode} />
        <LoginScreen onLogin={handleLogin} />
      </DarkModeContext.Provider>
    );
  }

  return (
    <DarkModeContext.Provider value={{ evilMode, toggleEvilMode }}>
      <EvilModeStylesheet evilMode={evilMode} />

      <div
        className="min-h-screen text-white font-body overflow-x-hidden transition-colors duration-500"
        style={{ backgroundColor: 'var(--bg-base)' }}
      >
        {/* ── Background texture (halftone / sci-fi grid) ── */}
        <div
          className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-500"
          style={{
            opacity: evilMode ? 0.07 : 0.04,
            backgroundImage: evilMode
              ? 'linear-gradient(rgba(220,38,38,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.4) 1px, transparent 1px)'
              : 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: evilMode ? '28px 28px' : '18px 18px',
          }}
        />

        {/* ── Evil-mode ambient red vignette ── */}
        {evilMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-0"
            style={{
              background:
                'radial-gradient(ellipse at center, transparent 40%, rgba(120,0,0,0.45) 100%)',
            }}
          />
        )}

        {/* ── TV Static flash overlay ── */}
        <StaticFlash show={staticFlash} />

        <Navbar
          user={user}
          xp={xp}
          ales={ales}
          view={view}
          setView={handleSetView}
          onLogout={handleLogout}
        />

        <main className="relative z-10 pt-20 px-4 pb-12 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {view === 'dashboard' && (
              <motion.div
                key="dashboard"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Dashboard
                  user={user}
                  xp={xp}
                  ales={ales}
                  syllabus={syllabus}
                  setView={handleSetView}
                  setActiveSub={setActiveSub}
                />
              </motion.div>
            )}
            {view === 'syllabus' && (
              <motion.div
                key="syllabus"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <SyllabusView
                  syllabus={syllabus}
                  setSyllabus={setSyllabus}
                  activeSub={activeSub}
                  setActiveSub={setActiveSub}
                  addXP={addXP}
                  playSound={playSound}
                />
              </motion.div>
            )}
            {view === 'quiz' && (
              <motion.div
                key="quiz"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <QuizMode addXP={addXP} playSound={playSound} />
              </motion.div>
            )}
            {view === 'optional' && (
              <motion.div
                key="optional"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <OptionalSubject
                  optional={optional}
                  setOptional={setOptional}
                  addXP={addXP}
                  playSound={playSound}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </DarkModeContext.Provider>
  );
}

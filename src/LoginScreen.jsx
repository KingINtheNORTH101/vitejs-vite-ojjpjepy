import { useState } from 'react';
import { motion } from 'framer-motion';

const SNARKY_PLACEHOLDERS = [
  'Definitely not Meg...',
  'Your name. Even Quagmire has one.',
  "Peter tried 'Cool Dude'. Don't.",
  'Future IAS Officer (probably)',
  'Cleveland Brown Jr. (honorary)',
];

export default function LoginScreen({ onLogin }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const placeholder =
    SNARKY_PLACEHOLDERS[Math.floor(Math.random() * SNARKY_PLACEHOLDERS.length)];

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Even Meg has a name. Enter yours.');
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }
    if (name.trim().toLowerCase() === 'meg') {
      setError('Shut up, Meg. (jk, you can use that name... if you dare)');
      return;
    }
    onLogin(name.trim());
  };

  return (
    <div className="min-h-screen bg-[#0d1b2a] flex items-center justify-center relative overflow-hidden px-4">
      {/* Animated BG blobs */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-700/20 blur-[100px]"
        animate={{ scale: [1, 1.15, 1], rotate: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-yellow-500/15 blur-[90px]"
        animate={{ scale: [1, 1.2, 1], rotate: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
      />

      {/* Halftone grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-[#0a1628]/80 backdrop-blur-xl border border-blue-500/30 rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/40">
          {/* Header band */}
          <div className="bg-gradient-to-r from-blue-600 via-cyan-500 to-yellow-400 h-2" />

          <div className="p-8">
            {/* Logo area */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ rotate: -10, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="inline-block text-6xl mb-3"
              >
                🍺
              </motion.div>
              <h1 className="font-display text-3xl font-black text-white tracking-tight leading-none">
                UPSC{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-yellow-400">
                  Quahog
                </span>
              </h1>
              <p className="text-blue-300 text-sm mt-1 font-medium">
                The Drunken Clam Academy of Civil Services
              </p>
            </div>

            {/* Character image placeholder */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="relative bg-gradient-to-br from-blue-900/40 to-indigo-900/40 rounded-2xl overflow-hidden border border-blue-500/20 mb-6"
            >
              <img
                src="/images/brian-stewie.png"
                alt="Brian and Stewie studying"
                className="w-full h-40 object-cover object-top"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              {/* Fallback if image missing */}
              <div className="hidden w-full h-40 items-center justify-center gap-4">
                <span className="text-5xl">🐶</span>
                <span className="text-5xl">👶</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/90 to-transparent" />
              <p className="absolute bottom-3 left-0 right-0 text-center text-xs text-blue-300 italic px-4">
                "The path to the IAS is paved with suffering. We'll make it{' '}
                <em>slightly</em> less unbearable." — Brian
              </p>
            </motion.div>

            {/* Headline */}
            <div className="mb-6 text-center">
              <h2 className="text-white font-display font-bold text-xl">
                Spooner Street Check-in
              </h2>
              <p className="text-blue-400 text-sm mt-1">
                Enter your name. Or don't.{' '}
                <span className="text-rose-400">Meg wouldn't.</span>
              </p>
            </div>

            {/* Input */}
            <motion.div
              animate={shake ? { x: [-8, 8, -8, 8, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder={placeholder}
                className="w-full bg-white/5 border border-blue-500/40 rounded-xl px-4 py-3 text-white placeholder-blue-400/50 focus:outline-none focus:border-cyan-400/70 focus:bg-white/8 transition-all text-sm"
              />
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-rose-400 text-xs mt-2 ml-1"
                >
                  ⚠️ {error}
                </motion.p>
              )}
            </motion.div>

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              className="mt-4 w-full py-3 rounded-xl font-display font-bold text-[#0a1628] text-base bg-gradient-to-r from-cyan-400 to-yellow-400 hover:from-cyan-300 hover:to-yellow-300 shadow-lg shadow-cyan-500/20 transition-all"
            >
              Begin My Suffering 🎓
            </motion.button>

            <p className="text-center text-blue-500/60 text-xs mt-4">
              No IAS aspirant was harmed in the making of this app. <br />
              (Peter can't say the same about his knee.)
            </p>
          </div>

          {/* Footer band */}
          <div className="bg-gradient-to-r from-yellow-400 via-cyan-500 to-blue-600 h-1" />
        </div>

        {/* Floating badges */}
        <div className="flex justify-center gap-3 mt-4">
          {['Pre ✓', 'Mains ✓', 'Ethics ✓', 'Optionals ✓'].map((t) => (
            <span
              key={t}
              className="text-[10px] bg-blue-900/60 border border-blue-500/20 text-blue-300 px-2 py-1 rounded-full"
            >
              {t}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

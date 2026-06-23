import { motion, type MotionValue } from 'framer-motion';
import type { AppState } from '../types';

interface PreloaderProps {
  isUnlocked: boolean;
  setIsUnlocked: (unlocked: boolean) => void;
  setAppState: (state: AppState) => void;
  dragX: MotionValue<number>;
  invertedDragX: MotionValue<number>;
}

export default function Preloader({
  isUnlocked,
  setIsUnlocked,
  setAppState,
  dragX,
  invertedDragX
}: PreloaderProps) {
  return (
    <motion.div
      key="preloader-state"
      className="absolute inset-0 flex flex-col items-center justify-center gap-12 p-6 z-30"
      exit={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
      transition={{ duration: 0.8 }}
    >
      {/* Logo integrated into Flow */}
      <motion.div
        layoutId="brand-logo-container"
        className="relative flex items-center justify-center w-[220px] h-[220px] mb-12"
      >
        {/* Siri Futuristic Animated Mesh Glow */}
        <div className="absolute inset-0 opacity-100 mix-blend-screen pointer-events-none scale-100">
          <div className="absolute top-0 -left-8 w-[110%] h-[110%] bg-cyan-500/90 rounded-[40%_60%_70%_30%] blur-[30px] mix-blend-color-dodge animate-[spin_5s_linear_infinite]" />
          <div className="absolute top-8 -right-8 w-[110%] h-[110%] bg-purple-600/90 rounded-[60%_40%_30%_70%] blur-[35px] mix-blend-color-dodge animate-[spin_7s_linear_infinite_reverse]" />
          <div className="absolute -bottom-10 left-6 w-[120%] h-[110%] bg-pink-500/80 rounded-[50%_50%_20%_80%] blur-[35px] mix-blend-color-dodge animate-[spin_6s_linear_infinite]" />
          <div className="absolute -top-6 right-10 w-[105%] h-[115%] bg-blue-500/90 rounded-[30%_70%_70%_30%] blur-[45px] mix-blend-color-dodge animate-[spin_8s_linear_infinite_reverse]" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center flex flex-col items-center gap-4"
      >
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 tracking-tighter drop-shadow-2xl pr-12 pl-4 py-4">
          Welcome
        </h1>
        <p className="text-xl md:text-2xl font-semibold text-zinc-300 uppercase tracking-[0.4em] drop-shadow-md">
          Glad to assist you
        </p>

        {/* Interactive Swipe-to-Start Track: Ultra-Premium iOS Glassy Effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 relative w-[320px] h-[72px] bg-white/[0.03] border border-white/10 rounded-full flex items-center shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_0_0_1px_rgba(255,255,255,0.05)] backdrop-blur-3xl overflow-hidden"
        >
          {/* Perfectly Centered Text with Shimmer Effect */}
          <motion.div
            animate={{ opacity: isUnlocked ? 0 : 1 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
          >
            <span className="text-white font-bold tracking-[0.25em] text-[15px] uppercase pr-1 ml-8 shadow-sm">
              Drag to Start
            </span>
          </motion.div>

          {/* Glassy iOS Thumb with Magnifying Bubble Effect */}
          <motion.div
            drag={!isUnlocked ? "x" : false}
            dragConstraints={{ left: 0, right: 244 }} // 320 (track) - 68 (thumb box) - spacer = ~244
            dragElastic={0.05}
            dragSnapToOrigin={!isUnlocked}
            style={{ x: isUnlocked ? 0 : dragX }} // Release dragging control to animate stretch
            animate={isUnlocked ? { width: 320, x: -4, backgroundColor: 'rgba(255,255,255,0.2)' } : { width: 64 }}
            transition={isUnlocked ? { duration: 0.5, ease: 'easeOut' } : { type: 'spring' }}
            onDragEnd={(_, info) => {
              if (info.offset.x > 200) {
                setIsUnlocked(true);
                setTimeout(() => setAppState('selection'), 600);
              }
            }}
            whileHover={{ scale: isUnlocked ? 1 : 1.02 }}
            whileTap={{ scale: isUnlocked ? 1 : 0.98 }}
            className="h-[64px] ml-1 relative bg-white/[0.15] backdrop-blur-xl border border-white/30 rounded-full cursor-grab active:cursor-grabbing flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.4)] z-10 overflow-hidden group"
          >
            {/* Inverse Moving Container holding the Scaled 'Gras' Text for exact alignment */}
            <motion.div
              style={{
                x: isUnlocked ? 4 : invertedDragX,
                left: '-4px',
              }}
              animate={{
                opacity: isUnlocked ? 0 : 1
              }}
              className="absolute top-0 bottom-0 w-[320px] flex items-center justify-center pointer-events-none"
            >
              <span className="text-white font-bold tracking-[0.25em] text-[15px] uppercase drop-shadow-[0_0_12px_rgba(255,255,255,1)] [text-shadow:0_0_6px_rgba(255,255,255,0.8)] whitespace-nowrap pr-1 ml-8">
                Drag to Start
              </span>
            </motion.div>

            <motion.svg
              animate={isUnlocked ? { opacity: 0, scale: 0.5 } : { opacity: 0.5, scale: 1 }}
              className="w-6 h-6 text-white relative z-20 translate-x-[1px] mix-blend-difference group-hover:opacity-100 transition-opacity"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </motion.svg>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

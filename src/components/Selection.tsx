import { motion } from 'framer-motion';
import { AVATARS } from '../constants';
import type { Avatar } from '../types';

interface SelectionProps {
  selectedAvatar: Avatar | null;
  isTransitioning: boolean;
  onSelectAvatar: (avatar: Avatar) => void;
}

export default function Selection({
  selectedAvatar,
  isTransitioning,
  onSelectAvatar
}: SelectionProps) {
  return (
    <motion.div
      key="selection-state"
      initial={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0 }}
      transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-6xl flex flex-col items-center px-6 pt-[320px] pb-12 z-30 relative"
    >
      {/* Floating Ambient Glass Bubbles for WOW Factor */}
      <motion.div
        animate={{ y: [0, -40, 0], x: [0, 20, 0], rotate: [0, 45, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-20 -left-10 w-64 h-64 rounded-full glassy-bubble opacity-30 blur-[4px] -z-10 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
      />
      <motion.div
        animate={{ y: [0, 50, 0], x: [0, -30, 0], rotate: [0, -45, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute -bottom-20 -right-10 w-80 h-80 rounded-full glassy-bubble opacity-20 blur-[6px] -z-10 border border-white/5"
      />
      <motion.div
        animate={{ y: [0, -60, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full glassy-bubble opacity-40 blur-[2px] -z-10 shadow-[0_0_60px_rgba(255,255,255,0.3)]"
      />

      {/* Title & Explanatory Paragraph */}
      <div className="flex flex-col items-center space-y-8 mb-16 relative">
        <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 tracking-tight text-center drop-shadow-lg">
          Select Your Avatar
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="max-w-2xl text-center bg-white/5 backdrop-blur-2xl border border-white/10 p-6 sm:p-8 rounded-[30px] shadow-[0_20px_60px_rgba(0,0,0,0.6)] relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/[0.03] to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
          <p className="text-zinc-300 text-lg sm:text-lg font-medium tracking-wide leading-relaxed">
            Experience the next generation of conversational AI. Choose a persona below and engage in a <span className="text-white font-bold drop-shadow-md">real-time interactive video dialogue</span> powered by advanced generative models. Select your companion to begin the magical experience.
          </p>
        </motion.div>
      </div>

      <div className="flex flex-wrap justify-center gap-10 sm:gap-16">
        {AVATARS.map((avatar) => {
          const isSelected = selectedAvatar?.id === avatar.id;
          const isFading = isTransitioning && !isSelected;

          return (
            <motion.button
              key={avatar.id}
              layoutId={`avatar-container-${avatar.id}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{
                opacity: isFading ? 0 : 1,
                y: isFading ? 20 : 0,
                scale: isFading ? 0.9 : 1,
                filter: isFading ? 'blur(10px)' : 'blur(0px)'
              }}
              transition={{
                duration: isFading ? 0.4 : 0.6,
                ease: "easeOut"
              }}
              whileHover={!isTransitioning ? { scale: 1.12, y: -10 } : {}}
              whileTap={!isTransitioning ? { scale: 0.95 } : {}}
              onClick={() => !isTransitioning && onSelectAvatar(avatar)}
              className={`group relative flex flex-col items-center space-y-6 cursor-pointer z-[60] outline-none ${isSelected ? 'z-[100]' : ''}`}
            >
              <motion.div
                layoutId={`avatar-image-${avatar.id}`}
                className={`relative w-36 h-36 sm:w-44 sm:h-44 rounded-full p-[4px] transition-all duration-300 shadow-2xl overflow-hidden ${isSelected ? 'bg-white shadow-[0_0_80px_rgba(255,255,255,0.8)]' : 'bg-zinc-800 group-hover:bg-white/80 group-hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]'}`}
              >
                <img
                  src={avatar.face}
                  alt={avatar.name}
                  className="w-full h-full rounded-full object-cover border-[6px] border-black bg-zinc-900"
                />
              </motion.div>
              <motion.span
                layoutId={`avatar-name-${avatar.id}`}
                className={`text-xl md:text-2xl uppercase tracking-[0.2em] font-extrabold transition-colors duration-300 ${isSelected ? 'text-white' : 'text-zinc-500 group-hover:text-white'}`}
              >
                {avatar.name}
              </motion.span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

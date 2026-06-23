import type { RefObject, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User as UserIcon, Loader2 } from 'lucide-react';
import type { Avatar, Message } from '../types';

interface ChatProps {
  selectedAvatar: Avatar;
  messages: Message[];
  inputText: string;
  setInputText: (text: string) => void;
  isFetching: boolean;
  videoUrl: string | null;
  videoRef: RefObject<HTMLVideoElement | null>;
  chatEndRef: RefObject<HTMLDivElement | null>;
  handleSendMessage: (e: FormEvent) => void;
}

export default function Chat({
  selectedAvatar,
  messages,
  inputText,
  setInputText,
  isFetching,
  videoUrl,
  videoRef,
  chatEndRef,
  handleSendMessage
}: ChatProps) {
  return (
    <motion.div
      key="chat-state"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 w-full h-[100dvh] flex flex-col items-center px-4 pb-4 sm:px-6 sm:pb-6 mx-auto max-w-5xl z-20 pt-[300px]"
    >
      {/* TOP HALF: THE AVATAR */}
      <div className="w-full flex-[2] relative min-h-[250px] shrink-0 flex items-center justify-center rounded-t-[40px] border-b border-white/5 group bg-zinc-900/10 backdrop-blur-md">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent -z-10 rounded-t-[40px]" />

        <motion.div
          layoutId={`avatar-container-${selectedAvatar.id}`}
          className="relative flex flex-col items-center z-50"
          transition={{ type: 'spring', damping: 20, stiffness: 60 }}
        >
          <motion.div
            layoutId={`avatar-image-${selectedAvatar.id}`}
            className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden shadow-[0_0_120px_rgba(255,255,255,0.2)] bg-white p-1.5 z-50 flex items-center justify-center"
          >
            <div className="w-full h-full bg-black rounded-full overflow-hidden relative border-4 border-black">
              <img
                src={selectedAvatar.face}
                alt={selectedAvatar.name}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${videoUrl ? 'opacity-0' : 'opacity-100'}`}
              />

              <video
                key={videoUrl || 'default-video'}
                ref={videoRef}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${videoUrl ? 'opacity-100' : 'opacity-0'}`}
                autoPlay
                playsInline
                src={videoUrl ? `data:video/mp4;base64,${videoUrl}` : undefined}
              />

              <AnimatePresence>
                {isFetching && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center z-20"
                  >
                    <Loader2 size={40} className="text-white animate-spin mb-4" />
                    <span className="text-xs tracking-[0.3em] font-bold text-white/90 uppercase text-center px-4">
                      Creating Video
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>

        {/* Status Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8, type: 'spring' }}
          className="absolute top-6 right-6 flex items-center gap-3 bg-black/50 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/10 shadow-2xl"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-emerald-400 text-[11px] sm:text-xs tracking-[0.25em] uppercase font-bold">
            {selectedAvatar.name} Online
          </span>
        </motion.div>
      </div>

      {/* BOTTOM HALF: THE CHAT INTERFACE */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full flex-[3] min-h-[300px] flex flex-col bg-white/[0.02] backdrop-blur-3xl rounded-b-[40px] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden relative"
      >
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 scroll-smooth">
          {messages.map((msg, idx) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: msg.sender === 'user' ? 30 : -30, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: idx === 0 ? 1.2 : 0, type: 'spring', stiffness: 200, damping: 20 }}
              className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-end gap-3 max-w-[90%] sm:max-w-[75%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {msg.sender === 'user' ? (
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                    <UserIcon size={18} className="text-black" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full shrink-0 shadow-lg border-2 border-white/30 overflow-hidden bg-black">
                    <img src={selectedAvatar.face} alt="AI" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className={`px-6 py-4 rounded-3xl ${
                  msg.sender === 'user'
                    ? 'bg-white/15 backdrop-blur-2xl border border-white/20 text-white rounded-br-md shadow-[0_8px_32px_rgba(0,0,0,0.3)]'
                    : 'bg-black/60 backdrop-blur-2xl border border-white/10 text-zinc-100 rounded-bl-md shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
                }`}>
                  <p className="text-[15px] sm:text-[17px] font-medium leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
          <div ref={chatEndRef} className="h-6" />
        </div>

        <div className="p-5 sm:p-8 bg-black/80 border-t border-white/10 backdrop-blur-xl">
          <form onSubmit={handleSendMessage} className="relative flex items-center group">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isFetching ? "Avatar is generating video..." : "Type your message..."}
              disabled={isFetching}
              className="w-full bg-white/5 hover:bg-white/10 focus:bg-white/15 text-white placeholder-zinc-500 border border-white/20 rounded-full py-5 pl-8 pr-20 outline-none focus:ring-2 focus:ring-white/40 transition-all font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-[inset_0_2px_15px_rgba(0,0,0,0.5)]"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isFetching}
              className="absolute right-3 h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-white flex items-center justify-center text-black transition-transform duration-200 disabled:opacity-30 disabled:scale-90 disabled:cursor-not-allowed group-hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95"
            >
              <Send size={20} className="translate-x-[-1px] translate-y-[1px]" />
            </button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}

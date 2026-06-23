import { useState, useEffect, useRef } from 'react';
import type { FormEvent } from 'react';
import { motion, AnimatePresence, LayoutGroup, useMotionValue, useTransform } from 'framer-motion';
import { Send, User as UserIcon, Loader2 } from 'lucide-react';

const NGROK_URL = 'https://regrettable-scientifically-melodi.ngrok-free.dev';

type AppState = 'preloader' | 'selection' | 'chat';

type Message = {
  id: string;
  sender: 'user' | 'ai';
  text: string;
};

const AVATARS = [
  { id: 'elon_musk.jpg', name: 'Elon', face: '/avatars/elon_musk.jpg' },
  { id: 'emmanuel_macron.jpg', name: 'Emmanuel', face: '/avatars/emmanuel_macron.jpg' },
  { id: 'kevin_hart.jpg', name: 'Kevin', face: '/avatars/kevin_hart.jpg' },
  { id: 'spongebob.png', name: 'Spongebob', face: '/avatars/spongebob.png' },
  { id: 'the_rock.jpg', name: 'The Rock', face: '/avatars/the_rock.jpg' },
];

export default function App() {
  const [appState, setAppState] = useState<AppState>('preloader');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<typeof AVATARS[0] | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Framer Motion Hook for the Magnifying Glass Bubble Drag
  const dragX = useMotionValue(0);
  const invertedDragX = useTransform(dragX, (x) => -x);

  useEffect(() => {
    document.body.className = appState === 'chat' ? 'theme-magical' : 'theme-default';
  }, [appState]);

  // Auto-advance removed to wait for explicit user swipe action

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isFetching]);

  const handleAvatarSelect = (avatar: typeof AVATARS[0]) => {
    setSelectedAvatar(avatar);
    setIsTransitioning(true);
    
    setMessages([
      { id: 'welcome', sender: 'ai', text: `Hi! I am ${avatar.name}. I'm here to answer any questions you have. How can I help you today?` }
    ]);

    // Pure LayoutId Smooth Handoff
    setTimeout(() => {
      setAppState('chat');
      setTimeout(() => {
        setIsTransitioning(false);
      }, 500); 
    }, 50); 
  };

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isFetching) return;

    const userMessage: Message = { id: Date.now().toString(), sender: 'user', text: inputText.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsFetching(true);

    try {
      const payload = { 
        text: userMessage.text,
        avatar_id: selectedAvatar?.id
      };
      console.log("Sending:", payload);

      const response = await fetch(`${NGROK_URL}/chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
      console.log("Received:", data);
      
      setIsFetching(false);

      if (data.text) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          sender: 'ai',
          text: data.text
        }]);
      }

      if (data.video_base64) {
        setVideoUrl(data.video_base64);
      }
    } catch (error) {
      console.error("API Error:", error);
      setIsFetching(false);
      setMessages(prev => [...prev, {
        id: Date.now().toString(), sender: 'ai', 
        text: 'Sorry, I encountered an error connecting to my server.'
      }]);
    }
  };

  const reloadApp = () => {
    if (appState !== 'preloader') {
      window.location.reload();
    }
  };

  return (
    <LayoutGroup>
      <div className="min-h-screen w-full flex items-center justify-center overflow-x-hidden relative">

        {/* 
          ================================================================
           SMOOTH TRANSITION OVERLAY
          ================================================================
        */}
        <AnimatePresence>
          {isTransitioning && (
            <motion.div 
              initial={{ backdropFilter: 'blur(0px)', backgroundColor: 'rgba(0,0,0,0)' }}
              animate={{ backdropFilter: 'blur(20px)', backgroundColor: 'rgba(0,0,0,0.4)' }}
              exit={{ backdropFilter: 'blur(0px)', backgroundColor: 'rgba(0,0,0,0)' }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="fixed inset-0 z-40 pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* 
          ================================================================
          GLOBAL ANIMATION CONTEXT (MANDATORY FOR LAYOUTID SEAMLESS MORPHING)
          ================================================================
        */}
        <AnimatePresence>
          {appState !== 'preloader' && (
            <div className="fixed top-6 inset-x-0 w-full flex justify-center z-50 pointer-events-none">
              <motion.div
                layoutId="brand-logo-container"
                onClick={reloadApp}
                className="cursor-pointer pointer-events-auto hover:scale-110 active:scale-95 transition-transform"
              >
                <div className="relative flex items-center justify-center w-[140px] h-[140px]">
                
                {/* 
                  Siri Futuristic Animated Mesh Glow 
                  (Now the sole logo element)
                */}
                <div className="absolute inset-0 opacity-100 mix-blend-screen pointer-events-none scale-100">
                  <div className="absolute top-0 -left-6 w-[110%] h-[110%] bg-cyan-500/90 rounded-[40%_60%_70%_30%] blur-[20px] mix-blend-color-dodge animate-[spin_5s_linear_infinite]" />
                  <div className="absolute top-6 -right-6 w-[110%] h-[110%] bg-purple-600/90 rounded-[60%_40%_30%_70%] blur-[25px] mix-blend-color-dodge animate-[spin_7s_linear_infinite_reverse]" />
                  <div className="absolute -bottom-8 left-4 w-[120%] h-[110%] bg-pink-500/80 rounded-[50%_50%_20%_80%] blur-[20px] mix-blend-color-dodge animate-[spin_6s_linear_infinite]" />
                  <div className="absolute -top-4 right-8 w-[105%] h-[115%] bg-blue-500/90 rounded-[30%_70%_70%_30%] blur-[30px] mix-blend-color-dodge animate-[spin_8s_linear_infinite_reverse]" />
                </div>
              </div>
            </motion.div>
          </div>
        )}
        {/* 
          ================================================================
          STATE 1: PRELOADER (BULLETPROOF FLEXBOX + SIRI GLOW)
          ================================================================
        */}
          {appState === 'preloader' && (
            <motion.div 
              key="preloader-state"
              className="absolute inset-0 flex flex-col items-center justify-center gap-12 p-6 z-30"
              exit={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
              transition={{ duration: 0.8 }}
            >
              {/* Logo integrated into Flow */}
              <motion.div layoutId="brand-logo-container" className="relative flex items-center justify-center w-[220px] h-[220px] mb-12">
                
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
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </motion.svg>
                  </motion.div>
                </motion.div>
              </motion.div>
              </motion.div>
          )}

        {/* 
          ================================================================
          STATE 2: SELECTION SCREEN
          ================================================================
        */}
          {appState === 'selection' && (
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
                      onClick={() => !isTransitioning && handleAvatarSelect(avatar)}
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
          )}

        {/* 
          ================================================================
          STATE 3: CHAT INTERFACE
          ================================================================
        */}
          {appState === 'chat' && (
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
                  layoutId={`avatar-container-${selectedAvatar?.id}`}
                  className="relative flex flex-col items-center z-50"
                  transition={{ type: 'spring', damping: 20, stiffness: 60 }}
                >
                  <motion.div 
                    layoutId={`avatar-image-${selectedAvatar?.id}`}
                    className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden shadow-[0_0_120px_rgba(255,255,255,0.2)] bg-white p-1.5 z-50 flex items-center justify-center"
                  >
                    <div className="w-full h-full bg-black rounded-full overflow-hidden relative border-4 border-black">
                      <img 
                        src={selectedAvatar?.face} 
                        alt={selectedAvatar?.name} 
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
                            <span className="text-xs tracking-[0.3em] font-bold text-white/90 uppercase text-center px-4">Creating Video</span>
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
                  <span className="text-emerald-400 text-[11px] sm:text-xs tracking-[0.25em] uppercase font-bold">{selectedAvatar?.name} Online</span>
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
                            <img src={selectedAvatar?.face} alt="AI" className="w-full h-full object-cover" />
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
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
}

import { useState, useEffect, useRef } from 'react';
import type { FormEvent } from 'react';
import { motion, AnimatePresence, LayoutGroup, useMotionValue, useTransform } from 'framer-motion';

import type { AppState, Avatar, Message } from './types';
import { NGROK_URL } from './constants';

import BrandLogo from './components/BrandLogo';
import Preloader from './components/Preloader';
import Selection from './components/Selection';
import Chat from './components/Chat';

export default function App() {
  const [appState, setAppState] = useState<AppState>('preloader');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isFetching]);

  const handleAvatarSelect = (avatar: Avatar) => {
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
            <BrandLogo onClick={reloadApp} />
          )}

          {appState === 'preloader' && (
            <Preloader
              isUnlocked={isUnlocked}
              setIsUnlocked={setIsUnlocked}
              setAppState={setAppState}
              dragX={dragX}
              invertedDragX={invertedDragX}
            />
          )}

          {appState === 'selection' && (
            <Selection
              selectedAvatar={selectedAvatar}
              isTransitioning={isTransitioning}
              onSelectAvatar={handleAvatarSelect}
            />
          )}

          {appState === 'chat' && selectedAvatar && (
            <Chat
              selectedAvatar={selectedAvatar}
              messages={messages}
              inputText={inputText}
              setInputText={setInputText}
              isFetching={isFetching}
              videoUrl={videoUrl}
              videoRef={videoRef}
              chatEndRef={chatEndRef}
              handleSendMessage={handleSendMessage}
            />
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
}

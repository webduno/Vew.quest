"use client"

import { createContext, useContext, useState, useRef, ReactNode, useEffect } from 'react';

interface BackgroundMusicContextType {
  isPlaying: boolean;
  togglePlay: () => void;
  playIfNotPlaying: () => void;
}

const BackgroundMusicContext = createContext<BackgroundMusicContextType | undefined>(undefined);

export function BackgroundMusicProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio only on the client side
    audioRef.current = new Audio('/sfx/ominous.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.1;

    // Cleanup function to handle unmounting
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []); // Empty dependency array for initialization only

  useEffect(() => {
    // Handle visibility change
    const handleVisibilityChange = () => {
      if (document.hidden && audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []); // Empty dependency array since we don't need any dependencies

  const playIfNotPlaying = async () => {
    if (!isPlaying && audioRef.current) {
      try {
        await audioRef.current.play()
        setIsPlaying(true);
      } catch (error) {
        console.log('Error playing background music:', error);
      }
    }
  }

  const togglePlay = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.1;
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.log('Error playing background music:', error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };


  return (
    <BackgroundMusicContext.Provider value={{ isPlaying, togglePlay, playIfNotPlaying }}>
      {children}
    </BackgroundMusicContext.Provider>
  );
}

export function useBackgroundMusic() {
  const context = useContext(BackgroundMusicContext);
  if (context === undefined) {
    throw new Error('useBackgroundMusic must be used within a BackgroundMusicProvider');
  }
  return context;
} 
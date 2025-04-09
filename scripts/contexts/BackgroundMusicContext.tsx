"use client"

import { createContext, useContext, useState, useRef, ReactNode, useEffect } from 'react';

interface BackgroundMusicContextType {
  isPlaying: boolean;
  togglePlay: () => void;
  playIfNotPlaying: () => void;
  playSoundEffect: (soundPath: string, volume?: number) => void;
}

const BackgroundMusicContext = createContext<BackgroundMusicContextType | undefined>(undefined);

export function BackgroundMusicProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const soundEffectsRef = useRef<{ [key: string]: HTMLAudioElement }>({});

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
      
      // Clean up all sound effects
      Object.values(soundEffectsRef.current).forEach(audio => {
        audio.pause();
      });
      soundEffectsRef.current = {};
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

  const playSoundEffect = (soundPath: string, volume: number = 0.5) => {
    // Create a new audio element for the sound effect
    const soundEffect = new Audio(soundPath);
    soundEffect.volume = volume;
    
    // Store the sound effect in the ref to prevent garbage collection
    const soundId = Date.now().toString();
    soundEffectsRef.current[soundId] = soundEffect;
    
    // Play the sound effect
    soundEffect.play().catch(error => {
      console.log(`Error playing sound effect ${soundPath}:`, error);
    });
    
    // Remove the sound effect from the ref after it finishes playing
    soundEffect.onended = () => {
      delete soundEffectsRef.current[soundId];
    };
  };

  return (
    <BackgroundMusicContext.Provider value={{ isPlaying, togglePlay, playIfNotPlaying, playSoundEffect }}>
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
import React, { createContext, useState, ReactNode, useRef } from 'react';
import { useBackgroundMusic } from '@/../script/contexts/BackgroundMusicContext';
import { SnackbarNotif } from '../../src/dom/molecule/notification/SnackbarNotif';

// Define the types for severity
type SnackbarSeverity = 'success' | 'error' | 'info' | 'warning' | 'title' | 'handbook';

// Define the context type
type GameCoreContextType = {
  testdata: string;
  isSnackbarOpen: boolean;
  snackbarMessage: string;  
  snackbarSeverity: SnackbarSeverity;
  showSnackbar: (message: string, severity: SnackbarSeverity, autoClose?: number) => void;
  closeSnackbar: () => void; // Renamed for clarity
  isCutSceneOpen: boolean;
  setIsCutSceneOpen: (isCutSceneOpen: boolean) => void;
  playSoundEffect: (soundPath: string, volume?: number) => void;
  handleLockedDoor: () => void;
};

// Create the context with default values
export const GameCoreContext = createContext<GameCoreContextType | undefined>(undefined);

// Provider component
export const GameCoreProvider = ({ children }: { children: ReactNode }) => {
  const [isCutSceneOpen, setIsCutSceneOpen] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<SnackbarSeverity>('info');
  const { playSoundEffect: playBackgroundSoundEffect } = useBackgroundMusic();
  const autoCloseTimeoutRef = useRef<NodeJS.Timeout>();

  const showSnackbar = (message: string, severity: SnackbarSeverity, autoClose?: number) => {
    // Clear any existing timeout
    if (autoCloseTimeoutRef.current) {
      clearTimeout(autoCloseTimeoutRef.current);
    }

    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setIsSnackbarOpen(true);
    
    if (autoClose) {
      autoCloseTimeoutRef.current = setTimeout(() => {
        closeSnackbar();
      }, autoClose);
    }
  };

  const closeSnackbar = () => {
    setIsSnackbarOpen(false);
    if (autoCloseTimeoutRef.current) {
      clearTimeout(autoCloseTimeoutRef.current);
    }
  };

  // Wrapper function to play sound effects
  const playSoundEffect = (soundPath: string, volume?: number) => {
    playBackgroundSoundEffect(soundPath, volume);
  };

  const handleLockedDoor = () => {
    showSnackbar("Access denied", "warning", 3000);
    playSoundEffect("/sfx/short/metallock.mp3");
  };

  // Add state and functions for the context here later
  const contextValue: GameCoreContextType = {
    // Provide context values here
    isCutSceneOpen,
    setIsCutSceneOpen,
    testdata: "testdata",
    isSnackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    showSnackbar,
    closeSnackbar,
    playSoundEffect,
    handleLockedDoor,
  };

  return (
    <GameCoreContext.Provider value={contextValue}>
      <SnackbarNotif />
      {children}
    </GameCoreContext.Provider>
  );
};



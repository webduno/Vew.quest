import React, { createContext, useState, ReactNode, useRef } from 'react';
import { useBackgroundMusic } from '@/../script/contexts/BackgroundMusicContext';
import { SnackbarNotif } from '../../src/dom/molecule/notification/SnackbarNotif';

// Define the types for severity
export type SnackbarSeverity = 'success' | 'error' | 'info' | 'warning' | 'title' | 'handbook';

// Define the context type
type GameCoreContextType = {
  isSnackbarOpen: boolean;
  snackbarMessage: string;  
  isCutSceneOpen: boolean;
  setIsCutSceneOpen: (isCutSceneOpen: boolean) => void;
  playSoundEffect: (soundPath: string, volume?: number) => void;
  autoCloseTimeoutRef: React.MutableRefObject<NodeJS.Timeout | undefined>;
  setSnackbarMessage: (message: string) => void;
  snackbarSeverity: SnackbarSeverity;
  setSnackbarSeverity: (severity: SnackbarSeverity) => void;
  setIsSnackbarOpen: (isSnackbarOpen: boolean) => void;
  changeBackgroundMusic: (soundPath: string) => void;
};

// Create the context with default values
export const GameCoreContext = createContext<GameCoreContextType | undefined>(undefined);

// Provider component
export const GameCoreProvider = ({ children }: { children: ReactNode }) => {
  const [isCutSceneOpen, setIsCutSceneOpen] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<SnackbarSeverity>('info');
  const {
    playSoundEffect,
    changeBackgroundMusic
  } = useBackgroundMusic();
  const autoCloseTimeoutRef = useRef<NodeJS.Timeout>();



  // Add state and functions for the context here later
  const contextValue: GameCoreContextType = {
    // Provide context values here
    isCutSceneOpen,
    setIsCutSceneOpen,
    isSnackbarOpen,
    snackbarMessage,
    autoCloseTimeoutRef,
    setSnackbarMessage,
    setSnackbarSeverity,
    setIsSnackbarOpen,
    snackbarSeverity,
    playSoundEffect,
    changeBackgroundMusic
  };

  return (
    <GameCoreContext.Provider value={contextValue}>
      <SnackbarNotif />
      {children}
    </GameCoreContext.Provider>
  );
};



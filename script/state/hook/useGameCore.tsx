import { useContext } from 'react';
import { GameCoreContext, SnackbarSeverity } from '../GameCoreProvider';

// Custom hook to use the Bew context

export const useGameCore = () => {
  const context = useContext(GameCoreContext);
  if (context === undefined) {
    throw new Error('useGameCore must be used within a GameCoreProvider');
  }
  const {
    autoCloseTimeoutRef,
    setSnackbarMessage,
    setSnackbarSeverity,
    setIsSnackbarOpen,
    playSoundEffect: playBackgroundSoundEffect
  } = context;

  
  const handleLockedDoor = () => {
    showSnackbar("Access denied", "warning", 3000);
    playSoundEffect("/sfx/short/metallock.mp3");
  };

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

  return {
    ...context,
    showSnackbar,
    closeSnackbar,
    playSoundEffect,
    handleLockedDoor,
  };
};

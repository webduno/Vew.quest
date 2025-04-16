import React, { createContext, useContext, useState, ReactNode, useRef } from 'react';
import { useBackgroundMusic } from '@/../scripts/contexts/BackgroundMusicContext';
import { HardBadge } from './HardBadge';
import { HandbookPage } from './HandbookPage';
import { ErrorSheet } from './ErrorSheet';
import { PaperSheet } from './PaperSheet';
import { SuccessBadge } from './SuccessBadge';
import { WarningBadge } from './WarningBadge';

// Define the types for severity
type SnackbarSeverity = 'success' | 'error' | 'info' | 'warning' | 'title' | 'handbook';

// Define the context type
type BewContextType = {
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
const BewContext = createContext<BewContextType | undefined>(undefined);

// Custom hook to use the Bew context
export const useBew = () => {
  const context = useContext(BewContext);
  if (context === undefined) {
    throw new Error('useBew must be used within a BewProvider');
  }
  return context;
};


// Provider component
export const BewProvider = ({ children }: { children: ReactNode }) => {
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
  const contextValue: BewContextType = {
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
    <BewContext.Provider value={contextValue}>
      <SnackbarNotif />
      {children}
    </BewContext.Provider>
  );
};

export const SnackbarNotif = () => {
  const { isSnackbarOpen, snackbarMessage, snackbarSeverity, closeSnackbar } = useBew();

  if (!isSnackbarOpen) {
    return null;
  }


  return (
    <div  className=" pa-4 pos-fix top-0 right-0 flex-col z-1000  hover-4">
      {snackbarSeverity === 'success' && 
        <SuccessBadge>{snackbarMessage}</SuccessBadge>
      }
      {snackbarSeverity === 'info' && 
        <PaperSheet>{snackbarMessage}</PaperSheet>
      }
      {snackbarSeverity === 'error' && 
        <ErrorSheet>{snackbarMessage}</ErrorSheet>
      }
      {snackbarSeverity === 'warning' && 
        <WarningBadge>{snackbarMessage}</WarningBadge>
      }
      {snackbarSeverity === 'title' && 
        <HardBadge>{snackbarMessage}</HardBadge>
      }
      {snackbarSeverity === 'handbook' && 
        <HandbookPage>{snackbarMessage}</HandbookPage>
      }
      {/* <button className="tx-white pointer pl-3 tx-mdl noborder bg-trans" onClick={closeSnackbar} >&times;</button> */}
      {/* Simple close button */}
    </div>
  );
}



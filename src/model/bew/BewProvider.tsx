import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useBackgroundMusic } from '@/../scripts/contexts/BackgroundMusicContext';

// Define the types for severity
type SnackbarSeverity = 'success' | 'error' | 'info' | 'warning' | 'title';

// Define the context type
type BewContextType = {
  testdata: string;
  isSnackbarOpen: boolean;
  snackbarMessage: string;  
  snackbarSeverity: SnackbarSeverity;
  showSnackbar: (message: string, severity: SnackbarSeverity) => void;
  closeSnackbar: () => void; // Renamed for clarity
  isCutSceneOpen: boolean;
  setIsCutSceneOpen: (isCutSceneOpen: boolean) => void;
  playSoundEffect: (soundPath: string, volume?: number) => void;
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

  const showSnackbar = (message: string, severity: SnackbarSeverity) => {
    console.log('showSnackbar: message is', message, 'severity is', severity);
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setIsSnackbarOpen(true);
  };

  const closeSnackbar = () => {
    setIsSnackbarOpen(false);
    // Optionally reset message and severity after closing animation (if any)
    // setTimeout(() => {
    //   setSnackbarMessage('');
    //   setSnackbarSeverity('info');
    // }, 300); // Adjust timing based on animation
  };

  // Wrapper function to play sound effects
  const playSoundEffect = (soundPath: string, volume?: number) => {
    playBackgroundSoundEffect(soundPath, volume);
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
  };

  console.log('BewProvider: contextValue is', contextValue); // Keep for debugging if needed

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

  // Basic styling for visibility - replace with actual Snackbar component later
  const style: React.CSSProperties = {
    backgroundColor: snackbarSeverity === 'error'
    ? '#ff5555'
    : snackbarSeverity === 'success'
      ? '#55ff55'
      : snackbarSeverity === 'warning'
        ? '#ffaa55'
        : '#55aaff',
    zIndex: 1000, // Ensure it's above other content
  };

  return (
    <div  className=" pa-4 pos-fix top-0 right-0 flex-col z-1000  hover-4">
      {snackbarSeverity === 'info' && 
        <PaperSheet>{snackbarMessage}</PaperSheet>
      }
      {snackbarSeverity === 'title' && 
        <HardBadge>{snackbarMessage}</HardBadge>
      }
      {/* <button className="tx-white pointer pl-3 tx-mdl noborder bg-trans" onClick={closeSnackbar} >&times;</button> */}
      {/* Simple close button */}
    </div>
  );
}

const HardBadge = ({ children }: { children: ReactNode }) => {
  return (
    
    <div className='z-100 tx-altfont-5  bord-r-5 pa-1 w-200px'
    style={{ background: "#3d3d3d", boxShadow:"0 4px 20px #55333377" }}
    >
      <div className='tx-altfont-5 tx-md px-4 py-2  bord-r-5'
      style={{
        boxShadow: 'inset 1px 1px 3px 0 #aaaaaa, inset -3px -3px 5px 0 #111111',
        background: '#1d1d1d',
        color: "#aaaaaa",
      }}>
        {children}
      </div>
    </div>
  );
}

const PaperSheet = ({ children }: { children: ReactNode }) => {
  return (
    
    <div className='px-2 pt-2 pb-1 z-100 tx-altfont-8   tx-lgx w-150px'
    style={{
      transform: "rotate(-2deg)",
      clipPath: "polygon(50% 0%, 100% 2%, 98% 60%, 100% 97%, 4% 100%, 0% 60%, 2% 3%)",
      background: "linear-gradient(0deg, #706C61, #8F8B7D, #605C51)",
    }}
    >
      {children}
    </div>
  );
}



'use client';
import React, { createContext, useContext } from 'react';
import { useVibeverse } from './useVibeverse';

// Define the context type
type VibeverseContextType = {
  LS_playerId: string | null;
  formatPortalUrl: (url: string) => string;
  typedUsername: string;
  setTypedUsername: (username: string) => void;
  setPlayerId: (playerId: string) => void;
  sanitizePlayerId: (playerId: string) => string;
  LS_lowGraphics: boolean;
  toggleLowGraphics: () => void;
  LS_firstTime: boolean;
  disableFirstTime: () => void;
  LS_hasFirstKey: boolean;
  setHasFirstKey: (value: boolean) => void;
};

// Create the context with default values
export const VibeverseContext = createContext<VibeverseContextType>({
  LS_playerId: null,
  formatPortalUrl: (url: string) => url,
  typedUsername: "",
  setTypedUsername: (username: string) => {},
  setPlayerId: (playerId: string) => {},
  sanitizePlayerId: (playerId: string) => playerId,
  LS_lowGraphics: false,
  toggleLowGraphics: () => {},
  LS_firstTime: true,
  disableFirstTime: () => {},
  LS_hasFirstKey: false,
  setHasFirstKey: (value: boolean) => {}
});

// Provider component
export const VibeverseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const vibeverseData = useVibeverse() || {};

  // Ensure we always provide valid values
  const contextValue: VibeverseContextType = {
    ...vibeverseData,
    LS_playerId: vibeverseData.LS_playerId || null,
    formatPortalUrl: vibeverseData.formatPortalUrl || ((url: string) => url),
  };
  
  return (
    <VibeverseContext.Provider value={contextValue}>
      {children}
    </VibeverseContext.Provider>
  );
}; 
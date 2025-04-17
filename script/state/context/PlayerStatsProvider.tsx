'use client';
import React, { createContext, useContext } from 'react';
import { usePlayerStats } from '../hook/usePlayerStats';

// Define the context type
type PlayerStatsContextType = {
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
  updateExploredStatus: (zone: string, status: boolean) => void;
  hasExploredZone: (value: string) => boolean
};

// Create the context with default values
export const PlayerStatsContext = createContext<PlayerStatsContextType>({
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
  setHasFirstKey: (value: boolean) => {},
  updateExploredStatus: (zone: string, status: boolean) => {},
  hasExploredZone: (zone: string)=> false
});

// Provider component
export const PlayerStatsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const vibeverseData = usePlayerStats() || {};

  // Ensure we always provide valid values
  const contextValue: PlayerStatsContextType = {
    ...vibeverseData,
    LS_playerId: vibeverseData.LS_playerId || null,
    formatPortalUrl: vibeverseData.formatPortalUrl || ((url: string) => url),
    updateExploredStatus: vibeverseData.updateExploredStatus || (() => {}),
  };
  
  return (
    <PlayerStatsContext.Provider value={contextValue}>
      {children}
    </PlayerStatsContext.Provider>
  );
}; 
'use client';

import React, { createContext, useState, ReactNode, useRef } from 'react';
import { ProfileSnackbarNotif } from '../../../dom/molecule/notification/ProfileSnackbarNotif';

// Define the types for severity
export type SnackbarSeverity = any
// export type SnackbarSeverity = 'success' | 'error' | 'info' | 'warning' | 'title' | 'handbook' | 'errorwarning';

// Define the context type
type ProfileSnackbarContextType = {
  isSnackbarOpen: boolean;
  snackbarMessage: ReactNode;
  autoCloseTimeoutRef: React.MutableRefObject<NodeJS.Timeout | undefined>;
  setSnackbarMessage: (message: ReactNode) => void;
  snackbarSeverity: SnackbarSeverity;
  setSnackbarSeverity: (severity: SnackbarSeverity) => void;
  setIsSnackbarOpen: (isSnackbarOpen: boolean) => void;
  triggerSnackbar: (message: ReactNode, severity: SnackbarSeverity) => void;
};

// Create the context with default values
export const ProfileSnackbarContext = createContext<ProfileSnackbarContextType | undefined>(undefined);

// Provider component
export const ProfileSnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<ReactNode>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<SnackbarSeverity>('info');
  const autoCloseTimeoutRef = useRef<NodeJS.Timeout>();

  const triggerSnackbar = (message: ReactNode, severity: SnackbarSeverity) => {
    // Show test snackbar when page loads
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setIsSnackbarOpen(true);
  }
  const contextValue: ProfileSnackbarContextType = {
    isSnackbarOpen,
    snackbarMessage,
    autoCloseTimeoutRef,
    setSnackbarMessage,
    setSnackbarSeverity,
    setIsSnackbarOpen,
    snackbarSeverity,
    triggerSnackbar
  };

  return (
    <ProfileSnackbarContext.Provider value={contextValue}>
      <ProfileSnackbarNotif />
      {children}
    </ProfileSnackbarContext.Provider>
  );
}; 
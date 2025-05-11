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
  timeoutTime: number;
  setSnackbarSeverity: (severity: SnackbarSeverity) => void;
  setIsSnackbarOpen: (isSnackbarOpen: boolean) => void;
  triggerSnackbar: (message: ReactNode, severity: SnackbarSeverity, timeout?: number) => void;
};

// Create the context with default values
export const ProfileSnackbarContext = createContext<ProfileSnackbarContextType | undefined>(undefined);

// Provider component
export const ProfileSnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<ReactNode>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<SnackbarSeverity>('info');
  const autoCloseTimeoutRef = useRef<NodeJS.Timeout>();
  const [timeoutTime, setTimeoutTime] = useState(3000);
  const triggerSnackbar = (message: ReactNode, severity: SnackbarSeverity, timeout: number = 3000) => {
    // Show test snackbar when page loads
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setIsSnackbarOpen(true);
    if (autoCloseTimeoutRef.current) {
      clearTimeout(autoCloseTimeoutRef.current);
    }
    setTimeoutTime(timeout);
    autoCloseTimeoutRef.current = setTimeout(() => {
      setIsSnackbarOpen(false);
    }, timeout);
  }
  const contextValue: ProfileSnackbarContextType = {
    isSnackbarOpen,
    snackbarMessage,
    autoCloseTimeoutRef,
    setSnackbarMessage,
    setSnackbarSeverity,
    setIsSnackbarOpen,
    snackbarSeverity,
    timeoutTime,
    triggerSnackbar
  };

  return (
    <ProfileSnackbarContext.Provider value={contextValue}>
      <ProfileSnackbarNotif />
      {children}
    </ProfileSnackbarContext.Provider>
  );
}; 
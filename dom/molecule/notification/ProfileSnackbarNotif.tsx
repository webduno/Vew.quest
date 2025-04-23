'use client';

import React, { useContext, useEffect } from 'react';
import { ProfileSnackbarContext } from '../../../script/state/context/ProfileSnackbarProvider';

export const ProfileSnackbarNotif = () => {
  const {
    isSnackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    setIsSnackbarOpen,
    autoCloseTimeoutRef
  } = useContext(ProfileSnackbarContext)!;

  useEffect(() => {
    if (isSnackbarOpen) {
      // Clear any existing timeout
      if (autoCloseTimeoutRef.current) {
        clearTimeout(autoCloseTimeoutRef.current);
      }

      // Set new timeout to close after 3 seconds
      autoCloseTimeoutRef.current = setTimeout(() => {
        setIsSnackbarOpen(false);
      }, 3000);
    }

    return () => {
      if (autoCloseTimeoutRef.current) {
        clearTimeout(autoCloseTimeoutRef.current);
      }
    };
  }, [isSnackbarOpen, setIsSnackbarOpen, autoCloseTimeoutRef]);

  if (!isSnackbarOpen) return null;

  const getBackgroundColor = () => {
    switch (snackbarSeverity) {
      case 'success':
        return '#4CAF50';
      case 'error':
        return '#f44336';
      case 'warning':
        return '#ff9800';
      case 'info':
        return '#2196f3';
      case 'title':
        return '#9c27b0';
      case 'handbook':
        return '#607d8b';
      default:
        return '#2196f3';
    }
  };

  return (
    <div
      className="pos-fix z-1000 top-0 right-0 w-100 flex-center pa-4"
      style={{
        pointerEvents: 'none',
      }}
    >
      <div
        className="bord-r-8 px-4 py-2 tx-white"
        style={{
          backgroundColor: getBackgroundColor(),
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          maxWidth: '90%',
          wordBreak: 'break-word',
        }}
      >
        {typeof snackbarMessage === 'string' ? snackbarMessage : snackbarMessage}
      </div>
    </div>
  );
}; 
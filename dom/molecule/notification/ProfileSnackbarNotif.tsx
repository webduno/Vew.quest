'use client';

import React, { useContext, useEffect } from 'react';
import { ProfileSnackbarContext } from '../../../script/state/context/ProfileSnackbarProvider';

export const ProfileSnackbarNotif = () => {
  const {
    isSnackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    setIsSnackbarOpen,
    autoCloseTimeoutRef,
    timeoutTime
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
      }, timeoutTime);
    }

    return () => {
      if (autoCloseTimeoutRef.current) {
        clearTimeout(autoCloseTimeoutRef.current);
      }
    };
  }, [isSnackbarOpen, setIsSnackbarOpen, autoCloseTimeoutRef, snackbarMessage]);

  if (!isSnackbarOpen) return null;

  const getBackgroundColor = () => {
    switch (snackbarSeverity) {
      case 'success':
        return '#80DB7D';
      case 'error':
        return '#f44336';
      case 'yellow':
        return '#f7cb28';
      case 'warning':
        return '#ff9800';
        case 'info':
          return '#2196f3';
          case 'purple':
            return '#807DDB';
      case 'errorwarning':
        return 'linear-gradient(45deg, #f47366, #ff9800)';
      case 'title':
        return '#9c27b0';
      case 'handbook':
        return '#cccccc';
      default:
        return '#2196f3';
    }
  };

  return (
    <div
      className="pos-fix  bottom-0 right-0 w-100 flex-center pb-8"
      style={{
        zIndex: 10000,
        // pointerEvents: 'none',
      }}
    >
      <div
        className="bord-r-8 hover-snack-6 px-6 py-4 tx-white tx-altfont-2"
        style={{
          background: getBackgroundColor(),
          boxShadow: 'inset 0 -4px 0 rgba(0,0,0,0.2)',
          maxWidth: '90%',
          wordBreak: 'break-word',
        }}
      >
        {typeof snackbarMessage === 'string' ? snackbarMessage : snackbarMessage}
      </div>
    </div>
  );
}; 
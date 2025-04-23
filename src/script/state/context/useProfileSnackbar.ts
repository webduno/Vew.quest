'use client';
import { useContext } from 'react';
import { ProfileSnackbarContext, SnackbarSeverity } from '../../../../script/state/context/ProfileSnackbarProvider';
import { ReactNode } from 'react';

export function useProfileSnackbar() {
  const context = useContext(ProfileSnackbarContext);
  if (!context) {
    throw new Error('useProfileSnackbar must be used within a ProfileSnackbarProvider');
  }
  return context;
} 
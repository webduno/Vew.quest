import React from 'react';

import { ErrorSheet } from '@/dom/atom/toast/ErrorSheet';
import { HandbookPage } from '@/dom/atom/toast/HandbookPage';
import { HardBadge } from '@/dom/atom/toast/HardBadge';
import { PaperSheet } from '@/dom/atom/toast/PaperSheet';
import { SuccessBadge } from '@/dom/atom/toast/SuccessBadge';
import { WarningBadge } from '@/dom/atom/toast/WarningBadge';
import { useGameCore } from './useGameCore';


export const SnackbarNotif = () => {
  const {
    isSnackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    closeSnackbar
  } = useGameCore();

  if (!isSnackbarOpen) {
    return null;
  }


  return (
    <div className=" pa-4 pos-fix top-0 right-0 flex-col z-1000  hover-4">
      {snackbarSeverity === 'success' &&
        <SuccessBadge>{snackbarMessage}</SuccessBadge>}
      {snackbarSeverity === 'info' &&
        <PaperSheet>{snackbarMessage}</PaperSheet>}
      {snackbarSeverity === 'error' &&
        <ErrorSheet>{snackbarMessage}</ErrorSheet>}
      {snackbarSeverity === 'warning' &&
        <WarningBadge>{snackbarMessage}</WarningBadge>}
      {snackbarSeverity === 'title' &&
        <HardBadge>{snackbarMessage}</HardBadge>}
      {snackbarSeverity === 'handbook' &&
        <HandbookPage>{snackbarMessage}</HandbookPage>}
      {/* <button className="tx-white pointer pl-3 tx-mdl noborder bg-trans" onClick={closeSnackbar} >&times;</button> */}
      {/* Simple close button */}
    </div>
  );
};

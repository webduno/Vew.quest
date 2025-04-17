import { useContext } from 'react';
import { BewContext } from './BewProvider';

// Custom hook to use the Bew context

export const useGameCore = () => {
  const context = useContext(BewContext);
  if (context === undefined) {
    throw new Error('useGameCore must be used within a BewProvider');
  }
  return context;
};

import { useContext } from 'react';
import { GameCoreContext } from '../GameCoreProvider';

// Custom hook to use the Bew context

export const useGameCore = () => {
  const context = useContext(GameCoreContext);
  if (context === undefined) {
    throw new Error('useGameCore must be used within a GameCoreProvider');
  }
  return context;
};

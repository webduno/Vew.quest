'use client';
import React from 'react';
import { BewGame } from './BewGame';
import { BackgroundMusicProvider } from '@/../script/state/context/BackgroundMusicContext';
import { PlayerStatsProvider } from '@/../script/state/context/PlayerStatsProvider';
import { GameCoreProvider } from '@/../script/state/context/GameCoreProvider';

export const BewGameContainer: React.FC = () => {
  return (
    <BackgroundMusicProvider>
      <PlayerStatsProvider>
        <GameCoreProvider>
          <BewGame />
        </GameCoreProvider>
      </PlayerStatsProvider>
    </BackgroundMusicProvider>
  );
}; 
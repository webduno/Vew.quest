'use client';
import React from 'react';
import { BewGame } from './BewGame';
import { BackgroundMusicProvider } from '@/../script/state/context/BackgroundMusicContext';
import { PlayerStatsProvider } from '@/../script/state/context/PlayerStatsProvider';
import { GameCoreProvider } from '@/../script/state/context/GameCoreProvider';
import { BewWorldGame } from './BewWorldGame';

export const BewWorldGameContainer: React.FC = () => {
  return (
    <BackgroundMusicProvider isWorldGame={true}>
      <PlayerStatsProvider>
        <GameCoreProvider>
          <BewWorldGame />
        </GameCoreProvider>
      </PlayerStatsProvider>
    </BackgroundMusicProvider>
  );
}; 
'use client';
import React from 'react';
import { BewGame } from './BewGame';
import { PlayerStatsProvider } from '@/../script/contexts/PlayerStatsProvider';
import { GameCoreProvider,  } from '../../../script/contexts/GameCoreProvider';
import { BackgroundMusicProvider } from '../../../script/contexts/BackgroundMusicContext';


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
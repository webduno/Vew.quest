'use client';
import React from 'react';
import { BewGame } from './BewGame';
import { VibeverseProvider } from '@/../script/contexts/VibeverseProvider';
import { GameCoreProvider,  } from '../../../script/contexts/GameCoreProvider';
import { BackgroundMusicProvider } from '../../../script/contexts/BackgroundMusicContext';


export const BewGameContainer: React.FC = () => {
  return (
    <BackgroundMusicProvider>
      <VibeverseProvider>
        <GameCoreProvider>
          <BewGame />
        </GameCoreProvider>
      </VibeverseProvider>
    </BackgroundMusicProvider>
  );
}; 
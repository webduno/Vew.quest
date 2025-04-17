'use client';
import React from 'react';
import { BewGame } from './BewGame';
import { VibeverseProvider } from '@/../script/contexts/VibeverseProvider';
import { BewProvider,  } from '../../../script/contexts/BewProvider';
import { BackgroundMusicProvider } from '../../../script/contexts/BackgroundMusicContext';


export const BewGameContainer: React.FC = () => {
  return (
    <BackgroundMusicProvider>
      <VibeverseProvider>
        <BewProvider>
          <BewGame />
        </BewProvider>
      </VibeverseProvider>
    </BackgroundMusicProvider>
  );
}; 
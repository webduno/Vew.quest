'use client';
import React from 'react';
import { BewGame } from './BewGame';
import { VibeverseProvider } from '@/dom/VibeverseProvider';
import { createContext, useContext, useState, ReactNode } from 'react';
import { BewProvider,  } from '../../../scripts/contexts/BewProvider';
import { BackgroundMusicProvider } from '../../../scripts/contexts/BackgroundMusicContext';


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
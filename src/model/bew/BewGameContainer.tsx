'use client';
import React from 'react';
import { BewGame } from './BewGame';
import { VibeverseProvider } from '@/dom/VibeverseProvider';
import { createContext, useContext, useState, ReactNode } from 'react';
import { BewProvider,  } from './BewProvider';


export const BewGameContainer: React.FC = () => {
  return (
    <VibeverseProvider>
      <BewProvider>
        <BewGame />
      </BewProvider>
    </VibeverseProvider>
  );
}; 
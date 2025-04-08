'use client';
import React from 'react';
import { BewGame } from './BewGame';
import { VibeverseProvider } from '@/dom/VibeverseProvider';

export const BewGameContainer: React.FC = () => {
  return (
    <VibeverseProvider>
      <BewGame />
    </VibeverseProvider>
  );
}; 
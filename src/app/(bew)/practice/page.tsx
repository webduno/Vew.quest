'use client';

import { useState, useCallback } from 'react';
import { AnalogModalScreen } from '@/dom/molecule/SenseMeter/AnalogModalScreen';
import { calculateAccuracy } from '@/../scripts/utils/calculateAccuracy';
import { BewLogo } from '@/dom/atom/BewLogo';
import { BewMenuButton } from '@/dom/atom/BewMenuButton';
type GameState = 'initial' | 'playing' | 'results';

export default function PracticePage() {
  const [enableLocked, setEnableLocked] = useState(false);
  const [gameState, setGameState] = useState<GameState>('initial');
  const [target, setTarget] = useState<null | {
    code: string;
    values: {
      natural: number;
      temp: number;
      light: number;
      color: number;
      solid: number;
      confidence: number;
    }
  }>(null);
  const [results, setResults] = useState<null | {
    natural: number;
    temp: number;
    light: number;
    color: number;
    solid: number;
    confidence: number;
  }>(null);

  function generateRandomTarget() {
    // Generate random 8-digit code in format XXXX-XXXX
    const code = `${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    return {
      code,
      values: {
        natural: Math.floor(Math.random() * 100),
        temp: Math.floor(Math.random() * 100),
        light: Math.floor(Math.random() * 100),
        color: Math.floor(Math.random() * 100),
        solid: Math.floor(Math.random() * 100),
        confidence: Math.floor(Math.random() * 100),
      }
    };
  }

  const handleStart = () => {
    setTarget(generateRandomTarget());
    setGameState('playing');
    setResults(null);
  };

  const handleSend = useCallback((params: {
    type: string;
    natural: number;
    temp: number;
    light: number;
    color: number;
    solid: number;
    confidence: number;
  }) => {
    if (!target) return;
    
    setResults({
      natural: calculateAccuracy(target.values.natural, params.natural),
      temp: calculateAccuracy(target.values.temp, params.temp),
      light: calculateAccuracy(target.values.light, params.light),
      color: calculateAccuracy(target.values.color, params.color),
      solid: calculateAccuracy(target.values.solid, params.solid),
      confidence: calculateAccuracy(target.values.confidence, params.confidence),
    });
    
    setGameState('results');
  }, [target]);

  return (
    <div className="h-100vh w-100vw flex-col flex-center bg-dark">
      <div className='pos-abs left-0 top-0'>
      <BewLogo />
      </div>
      {gameState === 'initial' && (
        <button 
          className="tx-lg bg-trans noborder box-shadow-5-b pa-0 pointer tx-altfont-1" 
          style={{
            color: "#999999",
          }}
          onClick={handleStart}
        >
          <BewMenuButton>Start Practice</BewMenuButton>
        </button>
      )}

      {gameState === 'playing' && target && (
        <div className="flex-col flex-center">
          <div className="tx-white tx-center mb-8">
            {/* <div className="tx-md tx-altfont-5 opaci-50">Target Code</div> */}
            <div className="tx-xxl tx-altfont-8 opaci-75 tx-ls-5">#{target.code}</div>
          </div>
          
          <div className="flex-col pos-rel">
            <AnalogModalScreen
              absolute={false}
              setEnableLocked={setEnableLocked}
              enableLocked={enableLocked}
              playerRotation={{ x: 0, y: 0, z: 0 }}
              onSend={handleSend}
            />
          </div>
        </div>
      )}

      {gameState === 'results' && results && target && (
        <div className="tx-white tx-center">
          <h2 className="tx-lg mb-4">Results for {target.code}</h2>
          <div className="flex-col gap-2">
            <p>Natural: {results.natural}% accuracy (Your guess vs Target: {target.values.natural})</p>
            <p>Temperature: {results.temp}% accuracy (Your guess vs Target: {target.values.temp})</p>
            <p>Light: {results.light}% accuracy (Your guess vs Target: {target.values.light})</p>
            <p>Color: {results.color}% accuracy (Your guess vs Target: {target.values.color})</p>
            <p>Solid: {results.solid}% accuracy (Your guess vs Target: {target.values.solid})</p>
            <p>Confidence: {results.confidence}% accuracy (Your guess vs Target: {target.values.confidence})</p>
          </div>
          <button 
            className="bg-white tx-dark px-8 py-4 bord-r-1 hover-opaci-75 mt-8" 
            onClick={handleStart}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
} 
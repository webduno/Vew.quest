'use client';

import { useState, useCallback } from 'react';
import { AnalogModalScreen } from '@/dom/molecule/SenseMeter/AnalogModalScreen';
import { calculateAccuracy } from '@/../scripts/utils/calculateAccuracy';
import { BewLogo } from '@/dom/atom/BewLogo';
import { BewMenuButton } from '@/dom/atom/BewMenuButton';
import { PaperSheet } from '../../../../scripts/contexts/PaperSheet';
type GameState = 'initial' | 'playing' | 'results';

export default function PracticePage() {
  const [enableLocked, setEnableLocked] = useState(false);
  const [gameState, setGameState] = useState<GameState>('initial');
  const [sentObject, setSentObject] = useState<null | {
    type: string;
    natural: number;
    temp: number;
    light: number;
    color: number;
    solid: number;
    confidence: number;
  }>(null); 
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
  const [overallAccuracy, setOverallAccuracy] = useState<number>(0);
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
    setSentObject(null);
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
    setSentObject(params);
    const calculatedResults = {
      natural: calculateAccuracy(target.values.natural, params.natural, true, false),
      temp: calculateAccuracy(target.values.temp, params.temp, true, false),
      light: calculateAccuracy(target.values.light, params.light, true, false),
      color: calculateAccuracy(target.values.color, params.color, true, false),
      solid: calculateAccuracy(target.values.solid, params.solid, true, false),
      confidence: calculateAccuracy(target.values.confidence, params.confidence, true, false),
    };
    const overallAccuracy = (calculatedResults.natural + calculatedResults.temp + calculatedResults.light + calculatedResults.color + calculatedResults.solid ) / 5;
    setOverallAccuracy(overallAccuracy);
    setResults(calculatedResults);
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
          <div className="tx-lg mb-4 tx-altfont-5 tx-shadow-5"
          style={{
            color: "#999999",
          }}
          >Results for <br /> #{target.code}</div>
          <PaperSheet className='w-300px pt-8 px-4' style={{
            transform: `rotate(${Math.random()-0.5}deg)`,
            clipPath: "polygon(0 1%, 99% 0, 100% 50%, 99% 100%, 0 97%, 1% 50%)",
          }}>
            <div className="flex-col gap-2">  

          <div className="flex-col gap- w-100  flex-align-stretch">
            <div className="flex-row tx-sm">
              <div className="tx-black  flex-1 tx-start tx-altfont-1 opaci-75">
              CATEGORY (SENT/TARGET)
              </div>
              <div className="tx-white tx-altfont-1 tx-black opaci-75">
                 HIT
              </div>
            </div>
            <hr className='w-100 opaci-50' />
            <div className="flex-row">
              <div className="tx-black opaci-50 flex-1 tx-start">Natural: ({sentObject?.natural}/{target.values.natural})</div>
              <div className="tx-white">
                 {Number(results.natural).toFixed(3)}%
              </div>
            </div>
            <div className="flex-row">
              <div className="tx-black opaci-50 flex-1 tx-start">Temperature: ({sentObject?.temp}/{target.values.temp})</div>
              <div className="tx-white">
                 {Number(results.temp).toFixed(3)}%
              </div>
            </div>
            <div className="flex-row">
              <div className="tx-black opaci-50 flex-1 tx-start">Light: ({sentObject?.light}/{target.values.light})</div>
              <div className="tx-white">
                 {Number(results.light).toFixed(3)}%
              </div>
            </div>
            <div className="flex-row">
              <div className="tx-black opaci-50 flex-1 tx-start">Color: ({sentObject?.color}/{target.values.color})</div>
              <div className="tx-white">
                 {Number(results.color).toFixed(3)}%
              </div>
            </div>
            <div className="flex-row">
              <div className="tx-black opaci-50 flex-1 tx-start">Solid: ({sentObject?.solid}/{target.values.solid})</div>
              <div className="tx-white">
                 {Number(results.solid).toFixed(3)}%
              </div>
            </div>
          </div>          
          <hr className='w-100 opaci-50' />
          <div className="flex-row pb-4  ">
<div className="flex-col">
<div className="flex-1 tx-center tx-altfont-5 opaci-50">
Score:
</div>
<div className="flex-1 tx-center tx-altfont-8 tx-shadow-5 tx-xxl">
{Number(overallAccuracy).toFixed(3)}%
</div>
</div>

          </div>
            </div>
          </PaperSheet>
          <button 
            className="noborder bg-trans tx-white pointer mt-4 tx-altfont-1" 
            onClick={handleStart}
          >
            <BewMenuButton>Try Again</BewMenuButton>
          </button>
        </div>
      )}
    </div>
  );
} 
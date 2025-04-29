'use client';
import { useState, useCallback, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import JSConfetti from 'js-confetti';

import { usePlayerStats } from '@/../script/state/hook/usePlayerStats';
import { useBackgroundMusic } from '@/../script/state/context/BackgroundMusicContext';
import { generateRandomTargetRandomized } from '@/../script/utils/platform/generateRandomTargetRandomized';
import { calculateAccuracy } from '@/../script/utils/play/calculateAccuracy';
import { isMobile } from '@/../script/utils/platform/mobileDetection';
import { useFetchedStats } from '@/script/state/context/FetchedStatsContext';

import targetsData from '@/../public/data/targets_1.json';
import { VewPanelTool } from '@/dom/organ/vew_tool/VewPanelTool';
import { WrappedBewUserStatsSummary } from '../../../dom/organ/vew_tool/BewUserStatsSummary';
import { VewToolLogin } from '@/dom/organ/vew_tool/VewToolLogin';
import { ToolResultsCard } from '../../../dom/organ/vew_tool/ToolResultsCard';
import { MenuIconBar } from '@/dom/organ/vew_tool/MenuIconBar';
import { VewMobileHeader } from '@/dom/organ/vew_tool/VewMobileHeader';
import { VewToolTitleNav } from '@/dom/organ/vew_tool/VewToolTitleNav';
import { VewPreviewImage } from '../../../dom/organ/vew_tool/VewPreviewImage';
import { VewAltLogo } from '../../../dom/organ/vew_tool/VewAltLogo';

type TargetsData = {
  [key: string]: string;
};

export type GameState = 'initial' | 'playing' | 'results';

export default function TrainingPage() {
  const { isLoading, crvObjects, refetchStats } = useFetchedStats();
  const [initiallyAutoLoaded, setInitiallyAutoLoaded] = useState(false);
  const { playSoundEffect } = useBackgroundMusic();
  useEffect(() => {
    if (isLoading) { return; }
    if (initiallyAutoLoaded) { return; }
    if (!LS_playerId) {
      // setEnterUsername(true);
      return;
    }
    console.log("crvObjects", crvObjects.length);
    setInitiallyAutoLoaded(true);
    if (crvObjects.length === 0) { 

      generateNewRound()
      return; 
    }
    // console.log("crvObjects 22", crvObjects);
    // console.log("initiallyAutoLoaded", initiallyAutoLoaded);

    handleStart();

  }, [isLoading]);
  const [ wndwTg, s__wndwTg] = useState<any>(null);
  const [ telegram_id, s__telegram_id] = useState<string | null>(null);

  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     console.log("window.Telegram", window.Telegram);

  //   }
  //     if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
  //     s__wndwTg(window.Telegram.WebApp);
  //     const thenewid = window.Telegram.WebApp.initDataUnsafe?.user?.id || null;
  //     console.log("thenewid", thenewid);
  //     s__telegram_id(thenewid);
  //     if (thenewid) {
  //       setPlayerId(thenewid);
  //       localStorage.setItem('VB_PLAYER_ID', thenewid);
  //       generateNewRound()

  //     }
  //   }
  // }, []);


  const generateNewRound = async () => {
    const newTarget = await fetchRandomFromCocoDatabase();
    setTarget(newTarget);
    setGameState('playing');
    setResults(null);
    setSentObject(null);
  }

  const { LS_playerId, typedUsername, setTypedUsername, setPlayerId, sanitizePlayerId } = usePlayerStats();
  const [enterUsername, setEnterUsername] = useState(false);
  const [isLoadingMyRequests, setIsLoadingMyRequests] = useState(false);
  const [myRequests, setMyRequests] = useState<null | {
    description: string;
    bounty: number;
    attempts: number;
    solved: number;
    created_at: string;
  }[]>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enableLocked, setEnableLocked] = useState(false);
  const [gameState, setGameState] = useState<GameState>('initial');
  const [successRequest, setSuccessRequest] = useState(false);
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
      type: string;
      natural: number;
      temp: number;
      light: number;
      color: number;
      solid: number;
      confidence: number;
    }
  }>(null);
  const [selectedTargetInfo, setSelectedTargetInfo] = useState<null | {
    id: string;
    description: string;
  }>(null);
  const [overallAccuracy, setOverallAccuracy] = useState<number>(0);
  const [results, setResults] = useState<null | {
    type: boolean;
    natural: number;
    temp: number;
    light: number;
    color: number;
    solid: number;
    confidence: number;
  }>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showSketchModal, setShowSketchModal] = useState(false);
  const [sketchData, setSketchData] = useState<any>(null);
  const [notes, setNotes] = useState<any>(null);


  

  async function fetchRandomFromCocoDatabase() {
    // check if user has ability to play audio and cliiked anything or interacted with the page
    

    const confetti = new JSConfetti();
    confetti.addConfetti({
      // confettiColors: ['#FDC908', '#7DDB80', '#807DDB', '#6DcB70'],
      // different question mark emojis
emojiSize:50,
      emojis: ["❔"],
      confettiNumber: 15,
    });
    try {
      // Get random key from the object
      const keys = Object.keys(targetsData as TargetsData);
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      const targetData = (targetsData as TargetsData)[randomKey];
      
      // Split the data into description and values
      const [description, valuesStr] = targetData.split('\n');
      const [type, natural, temp, light, color, solid, confidence] = valuesStr.split(',').map(Number);
      
      // Update the selected target info
      setSelectedTargetInfo({
        id: randomKey,
        description: description.trim()
      });
      
      const typeString = ['object', 'entity', 'place', 'event'][type - 1];
      return {
        code: randomKey,
        values: {
          type: typeString,
          natural,
          temp,
          light,
          color,
          solid,
          confidence
        }
      };
    } catch (error) {
      console.error('Error reading from COCO database:', error);
      // Fallback to random generation if there's an error
      return generateRandomTargetRandomized();
    }
  }

  const handleStart = async () => {
    if (!LS_playerId && !typedUsername) {
      setEnterUsername(true);
      return;
    }

    if (!LS_playerId && typedUsername) {
      const sanitizedId = sanitizePlayerId(typedUsername);
      setPlayerId(sanitizedId);
      localStorage.setItem('VB_PLAYER_ID', sanitizedId);
      await refetchStats();
    }

    const newTarget = await fetchRandomFromCocoDatabase();
    setTarget(newTarget);
    setGameState('playing');
    setResults(null);
    setSentObject(null);
  };

  const handleSend = useCallback(async (params: {
    type: string;
    natural: number;
    temp: number;
    light: number;
    color: number;
    solid: number;
    confidence: number;
  }, noteData: any, drawingData: any) => {
    if (!target) return;
    setSentObject(params);
    const calculatedResults = {
      type: target.values.type.toLowerCase() === params.type.toLowerCase() ? true : false,
      natural: calculateAccuracy(target.values.natural, params.natural, true, false),
      temp: calculateAccuracy(target.values.temp, params.temp, true, false),
      light: calculateAccuracy(target.values.light, params.light, false, false),
      color: calculateAccuracy(target.values.color, params.color, false, false),
      solid: calculateAccuracy(target.values.solid, params.solid, false, false),
      confidence: calculateAccuracy(target.values.confidence, params.confidence, true, false),
    };
    const overallAccuracy = (
      calculatedResults.natural +
      calculatedResults.temp +
      calculatedResults.light +
      calculatedResults.color +
      calculatedResults.solid ) / 5;


    setOverallAccuracy(overallAccuracy);
    setResults(calculatedResults);
    setGameState('results');

    // save to supabase
    const saveResponse = await fetch('/api/supabase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        objList: {
          sent: {
            ...params,
          },
          notes: noteData,
          sketch: drawingData,
          target: target?.values,
          ai_sent_guess: "n/a",
          target_id: selectedTargetInfo?.id.padStart(12, '0'),
        },
        storageKey: LS_playerId
      })
    });
    
    playSoundEffect("/sfx/short/sssccc.mp3")
    // Refetch stats after saving new data
    await refetchStats();

    // image if sketch is not null modal
    if (sketchData) {
      setShowSketchModal(true);
    } else {
      setShowImageModal(true);
    }
  }, [target, LS_playerId, refetchStats]);


  const handleFullSend = async (params: {
    sketch: any;
    notes: any;
    options: {type: string;
    natural: number;
    temp: number;
    light: number;
    color: number;
    solid: number;
    confidence: number;}
  }) => {
    // playSoundEffect("/sfx/short/sssccc.mp3")
    setSketchData(params.sketch);
    setNotes(params.notes);
    handleSend(params.options, params.notes, params.sketch, );
    
  }

  const handleTryAgain = async () => {
    const newTarget = await fetchRandomFromCocoDatabase();
    setShowImageModal(false);
    setShowSketchModal(false);
    setSketchData(null);
    setTarget(newTarget);
    setGameState('playing');
    setResults(null);
    setSentObject(null);
    setTimeout(async () => {
      playSoundEffect("/sfx/short/cling.mp3")
  }, 200);
}

  return (
    <div className='w-100  flex-col flex-justify-start autoverflow-y'>
      
      <div className='w-100  flex-col  '>
        {gameState === 'initial' && (
          <VewToolLogin
            gameState={gameState}
            setGameState={setGameState}
            typedUsername={typedUsername}
            setTypedUsername={setTypedUsername}
            isLoading={isLoading}
            handleStart={handleStart}
            sanitizePlayerId={sanitizePlayerId}
          />
        )}

        {gameState === 'playing' && (
          <div className='flex-col w-100 '>
            <div className='flex-row w-100  flex-justify-stretch flex-align-stretch'
              style={{ alignContent: "stretch"}}
            >

              <MenuIconBar  playSoundEffect={playSoundEffect} />

              <div className='flex-1 flex-col flex-align-stretch  flex-justify-start '>
                
                <VewMobileHeader />

                {<div className='Q_sm_x py-2 '> </div>}
                
                <VewToolTitleNav target={target} setShowImageModal={setShowImageModal}
                  playSoundEffect={playSoundEffect}
                 />

                <div className='flex-1 tx-altfont-2 flex-col '>
<div id='main-content-container' className='gap-8 flex-col pt-8 relative w-100'>
  {Array.from({ length: 15 }).map((_, index) => {
    const steps = [0, 20, 60, 80, 100, 80, 60, 20, 0, -20, -60, -80, -100, -80, -60];
    const xOffset = steps[index];
    return (
      <div 
        key={index}
        className='border-gg bord-r-25 tx-lg pa-8'
        style={{
          transform: `translateX(${xOffset}%)`,
          transition: 'transform 0.3s ease-in-out'
        }}
      >
        Hello
      </div>
    );
  })}
</div>

                </div>

              </div>



              {!isMobile() && crvObjects.length > 0 && (<>
                <div className='h-100 h-100vh w-250px pr-4 Q_sm_x' id="user-stats-bar">
                <WrappedBewUserStatsSummary />
                </div>
              </>)}



            </div>
          </div>
        )}

        {gameState !== 'results' && showImageModal && (<>
        <div className='pos-abs flex-col top-0 left-0 w-100 h-100 bg-glass-10  z-200'>
        <VewPreviewImage selectedTargetInfo={selectedTargetInfo} 
          setShowImageModal={setShowImageModal} 
        />

                    </div>
        </>)}



        {gameState === 'results' && results && target && (myRequests?.length === 0 || !myRequests) && (<>
        <div className='flex-col z-1000 w-100 pos-abs top-0 left-0 pt-4'
        style={{
          filter: "hue-rotate(160deg) brightness(1.5)",
        }}
        >
      <VewAltLogo />
          

        </div>
          <ToolResultsCard
            target={target}
            results={results}
            sentObject={sentObject}
            overallAccuracy={overallAccuracy}
            showImageModal={showImageModal}
            setShowImageModal={setShowImageModal}
            showSketchModal={showSketchModal}
            setShowSketchModal={setShowSketchModal}
            sketchData={sketchData}
            notes={notes}
            handleTryAgain={handleTryAgain}
            selectedTargetInfo={selectedTargetInfo}
          />
        </>)}

    </div>
    </div>
  );
} 








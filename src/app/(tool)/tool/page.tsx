'use client';
import { useState, useCallback, useEffect } from 'react';
import { usePlayerStats } from '@/../script/state/hook/usePlayerStats';

import { AnalogModalScreen } from '@/dom/molecule/game/SenseMeter/AnalogModalScreen';
import { calculateAccuracy } from '@/../script/utils/play/calculateAccuracy';
import { BewLogo } from '@/dom/atom/logo/BewLogo';
import { KeyboardBtn } from '@/dom/atom/button/KeyboardBtn';
import { PaperSheet } from '@/dom/atom/toast/PaperSheet';
import targetsData from '@/../public/data/targets_1.json';
import { AnalogMobileScreen } from '@/dom/bew/AnalogMobileScreen';
import { Tooltip } from 'react-tooltip';
import { BewUserStatsSummary } from '../../../dom/bew/BewUserStatsSummary';
import { isMobile } from '../../../../script/utils/platform/mobileDetection';
import { useFetchedStats } from '@/script/state/context/FetchedStatsContext';
import { MenuBarItem } from '@/dom/bew/MenuBarItem';
import { random10CharString } from '../../../../script/utils/platform/random10CharString';
import { InitialToolLogin } from '@/dom/bew/InitialToolLogin';
import { generateRandomTargetRandomized } from '../../../../script/utils/platform/generateRandomTargetRandomized';
import { ToolResultsCard } from '../../../dom/bew/ToolResultsCard';
import { BewWorldLogo } from '@/dom/bew/BewWorldLogo';
import { useBackgroundMusic } from '../../../../script/state/context/BackgroundMusicContext';
import JSConfetti from 'js-confetti';

type TargetsData = {
  [key: string]: string;
};

export type GameState = 'initial' | 'playing' | 'results';

export default function TrainingPage() {
  const { isLoading, crvObjects, mailboxRequests, isLoadingMailbox, mailboxError, fetchMailboxRequests, refetchStats } = useFetchedStats();
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
    console.log("target", target);
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
    const saveData = await saveResponse.json();
    
    playSoundEffect("/sfx/short/sssccc.mp3")
    // Refetch stats after saving new data
    await refetchStats();

    // image modal
    // setShowImageModal(true);
    setShowSketchModal(true);
  }, [target, LS_playerId, refetchStats]);

  const handleRequestCRV = async () => {
    const newRequestDescription = prompt('Enter a new CRV request description:');
    const newRequestBounty = prompt('Enter a bounty (OPTIONAL)');

    if (!newRequestDescription?.trim() || isSubmitting) return;
    const LS_playerId = localStorage.getItem('VB_PLAYER_ID');
    const creator_id = LS_playerId || random10CharString();
    
    // Save the generated ID if it's new
    if (!LS_playerId) {
      localStorage.setItem('VB_PLAYER_ID', creator_id);
    }
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/supabase/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache'
        },
        body: JSON.stringify({
          description: newRequestDescription.trim(),
          creator_id,
          bounty: newRequestBounty
        }),
        cache: 'no-store'
      });

      const data = await response.json();
      setSuccessRequest(data.success);
    } catch (error) {
      console.error('Error submitting request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
    setTimeout(async () => {
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
}, 200);
}

  return (
    <div className='w-100 h-100  flex-col flex-justify-start'>
      <div className='w-100  flex-col  '>
        {gameState === 'initial' && (
          <InitialToolLogin
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
          <div className='flex-col w-100 h-100vh'>
            <div className='flex-row w-100 flex-justify-stretch h-100'>
              {!isMobile() && (<>
                <div id="menu-icon-bar" className=' h-100 Q_sm_x'
                style={{borderRight: "1px solid #E5E5E5"}}
                >
                  <a href="/" className='pointer'>
                    <img src="/bew/pnglogo.png" alt="tool_bg7" className='px-2 py-4 ' width="50px" />
                  </a>

                  <MenuBarItem 
                href="/dashboard"
                emoji="🧮"
                tooltip="Dashboard"
                />
                
                
                <MenuBarItem 
                href="/dashboard#resources"
                emoji="📚"
                tooltip="Resources"
                />

                <MenuBarItem 
                href="/leaderboard"
                emoji="🏆"
                tooltip="Leaderboard"
                />

                <MenuBarItem 
                href="/profile"
                emoji="👤"
                tooltip="Profile"
                />
{/* 
                <MenuBarItem 
                href="#"
                emoji="⚙️"
                tooltip="Settings"
                /> */}

                <MenuBarItem 
                href="/about"
                emoji="❓"
                tooltip="About"
                />
              </div>
              </>)}

              <div className='flex-1 flex-col flex-align-stretch flex-justify-start h-100'>
                {<div className='Q_xs flex-row px-4'>
                   <BewUserStatsSummary minified  />
                   <div className='flex-1 flex-col flex-align-end '>
                      <a href="/profile" className='nodeco tx-lg bord-r-100 hover-jump bord-r-100 pointer noverflow block pa-1 pt-3'
                      
                      >
                        <img src="/bew/pfp/row-4-column-1.png" alt="profile" width="36px bord-r-100 pointer noverflow block" />
                      </a>
                   </div>
                </div>}
                {<div className='Q_sm_x py-2 '> </div>}
               
                
                <div className='pos-rel tx-white ma-4 pa-4 mt-0 bord-r-15 tx-altfont-2 flex-col flex-align-start gap-2'
                style={{
                  background: "#807DDB",
                  boxShadow: "0 4px 0 #6B69CF",
                }}
                >
                <a href="/dashboard"           style={{color: "#fafafa"}}     
                className='opaci-50 nodeco pointer'>← Go to Dashboard</a>
                <div className='tx-bold tx-lg'>Target Code #{target?.code}</div>



                <div
                style={{
                  transform: "translate(-100%,-25%)",
                  background: "#fafafa",
                  boxShadow: "0 4px 0 #cccccc",
                  width: "40px",
                  height: "40px",
                }}
                onClick={() => {
                  playSoundEffect("/sfx/short/chairsit.mp3")
                  setShowImageModal( prev => !prev);
                }}
                data-tooltip-id="image-preview-tooltip"
                data-tooltip-content="View Target"
                data-tooltip-place="bottom"
                data-tooltip-variant='light'
                className='m r-4 pointer flex-row gap-2 bg-b-10 flex-col  bord-r-100 pos-abs right-0 top-0'>
                  {/* eye emoji */}
                  <div className='tx-mdl'>👀</div>
                </div>
                <Tooltip id="image-preview-tooltip" />






                </div>
                <div className='flex-1 tx-altfont-2 flex-col'>





              


              
                <AnalogMobileScreen
                      setEnableLocked={setEnableLocked}
                      enableLocked={enableLocked}
                      onFullSend={handleFullSend}
                    />





                </div>




              </div>


















              {!isMobile() && crvObjects.length > 0 && (<>
                <div className='h-100 w-250px pr-4 Q_sm_x' id="user-stats-bar">
                <BewUserStatsSummary />
                </div>
              </>)}




            </div>
          </div>
        )}

        {gameState !== 'results' && showImageModal && (<>
        <div className='pos-abs flex-col top-0 left-0 w-100 h-100 bg-glass-10  z-200'>
        <div className='flex-col px-8  flex-align-center tx-altfont-2 gap-2  bg-white box-shadow-2-b bord-r-15 pa-4'>
          <div className='flex-col w-100'>
            <div onClick={() => {
              setShowImageModal(false);
            }}
            className='opaci-chov--75 tx-bold tx-lg pb-2 '>
              <div className='opaci-25 underline'>Close Target Image</div>
            </div>
          </div>
            <img className='block pos-rel bord-r-15'
                      src={`/data/image/${selectedTargetInfo?.id.padStart(12, '0')}.jpg`} 
                      alt={selectedTargetInfo?.description}
                      style={{
                        overflow: 'hidden',
                        width: '100%',
                        maxWidth: '300px',
                        maxHeight: '300px', 
                        objectFit: 'contain'
                      }}
                    />
                    <div className="tx-center tx-altfont-2 mt-2 w-250px"
                    style={{
                      color: "#4B4B4B",
                    }}>
                      {selectedTargetInfo?.description}
                    </div>
                    </div>
                    </div>
        </>)}










        {gameState === 'results' && results && target && (myRequests?.length === 0 || !myRequests) && (<>
        <div className='flex-col z-1000 w-100 pos-abs top-0 left-0 pt-4'
        style={{
          filter: "hue-rotate(160deg) brightness(1.5)",
        }}
        >
      <a href="/" className='pointer flex-col nodeco pos-rel '>
      <div className="flex-row">
      <div className='tx-bold' style={{ color: "#6B69CF" }}>Vew</div>
      <div className='tx-bold' style={{ color: "#2B29AF" }}>.quest</div>
      </div>

      <img src="/bew/pnglogo.png" alt="tool_bg" width="50px" className='opaci-50 ' />
    </a>
          

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




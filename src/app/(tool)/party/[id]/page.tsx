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
import { BewUserStatsSummary, WrappedBewUserStatsSummary } from '../../../../dom/bew/BewUserStatsSummary';
import { isMobile } from '../../../../../script/utils/platform/mobileDetection';
import { useFetchedStats } from '@/script/state/context/FetchedStatsContext';
import { MenuBarItem } from '@/dom/bew/MenuBarItem';
import { random10CharString } from '../../../../../script/utils/platform/random10CharString';
import { InitialToolLogin } from '@/dom/bew/InitialToolLogin';
import { generateRandomTargetRandomized } from '../../../../../script/utils/platform/generateRandomTargetRandomized';
import { ToolResultsCard } from '../../../../dom/bew/ToolResultsCard';
import { BewWorldLogo } from '@/dom/bew/BewWorldLogo';
import { useBackgroundMusic } from '../../../../../script/state/context/BackgroundMusicContext';
import { MenuIconBar } from '@/dom/bew/MenuIconBar';
import { PartyScreen, WaitingRoom } from '@/dom/bew/PartyScreen';
import { PartyToolLogin } from '@/dom/bew/PartyToolLogin';
import { useParams } from 'next/navigation';
import { useProfileSnackbar } from '@/script/state/context/useProfileSnackbar';

type TargetsData = {
  [key: string]: string;
};

export type PartyGameState = 'initial' | 'playing' | 'results' | 'waiting';

export default function PartyPage() {
  const { isLoading, crvObjects, refetchStats } = useFetchedStats();
  const [initiallyAutoLoaded, setInitiallyAutoLoaded] = useState(false);
  const { triggerSnackbar } = useProfileSnackbar();
  const { playSoundEffect } = useBackgroundMusic();
  const params = useParams<{ id: string }>()
  useEffect(() => {
    if (isLoading) { return; }
    if (initiallyAutoLoaded) { return; }
    // console.log("222222222211111111111222", );
    if (!LS_playerId) {
      // setEnterUsername(true);
      return;
    }
    // console.log("2222222222222", params);
    // if not friend id
    if (!params.id) {
      return
    }
    // console.log("fffffffffffffffffffff", crvObjects.length);
    setInitiallyAutoLoaded(true);
    // if (crvObjects.length === 0) { 

    //   generateNewRound()
    //   return; 
    // }
    // console.log("crvObjects 22", crvObjects);
    // console.log("initiallyAutoLoaded", initiallyAutoLoaded);

    // handleStart();
    console.log("waiting", crvObjects.length);
    setGameState('waiting');


  }, [isLoading, params.id]);
  const [ wndwTg, s__wndwTg] = useState<any>(null);
  const [ telegram_id, s__telegram_id] = useState<string | null>(null);

const [reloadingParty, setReloadingParty] = useState(false);

  const handlePartyStart = () => {
    console.log("handlePartyStart");
  }

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
  const [gameState, setGameState] = useState<PartyGameState>('initial');
  const [successRequest, setSuccessRequest] = useState(false);
  const [fullPartyData, setFullPartyData] = useState<null | {
    id: string;
    target_code: string;
    friend_list: string[];
    live_data: any
  }>(null);
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
const sharedIdState = useState<string | null>(null);
  const friendId = params.id;
  

  async function fetchRandomFromCocoDatabase() {
    // check if user has ability to play audio and cliiked anything or interacted with the page
    

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

  function getValuesFromCocoTarget(targetCode: string) {
    try {
      const targetData = (targetsData as TargetsData)[targetCode];
      if (!targetData) return null;
      
      const [desc, valuesStr] = targetData.split('\n');
      const [type, natural, temp, light, color, solid, confidence] = valuesStr.split(',').map(Number);

      setSelectedTargetInfo({
        id: targetCode,
        description: desc
      });
      
      const typeString = ['object', 'entity', 'place', 'event'][type - 1];
      return {
        type: typeString,
        natural,
        temp,
        light,
        color,
        solid,
        confidence
      };
    } catch (error) {
      console.error('Error getting values from COCO target:', error);
      return null;
    }
  }


const handleUpdate = async (e:any)=>{
  console.log("handleUpdate", e, sharedIdState[0]);
  if (!sharedIdState[0]) return;
  playSoundEffect("/sfx/short/cling.mp3")

  try {
  console.log("handleUpdate 2222", e, sharedIdState[0]);
    const response = await fetch('/api/party/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: sharedIdState[0],
        live_data: e
      })
    });

    if (!response.ok) {
      throw new Error('Failed to update party data');
    }

    const data = await response.json();
    setFullPartyData(data);
    triggerSnackbar(<div className='flex-col gap-2'>
      <div>Your changes have been saved!</div>
      <div>🔔 Party data updated</div>
    </div>, "purple");
  } catch (error) {
    console.error('Error updating party:', error);
  }
}
const handleRefresh = async ()=>{
  if (!sharedIdState[0]) { return }
  setReloadingParty(true);
  console.log("handleRefresh", );
  // fetchpartydata again
  playSoundEffect("/sfx/short/goodcode.mp3")
  setTimeout(async ()=>{
  if (!sharedIdState[0]) { return }

  await fetchPartyData(sharedIdState[0]);
  triggerSnackbar(<div className='flex-col gap-2'>
    <div>Refreshed successfully!</div>
    <div>⬇️ Syncronization completed</div>
  </div>, "success");
  setReloadingParty(false);
  setTimeout(()=>{
    playSoundEffect("/sfx/short/fff.mp3")
  }, 200);
}, 500);
}

  const handleSend = useCallback(async (params: {
    type: string;
    natural: number;
    temp: number;
    light: number;
    color: number;
    solid: number;
    confidence: number;
  }, noteData: any, drawingData: any) => {
    console.log("target rrrrrrrrrrrrrr", target);
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

      console.log("target rrrrrrrrrrrrrr", target);

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

    // image modal
    // setShowImageModal(true);
    setShowSketchModal(true);
  }, [target, LS_playerId, refetchStats]);

  useEffect(() => {
    console.log("sharedIdState[0]", sharedIdState[0]);
    if (!sharedIdState[0]) { return }
    console.log("sharedIdState[0]22222", sharedIdState[0]);
    // if (!!target?.code) { return }
    // console.log("sharedIdState[0]33333", sharedIdState[0]);

    const initializeParty = async (byId: string) => {
      await fetchPartyData(byId);
      console.log("sharedIdState[0]44444", target);
      setGameState('playing');
    };

    initializeParty( sharedIdState[0]);
  }, [sharedIdState[0]]);

  const fetchPartyData = async (byId: string) => {
    try {
      if (!byId) {
        console.error('No party ID available');
        return;
      }
      console.log("fetchPartyData", byId);
      const response = await fetch(`/api/party/get?id=${byId}`);
      if (!response.ok) {
        console.error('Failed to fetch party data');
        return;
      }
      const data = await response.json();
      console.log("fetchPartyData data", data);

      const targetValues = getValuesFromCocoTarget(data.target_code);
      console.log("targetValues", targetValues);
      
      if (targetValues) {
        setTarget({
          code: data.target_code,
          values: {
            type: targetValues.type || 'object',
            natural: targetValues.natural || 0,
            temp: targetValues.temp || 0,
            light: targetValues.light || 0,
            color: targetValues.color || 0,
            solid: targetValues.solid || 0,
            confidence: targetValues.confidence || 0
          }
        });
      }
      
      setFullPartyData(data);
    } catch (error) {
      console.error('Error fetching party data:', error);
    }
  }


  const [selectedInputType, setSelectedInputType] = useState<any>('notes');


  const handleNewTarget = async (params: any) => {
    console.log("handleNewTarget", fullPartyData);
    if (!fullPartyData?.id) return;
    
    try {
      const response = await fetch('/api/party/setNewTarget', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          partyId: fullPartyData.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to set new target');
      }

      // Calculate results based on current state
      console.log("target && sentObject", target, sentObject, params);
      if (target && params?.options) {
        const calculatedResults = {
          type: target.values.type.toLowerCase() === params?.options.type.toLowerCase() ? true : false,
          natural: calculateAccuracy(target.values.natural, params?.options.natural, true, false),
          temp: calculateAccuracy(target.values.temp, params?.options.temp, true, false),
          light: calculateAccuracy(target.values.light, params?.options.light, false, false),
          color: calculateAccuracy(target.values.color, params?.options.color, false, false),
          solid: calculateAccuracy(target.values.solid, params?.options.solid, false, false),
          confidence: calculateAccuracy(target.values.confidence, params?.options.confidence, true, false),
        };
        const overallAccuracy = (
          calculatedResults.natural +
          calculatedResults.temp +
          calculatedResults.light +
          calculatedResults.color +
          calculatedResults.solid
        ) / 5;

        // Set sketch and notes data
        setSketchData(params.sketch);
        setNotes(params.notes);
        setSentObject(params.options);
        
        setOverallAccuracy(overallAccuracy);
        setResults(calculatedResults);
        setGameState('results');
      }
    } catch (error) {
      console.error('Error setting new target:', error);
    }
  };

  return (
    <div className='w-100 h-100  flex-col flex-justify-start'>
      <div className='w-100  flex-col  '>
        {gameState === 'initial' && (
          <PartyToolLogin
            gameState={gameState}
            setGameState={setGameState}
            typedUsername={typedUsername}
            setTypedUsername={setTypedUsername}
            isLoading={isLoading}
            handleStart={() => {
              handlePartyStart()
            }}
            sanitizePlayerId={sanitizePlayerId}
          />
        )}
        {gameState === 'waiting' && (<>
        <WaitingRoom 
        
        friendListString={[typedUsername, friendId].join(">>>")}
        sharedIdState={sharedIdState}
        friendList={
          [typedUsername, friendId]
        }

        />
        </>)}
{gameState}
        {gameState === 'playing' && (
          <div className='flex-col w-100 h-100vh'>
            <div className='flex-row w-100 flex-justify-stretch h-100'>
              <MenuIconBar 
                playSoundEffect={playSoundEffect}
              />


              <div className='flex-1 flex-col flex-align-stretch flex-justify-start h-100'>
                {<div className='Q_xs flex-row px-4'>
                   <WrappedBewUserStatsSummary minified={true} />
                   <div className='flex-1 flex-col flex-align-end '>
                      <a href="/profile" className='nodeco tx-lg bord-r-100 hover-jump bord-r-100 pointer noverflow block pa-1 pt-3'
                      
                      >
                        <img src="/bew/pfp/row-4-column-1.png" alt="profile" width="36px bord-r-100 pointer noverflow block" />
                      </a>
                   </div>
                </div>}
                {<div className='Q_sm_x py-2 '> </div>}
               
                
                <div className='pos-rel tx-white ma-4 pb-2 pa-4 mt-0 bord-r-15 tx-altfont-2 flex-col flex-align-start '
                style={{
                  background: "#FDC908",
                  boxShadow: "0 4px 0 #D68800",
                }}
                >
                <a href="/tool"           style={{color: "#964800"}}     
                className='opaci-50 nodeco pointer '>← Go to Single Player</a>
                
                <div className='tx-bold tx-lg pt-1'>Shared target #{target?.code}</div>
                <div className='w-100  flex-row flex-align-end flex-justify-end '>
                <a href={"/party/"+friendId}                style={{color: "#ffffff"}}     
                className=' px-4  Q_xs_pt-2 nodeco pointer'>
                  <span className='tx-sm pr-1 ' style={{filter: "brightness(10)"}}>🔗</span>
                  Partying with {friendId}
                  </a>
                  </div>


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





              


              
                {!reloadingParty && (<>
                  <PartyScreen friendid={friendId}
                selectedInputType={selectedInputType}
                setSelectedInputType={setSelectedInputType}
                sharedIdState={sharedIdState}
                fullPartyData={fullPartyData}
                setEnableLocked={setEnableLocked}
                enableLocked={enableLocked}
                onFullSend={handleUpdate}
                handleRefresh={handleRefresh}
                handleNewTarget={handleNewTarget}
                />
                </>)}



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
            handleTryAgain={()=>{
              setGameState('playing');
            }}
            selectedTargetInfo={selectedTargetInfo}
          />
        </>)}

























    </div>
    </div>
  );
} 




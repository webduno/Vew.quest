'use client';
import { useState, useCallback, useEffect } from 'react';
import { usePlayerStats } from '@/../script/state/hook/usePlayerStats';

import { calculateAccuracy } from '@/../script/utils/play/calculateAccuracy';
import targetsData from '@/../public/data/targets_1.json';
import { WrappedBewUserStatsSummary } from '../../dom/organ/vew_tool/BewUserStatsSummary';
import { useFetchedStats } from '@/script/state/context/FetchedStatsContext';
import { LessonsContainer } from '../../dom/bew/LessonsContainer';
import { PreLessonsContainer } from "@/dom/bew/PreLessonsContainer";
import { NavigationHeaderBar } from '@/dom/bew/NavigationHeaderBar';
import { LeaderboardTable } from '@/dom/bew/LeaderboardTable';
import { VersionTag } from '@/dom/bew/VersionTag';

type TargetsData = {
  [key: string]: string;
};

type GameState = 'initial' | 'playing' | 'results';

export default function TrainingPage() {
  const { isLoading,crvObjects,leaderboard, isLoadingLeaderboard, leaderboardError, fetchLeaderboard } = useFetchedStats();

  useEffect(() => {
    if (isLoading) { return; }
    if (crvObjects.length === 0) { return; }
    handleStart();
  }, [isLoading]);

  useEffect(() => {
    // Handle hash navigation after page load
    if (window.location.hash) {
      const element = document.getElementById(window.location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard(true );
  }, [fetchLeaderboard]);

  const { LS_playerId, typedUsername, setPlayerId, sanitizePlayerId } = usePlayerStats();
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


  function generateRandomTarget() {
    // Generate random 8-digit code in format XXXX-XXXX
    const code = `${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
    // random type 1-4 obejct, entity, place, event
    const typeNum = Math.floor(Math.random() * 4) + 1;
    const typeString = ['object', 'entity', 'place', 'event'][typeNum - 1];
    return {
      code,
      values: {
        type: typeString,
        natural: Math.floor(Math.random() * 100),
        temp: Math.floor(Math.random() * 100),
        light: Math.floor(Math.random() * 100),
        color: Math.floor(Math.random() * 100),
        solid: Math.floor(Math.random() * 100),
        confidence: Math.floor(Math.random() * 100),
      }
    };
  }

  async function fetchRandomFromCocoDatabase() {
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
      return generateRandomTarget();
    }
  }

  const handleStart = async () => {
    if (!LS_playerId && !typedUsername) {
      setEnterUsername(true);
      return;
    }

    if (!LS_playerId && typedUsername) {
      setPlayerId(sanitizePlayerId(typedUsername));
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
      type: target?.values.type.toLowerCase() === params.type.toLowerCase() ? true : false,
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
        },
        storageKey: LS_playerId
      })
    });
  }, [target]);




  return(<>
    <div className='w-100 autoverflow-y h-100vh  flex-col flex-justify-start'>

      <NavigationHeaderBar  />
      
    <div className='w-100 w-max-1080px Q_xs_sm_flex-col flex-row  pt- 8  flex-justify-center flex-align-center gap- 4'>
      <div className='flex-col px-4 gap-4 pos-rel' style={{ alignSelf: "center", }}>
          {LS_playerId && (<>
          <div className='bord-r-15  pb-2 px-4 border-gg' >
            <WrappedBewUserStatsSummary minified={true} />
          </div>
        </>
        )}
        { (<>
          
        <img src="/bew/birds.png"
        style={{ filter: "blur(0px)", }}
         alt="tool_bg2" className='Q_sm_x hover-bird pos-abs noverflow block w-150px Q_xs_pt- 8 pb-100' />



        <img src="/bew/landscape1.jpeg" 
         alt="tool_bg1" className='Q_sm_x bord-r-50 noverflow block w-250px' />
</>
)}


<div className=' w-100 flex-col '>
            

            <div className='tx-center  px-4 flex-col bord-r-25  '
                style={{
                    alignContent: "center",
                  background: "#FAeFa5",
                  boxShadow: "0px 4px 0 0px #F7CB28",
                }}
                >
                <a href="/tool" className='landing-title py-4 tx-altfont-2 tx-bold-4 w-100 block tx-center nodeco'
                >
                  Go to Remote Viewing  <br /> <span style={{
                    borderBottom: "2px solid #F7CB28",
                  }}
                  className=' tx-bold'>Training Tool</span>
                </a>
                </div>
            </div>
    
      </div>
      <div className='Q_xs_md block w-100  py-4'></div>
      <LessonsContainer />
    </div>
    <hr className='w-90 opaci-20 mt-100'  />
    <div className='mt-8 pb- w-90 w-max-600px'>
      <div className='bord-r-15  mb-8 px-4 border-gg'  >
        <div className='flex-row  tx-smd flex-justify-between pt-4 pb-2 '>
          <div className='tx-bold px-4'  style={{ color: "#4B4B4B", }} >Top Players</div>
          <a className='tx-bold px-4 pointer nodeco' href="/leaderboard"
            style={{ color: "#22AEFF", }}
          >
            View All
          </a>
        </div>

        <LeaderboardTable leaderboard={leaderboard || []} isLoading={isLoadingLeaderboard}
          error={leaderboardError} currentPlayerId={LS_playerId}
        />
      </div>
    </div>
    <hr className='w-90 opaci-20 mt-1 00'  />
    <div className='w-100 w-max-1080px flex-col  pt-8  flex-justify-center flex-align-start gap-4'>
      <div className='flex-col w-100 '>
        <div className='tx-center  w-80 flex-col bord-r-25 mt-0 mb-8 ' id="resources"
          style={{
            alignContent: "center", background: "#a09DfB", boxShadow: "0px 4px 0 0px #807DDB",
          }}
        >
          <div className='nodeco tx-bold tx-lgx  tx-white py-4 tx-altfont-2 tx-bold-4 w-100 block tx-center'>
            Resources
          </div>
        </div>
      </div>

      <PreLessonsContainer />

    </div>
  </div>
</>)
} 



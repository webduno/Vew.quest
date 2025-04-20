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
import CanvasDraw from 'react-canvas-draw';
import { Tooltip } from 'react-tooltip';
import { BewUserStatsSummary } from '../../dom/bew/BewUserStatsSummary';
import { ResultBadge } from '../../dom/bew/ResultBadge';
import { isMobile } from '../../../script/utils/platform/mobileDetection';
import { useFetchedStats } from '@/script/state/context/FetchedStatsContext';
import { LessonsContainer } from '../../dom/bew/LessonsContainer';
import { PreLessonsContainer } from "@/dom/bew/PreLessonsContainer";

type TargetsData = {
  [key: string]: string;
};

type GameState = 'initial' | 'playing' | 'results';

export default function TrainingPage() {
  const { isLoading,crvObjects,mailboxRequests, isLoadingMailbox, mailboxError, fetchMailboxRequests } = useFetchedStats();

  useEffect(() => {
    if (isLoading) { return; }
    if (crvObjects.length === 0) { return; }
    console.log("crvObjects", crvObjects);
    // handleStart();
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
  const handleMyRequests = async () => {
    const LS_playerId = localStorage.getItem('VB_PLAYER_ID');
    if (!LS_playerId) {
      alert('No player ID found');
      return;
    }

    try {
      setIsLoadingMyRequests(true);
      const response = await fetch(`/api/supabase/crvmailbox?playerId=${LS_playerId}`, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache'
        },
        cache: 'no-store'
      });
      const data = await response.json();
      
      if (!data.success || !data.data || data.data.length === 0) {
        alert('You dont have any requests!');
        return;
      }

      setMyRequests(data.data);
    } catch (error) {
      console.error('Error fetching my requests:', error);
      alert('Error fetching requests');
    } finally {
      setIsLoadingMyRequests(false);
    }
  }
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


  const random10CharString = () => {
    return Math.random().toString(36).substring(2, 15);
  };

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
    console.log("target" , target);
    console.log("send" , params);
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

    console.log('calculatedResults', calculatedResults)
    console.log('overallAccuracy', overallAccuracy)

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
    const saveData = await saveResponse.json();
    console.log('saveData', saveData)
  }, [target]);

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
    console.log("full send" , params);
    setSketchData(params.sketch);
    setNotes(params.notes);
    handleSend(params.options, params.notes, params.sketch);
    
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
  }

  return(<>
    <div className='w-100 autoverflow-y h-100vh  flex-col flex-justify-start'>


    <div className='flex-row w-100 w-max-1080px tx-altfont-2'>
        <a href="/" className='pointer flex-row nodeco pos-rel pt-4'>
        <img src="/bew/pnglogo.png" alt="tool_bg" className='ml-4 w-50px' />
        <div className='tx-bold'
        style={{
          // color: "#6B69CF",
          color: "#2B29AF",
          // color: "#060961",
        }}
        >Bew</div>
        <div className='tx-bold'
        style={{
          color: "#6B69CF",
          // color: "#2B29AF",
          // color: "#060961",
        }}
        >.quest</div>
        </a>



        <div className=' px-4 flex-1 flex-row flex-justify-end tx-bold pt-4'
        
        >
          <div className='nodeco'
          data-tooltip-id="support-tooltip"
          data-tooltip-place="left"
          style={{
            color: "#AFAFAF",
            // filter: "saturate(0)",
          }}
           >
            <div>Support</div>
          </div>
          <Tooltip id="support-tooltip" clickable >
            <a href="https://x.com/webduno" target='_blank' rel='noopener noreferrer'

            className='nodeco tx-white tx-altfont-2 nodeco tx-bold-2'
            >
              <div>𝕏 | @webduno</div>
            </a>
          </Tooltip>
        </div>
      </div>

    <div className='Q_xs py-8'></div>
        
    <div>
            <div className='tx-lg tx-altfont-2 tx-bold opaci-25 tx-ls-1'>DASHBOARD</div>
          </div>
    <div className='w-100 w-max-1080px flex-wrap  pt-8  flex-justify-center flex-align-start gap-4'>

        



        
        
    <div className='flex-col px-8 pos-rel'
        
        >
          <div className='bord-r-15 mb-4 pb-2 px-4' style={{
            border: "1px solid #f0f0f0",
          }}>
            <BewUserStatsSummary minified />
          </div>
        
        <img src="/bew/birds.png"
        onClick={() => {
        //   setGameState('playing');
        }}
        style={{
          filter: "blur(0px)",
        }}
         alt="tool_bg2" className=' hover-bird pos-abs noverflow block w-150px Q_xs_pt- 8 pb-100' />



        <img src="/bew/landscape1.jpeg"
        onClick={() => {
        //   setGameState('playing');
        }}
        style={{
          
        }}
         alt="tool_bg1" className=' bord-r-50 noverflow block w-250px' />

<div className=' py-4 w-100 flex-col '>
            

            <div className='tx-center  w-100 flex-col bord-r-25  '
                style={{
                    alignContent: "center",
                  background: "#FAeFa5",
                  boxShadow: "0px 4px 0 0px #F7CB28",
                }}
                >
                <a href="/tool" className='landing-title py-4 tx-altfont-2 tx-bold-4 w-100 block tx-center nodeco'
                style={{
                }}
                >
                  Go to Remote Viewing  <br /> <span style={{
                    borderBottom: "2px solid #F7CB28",
                  }}
                  className=' tx-bold'>Training Tool</span>
                </a>
                </div>
            </div>
    
        </div>

        <LessonsContainer />
        <hr className='w-100 opaci-20'  />
        
        <div className='tx-center  w-100 flex-col bord-r-25 mt-0 mb-8 ' id="resources"
                style={{
                    alignContent: "center",
                  background: "#a09DfB",
                  boxShadow: "0px 4px 0 0px #807DDB",
                }}
                >
                <div className='nodeco tx-bold tx-lgx  tx-white py-4 tx-altfont-2 tx-bold-4 w-100 block tx-center'
                style={{
                }}
                >
                  Resources
                  {/* <br /> <span style={{
                    borderBottom: "2px solid #6B69CF",
                  }}
                  className=' tx-bold'>Training Tool</span> */}
                </div>
                </div>
                <PreLessonsContainer />

    </div>



    </div>
</>)


} 



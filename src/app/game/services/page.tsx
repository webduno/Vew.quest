'use client';
import { useState, useCallback } from 'react';

import { AnalogModalScreen } from '@/dom/molecule/game/SenseMeter/AnalogModalScreen';
import { calculateAccuracy } from '@/../script/utils/play/calculateAccuracy';
import { BewLogo } from '@/dom/atom/logo/BewLogo';
import { KeyboardBtn } from '@/dom/atom/button/KeyboardBtn';
import { PaperSheet } from '@/dom/atom/toast/PaperSheet';
import targetsData from '@/../public/data/targets_1.json';
import { random10CharString } from '../../../../script/utils/platform/random10CharString';

type TargetsData = {
  [key: string]: string;
};

type GameState = 'initial' | 'playing' | 'results';

export default function TrainingPage() {
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
    const newTarget = await fetchRandomFromCocoDatabase();
    setTarget(newTarget);
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
      type: target.values.type.toLowerCase() === params.type.toLowerCase() ? true : false,
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

  const handleTryAgain = async () => {
    const newTarget = await fetchRandomFromCocoDatabase();
    setTarget(newTarget);
    setGameState('playing');
    setResults(null);
    setSentObject(null);
  }

  return (
    <div className="h-100vh w-100vw flex-col flex-center bg-dark">
      <div className='pos-abs left-0 top-0'>
      <BewLogo />
      </div>
      { myRequests && myRequests.length > 0 && (<>


      <div className="tx-white tx-center">
        <div className="tx-lg mt-4  tx-altfont-5 tx-shadow- 5 mb-4"
        style={{
          color: "#777777",
        }}
        >
          
        YOUR CRV <br /> Requests
        </div>
        <div className='tx-sm opaci-50 flex-col gap-1 flex-align-start' >
          <div className='flex-row gap-1 w-100'>
            <div className='w-150px pa-2 tx-start'>Description</div>
            <div className='pa-2 tx-right flex-1'></div>
            <div className='pa-2 tx-right'>Attm/Slvd</div>
          </div>
          {myRequests.map((request, index) => (
            <div key={index} className='flex-row gap-1 opaci-chov--75'
            onClick={()=>{
              alert(`Description: ${request.description}\n\nBounty: ${request.bounty}\n\nCreated at: ${request.created_at}`);
            }}
            style={{
              color: "#cccccc",
              backgroundColor: "#171717",
              borderRadius: "3px",
              boxShadow: "1px 1px 1px #111111, -1px -1px 1px #777777",
            }}
            >
              <div className='w-150px pa-2 tx-start'>{request.description}</div>
              <div className='pa-2 tx-right'
              
              >{request.bounty ? `$$$` : 'No bounty'}</div>
              <div className='pa-2 tx-right'>{request.attempts || '0'}</div>
              <div className='pa-2 tx-right'>{request.solved || '0'}</div>
            </div>
          ))}
        </div>
        <button 
            className="noborder bg-trans tx-white pointer mt-4 tx-altfont-1" 
            onClick={()=>{
              setMyRequests(null);
              setGameState('initial');
              setResults(null);
              setSentObject(null);
            }}
          >
            <KeyboardBtn>Go Back</KeyboardBtn>
          </button>
      </div>
      
      
      
      </>
      )}
      {gameState === 'initial' && ( myRequests?.length === 0 || !myRequests) && (<>
        {/* <button 
          className="tx-lg bg-trans noborder box-shadow-5-b pa-0 pointer tx-altfont-1" 
          style={{
            color: "#999999",
          }}
          onClick={handleStart}
        >
          <KeyboardBtn>Remote Viewing Training</KeyboardBtn>
        </button> */}
        <button 
          className="mt-2 tx-lg bg-trans noborder box-shadow-5-b pa-0 pointer tx-altfont-1" 
          style={{
            color: "#999999",
          }}
          onClick={()=>{
            setSuccessRequest(false);
            handleRequestCRV();
          }}
        >
          <KeyboardBtn>Request CRV</KeyboardBtn>
        </button>
        <button 
          className="mt-2 tx-mdl bg-trans noborder box-shadow-5-b pa-0 pointer tx-altfont-1" 
          style={{
            color: "#999999",
          }}
          onClick={()=>{
            if (isLoadingMyRequests) return;
            handleMyRequests();
          }}
        >
          <KeyboardBtn>{isLoadingMyRequests ? 'Loading...' : 'Dashboard'}</KeyboardBtn>
        </button>
        {successRequest && (myRequests?.length === 0  || !myRequests) && (
          <div className="tx-white tx-center">
            <div className="tx-lg mt-4  tx-altfont-5 tx-shadow-5"
            style={{
              color: "#77cc77",
            }}
            >
              Request
              <br />
              submitted
              <br />
              successfully!
            </div>
          </div>
        )}
        </>)}

        {showImageModal  && (myRequests?.length === 0 || !myRequests)  && (
            <div className="vintage-panel pos-abs  w-max-300px" style={{ zIndex: 10000 }}>
              <div className="flex-col flex-center bg-dark-50 pa-4 bord-r-5" style={{ maxWidth: '80vw', maxHeight: '80vh' }}>
                <div className="pos-abs top-0 right-0"
                style={{
                  transform: "translate(50%, -50%)"
                }}
                >
                  <KeyboardBtn  styleOverride={{
                    padding: "0 10px 10px 10px",
                    color: "#999999",
                  }}
                    classOverride="px-0  tx-lg pointer noborder bg-trans"
                    onClick={() => setShowImageModal(false)}
                  >
                    ×
                  </KeyboardBtn>
                </div>
                <img 
                  src={`/data/image/${selectedTargetInfo?.id.padStart(12, '0')}.jpg`} 
                  alt={selectedTargetInfo?.description}
                  style={{
                    borderRadius: "3px",
                    maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain'
                  }}
                />
                <div className="tx-white tx-center tx-shadow-5 tx-altfont-1 mt-2">
                  {selectedTargetInfo?.description}
                </div>
              </div>
            </div>
          )}

      {gameState === 'playing' && target && (myRequests?.length === 0 || !myRequests) && (
        <div className="flex-col flex-center">
          <div className="tx-white tx-center mb-8">
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
          
          <button 
            className="mt-4 tx-sm bg-trans noborder pa-0 pointer tx-altfont-1 underline" 
            style={{
              color: "#999999",
            }}
            onClick={() => setShowImageModal(true)}
          >
            <div>Show Target Image</div>
          </button>
          
          <button 
            className="mt-2 tx-sm bg-trans noborder opaci-chov--50 pa-0 pointer tx-altfont-1 " 
            style={{
              color: "#999999",
            }}
            onClick={() => setGameState('initial')}
          >
            <div>Cancel</div>
          </button>
        </div>
      )}

      {gameState === 'results' && results && target && (myRequests?.length === 0 || !myRequests) && (
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
                 HIT %
              </div>
            </div>
            {/* <hr className='w-100 opaci-50' /> */}
            {/* type match */}
            <div className="flex-row">
              <div className="tx-black opaci-50 flex-1 tx-start">
                Type: ({sentObject?.type.toLowerCase()}/{target.values.type.toLowerCase()})
              </div>
              <div className="tx-white">
                 {results.type ? "🗸" : "🗴"}
              </div>
            </div>
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
          {/* <hr className='w-100 opaci-50' /> */}
          <div className="flex-row pb-4  ">
<div className="flex-col">
<div className="flex-1 tx-center tx-altfont-5 opaci-50">
Averaged Score:
</div>
<div className="flex-1 tx-center tx-altfont-8 tx-shadow-5 tx-xxl">
{Number(overallAccuracy).toFixed(3)}%
</div>
</div>

          </div>
            </div>
          </PaperSheet>
          <div className="flex-row gap-2">
          <button 
              className="mt-2 tx-sm bg-trans noborder pa-0 pointer tx-altfont-1 underline" 
              style={{
                color: "#999999",
              }}
              onClick={() => setShowImageModal(true)}
            >
              <div>Show Target Image</div>
            </button>
          <button 
            className="noborder bg-trans tx-white pointer mt-4 tx-altfont-1" 
            onClick={handleTryAgain}
          >
            <KeyboardBtn>Try Again</KeyboardBtn>
          </button>
          
          </div>
        </div>
      )}
    </div>
  );
} 
'use client';
import { useState, useCallback } from 'react';

import { AnalogModalScreen } from '@/dom/molecule/game/SenseMeter/AnalogModalScreen';
import { calculateAccuracy } from '@/../script/utils/play/calculateAccuracy';
import { BewLogo } from '@/dom/atom/logo/BewLogo';
import { KeyboardBtn } from '@/dom/atom/button/KeyboardBtn';
import { PaperSheet } from '@/dom/atom/toast/PaperSheet';
import targetsData from '@/../public/data/targets_1.json';
import { AnalogMobileScreen } from '@/dom/bew/AnalogMobileScreen';
import CanvasDraw from 'react-canvas-draw';

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
    console.log("target" , target);
    console.log("send" , params);
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

  const handleFullSend = (params: {
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
    handleSend(params.options);
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

  return (
    <div className='w-100 h-100  flex-col flex-justify-start'>




    <div className='w-100  flex-col  '>
{gameState === 'initial' && (<>
      <div className='flex-row w-100 w-max-1080px tx-altfont-2'>
        <img src="/bew/bewlogo.png" alt="tool_bg" className='ml-4 w-100px' />
        <div className='tx-bold'
        style={{
          // color: "#6B69CF",
          color: "#2B29AF",
          // color: "#060961",
        }}
        >W</div>
        <div className='tx-bold'
        style={{
          color: "#6B69CF",
          // color: "#2B29AF",
          // color: "#060961",
        }}
        >Bew</div>
        <div className=' px-4 flex-1 flex-row flex-justify-end tx-bold'
        
        >
          <a className='nodeco'
          style={{
            color: "#AFAFAF",
          }}
           href="https://x.com/webduno" target='_blank' rel='noopener noreferrer'><div>@webduno</div></a>
        </div>
      </div>
      <div className='flex-wrap gap-2 '
      style={{
        height: "70vh",
      }}
      >
        <div>
        <img src="/bew/bewgraphic2.png" alt="tool_bg" className='w-300px' />

        </div>
        <div className=' tx-altfont-2 tx-bold gap-4  flex-col w-300px'
        style={{color: "#4B4B4B",
        }}
        >
          <div className='tx-center tx-lx'>Gamified <br /> step-by-step lessons for remote viewing</div>
          <div>
            <div className='py-2 px-8 tx-white bord-r-10 tx-lgx opaci-chov--75'
            onClick={handleStart}
            style={{
              backgroundColor: "#6B69CF",
              boxShadow: "0px 2px 0 0px #2B29AF",
            }}
            >Start</div>
          </div>
        </div>
      </div>
</>)}



      {gameState === 'playing' && (<>












      
<div className='flex-col w-100 h-100vh'>
<div className='flex-row w-100 flex-justify-stretch h-100'>






  <div className=' h-100 Q_sm_x'
style={{borderRight: "1px solid #E5E5E5"}}
  >
    <div className='pointer'><img src="/bew/bewlogo.png" alt="tool_bg" className='px-2 py-4 w-50px' /></div>
    <div className='tx-lgx pa-2 opaci-chov--50'>
      {/* home emoji */}
      <div className='tx-center'>🏠</div>
      </div>
    <div className='tx-lgx pa-2 opaci-chov--50'>
      {/* lessons emoji */}
        <div className='tx-center'>📚</div>
      </div>
    <div className='tx-lgx pa-2 opaci-chov--50'>
      {/* goals emoji */}
      <div className='tx-center'>🎯</div>
      </div>
  </div>













  <div className='flex-1 flex-col flex-align-stretch flex-justify-start h-100'>
    <div className='flex-row '>
    <button 
              className="mt- 2 pt-4 pb- tx-sm bg-trans noborder pa-0 pointer tx-altfont-2 underline" 
              style={{
                color: "#999999",
              }}
              onClick={() => {
                setGameState('initial');
              }}
            >
              <div>Go back to Main Menu</div>
            </button>
    </div>
    
    <div className='tx-white ma-4 pa-4 bord-r-15 tx-altfont-2 flex-col flex-align-start gap-2'
    style={{
      background: "#807DDB"
    }}
    >
<div className='opaci-50 pointer'>Target Code</div>
<div className='tx-bold tx-lg'>#{target?.code}</div>
    </div>
<div className='flex-1 tx-altfont-2'>





  


  
<AnalogMobileScreen
        setEnableLocked={setEnableLocked}
        enableLocked={enableLocked}
        onFullSend={handleFullSend}
      />





</div>




  </div>



















  <div className='h-100 w-250px pr-4 Q_sm_x'>
    <div className='flex-row flex-justify-between tx-altfont-2'>
    <div className='tx- lg pa-2  opaci-chov--50 flex-wrap'>
      {/* fire emoji */}
      <div className='tx-lg tx-center'>🔥</div>
      <div style={{color: "#FFB02E"}}>169</div>
      </div>
    <div className='tx- lg pa-2  opaci-chov--50 flex-wrap'>
      {/* diamond emoji */}
        <div className='tx-lg tx-center'>💎</div>
      <div style={{color:"#00A6ED"}}>1224</div>
      </div>
    <div className='tx- lg pa-2  opaci-chov--50 flex-wrap'>
      {/* heart emoji */}
      <div className='tx-lg tx-center'>💖</div>
      <div style={{color:"#F92F60"}}>5</div>
      </div>
    </div>
    <div className='flex-col flex-align-stretch gap-4'>

<div className='bord-r-10 pa-4 pl-2' 
style={{
  border: "1px solid #E5E5E5",
}}
>
  <div className='flex-row flex-justify-start gap-2'>
    <div>
      {/* lightning emoji  */}
      <div className='tx-lgx'>✨</div>
    </div>
  <div className='tx-bold'
  style={{
    color: "#4B4B4B",
  }}
  >Daily Goal</div>
  </div>

  <div></div>
</div>




<div className='bord-r-10 pa-4 pl-2' 
style={{
  border: "1px solid #E5E5E5",
}}
>
  <div className='flex-row flex-justify-start gap-2'>
    <div>
      {/* sparks emoji  */}
      <div className='tx-lgx'>💥</div>
    </div>
  <div className='tx-bold'
  style={{
    color: "#4B4B4B",
  }}
  >Target of the day</div>
  </div>

  <div></div>
</div>





<div className='bord-r-10 pa-4 pl-2' 
style={{
  border: "1px solid #E5E5E5",
}}
>
  <div className='flex-row flex-justify-start gap-2'>
    <div>
      {/* sparks emoji  */}
      <div className='tx-lgx'>🪄</div>
    </div>
  <div className='tx-bold'
  style={{
    color: "#4B4B4B",
  }}
  >Lessons</div>
  </div>

  <div></div>
</div>




    
    </div>
  </div>
</div>
</div>









      </>)}

















{gameState === 'results' && (<>
















{gameState === 'results' && results && target && (myRequests?.length === 0 || !myRequests) && (
        <div className="tx-white tx-center mt-100">
          <div className="tx-lg tx-altfont-2 tx-bold-5"
          style={{
            color: "#F1CE0D",
          }}
          >Results for  #{target.code}!
          </div>
          <div className='tx-white bord-r-100 mt-1 py-1'
          style={{
            background: "#F1CE0D",
          }}
          >{Number(overallAccuracy).toFixed(3)}%</div>

          <div className='w-300px py-3 my-3 px-4 bord-r-15' style={{
            border: "1px solid #E5E5E5",
            background: "#f7f7f7",
          }}>




            












{!showImageModal && !showSketchModal && (<>
            <div className="flex-col gap-2">  

          <div className="flex-wrap gap-2 w-100  flex-align-stretch">
          



            <div className="flex-col bord-r-15 "
            style={{
              padding: "3px",
              background: "#7DDB80",
            }}
            >
              <div className="flex-col flex-1 tx-start tx-white py-1 px-3">
                <div>Type: {sentObject?.type.toUpperCase()}</div>
              </div>
              <div className="tx-white py-1 bg-white w-100 bord-r-15 flex-row gap-2"
              style={{
                color: "#7DDB80"
              }}
              >
                <div>{target.values.type.toUpperCase()}</div>
                <div className='tx-'>{results.type ? "(HIT)" : "(MISS)"}</div>
              </div>
            </div>



            

            <ResultBadge 
            label="Natural"
            keyName="natural"
            sentObject={sentObject} target={target} results={results} />

<ResultBadge 
            label="Temperature"
            keyName="temp"
            sentObject={sentObject} target={target} results={results} />

<ResultBadge 
            label="Light"
            keyName="light"
            sentObject={sentObject} target={target} results={results} />

<ResultBadge 
            label="Color"
            keyName="color"
            sentObject={sentObject} target={target} results={results} />


<ResultBadge 
            label="Solid"
            keyName="solid"
            sentObject={sentObject} target={target} results={results} />


          </div>      
            </div>
            </>)}

















            

          {showImageModal &&  (
            <>
              <img className='block pos-rel'
                src={`/data/image/${selectedTargetInfo?.id.padStart(12, '0')}.jpg`} 
                alt={selectedTargetInfo?.description}
                style={{
                  overflow: 'hidden',
                  borderRadius: "3px",
                  width: '100%',
                  maxWidth: '300px',
                  maxHeight: '300px', 
                  objectFit: 'contain'
                }}
              />
              <div className="tx-center tx-altfont-2 mt-2"
              style={{
                color: "#4B4B4B",
              }}>
                {selectedTargetInfo?.description}
              </div>
            </>
          )}

          {showSketchModal && !showImageModal && sketchData && (
            <>
              <CanvasDraw
                disabled
                hideGrid
                canvasWidth={300}
                canvasHeight={300}
                saveData={sketchData}
                style={{
                  borderRadius: "3px",
                }}
              />
              <div className="tx-center tx-altfont-2 mt-2"
              style={{
                color: "#4B4B4B",
              }}
              >
                Your Drawing
              </div>
            </>
          )}

          </div>



          <div className="flex-col flex-justify-center gap-2">
            <div className="flex-row gap-2">


            <button 
              className="mt- 2 tx-sm bg-trans noborder pa-0 pointer tx-altfont-2 underline px-1" 
              style={{
                color: "#999999",
              }}
              onClick={() => {
                // set showImageModal to false
                setShowImageModal(false);
                setShowSketchModal(false);
              }}
            >
              <div>{showImageModal || showSketchModal ? "Show Results" : "Hide Results"}</div>
            </button>



            
            <button 
              className="mt- 2 tx-sm bg-trans noborder pa-0 pointer tx-altfont-2 underline px-1" 
              style={{
                color: "#999999",
              }}
              onClick={() => {
                setShowImageModal(prev => !prev);
                if (!showImageModal) {
                  setShowSketchModal(false);
                }
              }}
            >
              <div>{showImageModal ? "Hide Image" : "Show Image"}</div>
            </button>
            <button 
              className="mt- 2 tx-sm bg-trans noborder pa-0 pointer tx-altfont-2 underline px-1" 
              style={{
                color: "#999999",
              }}
              onClick={() => {
                setShowSketchModal(prev => !prev);
                if (!showSketchModal) {
                  setShowImageModal(false);
                }
              }}
            >
              <div>{showSketchModal ? "Hide Drawing" : "Show Drawing"}</div>
            </button>
            <div  onClick={() => {
              alert("Notes:\n\n" + notes);
            }}
            className='tx-sm pa-1 bord-r-15 opaci-chov--50'
            style={{
              color: "#999999",
            }}
            >
              Notes
            </div>
            </div>
            <button 
              style={{
                background: "#7DDB80",
                boxShadow: "0px 2px 0 0px #34BE37",
              }}
              className="tx-lg py-1 px-4 bord-r-10 noborder bg-trans tx-white pointer tx-altfont-2" 
              onClick={handleTryAgain}
            >
              <div>Next Target</div>
            </button>
            <button 
              className="mt- 2 tx-sm bg-trans noborder pa-0 pointer tx-altfont-2 underline px-1" 
              style={{
                color: "#999999",
              }}
              onClick={() => {
                setGameState('initial');
              }}
            >
              <div>Main Menu</div>
            </button>
          </div>
        </div>
      )}















</>)}

























    </div>
    </div>
  );
} 

const ResultBadge = ({
  sentObject, target, results, label, keyName
}: {
  sentObject: any, 
  target: any, 
  results: any, 
  label: string, 
  keyName: string
}) => {
  return (
    <div className="flex-col bord-r-15 "
            style={{
              padding: "3px",
              // background: "#FFC801",
              background: "#afafaf",
            }}
            >
              <div className="flex-col flex-1 tx-start tx-white py-1 px-3">
                <div>{label}: {sentObject?.[keyName]}</div>
              </div>
              <div className="tx-white flex-col py-2 bg-white w-100 bord-r-15 flex-row gap-2"
              style={{
                // color: "#F1CE0D"
                color: "#4b4b4b"
              }}
              >
                <div>Sent: {target.values[keyName]}</div>
                <div>{Number(results[keyName]).toFixed(3)}%</div>
              </div>
            </div>
  );
} 
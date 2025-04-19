'use client';
import { useState, useCallback } from 'react';
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
import { BewUserStatsSummary } from '../../../dom/bew/BewUserStatsSummary';

type TargetsData = {
  [key: string]: string;
};

type GameState = 'initial' | 'playing' | 'results';

export default function TrainingPage() {
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
  }) => {
    if (!target) return;
    console.log("target" , target);
    console.log("send" , params);
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
          sent: params,
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
        <a href="/tool" className='pointer flex-row nodeco'>
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
        </a>



        <div className=' px-4 flex-1 flex-row flex-justify-end tx-bold'
        
        >
          <a className='nodeco'
          style={{
            color: "#AFAFAF",
          }}
           href="https://x.com/webduno" target='_blank' rel='noopener noreferrer'><div>@webduno</div></a>
        </div>
      </div>
      <div className='flex-wrap gap-8 '
      style={{
        height: "70vh",
      }}
      >
        <div>
        <img src="/bew/viewlogo.jpeg"
        style={{
          
        }}
         alt="tool_bg" className='bord-r-50 noverflow block w-300px' />

        </div>
        <div className=' tx-altfont-2 tx-bold gap-4  flex-col w-300px'
        style={{color: "#4B4B4B",
        }}
        >
          <div className='tx-center tx-lgx'>Gamified <br /> step-by-step lessons for remote viewing</div>
          <div>
            <div>
              <input 
                type="text" 
                className='bord-r-10 tx-altfont-2 py-2 mb-2 px-3'
                placeholder='Enter your name'
                style={{
                  border: "1px solid #E5E5E5",
                }}
                value={typedUsername}
                onChange={(e) => { setTypedUsername(sanitizePlayerId(e.target.value)) }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleStart();
                  }
                }}
              />
            </div>
            <div 
              className='py-2 px-8 tx-center tx-white bord-r-10 tx-lgx opaci-chov--75'
              onClick={handleStart}
              style={{
                backgroundColor: "#807DDB",
                boxShadow: "0px 4px 0 0px #6B69CF",
              }}
            >
              Start
            </div>
          </div>
        </div>
      </div>
</>)}



      {gameState === 'playing' && (<>












      
<div className='flex-col w-100 h-100vh'>
<div className='flex-row w-100 flex-justify-stretch h-100'>






  <div id="menu-icon-bar" className=' h-100 Q_sm_x'
style={{borderRight: "1px solid #E5E5E5"}}
  >
    <a href="/tool" className='pointer'>
      <img src="/bew/bewlogo.png" alt="tool_bg" className='px-2 py-4 w-50px' />
      </a>
    <div className='tx-lgx pa-2 opaci-chov--50'
    data-tooltip-id="home-tooltip"
    data-tooltip-content="Home"
    data-tooltip-place="right"
    onClick={() => {
      setGameState('initial');
    }}
    >
      {/* home emoji */}
      <div className='tx-center'>🏠</div>
      </div>


    <div className='tx-lgx pa-2 opaci-chov--50'
    data-tooltip-id="lessons-tooltip"
    data-tooltip-content="Resources"
    data-tooltip-place="right"
    onClick={() => {
      alert("Coming soon!");
    }}
    >
      {/* lessons emoji */}
        <div className='tx-center'>📚</div>
      </div>


    <div className='tx-lgx pa-2 opaci-chov--50'
    data-tooltip-id="goals-tooltip"
    data-tooltip-content="Achievements"
    data-tooltip-place="right"
    onClick={() => {
      alert("Coming soon!");
    }}
    >
      {/* goals emoji */}
      <div className='tx-center'>🎯</div>
      </div>

    <div className='tx-lgx pa-2 opaci-chov--50'
    data-tooltip-id="profile-tooltip"
    data-tooltip-content="Profile"
    data-tooltip-place="right"
    onClick={() => {
      alert("Coming soon!");
    }}
    >
      {/* profile emoji */}
      <div className='tx-center'>👤</div>
      </div>

    <div className='tx-lgx pa-2 opaci-chov--50'
    data-tooltip-id="settings-tooltip"
    data-tooltip-content="Settings"
    data-tooltip-place="right"
    onClick={() => {
      alert("Coming soon!");
    }}
    >
      {/* settings emoji */}
      <div className='tx-center'>⚙️</div>
      </div>

    <div className='tx-lgx pa-2 opaci-chov--50'
    data-tooltip-id="help-tooltip"
    data-tooltip-content="Help"
    data-tooltip-place="right"
    onClick={() => {
      alert("Coming soon!");
    }}
    >
      {/* help emoji */}
      <div className='tx-center'>❓</div>
      </div>
  </div>













  <div className='flex-1 flex-col flex-align-stretch flex-justify-start h-100'>
    {/* <div className='flex-row '>
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
    </div> */}
    
    <div className='pos-rel tx-white ma-4 pa-4 bord-r-15 tx-altfont-2 flex-col flex-align-start gap-2'
    style={{
      background: "#807DDB",
      boxShadow: "0 4px 0 #6B69CF",
    }}
    >
<div               onClick={() => {
                setGameState('initial');
                setShowImageModal(false);
                setShowSketchModal(false);
              }}
className='opaci-50 pointer'>← Main Menu</div>
<div className='tx-bold tx-lg'>Target Code #{target?.code}</div>
<div
onClick={() => {
  setShowImageModal( prev => !prev);
}}
 className='mr-4 opaci-chov--75 flex-row gap-2 bg-b-10 flex-col h-50px w-50px bord-r-100 pos-abs right-0'>
  {/* eye emoji */}
  <div className='tx-lg'>👀</div>
</div>
    </div>
<div className='flex-1 tx-altfont-2 flex-col'>





  


  
<AnalogMobileScreen
        setEnableLocked={setEnableLocked}
        enableLocked={enableLocked}
        onFullSend={handleFullSend}
      />





</div>




  </div>



















  <div className='h-100 w-250px pr-4 Q_sm_x' id="user-stats-bar">



<BewUserStatsSummary />







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
  <div className='flex-col flex-align-start gap-2 flex-1'>
  <div className='tx-bold'
  style={{
    color: "#4B4B4B",
  }}
  >Daily Goal</div>
  <div className='tx-sm tx-bold bord-r-25  w-100 ' style={{
    padding: "3px 0",
    boxShadow: "0 2px 0 #D68800",
    background: "#FDC908",
    color: "#D68800",

  }}>
    <div className='flex-row gap-1'>
      <div>0/5</div>
      <div>Targets</div>
    </div>
  </div>

  </div>
  </div>


  <div>









  <div>
            <div className='py-2 mt-4 tx-center tx-white bord-r-10  opaci-chov--75'
            data-tooltip-id="view-profile-tooltip"
            data-tooltip-content={`${LS_playerId }`}
            data-tooltip-place="bottom"
            onClick={()=>{
              alert("Coming soon!");
            }}
            style={{
              backgroundColor: "#807DDB",
              boxShadow: "0px 4px 0 0px #6B69CF",
            }}
            >View Profile</div>
            
          </div>
          <Tooltip id="view-profile-tooltip" />
          <Tooltip id="home-tooltip" />
          <Tooltip id="lessons-tooltip" />
          <Tooltip id="goals-tooltip" />
          <Tooltip id="profile-tooltip" />
          <Tooltip id="settings-tooltip" />
          <Tooltip id="help-tooltip" />
          <Tooltip id="streak-tooltip" />
          <Tooltip id="points-tooltip" />
          <Tooltip id="hearts-tooltip" />

  </div>
</div>




<a target='_blank'
href="https://www.reddit.com/r/remoteviewing/comments/1k1y0ge/weekly_practice_objective_r16487/"
className='bord-r-10 pa-4 pl-2 opaci-chov--75 nodeco' 
style={{
  border: "1px solid #E5E5E5",
}}
>
  <div className='flex-row flex-justify-start gap-2'>
    <div>
      {/* sparks emoji  */}
      <div className='tx-lgx'>💥</div>
    </div>
  <div className='flex-col flex-align-start gap-2'>
  <div className='tx-bold'
  style={{
    color: "#4B4B4B",
  }}
  >Weekly Object</div>
  <div className='tx-sm ' style={{color: "#afafaf"}}>
    <div className='flex-row gap-1'>
      <div>Click to see details</div>
    </div>
  </div>
  </div>
  </div>

  <div></div>
</a>





<div className='bord-r-10 ' 
style={{
  border: "1px solid #E5E5E5",
}}
>
  <div className='flex-row  tx-smd flex-justify-between pt-4 pb-2 gap-2'>
    
  <div className='tx-bold px-4' 
  style={{
    color: "#4B4B4B",
  }}
  >Lessons</div>
  <a 
  className='tx-bold px-4 pointer nodeco' 
  href="https://www.reddit.com/r/remoteviewing/wiki/index/"
  target='_blank'
  style={{
    color: "#22AEFF",
  }}
  >View All</a>
  </div>

  





  
  <a 
  href="https://www.reddit.com/r/remoteviewing/comments/184cl9k/start_here_introduction_faq_resources_welcome_to/"
  target='_blank'
   className='flex-row flex-align-start nodeco flex-justify-start pa-2 opaci-chov--75 gap-2'>
    <div className=''>
      {/* single book emoji  */}
      <div className='tx-lgx'>
      📖
      </div>
    </div>
    <div className='flex-col flex-align-start gap-2'>
  <div className='tx-bold pt-2'
  style={{
    color: "#4B4B4B",
  }}
  >Fundamentals</div>
  <div className='tx-sm flex-col flex-align-start gap-1' style={{color: "#afafaf"}}>
    <div className='flex-row gap-1 tx-xsm'>
      <div>- Sensory perception training</div>
    </div>
    <div className='flex-row gap-1 tx-xsm'>
      <div>- Target recognition</div>
    </div>
  </div>
  </div>
  </a>



  
  <a
  href="https://www.reddit.com/r/AstralProjection/comments/n34zh5/astral_projection_quick_start_guide/"
  target='_blank'
   className='flex-row flex-align-start nodeco flex-justify-start pa-2 opaci-chov--75 gap-2'>
    <div className=''>
      {/* tree emoji  */}
      <div className='tx-lgx'>🌳</div>
    </div>
    <div className='flex-col flex-align-start gap-2'>
  <div className='tx-bold pt-2'
  style={{
    color: "#4B4B4B",
  }}
  >Astral Projection</div>
  <div className='tx-sm flex-col flex-align-start gap-1' style={{color: "#afafaf"}}>
    <div className='flex-row gap-1 tx-xsm'>
      <div>- Meditation &amp; visualization</div>
    </div>
    
    <div className='flex-row gap-1 tx-xsm'>
      <div>- Coordinate remote viewing</div>
    </div>
  </div>
  </div>
</a>





  
  <a 
  href="https://chain.link/vrf"
  target='_blank'
  className='flex-row flex-align-start nodeco pb-4 flex-justify-start pa-2 opaci-chov--75 gap-2'>
    <div className=''>
      {/* eight ball emoji  */}
      <div className='tx-lgx'>🎱</div>
    </div>
    <div className='flex-col flex-align-start gap-2'>
  <div className='tx-bold pt-2'
  style={{
    color: "#4B4B4B",
  }}
  >RNG Basics</div>
  <div className='tx-sm flex-col flex-align-start gap-1' style={{color: "#afafaf"}}>
    <div className='flex-row gap-1 tx-xsm'>
      <div>- Random number generator</div>
    </div>
  </div>
  </div>
  </a>



  <div></div>
</div>




    
    </div>
  </div>
</div>
</div>









      </>)}




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










{gameState === 'results' && (<>
















{gameState === 'results' && results && target && (myRequests?.length === 0 || !myRequests) && (
        <div className="tx-white tx-center mt-100">
          <div className="tx-lg tx-altfont-2 tx-bold-5"
          style={{
            color: "#FDC908",
          }}
          >Results for  #{target.code}!
          </div>
          <div className='tx-white bord-r-100 mt-1 py-1 pos-rel'
          style={{
            background: "#E5E5E5",
            boxShadow: "0 2px 0 #D68800",
            overflow: "hidden"
          }}
          >
            <div className='pos-abs top-0 left-0 h-100'
            style={{
              width: `${overallAccuracy}%`,
              background: "#FDC908",
              transition: "width 0.5s ease-out"
            }}
            ></div>
            <div
            style={{
              color: "#D68800",
            }}
             className='tx-bold pos-rel '>{Number(overallAccuracy).toFixed(3)}%</div>
          </div>

          <div className='w-300px py-3 my-3 px-4 bord-r-15' style={{
            border: "1px solid #E5E5E5",
            background: "#f7f7f7",
          }}>




            












{!showImageModal && !showSketchModal && (<>
            <div className="flex-col gap-2">  

          <div className="flex-wrap gap-2 w-100  flex-align-stretch">
          



            <div className="flex-col bord-r-15 "
            style={{
              padding: "3px 3px 6px 3px",
              background: "#7DDB80",
            }}
            >
              <div className="flex-col flex-1 tx-start tx-white py-1 flex-justify-between px-3">
                <div className='flex-col flex-justify-start  tx-center'>
                  <div className='pb-1'>Sent Type:</div>
                  <div className='flex-row flex-align-center  gap-1 tx-bold'>
                    <div>{sentObject?.type.toUpperCase()}</div>
                    <div className='tx-xs'>{results.type ? "(HIT)" : "(MISS)"}</div>
                  </div>
                </div>
              </div>
              <div className="tx-white py-1 bg-white w-100 bord-r-15 flex-row gap-1"
              style={{
                color: "#7DDB80"
              }}
              >
                <div>Target:</div>
                <div>{target.values.type.toUpperCase()}</div>
                
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
            <div className='bord-r-15 flex-col'
            style={{
              minHeight: "300px",
            }}
            >
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
              </div>
            </>
          )}

          {showSketchModal && !showImageModal && sketchData && (
            <>
              <div className='bord-r-15 flex-col'
              style={{
                minHeight: "300px",
              }}
              >
              <CanvasDraw
                disabled
                hideGrid
                canvasWidth={300}
                canvasHeight={300}
                saveData={sketchData}
                style={{
                  borderRadius: "15px",
                }}
              />
              </div>
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
            <div className="flex-row gap-2 ">
{/* {!!showImageModal || !!showSketchModal && (
            <button 
              className="mt- 2 tx-sm bg-trans noborder pa-0 pointer tx-altfont-2 underline px-1" 
              style={{
                color: "#999999",
              }}
              onClick={() => {
                setShowImageModal(false);
                setShowSketchModal(false);
              }}
            >
              <div>{showImageModal || showSketchModal ? "Show Results" : "Hide Results"}</div>
            </button>
)} */}


            
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
              alert("Notes:\n\n" + (notes || "No notes found!"));
            }}
            className='tx-sm pa-1 bord-r-15 opaci-chov--50'
            style={{
              color: "#999999",
            }}
            >
              Notes
            </div>
            </div>
            <div className='flex-row gap-2'>
            <button 
              style={{
                background: "#807DDB",
                boxShadow: "0px 4px 0 0px #6B69CF",
              }}
              className="tx-lg py-1 px-4 bord-r-10 noborder bg-trans tx-white pointer tx-altfont-2" 
              onClick={() => {
                setGameState('initial');
                setShowImageModal(false);
                setShowSketchModal(false);
              }}
            >
              <div>Main Menu</div>
            </button>
            <button 
              style={{
                background: "#7DDB80",
                boxShadow: "0px 4px 0 0px #34BE37",
              }}
              className="tx-lg py-1 px-4 bord-r-10 noborder bg-trans tx-white pointer tx-altfont-2" 
              onClick={handleTryAgain}
            >
              <div>Next Target</div>
            </button>
            </div>
            {/* <button 
              className="mt- 2 tx-sm bg-trans noborder pa-0 pointer tx-altfont-2 underline px-1" 
              style={{
                color: "#999999",
              }}
              onClick={() => {
                setGameState('initial');
              }}
            >
              <div>Main Menu</div>
            </button> */}
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
                <div>Target: {target.values[keyName]}</div>
                <div>{Number(results[keyName]).toFixed(3)}%</div>
              </div>
            </div>
  );
} 





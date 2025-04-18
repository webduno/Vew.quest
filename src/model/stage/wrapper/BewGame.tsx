'use client';
import { useSearchParams } from 'next/navigation';
import { Box, MeshPortalMaterial, Plane, PositionalAudio, Sphere, Fisheye } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import { Canvas } from '@react-three/fiber';
import { useState, useEffect, useCallback, useRef, useContext } from 'react';

import { isMobile } from '@/../script/utils/platform/mobileDetection';
import { calculateAccuracy } from "@/../script/utils/play/calculateAccuracy";
import { usePlayerStats } from '@/../script/state/hook/usePlayerStats';
import { useGameCore } from '@/../script/state/hook/useGameCore';
import { BewMainScene } from '@/model/stage/scenes/BewMainScene';
import { MobileControlOverlay } from '@/dom/molecule/game/MobileControlOverlay';
import { PersonSilhouette } from '../../bit/PersonSilhouette';
import { TheRoom } from '../rooms/WhiteMirror/TheRoom';
import { AnalogModalScreen } from '@/dom/molecule/game/SenseMeter/AnalogModalScreen';
import { SolidBox } from '../../core/SolidBox';
import { BgMusicToggle } from '@/dom/molecule/notification/BgMusicToggle';
import { PerformanceStats } from '@/dom/molecule/notification/PerformanceStats';
import { RotatingBar } from '../../byte/RotatingBar';
import { AnalysisScreen } from '../item/AnalysisScreen';
import { MindStats } from '@/dom/molecule/notification/MindStats';
import { TheWhiteMirror } from '../rooms/WhiteMirror/TheWhiteMirror';
import { PhysicalFloor } from '../../core/PhysicalFloor';
import { PhysicalCeiling } from '../../core/PhysicalFloor';
import { BewCoreLights } from './BewCoreLights';
import { CDDoorPortals } from '../doorwalls/CDDoorPortals';
import { PlayerPhysicsScene } from '../../core/PlayerPhysicsScene';

export const BewGame = () => {
  const {
    LS_playerId,
    LS_lowGraphics,
    LS_firstTime,
    disableFirstTime,
    updateExploredStatus,
    hasExploredZone,
    updateMindStats,
    mindStats
  } =  usePlayerStats()
  // const { updateExploredStatus, hasExploredZone } = usePlayerStats();

  const [showAnalogModal, setShowAnalogModal] = useState(false);
  const [whiteRoomTarget, setWhiteRoomTarget] = useState("");
  const [crvTargetObject, setCrvTargetObject] = useState({})
  const [lastCashReward, setLastCashReward] = useState(0)
  const [accuracyResult, setAccuracyResult] = useState({})
  const [submitted, setSubmitted] = useState({})
  const [showWhiteMirror, setShowWhiteMirror] = useState(false);
  const {
    isCutSceneOpen,
    showSnackbar,
    closeSnackbar,
    setIsCutSceneOpen,
    playSoundEffect,
    changeBackgroundMusic
  } = useGameCore();
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isEverythingLoading, setIsEverythingLoading] = useState(true);
  const [focusLevel, setFocusLevel] = useState(0);
  const focusStageRef = useRef<any>(0);
  const [enableLocked, setEnableLocked] = useState(true)
  const [initialPosition, setInitialPosition] = useState<[number, number, number]>(
    // [-3, 0, -19]
    [-1.5, 0, 1]
  )
  const [currentPosition, setCurrentPosition] = useState<[number, number, number]>([0, 0, 1]);
  const [playerRotation, setPlayerRotation] = useState({ x: 0, y: 0, z: 0 })
  const [isLocked, setIsLocked] = useState(false)
  const [teleportTrigger, setTeleportTrigger] = useState(0);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [wasFirstDoorOpened, setWasFirstDoorOpened] = useState(false);
  const [wasPsionicHallwayEntered, setWasPsionicHallwayEntered] = useState(false);
  // const wasFirstDoorOpened = useRef(false);
  const handleFirstDoorOpened = useCallback(() => {
    console.log("handleFirstDoorOpened")
    setWasFirstDoorOpened(true);
  }, []);
  // const [showStats, setShowStats] = useState(true);
  const searchParams = useSearchParams();
  const showStats = searchParams.get('stats') === 'true';
  const [performanceStats, setPerformanceStats] = useState({
    drawCalls: 0,
    objectCount: 0,
    fps: 0,
    frameTime: 0
  });
  
  const [loadingAnalysisResult, setLoadingAnalysisResult] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<string>("")

  const [code1, setCode1] = useState("")
  const [code2, setCode2] = useState("")
  const [code3, setCode3] = useState("")


  const [viewType, setViewType] = useState<'object' | 'entity' | 'place' | 'entity'>('object')
  const [naturality, setNaturality] = useState<number>(0)
  const [temperature, setTemperature] = useState<number>(0)
  const [isTakingRequest, setIsTakingRequest] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false);
  

  const sendCRVReport = async (crvData: {
    type: string;
    natural: number;
    temp: number;
    light: number;
    color: number;
    solid: number;
    confidence: number;
  }) => {
    setSubmitted(crvData)
    setShowAnalogModal(false);
    setShowWhiteMirror(false);
    setFocusLevel(0);
    focusStageRef.current = 0;
    setIsLocked(false);
    setLoadingAnalysisResult(true)
    playSoundEffect("/sfx/stickyshift.mp3", 0.05)

    // Compare submitted data with target
    const target = crvTargetObject as typeof crvData;

    const naturalityAccuracy = calculateAccuracy(target.natural, crvData.natural, true, false)
    const temperatureAccuracy = calculateAccuracy(target.temp, crvData.temp, true, false)
    const lightAccuracy = calculateAccuracy(target.light, crvData.light, false, false)
    const colorAccuracy = calculateAccuracy(target.color, crvData.color, false, false)
    const solidAccuracy = calculateAccuracy(target.solid, crvData.solid, false, false)
    const overallAccuracy = ((
      naturalityAccuracy +
      temperatureAccuracy +
      lightAccuracy +
      colorAccuracy +
      solidAccuracy
    ) / 5).toFixed(3)
    const accuracyres = {
      typeMatch: target.type.toLowerCase() === crvData.type.toLowerCase(),
      naturalityAccuracy: naturalityAccuracy,
      temperatureAccuracy: temperatureAccuracy,
      lightAccuracy: lightAccuracy,
      colorAccuracy: colorAccuracy,
      solidAccuracy: solidAccuracy,
      overallAccuracy: overallAccuracy
    }
    setAccuracyResult(accuracyres)

    // do round amount
    const rewardAmount = Math.round((accuracyres.naturalityAccuracy +
      accuracyres.temperatureAccuracy +
      accuracyres.lightAccuracy +
      accuracyres.colorAccuracy +
      accuracyres.solidAccuracy) )
      console.table(accuracyres)
      console.log('rewardAmount', rewardAmount)
    setLastCashReward(rewardAmount * 3)
    const currentCash = mindStats.cash || 0;
    updateMindStats('cash', currentCash + rewardAmount * 3)

    try {

      let wholeResponse = ''
try {
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(crvData),
  });

  const data = await response.json();
  wholeResponse = data.choices?.[0]?.message?.content || 'No response received'
  // max 6 words
} catch (error) {
  console.error('Error getting ai guess:', error);
}

const firstPart = wholeResponse.split(' ').slice(0, 6).join(' ') || 'No response received'
const secondPart = wholeResponse.split(' ').slice(6,12).join(' ') || ''
const thirdPart = wholeResponse.split(' ').slice(12,18).join(' ') || ''
const restPart = wholeResponse.split(' ').slice(18).join(' ') || ''
      
      console.log('saving to supabase')
      const saveResponse = await fetch('/api/supabase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          objList: {
            sent: crvData,
            target: crvTargetObject,
            ai_sent_guess: wholeResponse,
          },
          storageKey: LS_playerId
        })
      });
      const saveData = await saveResponse.json();
      console.log('saveData', saveData)


      setTimeout(() => {
        setLoadingAnalysisResult(false)
        setAnalysisResult(`
  SENT                                  VISUAL FEEDBACK
  ______                               ______________________________    
  
  ${parseInt(crvData.natural.toString())}|${parseInt(crvData.temp.toString())}               ${firstPart}
  ${parseInt(crvData.light.toString())}, ${parseInt(crvData.color.toString())}, ${parseInt(crvData.solid.toString())}                ${secondPart}
                            ${thirdPart}${restPart ? '...' : ''}
  `)
      }, 3000)
    } catch (error) {
      console.error('Error processing CRV report:', error);
      setLoadingAnalysisResult(false)
      setAnalysisResult(`
  TARGET                               RESPONSE
  ______                               ______________________________    
  
  ??° ?' ■■"               Error analyzing data
  ■■■■° NW                ??sun shining, solid ship head north
  `)
    }
  }
  
  
  

  useEffect(() => {
    setIsMobileDevice(isMobile());
    // Set loading to false when game is ready
    setIsEverythingLoading(false);
  }, []);

  // Handle trigger collision
  const handleChairSit = useCallback((event: any) => {
    
    if (loadingAnalysisResult) {
      return;
    }
    if (mindStats.solid <= 0) {
      failedChairSit()
      return;
    }
    if (isTransitioning) {
      return;
    }
    
    setAnalysisResult("")
    setAccuracyResult({})
    setSubmitted({})
    setLastCashReward(0)
    playSoundEffect("/sfx/short/chairsit.mp3")
    // Deduct 1 solid calibration point
    updateMindStats('solid', mindStats.solid - 1);

    console.log("handleChairSit")
    // Set initial position to chair position
    setInitialPosition([2.5, 0, -21.5])
    // Set current position to chair position
    handleSetPlayerPosition([2.5, 0, -21.5])
    playSoundEffect("/sfx/tutorials/breath.ogg")
    showSnackbar("Take a deep breath, and exhale slowly.", 'handbook');
    focusStageRef.current = focusStageRef.current + 1;
    setFocusLevel((prev) => prev + 1);
    setTimeout(() => {
      setIsTransitioning(true);
      setTimeout(() => {
      setTimeout(() => {
        
        //random 8digit code
        const theTarget = Math.random().toString(9).substring(2, 10);
        setWhiteRoomTarget(theTarget);

        // Generate random CRV target object
        const crvTarget = {
          type: ['object', 'entity', 'place'][Math.floor(Math.random() * 3)],
          natural: Math.floor(Math.random() * 100),
          temp: Math.floor(Math.random() * 100),
          light: Math.floor(Math.random() * 100),
          color: Math.floor(Math.random() * 100),
          solid: Math.floor(Math.random() * 100),
        };
        setCrvTargetObject(crvTarget);
        
        setShowWhiteMirror(true);
        setIsTransitioning(false);

    setTimeout(() => {
    playSoundEffect('/sfx/tutorials/cball.ogg');

    showSnackbar("Now, click crystal ball to start.", 'handbook', 3000);
  }, 2000);

        }, 1000);
      }, 3000);
    }, 1000);

    if (LS_firstTime) {
      playSoundEffect("/sfx/tutorial/firsttimesense.ogg");
      setTimeout(() => {
        playSoundEffect("/sfx/tutorial/sensetuto.ogg");
        showSnackbar("-Navigate config -Fill input values -Send for Analysis", 'info');
        setTimeout(() => {
          closeSnackbar();
        }, 10000);
      }, 3500);
    }
  }, [LS_firstTime, playSoundEffect, showSnackbar, closeSnackbar, mindStats, updateMindStats]);

  // Callback to get player rotation from physics scene
  const handlePlayerRotationUpdate = useCallback((rotation: { x: number, y: number, z: number }) => {
    setPlayerRotation(rotation);
  }, []);

  // Handle teleporting the player to a new position
  const handleSetPlayerPosition = useCallback((position: [number, number, number]) => {
    setCurrentPosition(position);
    // Trigger a teleport by incrementing the counter
    setTeleportTrigger(prev => prev + 1);
  }, []);

  // Handle code input submission
  const CODE_1 = "scanate"
  const CODE_2 = "sunstreak"
  const CODE_3 = "gondolawish"
  const handleCode1Submit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = (e.target as HTMLInputElement).value;
    if (inputValue.toLowerCase() === CODE_1.toLowerCase()) {
      setCode1(inputValue)
      if (!!code2) {
        playSoundEffect("/sfx/short/goodcode.mp3")
      }
    }
  };

  const handleCode2Submit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = (e.target as HTMLInputElement).value;
    if (inputValue.toLowerCase() === CODE_2.toLowerCase()) {
      setCode2(inputValue)
      if (!!code1) {
        playSoundEffect("/sfx/short/goodcode.mp3")
      }
    }
  };

  const handleRoomEnter = () => {
    // disable the movement for 10 seconds
    // while the intro cutscene plays
    // then enable the movement again
    // setEnableLocked(false);
    if (!hasExploredZone("white_mirror_room")) {
      updateExploredStatus('white_mirror_room', true);
      setIsCutSceneOpen(true);
      showSnackbar(`You've entered the white mirror room... Sit down.`, 'title');
      playSoundEffect("/sfx/tutorial/sitdown.ogg")

        
      setTimeout(() => {
        closeSnackbar();
        setIsCutSceneOpen(false);
        // setEnableLocked(true);
      }, 4000);
    }

  }

  const failedChairSit = () => {
    playSoundEffect("/sfx/short/badbip.wav")
    showSnackbar("Solid points=0 Calibration is required", 'error', 4000);
  }

  const handleResetAnalysis = useCallback(() => {
    // Check if user has enough solid calibration points using the live mindStats from usePlayerStats
    if (mindStats.solid <= 0) {
      failedChairSit()
      return;
    }
    if (isTransitioning) {
      return;
    }
    if (loadingAnalysisResult) {
      return;
    }
    setAnalysisResult("")
    setAccuracyResult({})
    setSubmitted({})
    setLastCashReward(0)
    
    handleChairSit({});
  }, [handleChairSit]);



const sendCRVRequestAttempt = async ( crvData: {
  type: string;
  natural: number;
  temp: number;
  light: number;
  color: number;
  solid: number;
}, requestId?: string) => {

console.log('sendCRVRequestAttempt', crvData,
  {
    objList: {
      sent: crvData,
    },
    storageKey: LS_playerId,
    requestId: requestId
  }
)

// send to supabase
const response = await fetch('/api/supabase', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    objList: {
      sent: crvData,
    },
    storageKey: LS_playerId,
    requestId: requestId
  })
})

// Reset the request state
setIsTakingRequest(null);
}
// **************************************************************************************************************
// **************************************************************************************************************
// **************************************************************************************************************











  return (
    <div className='pos-abs top-0 left-0 w-100 h-100 flex-col'>

{(
    <div id="transition-screen"
    className={`pos-abs top-0 left-0 w-100 h-100 ${isTransitioning ? 'opaci-100' : 'opaci-0'}`}
    style={{
      pointerEvents: !isTransitioning ? 'none' : 'auto',
      background: '#777777',
      transition: 'opacity 4s ease-in-out',
      zIndex: 10000
    }}>

    </div>
)}



      <div className='pos-abs top-0 left-0 mt-8 z-100 w-100px  ml-2 pt-4'>
      <MindStats />
      </div>


      <BgMusicToggle 
       isEverythingLoading={isEverythingLoading}
      firstTime={LS_firstTime}
       disableFirstTime={disableFirstTime} />


      {/* Performance Stats in top right corner */}
      {showStats && (
        <div className="pos-abs top-0 right-0 pa-2 z-100">
          <div style={{
            background: 'rgba(0,0,0,0.5)',
            padding: '8px',
            borderRadius: '4px',
            color: 'white',
            fontFamily: 'monospace',
            fontSize: '12px'
          }}>
            <div>FPS: {performanceStats.fps}</div>
            <div>Frame Time: {performanceStats.frameTime}ms</div>
            <div>Draw Calls: {performanceStats.drawCalls}</div>
            <div>Objects: {performanceStats.objectCount}</div>
          </div>
        </div>
      )}

      <div className='pos-abs bottom-0 right-0 mb-150 flex-col mr-4 z-100 gap-1 pa-1 pb-2'
      style={{
        zIndex: 1200,
      }}
      >
      {!code1 && (<div className="flex-col" id="code1" style={{display:"none"}}>
        <label className='block pl-2 tx-altfont-8 tx-lg tx-white opaci-50'>Code#1:</label>
          <input className='w-100px tx-md tx-center py-1 bord-r-5 pos-rel' 
          style={{
            zIndex: 2000,
            background:"#494644", 
          }}
           type="text" placeholder='C O D E   1' 
           onChange={handleCode1Submit}
          />
          </div>
          )}
          

{!code2 && (<div className="flex-col" id="code2" style={{display:"none"}}>
        <label className='block pl-2 tx-altfont-8 tx-lg tx-white opaci-50'>Code#2:</label>
          <input className='w-100px tx-md tx-center py-1 bord-r-5 pos-rel' 
          style={{
            zIndex: 2000,
            background:"#494644", 
          }}
           type="text" placeholder='C O D E   2' 
           onChange={handleCode2Submit}
          />
          </div>
          )}
      </div>

      {isTakingRequest && !showAnalogModal && focusLevel === 0 && (<>
        
        <AnalogModalScreen 
          setEnableLocked={() => {}}
          enableLocked={false}
          playerRotation={{x:0, y:0, z:0}}
          onSend={
            (crvData, requestId)=>{
              console.log('onSend', crvData, requestId)
              return sendCRVRequestAttempt(crvData, isTakingRequest)
            }}
        />
      </>)}


      {focusLevel !== 0 && showAnalogModal && (
        <AnalogModalScreen 
          setEnableLocked={setEnableLocked}
          enableLocked={enableLocked}
          playerRotation={playerRotation}
          onSend={sendCRVReport}
        />
      )}





      <Canvas camera={{ fov: 125 }} 
      shadows={LS_lowGraphics ? false : true}
      >
        {/* Performance stats component inside Canvas */}
        {showStats && <PerformanceStats onStatsUpdate={setPerformanceStats} />}

        <BewCoreLights showWhiteMirror={showWhiteMirror} />
        
        {/* <Fisheye >
        <ambientLight intensity={.1} /> */}
        <Physics
          gravity={[0, -30, 0]}
          defaultContactMaterial={{ friction: 0.001, restitution: 0.2 }}
        >

          
          {/* CHAIR SUPERVISOR, only visible when focusStageRef.current === 0 */}
          {!showWhiteMirror && ( <>
          
          <group position={[2, 0, -20]} rotation={[0, -.5, 0]} scale={[1, 1.1, 1]}>
            <PersonSilhouette
            
            onClick={() => {
              playSoundEffect(`/sfx/short/sit.ogg`);
            }}
            />
          </group>
<SolidBox 
        visible={false}
        size={[1, 3, 0.5]}
        position={[2, 1.5, -20]} rotation={[0, 0, 0]}
              />
</>
          )}
    

          {/* HALLWAY */}
          <group position={[1.5, 0, -12]} rotation={[0, -.7, 0]} scale={[1, 1, 1]}>
            <PersonSilhouette 
            onClick={() => {
              const randomVoice = Math.random() > 0.5 ? 'what' : 'whatuwant';
              playSoundEffect(`/sfx/short/${randomVoice}.ogg`);
            }}
            />
          </group>
          
          {/* BEHIND THE DOOR */}
          <group position={[1, 0, -16]} rotation={[0, Math.PI, 0]} scale={[1, 1.25, 1]}>
          <PersonSilhouette />
          </group>

















{showWhiteMirror && (
          <TheWhiteMirror whiteRoomTarget={whiteRoomTarget}
          showAnalogModal={showAnalogModal}
           setShowAnalogModal={setShowAnalogModal} />
          )}
          {!!code1 && !!code2 && (<>
          <TheRoom analysisResult={analysisResult}
          isTransitioning={isTransitioning}
          showWhiteMirror={showWhiteMirror}
          setShowWhiteMirror={setShowWhiteMirror}
           onChairSit={handleChairSit} onRoomEnter={handleRoomEnter} />
          </>)}


          {/* double mirror */}
          <Plane args={[4,2]} position={[0,2,-26.49]} rotation={[0,0,0]} receiveShadow>
          <meshStandardMaterial color="#cccccc" 
          roughness={LS_lowGraphics ? undefined : 0.05} 
         >
          </meshStandardMaterial>
        </Plane>
        {!LS_lowGraphics && (
<mesh position={[0,2,-26.49]}  >
  <planeGeometry  args={[4,2]} />
  <MeshPortalMaterial>
    <group position={[0,0,-4.5]}>  
    <pointLight position={[0,0,0]} intensity={.5} />
    <Box args={[9,3,9 ]} position={[0,0,0]}>
      <meshStandardMaterial color="#ffffff" emissive={"#222222"} 
      side={1}
      />
    </Box>
    </group>
  </MeshPortalMaterial>
</mesh>
)}




        {!!loadingAnalysisResult && (
          <group position={[0,2,-26.5]} rotation={[0,-0,0]}>
            <RotatingBar />
          </group>
        )}
        {
        !!analysisResult &&
         (<>
          <group position={[0,3,-26.48]} rotation={[0,-0,0]}>
            <AnalysisScreen analysisResult={analysisResult} 
            submitted={submitted}
            targetResults={crvTargetObject}
            accuracyResult={accuracyResult}
            rewardAmount={lastCashReward}
            onReset={handleResetAnalysis}
            />
          </group>
        </>)}















          {/* First Barrier */}
          {/* <Box args={[6,1,1]} position={[0,0,0]}>
            <meshStandardMaterial color="#000000" />
          </Box> */}








      {/* CEILING */}
      <PhysicalFloor lowGraphics={LS_lowGraphics} 
      
      />
      {/* <Box args={[20, 1, 60]} position={[0, 4, -14]}>
        <meshStandardMaterial color="#ffffff" />
      </Box>
      */}
      <PhysicalCeiling lowGraphics={LS_lowGraphics} /> 




      <CDDoorPortals code1={code1} code2={code2} code3={code3} setPlayerPosition={handleSetPlayerPosition} />

{!showWhiteMirror && !isTransitioning && (
          <BewMainScene 
          wasPsionicHallwayEntered={wasPsionicHallwayEntered}
          setWasPsionicHallwayEntered={()=>{
            if (!wasPsionicHallwayEntered) {
              // change background looping music song
              changeBackgroundMusic('/sfx/bg/ominous.mp3');
            }
            setWasPsionicHallwayEntered(true)
          }}
          isTakingRequest={isTakingRequest}
          setIsTakingRequest={setIsTakingRequest}
          code1={code1}
          code2={code2}
          code3={code3}
          wasFirstDoorOpened={wasFirstDoorOpened}
          onFirstDoorOpened={handleFirstDoorOpened}
          setPlayerPosition={handleSetPlayerPosition} />
)}




          
          <PlayerPhysicsScene
            isCutSceneOpen={isCutSceneOpen}
            playerHeight={1.8}
            playerRadius={0.4}
            moveSpeed={focusStageRef.current === 0 ? 8 : 0}
            jumpForce={focusStageRef.current === 0 ? 8 : 0}
            maxVelocity={focusStageRef.current === 0 ? 20 : 0}
            position={initialPosition}
            currentPosition={currentPosition}
            teleportTrigger={teleportTrigger}
            sceneObjects={[]}
            onExit={() => {
              console.warn('locking player movement onExit')
            }}
            isMobile={isMobileDevice}
            ballCount={0}
            // enableLocked={enableLocked}
            // setEnableLocked={setEnableLocked}
            isLocked={isLocked}
            setIsLocked={setIsLocked}
            onRotationUpdate={handlePlayerRotationUpdate} />
        </Physics>
        {/* </Fisheye> */}
      </Canvas>
      {isMobileDevice && <MobileControlOverlay />}
      <div id="crosshair" 
      className='pos-fix top-50p left-50p opaci-20 noclick block bord-r-100 tx-white tx-shadow-5'
      style={{
transform: "translate(-50%, -50%)",
      }}
      >+</div>
    </div>
  );
};










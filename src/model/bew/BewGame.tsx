'use client';
import { isMobile } from '@/../scripts/utils/mobileDetection';
import { Physics } from '@react-three/cannon';
import { Canvas } from '@react-three/fiber';
import { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { BewMainScene } from '@/model/bew/scenes/BewMainScene';
import { BewMobileOverlay } from '@/dom/organ/BewMobileOverlay';
import { PersonSilhouette } from '../bits/PersonSilhouette';
import { BewLighting } from './BewLighting';
import { TheRoom } from '../rooms/WhiteMirror/TheRoom';
import { AnalogModalScreen } from '../../dom/molecule/SenseMeter/AnalogModalScreen';
import { BewPhysicsScene } from '../core/BewPhysicsScene';
import { PhysicalWall } from '../core/PhysicalWall';
import { Box, Plane } from '@react-three/drei';
import { useVibeverse } from '@/../scripts/hooks/useVibeverse';
import { useSearchParams } from 'next/navigation';
import { useBew } from '../../../scripts/contexts/BewProvider';
import { BackgroundMusic } from '@/dom/molecule/BackgroundMusic';
import { PerformanceStats } from '../../dom/molecule/PerformanceStats';
import { RotatingBar } from '../bits/RotatingBar';
import { AnalysisScreen } from '../bits/AnalysisScreen';
import { MindStats } from '../../dom/molecule/MindStats';
import { TheWhiteMirror } from '../rooms/WhiteMirror/TheWhiteMirror';
import { PhysicalFloor } from '../core/PhysicalFloor';
import { PhysicalCeiling } from '../core/PhysicalFloor';
import { CDDoorPortals } from '../doorwalls/CDDoorPortals';

export const BewGame = () => {
  const { LS_playerId, LS_lowGraphics, LS_firstTime, disableFirstTime, updateExploredStatus, hasExploredZone, formatPortalUrl, updateMindStats, mindStats } =  useVibeverse()
  // const { updateExploredStatus, hasExploredZone } = useVibeverse();

  const [showAnalogModal, setShowAnalogModal] = useState(false);
  const [whiteRoomTarget, setWhiteRoomTarget] = useState("");
  const [crvTargetObject, setCrvTargetObject] = useState({})
  const [lastCashReward, setLastCashReward] = useState(0)
  const [accuracyResult, setAccuracyResult] = useState({})
  const [submitted, setSubmitted] = useState({})
  const [showWhiteMirror, setShowWhiteMirror] = useState(false);
  const { isCutSceneOpen, showSnackbar, closeSnackbar, setIsCutSceneOpen, playSoundEffect } = useBew();
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
  const wasFirstDoorOpened = useRef(false);
  const handleFirstDoorOpened = useCallback(() => {
    wasFirstDoorOpened.current = true;
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
  
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const calculateAccuracy = (target: number, guess: number, isGauge: boolean = false): number => {
    if (isGauge) {
      // For gauge values with larger input numbers
      const difference = Math.abs(target - guess);
      // Handle wrap-around cases for inputs > 100
      const wrappedDifference = Math.min(difference, Math.abs(360 - difference));
      // Convert to percentage where 100% means perfect match
      const accuracy = Math.round((1 - (wrappedDifference / 180)) * 100);
      // Ensure result is between 0 and 100
      return Math.max(0, Math.min(100, accuracy));
    } else {
      // For regular values (0-100)
      const difference = Math.abs(target - guess);
      // Convert to percentage where 100% means perfect match
      return Math.round((1 - (difference / 100)) * 100);
    }
  };

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

    console.table(crvData)
    setShowAnalogModal(false);
    setShowWhiteMirror(false);
    setFocusLevel(0);
    focusStageRef.current = 0;
    setIsLocked(false);
    setLoadingAnalysisResult(true)
    playSoundEffect("/sfx/stickyshift.mp3", 0.05)


    // Compare submitted data with target
    const target = crvTargetObject as typeof crvData;

    const accuracyres = {
      typeMatch: target.type.toLowerCase() === crvData.type.toLowerCase(),
      naturalityAccuracy: calculateAccuracy(target.natural, crvData.natural, true),
      temperatureAccuracy: calculateAccuracy(target.temp, crvData.temp, true),
      lightAccuracy: calculateAccuracy(target.light, crvData.light),
      colorAccuracy: calculateAccuracy(target.color, crvData.color),
      solidAccuracy: calculateAccuracy(target.solid, crvData.solid),
    }
    setAccuracyResult(accuracyres)

    const rewardAmaount = (accuracyres.naturalityAccuracy +
    accuracyres.temperatureAccuracy +
    accuracyres.lightAccuracy +
    accuracyres.colorAccuracy +
    accuracyres.solidAccuracy)
    setLastCashReward(rewardAmaount*3)
    const currentCash = mindStats.cash || 0;
    updateMindStats('cash', currentCash + rewardAmaount*3)
   
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(crvData),
      });

      const data = await response.json();
      const wholeResponse = data.choices?.[0]?.message?.content || 'No response received'
      // max 6 words
      const firstPart = wholeResponse.split(' ').slice(0, 6).join(' ') || 'No response received'
      const secondPart = wholeResponse.split(' ').slice(6,12).join(' ') || ''
      const thirdPart = wholeResponse.split(' ').slice(12,18).join(' ') || ''
      const restPart = wholeResponse.split(' ').slice(18).join(' ') || ''
      setTimeout(() => {
        setLoadingAnalysisResult(false)
        setAnalysisResult(`
  SENT                                  VISUAL FEEDBACK
  ______                               ______________________________    
  
  ${parseInt(crvData.natural.toString())}|${parseInt(crvData.temp.toString())}               ${firstPart}
  ${parseInt(crvData.light.toString())}|${parseInt(crvData.color.toString())}|${parseInt(crvData.solid.toString())}                ${secondPart}
                            ${thirdPart}
                                ${restPart ? '...' : ''}
            
            
  
  
  
  `)

        
      }, 3000)
    } catch (error) {
      console.error('Error sending CRV report:', error);
      setLoadingAnalysisResult(false)
      setAnalysisResult(`
  TARGET                               RESPONSE
  ______                               ______________________________    
  
  ??° ?' ■■"               Error analyzing data
  ■■■■° NW                sun shining, solid ship head north
            
            
  
  
  
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
    console.log("handleChairSit")
    handleSetPlayerPosition([2.5, 0, -21.5])
    showSnackbar("Take a big nose inhale, and exhale slowly.", 'handbook');
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
    showSnackbar("Click crystal ball to start.", 'handbook');
    setTimeout(() => {
    closeSnackbar();
    }, 3000);
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
  }, [LS_firstTime, playSoundEffect, showSnackbar, closeSnackbar]);

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

  const handleResetAnalysis = useCallback(() => {
    setAnalysisResult("")
    setAccuracyResult({})
    setSubmitted({})
    setLastCashReward(0)
    handleChairSit({});
  }, [handleChairSit]);





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


      <BackgroundMusic  isEverythingLoading={isEverythingLoading}
      firstTime={LS_firstTime} disableFirstTime={disableFirstTime} />


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
        <label className='block pl-2 tx-altfont-8 tx-lg tx-white opaci-50'>Code 1:</label>
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
        <label className='block pl-2 tx-altfont-8 tx-lg tx-white opaci-50'>Code 2:</label>
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

      


      {focusLevel !== 0 && showAnalogModal && (
        <AnalogModalScreen 
          setEnableLocked={setEnableLocked}
          enableLocked={enableLocked}
          playerRotation={playerRotation}
          onSend={sendCRVReport}
        />
      )}





      <Canvas camera={{ fov: 125 }} shadows={LS_lowGraphics ? false : true}>
        {/* Performance stats component inside Canvas */}
        {showStats && <PerformanceStats onStatsUpdate={setPerformanceStats} />}

        <BewLighting showWhiteMirror={showWhiteMirror} />


        

        <Physics
          gravity={[0, -30, 0]}
          defaultContactMaterial={{ friction: 0.001, restitution: 0.2 }}
        >


          
          {/* CHAIR SUPERVISOR, only visible when focusStageRef.current === 0 */}
          {!showWhiteMirror && ( <>
          
          <group position={[2, 0, -20]} rotation={[0, -.5, 0]} scale={[1, 1.1, 1]}>
            <PersonSilhouette />
          </group>
<PhysicalWall 
        visible={false}
        size={[1, 3, 0.5]}
        position={[2, 1.5, -20]} rotation={[0, 0, 0]}
              />
</>
          )}
    

          {/* HALLWAY */}
          <group position={[1.5, 0, -12]} rotation={[0, -.7, 0]} scale={[1, 1, 1]}>
            <PersonSilhouette />
          </group>
          
          {/* BEHIND THE DOOR */}
          <group position={[1, 0, -16]} rotation={[0, Math.PI, 0]} scale={[1, 1.25, 1]}>
          <PersonSilhouette />
          </group>

















{showWhiteMirror && (
          <TheWhiteMirror whiteRoomTarget={whiteRoomTarget}
           setShowAnalogModal={setShowAnalogModal} />
          )}
          {code1 && code2 && (
          <TheRoom
          showWhiteMirror={showWhiteMirror}
          setShowWhiteMirror={setShowWhiteMirror}
           onChairSit={handleChairSit} onRoomEnter={handleRoomEnter} />
          )}
          <Plane args={[4,2]} position={[0,2,-26.49]} rotation={[0,0,0]} receiveShadow>
          <meshStandardMaterial color="#888888" roughness={0.15}  />
        </Plane>
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
      <Box args={[20, 1, 60]} position={[0, 4, -14]}>
        <meshStandardMaterial color="#ffffff" />
      </Box>
      <PhysicalFloor lowGraphics={LS_lowGraphics} />
      <PhysicalCeiling />




      <CDDoorPortals code1={code1} code2={code2} code3={code3} setPlayerPosition={handleSetPlayerPosition} />

{!showWhiteMirror && (
          <BewMainScene 
          code1={code1}
          code2={code2}
          code3={code3}
          wasFirstDoorOpened={wasFirstDoorOpened.current}
          onFirstDoorOpened={handleFirstDoorOpened}
          setPlayerPosition={handleSetPlayerPosition} />
)}




          
          <BewPhysicsScene
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
      </Canvas>
      {isMobileDevice && <BewMobileOverlay />}
      <div id="crosshair" 
      className='pos-fix top-50p left-50p opaci-20 noclick block bord-r-100 tx-white tx-shadow-5'
      style={{
transform: "translate(-50%, -50%)",
      }}
      >+</div>
    </div>
  );
};










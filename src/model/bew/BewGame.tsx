'use client';
import { isMobile } from '@/../scripts/utils/mobileDetection';
import { Physics } from '@react-three/cannon';
import { Canvas } from '@react-three/fiber';
import { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { BewMainScene } from '@/model/bew/BewMainScene';
import { RoomC } from './RoomC';
import { BewMobileOverlay } from '@/model/bew/BewMobileOverlay';
import { PersonSilhouette } from './PersonSilhouette';
import { BewLighting } from './BewLighting';
import { TheRoom } from './TheRoom';
import { AnalogModalScreen } from './AnalogModalScreen';
import { BewPhysicsScene } from './BewPhysicsScene';
import { PhysicalWall } from './PhysicalWall';
import { Box, Plane } from '@react-three/drei';
import { useVibeverse } from '@/dom/useVibeverse';
import { VibeverseContext } from '@/dom/VibeverseProvider';
import { Stats } from '@react-three/drei';
import { useSearchParams } from 'next/navigation';
import { useBew } from './BewProvider';
import { BackgroundMusic } from '@/dom/atom/game/BackgroundMusic';
import { PerformanceStats } from './PerformanceStats';
import { RotatingBar } from './RotatingBar';
import { AnalysisScreen } from './AnalysisScreen';

export const BewGame = () => {
  const { LS_playerId, LS_lowGraphics, LS_firstTime, disableFirstTime, formatPortalUrl } = useContext(VibeverseContext)
  
  const { isCutSceneOpen, showSnackbar, closeSnackbar, setIsCutSceneOpen, playSoundEffect } = useBew();
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isEverythingLoading, setIsEverythingLoading] = useState(true);
  const [focusLevel, setFocusLevel] = useState(0);
  const focusStageRef = useRef<any>(0);
  const [enableLocked, setEnableLocked] = useState(true)
  const [initialPosition, setInitialPosition] = useState<[number, number, number]>(
    // [-8, 0, 11]
    [-1.5, 0, 1]
  )
  const [currentPosition, setCurrentPosition] = useState<[number, number, number]>([0, 0, 1]);
  const [playerRotation, setPlayerRotation] = useState({ x: 0, y: 0, z: 0 })
  const [isLocked, setIsLocked] = useState(false)
  const [teleportTrigger, setTeleportTrigger] = useState(0);
  const [showCodeInput, setShowCodeInput] = useState(false);
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
  
  const sendCRVReport = async (crvData: {
    type: string;
    natural: number;
    temp: number;
    light: number;
    color: number;
    solid: number;
    confidence: number;
  }) => {
    console.table(crvData)
    setFocusLevel(0);
    focusStageRef.current = 0;
    setIsLocked(false);
    setLoadingAnalysisResult(true)
    playSoundEffect("/sfx/stickyshift.mp3", 0.05)

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
      console.log("wholeResponse", wholeResponse)
      console.log(firstPart, secondPart, thirdPart)
      setTimeout(() => {
        setLoadingAnalysisResult(false)
        setAnalysisResult(`
  TARGET                               RESPONSE
  ______                               ______________________________    
  
  ??° ?' ■■"               ${firstPart}
  ■■■■° NW                ${secondPart}
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
  const handleTriggerCollision = useCallback((event: any) => {
    // alert("You've triggered a collision event!");
    focusStageRef.current = focusStageRef.current +1
    setFocusLevel((prev) => prev + 1)
    if (LS_firstTime) {

      playSoundEffect("/sfx/firsttimesense.ogg")
      setTimeout(() => {
        playSoundEffect("/sfx/sensetuto.ogg")

        
        showSnackbar("-Navigate config -Fill input values -Send for Analysis", 'info')
        setTimeout(() => {
          closeSnackbar();
        }, 10000)
      }, 3500);
    } else {
      
      showSnackbar("-Navigate config -Fill input values -Send (Analysis)", 'info')
      setTimeout(() => {
        closeSnackbar();
      }, 10000)
    }
    
    // setEnableLocked(false)
    // setIsLocked(true)
    // setInitialPosition([0, 1, 3])
    // document.pointerLockElement && document.exitPointerLock()
  }, []);

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
    if (inputValue === CODE_1) {
      setCode1(inputValue)
      if (!!code2) {
        playSoundEffect("/sfx/goodcode.mp3")
      }
    }
  };

  const handleCode2Submit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = (e.target as HTMLInputElement).value;
    if (inputValue === CODE_2) {
      setCode2(inputValue)
      if (!!code1) {
        playSoundEffect("/sfx/goodcode.mp3")
      }
    }
  };

  const handleRoomEnter = () => {
    // disable the movement for 10 seconds
    // while the intro cutscene plays
    // then enable the movement again
    setIsCutSceneOpen(true);
    setEnableLocked(false);
    showSnackbar(`You've entered the training room... Sit down.`, 'title');
    playSoundEffect("/sfx/sitdown.ogg")

    setTimeout(() => {
      closeSnackbar();
      setIsCutSceneOpen(false);
      setEnableLocked(true);
    }, 4000);
  }





// **************************************************************************************************************
// **************************************************************************************************************
// **************************************************************************************************************











  return (
    <div className='pos-abs top-0 left-0 w-100 h-100 flex-col'>
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

      <div className='pos-abs bottom-0 right-0 mb-100 flex-col mr-4 z-100 gap-1 pa-1 pb-2'
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

      


      {focusLevel !== 0 && (
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

        <BewLighting />


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
          <group position={[0,2.9,-26.48]} rotation={[0,-0,0]}>
          <AnalysisScreen analysisResult={analysisResult} />
          </group>
        </>)}

        <Physics
          gravity={[0, -30, 0]}
          defaultContactMaterial={{ friction: 0.001, restitution: 0.2 }}
        >


          
          {/* CHAIR SUPERVISOR, only visible when focusStageRef.current === 0 */}
          {focusStageRef.current === 0 && ( <>
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

          <TheRoom onTriggerCollide={handleTriggerCollision} onRoomEnter={handleRoomEnter} />













          {/* First Barrier */}
          {/* <Box args={[6,1,1]} position={[0,0,0]}>
            <meshStandardMaterial color="#000000" />
          </Box> */}














          <BewMainScene 
          code1={code1}
          code2={code2}
          code3={code3}
          setPlayerPosition={handleSetPlayerPosition} />




          
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
      <div id="crosshair" className='pos-fix top-50p left-50p opaci-20 noclick block bord-r-100'>+</div>
    </div>
  );
};







const MindStats = () => {
  const { mindStats } = useVibeverse();
  const [stats, setStats] = useState(mindStats);
  const [username, setUsername] = useState("");
  const [hasFirstKey, setHasFirstKey] = useState(0);

  useEffect(() => {
    const handleStorageChange = (e: MessageEvent) => {
      if (e.data === 'localStorageChanged') {
        const savedStats = localStorage.getItem('VB_MINDSTATS');
        if (savedStats) {
          setStats(JSON.parse(savedStats));
        }
        const savedUsername = localStorage.getItem('VB_PLAYER_ID');
        if (savedUsername) {
          // only first 7 characters
          setUsername(savedUsername.substring(0, 7));
        }
        const savedHasFirstKey = localStorage.getItem('VB_HAS_FIRST_KEY');
        if (savedHasFirstKey) {
          setHasFirstKey( parseInt(savedHasFirstKey) );  
        }
      }
    };

    window.addEventListener('message', handleStorageChange);
    return () => window.removeEventListener('message', handleStorageChange);
  }, []);

  if (hasFirstKey === 0 || !username || !stats?.color) {
    return null;
  }

  return (
    <div className=' flex-row flex-align-stretch w-100px' style={{
      padding: '6px',
      gap: '3px',
      borderRadius: '3px',
      background: '#a4a087',
      boxShadow: 'inset -3px -3px 6px #242017',
    }}>
    <div className=' bord-r-5 flex-col  flex-1' style={{
      padding: '3px',
      background: '#a4a087',
      boxShadow: 'inset  0 5px 15px #444444',
    }}>
      <div className=' bord-r-10 py-2  w-90' style={{
        // border: '2px solid #a19e94',
        boxShadow: 'inset  0 0 15px #000000',
        background: '#333333',
      }}>
        <div className='flex-col flex-align-start pl-1 tx-xs' style={{
          fontFamily: 'monospace',
          color: '#009900',
          textShadow: '0 0 5px #00ff00',
        }}>
          <div>{username || "----"}</div>
          <div>SYNC: {(stats?.color || 0)}</div>
          {/* <div>SYNC: {(stats?.color || 0) + (stats?.solid || 0) + (stats?.light || 0)}</div> */}
          <div>KEYS: {hasFirstKey ? "1" : "0"}</div>
          </div>
          </div>
      </div>
      <div className='pa-1 tx-white flex-col tx-altfont-1 flex-justify-start tx-xxs' style={{
        background: '#444444',
        borderRadius: '2px',
      }}>
        <div>wbw</div>
        <hr className='w-100 opaci-20' />
        <div className='pt-1 flex-col flex-align-start opaci-30'>
          <div>@</div>
          <div>web</div>
          <div>duno</div>
        </div>

      </div>
    </div>
  );
};


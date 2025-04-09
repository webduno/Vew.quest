'use client';
import { isMobile } from '@/../scripts/utils/mobileDetection';
import { Physics } from '@react-three/cannon';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
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
import { Box } from '@react-three/drei';
import { useVibeverse } from '@/dom/useVibeverse';
import { VibeverseContext } from '@/dom/VibeverseProvider';
import { Stats } from '@react-three/drei';
import { useSearchParams } from 'next/navigation';
import { useBew } from './BewProvider';

// Performance stats component that works inside Canvas
const PerformanceStats = ({ onStatsUpdate }: { onStatsUpdate: (stats: any) => void }) => {
  const { gl, scene } = useThree();
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  
  useFrame(() => {
    frameCount.current++;
    
    // Update stats every second
    const currentTime = performance.now();
    if (currentTime - lastTime.current >= 1000) {
      const elapsed = currentTime - lastTime.current;
      const fps = Math.round((frameCount.current * 1000) / elapsed);
      
      onStatsUpdate({
        drawCalls: gl.info.render.calls,
        objectCount: scene.children.length,
        fps,
        frameTime: Math.round(elapsed / frameCount.current)
      });
      
      frameCount.current = 0;
      lastTime.current = currentTime;
    }
  });
  
  // Return null since we don't want to render anything in the 3D scene
  return null;
};

export const BewGame = () => {
  const { LS_playerId, LS_lowGraphics, formatPortalUrl } = useContext(VibeverseContext)
  const { showSnackbar, closeSnackbar, isCutSceneOpen, setIsCutSceneOpen } = useBew();
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [focusLevel, setFocusLevel] = useState(0);
  const focusStageRef = useRef<any>(0);
  const [enableLocked, setEnableLocked] = useState(true)
  const [initialPosition, setInitialPosition] = useState<[number, number, number]>([-1.5, 0, 1])
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

  const [code1, setCode1] = useState("")
  const [code2, setCode2] = useState("")
  const [code3, setCode3] = useState("")


  const [viewType, setViewType] = useState<'object' | 'entity' | 'place' | 'entity'>('object')
  const [naturality, setNaturality] = useState<number>(0)
  const [temperature, setTemperature] = useState<number>(0)
  

  

  useEffect(() => {
    setIsMobileDevice(isMobile());
  }, []);

  // Handle trigger collision
  const handleTriggerCollision = useCallback((event: any) => {
    // alert("You've triggered a collision event!");
    focusStageRef.current = focusStageRef.current +1
    setFocusLevel((prev) => prev + 1)
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
    }
  };

  const handleCode2Submit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = (e.target as HTMLInputElement).value;
    if (inputValue === CODE_2) {
      setCode2(inputValue)
    }
  };

  const handleRoomEnter = () => {
    // disable the movement for 10 seconds
    // while the intro cutscene plays
    // then enable the movement again
    setIsCutSceneOpen(true);
    setEnableLocked(false);
    showSnackbar(`You are in the training room... Take a seat.`, 'info');
    setTimeout(() => {
      closeSnackbar();
      setIsCutSceneOpen(false);
      setEnableLocked(true);
    }, 5000);
  }

  return (
    <div className='pos-abs top-0 left-0 w-100 h-100 flex-col'>
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
          onClose={() => {
            setFocusLevel(0);
            focusStageRef.current = 0;
            setIsLocked(false);
          }}
        />
      )}
      <Canvas camera={{ fov: 125 }} shadows={LS_lowGraphics ? false : true}>
        {/* Performance stats component inside Canvas */}
        {showStats && <PerformanceStats onStatsUpdate={setPerformanceStats} />}

        <BewLighting />




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
      <div id="crosshair" className='pos-fix top-50p left-50p opaci-10 noclick block bord-r-100'>+</div>
    </div>
  );
};






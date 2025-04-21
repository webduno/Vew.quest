'use client';
import { useSearchParams } from 'next/navigation';
import { Box, MeshPortalMaterial, Plane, PositionalAudio, Sphere, Fisheye, MapControls, Cylinder, Torus } from '@react-three/drei';
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
// import { SolidBox } from '../../core/SolidBox';
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
import targetsData from '@/../public/data/targets_1.json';
import { KeyboardBtn } from '@/dom/atom/button/KeyboardBtn';
import { BewWorldPlaza, BewWorldPlazaWithPlayer } from './BewWorldPlaza';
import { SolidBox } from '@/model/core/SolidBox';
import { WorldMobileControlOverlay } from '@/dom/molecule/game/WorldMobileControlOverlay';

type TargetsData = {
  [key: string]: string;
};

export const BewWorldGame = () => {
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
  const focusStageRef = useRef<any>(0);
  const [enableLocked, setEnableLocked] = useState(true)
  const [initialPosition, setInitialPosition] = useState<[number, number, number]>(
    // [-3, 0, -19]
    // [-1.5, 0, 1]
    [-11,11,11]
  )
  const [currentPosition, setCurrentPosition] = useState<[number, number, number]>([0, 0, 1]);
  const [playerRotation, setPlayerRotation] = useState({ x: 0, y: 0, z: 0 })
  const [isLocked, setIsLocked] = useState(false)
  const [teleportTrigger, setTeleportTrigger] = useState(0);
  const [wasFirstDoorOpened, setWasFirstDoorOpened] = useState(false);
  // const wasFirstDoorOpened = useRef(false);
  const handleFirstDoorOpened = useCallback(() => {
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
  
  

  useEffect(() => {
    setIsMobileDevice(isMobile());
    // Set loading to false when game is ready
    setIsEverythingLoading(false);
  }, []);

  // Callback to get player rotation from physics scene
  const handlePlayerRotationUpdate = useCallback((rotation: { x: number, y: number, z: number }) => {
    setPlayerRotation(rotation);
  }, []);



// **************************************************************************************************************
// **************************************************************************************************************
// **************************************************************************************************************


const mapControlsRef = useRef<any>(null)
const [isMapView, setIsMapView] = useState(true);
const [isPlayerView, setIsPlayerView] = useState(false);

const handleEnterWorld = useCallback(() => {
  setIsMapView(false);
  setIsPlayerView(true);
  document.body.requestPointerLock()
  setTimeout(() => {
    document.querySelector('canvas')?.click()
  }, 100)
}, []);







  return (
    <div className='pos-abs top-0 left-0 w-100 h-100 flex-col'
    style={{
      background: 'radial-gradient( #ffffff,rgb(213, 242, 255))'
      // background: 'linear-gradient(125deg, #ffcc66, #008EE2, #d5fEFf)'
      // background: 'linear-gradient(25deg, #ffcc66, #008EE2, #B5EEFE, #d5fEFf, #ffffff)'
    }}
    >

{isMapView &&
  <div className='pos-abs bottom-0 mb-100 right-0  flex-col pa-4'>
<button className='bord-r-10 px-2  z-1000 py-1 tx-white'
style={{
  backgroundColor: '#77cc77',
  boxShadow: '0 4px 0 #44aa44'
}}
 onClick={handleEnterWorld}>Enter World</button>
</div>
}

<div className='pos-abs top-0 right-0  flex-col pa-4'>
{isPlayerView &&
<button className='bg-white bord-r-10 px-2 tx-gray z-1000 block py-1' onClick={(e) => {
  // setCurrentPosition([-25,25,25])
  // setPlayerRotation({ x: 0, y: 0, z: 0 })
  // setIsLocked(false)
  // setTeleportTrigger(prev => prev + 1);
  // return

  // return
    e.preventDefault()
  setIsPlayerView(!isPlayerView)
  setIsMapView(true)
  // unlock the player mouse
  document.exitPointerLock()

}
}>View Map</button>
}
</div>


 

        {isMapView &&<>
      <Canvas camera={{ fov: 40, position: [-45,45,45] }} 
      // shadows={LS_lowGraphics ? false : true}
      shadows={true}

      >
      <MapControls ref={mapControlsRef}
      maxPolarAngle={Math.PI / 2.05}
      target={[0, 0, 0]}
      // position={[-25,25,25]}
      // rotation={[playerRotation.x, playerRotation.y, playerRotation.z]}
      />

      <BewWorldPlaza />
      {/* <Plane args={[60, 60]} receiveShadow rotation-x={-Math.PI/2} position={[0,0,0]}>
        <meshStandardMaterial color="white" />
      </Plane> */}
      <Cylinder args={[26,19,11,9]} position={[0,-5.501,-2]} receiveShadow>
        <meshStandardMaterial color="#ffffff" />
      </Cylinder>
      <Torus scale={[1,1,6]} args={[26,.2,4,9]} position={[0,1,-2]} rotation={[Math.PI/2,0,0.18]}>
        <meshStandardMaterial color="#ffffff" />
      </Torus>
      </Canvas>
      </>
      }
      
{isPlayerView &&   !isMapView &&       <>
        
      <Canvas camera={{ fov: 125, position: [-30,30,30] }} 
      // shadows={LS_lowGraphics ? false : true}
      shadows={true}

      >
        {/* <Fisheye >
        <ambientLight intensity={.1} /> */}
        <Physics
          gravity={[0, -30, 0]}
          defaultContactMaterial={{ friction: 0.001, restitution: 0.2 }}
        >
      <SolidBox visible={false} size={[55,1,55]} position={[0,-0.501,-2]} />

        <BewWorldPlaza />
        <BewWorldPlazaWithPlayer />
            

        <Torus scale={[1,1,6]} args={[26,.25,5,9]} position={[0,1,-2]} rotation={[Math.PI/2,0,0.18]}>
        <meshStandardMaterial color="#ffffff" flatShading />
      </Torus>







      {/* CEILING */}
      {/* <PhysicalFloor lowGraphics={LS_lowGraphics} />  */}


          <PlayerPhysicsScene
            isCutSceneOpen={isCutSceneOpen}
            playerHeight={1.2}
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
            ballCount={12}
            isLocked={isLocked}
            setIsLocked={setIsLocked}
            onRotationUpdate={handlePlayerRotationUpdate} />




        </Physics>
        {/* </Fisheye> */}
      </Canvas>
        </> }



      {isMobileDevice && isPlayerView && <WorldMobileControlOverlay />}
      <div id="crosshair" 
      className='pos-fix top-50p left-50p opaci-20 noclick block bord-r-100 tx-white tx-shadow-5'
      style={{
transform: "translate(-50%, -50%)",
      }}
      >+</div>
    </div>
  );
};













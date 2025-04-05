'use client';
import { isMobile } from '@/../scripts/utils/mobileDetection';
import { Physics } from '@react-three/cannon';
import { Canvas } from '@react-three/fiber';
import { useState, useEffect, useCallback, useRef } from 'react';
import { BewMainScene } from '@/model/bew/BewMainScene';
import { BewMobileOverlay } from '@/model/bew/BewMobileOverlay';
import { PersonSilhouette } from './PersonSilhouette';
import { BewLighting } from './BewLighting';
import { TheRoom } from './TheRoom';
import { AnalogModalScreen } from './AnalogModalScreen';
import { BewPhysicsScene } from './BewPhysicsScene';
import { PhysicalWall } from './PhysicalWall';


export const BewGame = () => {
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [focusLevel, setFocusLevel] = useState(0);
  const focusStageRef = useRef<any>(0);
  const [enableLocked, setEnableLocked] = useState(true)
  const [initialPosition, setInitialPosition] = useState<[number, number, number]>([0, 1, 3])
  const [playerRotation, setPlayerRotation] = useState({ x: 0, y: 0, z: 0 })
  const [isLocked, setIsLocked] = useState(false)




  const [viewType, setViewType] = useState<'object' | 'entity' | 'place' | 'entity'>('object')
  const [naturality, setNaturality] = useState<number>(0)
  const [temperature, setTemperature] = useState<number>(0)
  

  

  useEffect(() => {
    setIsMobileDevice(isMobile());
  }, []);

  // Handle trigger collision
  const handleTriggerCollision = useCallback((event: any) => {
    // alert("You've triggered a collision event!");
    console.log("You've triggered a collision event!");
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

  return (
    <div className='pos-abs top-0 left-0 w-100 h-100 flex-col'>
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
      <Canvas camera={{ position: [-0, 10, 28], fov: 125 }} shadows>

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

          <TheRoom onTriggerCollide={handleTriggerCollision} />

          <BewMainScene />




          
          <BewPhysicsScene
            playerHeight={1.8}
            playerRadius={0.4}
            moveSpeed={focusStageRef.current === 0 ? 11 : 0}
            jumpForce={focusStageRef.current === 0 ? 10 : 0}
            maxVelocity={focusStageRef.current === 0 ? 40 : 0}
            position={initialPosition}
            sceneObjects={[]}
            onExit={() => {
              console.log('onExit')
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






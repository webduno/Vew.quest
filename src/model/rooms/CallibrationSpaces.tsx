'use client';
import { Box, Text } from '@react-three/drei';
import { StyledWall } from '@/model/core/StyledWall';
import { useState, useEffect } from 'react';
import { ColorCallibrationArcade } from '@/model/minigames/ColorCallibrationArcade';
import { SummoningCircle } from '../bits/SummoningCircle';
import { SolidBox } from '../core/SolidBox';
import { SolidCallibrationArcade } from '@/model/minigames/SolidCallibrationArcade';
import { usePlayerStats } from '../../../script/state/hook/usePlayerStats';
import { CollisionBox } from '../core/CollisionBox';
import { useGameCore } from '../../../script/state/hook/useGameCore';

export const CallibrationSpaces = () => {
  const { showSnackbar, playSoundEffect } = useGameCore();
  const { hasExploredZone, updateExploredStatus } = usePlayerStats();
  const [colorCalibrationStarted, setColorCalibrationStarted] = useState(false)
  const [solidCalibrationStarted, setSolidCalibrationStarted] = useState(false)

  const [colorLevel, setColorLevel] = useState(0);

  useEffect(() => {
    const checkColorLevel = () => {
      const savedStats = localStorage.getItem('VB_MINDSTATS');
      const currentStats = savedStats ? JSON.parse(savedStats) : { color: 0 };
      setColorLevel(currentStats.color);
    };

    // Initial check
    checkColorLevel();
    // Listen for localStorage changes
    const handleStorageChange = (e: MessageEvent) => {
      if (e.data === 'localStorageChanged') {
        checkColorLevel();
      }
    };

    window.addEventListener('message', handleStorageChange);
    return () => window.removeEventListener('message', handleStorageChange);
  }, []);

  const startColorCalibration = () => {
    setColorCalibrationStarted(true)
  }

  const startSolidCalibration = () => {
    setSolidCalibrationStarted(true)
  }
  
  const [hardMode, setHardMode] = useState(false)
  return (
    <group>

      
    {!hasExploredZone('callibration_spaces') && (
      <CollisionBox 
        onCollide={() => {
          updateExploredStatus('callibration_spaces', true);
          if (true) {
            playSoundEffect('/sfx/tutorials/arcade1.ogg');
          }
        }}
        position={[-4,1.5,8.25]} size={[1,3,2]} 
      />
    )}
    

      <StyledWall size={[10, 4, 1]} position={[-8, 1.49, 15]} color="#ffffff" />
      <StyledWall size={[10, 4, 1]} position={[-8, 1.49, 6]} color="#ffffff" />
      <StyledWall size={[1, 4, 8]} position={[-13, 1.49, 10.5]} color="#ffffff" />
      <Box position={[-8.5, 3.6, 10.5]} args={[10, 1, 8]}>
        <meshStandardMaterial color="#ffffff" />
      </Box>

{/* 
      <Text font="/fonts/wallpoet.ttf" fontSize={0.2} color="#777777" 
anchorX="center" anchorY="middle" textAlign="center"
position={[-5,2.5,14.49]} rotation={[0,Math.PI,0]}
>
{`ARCADE MACHINES -->`}
</Text> */}

<Text font="/fonts/wallpoet.ttf" fontSize={1} color="#777777" 
anchorX="center" anchorY="middle" textAlign="center"
position={[-3.51,1.5,11.75]} rotation={[0,-Math.PI/2,0]}
>
{`ARCADE`}
</Text>
<Text font="/fonts/wallpoet.ttf" fontSize={0.4} color="#777777" 
anchorX="center" anchorY="middle" textAlign="center"
position={[-5.5,1.5,14.49]} rotation={[0,Math.PI,0]}
>
{`MACHINES ---->`}
</Text>
      

      {/* <Text font="/fonts/wallpoet.ttf" fontSize={0.4} color="#333333" 
anchorX="center" anchorY="middle" textAlign="center"
position={[-5,2.5,14.49]} rotation={[0,Math.PI,0]}
>
{`LIGHT`}
</Text>
<Box position={[-5,1,13.9]} rotation={[0,Math.PI,0]} args={[1,2,1]}>
  <meshStandardMaterial color="#cccccc" />
</Box> */}











<Text font="/fonts/wallpoet.ttf" fontSize={0.4} color="#333333" 
anchorX="center" anchorY="middle" textAlign="center"
position={[-8,2.8,14.49]} rotation={[0,Math.PI,0]}
>
{`COLOR`}
</Text>
<ColorCallibrationArcade 
hardMode={hardMode} 
startColorCalibration={startColorCalibration}
colorCalibrationStarted={colorCalibrationStarted} setColorCalibrationStarted={setColorCalibrationStarted} />



<HardModeLever hardMode={hardMode} setHardMode={setHardMode} />

{hardMode   && (
  <pointLight position={[-5, 2, 8.25]} intensity={.5} color="#ffffff" 
  castShadow
  distance={9}
  shadow-mapSize-width={32}
  shadow-mapSize-height={32}
  shadow-camera-near={1}
  shadow-camera-far={9}
  shadow-camera-left={-9}
  shadow-camera-right={9}
  shadow-camera-top={9}
  shadow-camera-bottom={-9}
  />
)}

<SolidBox visible={false}
     position={[-8, 2, 9]} size={[2.2, 4, 2.2]} color="#ffcccc" />    
    <group position={[-8, 0, 9]} rotation={[0, 0, 0]}>
      <SummoningCircle 
        hardMode={hardMode} 
        colorCalibrationStarted={colorCalibrationStarted}
        solidCalibrationStarted={solidCalibrationStarted} 
      />
    </group>













{!!hasExploredZone('psionic_asset_zone') && colorLevel >= 1 && (<>
    <Text font="/fonts/wallpoet.ttf" fontSize={0.4} color="#333333" 
anchorX="center" anchorY="middle" textAlign="center"
position={[-11,2.8,14.49]} rotation={[0,Math.PI,0]}
>
{`SOLID`}
</Text>

</>)}
  {!hasExploredZone('psionic_asset_zone') && colorLevel >= 1 && (<>


    <Text font="/fonts/wallpoet.ttf" fontSize={0.4} color="#333333" 
anchorX="center" anchorY="middle" textAlign="center"
position={[-11,2.8,14.49]} rotation={[0,Math.PI,0]}
>
{`SOLID`}
</Text>


  <Text font="/fonts/consolas.ttf" fontSize={0.2} color="#333333" 
anchorX="center" anchorY="middle" textAlign="center"
position={[-11,1.8,14.49]} rotation={[0,Math.PI,0]}
>
{`Solid callibration
is for Psionic
Assets only`}
</Text>

<Text font="/fonts/consolas.ttf" fontSize={0.2} color="#333333" 
anchorX="center" anchorY="middle" textAlign="center"
position={[-11,1,14.49]} rotation={[0,Math.PI,0]}
>
{`FIND THE ZONE
AND COME BACK`}
</Text>
</>)}

{hasExploredZone('psionic_asset_zone') && (
<SolidCallibrationArcade 
hardMode={hardMode} 
startSolidCalibration={startSolidCalibration}
solidCalibrationStarted={solidCalibrationStarted} setSolidCalibrationStarted={setSolidCalibrationStarted} />
)}



    </group>
  );
};



const HardModeLever = ({hardMode, setHardMode}: {hardMode: boolean, setHardMode: (hardMode: boolean) => void}) => {
  
  const toggleHardMode = () => {
    setHardMode(!hardMode)
  }
  return (
    <group
    onClick={() => {
toggleHardMode()
    }}
    >
    <Box position={[-8, 2, 6.5]} args={[0.5, 1, .1]}>
      <meshStandardMaterial color="#ffffff" emissive="#111111" />
    </Box>
      <Box position={[-8, 2, 6.5]} args={[0.2, 1, .2]}
      rotation={[hardMode ? -1 : 1, 0, 0]}
      >
        <meshStandardMaterial color="#dddddd" />
      </Box>
    </group>
  );
};

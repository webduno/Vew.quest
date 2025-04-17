'use client';
import { useState } from 'react';
import { Box, Text, Sphere } from '@react-three/drei';

import { SolidBox } from '../core/SolidBox';
import { useGameCore } from '../../../script/state/hook/useGameCore';
import { CollisionBox } from '../core/CollisionBox';
import { usePlayerStats } from '../../../script/state/hook/usePlayerStats';
import { SolidGameLoop } from '@/model/minigames/SolidGameLoop';


export const SolidCallibrationArcade = ({ 
  hardMode,
  solidCalibrationStarted,
  setSolidCalibrationStarted,
  startSolidCalibration
}: {
  hardMode: boolean;
  solidCalibrationStarted: boolean;
  setSolidCalibrationStarted: (solidCalibrationStarted: boolean) => void;
  startSolidCalibration: () => void; 
}) => {
  const { showSnackbar, closeSnackbar, playSoundEffect } = useGameCore();
  const { updateMindStats, hasCompletedTutorial, updateTutorialStatus } = usePlayerStats();
  const [points, setPoints] = useState<number>(0);
  const [misses, setMisses] = useState<number>(0);

  const handleStart = () => {
    playSoundEffect("/sfx/short/passbip.mp3");
    startSolidCalibration();
    setPoints(0);
    setMisses(0);
  };

  const checkPrimitives = (isMoreBoxes: boolean, currentPrimitives: { type: 'box' | 'sphere', count: number }[], currentPrimitivesAnswered: boolean) => {
    if (!currentPrimitivesAnswered) {
      setMisses(prev => prev + 1);
      playSoundEffect("/sfx/short/badbip.wav");
      return false;
    }
    if (!solidCalibrationStarted) return false;
    
    const boxCount = currentPrimitives.filter(p => p.type === 'box').length;
    const sphereCount = currentPrimitives.filter(p => p.type === 'sphere').length;
    
    if ((isMoreBoxes && boxCount > sphereCount) || (!isMoreBoxes && boxCount <= sphereCount)) {
      setPoints(prev => prev + 1);
      playSoundEffect("/sfx/short/goodbip.wav")
    } else {
      setMisses(prev => prev + 1);
      playSoundEffect("/sfx/short/badbip.wav")
    }
    return true;
  };

  const handleGameEnd = () => {
    setSolidCalibrationStarted(false);
    if (points >= 1) {
      playSoundEffect("/sfx/short/goodcode.mp3");
      showSnackbar(points+" callibration point(s) added", 'success', 3000);

      const savedStats = localStorage.getItem('VB_MINDSTATS');
      const currentStats = savedStats ? JSON.parse(savedStats) : { solid: 0 };
      updateMindStats('solid', currentStats.solid + points);
    } else {
      playSoundEffect("/sfx/short/badbip.wav");
    }
  };

  return (<>
    {!hasCompletedTutorial('solid') && (
      <CollisionBox  
        color="#ff0000"
        triggerCount={1}
        size={[.8, 2, 1]}
        position={[-11, 1, 13.5]}
        onCollide={() => {
          updateTutorialStatus('solid', true);
          playSoundEffect("/sfx/tutorials/solidtuto.ogg");
          showSnackbar("Click 'LESS' or 'FULL', if there are more spheres or boxes", 'handbook');
          setTimeout(() => {
            closeSnackbar();
          }, 9000);
        }}
      />
    )}

    {/* start button */}
    <Box
     position={[-11, !solidCalibrationStarted? 1.05: 0.95, 13.6]} 
     rotation={[0, 0, 0]} args={[.5, .2, .2]}
      onClick={()=>{
        console.log("clicked");
        handleStart();
      }}
    >
      <meshStandardMaterial color={solidCalibrationStarted ? "#ccbbbb" : "#ffdddd"} />
    </Box>

    {/* arcade BOTTOM CONSOLE */}
    <SolidBox visible={false} position={[-11, .5, 13.9]} size={[1, 1, 1]} color="#ffcccc" />    
    <Box position={[-11, .5, 13.9]} rotation={[0, 0, 0]} args={[1, 1, 1]}>
      <meshStandardMaterial color="#dddddd" />
    </Box>

    {/* arcade scorescreen */}
    <Text font="/fonts/wallpoet.ttf" fontSize={0.1} color="#223322" 
      anchorX="left" anchorY="middle" textAlign="left"
      position={[-10.65,1.7,13.839]} rotation={[0,Math.PI,0]}
    >
      {`HIT: ${points} \nMISS: ${misses}`}
    </Text>
    <Box position={[-11, 1.7, 13.89]} rotation={[0, 0, 0]} args={[.8, .22, .1]}>
      <meshStandardMaterial color="#cccccc"  />
    </Box>

    <Text
        font="/fonts/wallpoet.ttf"
        fontSize={0.1}
        color="#111111"
        anchorX="center"
        anchorY="middle"
        textAlign="center"
        position={[-11.2, 1.5, 13.839]}
        rotation={[0, Math.PI, 0]}
      >
        {`full`}
      </Text>
      <Text
        color="#444444"
        font="/fonts/wallpoet.ttf"
        fontSize={0.1}
        anchorX="center"
        anchorY="middle"
        textAlign="center"
        position={[-10.8, 1.5, 13.839]}
        rotation={[0, Math.PI, 0]}
      >
        {`less`}
      </Text>

    <Box
        position={[-11.2, 1.3, 13.82]}
        rotation={[0, 0, 0]}
        args={[.2, .2, .05]}
      >
        <meshStandardMaterial color="#dddddd" />
      </Box>
      <Sphere args={[.12, 16, 16]} position={[-10.8, 1.3, 13.82]}>
        <meshStandardMaterial color="#ffffff" emissive="#333333" />
        </Sphere>
    {/* arcade screen background */}
    <Box position={[-11, 1.3, 13.89]} rotation={[0, 0, 0]} args={[.8, .5, .1]}>
      <meshStandardMaterial color="#ffffff" emissive="#101010" />
    </Box>
    {/* arcade body */}
    <Box position={[-11, 1, 14.1]} rotation={[0, 0, 0]} args={[.85, 2, .5]}>
      <meshStandardMaterial color="#eeeeee" />
    </Box>
    <Box position={[-11, 1, 14.25]} rotation={[0, 0, 0]} args={[.9, 2, .2]}>
      <meshStandardMaterial color="#dddddd" />
    </Box>
    {/* arcade machine top */}
    <Box position={[-11, 2.1, 14]} rotation={[0.5, 0, 0]} args={[1, .5, .8]}>
      <meshStandardMaterial color="#dddddd" />
    </Box>
    <Box position={[-11, 2.02, 14]} rotation={[0.5, 0, 0]} args={[.8, .4, .8]}>
      <meshStandardMaterial color="#eeeeee" />
    </Box>

    {solidCalibrationStarted && (
      <SolidGameLoop 
        hardMode={hardMode}
        onGameEnd={handleGameEnd}
        onCheckPrimitives={checkPrimitives}
        points={points}
        misses={misses}
        onRound={
          (roundNumber) => {
            console.log("roundNumber", roundNumber);
            setTimeout(() => {
              playSoundEffect("/sfx/short/passbip.mp3");
            }, 100);
          }
        }
      />
    )}
  </>);
}; 
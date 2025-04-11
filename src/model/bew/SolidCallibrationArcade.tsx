'use client';
import { Box, Text, Sphere } from '@react-three/drei';
import { PhysicalWall } from './PhysicalWall';
import { useState } from 'react';
import { useBew } from './BewProvider';
import { PhysicalTrigger } from './PhysicalTrigger';
import { useVibeverse } from '@/dom/useVibeverse';
import { useBackgroundMusic } from '@/../scripts/contexts/BackgroundMusicContext';
import { SolidGameLoop } from './SolidGameLoop';

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
  const { showSnackbar, closeSnackbar } = useBew();
  const { playSoundEffect } = useBackgroundMusic();
  const { updateMindStats, hasCompletedTutorial, updateTutorialStatus } = useVibeverse();
  const [points, setPoints] = useState<number>(0);
  const [misses, setMisses] = useState<number>(0);

  const handleStart = () => {
    startSolidCalibration();
    setPoints(0);
    setMisses(0);
  };

  const checkPrimitives = (isMoreBoxes: boolean, currentPrimitives: { type: 'box' | 'sphere', count: number }[], currentPrimitivesAnswered: boolean) => {
    if (!currentPrimitivesAnswered) {
      setMisses(prev => prev + 1);
      playSoundEffect("/sfx/passbip.mp3");
      return false;
    }
    if (!solidCalibrationStarted) return false;
    
    const boxCount = currentPrimitives.filter(p => p.type === 'box').length;
    const sphereCount = currentPrimitives.filter(p => p.type === 'sphere').length;
    
    if ((isMoreBoxes && boxCount > sphereCount) || (!isMoreBoxes && boxCount <= sphereCount)) {
      setPoints(prev => prev + 1);
      playSoundEffect("/sfx/goodbip.wav")
    } else {
      setMisses(prev => prev + 1);
      playSoundEffect("/sfx/badbip.wav")
    }
    return true;
  };

  const handleGameEnd = () => {
    setSolidCalibrationStarted(false);
    if (points >= 4) {
      playSoundEffect("/sfx/goodcode.mp3");
      const savedStats = localStorage.getItem('VB_MINDSTATS');
      const currentStats = savedStats ? JSON.parse(savedStats) : { solid: 0 };
      updateMindStats('solid', currentStats.solid + 1);
    } else {
      playSoundEffect("/sfx/badbip.wav");
    }
  };

  return (<>
    {!hasCompletedTutorial('solid') && (
      <PhysicalTrigger  visible={false}
        color="#ff0000"
        triggerCount={1}
        size={[.8, 2, 1]}
        position={[-11, 1, 13.5]}
        onCollide={() => {
          updateTutorialStatus('solid', true);
          playSoundEffect("/sfx/colortuto.ogg");
          showSnackbar("Click 'MORE' or 'LESS', if there are more boxes than spheres", 'handbook');
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
      onClick={handleStart}
    >
      <meshStandardMaterial color={solidCalibrationStarted ? "#ccbbbb" : "#ffdddd"} />
    </Box>

    {/* arcade BOTTOM CONSOLE */}
    <PhysicalWall visible={false} position={[-11, .5, 13.9]} size={[1, 1, 1]} color="#ffcccc" />    
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
        color="#444444"
        anchorX="center"
        anchorY="middle"
        textAlign="center"
        position={[-11.2, 1.5, 13.839]}
        rotation={[0, Math.PI, 0]}
      >
        {`more`}
      </Text>
      <Text
        font="/fonts/wallpoet.ttf"
        fontSize={0.1}
        color="#111111"
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
        <meshStandardMaterial color="#ffffff" emissive="#333333" />
      </Box>
      <Box
        position={[-10.8, 1.3, 13.82]}
        rotation={[0, 0, 0]}
        args={[.2, .2, .05]}
      >
        <meshStandardMaterial color="#dddddd" />
      </Box>
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
      />
    )}
  </>);
}; 
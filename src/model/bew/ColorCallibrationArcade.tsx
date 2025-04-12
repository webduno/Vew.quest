'use client';
import { Box, Text } from '@react-three/drei';
import { PhysicalWall } from '../core/PhysicalWall';
import { useState } from 'react';
import { useBew } from '../../../scripts/contexts/BewProvider';
import { PhysicalTrigger } from '../core/PhysicalTrigger';
import { useVibeverse } from '../../../scripts/hooks/useVibeverse';
import { useBackgroundMusic } from '@/../scripts/contexts/BackgroundMusicContext';
import { ColorGameLoop } from './ColorGameLoop';
export const ColorCallibrationArcade = ({ 
  hardMode,
  colorCalibrationStarted,
  setColorCalibrationStarted,
  startColorCalibration
}: {
  hardMode: boolean;
  colorCalibrationStarted: boolean;
  setColorCalibrationStarted: (colorCalibrationStarted: boolean) => void;
  startColorCalibration: () => void; 
}) => {
  const { showSnackbar, closeSnackbar } = useBew();
  const { playSoundEffect } = useBackgroundMusic();
  const { updateMindStats, hasCompletedTutorial, updateTutorialStatus } = useVibeverse();
  const [points, setPoints] = useState<number>(0);
  const [misses, setMisses] = useState<number>(0);

  const handleStart = () => {
    startColorCalibration();
    setPoints(0);
    setMisses(0);
  };

  const checkSaturation = (isLess: boolean, currentColor: string, currentColorAnswered: boolean) => {
    if (!currentColorAnswered) {
      setMisses(prev => prev + 1);
      playSoundEffect("/sfx/passbip.mp3");
      return false;
    }
    if (!colorCalibrationStarted) return false;
    
    const saturation = parseInt(currentColor.split(',')[1]);
    
    if ((isLess && saturation < 50) || (!isLess && saturation >= 50)) {
      setPoints(prev => prev + 1);
      playSoundEffect("/sfx/goodbip.wav")
    } else {
      setMisses(prev => prev + 1);
      playSoundEffect("/sfx/badbip.wav")
    }
    return true;
  };

  const handleGameEnd = () => {
    setColorCalibrationStarted(false);
    if (points >= 4) {
      playSoundEffect("/sfx/goodcode.mp3");
      const savedStats = localStorage.getItem('VB_MINDSTATS');
      const currentStats = savedStats ? JSON.parse(savedStats) : { color: 0 };
      updateMindStats('color', currentStats.color + 1);
    } else {
      playSoundEffect("/sfx/badbip.wav");
    }
  };

  return (<>
    {!hasCompletedTutorial('color') && (
      <PhysicalTrigger  visible={false}
        color="#ff0000"
        triggerCount={1}
        size={[.8, 2, 1]}
        position={[-8, 1, 13.5]}
        onCollide={() => {
          updateTutorialStatus('color', true);
          playSoundEffect("/sfx/colortuto.ogg");
          showSnackbar("Click 'FULL' or 'LESS', if the light color is intese or muted", 'handbook');
          setTimeout(() => {
            closeSnackbar();
          }, 9000);
        }}
      />
    )}








    {/* start button */}
    <Box
     position={[-8, !colorCalibrationStarted? 1.05: 0.95, 13.6]} 
     rotation={[0, 0, 0]} args={[.5, .2, .2]}
      onClick={handleStart}
    >
      <meshStandardMaterial color={colorCalibrationStarted ? "#ccbbbb" : "#ffdddd"} />
    </Box>

    {/* arcade BOTTOM CONSOLE */}
    <PhysicalWall visible={false} position={[-8, .5, 13.9]} size={[1, 1, 1]} color="#ffcccc" />    
    <Box position={[-8, .5, 13.9]} rotation={[0, 0, 0]} args={[1, 1, 1]}>
      <meshStandardMaterial color="#dddddd" />
    </Box>

    {/* arcade scorescreen */}
    <Text font="/fonts/wallpoet.ttf" fontSize={0.1} color="#223322" 
      anchorX="left" anchorY="middle" textAlign="left"
      position={[-7.65,1.7,13.839]} rotation={[0,Math.PI,0]}
    >
      {`HIT: ${points} \nMISS: ${misses}`}
    </Text>
    <Box position={[-8, 1.7, 13.89]} rotation={[0, 0, 0]} args={[.8, .22, .1]}>
      <meshStandardMaterial color="#cccccc"  />
    </Box>


    <Text
        font="/fonts/wallpoet.ttf"
        fontSize={0.1}
        color="#444444"
        anchorX="center"
        anchorY="middle"
        textAlign="center"
        position={[-8.2, 1.5, 13.839]}
        rotation={[0, Math.PI, 0]}
      >
        {`full`}
      </Text>
      <Text
        font="/fonts/wallpoet.ttf"
        fontSize={0.1}
        color="#111111"
        anchorX="center"
        anchorY="middle"
        textAlign="center"
        position={[-7.8, 1.5, 13.839]}
        rotation={[0, Math.PI, 0]}
      >
        {`less`}
      </Text>

    <Box
        position={[-8.2, 1.3, 13.82]}
        rotation={[0, 0, 0]}
        args={[.2, .2, .05]}
      >
        <meshStandardMaterial color="#ffffff" emissive="#333333" />
      </Box>
      <Box
        position={[-7.8, 1.3, 13.82]}
        rotation={[0, 0, 0]}
        args={[.2, .2, .05]}
      >
        <meshStandardMaterial color="#dddddd" />
      </Box>
    {/* arcade screen background */}
    <Box position={[-8, 1.3, 13.89]} rotation={[0, 0, 0]} args={[.8, .5, .1]}>
      <meshStandardMaterial color="#ffffff" emissive="#101010" />
    </Box>
    {/* arcade body */}
    <Box position={[-8, 1, 14.1]} rotation={[0, 0, 0]} args={[.85, 2, .5]}>
      <meshStandardMaterial color="#eeeeee" />
    </Box>
    <Box position={[-8, 1, 14.25]} rotation={[0, 0, 0]} args={[.9, 2, .2]}>
      <meshStandardMaterial color="#dddddd" />
    </Box>
    {/* arcade machine top */}
    <Box position={[-8, 2.1, 14]} rotation={[0.5, 0, 0]} args={[1, .5, .8]}>
      <meshStandardMaterial color="#dddddd" />
    </Box>
    <Box position={[-8, 2.02, 14]} rotation={[0.5, 0, 0]} args={[.8, .4, .8]}>
      <meshStandardMaterial color="#eeeeee" />
    </Box>









    {colorCalibrationStarted && (
      <ColorGameLoop 
        hardMode={hardMode}
        onGameEnd={handleGameEnd}
        onCheckSaturation={checkSaturation}
        points={points}
        misses={misses}
      />
    )}
  </>);
};



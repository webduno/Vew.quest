'use client';
import { Box, Text } from '@react-three/drei';
import { PhysicalWall } from './PhysicalWall';
import { useState, useEffect } from 'react';

export const ColorCallibrationArcade = ({ 
  colorCalibrationStarted,
  setColorCalibrationStarted,
  startColorCalibration
}: {
  colorCalibrationStarted: boolean;
  setColorCalibrationStarted: (colorCalibrationStarted: boolean) => void;
  startColorCalibration: () => void; 
}) => {
  const [timer, setTimer] = useState<number>(5);
  const [randomColor, setRandomColor] = useState<string>('#ffffff');
  const [points, setPoints] = useState<number>(0);
  const [misses, setMisses] = useState<number>(0);
  const [currentColorAnswered, setCurrentColorAnswered] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (colorCalibrationStarted && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
        setRandomColor(generateRandomColor());
        setCurrentColorAnswered(false);
      }, 3000);
    } else if (timer === 0) {
      setColorCalibrationStarted(false);
    }
    return () => clearInterval(interval);
  }, [colorCalibrationStarted, timer, setColorCalibrationStarted]);

  const generateRandomColor = () => {
    const hue = Math.random() * 360;
    const saturation = Math.random() * 100;
    const lightness = 50;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  const handleStart = () => {
    startColorCalibration();
    setTimer(5);
    setPoints(0);
    setMisses(0);
    setRandomColor(generateRandomColor());
    setCurrentColorAnswered(false);
  };

  const checkSaturation = (isLess: boolean) => {
    if (!colorCalibrationStarted || currentColorAnswered) return;
    
    const color = randomColor;
    const saturation = parseInt(color.split(',')[1]);
    
    if ((isLess && saturation < 50) || (!isLess && saturation >= 50)) {
      setPoints(prev => prev + 1);
      console.log('Hit! Points:', points + 1);
    } else {
      setMisses(prev => prev + 1);
      console.log('Miss! Misses:', misses + 1);
    }
    setCurrentColorAnswered(true);
  };

  return (<>
    {/* start button */}
    <Box position={[-8, 1, 13.6]} rotation={[0, 0, 0]} args={[.5, .2, .2]}
      onClick={handleStart}
    >
      <meshStandardMaterial color={colorCalibrationStarted ? "#888888" : "#ffdddd"} />
    </Box>




    {/* arcade BOTTOM CONSOLE */}
    <PhysicalWall visible={false} position={[-8, .5, 13.9]} size={[1, 1, 1]} color="#ffcccc" />    
    <Box position={[-8, .5, 13.9]} rotation={[0, 0, 0]} args={[1, 1, 1]}>
      <meshStandardMaterial color="#cccccc" />
    </Box>






    {/* ARCADE BUTTON LEFT */}
    <Text font="/fonts/wallpoet.ttf" fontSize={0.1} color="#444444" 
      anchorX="center" anchorY="middle" textAlign="center"
      position={[-8.2,1.5,13.839]} rotation={[0,Math.PI,0]}
    >
      {`full`}
    </Text>
    <Box position={[-8.2, 1.3, 13.82]} rotation={[0, 0, 0]} 
      args={[.3, .3, .1]}
      onClick={() => colorCalibrationStarted && checkSaturation(false)}
    >
      <meshStandardMaterial color="#ffffff" emissive="#333333"/>
    </Box>

    {/* ARCADE BUTTON RIGHT */}
    <Text font="/fonts/wallpoet.ttf" fontSize={0.1} color="#111111" 
      anchorX="center" anchorY="middle" textAlign="center"
      position={[-7.8,1.5,13.839]} rotation={[0,Math.PI,0]}
    >
      {`less`}
    </Text>
    <Box position={[-7.8, 1.3, 13.82]} rotation={[0, 0, 0]} 
      args={[.3, .3, .1]}
      onClick={() => colorCalibrationStarted && checkSaturation(true)}
    >
      <meshStandardMaterial color="#dddddd" />
    </Box>




    {/* arcade scorescreen */}
    <Text font="/fonts/wallpoet.ttf" fontSize={0.1} color="#222222" 
      anchorX="left" anchorY="middle" textAlign="left"
      position={[-7.65,1.7,13.839]} rotation={[0,Math.PI,0]}
    >
      {`HIT: ${points}\nMISS: ${misses}`}
    </Text>
    <Text font="/fonts/wallpoet.ttf" fontSize={0.1} color="#222222" 
      anchorX="right" anchorY="middle" textAlign="right"
      position={[-8.35,1.7,13.839]} rotation={[0,Math.PI,0]}
    >
      {`${5-timer}/5`}
    </Text>
    <Box position={[-8, 1.7, 13.89]} rotation={[0, 0, 0]} args={[.8, .25, .1]}>
      <meshStandardMaterial color="#ffffff" emissive="#191919" />
    </Box>





    {/* arcade screen background */}
    <Box position={[-8, 1.3, 13.89]} rotation={[0, 0, 0]} args={[.8, .5, .1]}>
      <meshStandardMaterial color="#ffffff" />
    </Box>
    {/* arcade body */}
    <Box position={[-8, 1, 14.1]} rotation={[0, 0, 0]} args={[.9, 2, .5]}>
      <meshStandardMaterial color="#cccccc" />
    </Box>
    {/* arcade machine top */}
    <Box position={[-8, 2.1, 14]} rotation={[0.5, 0, 0]} args={[1, .5, .8]}>
      <meshStandardMaterial color="#cccccc" />
    </Box>




    {!!colorCalibrationStarted && <>
      <pointLight position={[-8, 1.49, 10.5]} 
        intensity={1}
      color={randomColor} />
    </>}
  </>);
};

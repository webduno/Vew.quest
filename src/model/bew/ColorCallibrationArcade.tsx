'use client';
import { Box, Cylinder, Text } from '@react-three/drei';
import { PhysicalWall } from './PhysicalWall';
import { useState, useEffect } from 'react';
import { useBew } from './BewProvider';
import { PhysicalTrigger } from './PhysicalTrigger';
import { useVibeverse } from '@/dom/useVibeverse';

export const ColorCallibrationArcade = ({ 
  colorCalibrationStarted,
  setColorCalibrationStarted,
  startColorCalibration
}: {
  colorCalibrationStarted: boolean;
  setColorCalibrationStarted: (colorCalibrationStarted: boolean) => void;
  startColorCalibration: () => void; 
}) => {
  const { showSnackbar, closeSnackbar, playSoundEffect } = useBew();
  const { updateMindStats } = useVibeverse();
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
      // Update mindStats if points are 4 or more
      if (points >= 4) {
        const savedStats = localStorage.getItem('VB_MINDSTATS');
        const currentStats = savedStats ? JSON.parse(savedStats) : { color: 0 };
        updateMindStats('color', currentStats.color + 1);
      }
    }
    return () => clearInterval(interval);
  }, [colorCalibrationStarted, timer, setColorCalibrationStarted, points, updateMindStats]);

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
    
    // Start the interval immediately
    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
      setRandomColor(generateRandomColor());
      setCurrentColorAnswered(false);
    }, 3000);

    // Clean up the interval when component unmounts or game ends
    return () => clearInterval(interval);
  };

  const checkSaturation = (isLess: boolean) => {
    if (!colorCalibrationStarted || currentColorAnswered) return;
    
    const color = randomColor;
    const saturation = parseInt(color.split(',')[1]);
    
    if ((isLess && saturation < 50) || (!isLess && saturation >= 50)) {
      setPoints(prev => prev + 1);
      playSoundEffect("/sfx/keys.mp3")
      console.log('Hit! Points:', points + 1);
    } else {
      setMisses(prev => prev + 1);
      console.log('Miss! Misses:', misses + 1);
    }
    setCurrentColorAnswered(true);
  };

  return (<>
    <PhysicalTrigger  visible={false}
    color="#ff0000"
    triggerCount={1}
    size={[.8, 2, 1]}
    position={[-8, 1, 13.5]}
    onCollide={() => {
       playSoundEffect("/sfx/colortuto.ogg")
      showSnackbar("Click 'FULL' or 'LESS', if the light color is intese or muted", 'handbook');
      setTimeout(() => {
        closeSnackbar();
      }, 9000);
      
      // tuto start
    }}
    />  




    <PhysicalWall visible={false}
     position={[-8, 2, 9]} size={[2.2, 4, 2.2]} color="#ffcccc" />    
    <group position={[-8, 0, 9]} rotation={[0, 0, 0]}>
      <SummoningCircle />
    </group>



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
    <Text font="/fonts/wallpoet.ttf" fontSize={0.07} color="#222222" 
      anchorX="right" anchorY="middle" textAlign="right"
      position={[-8.38,1.7,13.839]} rotation={[0,Math.PI,0]}
    >
      {`ROUND:\n${5-timer}/5`}
    </Text>
    <Box position={[-8, 1.7, 13.89]} rotation={[0, 0, 0]} args={[.8, .22, .1]}>
      <meshStandardMaterial color="#cccccc"  />
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




    {!!colorCalibrationStarted && <>
      <pointLight position={[-8, 1.49, 9]} 
        intensity={1}
      color={randomColor} />
    </>}
  </>);
};


const SummoningCircle = () => {
  return (<group>

    
<Cylinder args={[1.4, 1.4, 2.5]} position={[0,1.55, 0]}>
      <meshStandardMaterial color="#ffffff" emissive="#101010" 
      side={1}
      />
    </Cylinder>
    
<Cylinder args={[1.45, 1.45, 2.5]} position={[0,1.55, 0]}>
      <meshStandardMaterial color="#ffffff" emissive="#101010" 
      wireframe={true}
      // side={1}
      />
    </Cylinder>
    
    
<Cylinder args={[1.5, 2, 1]} >
      <meshStandardMaterial color="#dddddd"  />
    </Cylinder>
    
    <Cylinder args={[2, 1.5, 1]} position={[0, 3.25, 0]}>
      <meshStandardMaterial color="#ffffff"  />
    </Cylinder>
  </group>
  );
};
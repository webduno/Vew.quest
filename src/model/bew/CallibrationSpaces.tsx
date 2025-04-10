'use client';
import { Box, Text } from '@react-three/drei';
import { StyledWall } from './StyledWall';
import { useState } from 'react';
import { ColorCallibrationArcade } from './ColorCallibrationArcade';
import { SummoningCircle } from './SummoningCircle';
import { PhysicalWall } from './PhysicalWall';


export const CallibrationSpaces = () => {

  const [colorCalibrationStarted, setColorCalibrationStarted] = useState(false)


  const startColorCalibration = () => {
    setColorCalibrationStarted(true)
  }
  
  const [hardMode, setHardMode] = useState(false)
  return (
    <group>

      <StyledWall size={[10, 4, 1]} position={[-8, 1.49, 15]} color="#ffffff" />
      <StyledWall size={[10, 4, 1]} position={[-8, 1.49, 6]} color="#ffffff" />
      <StyledWall size={[1, 4, 8]} position={[-13, 1.49, 10.5]} color="#ffffff" />
      <Box position={[-8.5, 3.6, 10.5]} args={[10, 1, 8]}>
        <meshStandardMaterial color="#ffffff" />
      </Box>


      

      {/* <Text font="/fonts/wallpoet.ttf" fontSize={0.25} color="#444444" 
anchorX="center" anchorY="middle" textAlign="center"
position={[-5,2.5,14.49]} rotation={[0,Math.PI,0]}
>
{`LIGHT`}
</Text>
<Box position={[-5,1,13.9]} rotation={[0,Math.PI,0]} args={[1,2,1]}>
  <meshStandardMaterial color="#cccccc" />
</Box> */}











<Text font="/fonts/wallpoet.ttf" fontSize={0.25} color="#444444" 
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



<PhysicalWall visible={false}
     position={[-8, 2, 9]} size={[2.2, 4, 2.2]} color="#ffcccc" />    
    <group position={[-8, 0, 9]} rotation={[0, 0, 0]}>
      <SummoningCircle hardMode={hardMode} colorCalibrationStarted={colorCalibrationStarted} />
    </group>













{/* <Text font="/fonts/wallpoet.ttf" fontSize={0.25} color="#444444" 
anchorX="center" anchorY="middle" textAlign="center"
position={[-11,2.5,14.49]} rotation={[0,Math.PI,0]}
>
{`SOLID`}
</Text>
<Box position={[-11,1,13.9]} rotation={[0,Math.PI,0]} args={[1,2,1]}>
  <meshStandardMaterial color="#cccccc" />
</Box> */}



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

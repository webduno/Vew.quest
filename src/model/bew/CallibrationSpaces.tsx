'use client';
import { Box, Text } from '@react-three/drei';
import { StyledWall } from './StyledWall';
import { PhysicalWall } from './PhysicalWall';
import { useState } from 'react';


export const CallibrationSpaces = () => {

  const [colorCalibrationStarted, setColorCalibrationStarted] = useState(false)


  const startColorCalibration = () => {
    console.log('start color calibration')
    setColorCalibrationStarted(true)
  }
  
  
  return (
    <group>

      <StyledWall size={[10, 4, 1]} position={[-8, 1.49, 15]} color="#ffffff" />
      <StyledWall size={[10, 4, 1]} position={[-8, 1.49, 6]} color="#ffffff" />
      <StyledWall size={[1, 4, 8]} position={[-13, 1.49, 10.5]} color="#ffffff" />
      <Box position={[-8.5, 3.6, 10.5]} args={[10, 1, 8]}>
        <meshStandardMaterial color="#ffffff" />
      </Box>


      

      <Text font="/fonts/wallpoet.ttf" fontSize={0.25} color="#444444" 
anchorX="center" anchorY="middle" textAlign="center"
position={[-5,2.5,14.49]} rotation={[0,Math.PI,0]}
>
{`LIGHT`}
</Text>
<Box position={[-5,1,13.9]} rotation={[0,Math.PI,0]} args={[1,2,1]}>
  <meshStandardMaterial color="#cccccc" />
</Box>











<Text font="/fonts/wallpoet.ttf" fontSize={0.25} color="#444444" 
anchorX="center" anchorY="middle" textAlign="center"
position={[-8,2.8,14.49]} rotation={[0,Math.PI,0]}
>
{`COLOR`}
</Text>
<PhysicalWall visible={false} position={[-8,.5,13.9]} size={[1,1,1]} color="#ffcccc" />
<Box position={[-8,.5,13.9]} rotation={[0,0,0]} args={[1,1,1]}>
  <meshStandardMaterial color="#cccccc" />
</Box>
{/* start button */}
<Box position={[-8,1,13.6]} rotation={[0,0,0]} args={[.3,.2,.3]}
onClick={() => {
  startColorCalibration()
}}
>
  <meshStandardMaterial color="#ffffff" />
</Box>
<Box position={[-8,1,14.1]} rotation={[0,0,0]} args={[.9,2,.5]}>
  <meshStandardMaterial color="#cccccc" />
</Box>
<Box position={[-8,2.1,14]} rotation={[0.5,0,0]} args={[1,.5,.8]}>
  <meshStandardMaterial color="#cccccc" />
</Box>
{!!colorCalibrationStarted && <>
      <pointLight position={[-8, 1.49, 10.5]} color="#aaaaaa" />
</>}
















<Text font="/fonts/wallpoet.ttf" fontSize={0.25} color="#444444" 
anchorX="center" anchorY="middle" textAlign="center"
position={[-11,2.5,14.49]} rotation={[0,Math.PI,0]}
>
{`SOLID`}
</Text>
<Box position={[-11,1,13.9]} rotation={[0,Math.PI,0]} args={[1,2,1]}>
  <meshStandardMaterial color="#cccccc" />
</Box>



    </group>
  );
};

'use client';
import { Box, Text, Cylinder, Torus } from '@react-three/drei';
import { PhysicalWall } from './PhysicalWall';
import { PhysicalDoor } from './PhysicalDoor';
import { VibeverseContext } from '@/dom/VibeverseProvider';
import { useContext } from 'react';

export const RoomB = () => {
  const { LS_hasFirstKey } = useContext(VibeverseContext)
  return (<>

<RoomBRightDoor />
{/* <RoomBLeftDoor /> */}


{/* <group position={[2, 0, -3.9]} rotation={[0, 0, 0]}>
<Cylinder args={[.38, .38, .2, 16]} position={[0, 0.11, 0]}>
  <meshStandardMaterial color="#999999" />
</Cylinder>
<Torus args={[.42,.1,5]} position={[0, 0.41, 0]} rotation={[Math.PI/2,0,0]} castShadow
scale={[1,1,4]}
>
  <meshStandardMaterial color="#cccccc" />
</Torus>
</group> */}




<Text font="/fonts/wallpoet.ttf" fontSize={0.25} color="#372717" 
anchorX="center" anchorY="middle" textAlign="center"
position={[-2.49,2.6,1]} rotation={[0,Math.PI/2,0]}
>
{`WEBBEW LABS`}
</Text>


<Text fontSize={0.225} color="#343434" 
anchorX="left" anchorY="middle" textAlign="left"
position={[-2.49,1.7,2.2]} rotation={[0,Math.PI/2,0]} font="/fonts/consolas.ttf"
>
{`
  1. Find the key
  2. Callibrate your mind
    2.1. Go to Psionic Zone
    2.2. Enter the codes
  3. Start CRV training
`}
</Text>
{LS_hasFirstKey && <>
<Text fontSize={0.25} color="#171717"  font="/fonts/beanie.ttf"
anchorX="left" anchorY="middle" textAlign="left"
position={[-2.49,.75,1.7]} rotation={[0,Math.PI/2,0]}
>
{`3.x E/Sensory data refinement`}
</Text>
</>}










    {/* LEFT WALL */}
      <PhysicalWall size={[12, 4, 1]} color="#ffffff"
        position={[-3, 2, -9]} rotation={[0, Math.PI / 2, 0]} />
        {/* Bottom Borders */}
    <Box args={[1.1, 0.4, 12.08]} position={[-3, 0, -9]}>
      <meshStandardMaterial color="#cccccc" />
    </Box>






{/* RIGHT WALL */}
      <PhysicalWall color="#ffffff"
        size={[6, 4, 1]}
        position={[3, 2, -6]} rotation={[0, -Math.PI / 2, 0]} />
        <Box args={[1.1, 0.4, 6.08]} position={[3, 0, -6]}>
          <meshStandardMaterial color="#cccccc" />
        </Box>







    {/* landing walls */}
    <group position={[0, 0, 0]} rotation={[0, 0, 0]}>
      <PhysicalWall size={[9, 4, 1]} color="#ffffff"
        position={[-3, 2, 3]} rotation={[0, Math.PI / 2, 0]} />
      <PhysicalWall
        size={[9, 4, 1]} color="#ffffff"
        position={[3, 2, 3]} rotation={[0, -Math.PI / 2, 0]} />
    </group>

    {/* Bottom Borders */}
    <Box args={[1.1, 0.4, 9.1]} position={[3, 0, 3]}>
      <meshStandardMaterial color="#cccccc" />
    </Box>

    <Box args={[1.1, 0.4, 9.1]} position={[-3, 0, 3]}>
      <meshStandardMaterial color="#cccccc" />
    </Box>

  </>);
};








const RoomBLeftDoor = () => {
  return (<>
  
    {/* LEFT DOORS */}
    <group position={[0, 0, 0]} rotation={[0, 0, 0]}>
      {/* real door */}
      <PhysicalDoor size={[1.5, 3, 0.3]} color="#dddddd"
        position={[-2.75, 1.5, -2.25]} rotation={[0, Math.PI / 2, 0]} />
      {/* door knob */}
      <Box position={[-2.6, 1.5, -1.75]} args={[.2, .2, .2]} castShadow>
        <meshStandardMaterial color="#aaaaaa" />
      </Box>
    </group>
  </>)
}


const RoomBRightDoor = () => {
  return (<>
  
  <Box args={[2, 3, 0.3]} 
      position={[3.1, 1.5, -2.25]} rotation={[0, Math.PI / 2, 0]}
      castShadow
      >
      <meshStandardMaterial color="#cccccc" />
      </Box>
  <group position={[0, 0, 0]} rotation={[0, 0, 0]}>
      {/* real door */}
      <PhysicalDoor size={[1.5, 3, 0.3]} color="#dddddd"
        position={[2.75, 1.5, -2.25]} rotation={[0, Math.PI / 2, 0]} />
      {/* door knob */}
      <Box position={[2.6, 1.5, -2.75]} args={[.2, .2, .2]} castShadow>
        <meshStandardMaterial color="#aaaaaa" />
      </Box>
    </group>
  </>)
}

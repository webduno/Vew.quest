'use client';
import { Box, Text } from '@react-three/drei';
import { SolidBox } from '../core/SolidBox';
import { usePlayerStats } from '../../../script/contexts/hook/usePlayerStats';

export const MainHallway = () => {
  const { LS_hasFirstKey, LS_lowGraphics } = usePlayerStats()
  return (<>

<OutOfServiceDoor />



     
{/* fill light */}
{!LS_lowGraphics && (
<pointLight position={[0, 2.5, 3-1.25]} intensity={.5} 
  color="#f7fff0" distance={6}
 />
 )}


<Text font="/fonts/wallpoet.ttf" fontSize={0.25} color="#372717" 
anchorX="center" anchorY="middle" textAlign="center"
position={[-2.49,2.6,1]} rotation={[0,Math.PI/2,0]}
>
{`WEB|BEW LABS`}
</Text>


{!LS_hasFirstKey && <>
  <Text fontSize={0.225} color="#5a5a5a" 
anchorX="left" anchorY="top" textAlign="left"
position={[-2.49,2.5,2.2]} rotation={[0,Math.PI/2,0]} font="/fonts/consolas.ttf"
>
{`
  1. Find the key 
  1.1. Open wooden door

  2. Callibrate your mind

  3. ???
  3.1. Profit

`}
</Text>
</>}

{LS_hasFirstKey && <>
  <Text fontSize={0.225} color="#5a5a5a" 
anchorX="left" anchorY="top" textAlign="left"
position={[-2.49,2.5,2.2]} rotation={[0,Math.PI/2,0]} font="/fonts/consolas.ttf"
>
{`
  1. Find the key ✔
  1.1. Open wooden door
  2. Callibrate your mind
    2.1. Go to Psionic Zone
  3. Enter the codes
`}
</Text>
<Text fontSize={0.25} color="#171717"  font="/fonts/beanie.ttf"
anchorX="left" anchorY="top" textAlign="left"
position={[-2.49,.9,1.7]} rotation={[0,Math.PI/2,0]}
>
{`3.x E/Sensory data refinement`}
</Text>
</>}










    {/* LEFT WALL */}
      <SolidBox size={[12, 4, 1]} color="#ffffff"
        position={[-3, 2, -9]} rotation={[0, Math.PI / 2, 0]} />
        {/* Bottom Borders */}
    <Box args={[1.1, 0.4, 12.08]} position={[-3, 0, -9]}>
      <meshStandardMaterial color="#cccccc" />
    </Box>






{/* RIGHT WALL */}
      <SolidBox color="#ffffff"
        size={[6, 4, 1]}
        position={[3, 2, -6]} rotation={[0, -Math.PI / 2, 0]} />
        <Box args={[1.1, 0.4, 6.08]} position={[3, 0, -6]}>
          <meshStandardMaterial color="#cccccc" />
        </Box>







    {/* landing walls */}
    <group position={[0, 0, 0]} rotation={[0, 0, 0]}>
      <SolidBox size={[9, 4, 1]} color="#ffffff"
        position={[-3, 2, 3]} rotation={[0, Math.PI / 2, 0]} />
      <SolidBox
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









const OutOfServiceDoor = () => {
  return (<>
  <Text fontSize={0.25} color="#343434"  font="/fonts/consolas.ttf"
  anchorX="center" anchorY="middle" textAlign="center"
  position={[2.5,2.2,-2.25]} rotation={[0, -Math.PI / 2, 0]}
  >
{`OUT OF
SERVICE`}
  </Text>
  <Box args={[2, 3, 0.3]} 
      position={[3.1, 1.5, -2.25]} rotation={[0, Math.PI / 2, 0]}
      castShadow
      >
      <meshStandardMaterial color="#cccccc" />
      </Box>
  <group position={[0, 0, 0]} rotation={[0, 0, 0]}>
      {/* real door */}
      <SolidBox size={[1.5, 3, 0.3]} color="#dddddd" castShadow={false}
        position={[2.75, 1.5, -2.25]} rotation={[0, Math.PI / 2, 0]} />
      {/* door knob */}
      <Box position={[2.6, 1.5, -2.75]} args={[.2, .2, .2]} castShadow>
        <meshStandardMaterial color="#aaaaaa" />
      </Box>
    </group>
  </>)
}

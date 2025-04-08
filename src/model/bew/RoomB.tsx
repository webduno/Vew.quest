'use client';
import { Box, Text, Cylinder, Torus } from '@react-three/drei';
import { PhysicalWall } from './PhysicalWall';
import { PhysicalDoor } from './PhysicalDoor';


export const RoomB = () => {
  return (<>

<RoomBRightDoor />
{/* <RoomBLeftDoor /> */}


<PhysicalWall size={[.7, .8, .7]} color="#ffffff" visible={false}
position={[-1.9, 0.4, 3.9]} />
<group position={[-1.9, 0, 3.9]} rotation={[0, 0, 0]}>
<Cylinder args={[.38, .38, .2, 16]} position={[0, 0.11, 0]}>
  <meshStandardMaterial color="#999999" />
</Cylinder>
<Torus args={[.42,.1,5]} position={[0, 0.41, 0]} rotation={[Math.PI/2,0,0]} castShadow
scale={[1,1,4]}
>
  <meshStandardMaterial color="#cccccc" />
</Torus>
</group>
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
  
<Text 
color="#333333" anchorX="center" anchorY="middle" position={[2.91, 2.65, -2.25]}
rotation={[0,Math.PI/2,0.1]} fontSize={0.10} font={"/fonts/beanie.ttf"}
>
{`
CODE3: GONDOLAWISH
        _________


        |@@@
mcmonagle.pdf
989.333 BCE`}
</Text>
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

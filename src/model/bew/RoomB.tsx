'use client';
import { Box } from '@react-three/drei';
import { PhysicalWall } from './PhysicalWall';
import { PhysicalDoor } from './PhysicalDoor';


export const RoomB = () => {
  return (<>


    {/* RIGHT DOORS */}
    <group position={[0, 0, 0]} rotation={[0, 0, 0]}>
      <Box args={[2, 3, 0.3]} 
      position={[3.1, 1.5, -2.25]} rotation={[0, Math.PI / 2, 0]}
      castShadow
      >
      <meshStandardMaterial color="#cccccc" />
      </Box>
      {/* real door */}
      <PhysicalDoor size={[1.5, 3, 0.3]} color="#dddddd"
        position={[-2.75, 1.5, -2.25]} rotation={[0, Math.PI / 2, 0]} />
      {/* door knob */}
      <Box position={[-2.6, 1.5, -1.75]} args={[.2, .2, .2]} castShadow>
        <meshStandardMaterial color="#aaaaaa" />
      </Box>
    </group>

    <group position={[0, 0, 0]} rotation={[0, 0, 0]}>
      {/* real door */}
      <PhysicalDoor size={[1.5, 3, 0.3]} color="#dddddd"
        position={[2.75, 1.5, -2.25]} rotation={[0, Math.PI / 2, 0]} />
      {/* door knob */}
      <Box position={[2.6, 1.5, -2.75]} args={[.2, .2, .2]} castShadow>
        <meshStandardMaterial color="#aaaaaa" />
      </Box>
    </group>




    {/* ROOM B */}
    <group position={[0, 0, 0]} rotation={[0, 0, 0]}>
      <PhysicalWall size={[12, 4, 1]} color="#ffffff"
        position={[-3, 2, -9]} rotation={[0, Math.PI / 2, 0]} />
      <PhysicalWall color="#ffffff"
        size={[12, 4, 1]}
        position={[3, 2, -9]} rotation={[0, -Math.PI / 2, 0]} />
    </group>
    {/* Bottom Borders */}
    <Box args={[1.1, 0.4, 12.08]} position={[3, 0, -9]}>
      <meshStandardMaterial color="#cccccc" />
    </Box>

    <Box args={[1.1, 0.4, 12.08]} position={[-3, 0, -9]}>
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

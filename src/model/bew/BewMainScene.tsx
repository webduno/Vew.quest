'use client';
import { Box } from '@react-three/drei';
import { PhysicalCeiling, PhysicalFloor } from './PhysicalFloor';
import { PhysicalWall } from './PhysicalWall';
import { ABDoorPortals } from './ABDoorPortals';
import { RoomB } from './RoomB';
import { RoomA } from './RoomA';
import { BCDoorPortals } from './BCDoorPortals';
import { CDDoorPortals } from './CDDoorPortals';
import { RoomC } from './RoomC';
import { RoomRight } from './RoomRight';
import { RoomLeft } from './RoomLeft';

export const BewMainScene = ({ setPlayerPosition }: { setPlayerPosition: (position: [number, number, number]) => void }) => {

  return (
    <group position={[0, 0, 0]}>

      
      
      <RoomA />

      <RoomB />
      
      <RoomC setPlayerPosition={setPlayerPosition} />  

      <RoomRight />
      <RoomLeft />

      <ABDoorPortals setPlayerPosition={setPlayerPosition} />
      <BCDoorPortals setPlayerPosition={setPlayerPosition} />
      <CDDoorPortals setPlayerPosition={setPlayerPosition} />
      










  
      {/* top bevels */}
      <group position={[0, 0, 0]} rotation={[0, 0, 0]}>
        {/* left bevel */}
        <PhysicalWall  size={[30.5, 1, 1.2]} color="#f7f7f7"
        position={[-3, 3.5, 0]} rotation={[0, Math.PI / 2, 0]} />
        {/* right bevel */}
        <PhysicalWall 
          size={[30.5, 1, 1.2]} color="#f7f7f7"
          position={[3, 3.5, 0]} rotation={[0, -Math.PI / 2, 0]} 
        />
        {/* outer right bevel */}
        <PhysicalWall 
          size={[30.5, 1, 1.2]} color="#f7f7f7"
          position={[9, 3.5, 0]} rotation={[0, -Math.PI / 2, 0]} 
        />
      </group>     
      
      {/* CEILING */}
      <Box args={[20, 1, 60]} position={[0, 4, -14]}>
        <meshStandardMaterial color="#ffffff" />
      </Box>
      <PhysicalFloor />
      <PhysicalCeiling />

    </group>
  );
};



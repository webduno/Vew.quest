'use client';
import { Box, Text } from '@react-three/drei';
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
import { useState, useEffect, useCallback } from 'react';


export const BewMainScene = ({ setPlayerPosition, codes }: { setPlayerPosition: (position: [number, number, number]) => void, codes: string[]  }) => {

  const [hasFirstKey, setHasFirstKey] = useState(false);
  
  // Add effect to monitor key state changes
  useEffect(() => {
    console.log('BewMainScene: hasFirstKey is now', hasFirstKey);
  }, [hasFirstKey]);
  
  // Memoize the handler with useCallback to prevent recreation
  const handleKeyCollection = useCallback((value: boolean) => {
    console.log('Setting hasFirstKey to:', value);
    setHasFirstKey(value);
  }, []);

  return (
    <group position={[0, 0, 0]}>

      
      
      <RoomA />

      <RoomB />
      
      <RoomC setPlayerPosition={setPlayerPosition} />  

      <RoomRight />
      <RoomLeft />

      <ABDoorPortals setPlayerPosition={setPlayerPosition} hasFirstKey={hasFirstKey} setHasFirstKey={handleKeyCollection} />

{/* <BCDoorPortals setPlayerPosition={setPlayerPosition} /> */}
      <CDDoorPortals codes={codes} setPlayerPosition={setPlayerPosition} />
      










  
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



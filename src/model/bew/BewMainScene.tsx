'use client';
import { Box, Cylinder, Text } from '@react-three/drei';
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
import { BewPortal } from '../portal/BewPortal';
import { useSearchParams } from 'next/navigation';


export const BewMainScene = ({ setPlayerPosition,formatPortalUrl,
  code1,
  code2,
  code3 }: { setPlayerPosition: (position: [number, number, number]) => void, 
    formatPortalUrl: (url: string) => string,
    code1?: string, 
    code2?: string, 
    code3?: string  }) => {

      const vb_ref = useSearchParams().get("ref")

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

    {/* VIBEVERSE PORTAL */}
    <Cylinder args={[3, 2, .9, 12, Math.PI]} 
    position={[-3.5,0,1.9]} rotation={[0,0,-Math.PI/2]}>
      <meshStandardMaterial color="#ffffff" />
    </Cylinder>
    <BewPortal
    position={[-4,0,1.9]}
    rotation={[0,-Math.PI/2,0]}
    title="Vibeverse"
    url={formatPortalUrl("https://portal.pieter.com/")}
    portalRadius={2}
    textColor="#333333"
    portalMaterial={<meshStandardMaterial color="#eeffcc" />}
    />

    {/* BACK PORTAL */}
    {/* <Cylinder args={[3.3, 2, .9, 12, Math.PI]} 
    position={[2,0,1.9]} rotation={[0,0,-Math.PI/2]}>
      <meshStandardMaterial color="#eeeeee" />
    </Cylinder> */}
    {vb_ref && <BewPortal
    position={[2.4,0,1.5]}
    rotation={[0,-Math.PI/2,0]}
    title={vb_ref.split("/").pop()}
    url={formatPortalUrl(vb_ref)}
    portalRadius={1.8}
    textColor="#777777"
    portalMaterial={<meshStandardMaterial color="#ffaaaa" />}
    />}




  {/* <SmallPortal
  position={[0,0,-2]}
  rotation={[0,0,0]}
  url="/"
  /> */}

      
      <RoomA />

      <RoomB />
      
      <RoomC setPlayerPosition={setPlayerPosition} />  

      <RoomRight />
      <RoomLeft />

      <ABDoorPortals setPlayerPosition={setPlayerPosition} hasFirstKey={hasFirstKey} setHasFirstKey={handleKeyCollection} />

      <BCDoorPortals setPlayerPosition={setPlayerPosition} />
      <CDDoorPortals code1={code1} code2={code2} code3={code3} setPlayerPosition={setPlayerPosition} />
      










  
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



'use client';
import { Box, Cylinder, Text } from '@react-three/drei';
import { PhysicalCeiling, PhysicalFloor } from './PhysicalFloor';
import { PhysicalWall } from './PhysicalWall';
import { ABDoorPortals } from './ABDoorPortals';
import { RoomB } from '../rooms/RoomB';
import { RoomA } from '../rooms/RoomA';
import { BCDoorPortals } from './BCDoorPortals';
import { CDDoorPortals } from './CDDoorPortals';
import { RoomC } from '../rooms/RoomC';
import { RoomRight } from '../rooms/RoomRight';
import { RoomLeft } from '../rooms/RoomLeft';
import { useState, useEffect, useCallback, useContext } from 'react';
import { BewPortal } from '../portal/BewPortal';
import { useSearchParams } from 'next/navigation';
import { ZuckHead } from './ZuckHead';
import { CallibrationSpaces } from './CallibrationSpaces';
import { useVibeverse } from '@/../scripts/hooks/useVibeverse';

export const BewMainScene = ({ setPlayerPosition,
  code1,
  code2,
  code3 }: { setPlayerPosition: (position: [number, number, number]) => void, 
    code1?: string, 
    code2?: string, 
    code3?: string  }) => {

  const { LS_playerId, LS_lowGraphics, hasExploredZone, formatPortalUrl, LS_hasFirstKey, setHasFirstKey } =  useVibeverse()
  const vb_ref = useSearchParams().get("ref")
  // const { hasExploredZone } = useVibeverse();

  // Memoize the handler with useCallback to prevent recreation
  const handleKeyCollection = useCallback((value: boolean) => {
    setHasFirstKey(value);
  }, [setHasFirstKey]);

  return (
    <group position={[0, 0, 0]}>

    {/* VIBEVERSE PORTAL */}
    {/* <Cylinder args={[3, 2, .9, 12, Math.PI]} 
    position={[-3.5,0,1.9]} rotation={[0,0,-Math.PI/2]}>
      <meshStandardMaterial color="#ffffff" />
    </Cylinder>
    <BewPortal fontSize={0.5}
    position={[-4,0,1.9]}
    rotation={[0,-Math.PI/2,0]}
    title="portal.pieter.com"
    url={formatPortalUrl("https://portal.pieter.com/")}
    portalRadius={2}
    textColor="#333333"

    portalMaterial={<meshStandardMaterial color="#eeffcc" />}
    /> */}

{(!!vb_ref || hasExploredZone('psionic_asset_zone')) && <>
<group position={[4.6, 2, 4.25]} rotation={[0,0,0]}>
  <Text fontSize={0.1} color="#404040" position={[0.1,-.2,0.249]}
  font="/fonts/beanie.ttf"
  rotation={[0,Math.PI,0]}
  >
    {`Cydonia Valleys

40.75° North
350.54° East`}
  </Text>
  <ZuckHead />
</group>
</>}

    {/* BACK PORTAL */}
    {!!vb_ref && <BewPortal fontSize={0.5}
    position={[2.4,0,1.5]}
    rotation={[0,-Math.PI/2,0]}
    title={vb_ref.split("/").pop()}
    url={formatPortalUrl(vb_ref)}
    portalRadius={2}
    textColor="#777777"
    portalMaterial={<meshStandardMaterial color="#ffaaaa" />}
    />}





      <CallibrationSpaces />
      
      <RoomA />

      <RoomB />
      
      <RoomC setPlayerPosition={setPlayerPosition} />  

      <RoomRight />
      <RoomLeft />

      <ABDoorPortals setPlayerPosition={setPlayerPosition} hasFirstKey={LS_hasFirstKey} setHasFirstKey={handleKeyCollection} />

      <BCDoorPortals setPlayerPosition={setPlayerPosition} />
      










  
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
      

    </group>
  );
};



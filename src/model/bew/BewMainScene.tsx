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
import { useState, useEffect, useCallback, useContext } from 'react';
import { BewPortal } from '../portal/BewPortal';
import { useSearchParams } from 'next/navigation';
import { useVibeverse } from '@/dom/useVibeverse';
import { VibeverseContext } from '@/dom/VibeverseProvider';


export const BewMainScene = ({ setPlayerPosition,
  code1,
  code2,
  code3 }: { setPlayerPosition: (position: [number, number, number]) => void, 
    code1?: string, 
    code2?: string, 
    code3?: string  }) => {

  const { LS_playerId, LS_lowGraphics, formatPortalUrl } = useContext(VibeverseContext)
  const vb_ref = useSearchParams().get("ref")

  const [hasFirstKey, setHasFirstKey] = useState(false);
  
  
  // Memoize the handler with useCallback to prevent recreation
  const handleKeyCollection = useCallback((value: boolean) => {
    setHasFirstKey(value);
  }, []);

  return (
    <group position={[0, 0, 0]}>

    {/* VIBEVERSE PORTAL */}
    <Cylinder args={[3, 2, .9, 12, Math.PI]} 
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
    />

    {/* BACK PORTAL */}
    {vb_ref && <BewPortal fontSize={0.5}
    position={[2.4,0,1.5]}
    rotation={[0,-Math.PI/2,0]}
    title={vb_ref.split("/").pop()}
    url={formatPortalUrl(vb_ref)}
    portalRadius={2}
    textColor="#777777"
    portalMaterial={<meshStandardMaterial color="#ffaaaa" />}
    />}



<Text font="/fonts/wallpoet.ttf" fontSize={0.25} color="#372717" 
anchorX="center" anchorY="middle" textAlign="center"
position={[-2.49,2.6,0.8]} rotation={[0,Math.PI/2,0]}
>
{`WEBBEW LABS`}
</Text>


<Text fontSize={0.25} color="#343434" 
anchorX="left" anchorY="middle" textAlign="left"
position={[-2.49,1.82,1.75]} rotation={[0,Math.PI/2,0]}
>
{`
  1. Find the key
    1.1. Go to training zone
  2. Enter the codes
  3. Start CRV training
`}
</Text>

<Text fontSize={0.25} color="#171717"  font="/fonts/beanie.ttf"
anchorX="left" anchorY="middle" textAlign="left"
position={[-2.49,.8,1.45]} rotation={[0,Math.PI/2,0]}
>
{`3.x E/Sensory data refinement`}
</Text>





      
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
      <PhysicalFloor lowGraphics={LS_lowGraphics} />
      <PhysicalCeiling />

    </group>
  );
};



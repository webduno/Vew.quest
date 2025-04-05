'use client';

import { Box } from '@react-three/drei';
import { useRef, useEffect, useState } from 'react';
export const BewLighting = () => {
  const spotLightTarget1 = useRef<any>(null);
  const spotLightTarget2 = useRef<any>(null);
  const spotLightTarget3 = useRef<any>(null);
  const [targetsReady, setTargetsReady] = useState(false);

  useEffect(() => {
    if (spotLightTarget1.current && spotLightTarget2.current) {
      setTargetsReady(true);
    }
  }, []);

  return (<>
    <ambientLight intensity={0.25} />

    <group ref={spotLightTarget1} position={[0, 0, 8.5]} >
      <Box args={[0.4,0.1,0.2]} position={[0,3.5,0]} >
        <meshStandardMaterial color="#e0f7ff" emissive="#a0c7ff" />
      </Box>
    </group>
    <group ref={spotLightTarget2} position={[0, 0, -2.25]} >
      <Box args={[0.4,0.1,0.2]} position={[0,3.5,0]} >
        <meshStandardMaterial color="#ffffff" emissive="#ffc7a0" />
      </Box>
    </group>
    <group ref={spotLightTarget3} position={[0, 0, -22]}>
      <Box args={[0.4,0.1,0.2]} position={[0,3.5,0]} >
        <meshStandardMaterial color="#ffffff" emissive="#a0ffc7" />
      </Box>
    </group>

    {targetsReady && (
      <>
      <spotLight position={[0, 3, -22]}
        angle={1.5}
        penumbra={1}
        intensity={50}
        color="#f7ffe7" castShadow
        target={spotLightTarget3.current}
      />
  
        <spotLight 
          position={[0, 3.3, 8.5]} 
          angle={1.6} 
          
          color="#e0f7ff"
          penumbra={1} 
          intensity={10} 
          castShadow 
          target={spotLightTarget1.current} 
        />

        <spotLight 
          position={[0, 3.3, -2.25]} 
          angle={1.6} 
          
          color="#fff7e7"
          penumbra={1} 
          intensity={10} 
          castShadow 
          target={spotLightTarget2.current} 
        />
      </>
    )}
  </>);
};

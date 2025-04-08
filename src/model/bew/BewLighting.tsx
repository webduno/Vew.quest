'use client';

import { VibeverseContext } from '@/dom/VibeverseProvider';
import { Box } from '@react-three/drei';
import { useRef, useEffect, useState, useContext } from 'react';
export const BewLighting = () => {
  const { LS_lowGraphics } = useContext(VibeverseContext)
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
    <ambientLight intensity={0.1} />


    <group ref={spotLightTarget2} position={[0, 0, 2]} >
      <Box args={[0.1,0.06,1]} position={[5,3.5,0]} >
        <meshStandardMaterial color="#ffffff" emissive="#ffc7a0" />
      </Box>
    </group>



    {/* ROOM RIGHT */}
    <pointLight position={[5, 3, 2]} intensity={3} color="#ffe7c0"
    castShadow
     />
     {!LS_lowGraphics && (
      <pointLight position={[6, 3, -8]} intensity={0.3} color="#f7e7ff"
    castShadow
     />
     )}
    

    {/* ROOM A */}
    <group ref={spotLightTarget1} position={[0, 0, 8.5]} >
      <Box args={[1,0.06,0.1]} position={[0,3.5,0]} >
        <meshStandardMaterial color="#e0f7ff" emissive="#a0c7ff" />
      </Box>
    </group>
    {/* ROOM B */}
    <group ref={spotLightTarget2} position={[0, 0, -1.25]} >
    <pointLight position={[0, 2.5, 3]} intensity={.5} 
      color="#f7fff0" 
     />
    
      <Box args={[1,0.06,0.1]} position={[0,3.5,-1]} >
        <meshStandardMaterial color="#ffffff" emissive="#e7ffc0" />
      </Box>
      <Box args={[1,0.06,0.1]} position={[0,3.5,3]} >
        <meshStandardMaterial color="#ffffff" emissive="#e7ffc0" />
      </Box>
    </group>
    {/* ROOM C */}
    <group ref={spotLightTarget3} position={[0, 0, -22]}>
    <pointLight position={[0, 2, 14]} intensity={1}  castShadow
      color="#fff7f0" 
     />
     <Box args={[1,0.06,0.1]} position={[0,3.5,14]} >
       <meshStandardMaterial color="#ffffff" emissive="#7f7770" />
     </Box>
      <Box args={[1,0.06,0.1]} position={[0,3.5,0]} >
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

'use client';

import { VibeverseContext } from '@/dom/VibeverseProvider';
import { Box } from '@react-three/drei';
import { useRef, useEffect, useState, useContext } from 'react';
import { MeshStandardMaterial } from 'three';

// Create shared materials to reduce draw calls
const whiteEmissiveMaterial = new MeshStandardMaterial({ 
  color: "#ffffff", 
  emissive: "#ffc7a0" 
});

const blueEmissiveMaterial = new MeshStandardMaterial({ 
  color: "#e0f7ff", 
  emissive: "#a0c7ff" 
});

const greenEmissiveMaterial = new MeshStandardMaterial({ 
  color: "#ffffff", 
  emissive: "#e7ffc0" 
});

const grayEmissiveMaterial = new MeshStandardMaterial({ 
  color: "#ffffff", 
  emissive: "#7f7770" 
});

const lightGreenEmissiveMaterial = new MeshStandardMaterial({ 
  color: "#ffffff", 
  emissive: "#a0ffc7" 
});

export const BewLighting = ({ 
  showWhiteMirror = false 
 }) => {
  const { LS_lowGraphics } = useContext(VibeverseContext)
  const spotLightTarget1 = useRef<any>(null);
  const spotLightTarget2 = useRef<any>(null);
  const spotLightTarget3 = useRef<any>(null);
  const [targetsReady, setTargetsReady] = useState(false);

  useEffect(() => {
    if (spotLightTarget1.current && spotLightTarget2.current && spotLightTarget3.current) {
      setTargetsReady(true);
    }
  }, []);

  return (<>
    <ambientLight intensity={0.1} />

    <group ref={spotLightTarget2} position={[0, 0, 2]} >
      <Box args={[0.1,0.06,1]} position={[5,3.5,0]} material={whiteEmissiveMaterial} />
    </group>

    
    {/* ROOM A */}
    <group ref={spotLightTarget1} position={[0, 0, 8.5]} >
      <Box args={[1,0.06,0.1]} position={[0,3.5,0]} material={blueEmissiveMaterial} />
    </group>
    {/* ROOM B */}

    <group ref={spotLightTarget2} position={[0, 0, -1.25]} >
      
    
      <Box args={[1,0.06,0.1]} position={[0,3.5,-1]} material={greenEmissiveMaterial} />
      <Box args={[1,0.06,0.1]} position={[0,3.5,3]} material={greenEmissiveMaterial} />
    </group>


    {/* ROOM C */}
    <group ref={spotLightTarget3} position={[0, 0, -22]}>
    </group>


    
    
    {!showWhiteMirror && <>

    <pointLight position={[5, 3, 2]} intensity={3} color="#ffe7c0"
    castShadow
     />
     {!LS_lowGraphics && (
      <pointLight position={[6, 3, -8]} intensity={0.3} color="#f7e7ff"
    castShadow
     />
     )}
    {!LS_lowGraphics && (
    <pointLight position={[0, 2.5, 3-1.25]} intensity={.5} 
      color="#f7fff0" 
     />
     )}
      <pointLight position={[0, 2, 14-22]} intensity={1}  castShadow
        color="#fff7f0" 
       />
</>}



    <group ref={spotLightTarget3} position={[0, 0, -22]}>
    <Box args={[1,0.06,0.1]} position={[0,3.5,14]} material={grayEmissiveMaterial} />
      <Box args={[1,0.06,0.1]} position={[0,3.5,0]} material={lightGreenEmissiveMaterial} />
    </group>

    {targetsReady && (
      <>
      {
      // !showWhiteMirror && 
      (
        <spotLight position={[0, 3, -23]}
        angle={1.5}
        penumbra={1}
        intensity={50}
        color="#f7ffe7" castShadow
        target={spotLightTarget3.current}
      />
      )}
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

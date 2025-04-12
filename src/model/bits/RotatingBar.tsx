'use client';
import { Torus } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Group } from 'three';



export const RotatingBar = () => {
  const barRef = useRef<Group>(null);

  useFrame(() => {
    if (!barRef.current) { return; }

    barRef.current.rotation.z += 0.25;
  });

  return (<>
    <pointLight position={[0, 0, 1]} intensity={0.5} distance={5} color="#00aa00" />
    <group position={[0, 0, 0]} rotation={[0, 0, 0]} ref={barRef}>
      <Torus args={[.7, .02, 3, 16, Math.PI]}>
        <meshStandardMaterial color="#00aa00" />
      </Torus>
      {/* <Box args={[.05,1,0.05]} position={[0,0,0]}>
          <meshStandardMaterial color="#00ff00"   />
        </Box> */}
    </group>
  </>);
};

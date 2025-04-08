'use client';
import { Box, Cylinder, Sphere } from '@react-three/drei';
import { useContext } from 'react';
import { VibeverseContext } from '@/dom/VibeverseProvider';

export const PersonSilhouette = () => {
  const { LS_lowGraphics } = useContext(VibeverseContext);
  return (<>
  <Box position={[0, 1.85, .185]} args={[.3, .1, .1]} >
    <meshStandardMaterial color="#777777" />
  </Box>
    <Sphere position={[0, 1.8, 0]} args={[.25, 8, 8]} castShadow={!LS_lowGraphics}>
      <meshStandardMaterial color="#bbbbbb" />
    </Sphere>
    <Cylinder position={[0, 0.8, 0]} args={[.5, .25, 1.6, 8]} castShadow={!LS_lowGraphics}
    scale={[1, 1, .25]}
    >
      <meshStandardMaterial color="#bbbbbb" />
    </Cylinder>
  </>);
};

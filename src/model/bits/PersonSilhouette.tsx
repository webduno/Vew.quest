'use client';
import { Box, Cylinder, Sphere } from '@react-three/drei';


export const PersonSilhouette = () => {
  return (<>
  <Box position={[0, 1.85, .185]} args={[.3, .1, .1]} >
    <meshStandardMaterial color="#777777" />
  </Box>
    <Sphere position={[0, 1.8, 0]} args={[.25, 8, 8]} castShadow>
      <meshStandardMaterial color="#bbbbbb" />
    </Sphere>
    <Cylinder position={[0, 0.8, 0]} args={[.5, .25, 1.6, 8]} castShadow
    scale={[1, 1, .25]}
    >
      <meshStandardMaterial color="#bbbbbb" />
    </Cylinder>
  </>);
};

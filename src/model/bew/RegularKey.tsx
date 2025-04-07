'use client';
import { Cylinder, Box } from '@react-three/drei';



export const RegularKey = () => {
  return (<>
    <Cylinder args={[0.3, 0.3, 0.12]} position={[0, 0, .5]}>
      <meshStandardMaterial color="#ffaa33" emissive="#443300" />
    </Cylinder>
    <Box position={[0, 0, 0]} args={[0.2, 0.1, 1]}>
      <meshStandardMaterial color="#ffaa33" emissive="#443300" />
    </Box>
  </>);
};

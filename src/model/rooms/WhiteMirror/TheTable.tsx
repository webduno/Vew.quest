'use client';
import { Box } from '@react-three/drei';



export const TheTable = () => {
  return (
    <group position={[0, 0, 0]}>

      {/* table top  */}
      <Box args={[3, .2, 2]} castShadow receiveShadow
        position={[0, .81, 0]}>
        <meshStandardMaterial color="#eeeeee" />
      </Box>
      {/* table legs */}
      <Box args={[.18, 1, .18]} castShadow
        position={[-1.2, 0.4, -0.9]}>
        <meshStandardMaterial color="#eeeeee" />
      </Box>
      <Box args={[.18, 1, .18]} castShadow
        position={[1.2, 0.4, -0.9]}>
        <meshStandardMaterial color="#eeeeee" />
      </Box>
      <Box args={[.18, 1, .18]} castShadow
        position={[-1.2, 0.4, 0.9]}>
        <meshStandardMaterial color="#eeeeee" />
      </Box>
      <Box args={[.18, 1, .18]} castShadow
        position={[1.2, 0.4, 0.9]}>
        <meshStandardMaterial color="#eeeeee" />
      </Box>
    </group>
  );
};

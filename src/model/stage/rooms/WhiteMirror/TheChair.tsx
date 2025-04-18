'use client';
import { Box } from '@react-three/drei';


export const TheChair = ({ position = [0, 0, 0] }: { position?: [number, number, number]; }) => {
  return (
    <group position={position}>
      {/* seat */}
      <Box args={[1, 0.1, 1]} castShadow
        position={[0, 0.6, 0]}>
        <meshStandardMaterial color="#dddddd" />
      </Box>
      {/* backrest */}
      <Box args={[.9, 1, 0.1]} castShadow
        position={[0, 1, 0.5]}>
        <meshStandardMaterial color="#dddddd" />
      </Box>
      {/* chair legs */}
      <Box args={[0.1, 0.5, 0.1]} castShadow
        position={[-0.4, 0.3, -0.4]}>
        <meshStandardMaterial color="#dddddd" />
      </Box>
      <Box args={[0.1, 0.5, 0.1]} castShadow
        position={[0.4, 0.3, -0.4]}>
        <meshStandardMaterial color="#dddddd" />
      </Box>
      <Box args={[0.1, 0.5, 0.1]} castShadow
        position={[-0.4, 0.3, 0.4]}>
        <meshStandardMaterial color="#dddddd" />
      </Box>
      <Box args={[0.1, 0.5, 0.1]} castShadow
        position={[0.4, 0.3, 0.4]}>
        <meshStandardMaterial color="#dddddd" />
      </Box>
    </group>
  );
};

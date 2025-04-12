'use client';
import { Box } from '@react-three/drei';
import { PhysicalWall } from '../core/PhysicalWall';

interface BewPreMainSceneProps {
  setPlayerPosition?: (position: [number, number, number]) => void;
}

export const RoomC = ({ setPlayerPosition }: BewPreMainSceneProps = {}) => {
  return (
    <group position={[0, 0, 0]}>



<PhysicalWall color="#ffffff"
        size={[3.5, 4, 1]}
        position={[3, 2, -13]} rotation={[0, -Math.PI / 2, 0]} />
        <Box args={[1.1, 0.4, 3.58]} position={[3, 0, -13]}>
          <meshStandardMaterial color="#cccccc" />
        </Box>













    </group>
  );
};

'use client';
import { Box } from '@react-three/drei';
import { PhysicalWall } from './PhysicalWall';
import { PhysicalTrigger } from './PhysicalTrigger';

interface BewPreMainSceneProps {
  setPlayerPosition?: (position: [number, number, number]) => void;
}

export const RoomC = ({ setPlayerPosition }: BewPreMainSceneProps = {}) => {
  return (
    <group position={[0, 0, 0]}>
















    </group>
  );
};

'use client';
import { Cylinder, Sphere } from '@react-three/drei';

interface TreeProps {
  position?: [number, number, number];
  scale?: number;
  trunkColor?: string;
  foliageColor?: string;
  trunkHeight?: number;
  trunkWidth?: number;
  foliageSize?: number;
}

export const Tree = ({
  position = [0, 0, 0],
  scale = 1,
  trunkColor = "#eBa583",
  foliageColor = "#a2eB92",
  trunkHeight = 2,
  trunkWidth = 0.4,
  foliageSize = 1.5
}: TreeProps) => {
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <Cylinder 
        args={[trunkWidth * 0.75, trunkWidth, trunkHeight, 8, 1]} 
        position={[0, trunkHeight/2, 0]} 
        castShadow 
        receiveShadow
      >
        <meshStandardMaterial color={trunkColor} />
      </Cylinder>
      {/* Foliage */}
      <Sphere 
        args={[foliageSize, 8, 8]} 
        position={[0, trunkHeight + foliageSize * 0.75, 0]} 
        castShadow 
        receiveShadow
      >
        <meshStandardMaterial color={foliageColor} />
      </Sphere>
    </group>
  );
}; 
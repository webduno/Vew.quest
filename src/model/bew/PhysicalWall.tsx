'use client';
import { useBox } from '@react-three/cannon';
import { Mesh } from 'three';
import { useContext } from 'react';
import { VibeverseContext } from '@/dom/VibeverseProvider';

export const PhysicalWall = ({
  castShadow = true,
  visible = true,
  position = [0, 0, -0] as [number, number, number],
  rotation = [0, 0, 0] as [number, number, number],
  size = [100, 100, 2] as [number, number, number],
  color = "lightgrey", friction = 0.5, restitution = 0.1
}) => {
  const { LS_lowGraphics } = useContext(VibeverseContext);
  const boxSize: [number, number, number] = [size[0], size[1], size[2]];
  
  const [ref] = useBox(() => ({
    rotation: rotation,
    position: position,
    args: boxSize,
    type: 'Static',
    material: {
      friction: friction,
      restitution: restitution
    }
  }));

  if (!visible) {
    return null;
  }

  return (
    <mesh ref={ref as React.Ref<Mesh>} receiveShadow={!LS_lowGraphics} castShadow={castShadow && !LS_lowGraphics}>
      <boxGeometry args={boxSize} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};



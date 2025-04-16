'use client';
import { useBox } from '@react-three/cannon';
import { Mesh } from 'three';


export const SolidBox = ({
  castShadow = true,
  visible = true,
  position = [0, 0, -0] as [number, number, number],
  rotation = [0, 0, 0] as [number, number, number],
  size = [1, 2, 1] as [number, number, number],
  color = "#ff9900", friction = 0.5, restitution = 0.1,
  onClick = (e: any) => {
    e.stopPropagation();
  }
}) => {
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
    <mesh ref={ref as React.Ref<Mesh>} onClick={onClick}
    receiveShadow castShadow={castShadow}>
      <boxGeometry args={boxSize} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};



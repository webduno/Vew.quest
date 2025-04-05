'use client';
import { useBox } from '@react-three/cannon';
import { useRef } from 'react';
import { Mesh } from 'three';


export const PhysicalTrigger = ({
    triggerCount = 1,
  visible = true,
  position = [0, 0, -0] as [number, number, number],
  rotation = [0, 0, 0] as [number, number, number],
  size = [100, 100, 2] as [number, number, number],
  color = "lightgrey", friction = 0.5, restitution = 0.1,
  onCollide = (e: any) => {}
}) => {
  const boxSize: [number, number, number] = [size[0], size[1], size[2]];
  const triggeredCountRef = useRef(0);
  const [ref] = useBox(() => ({
    rotation: rotation,
    position: position,
    args: boxSize,
    type: 'Static',
    material: {
      friction: friction,
      restitution: restitution
    },
    onCollide: (e) => {
        // ealry return
        if (triggeredCountRef.current >= triggerCount) {
            return;
        }
      // Check if collision is with the player
      if (e.body?.userData?.type === 'player') {
        triggeredCountRef.current += 1;
        onCollide(e);
      }
    },
    isTrigger: true // Make it a trigger (no physical collision, just events)
  }));

  if (!visible) {
    return null;
  }

  return (
    <mesh ref={ref as React.Ref<Mesh>} receiveShadow>
      <boxGeometry args={boxSize} />
      <meshStandardMaterial color={color} 
       />
    </mesh>
  );
};

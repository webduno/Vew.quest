'use client';
import { usePlane } from '@react-three/cannon';
import { Mesh } from 'three';

// Add the PhysicalFloor component definition

export const PhysicalFloor = ({height = 0, visible = true, lowGraphics = false}: {height?: number, visible?: boolean, lowGraphics?: boolean }) => {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, height, 0], // Adjust Y position as needed for your scene
    args: [100, 1, 100], // Plane size
    type: 'Static',
    material: {
      friction: 0.5,
      restitution: 0.1
    }
  }));

  if (!visible) return null;
  // You can add a visual representation for the floor if needed, e.g., a PlaneGeometry mesh
  // Or return null/fragment if the physics plane itself is enough
  return (
    <mesh ref={ref as React.Ref<Mesh>} receiveShadow>
      <planeGeometry args={[100, 100]} />
       <meshStandardMaterial color="white" 
       metalness={lowGraphics ? undefined : 0.15} 
       roughness={lowGraphics ? undefined : 0.15} />

    </mesh>
  );
};

export const PhysicalCeiling = ({height = 3.6, visible = true}: {height?: number, visible?: boolean }) => {
  const [ref] = usePlane(() => ({
    rotation: [Math.PI / 2, 0, 0], // Rotated to face downward
    position: [0, height, 0], // Positioned above the scene (adjust height as needed)
    args: [100, 1, 100], // Plane size
    type: 'Static',
    material: {
      friction: 0.5,
      restitution: 0.1
    }
  }));

  if (!visible) return null;

  // Visual representation for the ceiling
  return (
    <mesh ref={ref as React.Ref<Mesh>} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="white" metalness={0.15} roughness={0.15} />
    </mesh>
  );
};

'use client';
import { usePlane } from '@react-three/cannon';
import { Mesh } from 'three';

// Add the PhysicalFloor component definition

export const PhysicalFloor = () => {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0], // Adjust Y position as needed for your scene
    args: [100, 1, 100], // Plane size
    type: 'Static',
    material: {
      friction: 0.5,
      restitution: 0.1
    }
  }));

  // You can add a visual representation for the floor if needed, e.g., a PlaneGeometry mesh
  // Or return null/fragment if the physics plane itself is enough
  return (
    <mesh ref={ref as React.Ref<Mesh>} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="white" metalness={0.15} roughness={0.15} />
    </mesh>
  );
};

import { useEffect, useRef, useContext } from 'react'
import { Mesh, MeshStandardMaterial } from 'three'
import { useSphere, useBox } from '@react-three/cannon'
import { PhysicalBallProps, PhysicalBoxProps } from '../../../scripts/types/canonPOV'
import { VibeverseContext } from '@/dom/VibeverseProvider'

// Global storage for object physics state
const objectsPhysicsState = new Map();

// Shared materials to reduce draw calls
const ballMaterial = new MeshStandardMaterial({ color: "red" });

// Function to clear all physics state
export const clearPhysicsState = () => {
  objectsPhysicsState.clear();
};

// Simple physical ball with cannon.js physics - stays in the world permanently
export function PhysicalBall({ position, velocity }: PhysicalBallProps) {
  const { LS_lowGraphics } = useContext(VibeverseContext);
  const [ref, api] = useSphere<Mesh>(() => ({
    mass: 2,
    position: position,
    args: [0.1], // 10cm radius
    material: { restitution: 0.7, friction: 0.5 },
    linearDamping: 0.1,
    velocity: velocity
  }))
  
  // Use a ref to remember that this ball has already been initialized
  const isInitialized = useRef(false)
  
  // Only apply position and velocity on first render
  useEffect(() => {
    if (!isInitialized.current) {
      api.position.set(...position)
      api.velocity.set(...velocity)
      isInitialized.current = true
    }
  }, [api, position, velocity])
  
  return (
    <mesh ref={ref} castShadow={!LS_lowGraphics}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <primitive object={ballMaterial} />
    </mesh>
  )
}

// Generic physical box for scene objects
export function PhysicalBox({ position, rotation, scale, geometry, material, userData }: PhysicalBoxProps) {
  const { LS_lowGraphics } = useContext(VibeverseContext);
  const meshRef = useRef<Mesh>(null)
  
  // Try to extract dimensions from geometry
  let boxSize: [number, number, number] = [1, 1, 1]
  
  // Ensure geometry has bounding box computed
  if (geometry && !geometry.boundingBox) {
    geometry.computeBoundingBox()
  }
  
  if (geometry?.parameters) {
    if (geometry.type === 'BoxGeometry') {
      boxSize = [
        geometry.parameters.width || 1,
        geometry.parameters.height || 1,
        geometry.parameters.depth || 1
      ]
    } else if (geometry.boundingBox) {
      // For other geometry types, use bounding box
      const box = geometry.boundingBox
      boxSize = [
        (box.max.x - box.min.x),
        (box.max.y - box.min.y),
        (box.max.z - box.min.z)
      ]
    }
  } else if (geometry?.boundingBox) {
    // Directly use boundingBox if parameters aren't available
    const box = geometry.boundingBox
    boxSize = [
      (box.max.x - box.min.x),
      (box.max.y - box.min.y),
      (box.max.z - box.min.z)
    ]
  }
  
  // Apply scale to box size
  const scaledSize: [number, number, number] = [
    boxSize[0] * Math.abs(scale[0]),
    boxSize[1] * Math.abs(scale[1]),
    boxSize[2] * Math.abs(scale[2])
  ]
  
  // Prevent zero-sized colliders which can cause physics glitches
  const finalSize: [number, number, number] = [
    Math.max(scaledSize[0], 0.01),
    Math.max(scaledSize[1], 0.01),
    Math.max(scaledSize[2], 0.01)
  ]
  
  // Check if the object has gravity enabled in userData
  const hasGravity = userData?.hasGravity || false;
  
  // Create a unique ID for this object based on its initial position
  // This helps us track it across re-renders
  const instanceId = useRef(`obj-${position[0]}-${position[1]}-${position[2]}`);
  
  // Apply userData to mesh ref after creation
  useEffect(() => {
    if (meshRef.current && userData) {
      meshRef.current.userData = { ...userData };
    }
  }, [userData]);
  
  const [boxRef, api] = useBox(() => ({
    args: finalSize,
    position: hasGravity && objectsPhysicsState.has(instanceId.current) 
      ? objectsPhysicsState.get(instanceId.current).position 
      : position,
    rotation: hasGravity && objectsPhysicsState.has(instanceId.current) && objectsPhysicsState.get(instanceId.current).rotation
      ? objectsPhysicsState.get(instanceId.current).rotation
      : rotation,
    type: hasGravity ? 'Dynamic' : 'Static',
    mass: hasGravity ? 5 : 0,
    material: { 
      friction: 0.5,
      restitution: hasGravity ? 0.4 : 0.1 // More bounce for gravity-enabled objects
    },
    linearDamping: hasGravity ? 0.2 : 0, // Add some air resistance for dynamic objects
    // Apply stored velocity for persistent objects
    velocity: hasGravity && objectsPhysicsState.has(instanceId.current) && objectsPhysicsState.get(instanceId.current).velocity
      ? objectsPhysicsState.get(instanceId.current).velocity 
      : [0, 0, 0]
  }), meshRef)
  
  // Track position for dynamic objects
  useEffect(() => {
    if (hasGravity && api) {
      // Subscribe to position updates for dynamic objects
      const unsubscribePos = api.position.subscribe((p) => {
        if (hasGravity) {
          const currentState = objectsPhysicsState.get(instanceId.current) || {};
          objectsPhysicsState.set(instanceId.current, {
            ...currentState,
            position: p
          });
        }
      });
      
      // Subscribe to velocity updates for dynamic objects
      const unsubscribeVel = api.velocity.subscribe((v) => {
        if (hasGravity) {
          const currentState = objectsPhysicsState.get(instanceId.current) || {};
          objectsPhysicsState.set(instanceId.current, {
            ...currentState,
            velocity: v
          });
        }
      });
      
      // Subscribe to rotation updates for dynamic objects
      const unsubscribeRot = api.rotation.subscribe((r) => {
        if (hasGravity) {
          const currentState = objectsPhysicsState.get(instanceId.current) || {};
          objectsPhysicsState.set(instanceId.current, {
            ...currentState,
            rotation: r
          });
        }
      });
      
      return () => {
        unsubscribePos();
        unsubscribeVel();
        unsubscribeRot();
      };
    }
  }, [api, hasGravity]);
  
  // Use the provided material or create a default one
  const finalMaterial = material || new MeshStandardMaterial({ color: "#cccccc" });
  
  return (
    <mesh 
      ref={meshRef} 
      geometry={geometry} 
      material={finalMaterial}
      position={position}
      rotation={rotation}
      scale={scale}
      castShadow={!LS_lowGraphics}
      receiveShadow={!LS_lowGraphics}
    />
  )
} 
'use client';

import { useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { Box } from '@react-three/drei';
import { useEffect, useState } from 'react';
import * as THREE from 'three';

export const ZuckHead = () => {
  const [model, setModel] = useState<THREE.Group | null>(null);
  
  useEffect(() => {
    const loader = new OBJLoader();
    loader.load(
      '/obj/mark2.obj',
      (object) => {
        console.log('OBJ loaded successfully:', object);
        setModel(object);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      (error) => {
        console.error('Error loading OBJ:', error);
      }
    );
  }, []);

  return (
    <group position={[0, 0, 0]} rotation={[0, 0, 0]} scale={[0.5, 0.5, 0.5]}>
      
      
      {model && (
        <primitive object={model} castShadow receiveShadow />
      )}
    </group>
  );
};

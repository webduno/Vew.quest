"use client";
import { Torus, Circle, Text, Sphere } from '@react-three/drei'; import { useRef } from 'react'; import { useThree, useFrame } from '@react-three/fiber';
import { Vector3, Group } from 'three'; import { useRouter } from 'next/navigation';

export const BewPortal = ({ 
  portalMaterial = <meshStandardMaterial color="#aad0f4" emissive="#aad0f4" emissiveIntensity={0.75} />, 
  torusMaterial = <meshStandardMaterial color="#ffffff" emissive="#444444" />,
  position, rotation, title ="???", url,
  onCollision, textColor = "lightgrey", portalRadius = 2,
  debug = false
}: any) => {
  const router = useRouter(); const { camera } = useThree(); const portalRef = useRef<Group>(null);
  const lastCheck = useRef(0); const throttleInterval = 100;

  useFrame((state, delta) => {
    if (!portalRef.current || !url || !portalRef.current.parent) return;

    const now = state.clock.getElapsedTime() * 1000; if (now - lastCheck.current < throttleInterval) return; lastCheck.current = now;

    try {
      const portalPosition = new Vector3();
      portalRef.current.getWorldPosition(portalPosition);
      const distance = camera.position.distanceTo(portalPosition);

      if (distance < portalRadius) { if (onCollision) { onCollision(); } router.push(url); }
    } catch (error) {
      console.error("Error checking portal collision:", error);
    }
  });

  return (
    <group ref={portalRef} position={position} rotation={rotation}>
      {title &&
        <Text key={title}  anchorX="center" anchorY="middle"
        textAlign='center'
         position={[0, portalRadius*1.25, 0.1]}
          fontSize={1} color={textColor||"white"} 
          renderOrder={1} font="/fonts/beanie.ttf">{title}</Text>
      }
      <Torus args={[portalRadius, portalRadius/10, 4, 32, Math.PI]} castShadow receiveShadow>
        {torusMaterial}
      </Torus>
      <Circle args={[portalRadius, 32, 0, Math.PI]} castShadow receiveShadow>
        {portalMaterial}
      </Circle>
      {debug && <Sphere args={[portalRadius*.8, 16, 16]} position={[0, 0, 0]}>
        <meshBasicMaterial wireframe color="#ffffff" transparent opacity={0.2} />
      </Sphere>}
    </group>
  );
};

'use client';
import { Cylinder } from '@react-three/drei';


export const SummoningCircle = () => {
  return (<group>


    <Cylinder args={[1.4, 1.4, 2.5]} position={[0, 1.55, 0]}>
      <meshStandardMaterial color="#ffffff" emissive="#101010"
        side={1} />
    </Cylinder>

    <Cylinder args={[1.45, 1.45, 2.5]} position={[0, 1.55, 0]}>
      <meshStandardMaterial color="#ffffff" emissive="#101010"
        wireframe={true} />
    </Cylinder>


    <Cylinder args={[1.5, 2, 1]}>
      <meshStandardMaterial color="#dddddd" />
    </Cylinder>

    <Cylinder args={[2, 1.5, 1]} position={[0, 3.25, 0]}>
      <meshStandardMaterial color="#ffffff" />
    </Cylinder>
  </group>
  );
};

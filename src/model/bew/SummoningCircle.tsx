'use client';
import { Cylinder } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { useRef } from 'react'; 

export const SummoningCircle = ({hardMode, colorCalibrationStarted, solidCalibrationStarted}: {
  hardMode: boolean, 
  colorCalibrationStarted: boolean,
  solidCalibrationStarted: boolean
}) => {

  const wireFrameRef = useRef<Mesh>(null)

useFrame(() => {
  if (!colorCalibrationStarted && !solidCalibrationStarted) {
    return
  }
  if (!wireFrameRef.current) {
    return
  }
  wireFrameRef.current.rotation.y += .1
})

  
  return (<group>


    <Cylinder args={[1.4, 1.4, 2.5]} position={[0, 1.55, 0]}
    >
      <meshStandardMaterial color="#ffffff" emissive="#101010"
      
        side={!hardMode ? 1 : 0} />
    </Cylinder>

    <Cylinder args={[1.45, 1.45, 2.5]} position={[0, 1.55, 0]}
    ref={wireFrameRef}
    >
      <meshStandardMaterial color="#ffffff" 
        wireframe={true} />
    </Cylinder>


    <Cylinder args={[1.5, 2, 1]}>
      <meshStandardMaterial color="#dddddd" />
    </Cylinder>

    <Cylinder args={[2, 1.5, 1]} position={[0, 3.25, 0]}>
      <meshStandardMaterial color="#eeeeee" />
    </Cylinder>
  </group>
  );
};

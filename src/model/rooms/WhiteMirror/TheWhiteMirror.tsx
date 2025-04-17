'use client';
import { useTexture, Sphere, Text, Plane, RoundedBox,  Cylinder } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { useBew } from '@/../script/contexts/BewProvider';









export const TheWhiteMirror = ({
  whiteRoomTarget, setShowAnalogModal, showAnalogModal
}: {
  whiteRoomTarget: string;
  setShowAnalogModal: (show: boolean) => void;
  showAnalogModal: boolean;
}) => {

  const { playSoundEffect } = useBew();

  const orbRef = useRef<any>(null);
  const orbRef2 = useRef<any>(null);
  // const timeRef = useRef(0);
  const hdriRaceTexture = useTexture(`/bg/qqq.jpg`);



  useFrame((state: any, delta: any): any => {
    if (!orbRef.current) return;
    // timeRef.current += delta;
    // orbRef.current.position.y = Math.sin(orbRef.current.position.y) * 1 + 1.5;
    orbRef.current.rotation.y += 0.008;
    orbRef.current.rotation.z += 0.003;
    if (!orbRef2.current) return;
    orbRef2.current.rotation.x -= 0.009;
    orbRef2.current.rotation.z -= 0.014;
  });

  return (<>

    <group  position={[0, 1.9, -21.5]}
    
    onClick={() => {
      setShowAnalogModal(true);
      if (showAnalogModal) { return }
    playSoundEffect("/sfx/short/cling.mp3")

    }}
    >
      <Cylinder args={[.42, .6, .45, 12]} position={[0, -.85, 0]}
      >
        <meshStandardMaterial color="#ffffff" emissive="#443300"
        />
      </Cylinder>
      <pointLight intensity={10} color="#ffffff" castShadow
      distance={12}
        position={[0, 1.1, -3]} />
      {/* <Sphere args={[.7, 32, 32]} ref={orbRef2} castShadow
      >
        <meshStandardMaterial color="#ffffff"
          side={1}
          emissive="#330033"
          map={hdriRaceTexture}
           />
      </Sphere> */}
      <Sphere args={[.72, 32, 32]}
        ref={orbRef}
      >
          <meshStandardMaterial 
          color="#ffffff"
          emissive="#330033"
          roughness={0.13}
          transparent={true}
          // map={hdriRaceTexture}
          opacity={.5}
        />
      </Sphere>
    </group>


    <group position={[0, 2.9, -25.73]} rotation={[0, -0, 0]}>
      <Text font={"/fonts/wallpoet.ttf"} fontSize={.3} color={"#444444"}
        anchorX="center" anchorY="top" textAlign="left"
      >
        {`TARGET:`}
      </Text>

      <Text position={[0, -.25, 0]} font={"/fonts/beanie.ttf"} fontSize={1.1} color={"#444444"}
        anchorX="center" anchorY="top" textAlign="left"
      >
        {`${whiteRoomTarget.slice(0, 4)}-${whiteRoomTarget.slice(4, 8)}`}
      </Text>
    </group>



    <group position={[0, 1.5, -21]} rotation={[0, 0, 0]}>

      <group position={[0, 0, 0]} rotation={[0, 0, 0]}>
        {/* <Box args={[4, 2, 1]} position={[0, 1, -5]} >
          <meshStandardMaterial color="#ffffff"
          />
        </Box> */}


        <Plane args={[4, 2]} position={[0, .5, -4.74]} rotation={[0, 0, 0]} receiveShadow>
          <meshStandardMaterial color="#ffffff"
            emissive="#555555"
            roughness={0.15} 
            />
        </Plane>
      </group>


      {/* <Box
        args={[9.5, 3.33, 9.5]} position={[0, 0.2, 0]} receiveShadow>
        <meshStandardMaterial color="#ffffff" side={1}
          emissive="#aaaaaa" />
      </Box> */}

      
      <RoundedBox
        radius={.4}
        args={[9.5, 3.33, 9.5]} position={[0, 0.2, 0]} receiveShadow>
        <meshStandardMaterial color="#ffffff" side={1}
          emissive="#aaaaaa" />
      </RoundedBox>
    </group>
  </>
  );
};

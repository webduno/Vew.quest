'use client';
import { useTexture, Sphere, Text, Plane, RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';









export const TheWhiteMirror = ({
  whiteRoomTarget, setShowAnalogModal
}: {
  whiteRoomTarget: string;
  setShowAnalogModal: (show: boolean) => void;
}) => {



  const orbRef = useRef<any>(null);
  // const timeRef = useRef(0);
  const hdriRaceTexture = useTexture(`/bg/space3.jpg`);



  useFrame((state: any, delta: any): any => {
    if (!orbRef.current) return;

    // timeRef.current += delta;
    // orbRef.current.position.y = Math.sin(orbRef.current.position.y) * 1 + 1.5;
    orbRef.current.rotation.y += 0.01;
  });

  return (<>

    <group ref={orbRef} position={[0, 2, -21.5]}>
      <pointLight intensity={1} color="#ffffff" castShadow
        position={[0, 0.25, 0]} />
      <Sphere args={[1, 16, 16]}
        onClick={() => {
          setShowAnalogModal(true);
        }}
      >
        <meshStandardMaterial color="#ffffff"
          // emissive="#ffffff"
          side={1}
          // envMapIntensity={1}
          // emissiveMap={hdriRaceTexture}
          // emissiveIntensity={1}
          map={hdriRaceTexture} />
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
            emissive="#888888"
            roughness={0.15} />
        </Plane>
      </group>


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

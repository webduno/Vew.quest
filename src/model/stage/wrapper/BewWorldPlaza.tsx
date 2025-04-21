'use client';
import { SolidBox } from '@/model/core/SolidBox';
import { Box, Cylinder } from '@react-three/drei';
import { Vector3, Object3D } from 'three';
import { useRef } from 'react';
import Bank from '../city/Bank';
import CityHall from '../city/CityHall';
import SimpleHouse from '../city/SimpleHouse';

export const BewWorldPlaza = () => {

  return (<>
    <ambientLight intensity={.25} />
{/* sun light */}
<directionalLight intensity={.75} position={[-25, 25, -25]} castShadow
shadow-mapSize-blurSamples={2}
shadow-mapSize-radius={.2}
shadow-camera-near={10}
shadow-camera-far={80}
shadow-camera-left={-80}
shadow-camera-right={80}
shadow-camera-top={20}
shadow-camera-bottom={-50}
/>



    {/* spot light */}
    

    {/* <directionalLight intensity={.75} position={[-25, 25, -25]} castShadow/> */}


    <group position={[1,4.5,-22.75]} scale={[10,10,10]} >
      <Bank position={[0,0,0]} />
    </group>

    <group scale={[10,10,10]} rotation={[0, -Math.PI/2, 0]} position={[6,4.5,-15]}>
      <CityHall position={[0,0,0]} />
    </group>

    <group position={[-8,4.5,-12.75]} scale={[10,10,10]} rotation={[0, Math.PI/2, 0]}>
      <SimpleHouse />
    </group>

    {/* <pointLight intensity={50} position={[-7, 10, -27]} 
    castShadow
    distance={20}
    />

    <spotLight intensity={15} position={[0, 5.5, -25]} castShadow
    distance={30}
      penumbra={0.5}
    />

<spotLight intensity={5} position={[0, 5, 15]} castShadow
    distance={30}
      penumbra={0.5}
    /> */}


    <group position={[0, 0, 0]}>
      <Box args={[10, .1, 10]} castShadow  receiveShadow>
        <meshStandardMaterial color="#99ff99" />
      </Box>

<Box args={[10, .1, 10]} 
position={[0,0,-12]}
castShadow  receiveShadow>
  <meshStandardMaterial color="#99ff99" />
</Box>

<Box args={[10, .1, 10]} 
position={[0,0,12]}
castShadow  receiveShadow>
  <meshStandardMaterial color="#99ff99" />
</Box>

    </group>

  </>);
};

export const BewWorldPlazaWithPlayer = () => {
  return (
    <group>
      {/* floor */}
      {/* <SolidBox  position={[0,-.501,-2]} size={[60 ,1,60]} color="#ffffff"   /> */}
      <Cylinder args={[26.4,26,1]} position={[0,-.501,-2]} receiveShadow>
        <meshStandardMaterial color="#ffffff" />
      </Cylinder>

      
<group>
<SolidBox  position={[0,0.5,-2]} size={[1,1,1]} color="#00ff99"   />

{/* bank */}
<SolidBox visible={false} position={[0,0.5,-24.5]} size={[6,10,6.5]} color="#00ff99"   />
  
{/* city hall */}
<SolidBox visible={false} position={[ 8,0.5,-14.5]} size={[7,10,10.5]} color="#00ff99"   />

{/* simple house */}
<SolidBox visible={false} position={[ -8,0.5,-12.5]} size={[4,10,4.5]} color="#00ff99"   />
<SolidBox visible={false} position={[ -5.76,0.25,-12.05]} size={[2,.5,2.5]} color="#00ff99"   />


  
</group>
    </group>
  );
};
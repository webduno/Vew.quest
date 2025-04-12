'use client';
import { Box, Cylinder, Torus, Text } from '@react-three/drei';
import { PhysicalWall } from './PhysicalWall';
import { useState, useEffect } from 'react';
import { PhysicalTrigger } from './PhysicalTrigger';
import { useVibeverse } from '../../../scripts/hooks/useVibeverse';

export const RoomA = () => {
  const [colorCallibration, setColorCallibration] = useState(0)
  const [callibrationAvailable, setCallibrationAvailable] = useState(false)
  const [isCallibrated, setIsCallibrated] = useState(false);

  useEffect(() => {
    const checkCalibration = () => {
      const savedStats = localStorage.getItem('VB_MINDSTATS');
      const currentStats = savedStats ? JSON.parse(savedStats) : { color: 0 };
      setColorCallibration(currentStats.color);
      setIsCallibrated(currentStats.color >= 3);
    };

    // Initial check
    checkCalibration();

    // Listen for localStorage changes
    const handleStorageChange = (e: MessageEvent) => {
      if (e.data === 'localStorageChanged') {
        checkCalibration();
      }
    };

    window.addEventListener('message', handleStorageChange);
    return () => window.removeEventListener('message', handleStorageChange);
  }, []);

  return (<>


<Text font="/fonts/wallpoet.ttf" fontSize={0.25} color="#1d1d1d" 
anchorX="center" anchorY="middle" textAlign="center"
position={[0,2.8,14.49]} rotation={[0,Math.PI,0]}
>
{`MARS ARCHIVES`}
</Text>




<Text font="/fonts/wallpoet.ttf" fontSize={0.25} color="#252525" 
anchorX="center" anchorY="middle" textAlign="center"
position={[-2.49,2.6,10.2]} rotation={[0,Math.PI/2,0]}
>
{`CALIBRATION
SPACES`}
</Text>


<Text font="/fonts/wallpoet.ttf" fontSize={0.25} color="#252525" 
anchorX="center" anchorY="middle" textAlign="center"
position={[2.49,2.6,10.2]} rotation={[0,-Math.PI/2,0]}
>
{`PSIONIC
ZONE`}
</Text>






<PhysicalWall size={[.7, .8, .7]} color="#ffffff" visible={false}
position={[-1.9, 0.4, 13.9]} />
<group position={[-1.9, 0, 13.9]} rotation={[0, 0, 0]}>
<Cylinder args={[.38, .38, .2, 16]} position={[0, 0.11, 0]}>
  <meshStandardMaterial color="#999999" />
</Cylinder>
<Torus args={[.42,.1,5]} position={[0, 0.41, 0]} rotation={[Math.PI/2,0,0]} castShadow
scale={[1,1,4]}
>
  <meshStandardMaterial color="#cccccc" />
</Torus>
</group>





  

      {/* ////////////////////////////////////////////////////// */}
      



      {/* <PhysicalTrigger  size={[1, 3, .5]} visible={false}
      triggerCount={1}
        onCollide={() => {
          setTimeout(() => {
            setCallibrationAvailable(true)
            setTimeout(() => {
              setCallibrationAvailable(false)
            }, 2000)
          }, 2000)
        }}
          position={[-2.4, 1.5, 8.25]} rotation={[0, Math.PI / 2, 0]} 
        /> */}
      {!!callibrationAvailable && <>
      
        <PhysicalWall position={[-2.75, 1.5, 7.25]} 
        size={[1.5, 3, 0.25]} color="#dddddd"
          rotation={[0, Math.PI / 2, 0]} 
        />
        <group position={[-3, 1.5, 8.25]} rotation={[0, 0, 0]}>
          {/* real door */}
          {/* doorknob */}
          <Box position={[.25, 0, -.5]} args={[.4, .8, .15]} castShadow
          >
            <meshStandardMaterial color="#ffffff"  />
          </Box>
  
        </group>
      </>}
        {!callibrationAvailable && <>
<Text font="/fonts/consolas.ttf" fontSize={0.15} color="#666666" 
anchorX="center" anchorY="middle" textAlign="center"
position={[-2.62,2.25,8.25]} rotation={[0,Math.PI/2,0]}
>
{`USE HANDLE
TO OPEN`}
</Text>

        <PhysicalWall position={[-3, 1.5, 8.25]} size={[1.5, 3, 0.75]} color="#dddddd"
          rotation={[0, Math.PI / 2, 0]} 
        />
      <group position={[-3, 1.5, 8.25]} rotation={[0, 0, 0]}>
        {/* real door */}
        {/* doorknob */}
        <Box position={[0, 0, .5]} args={[1, .8, .15]} castShadow
        onClick={(e) => {
          e.stopPropagation();
          setCallibrationAvailable(true)
          setTimeout(() => {
            setCallibrationAvailable(false)
          }, 2000)
        }}
        >
          <meshStandardMaterial color="#ffffff"  />
        </Box>

      </group>
      </>}
{/* 
      <group position={[-3, 1.49, 8.25]} rotation={[0, 0, 0]}>
      <Box args={[10, 3, 2]} position={[-5, 0, 0]} >
          <meshStandardMaterial color="#aaaaaa"  side={2} />
        </Box>
        </group> */}







{!isCallibrated && <>
  <Text font="/fonts/consolas.ttf" fontSize={0.15} color="#666666" 
anchorX="center" anchorY="middle" textAlign="center"
position={[2.62,2.25,8.25]} rotation={[0,-Math.PI/2,0]}
>
{`CALLIBRATED
LEVEL 3
AGENTS ONLY
`}
</Text>
{/* ${(stats?.color || 0) + (stats?.solid || 0) + (stats?.light || 0)} */}
<group position={[2.75, 1.5, 8.25]} rotation={[0, 0, 0]} >
  
<Box position={[-0.1,0,-.5]} args={[.2, .2, .2]} castShadow >
          <meshStandardMaterial color="#aaaaaa"  />
        </Box>
</group>
<PhysicalWall castShadow={false} size={[0.2, 3, 1.5]} color="#dddddd"
          position={[2.75, 1.5, 8.25]} rotation={[0, 0, 0]} 
        />
        </>}
        {/* OPENED real door */}
        <PhysicalWall  size={[0.2, 3, 1.5]} color="#dddddd"
          position={[3.5, 1.5, 8.65]} rotation={[0, -1.2, 0]} 
        />
      <group position={[3.5, 1.5, 8.65]} rotation={[0, -1.2, 0]} >
      {/* doorknob */}
        <Box position={[-0.1,0,-.5]} args={[.2, .2, .2]} castShadow >
          <meshStandardMaterial color="#aaaaaa"  />
        </Box>

      </group>











{/* behind landing walls */}

<group position={[0, 0, 0]} rotation={[0, 0, 0]}>
        {/* left wall */}
        <PhysicalWall   color="#ffffff"
        size={[6, 4, 1]}
          position={[-3, 2, 12]} rotation={[0, Math.PI / 2, 0]} 
        />
        {/* right wall */}
        <PhysicalWall  color="#ffffff"
        size={[6, 4, 1]}
        position={[3, 2, 12]} rotation={[0, -Math.PI / 2, 0]} />
      </group>





          {/* Bottom Borders */}
          <Box args={[1.1,0.4,6.1]} position={[3,0,12]}>
            <meshStandardMaterial color="#cccccc" />
          </Box>

          <Box args={[1.1,0.4,6.1]} position={[-3,0,12]}>
            <meshStandardMaterial color="#cccccc" />
          </Box>







      {/* doors */}
      <Box position={[0.51, 1.25, 15]} args={[1, 2.5, 1.1]}>
        <meshStandardMaterial color="#dddddd" />
      </Box>
      <Box position={[-0.51, 1.25, 15]} args={[1, 2.5, 1.1]}>
        <meshStandardMaterial color="#dddddd" />
      </Box>
      <Box position={[0, 1.25, 15]} args={[2.05, 2.55, 1.05]}>
        <meshStandardMaterial color="#cccccc" />
      </Box>
      {/* back wall */}
      <PhysicalWall 
        size={[1, 4, 6.5]} color="#ffffff"
        position={[0, 2, 15]} rotation={[0, -Math.PI / 2, 0]} 
      />
      <PhysicalWall color="#f7f7f7"
        size={[1.2, 1, 7.1]}
        position={[0, 3.6, 15]} rotation={[0, -Math.PI / 2, 0]} 
      />
  </>);
};



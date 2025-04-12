'use client';
import { Box, Plane, Text } from '@react-three/drei';
import { CardboardBox } from '../bew/CardboardBox';
import { StyledWall } from '../core/StyledWall';
import { PhysicalWall } from '../core/PhysicalWall';
import { PhysicalTrigger } from '../core/PhysicalTrigger';
import { useBew } from '../../../scripts/contexts/BewProvider';
import { useState, useEffect } from 'react';
import { useVibeverse } from '../../../scripts/hooks/useVibeverse';

export const RoomRight = () => {
  const { showSnackbar, closeSnackbar, playSoundEffect } = useBew();
  const { updateExploredStatus, hasExploredZone } = useVibeverse();
  const [solidLevel, setSolidLevel] = useState(0);
  const [colorLevel, setColorLevel] = useState(0);
  useEffect(() => {
    const checkSolidLevel = () => {
      const savedStats = localStorage.getItem('VB_MINDSTATS');
      const currentStats = savedStats ? JSON.parse(savedStats) : { solid: 0 };
      setSolidLevel(currentStats.solid);
    };
    const checkColorLevel = () => {
      const savedStats = localStorage.getItem('VB_MINDSTATS');
      const currentStats = savedStats ? JSON.parse(savedStats) : { color: 0 };
      console.log('currentStats', currentStats);
      setColorLevel(currentStats.color);
    };

    // Initial check
    checkSolidLevel();
    checkColorLevel();
    // Listen for localStorage changes
    const handleStorageChange = (e: MessageEvent) => {
      if (e.data === 'localStorageChanged') {
        checkSolidLevel();
        checkColorLevel();
      }
    };

    window.addEventListener('message', handleStorageChange);
    return () => window.removeEventListener('message', handleStorageChange);
  }, []);

  return (<>

<Text 
color="#333333" anchorX="center" anchorY="middle" position={[2.91, 2.65, -2.25]}
rotation={[0,Math.PI/2,0.1]} fontSize={0.10} font={"/fonts/beanie.ttf"}
>
{`
CODE3: GONDOLAWISH
        _________


        |@@@
mcmonagle.pdf
989.333 BCE`}
</Text>

{!hasExploredZone('psionic_asset_zone') &&  (
<PhysicalTrigger visible={false}
 position={[7, 2, -5]} size={[3,4,1.1]}
 onCollide={() => {
  updateExploredStatus('psionic_asset_zone', true);
  showSnackbar('You\'ve found the Psionic Asset Zone!', 'info');
  setTimeout(() => {
    closeSnackbar();
  }, 4000);
}}
>
</PhysicalTrigger>
)}

  


    {/* goal */}
    <Box args={[1,4.2,7]} position={[3.25, 2, -8.5]} rotation={[0,0,0]} castShadow receiveShadow>
      <meshStandardMaterial color="#eeeeee"  
         />
    </Box>
    <Plane args={[4,2]} position={[3.77, 1.75, -8]} rotation={[0,Math.PI/2,0]} receiveShadow>
<meshStandardMaterial color="#ffffff" emissive={"#111111"}   side={2} roughness={0.05} 
         />
    </Plane>
<Text 
color="#333333" anchorX="center" anchorY="middle" position={[3.76, 3.1, -8]}
font={"/fonts/wallpoet.ttf"}
rotation={[0,Math.PI/2,0]} fontSize={.2} 
>
{`P S I O N I C_A S S E T | Training Zone`}
</Text>




<Text 
color="#1f1f1f" anchorX="center" anchorY="middle" position={[3.78, 2.35, -7]}
rotation={[0,Math.PI/2,0]} fontSize={.2} font={"/fonts/beanie.ttf"}
>
{`
- Mindset and Intention
  * Learnable Skill
- Ideograms + Gestalts @
  | ?(AOL)
`}
</Text>



<Text 
color="#1a1a1a" anchorX="center" anchorY="middle" position={[3.78, 1.5, -7.9]}
rotation={[0,Math.PI/2,0.05]} fontSize={.25} font={"/fonts/beanie.ttf"}
>
{`
   - Block Analytical Overlay 
SOLID MIND CALLIBRATION (2 required)
     ________┌-      remember -->
`}
</Text>

<Text 
color="#393633" anchorX="center" anchorY="middle" position={[3.78, 1, -9.2]}
rotation={[0,Math.PI/2,0.05]} fontSize={.15} font={"/fonts/beanie.ttf"}
>
{`the mind goes thru walls`}
</Text>


<PhysicalTrigger triggerCount={1}  color="#ff9900" visible={false}
onCollide={() => {
  playSoundEffect("/sfx/trapped.mp3")
}}
position={[3,2, -10]}
size={[.51,4,1]}
/>

{/* only show when mindstats.solid >= 2 */}
{solidLevel < 2 && <>
<PhysicalWall  visible={false} color="#ff9900"
position={[3.5,2, -9]}
size={[.525,4,7]}
/>
</>}

<PhysicalWall  visible={false} color="#ff9900"
position={[3.5,2, -7]}
size={[.51,4,5]}
/>



    <CardboardBox position={[5.25, 1, 1]} size={[1.25, 1.25, 1.25]}  />
    <CardboardBox position={[7.25, 1., 1]} size={[1.5, 1.5, 1.5]}  
      rotation={[0, 1, 0]}
    />
    <CardboardBox position={[7.25, 1., 0.2]} size={[1.5, 1.5, .5]}  />
    <CardboardBox position={[7.25, 2.5, 1.5]} size={[0.75, 0.5, 0.75]}  />
    <CardboardBox position={[6.5, 1, -2]} />



    <StyledWall color="#ffffff" size={[3, 4, 0.25]} 
      position={[7, 2, -2]} rotation={[0,0,0]} 
    />


    
    <CardboardBox position={[7, 0.8, -3]} size={[1.5, 1.5, 2]}  />
    <CardboardBox position={[7, 2.5, -3]} size={[1.5, 0.5, 1.5]}  />



    <group position={[3.5,1.5,13.5]} rotation={[0,-Math.PI/2,0]} >
<Text 
color="#333333" anchorX="center" anchorY="middle" position={[0,0.2,-0.01]}
rotation={[0,Math.PI,0]} fontSize={0.10} font={"/fonts/beanie.ttf"}
>
{`COORDINATED
REMOTE VIEWING (CRV)

    CODE2: sunstreak
    |
    _

cia_rdp96.pdf`}
</Text>


</group>

<PhysicalWall color="#eeeeee"
        position={[3.6,1.8,12]}
        size={[0.45,1.25,1]}
        rotation={[0,0,0]}
      />
      <Box args={[0.45,1.25,1]} position={[3.6,1.8,13.5]}
      >
              <meshStandardMaterial color="#eeeeee"  side={2}
               />
            </Box>
      <PhysicalWall color="#eeeeee"
              position={[3.6,1.8,10.5]}
              size={[0.45,1.25,1]}
              rotation={[0,0,0]}
            />




    <StyledWall color="#ffffff" size={[1, 4, 26]} 
      position={[9, 2, 2]} rotation={[0,0,0]} 
    />

<StyledWall color="#ffffff" size={[6, 4, 1]} 
      position={[6, 2, 15]} rotation={[0,0,0]} 
    />
    <StyledWall color="#ffffff" size={[5.5, 4, 1]} 
          position={[6, 2, -11]} rotation={[0,0,0]} 
        />
  </>);
};




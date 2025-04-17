'use client';
import { Box, Plane, Text } from '@react-three/drei';
import { CardboardBox } from '../bits/CardboardBox';
import { StyledWall } from '../core/StyledWall';
import { SolidBox } from '../core/SolidBox';
import { CollisionBox } from '../core/CollisionBox';
import { useGameCore } from '../../../script/contexts/useGameCore';
import { usePlayerStats } from '../../../script/contexts/usePlayerStats';

export const PsionicHallway = ({wasPsionicHallwayEntered, setWasPsionicHallwayEntered}: {wasPsionicHallwayEntered: boolean, setWasPsionicHallwayEntered: (wasPsionicHallwayEntered: boolean) => void}) => {
  const { showSnackbar, closeSnackbar, playSoundEffect } = useGameCore();
  const { updateExploredStatus, hasExploredZone, mindStats, LS_lowGraphics } = usePlayerStats();

  return (<>
  {!wasPsionicHallwayEntered && (
<CollisionBox 
        onCollide={() => {
          if (!wasPsionicHallwayEntered) {
            setWasPsionicHallwayEntered(true);
          }
        }}
        position={[7,1.5,4]} size={[3,3,1]} 
      />
  )}

  
     {/* cydonia light */}
<pointLight position={[5, 3, 2]} intensity={3} color="#ffe7c0"
    castShadow 
    distance={6}
    
    shadow-mapSize-blurSamples={2}
    shadow-mapSize-radius={.2}

    shadow-mapSize-width={16}
    shadow-mapSize-height={16}
        shadow-camera-near={1}
        shadow-camera-far={4}
    shadow-camera-left={-4}
    shadow-camera-right={4}
    shadow-camera-top={4}
    shadow-camera-bottom={-4}

     />     
     


     {/* whiteboard light */}
{!LS_lowGraphics && (
      <pointLight position={[6, 3, -8]} intensity={0.3} color="#f7e7ff"
    // castShadow 
    distance={4}
     />
     )}



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
<CollisionBox 
 position={[7, 2, -5]} size={[3,4,1.1]}
 onCollide={() => {
  updateExploredStatus('psionic_asset_zone', true);
  playSoundEffect('/sfx/tutorials/psionicassets.ogg');

  showSnackbar('Psionic Asset Training Zone', 'title', 4500);
}}
>
</CollisionBox>
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
SOLID CALLIBRATION (2 required)
     ________┌-      remember -->
`}
</Text>

<Text 
color="#393633" anchorX="center" anchorY="middle" position={[3.78, 1, -9.2]}
rotation={[0,Math.PI/2,0.05]} fontSize={.15} font={"/fonts/beanie.ttf"}
>
{`the mind goes thru walls`}
</Text>


<CollisionBox triggerCount={1}  color="#ff9900" 
onCollide={() => {
  playSoundEffect("/sfx/trapped.mp3")
}}
position={[3,2, -10]}
size={[.51,4,1]}
/>

{/* only show when mindstats.solid >= 2 */}
{mindStats.solid < 2 && <>
<SolidBox  visible={false} color="#ff9900"
position={[3,2, -9]}
size={[1.4,4,7]}
/>
</>}

<SolidBox  visible={false} color="#ff9900"
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

    *CODE#2 : sunstreak*
    |
    _

cia_rdp96.pdf`}
</Text>


</group>

<SolidBox color="#eeeeee"
        position={[3.6,1.8,12]}
        size={[0.45,1.25,1]}
        rotation={[0,0,0]}
      />
      <Box args={[0.45,1.25,1]} position={[3.6,1.8,13.5]}
      >
              <meshStandardMaterial color="#eeeeee"  side={2}
               />
            </Box>
      <SolidBox color="#eeeeee"
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




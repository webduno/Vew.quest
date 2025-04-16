'use client';
import { Box, GradientTexture, Text } from '@react-three/drei';
import { StyledWall } from '../core/StyledWall';
import { useVibeverse } from '@/../scripts/hooks/useVibeverse';
import { useBew } from '../../../scripts/contexts/BewProvider';
import { SolidBox } from '../core/SolidBox';


export const PortalRoom = () => {
  const { handleLockedDoor } = useBew()
  const { LS_lowGraphics, LS_hasFirstKey } = useVibeverse()
  return (<>


{/* main locked door */}
<group position={[-9.94,1.5,-3]}
onClick={handleLockedDoor}
>
  <Box args={[1,3,2]} >
<meshStandardMaterial color="#dddddd" />
</Box>

<Box args={[1.1,3,0.15]} position={[0,0,1]}>
<meshStandardMaterial color="#d7d7d7" />
</Box>
<Box args={[1.1,3,0.15]} position={[0,0,-1]}>
<meshStandardMaterial color="#d7d7d7" />
</Box>
<Box args={[1.11,.15,2.15]} position={[0,1.5,0]}>
<meshStandardMaterial color="#d7d7d7" />
</Box>

<Box args={[0.2,0.2,0.2]} position={[0.5,0,0.5]}>
<meshStandardMaterial color="#cccccc" />
</Box>
</group>











<Box args={[4,2,0.1]} position={[-6.5,1.8,-4.5]}>
<meshStandardMaterial color="#ffffff" 
metalness={LS_lowGraphics ? undefined : 0.3} 
roughness={LS_lowGraphics ? undefined : 0.15} 
emissive={"#222222"}  />
</Box>
<Text fontSize={0.14} color="#1d1d1d"  font="/fonts/wallpoet.ttf"
anchorX="left" anchorY="middle" textAlign="left"
position={[-8.4,2.75,-4.44]} rotation={[0,0,0]}
>
{`
PORTAL ROOM`}</Text>
{!LS_lowGraphics && LS_hasFirstKey && (
<Text fontSize={0.16} color="#1d1d1d"  font="/fonts/beanie.ttf"
anchorX="left" anchorY="middle" textAlign="left"
position={[-8.3,1.85,-4.44]} rotation={[0,0,0]}
>
{`
                         RESPONSE
______                   __________________    
45°N 10°E           Ocean, beautiful blue-green waves,
                    sun shining, solid ship head north
                    
                    └┴---__ ¶
                (from altitude 1500' above ■■■■■■)
 38°23' ■■■"N       battleground in civil war-low ■■■
 ■■■° 25' 00"W            cloudy, reservoirs ###STORM
`}
{/* {`
As a result of the experimentation carried out
on what might be termo micro-abilities, Swann expressed
the opinion that the insights obtained had strengthened
a macro-ability which had been researched prior
to his joining the SRI program; namely, the ability
to view remote locations.
`} */}
</Text>
)}



    {/* DECOYS */}
    <SolidBox size={[1,1.5,.5]} position={[-5,2,-1.4]} visible={false} />
    <group position={[-5,2,-1]} >
      
      <Box args={[1,1.5,1.3]}  >
        <meshStandardMaterial>
          <GradientTexture stops={[0, 1]} colors={["#ffffff", "#cccccc"]} size={4} />
        </meshStandardMaterial>
      </Box>
      {/* FIRST AID KIT */}
      <Box args={[0.3,0.7,0.1]}  position={[-0.12,-0.4,0.4]} castShadow
        onClick={(e)=>{
          console.log("clicked item")
          e.stopPropagation()
        }}
      >
        <meshStandardMaterial>
          <GradientTexture stops={[0, 1]} colors={["#ffeeee", "#ffcccc"]} size={4} />
        </meshStandardMaterial>
      </Box>
      <Box args={[1,1.5,0.6]}  position={[-1.5,0,0.25]} >
        <meshStandardMaterial color="#eeeeee"  side={2} />
      </Box>
    </group>

      


    {/* hidden codes */}
    <group position={[-8,2,4.5]} >
      <Text color="#333333"  position={[0,0.2,-0.01]}
        rotation={[0,Math.PI,0]} fontSize={0.10} font={"/fonts/beanie.ttf"}
      >
        {`CODE1: SCANATE

        Psychoenergetics (PSI) goes
        back to SRI → 1970+
            |
          ___    --.
        `}
      </Text>

      <Text color="#333333" position={[0,-0.4,-0.01]}
        rotation={[0,Math.PI,0.1]} fontSize={0.10} font={"/fonts/beanie.ttf"}
      >
        {`        |@
        SRI#GRILL FLAME
        2025 - Telepathy/ESP Tapes`}
      </Text>
      <Box args={[1.4,1.5,.65]}  >
        <meshStandardMaterial color="#dddddd"  side={2} />
      </Box>
    </group>

    {/* separator wall */}
    <StyledWall size={[5, 4, 0.5]} position={[-5.5, 2, -1]} />

    {/* south wall */}
    <StyledWall size={[1, 4, 10]} position={[-10, 2, 0]} />

    {/* left wall */}
    <StyledWall size={[10, 4, 1]} position={[-6, 2, -5]} />
  </>);
};



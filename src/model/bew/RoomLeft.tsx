'use client';
import { Box, Text, useFont } from '@react-three/drei';
import { StyledWall } from './StyledWall';
import { useBox } from '@react-three/cannon';
import { useEffect, useState } from 'react';

useFont.preload('/fonts/beanie.json')


export const RoomLeft = () => {
  // const font:any = useFont('/fonts/beanie.json');
  return (<>


  
  {/* DECOYS */}
<group position={[-5,2,-1]} >
<Box args={[1,1.5,1.15]}  castShadow
>
        <meshStandardMaterial color="#eeeeee"  side={2}
         />
      </Box>
<Box args={[0.1,0.5,0.05]}  position={[-0.12,-0.5,-0.5]} castShadow
>
        <meshStandardMaterial color="#ffffff" emissive={"#332222"} 
         />
      </Box>
<Box args={[0.5,0.2,0.2]}  position={[-1.5,-0.4,0.25]} castShadow
>
        <meshStandardMaterial color="#ffeeee" emissive={"#332222"}  side={2}
         />
      </Box>
<Box args={[1,1.5,0.6]}  position={[-1.5,0,0.25]} castShadow
>
        <meshStandardMaterial color="#eeeeee"  side={2}
         />
      </Box>
</group>

      


<group position={[-8,2,4.5]} >
<Text 
color="#333333" anchorX="center" anchorY="middle" position={[0,0.2,-0.01]}
rotation={[0,Math.PI,0]} fontSize={0.10} font={"/fonts/beanie.ttf"}
>
{`CODE1: SCANATE

Psychoenergetics (PSI) goes
back to SRI → 1970+
              |
           ___    --.
`}
</Text>

<Text 
color="#333333" anchorX="center" anchorY="middle" position={[0,-0.4,-0.01]}
rotation={[0,Math.PI,0.1]} fontSize={0.10} font={"/fonts/beanie.ttf"}
>
{`        |@
SRI#GRILL FLAME
2025 - Telepathy/ESP Tapes`}
</Text>
<Box args={[1,1.5,.65]}  castShadow
>
        <meshStandardMaterial color="#dddddd"  side={2}
         />
      </Box>
</group>

<StyledWall color="#ffffff" size={[5, 4, 0.5]} 
      position={[-5.5, 2, -1]} rotation={[0,0,0]} 
    />



    <StyledWall color="#ffffff" size={[1, 4, 10]} 
      position={[-10, 2, 0]} rotation={[0,0,0]} 
    />



{/* left wall */}
<StyledWall color="#ffffff"
        size={[10, 4, 1]}
        position={[-6, 2, -5]} 
         />
  </>);
};



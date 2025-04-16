'use client';
import { Box } from '@react-three/drei';
import { PhysicalTrigger } from '../core/PhysicalTrigger';
import { SolidBox } from '../core/SolidBox';
import { useState, useEffect, useRef } from 'react';
import { StyledWall } from '../core/StyledWall';
import { RegularKey } from '../bits/RegularKey';
import { useBew } from '../../../scripts/contexts/BewProvider';



export const ABDoorPortals = ({
   setPlayerPosition, hasFirstKey, setHasFirstKey,
   doorVisible, setDoorVisible, onFirstDoorOpened
}: {
  setPlayerPosition: (position: [number, number, number]) => void;
  hasFirstKey: boolean;
  setHasFirstKey: (hasFirstKey: boolean) => void;
  doorVisible: boolean;
  setDoorVisible: any;
  onFirstDoorOpened: () => void;
}) => {
  const { showSnackbar, closeSnackbar, playSoundEffect } = useBew();
  const [cooldown, setCooldown] = useState(false);
  // Use a ref to always have the latest value of hasFirstKey
  const hasKeyRef = useRef(hasFirstKey);

  // Monitor state changes and update the ref
  useEffect(() => {
    hasKeyRef.current = hasFirstKey;
  }, [hasFirstKey]);

const openDoorProcess = () => {
    onFirstDoorOpened();
    setTimeout(() => {
    setDoorVisible((prev:any) => {
      if (prev) {
        playSoundEffect('/sfx/short/ddoor.mp3');
      }
      return false;
    });
  }, 1000)
}



  return (<>






{/* FIRST KEY TRIGGER */}
{!hasFirstKey && 
<PhysicalTrigger triggerCount={1} visible={false}
      onCollide={(e) => {
        if (hasKeyRef.current) {
          return;
        }
        setHasFirstKey(true);
        showSnackbar("Great job! You've found the key", 'info');
        playSoundEffect("/sfx/keys.mp3")
        setTimeout(() => {
          closeSnackbar();
        }, 4000);
        // Directly update the ref for immediate access
        hasKeyRef.current = true;
      }}
      size={[1, 1, 1]}
      position={[-6.5, 0, 3]}
    />
}
    {!hasFirstKey && <group position={[-6.5, 0, 3]} rotation={[0, .3, 0]}><RegularKey /></group>}
  






      {/* front bevel */}
      <SolidBox color="#f7f7f7"
        size={[1.1, 1, 20.1]}
        position={[-4, 3.6, 5]} rotation={[0, -Math.PI / 2, 0]} />


<SolidBox color="#ffffff"
        size={[1, 4, 5]}
        position={[3.5, 2, 5]} rotation={[0, -Math.PI / 2, 0]} />
     
      {/* front bottom barriers */}
      <Box args={[5.1, 0.4, 1.1]} position={[3.5, 0, 5]}>
        <meshStandardMaterial color="#cccccc" />
      </Box>

<StyledWall color="#ffffff"
        size={[10, 4, 1]}
        position={[-6, 2, 5]} 
         />




{hasKeyRef.current && <>
    <PhysicalTrigger visible={false} triggerCount={999}
      onCollide={(e) => {
        // Use the ref value instead of the prop to get the latest state
        const currentHasKey = hasKeyRef.current;
        
        if (!currentHasKey) {
          return;
        }
        if (cooldown) {
          return;
        }
        setCooldown(true);
        openDoorProcess()
        
        
        setTimeout(() => {
          setDoorVisible(true);
          setCooldown(false);
        }, 3000);
      }}

      size={[1, 4, 0.2]}
      position={[0, 1, 4.8]}
      rotation={[0, 0, 0]} />
</>}



{/* actual opened door */}
{!doorVisible && (
  <>
    <SolidBox
    color="#ffddaa"
        castShadow={false}
        visible={true}
        size={[.2, 3.2, 1.6]}
        position={[-0.6, 1.6, 5.5]} rotation={[0, .5, 0]} />
        <group position={[-0.6, 1.6, 5.5]} rotation={[0, .5, 0]}>

    <Box position={[0.2,0,.5]} args={[.2, .2, .2]} castShadow>
      <meshStandardMaterial color="#cccccc" />
    </Box>
    </group>
    {/* doorknob */}
  </>
)}

{/* actual door */}
{doorVisible && (
  <>
    <SolidBox color="#ffddaa"
    onClick={()=>{
      showSnackbar("Find key, and approach the door", "handbook")
      setTimeout(() => {
        closeSnackbar();
      }, 4000);
    }}
        castShadow={false}
        visible={true}
        size={[.2, 4, 2]}
        position={[0, 2, 5]} rotation={[0, -Math.PI / 2, 0]} />
    {/* doorknob */}
    <Box position={[.5, 1.5, 4.75]} args={[.2, .2, .2]} castShadow>
      <meshStandardMaterial color="#cccccc" />
    </Box>
  </>
)}

{/* opened door */}
{doorVisible && (
  <>
    <SolidBox color="#ffddaa"
        castShadow={false}
        visible={true}
        size={[.2, 4, 2]}
        position={[0, 2, 5]} rotation={[0, -Math.PI / 2, 0]} />
    <Box position={[.5, 1.5, 4.75]} args={[.2, .2, .2]} castShadow>
      <meshStandardMaterial color="#cccccc" />
    </Box>
  </>
)}






    {/* door light */}
    <Box position={[0, 3.3, 4.45]} args={[.2, .2, .05]}>
      <meshStandardMaterial color="#cccccc" />
    </Box>
    <Box position={[0, 3.3, 4.45]} args={[.1, .1, .1]}>
      <meshStandardMaterial color={!cooldown ? "#ff5555" : "#55ff55"} />
    </Box>
    







    
  </>);
};



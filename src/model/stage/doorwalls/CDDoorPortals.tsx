'use client';
import { Box, Text } from '@react-three/drei';
import { CollisionBox } from '../core/CollisionBox';
import { SolidBox } from '../core/SolidBox';
import { useGameCore } from '@/../script/state/hook/useGameCore';
import { usePlayerStats } from '@/../script/state/hook/usePlayerStats';
import { useState } from 'react';

export const CDDoorPortals = ({ setPlayerPosition, code1, code2, code3 }: { setPlayerPosition: (position: [number, number, number]) => void,
  code1?: string,
  code2?: string,
  code3?: string }) => {

  const { hasExploredZone } = usePlayerStats();
  const { showSnackbar, closeSnackbar, playSoundEffect } = useGameCore();
  const [enterAttempt, setEnterAttempt] = useState(0);

  return (<>
    { (<>
<Text position={[-1.7, 1.75, -14.49]} rotation={[0, 0, 0]} anchorX="center" anchorY="middle"
textAlign="center" color={!!code1 ? "#4455e44" : "#444444"}
fontSize={0.2} 
>
  {!!code1 ? `
  CODE 1
  * * * * *` : `
  ENTER
  CODE 1
  ┌                ┐
  └                ┘
  `}
</Text>

{/* Trigger for code input */}
{
!code1 && (<>
<CollisionBox 
  size={[.5, 1, 0.2]}
  position={[-1.7, 1.75, -14.5]} 
  rotation={[0, 0, 0]}
  onCollide={(e) => {
    // Dispatch custom event to show the code input
    const showCodeInputEvent = new CustomEvent('showCodeInput');
    window.dispatchEvent(showCodeInputEvent);
    
    // Also directly try to show the input
    const codeInputElement = document.getElementById('code1');
    // only if its not already visible
    if (codeInputElement && (codeInputElement as HTMLInputElement).style.display !== "block") {
      if (!hasExploredZone("white_mirror_room")) {

        playSoundEffect('/sfx/tutorials/codes.ogg');
        showSnackbar("Codes are in the Portal Room and Psionic Hallway", "handbook", 5000);
      }
      (codeInputElement as HTMLInputElement).style.display = 'block';
      // (codeInputElement as HTMLInputElement).focus();
    }
  }}
/>
</>)}
</>)}



















{!!code1 && (<>
<Text position={[1.7, 1.75, -14.49]} rotation={[0, 0, 0]} anchorX="center" anchorY="middle"
textAlign="center" color={!!code2 ? "#4455e44" : "#444444"}
fontSize={0.2} 
>
  {!!code2 ? `
  CODE 2
  * * * * *` : `
  ENTER
  CODE#2
  ┌                ┐
  └                ┘
  `}
</Text>

{/* Trigger for code input */}
{!!code1 && (<>
<CollisionBox 
  size={[.5, 1, 0.2]}
  position={[1.7, 1.75, -14.5]} 
  rotation={[0, 0, 0]}
  onCollide={(e) => {
    // Dispatch custom event to show the code input
    const showCodeInputEvent = new CustomEvent('showCodeInput');
    window.dispatchEvent(showCodeInputEvent);
    
    // Also directly try to show the input
    const codeInputElement = document.getElementById('code2');
    if (codeInputElement) {
      (codeInputElement as HTMLInputElement).style.display = 'block';
      // (codeInputElement as HTMLInputElement).focus();
    }
  }}
/>
</>)}
</>)}
















{(!!code1 && !!code2) && (<>
      <SolidBox color="#cccccc"
        size={[1.6, 3.1, .2]}
        position={[0.5, 1.6, -15.5]}   rotation={[0, -1, 0]}
      />
      {/* doorknob */}
      <group rotation={[0, -1, 0]}  position={[0.5, 1.6, -15.5]}>
        
      <Box args={[.2, .2, .2]} position={[-.6, 0, .1]} castShadow>
        <meshStandardMaterial color="#eeeeee"  />
      </Box>
      </group>

</>)}
      {/* front door */}
{(!code1 || !code2) && (<>
      <SolidBox color="#cccccc"
      onClick={(e) => {
        e.stopPropagation();
        playSoundEffect('/sfx/short/errorbip.mp3');
        setEnterAttempt(prev => prev + 1);
        if (!hasExploredZone("white_mirror_room") && enterAttempt == 3) {

          playSoundEffect('/sfx/tutorials/codes.ogg');
          showSnackbar("Codes are in the Portal Room and Psionic Hallway", "handbook", 5000);
        }
      }}
        size={[2, 3.1, .2]}
        position={[0, 1.6, -15]}   rotation={[0, 0, 0]}
      />
      {/* doorknob */}
      <group rotation={[0, 0, 0]}  position={[0, 1.6, -15]}>
        
      <Box args={[.2, .2, .2]} position={[-.6, 0, .1]} castShadow>
        <meshStandardMaterial color="#eeeeee"  />
      </Box>
      </group>
      </>)}








      {/* front wall */}
      <SolidBox color="#ffffff"
        size={[1, 4, 5]}
        position={[3.5, 2, -15]} rotation={[0, -Math.PI / 2, 0]} 
      />
      <SolidBox color="#ffffff"
        size={[1, 4, 5]}
        position={[-3.5, 2, -15]} rotation={[0, -Math.PI / 2, 0]} 
      />
      {/* front bevel */}
      <SolidBox color="#f7f7f7"
        size={[1, 1, 12.1]}
        position={[0, 3.6, -14.8]} rotation={[0, -Math.PI / 2, 0]} 
      />
      {/* front bottom barriers */}
      <Box args={[5.1,0.4,1]} position={[3.5,0,-14.9]}>
            <meshStandardMaterial color="#cccccc" />
          </Box>
      <Box args={[5.1,0.4,1]} position={[-3.5,0,-14.9]}>
            <meshStandardMaterial color="#cccccc" />
          </Box>



    
  </>);
};

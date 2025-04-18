'use client';
import { SolidBox } from '../../../core/SolidBox';
import { CollisionBox } from '../../../core/CollisionBox';
import { TheChair } from './TheChair';
import { TheTable } from './TheTable';
import { Box, Plane, Text, Text3D } from '@react-three/drei';
import { usePlayerStats } from '@/../script/state/hook/usePlayerStats';
import { useGameCore } from '@/../script/state/hook/useGameCore';

export interface TheRoomProps {
  onChairSit?: (e: any) => void;
  onRoomEnter?: (e: any) => void;
  setShowWhiteMirror?: (show: boolean) => void;
  showWhiteMirror?: boolean;
  analysisResult?: any;
  isTransitioning?: boolean;
}

export const TheRoom = ({
  onChairSit,
  onRoomEnter,
  isTransitioning,
  setShowWhiteMirror,
  showWhiteMirror,
  analysisResult
}: TheRoomProps) => {

  const { playSoundEffect } = useGameCore();
  const { hasExploredZone, updateExploredStatus, mindStats } = usePlayerStats();
  
  return (<>
  
<SolidBox color="#eeeeee"
        visible={false}
        size={[4, 1, 2]}
        position={[0, .5, -21.5]} rotation={[0, 0, 0]} />

<group position={[0, 0, -21.5]}>

      <TheTable />
      <group position={[2.5, 0, 0]} rotation={[0, 2, 0]}
      onClick={(e:any) => {
        if (showWhiteMirror) return;
        if (isTransitioning) return;
        e.stopPropagation()
        onChairSit && onChairSit(e)
      }}
      >
        <TheChair />
      </group>
</group>
<CollisionBox color="#ffeeee"
        
        size={[1.2, 2, 1.2]}
        position={[2.4, 1, -21.5]} 
        onCollide={onChairSit}
        
    />

{!showWhiteMirror && (





    <group position={[0, 0, 0]} rotation={[0, 0, 0]}>



<CollisionBox color="#ffeeee" 
        triggerCount={1}
        size={[6, 1.5, 1]}
        // position={[0, .75, -4]} 
        position={[0, .75, -18]} 
        rotation={[0, 0, 0]}
        onCollide={onRoomEnter}
    />












      {/* the room */}
      <group position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <SolidBox size={[13, 4, 1]} color="#ffffff"
          position={[-6, 2, -20]} rotation={[0, Math.PI / 2, 0]} />
        <SolidBox size={[13, 4, 1]} color="#ffffff"
          position={[6, 2, -20]} rotation={[0, Math.PI / 2, 0]} />
      </group>
      <SolidBox color="#eeeeee"
        size={[1, 1, 12.1]}
        position={[0, .5, -27]} rotation={[0, -Math.PI / 2, 0]} />
        <SolidBox color="#eeeeee"
        size={[4, 3, 1]}
        position={[-4, 2.5, -27]} />
        <SolidBox color="#eeeeee"
        size={[4, 3, 1]}
        position={[4, 2.5, -27]} />
        <SolidBox color="#eeeeee"
        size={[4,1.5, 1]}
        position={[0, 3.5, -27]} />


{!(

!!analysisResult &&
!!mindStats?.cash && mindStats?.cash > 10000 &&
!!mindStats?.color && mindStats?.color > 10 &&
!!mindStats?.solid && mindStats?.solid > 10 

) && (<>
<SolidBox color="#eeeeee"
        size={[4, 2, .9]}
        position={[0, 2, -27]} />
</>)}
{!!analysisResult && !hasExploredZone("credits") && (<>
<CollisionBox color="#eeeeee"
        triggerCount={1}
        onCollide={() => {
          updateExploredStatus("credits", true)
          playSoundEffect('/sfx/credits.mp3');
        }}
        size={[4, 2, .9]}
        position={[0, 2, -27.5]} />
</>)}
{!!analysisResult &&
!!mindStats?.cash && mindStats?.cash > 10000 &&
!!mindStats?.color && mindStats?.color > 10 &&
!!mindStats?.solid && mindStats?.solid > 10 &&
hasExploredZone("credits") && (<CreditsCube />)}

    </group>
)}
    </>);
};





const CreditsCube = () => {
  return (<>
  
  <pointLight position={[0, 2, -30]} intensity={15}
         distance={5} color="#ffffff" castShadow
         />
         <Plane args={[4, 2]} position={[0, 2, -27.51]} rotation={[0, Math.PI, 0]}>
          <meshStandardMaterial color="#ffffff" 
          emissive="#aaaaaa"
           />
         </Plane>
         
         <Text3D  font="/fonts/consolas.json" position={[-4.6, 0.1, -32]}  castShadow
         size={1.5}
         >
          {'@WEBDUNO'}
  <meshNormalMaterial />
</Text3D>
        <Box receiveShadow
        args={[11.99, 3.59, 8.99]} position={[0, 1.8, -32]} rotation={[0, 0, 0]}>
          <meshStandardMaterial color="#ffffff" side={1}
          emissive="#555555"
           />
        </Box>
  </>)
}

'use client';
import { Box } from '@react-three/drei';
import { PhysicalWall } from './PhysicalWall';
import { PhysicalTrigger } from './PhysicalTrigger';

export interface TheRoomProps {
  onChairSit?: (e: any) => void;
  onRoomEnter?: (e: any) => void;
  setShowWhiteMirror?: (show: boolean) => void;
  showWhiteMirror?: boolean;
}

export const TheRoom = ({ onChairSit, onRoomEnter, setShowWhiteMirror, showWhiteMirror }: TheRoomProps) => {


  
  return (<>
  
<PhysicalWall color="#eeeeee"
        visible={false}
        size={[4, 1, 2]}
        position={[0, .5, -21.5]} rotation={[0, 0, 0]} />

<group position={[0, 0, -21.5]}>

      <TheTable />
      <group position={[2.5, 0, 0]} rotation={[0, 2, 0]}>
        <TheChair />
      </group>
</group>
{!showWhiteMirror && (





    <group position={[0, 0, 0]} rotation={[0, 0, 0]}>



<PhysicalTrigger color="#ffeeee" visible={false}
        triggerCount={1}
        size={[6, 1.5, 1]}
        // position={[0, .75, -4]} 
        position={[0, .75, -18]} 
        rotation={[0, 0, 0]}
        onCollide={onRoomEnter}
    />




<PhysicalTrigger color="#ffeeee"
        visible={false}
        size={[1, 1.5, 1]}
        position={[2.3, .75, -21.25]} 
        onCollide={onChairSit}
    />









      {/* the room */}
      <group position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <PhysicalWall size={[13, 4, 1]}
          position={[-6, 2, -20]} rotation={[0, Math.PI / 2, 0]} />
        <PhysicalWall size={[13, 4, 1]}
          position={[6, 2, -20]} rotation={[0, Math.PI / 2, 0]} />
      </group>
      <PhysicalWall color="#eeeeee"
        size={[1, 4, 12.1]}
        position={[0, 2, -27]} rotation={[0, -Math.PI / 2, 0]} />
    </group>
)}
    </>);
};


export const TheTable = () => {
  return (
    <group position={[0, 0, 0]}>
        
      {/* table top  */}
      <Box args={[3, .2, 2]} castShadow receiveShadow
        position={[0, .81, 0]}>
        <meshStandardMaterial color="#eeeeee" />
      </Box>
      {/* table legs */}
      <Box args={[.2, 1, .2]} castShadow
        position={[-1.2, 0.4, -0.9]}>
        <meshStandardMaterial color="#eeeeee" />
      </Box>
      <Box args={[.2, 1, .2]} castShadow
        position={[1.2, 0.4, -0.9]}>
        <meshStandardMaterial color="#eeeeee" />
      </Box>
      <Box args={[.2, 1, .2]} castShadow
        position={[-1.2, 0.4, 0.9]}>
        <meshStandardMaterial color="#eeeeee" />
      </Box>
      <Box args={[.2, 1, .2]} castShadow
        position={[1.2, 0.4, 0.9]}>
        <meshStandardMaterial color="#eeeeee" />
      </Box>
      </group>
  );
};

export const TheChair = ({ position = [0, 0, 0] }: { position?: [number, number, number] }) => {
  return (
    <group position={position}>
      {/* seat */}
      <Box args={[1, 0.1, 1]} castShadow
        position={[0, 0.6, 0]}>
        <meshStandardMaterial color="#dddddd" />
      </Box>
      {/* backrest */}
      <Box args={[.9, 1, 0.1]} castShadow
        position={[0, 1, 0.5]}>
        <meshStandardMaterial color="#dddddd" />
      </Box>
      {/* chair legs */}
      <Box args={[0.1, 0.5, 0.1]} castShadow
        position={[-0.4, 0.3, -0.4]}>
        <meshStandardMaterial color="#dddddd" />
      </Box>
      <Box args={[0.1, 0.5, 0.1]} castShadow
        position={[0.4, 0.3, -0.4]}>
        <meshStandardMaterial color="#dddddd" />
      </Box>
      <Box args={[0.1, 0.5, 0.1]} castShadow
        position={[-0.4, 0.3, 0.4]}>
        <meshStandardMaterial color="#dddddd" />
      </Box>
      <Box args={[0.1, 0.5, 0.1]} castShadow
        position={[0.4, 0.3, 0.4]}>
        <meshStandardMaterial color="#dddddd" />
      </Box>
    </group>
  );
};

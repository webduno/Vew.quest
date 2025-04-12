'use client';
import { PhysicalWall } from '../../core/PhysicalWall';
import { PhysicalTrigger } from '../../core/PhysicalTrigger';
import { TheChair } from './TheChair';
import { TheTable } from './TheTable';

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
<PhysicalTrigger color="#ffeeee"
        visible={false}
        size={[1, 1.5, 1]}
        position={[2.3, .75, -21.25]} 
        onCollide={onChairSit}
    />

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




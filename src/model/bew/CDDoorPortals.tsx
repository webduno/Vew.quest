'use client';
import { Box } from '@react-three/drei';
import { PhysicalTrigger } from './PhysicalTrigger';
import { PhysicalWall } from './PhysicalWall';




export const CDDoorPortals = ({ setPlayerPosition }: { setPlayerPosition: (position: [number, number, number]) => void; }) => {
  return (<>




      {/* front door */}
      <PhysicalWall color="#eeeeee"
        size={[1.6, 3.1, .2]}
        position={[0.5, 1.6, -15.5]}   rotation={[0, -1, 0]}
      />
      {/* doorknob */}
      <group rotation={[0, -1, 0]}  position={[0.5, 1.6, -15.5]}>
        
      <Box args={[.2, .2, .2]} position={[-.6, 0, .1]} castShadow>
        <meshStandardMaterial color="#aaaaaa"  />
      </Box>
      </group>
      {/* front wall */}
      <PhysicalWall color="#ffffff"
        size={[1, 4, 5]}
        position={[3.5, 2, -15]} rotation={[0, -Math.PI / 2, 0]} 
      />
      <PhysicalWall color="#ffffff"
        size={[1, 4, 5]}
        position={[-3.5, 2, -15]} rotation={[0, -Math.PI / 2, 0]} 
      />
      {/* front bevel */}
      <PhysicalWall color="#f7f7f7"
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

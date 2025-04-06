'use client';
import { Box } from '@react-three/drei';
import { PhysicalTrigger } from './PhysicalTrigger';
import { PhysicalWall } from './PhysicalWall';




export const ABDoorPortals = ({ setPlayerPosition }: { setPlayerPosition: (position: [number, number, number]) => void; }) => {
  return (<>



  

<PhysicalWall color="#ffffff"
        size={[1, 4, 5]}
        position={[3.5, 2, 5]} rotation={[0, -Math.PI / 2, 0]} />
      <PhysicalWall color="#ffffff"
        size={[1, 4, 5]}
        position={[-3.5, 2, 5]} rotation={[0, -Math.PI / 2, 0]} />
      {/* front bevel */}
      <PhysicalWall color="#f7f7f7"
        size={[1.1, 1, 12.1]}
        position={[0, 3.6, 5]} rotation={[0, -Math.PI / 2, 0]} />

      {/* front bottom barriers */}
      <Box args={[5.1, 0.4, 1.1]} position={[3.5, 0, 5]}>
        <meshStandardMaterial color="#cccccc" />
      </Box>
      <Box args={[5.1, 0.4, 1.1]} position={[-3.5, 0, 5]}>
        <meshStandardMaterial color="#cccccc" />
      </Box>


    <PhysicalTrigger visible={false} triggerCount={999}
      onCollide={() => {
        setPlayerPosition && setPlayerPosition([0, 0, 6.5]);
      }}

      size={[2, 4, 1]}
      position={[0, 1, 4.5]}
      rotation={[0, 0, 0]} />




    {/* door light */}
    <Box position={[0, 3.3, 4.45]} args={[.12, .12, .05]}>
      <meshStandardMaterial color="#cccccc" />
    </Box>
    <Box position={[0, 3.3, 4.45]} args={[.06, .06, .1]}>
      <meshStandardMaterial color="#55ff55" />
    </Box>
    
    <PhysicalWall color="#ffddaa"
      visible
      size={[.2, 4, 2]}
      position={[0, 2, 5]} rotation={[0, -Math.PI / 2, 0]} />
    {/* doorknob */}
    <Box position={[.5, 1.5, 4.75]} args={[.2, .2, .2]} castShadow>
      <meshStandardMaterial color="#cccccc" />
    </Box>
    <Box position={[-.5, 1.5, 5.25]} args={[.2, .2, .2]} castShadow>
      <meshStandardMaterial color="#cccccc" />
    </Box>








    
  </>);
};

'use client';
import { Box, Text } from '@react-three/drei';
import { PhysicalTrigger } from './PhysicalTrigger';
import { PhysicalWall } from './PhysicalWall';




export const CDDoorPortals = ({ setPlayerPosition }: { setPlayerPosition: (position: [number, number, number]) => void; }) => {
  return (<>
    <Text position={[1.7, 1.75, -14.49]} rotation={[0, 0, 0]} anchorX="center" anchorY="middle"
    textAlign="center" color="#444444"
    fontSize={0.2} 
    >
      {`
      ENTER
      CODE 2
      ┌                ┐
      └                ┘
      `}
    </Text>
    
<Text position={[-1.7, 1.75, -14.49]} rotation={[0, 0, 0]} anchorX="center" anchorY="middle"
textAlign="center" color="#444444"
fontSize={0.2} 
>
  {`
  ENTER
  CODE 1
  ┌                ┐
  └                ┘
  `}
</Text>



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

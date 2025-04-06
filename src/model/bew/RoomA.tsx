'use client';
import { Box } from '@react-three/drei';
import { PhysicalWall } from './PhysicalWall';



export const RoomA = () => {
  return (<>









  

      {/* ////////////////////////////////////////////////////// */}
      

      <group position={[0, 0, 0]} rotation={[0, 0, 0]}>
        {/* real door */}
        <PhysicalWall  size={[1.5, 3, 0.75]} color="#dddddd"
          position={[-3, 1.5, 8.25]} rotation={[0, Math.PI / 2, 0]} 
        />
        {/* doorknob */}
        <Box position={[-2.6, 1.5, 8.75]} args={[.2, .2, .2]} castShadow>
          <meshStandardMaterial color="#aaaaaa"  />
        </Box>

      </group>

        {/* OPENED real door */}
        <PhysicalWall  size={[0.2, 3, 1.5]} color="#dddddd"
          position={[3.5, 1.5, 8.5]} rotation={[0, -1, 0]} 
        />
      <group position={[3.5, 1.5, 8.5]} rotation={[0, -1, 0]} >
      {/* doorknob */}
        <Box position={[-0.2,0,-.5]} args={[.2, .2, .2]} castShadow >
          <meshStandardMaterial color="#aaaaaa"  />
        </Box>

      </group>











{/* behind landing walls */}

<group position={[0, 0, 0]} rotation={[0, 0, 0]}>
        {/* left wall */}
        <PhysicalWall   color="#ffffff"
        size={[6, 4, 1]}
          position={[-3, 2, 12]} rotation={[0, Math.PI / 2, 0]} 
        />
        {/* right wall */}
        <PhysicalWall  color="#ffffff"
        size={[6, 4, 1]}
        position={[3, 2, 12]} rotation={[0, -Math.PI / 2, 0]} />
      </group>





          {/* Bottom Borders */}
          <Box args={[1.1,0.4,6.1]} position={[3,0,12]}>
            <meshStandardMaterial color="#cccccc" />
          </Box>

          <Box args={[1.1,0.4,6.1]} position={[-3,0,12]}>
            <meshStandardMaterial color="#cccccc" />
          </Box>







      {/* doors */}
      <Box position={[0.51, 1.25, 15]} args={[1, 2.5, 1.1]}>
        <meshStandardMaterial color="#dddddd" />
      </Box>
      <Box position={[-0.51, 1.25, 15]} args={[1, 2.5, 1.1]}>
        <meshStandardMaterial color="#dddddd" />
      </Box>
      <Box position={[0, 1.25, 15]} args={[2.05, 2.55, 1.05]}>
        <meshStandardMaterial color="#cccccc" />
      </Box>
      {/* back wall */}
      <PhysicalWall 
        size={[1, 4, 6.5]} color="#ffffff"
        position={[0, 2, 15]} rotation={[0, -Math.PI / 2, 0]} 
      />
      <PhysicalWall color="#f0f0f0"
        size={[1.2, 1, 8.1]}
        position={[0, 3.6, 15]} rotation={[0, -Math.PI / 2, 0]} 
      />
  </>);
};

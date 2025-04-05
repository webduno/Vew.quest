'use client';
import { Box } from '@react-three/drei';
import { PhysicalFloor } from './PhysicalFloor';
import { PhysicalWall } from './PhysicalWall';


export const BewMainScene = () => {

  return (
    <group position={[0, 0, 0]}>

      
      
      
      <Box args={[16, 1, 60]} position={[0, 4, -14]}>
        <meshStandardMaterial color="#ffffff" />
      </Box>
      <PhysicalFloor />




      












      {/* front door */}
      <PhysicalWall color="#ffffff"
        size={[1.6, 3, .2]}
        position={[0.5, 1.5, -15.5]} rotation={[0, -1, 0]} 
      />
      {/* front wall */}
      <PhysicalWall 
        size={[1, 4, 5]}
        position={[3.5, 2, -15]} rotation={[0, -Math.PI / 2, 0]} 
      />
      <PhysicalWall 
        size={[1, 4, 5]}
        position={[-3.5, 2, -15]} rotation={[0, -Math.PI / 2, 0]} 
      />
      {/* front bevel */}
      <PhysicalWall color="#cccccc"
        size={[1.2, 1, 12]}
        position={[0, 3.6, -15]} rotation={[0, -Math.PI / 2, 0]} 
      />



      

      {/* top bevels */}
      <group position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <PhysicalWall  size={[30.5, 1, 1.2]} color="#cccccc"
        position={[-3, 3.5, 0]} rotation={[0, Math.PI / 2, 0]} />
        <PhysicalWall 
        size={[30.5, 1, 1.2]} color="#cccccc"
        position={[3, 3.5, 0]} rotation={[0, -Math.PI / 2, 0]} />
      </group>











    <group position={[0, 0, 0]} rotation={[0, 0, 0]}>
      <PhysicalWall  size={[12, 4, 1]}
      position={[-3, 2, -9]} rotation={[0, Math.PI / 2, 0]} />
      <PhysicalWall 
      size={[12, 4, 1]}
      position={[3, 2, -9]} rotation={[0, -Math.PI / 2, 0]} />
    </group>






      <group position={[0, 0, 0]} rotation={[0, 0, 0]}>
        {/* real door */}
        <PhysicalWall  size={[1.5, 3, 0.75]} color="#ffffff"
          position={[-3, 1.5, -2.25]} rotation={[0, Math.PI / 2, 0]} 
        />
        {/* fake door */}
        <Box position={[-3, 1.5, -2.25]} args={[.5, 3, 1.75]}>
          <meshStandardMaterial color="#ffffff" 
          metalness={0.85} roughness={0.85} />
        </Box>
      </group>

      <group position={[0, 0, 0]} rotation={[0, 0, 0]}>
        {/* real door */}
        <PhysicalWall  size={[1.5, 3, 0.75]} color="#ffffff"
          position={[3, 1.5, -2.25]} rotation={[0, Math.PI / 2, 0]} 
        />
        {/* fake door */}
        <Box position={[3, 1.5, -2.25]} args={[.5, 3, 1.75]}>
          <meshStandardMaterial color="#ffffff" 
          metalness={0.85} roughness={0.85} />
        </Box>
      </group>
      {/* ////////////////////////////////////////////////////// */}
      

      <group position={[0, 0, 0]} rotation={[0, 0, 0]}>
        {/* real door */}
        <PhysicalWall  size={[1.5, 3, 0.75]} color="#ffffff"
          position={[-3, 1.5, 8.25]} rotation={[0, Math.PI / 2, 0]} 
        />
        {/* fake door */}
        <Box position={[-3, 1.5, 8.25]} args={[.5, 3, 1.75]}>
          <meshStandardMaterial color="#ffffff" 
          metalness={0.85} roughness={0.85} />
        </Box>
      </group>

      <group position={[0, 0, 0]} rotation={[0, 0, 0]}>
        {/* real door */}
        <PhysicalWall  size={[1.5, 3, 0.75]} color="#ffffff"
          position={[3, 1.5, 8.25]} rotation={[0, Math.PI / 2, 0]} 
        />
        {/* fake door */}
        <Box position={[3, 1.5, 8.25]} args={[.5, 3, 1.75]}>
          <meshStandardMaterial color="#ffffff" 
          metalness={0.85} roughness={0.85} />
        </Box>
      </group>







      <group position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <PhysicalWall  size={[9, 4, 1]}
          position={[-3, 2, 3]} rotation={[0, Math.PI / 2, 0]} 
        />
        <PhysicalWall 
        size={[9, 4, 1]}
        position={[3, 2, 3]} rotation={[0, -Math.PI / 2, 0]} />
      </group>

      <group position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <PhysicalWall  
        size={[6, 4, 1]}
          position={[-3, 2, 12]} rotation={[0, Math.PI / 2, 0]} 
        />
        <PhysicalWall 
        size={[6, 4, 1]}
        position={[3, 2, 12]} rotation={[0, -Math.PI / 2, 0]} />
      </group>







      {/* doors */}
      <Box position={[0.52, 1.5, 15]} args={[1, 3, 1.1]}>
        <meshStandardMaterial color="#ffffff" />
      </Box>
      <Box position={[-0.52, 1.5, 15]} args={[1, 3, 1.1]}>
        <meshStandardMaterial color="#ffffff" />
      </Box>
      {/* back wall */}
      <PhysicalWall 
        size={[1, 4, 8]}
        position={[0, 2, 15]} rotation={[0, -Math.PI / 2, 0]} 
      />


    </group>
  );
};

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
      <PhysicalWall color="#eeeeee"
        size={[1.6, 3.1, .2]}
        position={[0.5, 1.6, -15.5]}   rotation={[0, -1, 0]}
      />
      {/* doorknob */}
      <group rotation={[0, -1, 0]}  position={[0.5, 1.6, -15.5]}>
        
      <Box args={[.2, .2, .2]} position={[-.6, 0, .1]}>
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
        size={[1, 1, 12]}
        position={[0, 3.6, -14.8]} rotation={[0, -Math.PI / 2, 0]} 
      />
      {/* front bottom barriers */}
      <Box args={[5.1,0.4,1]} position={[3.5,0,-14.9]}>
            <meshStandardMaterial color="#cccccc" />
          </Box>
      <Box args={[5.1,0.4,1]} position={[-3.5,0,-14.9]}>
            <meshStandardMaterial color="#cccccc" />
          </Box>



      

      {/* top bevels */}
  
      {/* top bevels */}
      <group position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <PhysicalWall  size={[30.5, 1, 1.2]} color="#f7f7f7"
        position={[-3, 3.5, 0]} rotation={[0, Math.PI / 2, 0]} />
        <PhysicalWall 
        size={[30.5, 1, 1.2]} color="#f7f7f7"
        position={[3, 3.5, 0]} rotation={[0, -Math.PI / 2, 0]} />
      </group>












    <group position={[0, 0, 0]} rotation={[0, 0, 0]}>
      <PhysicalWall  size={[12, 4, 1]} color="#ffffff"
      position={[-3, 2, -9]} rotation={[0, Math.PI / 2, 0]} />
      <PhysicalWall  color="#ffffff"
      size={[12, 4, 1]}
      position={[3, 2, -9]} rotation={[0, -Math.PI / 2, 0]} />
    </group>
          {/* Bottom Borders */}
          <Box args={[1,0.4,12.08]} position={[2.95,0,-9]}>
            <meshStandardMaterial color="#cccccc" />
          </Box>

          <Box args={[1,0.4,12.08]} position={[-2.95,0,-9]}>
            <meshStandardMaterial color="#cccccc" />
          </Box>







      <group position={[0, 0, 0]} rotation={[0, 0, 0]}>
        {/* real door */}
        <PhysicalWall  size={[1.5, 3, 0.3]} color="#dddddd"
          position={[-2.75, 1.5, -2.25]} rotation={[0, Math.PI / 2, 0]} 
        />
        {/* door knob */}
        <Box position={[-2.6, 1.5, -1.75]} args={[.2, .2, .2]}>
          <meshStandardMaterial color="#aaaaaa"  />
        </Box>
      </group>

      <group position={[0, 0, 0]} rotation={[0, 0, 0]}>
        {/* real door */}
        <PhysicalWall  size={[1.5, 3, 0.3]} color="#dddddd"
          position={[2.75, 1.5, -2.25]} rotation={[0, Math.PI / 2, 0]} 
        />
        {/* door knob */}
        <Box position={[2.6, 1.5, -2.75]} args={[.2, .2, .2]}>
          <meshStandardMaterial color="#aaaaaa"  />
        </Box>
      </group>
      {/* ////////////////////////////////////////////////////// */}
      

      <group position={[0, 0, 0]} rotation={[0, 0, 0]}>
        {/* real door */}
        <PhysicalWall  size={[1.5, 3, 0.75]} color="#dddddd"
          position={[-3, 1.5, 8.25]} rotation={[0, Math.PI / 2, 0]} 
        />
        {/* doorknob */}
        <Box position={[-2.6, 1.5, 8.75]} args={[.2, .2, .2]}>
          <meshStandardMaterial color="#aaaaaa"  />
        </Box>

      </group>

      <group position={[0, 0, 0]} rotation={[0, 0, 0]}>
        {/* real door */}
        <PhysicalWall  size={[1.5, 3, 0.75]} color="#dddddd"
          position={[3, 1.5, 8.25]} rotation={[0, Math.PI / 2, 0]} 
        />
        {/* doorknob */}
        <Box position={[2.6, 1.5, 7.75]} args={[.2, .2, .2]}>
          <meshStandardMaterial color="#aaaaaa"  />
        </Box>

      </group>








{/* landing walls */}
      <group position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <PhysicalWall  size={[9, 4, 1]} color="#ffffff"
          position={[-3, 2, 3]} rotation={[0, Math.PI / 2, 0]} 
        />
        <PhysicalWall 
        size={[9, 4, 1]} color="#ffffff"
        position={[3, 2, 3]} rotation={[0, -Math.PI / 2, 0]} />
      </group>

          {/* Bottom Borders */}
          <Box args={[1,0.4,9.1]} position={[2.95,0,3]}>
            <meshStandardMaterial color="#cccccc" />
          </Box>

          <Box args={[1,0.4,9.1]} position={[-2.95,0,3]}>
            <meshStandardMaterial color="#cccccc" />
          </Box>











{/* behind landing walls */}
      <group position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <PhysicalWall   color="#ffffff"
        size={[6, 4, 1]}
          position={[-3, 2, 12]} rotation={[0, Math.PI / 2, 0]} 
        />
        <PhysicalWall  color="#ffffff"
        size={[6, 4, 1]}
        position={[3, 2, 12]} rotation={[0, -Math.PI / 2, 0]} />
      </group>
          {/* Bottom Borders */}
          <Box args={[1,0.4,6.1]} position={[2.95,0,12]}>
            <meshStandardMaterial color="#cccccc" />
          </Box>

          <Box args={[1,0.4,6.1]} position={[-2.95,0,12]}>
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
        size={[1, 4, 8]} color="#ffffff"
        position={[0, 2, 15]} rotation={[0, -Math.PI / 2, 0]} 
      />
      <PhysicalWall color="#f0f0f0"
        size={[1.2, 1, 12]}
        position={[0, 3.6, 15]} rotation={[0, -Math.PI / 2, 0]} 
      />


    </group>
  );
};




export const BewPreMainScene = () => {
  return (
    <group position={[0, 0, 0]}>
      
      <PhysicalWall color="#ffffff"
        size={[1, 4, 5]}
        position={[3.5, 2, -5]} rotation={[0, -Math.PI / 2, 0]} 
      />
      <PhysicalWall color="#ffffff"
        size={[1, 4, 5]}
        position={[-3.5, 2, -5]} rotation={[0, -Math.PI / 2, 0]} 
      />
      {/* front bevel */}
      <PhysicalWall color="#f7f7f7"
        size={[1, 1, 12]}
        position={[0, 3.6, -4.8]} rotation={[0, -Math.PI / 2, 0]} 
      />
      {/* front bottom barriers */}
      <Box args={[5.1,0.4,1.1]} position={[3.5,0,-5]}>
            <meshStandardMaterial color="#cccccc" />
          </Box>
      <Box args={[5.1,0.4,1.1]} position={[-3.5,0,-5]}>
            <meshStandardMaterial color="#cccccc" />
          </Box>

          

      <PhysicalWall 
        size={[.2, 4, 2]}
        position={[0, 2, -5]} rotation={[0, -Math.PI / 2, 0]} 
      />
      {/* door knob */}
      <Box position={[-.5, 1.5, -4.75]} args={[.2, .2, .2]}>
        <meshStandardMaterial color="#aaaaaa"  />
      </Box>
    </group>
  );
};
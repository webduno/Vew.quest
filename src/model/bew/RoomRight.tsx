'use client';
import { StyledWall } from './StyledWall';



export const RoomRight = () => {
  return (<>

    <StyledWall color="#ffffff" size={[1, 4, 26]} 
      position={[9, 2, 2]} rotation={[0,0,0]} 
    />

<StyledWall color="#ffffff" size={[6, 4, 1]} 
      position={[6, 2, 15]} rotation={[0,0,0]} 
    />
    <StyledWall color="#ffffff" size={[6, 4, 1]} 
          position={[6, 2, -11]} rotation={[0,0,0]} 
        />
  </>);
};


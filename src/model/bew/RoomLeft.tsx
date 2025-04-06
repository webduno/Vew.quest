'use client';
import { StyledWall } from './StyledWall';
import { useBox } from '@react-three/cannon';


export const RoomLeft = () => {
  return (<>






    <StyledWall color="#ffffff" size={[1, 4, 10]} 
      position={[-10, 2, 0]} rotation={[0,0,0]} 
    />

  </>);
};



'use client';
import { StyledWall } from './StyledWall';
import { useBox } from '@react-three/cannon';


export const RoomRight = () => {
  return (<>

    <CardboardBox position={[5.25, 1, 1]} size={[1.25, 1.25, 1.25]}  />
    <CardboardBox position={[7.25, 1., 1]} size={[1.5, 1.5, 1.5]}  
      rotation={[0, 1, 0]}
    />
    <CardboardBox position={[7.25, 1., 0.2]} size={[1.5, 1.5, .5]}  />
    <CardboardBox position={[7.25, 2.5, 1.5]} size={[0.75, 0.5, 0.75]}  />
    <CardboardBox position={[6.5, 1, -2]} />



    <StyledWall color="#ffffff" size={[3, 4, 0.25]} 
      position={[7, 2, -2]} rotation={[0,0,0]} 
    />


    
    <CardboardBox position={[7, 0.8, -3]} size={[1.5, 1.5, 2]}  />
    <CardboardBox position={[7, 2.5, -3]} size={[1.5, 0.5, 1.5]}  />









    <StyledWall color="#ffffff" size={[1, 4, 26]} 
      position={[9, 2, 2]} rotation={[0,0,0]} 
    />

<StyledWall color="#ffffff" size={[6, 4, 1]} 
      position={[6, 2, 15]} rotation={[0,0,0]} 
    />
    <StyledWall color="#ffffff" size={[5.5, 4, 1]} 
          position={[6, 2, -11]} rotation={[0,0,0]} 
        />
  </>);
};


export const CardboardBox = ({
  color = "#ffddaa",
  position = [0, 0, 0],
  size = [1, 1, 1],
  rotation = [0, 0, 0]
}: {
  color?: string,
  position?: [number, number, number],
  size?: [number, number, number],
  rotation?: [number, number, number]}
) => {

  const [ref] = useBox<any>(() => ({
    position: position,
    rotation: rotation,
    args: size,
    type: 'Dynamic',
    mass: 100,
    // friction: 5,
  }));

  return (<>
  <mesh ref={ref}>
    <boxGeometry args={size} />
    <meshStandardMaterial color={color} />
    </mesh>
  </>);
};



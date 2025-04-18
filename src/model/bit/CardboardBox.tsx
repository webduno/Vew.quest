'use client';
import { useBox } from '@react-three/cannon';



export const CardboardBox = ({
  color = "#ffddaa", position = [0, 0, 0], size = [1, 1, 1], rotation = [0, 0, 0]
}: {
  color?: string;
  position?: [number, number, number];
  size?: [number, number, number];
  rotation?: [number, number, number];
}
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

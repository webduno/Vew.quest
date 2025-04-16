'use client';
import { Box } from '@react-three/drei';
import { SolidBox } from './SolidBox';


export const StyledWall = ({
    color = "#ffffff", baseboardColor = "#cccccc", size = [1, 4, 1], position = [0, 0, 0], rotation = [0, 0, 0]
}: {
    color?: string;
    baseboardColor?: string;
    size?: [number, number, number];
    position?: [number, number, number];
    rotation?: [number, number, number];
    onClick?: () => void;
}) => {
    return (<>

        <SolidBox color={color}
            size={size}
            position={position}
            rotation={rotation} />

        <Box args={[size[0] + 0.1, 0.4, size[2] + 0.1]}
    castShadow
            position={[position[0], 0, position[2]]}>
            <meshStandardMaterial color={baseboardColor} />
        </Box>
    </>);
};

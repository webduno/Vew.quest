'use client';
import { Box, Text, Plane } from '@react-three/drei';

interface CRVRequest {
  id: string;
  content: any;
  created_at: string;
  storage_key: string;
  bounty: number | null;
  attempts: number;
  solved: number;
}

interface YourRequestsProps {
  userCrvRequests: CRVRequest[];
}

export const YourRequests = ({ userCrvRequests }: YourRequestsProps) => {
  return (
    <group>
      <Plane args={[1.8, 1.3]} position={[2.44, 1.6, -7]} rotation={[0, -Math.PI/2, 0]} receiveShadow>
        <meshStandardMaterial color="#ffffff" emissive={"#171717"} />
      </Plane>
      <Text font="/fonts/wallpoet.ttf" fontSize={0.25} color="#2a2a2a" 
        anchorX="center" anchorY="middle" textAlign="center"
        position={[2.44, 2.6, -7]} rotation={[0, -Math.PI/2, 0]}
      >
        {`YOUR CRV\nREQUESTS`}
      </Text>

      <Text font="/fonts/consolas.ttf" fontSize={0.08} color="#2a2a2a" 
        anchorX="left" anchorY="middle" textAlign="left"
        position={[2.42, 2.15 , -7.8]} rotation={[0, -Math.PI/2, 0]}
      >
        {`attmp  slvd  bounty `}
      </Text>

      {userCrvRequests.map((request, index) => (
        <group key={request.id}>
          <Text font="/fonts/beanie.ttf" fontSize={0.18} color="#2a2a2a" 
            anchorX="left" anchorY="middle" textAlign="left"
            position={[2.42, 1.95 - (index * 0.2), -7.75]} rotation={[0, -Math.PI/2, 0]}
          >
            {`${request.attempts} | ${request.solved} | ${!!request?.bounty ? "$$$" : "---"} | `}
            {`t:${new Date(request.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`}
          </Text>
        </group>
      ))}
    </group>
  );
}; 
'use client';
import { Box, Text, Plane } from '@react-three/drei';
import { useState } from 'react';
import { useBew } from '../../../script/contexts/BewProvider';

interface CRVRequest {
  id: string;
  content: any;
  created_at: string;
  storage_key: string;
  bounty: number | null;
  attempts: number;
  solved: number;
}

interface PublicRequestsProps {
  crvRequests: CRVRequest[];
  isSubmitting: boolean;
  onTakeRequest: (requestId: string) => void;
  onAddRequest: () => void;
}

export const PublicRequests = ({ crvRequests, isSubmitting, onTakeRequest, onAddRequest }: PublicRequestsProps) => {
  return (
    <group>
      <Plane args={[1.8, 1.3]} position={[-2.44, 1.6, -7]} rotation={[0, Math.PI/2, 0]} receiveShadow>
        <meshStandardMaterial color="#ffffff" emissive={"#171717"} />
      </Plane>
      <Text font="/fonts/wallpoet.ttf" fontSize={0.25} color="#181818" 
        anchorX="center" anchorY="middle" textAlign="center"
        position={[-2.44, 2.6, -7]} rotation={[0, Math.PI/2, 0]}
      >
        {`PUBLIC\nREQUESTS`}
      </Text>

      <Text font="/fonts/consolas.ttf" fontSize={0.07} color="#555555" 
        anchorX="center" anchorY="middle" textAlign="center"
        position={[-2.42, 2.12 , -7.65]} rotation={[0, Math.PI/2, 0]}
      >
        {`TAKE\nREQUEST`}
      </Text>

      {crvRequests.slice(0, 5).map((request, index) => (
        <group key={request.id}>
          <Text font="/fonts/consolas.ttf" fontSize={0.12} color="#181818" 
            anchorX="right" anchorY="middle" textAlign="right"
            position={[-2.42, 1.95 - (index * 0.2), -7.4]} rotation={[0, Math.PI/2, 0]}
          >
            {`${request.bounty ? "$" : ""} #${request.id}___t:${new Date(request.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`}
          </Text>
          <Box args={[0.05, 0.15, .3]} position={[-2.42, 1.95 - (index * 0.2), -7.65]} 
            onClick={(e) => {
              e.stopPropagation();
              onTakeRequest(request.id);
            }}>
            <meshStandardMaterial color="#eeeeee" />
          </Box>
        </group>
      ))}

      <group position={[-2.5, 0.65, -7]}
        onClick={(e) => {
          e.stopPropagation();
          onAddRequest();
        }}>
        <Box args={[0.2, 0.4, 1.6]} position={[0, 0, 0]} >
          <meshStandardMaterial color="#f0f0f0" />
        </Box>
        <Text font="/fonts/wallpoet.ttf" fontSize={0.15} color="#4f4f4f"
          anchorX="center" anchorY="middle" textAlign="center"
          position={[0.11, 0, 0]} rotation={[0, Math.PI/2, 0]}
        >
          {isSubmitting ? 'Submitting...' : ('ADD REQUEST')}
        </Text>
      </group>
    </group>
  );
}; 
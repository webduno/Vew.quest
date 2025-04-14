'use client';
import { Box, Text, Plane } from '@react-three/drei';
import { PhysicalWall } from '../core/PhysicalWall';
import { useEffect, useState } from 'react';
import { useVibeverse } from '../../../scripts/hooks/useVibeverse';
import { calculateAccuracy } from "../../../scripts/utils/calculateAccuracy";

interface BewPreMainSceneProps {
  setPlayerPosition?: (position: [number, number, number]) => void;
}

interface CRVObject {
  id: string;
  content: any;
  result: number;
  created_at: string;
}

export const ESPLobby = ({ setPlayerPosition }: BewPreMainSceneProps = {}) => {
  const { LS_playerId } = useVibeverse();
  const [crvObjects, setCrvObjects] = useState<CRVObject[]>([]);

  useEffect(() => {
    const fetchCrvObjects = async () => {
      if (!LS_playerId) return;
      
      try {
        const response = await fetch(`/api/supabase?storageKey=${LS_playerId}`);
        const data = await response.json();
        if (data.success) {
          setCrvObjects(data.data);
        }
      } catch (error) {
        console.error('Error fetching CRV objects:', error);
      }
    };

    fetchCrvObjects();
  }, [LS_playerId]);

  return (
    <group position={[0, 0, 0]}>


{/* NOTICEBOARD */}

<Plane args={[1.8, 1.8]} position={[-2.44, 1.35, -7]} rotation={[0, Math.PI/2, 0]}>
  <meshStandardMaterial color="#ffffff" />
</Plane>
<Text font="/fonts/wallpoet.ttf" fontSize={0.25} color="#2a2a2a" 
anchorX="center" anchorY="middle" textAlign="center"
position={[-2.44, 2.6, -7]} rotation={[0, Math.PI/2, 0]}
>
{`PUBLIC\nREQUESTS`}
</Text>

<Plane args={[1.8, 1.8]} position={[-2.44, 1.35, -9]} rotation={[0, Math.PI/2, 0]}>
  <meshStandardMaterial color="#ffffff" />
</Plane>
<Text font="/fonts/wallpoet.ttf" fontSize={0.25} color="#2a2a2a" 
anchorX="center" anchorY="middle" textAlign="center"
position={[-2.44, 2.6, -9]} rotation={[0, Math.PI/2, 0]}
>
  {/* crvobjects only for today */}
{`DAILY\nQUOTA | ${crvObjects.filter(obj => new Date(obj.created_at).toLocaleDateString('en-US') === new Date().toLocaleDateString('en-US')).length}/5`}
</Text>

{/* show maximum 9 items */}
{/* CRV Objects Display only for today */}
{crvObjects.slice(0, 9).map((obj, index) => {
  const sent = obj.content?.sent;
  const target = obj.content?.target;
  
  const accuracyres = {
    naturalityAccuracy: calculateAccuracy(target?.natural, sent?.natural, true),
    temperatureAccuracy: calculateAccuracy(target?.temp, sent?.temp, true),
    lightAccuracy: calculateAccuracy(target?.light, sent?.light),
    colorAccuracy: calculateAccuracy(target?.color, sent?.color),
    solidAccuracy: calculateAccuracy(target?.solid, sent?.solid),
  };

  const rewardAmount = (accuracyres.naturalityAccuracy +
    accuracyres.temperatureAccuracy +
    accuracyres.lightAccuracy +
    accuracyres.colorAccuracy +
    accuracyres.solidAccuracy);

  const reward = rewardAmount * 3;
  
  return (
    <group key={obj.id}
    onClick={() => {
      console.log('clicked', obj)
      
    }}
    >
      <Text font="/fonts/beanie.ttf" fontSize={0.2} color="#2a2a2a" 
        anchorX="center" anchorY="middle" textAlign="center"
        position={[-2.42, 2.05 - (index * 0.2), -9]} rotation={[0, Math.PI/2, 0]}
      >
        {`${obj.result.toFixed(2)}% $${reward}|`}
        {/* only hour and minute */}
        {`${new Date(obj.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`}
      </Text>
    </group>
  );
})}

<Plane args={[1.8, 1.8]} position={[-2.44, 1.35, -11]} rotation={[0, Math.PI/2, 0]}>
  <meshStandardMaterial color="#ffffff" emissive={"#222222"} />
</Plane>
<Text font="/fonts/wallpoet.ttf" fontSize={0.25} color="#444444" 
anchorX="center" anchorY="middle" textAlign="center"
position={[-2.44, 2.6, -11]} rotation={[0, Math.PI/2, 0]}
>
{`SCORE\nBOARD`}
</Text>






<PhysicalWall color="#ffffff"
        size={[3.5, 4, 1]}
        position={[3, 2, -13]} rotation={[0, -Math.PI / 2, 0]} />
        <Box args={[1.1, 0.4, 3.58]} position={[3, 0, -13]}>
          <meshStandardMaterial color="#cccccc" />
        </Box>

    </group>
  );
};

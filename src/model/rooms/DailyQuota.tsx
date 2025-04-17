'use client';
import { Text, Plane, Box } from '@react-three/drei';
import { calculateAccuracy } from "../../../script/utils/calculateAccuracy";

interface CRVObject {
  id: string;
  content: any;
  result: number;
  created_at: string;
  storage_key: string;  
}

interface DailyQuotaProps {
  crvObjects: CRVObject[];
  onRefresh: () => void;
}

export const DailyQuota = ({ crvObjects, onRefresh }: DailyQuotaProps) => {
  const todayObjects = crvObjects.filter(obj => 
    new Date(obj.created_at).toLocaleDateString('en-US') === new Date().toLocaleDateString('en-US')
  );

  return (
    <group>
      <Plane args={[1.8, 1.8]} position={[-2.44, 1.35, -9]} rotation={[0, Math.PI/2, 0]} receiveShadow>
        <meshStandardMaterial color="#ffffff" emissive={"#171717"} />
      </Plane>

      {/* Refresh Button */}
      <group onClick={onRefresh}>
        <Box args={[0.3, 0.3, 0.1]} position={[-2.44, 1.8, -9.85]} rotation={[0, Math.PI/2, 0]}>
          <meshStandardMaterial color="#dddddd" />
        </Box>
        <Text 
          font="/fonts/wallpoet.ttf" 
          fontSize={0.15} 
          color="#666666" 
          anchorX="center" 
          anchorY="middle" 
          position={[-2.38, 1.8, -9.85]} 
          rotation={[0, Math.PI/2, 0]}
        >
          ↻
        </Text>
      </group>

      <Text font="/fonts/wallpoet.ttf" fontSize={0.25} color="#222222" 
        anchorX="center" anchorY="middle" textAlign="center"
        position={[-2.44, 2.6, -9]} rotation={[0, Math.PI/2, 0]}
      >
        {`YOUR DAILY\nQUOTA | ${todayObjects.length}/3`}
      </Text>

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
          <group key={obj.id}>
            <Text font="/fonts/beanie.ttf" fontSize={0.18} color="#222222" 
              anchorX="center" anchorY="middle" textAlign="center"
              position={[-2.42, 2.05 - (index * 0.2), -8.9]} rotation={[0, Math.PI/2, 0]}
            >
              {`${obj.result.toFixed(2)}% $${reward}|`}
              {`${new Date(obj.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`}
            </Text>
          </group>
        );
      })}
    </group>
  );
}; 
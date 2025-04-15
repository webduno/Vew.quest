'use client';
import { Text, Plane } from '@react-three/drei';
import { calculateAccuracy } from "../../../scripts/utils/calculateAccuracy";

interface CRVObject {
  id: string;
  content: any;
  result: number;
  created_at: string;
  storage_key: string;  
}

interface ScoreboardProps {
  scoreboardObjects: CRVObject[];
}

export const Scoreboard = ({ scoreboardObjects }: ScoreboardProps) => {
  return (
    <group>
      <Plane args={[1.8, 1.8]} position={[-2.44, 1.35, -11]} rotation={[0, Math.PI/2, 0]} receiveShadow>
        <meshStandardMaterial color="#d0d0d0"  />
      </Plane>
      <Text font="/fonts/wallpoet.ttf" fontSize={0.25} color="#444444" 
        anchorX="center" anchorY="middle" textAlign="center"
        position={[-2.44, 2.6, -11]} rotation={[0, Math.PI/2, 0]}
      >
        {`SCORE\nBOARD`}
      </Text>

      {scoreboardObjects.slice(0, 8).map((obj, index) => {
        const sent = obj.content?.sent;
        const target = obj.content?.target;
        const storage_key = obj.storage_key;
        
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
            <Text font="/fonts/wallpoet.ttf" fontSize={0.085} color={index > 2 ? "#333333" : "#666666"} 
              anchorX="center" anchorY="middle" textAlign="center"
              position={[-2.42, 2.05 - (index * 0.2), -11]} rotation={[0, Math.PI/2, 0]}
            >
              {`${obj.result.toFixed(5)}%     @${obj.storage_key}`}
            </Text>
          </group>
        );
      })}
    </group>
  );
}; 
'use client';
import { Box, Text, Plane } from '@react-three/drei';
import { PhysicalWall } from '../core/PhysicalWall';
import { useEffect, useState } from 'react';
import { useVibeverse } from '../../../scripts/hooks/useVibeverse';
import { calculateAccuracy } from "../../../scripts/utils/calculateAccuracy";
import { useBew } from '../../../scripts/contexts/BewProvider';
import { AnalogModalScreen } from '../../dom/molecule/SenseMeter/AnalogModalScreen';

interface BewPreMainSceneProps {
  setPlayerPosition?: (position: [number, number, number]) => void;
  isTakingRequest: string | null;
  setIsTakingRequest: (value: string | null) => void;
}

interface CRVObject {
  id: string;
  content: any;
  result: number;
  created_at: string;
  storage_key: string;  
}

interface CRVRequest {
  id: string;
  content: any;
  created_at: string;
  storage_key: string;
  bounty: number | null;
  attempts: number;
  solved: number;
}

export const ESPLobby = ({ setPlayerPosition, isTakingRequest, setIsTakingRequest }: BewPreMainSceneProps) => {
  const { LS_playerId } = useVibeverse();
  const [crvObjects, setCrvObjects] = useState<CRVObject[]>([]);
  const [scoreboardObjects, setScoreboardObjects] = useState<CRVObject[]>([]);
  const [crvRequests, setCrvRequests] = useState<CRVRequest[]>([]);
  const [userCrvRequests, setUserCrvRequests] = useState<CRVRequest[]>([]);
  const { showSnackbar, closeSnackbar } = useBew();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<CRVRequest | null>(null);

  const handleSubmitRequest = async ({
    newRequestDescription, newRequestBounty
  }: {newRequestDescription: string, newRequestBounty: string}) => {
    if (!newRequestDescription.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/supabase/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: newRequestDescription.trim(),
          creator_id: LS_playerId,
          bounty: newRequestBounty
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Refresh the requests list
        const refreshResponse = await fetch('/api/supabase/requests');
        const refreshData = await refreshResponse.json();
        showSnackbar('Request submitted successfully!', 'success');
        setTimeout(() => {
          closeSnackbar();
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting request:', error);
    } finally {
      setIsSubmitting(false);
      setIsTakingRequest(null);
    }
  };

  const handleClickRequest = () => {
    const newRequestDescription = prompt('Enter a new CRV request description:');
    const newRequestBounty = prompt('Enter a bounty (OPTIONAL)');

    if (newRequestDescription && !isSubmitting) {
      handleSubmitRequest({newRequestDescription, newRequestBounty: newRequestBounty || ""});
    } else {
      console.log('no description')
      setIsTakingRequest(null);
    }
  }

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

    const fetchScoreboard = async () => {
      try {
        const response = await fetch('/api/supabase/scoreboard');
        const data = await response.json();
        if (data.success) {
          setScoreboardObjects(data.data);
        }
      } catch (error) {
        console.error('Error fetching scoreboard:', error);
      }
    };

    const fetchCrvRequests = async () => {
      try {
        const response = await fetch('/api/supabase/requests');
        const data = await response.json();
        if (data.success) {
          setCrvRequests(data.data);
        }
      } catch (error) {
        console.error('Error fetching CRV requests:', error);
      }
    };

    const fetchUserCrvRequests = async () => {
      if (!LS_playerId) return;
      try {
        const response = await fetch(`/api/supabase/crvmailbox?playerId=${LS_playerId}`);
        const data = await response.json();
        if (data.success) {
          setUserCrvRequests(data.data);
        }
      } catch (error) {
        console.error('Error fetching user CRV requests:', error);
      }
    };

    fetchCrvObjects();
    fetchScoreboard();
    fetchCrvRequests();
    fetchUserCrvRequests();
  }, [LS_playerId]);

  return (
    <group position={[0, 0, 0]}>


{/* NOTICEBOARD */}

<Plane args={[1.8, 1.3]} position={[-2.44, 1.6, -7]} rotation={[0, Math.PI/2, 0]} receiveShadow>
  <meshStandardMaterial color="#ffffff" emissive={"#171717"} />
</Plane>
<Text font="/fonts/wallpoet.ttf" fontSize={0.25} color="#2a2a2a" 
anchorX="center" anchorY="middle" textAlign="center"
position={[-2.44, 2.6, -7]} rotation={[0, Math.PI/2, 0]}
>
{`PUBLIC\nREQUESTS`}
</Text>

<Text font="/fonts/consolas.ttf" fontSize={0.07} color="#333333" 
      anchorX="center" anchorY="middle" textAlign="center"
      position={[-2.42, 2.12 , -7.65]} rotation={[0, Math.PI/2, 0]}
    >
      {`TAKE\nREQUEST`}
    </Text>
{/* Display CRV Requests */}
{crvRequests.map((request, index) => (
  <group key={request.id}>
    <Text font="/fonts/consolas.ttf" fontSize={0.12} color="#2a2a2a" 
      anchorX="right" anchorY="middle" textAlign="right"
      position={[-2.42, 1.95 - (index * 0.2), -7.4]} rotation={[0, Math.PI/2, 0]}
    >
      {`${request.bounty ? "$" : ""} #${request.id}___t:${new Date(request.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`}
    </Text>
    {/* take specific request button */}
    <Box args={[0.05, 0.15, .3]} position={[-2.42, 1.95 - (index * 0.2), -7.65]} 
      onClick={(e) => {
        e.stopPropagation();
        setSelectedRequest(request);
        setIsTakingRequest(request.id);
      }}>
      <meshStandardMaterial color="#eeeeee" />
    </Box>
  </group>
))}

{/* Input Box for New Request on other side of the wall */}

<group position={[2.5, 0.65, -7]}
onClick={(e) => {
  alert("Coming Soon!\nPlease contact the admin to solve your request.")
}}>
  
<Box args={[0.2, 0.4, 1.6]} position={[0, 0, 0]} >
  <meshStandardMaterial color="#f0f0f0" />
</Box>
<Text font="/fonts/wallpoet.ttf" fontSize={0.15} color="#4f4f4f"
  anchorX="center" anchorY="middle" textAlign="center"
  position={[-0.11, 0, 0]} rotation={[0, -Math.PI/2, 0]}
  
>
  {('SOLVE REQUEST')}
</Text>
</group>







{/* Input Box for New Request */}
<group position={[-2.5, 0.65, -7]}
onClick={(e) => {
  e.stopPropagation();
  handleClickRequest();
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

<Plane args={[1.8, 1.8]} position={[-2.44, 1.35, -9]} rotation={[0, Math.PI/2, 0]} receiveShadow>
  <meshStandardMaterial color="#ffffff" emissive={"#171717"} />
</Plane>
<Text font="/fonts/wallpoet.ttf" fontSize={0.25} color="#2a2a2a" 
anchorX="center" anchorY="middle" textAlign="center"
position={[-2.44, 2.6, -9]} rotation={[0, Math.PI/2, 0]}
>
  {/* crvobjects only for today */}
{`YOUR DAILY\nQUOTA | ${crvObjects.filter(obj => new Date(obj.created_at).toLocaleDateString('en-US') === new Date().toLocaleDateString('en-US')).length}/5`}
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

<Plane args={[1.8, 1.8]} position={[-2.44, 1.35, -11]} rotation={[0, Math.PI/2, 0]} receiveShadow>
  <meshStandardMaterial color="#d0d0d0"  />
</Plane>
<Text font="/fonts/wallpoet.ttf" fontSize={0.25} color="#444444" 
anchorX="center" anchorY="middle" textAlign="center"
position={[-2.44, 2.6, -11]} rotation={[0, Math.PI/2, 0]}
>
{`SCORE\nBOARD`}
</Text>

{/* Top 8 Scoreboard Items */}
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
      {/* color the first three different from the rest */}
      <Text font="/fonts/wallpoet.ttf" fontSize={0.085} color={index > 2 ? "#333333" : "#666666"} 
        anchorX="center" anchorY="middle" textAlign="center"
        position={[-2.42, 2.05 - (index * 0.2), -11]} rotation={[0, Math.PI/2, 0]}
      >
        {`${obj.result.toFixed(5)}%     @${obj.storage_key}`}
      </Text>
    </group>
  );
})}

<PhysicalWall color="#ffffff"
        size={[3.5, 4, 1]}
        position={[3, 2, -13]} rotation={[0, -Math.PI / 2, 0]} />
        <Box args={[1.1, 0.4, 3.58]} position={[3, 0, -13]}>
          <meshStandardMaterial color="#cccccc" />
        </Box>

{/* User's CRV Requests Display */}
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
{/* Display User's CRV Requests */}
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

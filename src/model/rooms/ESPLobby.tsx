'use client';
import { Box } from '@react-three/drei';
import { SolidBox } from '../core/SolidBox';
import { useEffect, useState } from 'react';
import { usePlayerStats } from '../../../script/state/hook/usePlayerStats';
import { useGameCore } from '../../../script/state/hook/useGameCore';
import { PublicRequests } from './PublicRequests';
import { YourRequests } from './YourRequests';
import { Scoreboard } from './Scoreboard';
import { DailyQuota } from './DailyQuota';

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
  const { LS_playerId, updateMindStats, mindStats } = usePlayerStats();
  const { playSoundEffect } = useGameCore();
  const [crvObjects, setCrvObjects] = useState<CRVObject[]>([]);
  const [scoreboardObjects, setScoreboardObjects] = useState<CRVObject[]>([]);
  const [crvRequests, setCrvRequests] = useState<CRVRequest[]>([]);
  const [userCrvRequests, setUserCrvRequests] = useState<CRVRequest[]>([]);
  const { showSnackbar, closeSnackbar } = useGameCore();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache'
        },
        body: JSON.stringify({
          description: newRequestDescription.trim(),
          creator_id: LS_playerId,
          bounty: newRequestBounty
        }),
        cache: 'no-store'
      });

      const data = await response.json();
      if (data.success) {
        // Fetch both public and user requests
        const [publicResponse, userResponse] = await Promise.all([
          fetch('/api/supabase/requests', {
            headers: {
              'Cache-Control': 'no-store, no-cache, must-revalidate',
              'Pragma': 'no-cache'
            },
            cache: 'no-store'
          }),
          fetch(`/api/supabase/crvmailbox?playerId=${LS_playerId}`, {
            headers: {
              'Cache-Control': 'no-store, no-cache, must-revalidate',
              'Pragma': 'no-cache'
            },
            cache: 'no-store'
          })
        ]);

        const [publicData, userData] = await Promise.all([
          publicResponse.json(),
          userResponse.json()
        ]);

        if (publicData.success) {
          setCrvRequests(publicData.data);
        }
        if (userData.success) {
          setUserCrvRequests(userData.data);
        }

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

  const handleTakeRequest = (requestId: string) => {
    if (mindStats.color <= 0) {
      showSnackbar('Not enough color points to take a request!', 'error');
      setTimeout(() => {
        closeSnackbar();
      }, 3000);
      return;
    }
    
    updateMindStats('color', mindStats.color - 1);
    setIsTakingRequest(requestId);
  };

  const fetchCrvObjects = async () => {
    if (!LS_playerId) return;
    
    try {

      const response = await fetch(`/api/supabase?storageKey=${LS_playerId}`, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache'
        },
        cache: 'no-store'
      });
      const data = await response.json();
      if (data.success) {
        setCrvObjects(data.data);
      }
    } catch (error) {
      console.error('Error fetching CRV objects:', error);
    }
  };

  const handleRefreshDailyQuota = () => {
      playSoundEffect('/sfx/short/beep.mp3');

    fetchCrvObjects();
  };

  useEffect(() => {
    const fetchScoreboard = async () => {
      try {
        const response = await fetch('/api/supabase/scoreboard', {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'Pragma': 'no-cache'
          },
          cache: 'no-store'
        });
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
        const response = await fetch('/api/supabase/requests', {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'Pragma': 'no-cache'
          },
          cache: 'no-store'
        });
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
        const response = await fetch(`/api/supabase/crvmailbox?playerId=${LS_playerId}`, {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'Pragma': 'no-cache'
          },
          cache: 'no-store'
        });
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

      <pointLight position={[0, 2, -10]} intensity={1}  castShadow
        color="#fff7f0" 

        distance={8}

        shadow-mapSize-blurSamples={2}
        shadow-mapSize-radius={.2}
    
        shadow-mapSize-width={16}
        shadow-mapSize-height={16}
            shadow-camera-near={1}
            shadow-camera-far={4}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}

       />


      {crvObjects.length > 0 && (
        <>
          <PublicRequests 
            crvRequests={crvRequests}
            isSubmitting={isSubmitting}
            onTakeRequest={handleTakeRequest}
            onAddRequest={handleClickRequest}
          />

          <YourRequests userCrvRequests={userCrvRequests} />

          <Scoreboard scoreboardObjects={scoreboardObjects} />
        </>
      )}
{crvObjects.length > 0  && (
      <DailyQuota crvObjects={crvObjects} onRefresh={handleRefreshDailyQuota} />
)}

      <SolidBox color="#ffffff"
        size={[3.5, 4, 1]}
        position={[3, 2, -13]} rotation={[0, -Math.PI / 2, 0]} />
      <Box args={[1.1, 0.4, 3.58]} position={[3, 0, -13]}>
        <meshStandardMaterial color="#cccccc" />
      </Box>
    </group>
  );
};

'use client';
import { useState, useEffect } from 'react';

import { useLSPlayerId } from '@/../script/state/hook/usePlayerStats';
import { random10CharString } from "@/../script/utils/platform/random10CharString";

import { BewUserStatsSummary } from '@/dom/bew/BewUserStatsSummary';
import { VewLandingProfileActionButton } from '@/dom/organ/vew_landing/VewLandingProfileActionButton';
import { VewLandingUsernameInput } from '@/dom/organ/vew_landing/VewLandingUsernameInput';
import { BewPurpleBtn } from '@/dom/bew/BewBtns';
import { NavigationHeaderBar } from '@/dom/bew/NavigationHeaderBar';
import { VewLandingGraphic } from '@/dom/organ/vew_landing/VewLandingGraphic.tsx';


export default function TrainingPage() {
  const { LS_playerId, typedUsername, setTypedUsername, setPlayerId, sanitizePlayerId } = useLSPlayerId();
  const [userExists, setUserExists] = useState(0);
  const [streak, setStreak] = useState(0);
  const [potentialStreak, setPotentialStreak] = useState(0);
  const [avgResult, setAvgResult] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserCount = async () => {
    if (!typedUsername) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/supabase/count?storageKey=${typedUsername}`);
      const data = await response.json();
      if (data.success) {
        setUserExists(data.count);
        setStreak(data.streak);
        setPotentialStreak(data.potential_streak);
        setAvgResult(data.avg_result);
      }
    } catch (error) {
      console.error('Error fetching user count:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (isLoading) { return }
    fetchUserCount();
  }, [LS_playerId]);

  const handleStart = async () => {
    if ( typedUsername) {
      setPlayerId(sanitizePlayerId(typedUsername));
    } else {
      const randomId = random10CharString();
      setTypedUsername(randomId);
      localStorage.setItem('VB_PLAYER_ID', randomId);
    }
    window.location.href = '/tool';
  };


  return (
    <div className='w-100 h-100  flex-col flex-justify-start'>
      <div className='w-100  flex-col  '>
        
        <NavigationHeaderBar />

        <div className='flex-wrap gap-8 px-4 ' style={{ minHeight: "70vh", }}>

          <VewLandingGraphic />

          <div className= {' tx-altfont-2  flex-col gap-2  w-300px'}>
            <div className='tx-center tx-lgx tx-bold tx-gg'>
              Gamified <br /> step-by-step lessons for remote viewing
            </div>
            <div className='flex-col _dd r'>
              {userExists > 0 && (<>
                <div className="flex-row flex-justify-between flex-align-center">
                  <BewUserStatsSummary minified calculatedStats={{
                    potentialStreak: potentialStreak,
                    streak: streak,
                    averageResult: avgResult
                  }} 
                  crvObjects_length={userExists}
                  />
                </div>
              </>)}
              
              <VewLandingUsernameInput 
                typedUsername={typedUsername}
                setTypedUsername={setTypedUsername}
                handleStart={handleStart}
              />

              <div className="flex-row flex-align-start">
                {userExists > 0 && (
                  <div className='flex-row'>
                    <VewLandingProfileActionButton typedUsername={typedUsername} handleStart={handleStart} />
                  </div>
                )}
                <div>
                  <BewPurpleBtn text="Start" onClick={handleStart} />
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
} 





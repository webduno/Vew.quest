'use client';
import { useState, useCallback, useEffect } from 'react';
import { useLSPlayerId, usePlayerStats } from '@/../script/state/hook/usePlayerStats';
import { useFetchedStats } from '@/script/state/context/FetchedStatsContext';

import { Tooltip } from 'react-tooltip';
import { BewUserStatsSummary } from '../../dom/bew/BewUserStatsSummary';
import { isMobile } from '../../../script/utils/platform/mobileDetection';
import { random10CharString } from "../../../script/utils/platform/random10CharString";
import { LandingProfileActionButton } from '@/dom/bew/LandingProfileActionButton';
import { BewPurpleBtn } from '@/dom/bew/BewBtns';
import { NavigationHeaderBar } from '@/dom/bew/NavigationHeaderBar';
import { VersionTag } from '@/dom/bew/VersionTag';


export default function TrainingPage() {
  const { typedUsername, setTypedUsername, setPlayerId, sanitizePlayerId } = useLSPlayerId();
  // const { crvObjects } = useFetchedStats();


  
const [ wndwTg, s__wndwTg] = useState<any>(null);
const [ telegram_id, s__telegram_id] = useState<string | null>(null);
const [userExists, setUserExists] = useState(0);
const [streak, setStreak] = useState(0);
const [potentialStreak, setPotentialStreak] = useState(0);
const [avgResult, setAvgResult] = useState(0);

useEffect(() => {
  const fetchUserCount = async () => {
    if (!typedUsername) return;
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
    }
  };

  fetchUserCount();
}, [typedUsername]);

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



// useEffect(() => {
//   setTelegram();
// }, [])

  // useEffect(() => {
  //   if (!LS_playerId) {
  //     return }
  //   fetchMailboxRequests();
  // }, [LS_playerId, fetchMailboxRequests]);

  return (
    <div className='w-100 h-100  flex-col flex-justify-start'>
      <div className='w-100  flex-col  '>
        
        <NavigationHeaderBar linkList={<>
            <a href="/about" className='nodeco' style={{ color: "#AFAFAF" }}>
              <div>About <VersionTag /></div>
            </a>
          </>}
        />
        <div className='flex-wrap gap-8 px-4 ' style={{ height: "70vh", }}>
          <div className='flex-col '>
            <div className='Q_xs_sm py-4'></div>

            <img src="/bew/cleaneyes.png" alt="tool_bg3"
            className={'pointer hover-jump pos-abs noselect noverflow block  Q_xs_pt-8 '+ (isMobile() ? 'w-100px' : 'w-150px')} 
            />

            <img src="/bew/starsbg2.jpeg" alt="tool_bg4"
              className={'pointer bord-r-50 noverflow noselect block '+(isMobile() ? 'w-150px' : 'w-250px')} 
            />

          </div>
          <div className= {' tx-altfont-2 tx-bold _dd b flex-col gap-2    flex-col w-300px'}
            style={{color: "#777777",}}
          >
            <div className='flex-col _dd g tx-center tx-lgx landing -title'>Gamified <br /> step-by-step lessons for remote viewing</div>
            <div className='flex-col _dd r'>
              {userExists > 0 && (<>
                <div className="flex-row flex-justify-between flex-align-center">
                  <BewUserStatsSummary minified calculatedStats={{
                    potentialStreak: potentialStreak,
                    streak: streak,
                    dailyProgress: 0,
                    dailyGoal: 0,
                    isLoading: false,
                    error: null,
                    averageResult: avgResult
                  }} 
                  crvObjects_length={userExists}
                  />
                </div>
              </>)}
              <div>
                <input 
                  type="text" 
                  className='bord-r-10 tx-altfont-2 py-2 mb-2 px-3 tx-center'
                  placeholder='Enter your name'
                  style={{
                    border: "1px solid #E5E5E5",
                  }}
                  value={typedUsername}
                  onChange={(e) => { setTypedUsername(sanitizePlayerId(e.target.value)) }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleStart();
                    }
                  }}
                />
              </div>

              <div className="flex-row flex-align-start"
              >
                {userExists > 0 && (<>
                <div  className='flex-row'>
                <LandingProfileActionButton typedUsername={typedUsername} handleStart={handleStart} />
                </div>
                </>)}
                <div >

                <BewPurpleBtn text="Start" onClick={handleStart}  />
                
                
                </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 





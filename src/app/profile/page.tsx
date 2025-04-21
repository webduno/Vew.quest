'use client';
import { useState, useEffect, useMemo } from 'react';
import { usePlayerStats } from '@/../script/state/hook/usePlayerStats';
import { BewLogo } from '@/dom/atom/logo/BewLogo';
import { Tooltip } from 'react-tooltip';
import { BewUserStatsSummary } from '../../dom/bew/BewUserStatsSummary';
import { useFetchedStats } from '@/script/state/context/FetchedStatsContext';
import { LessonCard } from '@/dom/bew/LessonCard';
import { BewChoiceButton } from '@/dom/bew/BewChoiceButton';
import { isMobile } from '../../../script/utils/platform/mobileDetection';

export default function ProfilePage() {
  const { isLoading, crvObjects, mailboxRequests, isLoadingMailbox, mailboxError, fetchMailboxRequests } = useFetchedStats();
  const { LS_playerId, typedUsername, setTypedUsername, setPlayerId, sanitizePlayerId } = usePlayerStats();
  const [userStats, setUserStats] = useState<{
    totalRequests: number;
    firstRequestDate: string | null;
    averageAccuracy: number;
    bestAccuracy: number;
    dailyGoals: {
      requests: number;
      accuracy: number;
      bestAccuracy: number;
    };
  }>({
    totalRequests: 0,
    firstRequestDate: null,
    averageAccuracy: 0,
    bestAccuracy: 0,
    dailyGoals: {
      requests: 3,
      accuracy: 70,
      bestAccuracy: 0
    }
  });

  const hasMoreThan14Days = useMemo(() => {
    // get unique days
    const uniqueDays = Array.from(new Set(crvObjects.map(obj => obj.created_at.split('T')[0])));
    return uniqueDays.length > 2;
  }, [crvObjects]);

  useEffect(() => {
    if (crvObjects.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      const todayObjects = crvObjects.filter(obj => 
        obj.created_at.split('T')[0] === today
      );
      
      const stats = {
        totalRequests: crvObjects.length,
        firstRequestDate: crvObjects[crvObjects.length - 1]?.created_at || null,
        averageAccuracy: 10,
        bestAccuracy: Math.max(...crvObjects.map(obj => obj.result || 0)),
        dailyGoals: {
          requests: todayObjects.length,
          accuracy: todayObjects.reduce((acc, obj) => acc + (obj.result || 0), 0) / todayObjects.length,
          bestAccuracy: todayObjects.length > 0 ? Math.max(...todayObjects.map(obj => obj.result || 0)) : 0
        }
      };
      setUserStats(stats);
    }
  }, [crvObjects]);

  return (
    <>
      <div className='w-100 autoverflow-y h-100vh  flex-col flex-justify-start'>
        <div className='flex-row w-100 w-max-1080px  tx-altfont-2'>
          <a href="/" className='pointer flex-row nodeco pos-rel pt-4'>
            <img src="/bew/pnglogo.png" alt="tool_bg" className='ml-4 w-50px' />
            <div className='tx-bold' style={{ color: "#2B29AF" }}>Bew</div>
            <div className='tx-bold' style={{ color: "#6B69CF" }}>.quest</div>
          </a>

          <div className='px-4 flex-1 flex-row flex-justify-end tx-bold pt-4'>
            <div className='nodeco' data-tooltip-id="support-tooltip" data-tooltip-place="left" style={{ color: "#AFAFAF" }}>
              <div>Support</div>
            </div>
            <Tooltip id="support-tooltip" clickable>
              <a href="https://x.com/webduno" target='_blank' rel='noopener noreferrer' className='nodeco tx-white tx-altfont-2 nodeco tx-bold-2'>
                <div>𝕏 | @webduno</div>
              </a>
            </Tooltip>
          </div>
        </div>

        
        <div className='Q_xs_py-2'></div>
        <div>
          <div className='tx-lg tx-altfont-2 tx-bold opaci-25 tx-ls-1'>PROFILE</div>
        </div>

        <div className='w-100  w-max-1080px flex-row Q_xs_flex-col-r pt-8 flex-justify-center flex-align-start gap-4'>

          
        
          <div className='flex-wrap Q_xs_sm_flex-col flex-align-center gap-4 pb-100 pos-rel tx-altfont-2 '
          style={{
            color: "#777777",
          }}
          >
            <div className='flex-col  px-2 pos-rel '>

{/* <img src="/bew/birds.png" style={{ filter: "blur(0px)" }} alt="tool_bg2" className='hover-bird pos-abs noverflow block w-150px Q_xs_pt-8 pb-100' /> */}
<img src="/bew/pfp/row-4-column-1.png"
 alt="pfp" className={'bord-r-50 noverflow block '+(isMobile() ? 'w-150px' : 'w-250px')} />
<div className='bord-r-15 mb-4 pb-2 ' style={{ border: "1px solid #f0f0f0" }}>
              <BewUserStatsSummary minified />
              <hr className='w-100 opaci-10 '  />
              <details className='w-150px px-2'>
                <summary className='tx-bold pointer'>More info</summary>


              <div className='flex-col flex-align-start  pt-2 w-150px'>
                <div className='py-2'>🔥 → Streak (Daily Remote Viewings in a row)</div>
                <div className='py-2'
                style={{
                  borderTop: "1px solid #f0f0f0",
                  borderBottom: "1px solid #f0f0f0",
                }}
                >💎 → Points (Completed Remote Viewings)</div>
                <div className='py-2'>💖 → Hearts (Accuracy Average)</div>
              </div>
              </details>
            </div>

                
            {!isMobile() && crvObjects.some(obj => obj.created_at.split('T')[0] === new Date().toISOString().split('T')[0]) ? 
                 <LessonCard
                 title="Viewed Today"
                 emoji="✅"
                 href="/"
                 actionText={"Details"}
                 
                 />
                : ''}            
</div>

<div className='flex-wrap px-4 flex-align-start flex-justify-start gap-4 flex-1'>
            
            <div className='bord-r-15  pb-2 pt-4 px-4 ' 
            // style={{ border: "1px solid #f0f0f0" }}
            >
              <div className='tx-bold tx-lg mb-2'>Username</div>
              <div className='tx-mdl'>{typedUsername || 'Not set'}</div>
              <div className='tx-mdl pt-4 pointer'
              onClick={() => {
                navigator.clipboard.writeText(LS_playerId || '');
                alert('Copied to clipboard');
              }}
              >Local name: <br /> <i className='tx-altfont-1 underline'>{LS_playerId || 'Not set'}</i> 📋</div>
            </div>
        

<div className='bord-r-15  pt-4 pb-2 px-4' style={{ border: "1px solid #f0f0f0" }}>
  <div className='tx-bold tx-lg mb-2'>Daily Goals</div>
  <div className='flex-col gap-2 flex-align-start'>
    <div>Completed: {crvObjects.filter(obj => obj.created_at.split('T')[0] === new Date().toISOString().split('T')[0]).length >= 5 ? '✅' : "❌"} ({userStats.dailyGoals.requests} / 5)</div>
    <div>Requests: {userStats.dailyGoals.requests}</div>
    <div>Avg Accuracy: {userStats.dailyGoals.accuracy}%</div>
    <div>Best Accuracy Today: {userStats.dailyGoals.bestAccuracy.toFixed(1)}%</div>
  </div>
</div>

            <div className='bord-r-15  pb-2 pt-4 px-4' style={{ border: "1px solid #f0f0f0" }}>
              <div className='tx-bold tx-lg mb-2 '>RV Stats</div>
              <div className='flex-col gap-2 flex-align-start'>
                <div>Total Requests: {userStats.totalRequests}</div>
                <div>First Request: {userStats.firstRequestDate ? new Date(userStats.firstRequestDate).toLocaleDateString() : 'No requests yet'}</div>
                <div>Average Accuracy: {userStats.averageAccuracy.toFixed(1)}%</div>
                <div>Best Accuracy: {userStats.bestAccuracy.toFixed(1)}%</div>
              </div>
            </div>


            <div className='w-100 '>
              <div className='tx-bold tx-lg mb-2 px-4'>Badges</div>
              <div className='flex-wrap flex-align-start flex-justify-start gap-4'>



{/* Badges */}
{hasMoreThan14Days && (
<LessonCard 
styleOverride={{
  width: "100px",
  fontSize: "12px",
}}
title="Regular Viewer"
emoji="🔥"
href="/"
actionText={""}

boxShadowColor="#bb4444"
backgroundColor='#ff7755'

/>
)}

{userStats.totalRequests >= 9 && (
<LessonCard 
title="Seer"
actionText={"Details"}
emoji="👀"
href="/"
/>
)}

{/* Badges */}
{hasMoreThan14Days && (
<LessonCard 
title="Fortnighter"
emoji="🏆"
href="/"
actionText={"Details"}

boxShadowColor="#964400"
backgroundColor='#FF9600'

/>
)}

</div>

</div>



          </div>

          
          </div>



          
        </div>
      <div id="journey"></div>  
      <div className='pb-100 flex-col flex-align-start tx-altfont-2 gap-4 w-100 w-max-1080px'
      >
        <div className="tx-xl opaci-40 tx-altfont-6">Your Journey</div>
        <div className="w-max-600px py-4 ">
          
        <BewChoiceButton
        onClick={() => {
          const journeyElement = document.getElementById('journey');
          if (journeyElement) {
            journeyElement.scrollIntoView({ behavior: 'smooth' });
            alert('Date: \n ' + new Date().toISOString().split('T')[0]);
          }
        }}
            secondaryColor="#D07900"
            mainColor="#FF9600"
            // onClick={() => handleInputTypeChange('multi-options')}
            text={"First View: "+ new Date().toLocaleDateString()}
            image={<div>⭐</div>}
          />
          <div className="w-100 flex-justify-center mt-4 mb-8 ">
            <svg width="20" height="60" viewBox="0 0 20 60" xmlns="http://www.w3.org/2000/svg">
              <path d="M10,0 Q0,30 10,60" stroke="#FF9600" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <div className='flex-col gap-2 w-100'>
            <div className='tx-altfont-2 w-max-300px opaci-50'>
            You made your first remote viewing on {new Date().toDateString()}  with an high accuracy.
            <br />
            <br />
            And have made {userStats.totalRequests} requests since then.
            </div>
          </div>
          <div className="w-100 flex-justify-center mt-4 mb-8 ">
            <svg width="20" height="60" viewBox="0 0 20 60" xmlns="http://www.w3.org/2000/svg">
              <path d="M10,0 Q0,30 10,60" stroke="#6366f1" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <BewChoiceButton
        onClick={() => {
          const journeyElement = document.getElementById('journey');
          if (journeyElement) {
            journeyElement.scrollIntoView({ behavior: 'smooth' });
            alert('Date: \n ' + new Date().toISOString().split('T')[0]);
          }
        }}
            secondaryColor="#6366f1"
            mainColor="#8a8af7"
            // onClick={() => handleInputTypeChange('multi-options')}
            text={"Latest View: "+ new Date().toISOString().split('T')[0]}
            image={<div>⭐</div>}
          />
<div className='tx-altfont-2 w-max-600px px-4 opaci-50 mt-100 pb-8'>
<div className='tx-bold tx-lg pb-4'>Arborization</div>
<div className='tx-altfont-2 px-4'>
The specific order on which you made your requests is important.
<br />
Let the algorithm generate a story based on your viewing history.
</div>

</div>
<div className="px-8">
  
<LessonCard
title="Arborization"
emoji="🌳"
href="/"
actionText="Start"

boxShadowColor="#4C8A55"
backgroundColor='#71B44F'

/>

</div>
        </div>
      </div>
      </div>
    </>
  );
} 
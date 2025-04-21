'use client';
import { useState, useEffect } from 'react';
import { usePlayerStats } from '@/../script/state/hook/usePlayerStats';
import { BewLogo } from '@/dom/atom/logo/BewLogo';
import { Tooltip } from 'react-tooltip';
import { BewUserStatsSummary } from '../../dom/bew/BewUserStatsSummary';
import { useFetchedStats } from '@/script/state/context/FetchedStatsContext';

export default function ProfilePage() {
  const { isLoading, crvObjects, mailboxRequests, isLoadingMailbox, mailboxError, fetchMailboxRequests } = useFetchedStats();
  const { LS_playerId, typedUsername, setTypedUsername, setPlayerId, sanitizePlayerId } = usePlayerStats();
  const [userStats, setUserStats] = useState<{
    totalRequests: number;
    firstRequestDate: string | null;
    averageAccuracy: number;
    dailyGoals: {
      requests: number;
      accuracy: number;
    };
  }>({
    totalRequests: 0,
    firstRequestDate: null,
    averageAccuracy: 0,
    dailyGoals: {
      requests: 3,
      accuracy: 70
    }
  });

  useEffect(() => {
    if (crvObjects.length > 0) {
      const stats = {
        totalRequests: crvObjects.length,
        firstRequestDate: crvObjects[crvObjects.length - 1]?.created_at || null,
        // averageAccuracy: crvObjects.reduce((acc, obj) => acc + (obj.accuracy || 0), 0) / crvObjects.length,
        averageAccuracy: 10,
        dailyGoals: {
          requests: 3,
          accuracy: 70
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

        <div className='Q_xs py-8'></div>
        
        <div>
          <div className='tx-lg tx-altfont-2 tx-bold opaci-25 tx-ls-1'>PROFILE</div>
        </div>

        <div className='w-100 _ddg w-max-1080px flex-row pt-8 flex-justify-center flex-align-start gap-4'>
          
          
          <div className='flex-wrap _ddb px-8 pos-rel w-100'>
            <div className='bord-r-15 mb-4 pb-2 px-4' style={{ border: "1px solid #f0f0f0" }}>
              <BewUserStatsSummary minified />
            </div>

            <div className='bord-r-15 mb-4 pb-2 px-4' style={{ border: "1px solid #f0f0f0" }}>
              <div className='tx-bold tx-lg mb-2'>Username</div>
              <div className='tx-mdl'>{typedUsername || 'Not set'}</div>
            </div>

            <div className='bord-r-15 mb-4 pb-2 px-4' style={{ border: "1px solid #f0f0f0" }}>
              <div className='tx-bold tx-lg mb-2'>CRV Statistics</div>
              <div className='flex-col gap-2'>
                <div>Total Requests: {userStats.totalRequests}</div>
                <div>First Request: {userStats.firstRequestDate ? new Date(userStats.firstRequestDate).toLocaleDateString() : 'No requests yet'}</div>
                <div>Average Accuracy: {userStats.averageAccuracy.toFixed(1)}%</div>
              </div>
            </div>

            <div className='bord-r-15 mb-4 pb-2 px-4' style={{ border: "1px solid #f0f0f0" }}>
              <div className='tx-bold tx-lg mb-2'>Daily Goals</div>
              <div className='flex-col gap-2'>
                <div>Requests: {userStats.dailyGoals.requests}</div>
                <div>Target Accuracy: {userStats.dailyGoals.accuracy}%</div>
              </div>
            </div>
          </div>



          
          <div className='flex-col _ddr px-2 pos-rel w-100'>

            <img src="/bew/birds.png" style={{ filter: "blur(0px)" }} alt="tool_bg2" className='hover-bird pos-abs noverflow block w-150px Q_xs_pt-8 pb-100' />
            <img src="/bew/landscape1.jpeg" alt="tool_bg1" className='bord-r-50 noverflow block w-250px' />
          </div>
        </div>
      </div>
    </>
  );
} 
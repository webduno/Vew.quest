'use client';
import { useState, useEffect } from 'react';
import { useFetchedStats } from '@/script/state/context/FetchedStatsContext';
import { BewWorldLogo } from '../../dom/bew/BewWorldLogo';
import { Tooltip } from 'react-tooltip';
import { clean } from 'profanity-cleaner';
import { BewPageHeader } from '@/dom/bew/BewPageHeader';

export default function LeaderboardPage() {
  const { leaderboard, isLoadingLeaderboard, leaderboardError, fetchLeaderboard } = useFetchedStats();
  const [cleanedLeaderboard, setCleanedLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  useEffect(() => {
    if (leaderboard) {
      const cleaned = leaderboard
        .filter(entry => 
          !clean(entry.storage_key, {
            exceptions: ["funk"],
            customBadWords: ["webduno"],
          }).includes("***")
        )
        .sort((a, b) => {
          // First sort by streak
          if (b.streak !== a.streak) {
            return b.streak - a.streak;
          }
          // Then by highest accuracy
          const accuracyA = parseInt(a.highest_accuracy?.toString() || '0');
          const accuracyB = parseInt(b.highest_accuracy?.toString() || '0');
          if (accuracyB !== accuracyA) {
            return accuracyB - accuracyA;
          }
          // Finally by total score
          return parseInt(b.total_score.toString()) - parseInt(a.total_score.toString());
        });
      setCleanedLeaderboard(cleaned);
    }
  }, [leaderboard]);

  return (
    <div className='w-100 autoverflow-y h-100vh flex-col flex-justify-start'>
      <div className='flex-row w-100 w-max-1080px tx-altfont-2'>
        <BewWorldLogo />

        <div className='px-4 gap-3 flex-1 flex-row flex-justify-end tx-bold pt-4'>
          <a href="/dashboard" className='nodeco' style={{ color: "#AFAFAF" }}>
            <div>Dashboard</div>
          </a>
          
          <a href="/about" className='nodeco' style={{ color: "#AFAFAF" }}>
            <div>About</div>
          </a>
        </div>
      </div>

      <div className='flex-col flex-align-stretch w-max-700px w-100'>
        <div className='tx-bold tx-lg flex-col px-4 flex-align-stretch'>
          <div className='flex-col mb-100'>
            <BewPageHeader title="Leaderboard" />
              
            <div className='tx-altfont-2 opaci-50 tx-xsm flex-row px-2 mt-8 w-100'>
              <div className='w-50px'>Rank</div>
              <div className='flex-1 pl-4'>Player ID</div>
              <div className=''>Score</div>
              <Tooltip id="accuracy-tooltip" />
              <div
                data-tooltip-id="accuracy-tooltip"
                data-tooltip-content="Current Streak"
                className='pl-2'
              >
                🔥
              </div>
              <div className=' pl-2'>Highest</div>
              </div>
            <hr className='w-100 opaci-10' />
            <div className='flex-col gap-2 w-100 pb-100'>
              {isLoadingLeaderboard ? (
                <div className='tx-center py-8 opaci-20'>Loading leaderboard...</div>
              ) : leaderboardError ? (
                <div className='tx-center py-8 tx-red'>{leaderboardError}</div>
              ) : cleanedLeaderboard && cleanedLeaderboard.length > 0 ? (
                cleanedLeaderboard.map((entry, index) => (
                  <div key={entry.storage_key} className='tx-altfont-2 w-100 flex-row tx-md pb-2 pr-4'
                    style={{
                      borderBottom: "1px solid #e5e5e5",
                    }}
                  >
                    <div className='w-50px tx-bold-2 pl-4 tx-grey'>
                      {index === 0 ? (
                        <div className='tx-bold-2'>🥇</div>
                      ) : index === 1 ? (
                        <div className='tx-bold-2'>🥈</div>
                      ) : index === 2 ? (
                        <div className='tx-bold-2'>🥉</div>
                      ) : (
                        <div className='tx-bold-2'>#{index + 1}</div>
                      )}
                    </div>
                    <a className='flex-1 tx-grey nodeco opaci-chov--50 py-2'
                    style={{
                    }}
                    href={`/profile?username=${entry.storage_key}`}
                    >
                      <div className='tx-bold'
                        style={{
                          color: "#777777",
                        }}
                      >
                        {clean(entry.storage_key, {
                          exceptions: ["funk"]
                        })}
                      </div>
                    </a>
                    <div className='tx-bold-2'>
                      {parseInt(entry.total_score.toString())}
                    </div>
                    <div className='tx-bold-2 pl-2'>
                      {entry.streak}
                    </div>
                    <div className='tx-bold-2 pl-2'>
                      {parseInt(entry.highest_accuracy?.toString() || '0')}%
                    </div>
                  </div>
                ))
              ) : (
                <div className='tx-center py-8'>No leaderboard data available</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 


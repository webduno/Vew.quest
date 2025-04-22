'use client';
import { useState, useEffect } from 'react';
import { useFetchedStats } from '@/script/state/context/FetchedStatsContext';
import { BewWorldLogo } from '../../dom/bew/BewWorldLogo';
import { Tooltip } from 'react-tooltip';
import { clean } from 'profanity-cleaner';

export default function LeaderboardPage() {
  const { leaderboard, isLoadingLeaderboard, leaderboardError, fetchLeaderboard } = useFetchedStats();
  const [isLoading, setIsLoading] = useState(true);
  const [cleanedLeaderboard, setCleanedLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    const loadLeaderboard = async () => {
      setIsLoading(true);
      await fetchLeaderboard();
      setIsLoading(false);
    };
    loadLeaderboard();
  }, [fetchLeaderboard]);

  useEffect(() => {
    if (leaderboard) {
      const cleaned = leaderboard.filter(entry => 
        !clean(entry.storage_key, {
          exceptions: ["funk"],
          customBadWords: ["webduno"],
        }).includes("***")
      );
      setCleanedLeaderboard(cleaned);
    }
  }, [leaderboard]);

  return (
    <>
      <div className='w-100 autoverflow-y h-100vh  flex-col flex-justify-start'>
        <div className='flex-row w-100 w-max-1080px  tx-altfont-2'>
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
          <div className='tx-bold tx-lg  flex-col px-4  flex-align-stretch'>





            
    <div className='flex-col mb-100'>
            <div className='tx-lg tx-altfont-2 tx-bold  tx-ls-1'
            style={{
              color: "#777777",
            }}
            >🏆 Global Leaderboard</div>
          </div>

              
              <div className='tx-altfont-2 opaci-50 tx-xsm flex-row px-2'>
                <div className='w-50px'>Rank</div>
                <div className='flex-1 pl-4'>Player ID</div>
                <div className=''>Score</div>
              </div>
              <hr className='w-100 opaci-10' />
              <div className='flex-col gap-2 w-100 pb-100'>
                {isLoading || isLoadingLeaderboard ? (
                  <div className='tx-center py-8'>Loading leaderboard...</div>
                ) : leaderboardError ? (
                  <div className='tx-center py-8 tx-red'>{leaderboardError}</div>
                ) : cleanedLeaderboard && cleanedLeaderboard.length > 0 ? (
                  cleanedLeaderboard.map((entry, index) => (
                    <div key={entry.storage_key} className='tx-altfont-2 w-100 flex-row tx-md pb-4 pt-2 pr-4'
                      style={{
                        borderBottom: "1px solid #e5e5e5",
                      }}
                    >
                      <div className='w-50px tx-bold-2 pl-4 tx-grey'>
                        {index == 0 ?
                        <div className='tx-bold-2'>
                          {/* cup emoji */}
                          🥇
                          </div> : index == 1 ?
                        <div className='tx-bold-2'>
                          {/* silver medal emoji */}
                          🥈
                          </div> : index == 2 ?
                        <div className='tx-bold-2'>
                          {/* bronze medal emoji */}
                          🥉
                          </div> :
                        <div className='tx-bold-2'>
                          #{index + 1}
                        </div>}
                      </div>
                      <div className='flex-1 tx-grey'>
                        {true &&
                        <div className='tx-bold'
                        style={{
                          color: "#777777",
                        }}
                        >
                          {clean(entry.storage_key,{
                            exceptions: ["funk"]
                          })}
                        </div>}
                      </div>
                      <div className='tx-bold-2'>
                        {parseInt(entry.total_score.toString())}
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
    </>
  );
} 


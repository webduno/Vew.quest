'use client';
import { useState, useEffect } from 'react';
import { useFetchedStats } from '@/script/state/context/FetchedStatsContext';
import { BewWorldLogo } from '../../dom/bew/BewWorldLogo';
import { clean } from 'profanity-cleaner';
import { BewPageHeader } from '@/dom/bew/BewPageHeader';
import { usePlayerStats } from '@/../script/state/hook/usePlayerStats';
import { NavigationHeaderBar } from '@/dom/bew/NavigationHeaderBar';
import { LeaderboardTable } from '@/dom/bew/LeaderboardTable';
import { sortAndFilterLeaderboard } from '@/script/utils/leaderboard/sortLeaderboard';
import { VersionTag } from '@/dom/bew/VersionTag';

export default function LeaderboardPage() {
  const { leaderboard, isLoadingLeaderboard, leaderboardError, fetchLeaderboard } = useFetchedStats();
  const [cleanedLeaderboard, setCleanedLeaderboard] = useState<any[]>([]);
  const { LS_playerId } = usePlayerStats();

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  useEffect(() => {
    if (leaderboard) {
      const cleaned = sortAndFilterLeaderboard(leaderboard);
      setCleanedLeaderboard(cleaned);
    }
  }, [leaderboard]);

  return (
    <div className='w-100 autoverflow-y h-100vh flex-col flex-justify-start'>
      <NavigationHeaderBar linkList={<>
        <a href="/profile" className='nodeco' style={{ color: "#AFAFAF" }}>
          <div>Profile</div>
        </a>
        <a href="/about" className='nodeco' style={{ color: "#AFAFAF" }}>
          <div>About <VersionTag /></div>
        </a>
      </>} />
      <BewPageHeader title="Leaderboard" />
      <div className='flex-col flex-align-stretch w-max-700px w-100'>
        <div className='tx-bold tx-lg flex-col px-4 flex-align-stretch'>
          <div className='flex-col mb-100'>
            <LeaderboardTable 
              leaderboard={cleanedLeaderboard}
              isLoading={isLoadingLeaderboard}
              error={leaderboardError}
              currentPlayerId={LS_playerId}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 


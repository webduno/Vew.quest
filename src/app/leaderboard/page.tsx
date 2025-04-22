'use client';
import { useState, useEffect } from 'react';
import { useFetchedStats } from '@/script/state/context/FetchedStatsContext';
import { BewWorldLogo } from '../../dom/bew/BewWorldLogo';
import { clean } from 'profanity-cleaner';
import { BewPageHeader } from '@/dom/bew/BewPageHeader';
import { usePlayerStats } from '@/../script/state/hook/usePlayerStats';
import { NavigationHeaderBar } from '@/dom/bew/NavigationHeaderBar';
import { LeaderboardTable } from '@/dom/bew/LeaderboardTable';

export default function LeaderboardPage() {
  const { leaderboard, isLoadingLeaderboard, leaderboardError, fetchLeaderboard } = useFetchedStats();
  const [cleanedLeaderboard, setCleanedLeaderboard] = useState<any[]>([]);
  const { LS_playerId } = usePlayerStats();

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
          // First sort by actual streak
          if (b.streak !== a.streak) {
            return b.streak - a.streak;
          }
          // Then by potential streak if actual streaks are equal
          const potentialStreakA = a.potential_streak || 0;
          const potentialStreakB = b.potential_streak || 0;
          if (potentialStreakB !== potentialStreakA) {
            return potentialStreakB - potentialStreakA;
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
      <NavigationHeaderBar linkList={<>
        <a href="/about" className='nodeco' style={{ color: "#AFAFAF" }}>
          <div>About</div>
        </a>
        <a href="/profile" className='nodeco' style={{ color: "#AFAFAF" }}>
          <div>Profile</div>
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


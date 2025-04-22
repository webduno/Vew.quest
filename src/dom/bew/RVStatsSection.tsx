'use client';
import { UserStats } from '@/script/utils/calculations';

interface RVStatsSectionProps {
  userStats: UserStats;
  uniqueDays: string[];
}

export function RVStatsSection({ userStats, uniqueDays }: RVStatsSectionProps) {
  return (
    <div className='bord-r-15 pb-2 pt-4 px-4' style={{ border: "1px solid #f0f0f0" }}>
      <div className='tx-bold tx-lg mb-2 '>RV Stats</div>
      <div className='flex-col gap-2 flex-align-start'>
        <div>Streak Potential: {userStats.streak || userStats.potentialStreak}</div>
        <div>Days of practice: {uniqueDays.length}</div>
        <div>Total Requests: {userStats.totalRequests}</div>
        <div>First Request: {userStats.firstRequestDate ? new Date(userStats.firstRequestDate).toLocaleDateString() : 'No requests yet'}</div>
        <div>Average Accuracy: {userStats.averageAccuracy.toFixed(3)}%</div>
        <div>Personal Record: {userStats.bestAccuracy.toFixed(3)}%</div>
      </div>
    </div>
  );
} 
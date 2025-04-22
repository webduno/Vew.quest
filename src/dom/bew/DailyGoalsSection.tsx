'use client';
import { UserStats } from '@/script/utils/calculations';

interface DailyGoalsSectionProps {
  streak: number;
  userStats: UserStats;
  crvObjects: any[];
}

export function DailyGoalsSection({ streak, userStats, crvObjects }: DailyGoalsSectionProps) {
  return (
    <div className='bord-r-15 pt-4 pb-2 px-4' style={{ border: "1px solid #f0f0f0" }}>
      <div className='tx-bold tx-lg mb-2'>Daily Goals</div>
      <div className='flex-col gap-2 flex-align-start'>
        <div>Current Streak: {streak}</div>
        <div>Completed Goal: {crvObjects.filter(obj => obj.created_at.split('T')[0] === new Date().toISOString().split('T')[0]).length >= 5 ? '✅' : "❌"} ({userStats.dailyGoals.requests > 5 ? 5 : userStats.dailyGoals.requests} / 5)</div>
        <div>Viewed Today: {userStats.dailyGoals.requests}</div>
        <div>Avg Accuracy: {userStats.dailyGoals.accuracy > 0 ? userStats.dailyGoals.accuracy.toFixed(3) : 'N/A'}%</div>
        <div>Best Today: {userStats.dailyGoals.bestAccuracy > 0 ? userStats.dailyGoals.bestAccuracy.toFixed(3) : 'N/A'}%</div>
      </div>
    </div>
  );
} 
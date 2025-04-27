'use client';
import { UserStats } from '@/script/utils/calculations';

interface RVStatsSectionProps {
  userStats: UserStats;
  uniqueDays: string[];
}

export function RVStatsSection({ userStats, uniqueDays }: RVStatsSectionProps) {
  return (
    <div className='bord-r-15 pb-2 pt-4 px-4' style={{ border: "2px solid #f0f0f0" }}>
      <div className='tx-bold tx-sm mb-2 tx-ls-3 pb-2'
      style={{
        borderBottom: "1px solid #f0f0f0",
      }}
      >📊 RV Stats</div>
      <div className='flex-col gap-2 flex-align-start'>
        <PanelListRow vlabel="Streak Potential" vvalue={userStats.potentialStreak} />
        <PanelListRow vlabel="Days of practice" vvalue={uniqueDays.length} />
        <PanelListRow vlabel="Total Requests" vvalue={userStats.totalRequests} />
        <PanelListRow vlabel="First Request" vvalue={userStats.firstRequestDate ? new Date(userStats.firstRequestDate).toLocaleDateString() : 'No requests yet'} />
        <PanelListRow vlabel="Average Accuracy" vvalue={userStats.averageAccuracy.toFixed(3)+"%"} />
        <PanelListRow vlabel="Personal Record" vvalue={userStats.bestAccuracy.toFixed(3)+"%"} />
      </div>
    </div>
  );
} 

export const PanelListRow = ({vlabel = "label", vvalue}: {vlabel: string, vvalue: any})=>{
  return (
    <div className="flex-row w-100 gap-1">
      <div className='flex-1'>{vlabel}:</div>
      <div className=''>{vvalue}</div>
    </div>
  )
}
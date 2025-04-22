import { Tooltip } from 'react-tooltip';
import { clean } from 'profanity-cleaner';

interface LeaderboardEntry {
  storage_key: string;
  streak: number;
  potential_streak: number;
  highest_accuracy: number | string;
  total_score: number | string;
}

interface LeaderboardTableProps {
  leaderboard: LeaderboardEntry[];
  isLoading: boolean;
  error: string | null;
  currentPlayerId: string | null;
}

export function LeaderboardTable({ leaderboard, isLoading, error, currentPlayerId }: LeaderboardTableProps) {
  if (isLoading) {
    return <div className='tx-center py-8 opaci-20'>Loading leaderboard...</div>;
  }

  if (error) {
    return <div className='tx-center py-8 tx-red'>{error}</div>;
  }

  if (!leaderboard || leaderboard.length === 0) {
    return <div className='tx-center py-8'>No leaderboard data available</div>;
  }

  return (
    <div className='flex-col gap-2 w-100 '>
      <div className='tx-altfont-2 opaci-50 tx-xsm flex-row px-2 mt-8 w-100'>
        <div className='w-50px'>Rank</div>
        <div className='flex-1 pl-4'>Player ID</div>
        <div className='pl-2'>Score</div>
        <div className=' pl-2'>Highest</div>
        <Tooltip id="accuracy-tooltip" />
        <div
          data-tooltip-id="accuracy-tooltip"
          data-tooltip-content="Streak / Potential"
          className='pl-2'
        >
          🔥/<span className='tx-bold-2' style={{ filter: "grayscale(100%)" }}>🔥</span>
        </div>
      </div>
      <hr className='w-100 opaci-10' />
      {leaderboard.map((entry, index) => (
        <div key={entry.storage_key} className='tx-altfont-2 w-100 flex-row tx-md pb-2 pr-4'
          style={{
            borderBottom: "1px solid #e5e5e5",
            background: entry.storage_key.toLowerCase() === currentPlayerId?.toLowerCase() ? 'linear-gradient(90deg, rgba(255,255,0,0.1) 0%, rgba(255,255,0,0.05) 100%)' : 'transparent'
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
            href={`/u?friend=${entry.storage_key}`}
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
            {parseInt(entry.highest_accuracy?.toString() || '0')}%
          </div>
          <div className='tx-bold-2 pl-2'>
            {entry.streak > 0 ? (
              <span className='tx-bold-8' style={{ color: "#dd902E" }}>🔥{entry.streak}</span>
            ) : (
              <span className='tx-bold-2' style={{ filter: "grayscale(100%)" }}>🔥{entry.potential_streak || 0}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 
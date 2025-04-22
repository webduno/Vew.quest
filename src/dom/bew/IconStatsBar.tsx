'use client';

export const IconStatsBar = ({
  potentialStreak, streak, points, hearts
}: { potentialStreak?: number; streak: number; points: number; hearts: number; }) => {
  return (
    <div className='flex-row flex-justify-between tx-altfont-2'>
      <button className='tx- lg pa-2 pt-4  opaci-chov--50 flex-wrap'
        data-tooltip-id="streak-tooltip"
        data-tooltip-content="Streak"
        data-tooltip-place="bottom"
        data-tooltip-variant='warning'
      >
        {!streak ?
          <div className='tx-lg tx-center'
            style={{
              filter: "grayscale(100%)",
            }}
          >🔥</div>
          :
          <div className='tx-lg tx-center'>🔥</div>}
        <div className='tx-bold-5' style={{ color: "#FFB02E" }}>{streak || potentialStreak}</div>
      </button>
      <button className='tx- lg pa-2 pt-4  opaci-chov--50 flex-wrap'
        data-tooltip-id="points-tooltip"
        data-tooltip-content="Points"
        data-tooltip-place="bottom"
        data-tooltip-variant='info'
      >
        <div className='tx-lg tx-center'>💎</div>
        <div className='tx-bold-5' style={{ color: "#00A6ED" }}>{points}</div>
      </button>
      <button className='tx- lg pa-2 pt-4  opaci-chov--50 flex-wrap'
        data-tooltip-id="hearts-tooltip"
        data-tooltip-content="Average"
        data-tooltip-place="bottom"
        data-tooltip-variant='error'
      >
        <div className='tx-lg tx-center'>💖</div>
        <div className='tx-bold-5' style={{ color: "#F92F60" }}>{hearts}%</div>
      </button>
    </div>
  );
};

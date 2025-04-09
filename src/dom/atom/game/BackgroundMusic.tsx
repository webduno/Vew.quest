"use client"

import { useBackgroundMusic } from '@/../scripts/contexts/BackgroundMusicContext';
import { GameButton } from './GameButton';

export function BackgroundMusic({ firstTime,disableFirstTime }: { firstTime: boolean,disableFirstTime: () => void }) {
  const { isPlaying, togglePlay } = useBackgroundMusic();

  if (firstTime) {
    return (
      <div className='flex-col gap-1 pos-abs z-1000 bord-r-10 px-2 '
      style={{
        background: "radial-gradient(#555555 , #000000 )",
        boxShadow: "0 0 1px 6px #886633, 2px 2px 1px 9px #443311, -1px -1px 2px 7px #ffccaa",
      }}
      >
                <div className='tx-white tx-shadow-5 translate-y-25 tx-altfont-1 tx-mdl tx-center'>Play with  <br /> audio?</div>

      <div className='flex-row gap-1 translate-y-50'>
      <button  className="bord-r-5 pointer pb-1 "
      onClick={() => {
        disableFirstTime();
      }}
      style={{
        background: "#663333",
      }}
        >
          <span className='tx-mdl'>🔇</span>
        </button>
      <button  className="bord-r-5 pointer pb-1 "
      onClick={() => {
        togglePlay();
        disableFirstTime();
      }}
      style={{
        background: "#336633",
      }}
        >
          <span className='tx-mdl'>🔊</span>
        </button>
        </div>
        </div>
    )
  }

  return (
    <div
      className='pos-abs top-0 left-0 mt-3 ml-150  '
      onClick={togglePlay}
      style={{
        zIndex: 9000,
        position: 'fixed',
      }}
    >
      <button  className="bord-r-5 pointer pb-1 "
      style={{
        background: "#333333",
      }}
       >
        {!isPlaying ? (
          <>
            {/* music emoji */}
            <span className='tx-mdl'>🔇</span>
          </>
        ) : (
          <>
            {/* pause emoji */}
            <span className='tx-mdl'>🔊</span>
          </>
        )}
      </button>
    </div>
  );
} 
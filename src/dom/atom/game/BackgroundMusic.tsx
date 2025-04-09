"use client"

import { useBackgroundMusic } from '@/../scripts/contexts/BackgroundMusicContext';
import { GameButton } from './GameButton';

export function BackgroundMusic() {
  const { isPlaying, togglePlay } = useBackgroundMusic();

  return (
    <div
      className='pos-abs top-0 left-0 mb-100 ma-3 ml-150  '
      onClick={togglePlay}
      style={{
        zIndex: 9000,
        position: 'fixed',
      }}
    >
      <button  className="bord-r-5 pointer "
      style={{
        background: "#333333",
      }}
       >
        {!isPlaying ? (
          <>
            {/* music emoji */}
            <span className='tx-lg'>🔇</span>
          </>
        ) : (
          <>
            {/* pause emoji */}
            <span className='tx-lg'>🔊</span>
          </>
        )}
      </button>
    </div>
  );
} 
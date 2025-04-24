'use client';
import { BewLogo } from '@/dom/atom/logo/BewLogo';
import { BewUserStatsSummary } from '@/dom/bew/BewUserStatsSummary';
import { isMobile } from '@/script/utils/platform/mobileDetection';
import { UserStats } from '@/script/utils/calculations';
import { IconStatsBar } from './IconStatsBar';
import { useProfileSnackbar } from '@/script/state/context/useProfileSnackbar';
import { useBackgroundMusic } from '../../../script/state/context/BackgroundMusicContext';
import { useRouter } from 'next/navigation';
import { BewOrangeBtn } from './BewBtns';
interface UserProfileHeaderProps {
  playerId: string | null;
  userStats: UserStats;
  crvObjects: any[];
  onCopyUsername: () => void;
  showTrueSummary?: boolean;
  guestStats: any;
  potentialStreak?: number;
  pfp?: string;
}

export function UserProfileHeader({ playerId, userStats, crvObjects, onCopyUsername,
   showTrueSummary = true, guestStats, potentialStreak, pfp }: UserProfileHeaderProps) {
  const { setSnackbarMessage, setSnackbarSeverity, setIsSnackbarOpen, triggerSnackbar } = useProfileSnackbar();
  const { playSoundEffect } = useBackgroundMusic();
  
  return (
    <div className='flex-wrap Q_xs_sm_flex-col flex-align-center gap-4 pb-100 pos-rel tx-altfont-2'
      style={{
        color: "#777777",
      }}
    >
      <div className='flex-col px-2 pos-rel'>
        <div className="pos-rel">
          {!!showTrueSummary && (
            <button className='pos-abs bottom-0 right-0 mb-8 bg-white bord-r-10 px-2 py-1 tx-bold pointer '
              onClick={() => {
                // alert('Coming soon!');
                triggerSnackbar("Coming soon!", "info");
              }}
            style={{
              color: "#aaaaaa",
              border: "1px solid #f0f0f0",
            }}
          >
            <div className='Q_sm_x'>Change</div>
            <div className='Q_xs_sm'>🔄</div>
          </button>
          )}

          <div className='tx-mdl pt-4 pointer tx-center'
            onClick={onCopyUsername}
          >
            <div className='tx-altfont-2 tx-lgx'>{playerId || 'Not set'}</div>
          </div>
          <img src={pfp || "/bew/pfp/row-4-column-1.png"}
            alt="pfp" className={'bord-r-50 noverflow block ' + (isMobile() ? 'w-150px' : 'w-250px')} />
        </div>
        <div>
        <a href={`/party/${playerId}`} className='tx-bold pointer mb-4 block'>
        <BewOrangeBtn text="Start Party" onClick={() => {
        }}/>
        </a>
        </div>
        <div className='bord-r-15 mb-4 pb-2 flex-col ' style={{ border: "1px solid #f0f0f0" }}>
          {!showTrueSummary && (<>
          <IconStatsBar 
          streak={guestStats.streak}
          potentialStreak={potentialStreak}
          points={guestStats.points || 0}
          hearts={guestStats.hearts || 0}
           />
          </>)}
          {!!showTrueSummary && (
            <>
              <BewUserStatsSummary minified />
              <hr className='w-100 opaci-10 ' />
            </>
          )}
          <details className='w-150px px-2'>
            <summary className='tx-bold pointer'>More info</summary>
            <div className='flex-col flex-align-start pt-2 w-150px'>
              <div className='py-2'>🔥 → Streak (Daily Remote Viewings in a row)</div>
              <div className='py-2'
                style={{
                  borderTop: "1px solid #f0f0f0",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >💎 → Points (Total Completed Remote Viewings)</div>
              <div className='py-2'>💖 → Hearts (Accuracy Average)</div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
} 
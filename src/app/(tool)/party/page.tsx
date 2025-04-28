'use client';
import { useState, useEffect } from 'react';
import { usePlayerStats } from '@/../script/state/hook/usePlayerStats';

import { useFetchedStats } from '@/script/state/context/FetchedStatsContext';
import { useBackgroundMusic } from '@/../script/state/context/BackgroundMusicContext';
import { PartyToolLogin } from '@/dom/organ/vew_party/PartyToolLogin';
import { useRouter } from 'next/navigation';
import { useProfileSnackbar } from '@/script/state/context/useProfileSnackbar';


export type GameState = 'initial' | 'playing' | 'results';

export default function PartyPage() {
  const { isLoading, crvObjects } = useFetchedStats();
  const [initiallyAutoLoaded, setInitiallyAutoLoaded] = useState(false);
  const { playSoundEffect } = useBackgroundMusic();
  const { triggerSnackbar } = useProfileSnackbar();
  const router = useRouter();
  useEffect(() => {
    if (isLoading) { return; }
    if (initiallyAutoLoaded) { return; }
    if (!LS_playerId) {
      // setEnterUsername(true);
      return;
    }
    // console.log("crvObjects", crvObjects.length);
    setInitiallyAutoLoaded(true);
    if (crvObjects.length === 0) { 

      // generateNewRound()
      return; 
    }
    // console.log("crvObjects 22", crvObjects);
    // console.log("initiallyAutoLoaded", initiallyAutoLoaded);

    // handleStart();

  }, [isLoading]);
  const [ wndwTg, s__wndwTg] = useState<any>(null);
  const [ telegram_id, s__telegram_id] = useState<string | null>(null);

  const handlePartyStartSetup = (friendUsername?: string) => {
    // console.log("handlePartyStartSetup");

    // redirect to /party/id
    router.push(`/party/${friendUsername}`);
  }

  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     console.log("window.Telegram", window.Telegram);

  //   }
  //     if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
  //     s__wndwTg(window.Telegram.WebApp);
  //     const thenewid = window.Telegram.WebApp.initDataUnsafe?.user?.id || null;
  //     console.log("thenewid", thenewid);
  //     s__telegram_id(thenewid);
  //     if (thenewid) {
  //       setPlayerId(thenewid);
  //       localStorage.setItem('VB_PLAYER_ID', thenewid);
  //       generateNewRound()

  //     }
  //   }
  // }, []);


  const { LS_playerId, typedUsername, setTypedUsername, sanitizePlayerId } = usePlayerStats();
  
  
  return (
    <div className='w-100 h-100  flex-col flex-justify-start'>
      <div className='w-100  flex-col  '>
          <PartyToolLogin
            actionLabel="GO TO ROOM"
            gameState={'initial'}
            setGameState={() => {}}
            typedUsername={typedUsername}
            setTypedUsername={setTypedUsername}
            isLoading={isLoading}
            handleStart={(e: any) => {
              if (!e) {
                triggerSnackbar(<div className='tx-center'>Please enter a <br /> friend&apos;s username</div>, 'error');
                return;
              }
              handlePartyStartSetup(e)
            }}
            sanitizePlayerId={sanitizePlayerId}
          />


























    </div>
    </div>
  );
} 




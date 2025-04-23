'use client';
import { useState, useCallback, useEffect } from 'react';
import { usePlayerStats } from '@/../script/state/hook/usePlayerStats';

import { AnalogModalScreen } from '@/dom/molecule/game/SenseMeter/AnalogModalScreen';
import { calculateAccuracy } from '@/../script/utils/play/calculateAccuracy';
import { BewLogo } from '@/dom/atom/logo/BewLogo';
import { KeyboardBtn } from '@/dom/atom/button/KeyboardBtn';
import { PaperSheet } from '@/dom/atom/toast/PaperSheet';
import targetsData from '@/../public/data/targets_1.json';
import { AnalogMobileScreen } from '@/dom/bew/AnalogMobileScreen';
import { Tooltip } from 'react-tooltip';
import { BewUserStatsSummary } from '@/dom/bew/BewUserStatsSummary';
import { isMobile } from '@/../script/utils/platform/mobileDetection';
import { useFetchedStats } from '@/script/state/context/FetchedStatsContext';
import { MenuBarItem } from '@/dom/bew/MenuBarItem';
import { random10CharString } from '@/../script/utils/platform/random10CharString';
import { InitialToolLogin } from '@/dom/bew/InitialToolLogin';
import { generateRandomTargetRandomized } from '@/../script/utils/platform/generateRandomTargetRandomized';
import { ToolResultsCard } from '@/dom/bew/ToolResultsCard';
import { BewWorldLogo } from '@/dom/bew/BewWorldLogo';
import { useBackgroundMusic } from '@/../script/state/context/BackgroundMusicContext';
import { MenuIconBar } from '@/dom/bew/MenuIconBar';
import { PartyToolLogin } from '@/dom/bew/PartyToolLogin';
import { useRouter } from 'next/navigation';
import { useProfileSnackbar } from '@/script/state/context/useProfileSnackbar';

type TargetsData = {
  [key: string]: string;
};

export type GameState = 'initial' | 'playing' | 'results';

export default function PartyPage() {
  const { isLoading, crvObjects, mailboxRequests, isLoadingMailbox, mailboxError, fetchMailboxRequests, refetchStats } = useFetchedStats();
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
    console.log("crvObjects", crvObjects.length);
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
    console.log("handlePartyStartSetup");

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


  const { LS_playerId, typedUsername, setTypedUsername, setPlayerId, sanitizePlayerId } = usePlayerStats();
  
  
  return (
    <div className='w-100 h-100  flex-col flex-justify-start'>
      <div className='w-100  flex-col  '>
          <PartyToolLogin
            gameState={'initial'}
            setGameState={() => {}}
            typedUsername={typedUsername}
            setTypedUsername={setTypedUsername}
            isLoading={isLoading}
            handleStart={(e) => {
              if (!e) {
                triggerSnackbar('Please enter a username', 'error');
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




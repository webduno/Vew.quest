'use client';
import { Tooltip } from 'react-tooltip';
import { useFetchedStats } from '@/script/state/context/FetchedStatsContext';
import { useState, useEffect, useMemo, useRef } from 'react';
import { IconStatsBar } from '../../bew/IconStatsBar';
import { ChatBox } from '../../bew/ChatBox';
import { useProfileSnackbar } from '@/script/state/context/useProfileSnackbar';


export const WrappedPartyStatsSummary = ({  
  chatData,
  fullPartyData,
  room_key, fetchPartyData, minified = false, notes = '', onNotesUpdate, playerId, sharedIdState
}: { 
  chatData: string,
  fullPartyData: any, room_key?: string, fetchPartyData: (id:string) => Promise<any>,
   minified?: boolean, notes?: string, onNotesUpdate?: (newNotes: string) => void,
    playerId?: string | null, sharedIdState?: [string | null, (id: string | null) => void] }) => {
  const { streak, crvObjects, potentialStreak, averageResult } = useFetchedStats();
  return <PartyStatsSummary 
  chatData={chatData}
  fullPartyData={fullPartyData}
  fetchPartyData={fetchPartyData}
  room_key={room_key} 
  minified={minified}
  crvObjects_length={crvObjects.length}
  calculatedStats={{
    potentialStreak: potentialStreak,
    streak: streak,
    averageResult: averageResult,
  }}
  notes={notes}
  onNotesUpdate={onNotesUpdate}
  playerId={playerId}
  sharedIdState={sharedIdState}
  />
}
export const PartyStatsSummary = ({
  fullPartyData,
  fetchPartyData,
  minified = false,
  calculatedStats,
  crvObjects_length = 0,
  notes = '',
  onNotesUpdate = undefined,
  playerId = undefined,
  room_key = undefined,
  sharedIdState = undefined,
  chatData = ''
}: {
  fullPartyData: any;
  chatData: string;
  fetchPartyData: (id:string) => Promise<any>;
  room_key?: string;
  minified?: boolean;
  calculatedStats?: any;
  crvObjects_length?: number;
  notes?: string;
  onNotesUpdate?: (newNotes: string) => void;
  playerId?: string | null;
  sharedIdState?: [string | null, (id: string | null) => void];
}) => {
  const { triggerSnackbar } = useProfileSnackbar();
  const [LS_playerId, setLS_playerId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { potentialStreak, streak, dailyProgress, dailyGoal, isLoading, error,  averageResult } = (calculatedStats || {
    potentialStreak: 0,
    streak: 0,
    dailyProgress: 0,
    dailyGoal: 0,
    isLoading: false,
    error: null,
    averageResult: 0
  })
  const chatLinesRef = useRef<HTMLDivElement>(null);
  const ownSubFriendId = useMemo(() => {
    return room_key?.split('>>>')[0] === playerId ? 'f1:' : 'f2:';
  }, [room_key, playerId]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLS_playerId(localStorage.getItem('VB_PLAYER_ID'));
    }
  }, []);
  useEffect(() => {
    if (chatLinesRef.current) {
      chatLinesRef.current?.scrollTo({
        top: chatLinesRef.current?.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [notes]);

  if (isLoading) {
    return <div 
    style={{
      color: "#cccccc",
    }}
    className='py-2 tx-ls-3'>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (minified) {
    return (
      <IconStatsBar potentialStreak={potentialStreak}  streak={streak}
      points={crvObjects_length}
      hearts={Math.round(averageResult)}
      />
    );
  }

  // Parse notes into chat lines
  const chatLines = useMemo(() => (chatData || '').split(/\r?\n/).filter(Boolean), [chatData]);

  return (<>
    <IconStatsBar potentialStreak={potentialStreak}  streak={streak}
    points={crvObjects_length}
    hearts={Math.round(averageResult)}
    />

    <div className='flex-col flex-align-stretch gap-4 tx-altfont-2' >
      <div className='bord-r-15 pa-4 pl-2 border-gg' 
      >
        <div className='flex-row flex-justify-start gap-2'>
          <div>
            <div className='tx-lgx'>✨</div>
          </div>
          <div className='flex-col flex-align-start gap-2 flex-1'>
            <div className='tx-bold'
            style={{
              color: "#4B4B4B",
            }}
            >Daily Goal</div>
            <div className='tx-sm tx-bold bord-r-25  w-100 ' style={{
              padding: "3px 0",
              boxShadow: "0 2px 0 #D68800",
              background: "#FDC908",
              color: "#D68800",
            }}>
              <div className='flex-row gap-1'>
                <div>{dailyProgress || 0}/{dailyGoal || 3}</div>
                <div>Targets</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <a href="/profile" className='nodeco'>
            <div className='py-2 mt-4 tx-center tx-white bord-r-10  opaci-chov--75'
            data-tooltip-id="view-profile-tooltip"
            data-tooltip-content={`${LS_playerId}`}
            data-tooltip-place="bottom"
            style={{
              backgroundColor: "#807DDB",
              boxShadow: "0px 4px 0 0px #6B69CF",
            }}
            >{LS_playerId?.slice(0, 9) + ((LS_playerId || "")?.length > 9 ? "..." : "")}{"'s Profile"}</div>
          </a>
          <Tooltip id="view-profile-tooltip" />
          <Tooltip id="home-tooltip" />
          <Tooltip id="lessons-tooltip" />
          <Tooltip id="goals-tooltip" />
          <Tooltip id="profile-tooltip" />
          <Tooltip id="settings-tooltip" />
          <Tooltip id="help-tooltip" />
        </div>
      </div>

      <ChatBox
        room_key={room_key || ''}
        sharedIdState={sharedIdState || [null, () => {}]}
        chatLinesRef={chatLinesRef}
        chatLines={chatLines}
        ownSubFriendId={ownSubFriendId}
        playerId={playerId}
        onNotesUpdate={(newMessage)=>{
          onNotesUpdate && onNotesUpdate(newMessage)
        }}
        fetchPartyData={fetchPartyData}
        message={message}
        setMessage={setMessage}
        isSending={isSending}
        setIsSending={setIsSending}
        notes={notes}
      />

<button 
      onClick={()=>{
        navigator.clipboard.writeText(`${window.location.origin}/party/${LS_playerId}`);
        triggerSnackbar('Copied to clipboard', "success");
      }}
      className='bord-r-15 pa-3 pl-2 opaci-chov--75 nodeco border-gg' 
      >
        <div className='flex-row flex-justify-start gap-2'>
          <div>
            <div className='tx-lgx'>🔗</div>
          </div>
          <div className='flex-col flex-align-start gap-2'>
            <div className='tx-bold'
            style={{
              color: "#4B4B4B",
            }}
            >Copy my party link</div>
            <div className='tx-sm ' style={{color: "#afafaf"}}>
              <div className='flex-col gap-1'>
                <div>party/{LS_playerId}</div>
              </div>
            </div>
          </div>
        </div>
        <div></div>
      </button>
      {/* <a 
      href="/dashboard"
      className='bord-r-15 pa-4 pl-2 opaci-chov--75 nodeco border-gg' 
      >
        <div className='flex-row flex-justify-start gap-2'>
          <div>
            <div className='tx-lgx'>🧮</div>
          </div>
          <div className='flex-col flex-align-start gap-2'>
            <div className='tx-bold'
            style={{
              color: "#4B4B4B",
            }}
            >Open Dashboard</div>
            <div className='tx-sm ' style={{color: "#afafaf"}}>
              <div className='flex-col gap-1'>
                <div>Web Apps &amp; MiniGames</div>
              </div>
            </div>
          </div>
        </div>
        <div></div>
      </a> */}
    </div>
  </>);
};



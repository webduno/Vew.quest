'use client';
import { Tooltip } from 'react-tooltip';
import { useFetchedStats } from '@/script/state/context/FetchedStatsContext';
import { useState, useEffect, useMemo, useRef } from 'react';
import { IconStatsBar } from './IconStatsBar';


export const WrappedPartyStatsSummary = ({  
  fullPartyData,
  roomkey, refetchStats, minified = false, notes = '', onNotesUpdate, playerId }: { fullPartyData: any, roomkey?: string, refetchStats: () => void, minified?: boolean, notes?: string, onNotesUpdate?: (newNotes: string) => void, playerId?: string | null }) => {
  const { streak, crvObjects, potentialStreak, averageResult } = useFetchedStats();
  return <PartyStatsSummary 
  fullPartyData={fullPartyData}
  refetchStats={refetchStats}
  roomkey={roomkey} 
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
  />
}
export const PartyStatsSummary = ({
  fullPartyData,
  refetchStats,
  minified = false,
  calculatedStats,
  crvObjects_length = 0,
  notes = '',
  onNotesUpdate = undefined,
  playerId = undefined,
  roomkey = undefined
}: {
  fullPartyData: any;
  refetchStats: () => void;
  roomkey?: string;
  minified?: boolean;
  calculatedStats?: any;
  crvObjects_length?: number;
  notes?: string;
  onNotesUpdate?: (newNotes: string) => void;
  playerId?: string | null;
}) => {
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
    console.log('roomkey', roomkey);
    return roomkey?.split('>>>')[0] === playerId ? 'f1:' : 'f2:';
  }, [roomkey, playerId]);

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
  const chatLines = (notes || '').split(/\r?\n/).filter(Boolean);

  return (<>
    <IconStatsBar potentialStreak={potentialStreak}  streak={streak}
    points={crvObjects_length}
    hearts={Math.round(averageResult)}
    />

    <div className='flex-col flex-align-stretch gap-4'>
      <div className='bord-r-10 pa-4 pl-2' 
      style={{
        border: "1px solid #E5E5E5",
      }}
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
          <Tooltip id="streak-tooltip" />
          <Tooltip id="points-tooltip" />
          <Tooltip id="hearts-tooltip" />
        </div>
      </div>


      <div className='' 
      style={{
        borderRadius: "10px",
        border: "1px solid #E5E5E5",
      }}
      >
        <div className='flex-row  tx-smd flex-justify-between pt-4 pb-2 gap-2'>
          <div className='tx-bold px-4' 
          style={{
            color: "#4B4B4B",
          }}
          >Chat {ownSubFriendId}</div>
          <a 
          className='tx-bold px-4 pointer nodeco' 
          onClick={() => {
            alert("Coming soon!");
          }}            
          // href="/dashboard#resources"
          href="#"

          style={{
            color: "#22AEFF",
          }}
          >View All</a>
        </div>
        <div
        ref={chatLinesRef}
         className='flex-col pa-2 gap-2' style={{maxHeight: 180, overflowY: 'auto'}}>
          {chatLines.length === 0 && (
            <div className='tx-sm opaci-50'>No messages yet.</div>
          )}
          {chatLines.map((line, idx) => (
            <div key={idx} className={`pa-2 bord-r-10 my-1 ${playerId && line.startsWith('f1:') ? 'bg-blue-10' : 'bg-gray-10'}`}
              style={{
                background: line.startsWith('f1:') ? '#E5F0FF' : '#F5F5F5',
                color: '#333',
                alignSelf: line.startsWith('f1:') ? 'flex-end' : 'flex-start',
                maxWidth: '90%',
                wordBreak: 'break-word',
              }}
            >
              {line.replace(/^f\d+:/, '').trim()}
            </div>
          ))}
        </div>
        {onNotesUpdate && (
        <form className='flex-row flex-justify-start gap-2 pa-2 pt-3' onSubmit={async (e) => {
          e.preventDefault();
          if (!message.trim()) return;
          // fetch previous messages
          const returnedData = await refetchStats();
          await new Promise(resolve => setTimeout(resolve, 2000));
          console.log('returnedData', returnedData);
          const fullPartyData_live_data: any = JSON.parse(returnedData?.live_data)
          const uptodatenotes = fullPartyData_live_data?.notes || '';
          console.log('fullPartyData_live_data', fullPartyData_live_data);
          setIsSending(true);
          const newMessage = `${ownSubFriendId} ${message.trim()}`;
          const newNotes = (uptodatenotes ? uptodatenotes + '\n' : '') + newMessage;
          onNotesUpdate?.(newNotes);
          setMessage('');
          setTimeout(() => setIsSending(false), 300);
          
        }}>
          <input
            type="text"
            placeholder="Add a message"
            className='w-100 pa-2 bord-r-10 w-150px tx-center'
            style={{ border: "1px solid #E5E5E5" }}
            value={message}
            onChange={e => setMessage(e.target.value)}
            disabled={isSending}
          />
          <button type="submit" className=' flex-col pointer' disabled={isSending || !message.trim()} style={{background: 'none', border: 'none'}}>
            <div className='tx-l gx'>Send</div>
          </button>
        </form>
        )}
      </div>

      
      <a 
      href="/dashboard"
      className='bord-r-10 pa-4 pl-2 opaci-chov--75 nodeco' 
      style={{
        border: "1px solid #E5E5E5",
      }}
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
      </a>
    </div>
  </>);
};


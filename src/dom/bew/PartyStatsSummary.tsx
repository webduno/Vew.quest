'use client';
import { Tooltip } from 'react-tooltip';
import { useFetchedStats } from '@/script/state/context/FetchedStatsContext';
import { useState, useEffect } from 'react';
import { IconStatsBar } from './IconStatsBar';


export const WrappedPartyStatsSummary = ({ minified = false, notes = '', onNotesUpdate, playerId }: { minified?: boolean, notes?: string, onNotesUpdate?: (newNotes: string) => void, playerId?: string | null }) => {
  const { streak, crvObjects, potentialStreak, averageResult } = useFetchedStats();
  return <PartyStatsSummary minified={minified}
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
  minified = false,
  calculatedStats,
  crvObjects_length = 0,
  notes = '',
  onNotesUpdate = undefined,
  playerId = undefined
}: {
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLS_playerId(localStorage.getItem('VB_PLAYER_ID'));
    }
  }, []);

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
          >Chat</div>
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
        <div className='flex-col pa-2 gap-2' style={{maxHeight: 180, overflowY: 'auto'}}>
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
        <form className='flex-row flex-justify-start gap-2 pa-2 pt-3' onSubmit={e => {
          e.preventDefault();
          if (!message.trim()) return;
          setIsSending(true);
          // Add as f1 or f2 based on playerId
          const prefix = playerId ? 'f1:' : 'f2:';
          const newNotes = (notes ? notes + '\n' : '') + `${prefix} ${message.trim()}`;
          onNotesUpdate(newNotes);
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
          <button type="submit" className='h-80px flex-col pointer' disabled={isSending || !message.trim()} style={{background: 'none', border: 'none'}}>
            <div className='tx-lgx'>💬</div>
          </button>
        </form>
        )}
      </div>

      
      <a target='_blank'
      href="https://www.reddit.com/r/remoteviewing/comments/1k1y0ge/weekly_practice_objective_r16487/"
      className='bord-r-10 pa-4 pl-2 opaci-chov--75 nodeco' 
      style={{
        border: "1px solid #E5E5E5",
      }}
      >
        <div className='flex-row flex-justify-start gap-2'>
          <div>
            <div className='tx-lgx'>📅</div>
          </div>
          <div className='flex-col flex-align-start gap-2'>
            <div className='tx-bold'
            style={{
              color: "#4B4B4B",
            }}
            >Weekly Goal</div>
            <div className='tx-sm ' style={{color: "#afafaf"}}>
              <div className='flex-col gap-1'>
                <div>Reddit&apos;s Practice Object</div>
              </div>
            </div>
          </div>
        </div>
        <div></div>
      </a>
    </div>
  </>);
};


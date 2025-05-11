'use client';

import { api_partyGet } from '@/../script/state/service/vew';
import { useMemo } from 'react';

// --- ChatBox component ---

export const ChatBox = ({
  room_key,sharedIdState, showHeader = true,
  chatLinesRef, chatLines, ownSubFriendId, playerId, onNotesUpdate,
   fetchPartyData, message, setMessage, isSending, setIsSending, notes
}: {
  room_key: string;
  sharedIdState: [string | null, (id: string | null) => void];
  showHeader?: boolean;
  chatLinesRef: React.RefObject<HTMLDivElement>;
  chatLines: string[];
  ownSubFriendId: string;
  playerId?: string | null;
  onNotesUpdate?: (newNotes: string) => void;
  fetchPartyData: (id:string) => Promise<any>;
  message: string;
  setMessage: (msg: string) => void;
  isSending: boolean;
  setIsSending: (b: boolean) => void;
  notes: string;
}) => {
  const otherSubFriendId = useMemo(() => {
    console.log("room_key", room_key, room_key.split(">>>", ), playerId);
    return room_key.split(">>>").filter(id => id !== playerId)[0];
  }, [ownSubFriendId, room_key]);
  return (
  <div className='border-gg bord-r-15'>
    {showHeader && (
      <div className='flex-row  tx-smd flex-justify-between pt-4 pb-2 gap-2'>
        <div className='tx-bold px-4'
        style={{
          color: "#4B4B4B",
        }}
      >{otherSubFriendId} <span className='tx-sm opaci-50'></span></div>
      <a
        className='tx-bold px-4 pointer nodeco'
        onClick={() => {
          fetchPartyData(sharedIdState[0] || '');
        }}
        href="#"
        style={{
          color: "#22AEFF",
        }}
        >Refresh</a>
      </div>
    )}
    <div
      ref={chatLinesRef}
      className='flex-col pa-2 gap-2' style={{ minHeight: 180, maxHeight: 280, overflowY: 'auto' }}>
      {chatLines.length === 0 && (
        <div className='tx-sm opaci-50 pt-8 pb-100'>No messages yet.</div>
      )}
      {chatLines.map((line, idx) => (
        <div key={idx} className={`pa-2 bord-r-10 my-1 ${line.startsWith(ownSubFriendId) ? 'bg-blue-10' : 'bg-gray-10'}`}
          style={{
            background: line.startsWith(ownSubFriendId) ? '#E5F0FF' : '#F5F5F5',
            color: '#333',
            alignSelf: line.startsWith(ownSubFriendId) ? 'flex-end' : 'flex-start',
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
        const newMessage = `${ownSubFriendId} ${message.trim()}`;
        onNotesUpdate?.(newMessage);
        setMessage('');
        setTimeout(() => setIsSending(false), 300);
      }}>
        <input
          type="text"
          placeholder="Add a message"
          className='w-100 pa-2 bord-r-10 tx-center flex-1'
          style={{ border: "1px solid #E5E5E5" }}
          value={message}
          onChange={e => setMessage(e.target.value)}
          disabled={isSending} />
        <button type="submit" className=' flex-col pointer' disabled={isSending || !message.trim()} style={{ background: 'none', border: 'none' }}>
          <div className='tx-l gx'>Send</div>
        </button>
      </form>
    )}
  </div>
)}

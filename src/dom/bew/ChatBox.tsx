'use client';

import { api_partyGet } from '@/../script/state/service/vew';

// --- ChatBox component ---

export const ChatBox = ({
  room_key,sharedIdState,
  chatLinesRef, chatLines, ownSubFriendId, playerId, onNotesUpdate, refetchStats, message, setMessage, isSending, setIsSending, notes
}: {
  room_key: string;
  sharedIdState: [string | null, (id: string | null) => void];
  chatLinesRef: React.RefObject<HTMLDivElement>;
  chatLines: string[];
  ownSubFriendId: string;
  playerId?: string | null;
  onNotesUpdate?: (newNotes: string) => void;
  refetchStats: () => Promise<any>;
  message: string;
  setMessage: (msg: string) => void;
  isSending: boolean;
  setIsSending: (b: boolean) => void;
  notes: string;
}) => (
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
      >{room_key}</div>
      <a
        className='tx-bold px-4 pointer nodeco'
        onClick={() => {
          alert("Coming soon!");
        }}
        href="#"
        style={{
          color: "#22AEFF",
        }}
      >View All</a>
    </div>
    <div
      ref={chatLinesRef}
      className='flex-col pa-2 gap-2' style={{ maxHeight: 180, overflowY: 'auto' }}>
      {chatLines.length === 0 && (
        <div className='tx-sm opaci-50'>No messages yet.</div>
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
        // fetch previous messages
        // const returnedData: any = await refetchStats();
        const returnedData: any = await api_partyGet(sharedIdState[0] || '');
        // await new Promise(resolve => setTimeout(resolve, 2000));
        const jsonData = await returnedData.json();
        console.log('returnedData', jsonData);
        const fullPartyData_live_data: any = JSON.parse(jsonData?.live_data);
        const uptodatenotes = fullPartyData_live_data?.notes || '';
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
);

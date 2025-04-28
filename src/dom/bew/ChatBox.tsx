'use client';

import { api_partyGet } from '@/../script/state/service/vew';

// --- ChatBox component ---

export const ChatBox = ({
  room_key,sharedIdState, showHeader = true,
  chatLinesRef, chatLines, ownSubFriendId, playerId, onNotesUpdate, fetchPartyData, message, setMessage, isSending, setIsSending, notes
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
}) => (
  <div className='border-gg bord-r-15'>
    {showHeader && (
      <div className='flex-row  tx-smd flex-justify-between pt-4 pb-2 gap-2'>
        <div className='tx-bold px-4'
        style={{
          color: "#4B4B4B",
        }}
      >{ownSubFriendId.replace(':', '')} <span className='tx-sm opaci-50'>(you)</span></div>
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
        // await fetchPartyData(sharedIdState[0] || '');
        console.log('000000000fetchPartyData');
        // return
        if (!message.trim()) return;
        // fetch previous messages
        // const returnedData: any = await fetchPartyData();
        // await fetchPartyData(sharedIdState[0] || '');
        // await new Promise(resolve => setTimeout(resolve, 2000));
        // console.log('fetchPartyData2');
        // const returnedData: any = await api_partyGet(sharedIdState[0] || '');
        // const jsonData = await returnedData.json();
        // console.log('returnedData', jsonData);
        // setIsSending(true);
        const newMessage = `${ownSubFriendId} ${message.trim()}`;
        // const fullPartyData_live_data: any = JSON.parse(jsonData?.live_data);
        // const uptodatenotes = fullPartyData_live_data?.notes || '';
        // const newNotes = (uptodatenotes ? uptodatenotes + '\n' : '') + newMessage;
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
);

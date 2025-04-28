'use client';
import React, { useState, useEffect, useRef } from 'react';
import { ChatBox } from '../../bew/ChatBox';

export const PartyNotesInputs = ({ 
  onValueChange,
  initialValue = '',
  room_key,
  fetchPartyData,
  sharedIdState,
  onNotesUpdate,
  ownSubFriendId
}: { 
  onValueChange: (value: string) => void;
  initialValue?: string;
  room_key: string;
  fetchPartyData: (id:string) => Promise<any>;
  sharedIdState: [string | null, (id: string | null) => void];
  onNotesUpdate: (newNotes: string) => void;
  ownSubFriendId: string;
}) => {
  const [unsavedValue, setUnsavedValue] = useState(initialValue);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatLinesRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Update unsavedValue when initialValue changes
  useEffect(() => {
    setUnsavedValue(initialValue);
  }, [initialValue]);

  // Check if mobile on mount and on resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setUnsavedValue(newValue);
    onValueChange(newValue);
  };

  useEffect(() => {
    if (chatLinesRef.current) {
      chatLinesRef.current?.scrollTo({
        top: chatLinesRef.current?.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [unsavedValue]);
  
  if (isMobile) {
    return (
      <ChatBox
        room_key={room_key}
        sharedIdState={sharedIdState}
        chatLinesRef={chatLinesRef}
        chatLines={unsavedValue ? unsavedValue.split(/\r?\n/).filter(Boolean) : []}
        ownSubFriendId={ownSubFriendId}
        playerId={null}
        onNotesUpdate={(newNotes) => {
          setUnsavedValue(newNotes);
          // onValueChange(newNotes);
          onNotesUpdate(newNotes);
        }}
        fetchPartyData={fetchPartyData}
        message={message}
        setMessage={setMessage}
        isSending={isSending}
        setIsSending={setIsSending}
        notes={unsavedValue}
      />
    );
  }

  return (<>
    <div className='flex-col flex-align-stretch tx-altfont-2'>
      <textarea className='flex-1 bord-r-15 pa-4' 
        rows={12}
        value={unsavedValue}
        onChange={handleChange}
        style={{
          border: "2px solid #eaeaea",
        }}
      />
    </div>
  </>);
};

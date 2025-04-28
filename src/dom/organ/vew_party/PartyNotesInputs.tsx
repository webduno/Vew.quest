'use client';
import React, { useState, useEffect, useRef } from 'react';
import { ChatBox } from '../../bew/ChatBox';

export const PartyNotesInputs = ({ 
  onValueChange,
  initialValue = '',
  room_key,
  refetchStats,
  sharedIdState,
  onNotesUpdate,
  ownSubFriendId
}: { 
  onValueChange: (value: string) => void;
  initialValue?: string;
  room_key: string;
  refetchStats: () => Promise<any>;
  sharedIdState: [string | null, (id: string | null) => void];
  onNotesUpdate: (newNotes: string) => void;
  ownSubFriendId: string;
}) => {
  const [value, setValue] = useState(initialValue);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatLinesRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Update value when initialValue changes
  useEffect(() => {
    setValue(initialValue);
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
    setValue(newValue);
    onValueChange(newValue);
  };

  useEffect(() => {
    if (chatLinesRef.current) {
      chatLinesRef.current?.scrollTo({
        top: chatLinesRef.current?.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [value]);
  
  if (isMobile) {
    return (
      <ChatBox
        room_key={room_key}
        sharedIdState={sharedIdState}
        chatLinesRef={chatLinesRef}
        chatLines={value ? value.split(/\r?\n/).filter(Boolean) : []}
        ownSubFriendId={ownSubFriendId}
        playerId={null}
        onNotesUpdate={(newNotes) => {
          setValue(newNotes);
          onValueChange(newNotes);
          onNotesUpdate(newNotes);
        }}
        refetchStats={refetchStats}
        message={message}
        setMessage={setMessage}
        isSending={isSending}
        setIsSending={setIsSending}
        notes={value}
      />
    );
  }

  return (<>
    <div className='flex-col flex-align-stretch tx-altfont-2'>
      <textarea className='flex-1 bord-r-15 pa-4' 
        rows={12}
        value={value}
        onChange={handleChange}
        style={{
          border: "1px solid #afafaf",
        }}
      />
    </div>
  </>);
};

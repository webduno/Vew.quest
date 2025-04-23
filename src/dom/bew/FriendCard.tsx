'use client';
import React from 'react';
import { LessonCard } from './LessonCard';


export const FriendCard = ({ friendid }: { friendid: string; }) => {
  return (
    <div>
      {/* <div
      style={{
        color: '#777777',
      }}
      >Friend: {friendid}</div> */}
      <div className='tx-sm'>
        <LessonCard
        title={`Party with ${friendid}`}
        href="#"
        forcedClick={() => {
          alert('Coming soon!');
        }}
        actionText='Go to Party'
        emoji=""
        />
      </div>
    </div>
  );
};

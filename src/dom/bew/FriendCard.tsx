'use client';
import React from 'react';


export const FriendCard = ({ friendid }: { friendid: string; }) => {
  return (
    <div>
      <div>Friend</div>
      <div className='tx-sm'>
        {friendid}
      </div>
    </div>
  );
};

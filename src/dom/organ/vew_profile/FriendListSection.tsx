'use client';
import { UserStats } from '@/script/utils/calculations';
import { useEffect, useState } from 'react';

interface FriendListSectionProps {
  friendId: string;
}

const useUserFriendList = ({friendId}: {friendId: string})=>{
  const [friends, setFriends] = useState<any[]>([]);
  useEffect(()=>{
    const fetchFriends = async ()=>{
      const friends = await fetch('/api/party/friend/list?friend_id='+friendId)
      const data = await friends.json();
      setFriends(data.parties);
    }
    fetchFriends();
  }, []);
  return { friends };
}
export function FriendListSection({ friendId }: FriendListSectionProps) {
  const { friends } = useUserFriendList({friendId});
  if (friends.length === 0) return null;
  return (
    <div className='bord-r-15 pb-2 pt-4 px-4' style={{ border: "2px solid #f0f0f0" }}>
      <div className='tx-bold tx-sm mb-2 tx-ls-3 pb-2'
      style={{
        borderBottom: "2px solid #f0f0f0",
      }}
      > 🤝 Friends</div>
      <div className='flex-col gap-2 flex-align-start'>
        {friends.map((friend)=>(
          <a href={"/party/"+friend.other_friend} 
          className='tx-link flex-row w-100 gap-1' key={friend.id}>
            <div className='flex-1'>{friend.other_friend}</div>
            <div className=''>#{friend.target_code}</div>
          </a>
        ))}
      </div>
    </div>
  );
} 

export const PanelListRow = ({vlabel = "label", vvalue}: {vlabel: string, vvalue: any})=>{
  return (
    <div className="flex-row w-100 gap-1">
      <div className='flex-1'>{vlabel}:</div>
      <div className=''>{vvalue}</div>
    </div>
  )
}
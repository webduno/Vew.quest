'use client';
import { useVibeverse } from '@/dom/useVibeverse';
import { useState, useEffect } from 'react';








export const MindStats = () => {
  const { mindStats } = useVibeverse();
  const [stats, setStats] = useState(mindStats);
  const [username, setUsername] = useState("");
  const [hasFirstKey, setHasFirstKey] = useState(0);

  useEffect(() => {
    const handleStorageChange = (e: MessageEvent) => {
      if (e.data === 'localStorageChanged') {
        const savedStats = localStorage.getItem('VB_MINDSTATS');
        if (savedStats) {
          setStats(JSON.parse(savedStats));
        }
        const savedUsername = localStorage.getItem('VB_PLAYER_ID');
        if (savedUsername) {
          // only first 7 characters
          setUsername(savedUsername.substring(0, 7));
        }
        const savedHasFirstKey = localStorage.getItem('VB_HAS_FIRST_KEY');
        if (savedHasFirstKey) {
          setHasFirstKey(parseInt(savedHasFirstKey));
        }
      }
    };

    window.addEventListener('message', handleStorageChange);
    return () => window.removeEventListener('message', handleStorageChange);
  }, []);

  if (hasFirstKey === 0 || !username || !stats?.color) {
    return null;
  }

  return (
    <div className=' flex-row flex-align-stretch w-100px' style={{
      padding: '6px',
      gap: '3px',
      borderRadius: '3px',
      background: '#a4a087',
      boxShadow: 'inset -3px -3px 6px #242017',
    }}>
      <div className=' bord-r-5 flex-col  flex-1' style={{
        padding: '3px',
        background: '#a4a087',
        boxShadow: 'inset  0 5px 15px #444444',
      }}>
        <div className=' bord-r-10 py-1   w-90' style={{
          // border: '2px solid #a19e94',
          boxShadow: 'inset  0 0 15px #000000',
          background: '#333333',
        }}>
          <div className='flex-col flex-align-start pl-1 tx-xs' style={{
            fontFamily: 'monospace',
            color: '#009900',
            textShadow: '0 0 5px #00ff00',
          }}>
            {stats?.color >= 3 && <>
              <div>Color: {(stats?.color || 0)}</div>
              <div>Solid: {(stats?.solid || 0)}</div>
            </>}
            {stats?.color < 3 && <>
              <div className='pt-1'>{username || "----"}</div>
              <div>SYNC: {(stats?.color || 0)}</div>
            </>}
            {/* <div>SYNC: {(stats?.color || 0) + (stats?.solid || 0) + (stats?.light || 0)}</div> */}
            <div>KEYS: {hasFirstKey ? "1" : "0"}</div>
          </div>
        </div>
      </div>
      <div className='pa-1 tx-white flex-col tx-altfont-1 flex-justify-start tx-xxs' style={{
        background: '#444444',
        borderRadius: '2px',
      }}>
        <div>wbw</div>
        <hr className='w-100 opaci-20' />
        <div className='pt-1 flex-col flex-align-start opaci-30'>
          <div>@</div>
          <div>web</div>
          <div>duno</div>
        </div>

      </div>
    </div>
  );
};

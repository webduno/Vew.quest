'use client';
import { useVibeverse } from '../../../scripts/hooks/useVibeverse';
import { useState, useEffect } from 'react';








export const MindStats = () => {
  const { mindStats } = useVibeverse();
  const [stats, setStats] = useState(mindStats);
  const [username, setUsername] = useState("");
  const [hasFirstKey, setHasFirstKey] = useState(0);
  const [toggleChangeSomething, setToggleChangeSomething] = useState(false);

  useEffect(() => {
    const handleStorageChange = (e: MessageEvent) => {
      console.log("storage changed");
      setToggleChangeSomething(prev => !prev);
      if (e.data === 'localStorageChanged') {
        const savedStats = localStorage.getItem('VB_MINDSTATS');
        if (savedStats) {
          setStats(JSON.parse(savedStats));
        }
        const savedUsername = localStorage.getItem('VB_PLAYER_ID');
        if (savedUsername) {
          // only first 7 characters
          setUsername(savedUsername) // .substring(0, 7));
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
          boxShadow: 'inset  0 0 15px #000000',
          background: '#333333',
        }}>
          <div className='flex-col-r flex-align-start pl-1 tx-xs' style={{
            fontFamily: 'monospace',
            color: '#009900',
            textShadow: '0 0 5px #00bb00',
          }}>
            
              <div className='flex-wrap  flex-justify-start'>
              <div className=''>SyncLevels</div>
              <div className='pr-1' style={{filter:""}}>🎨{(stats?.color || 0)}</div>
            {stats?.color >= 3 && <>
                <div>🪨{(stats?.solid || 0)}</div>
            </>}
              </div>
              <div className='w-80' style={{
                background: '#005500',
                margin: '0px 0 2px 0',
                height: '1px',
              }}></div>
            <div>KEYS → {hasFirstKey ? "1" : "0"}</div>
          </div>
        </div>
      </div>
      <div className='pa-1 tx-white flex-col tx-altfont-1 flex-justify-start tx-xxs' style={{
        background: '#444444',
        borderRadius: '2px',
      }}>
        <div>wbw</div>
        <hr className='w-100 opaci-20' />
        <div className='flex-row gap-1'>
        <div  className='bord-r-100' id="changeIndicator"
        style={{
          background: !toggleChangeSomething ? '#442222' : '#aa1111',
          padding: '2px',
          marginBottom: '2px',
        }}
        ></div>
          
        <div  className='bord-r-100' id="changeIndicator"
        style={{
          background: toggleChangeSomething ? '#442222' : '#aa1111',
          padding: '2px',
          marginBottom: '2px',
        }}
        >
        </div>
        </div>

        <div className=' flex-col flex-align-start opaci-30'>
          <div>{username.slice(1, 4)}</div>
          <div>{username.slice(4,8)}</div>
          <div>{username.slice(8,12)}</div>
        </div>

      </div>
    </div>
  );
};

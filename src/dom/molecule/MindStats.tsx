'use client';
import { useVibeverse } from '../../../scripts/hooks/useVibeverse';
import { useState, useEffect } from 'react';








export const MindStats = () => {
  const { mindStats } = useVibeverse();
  const [stats, setStats] = useState<{ 
      color: number;
      solid: number;
      cash?: number;
      chronovisor_ticket?: number
     }>(mindStats);
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

  return (<>
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
          <div className='flex-col flex-align-start pl-1 tx-xs' style={{
            fontFamily: 'monospace',
            color: '#009900',
            textShadow: '0 0 5px #00bb00',
          }}>
            
            <div>KEYS → {hasFirstKey ? "1" : "0"}</div>
                  {stats?.cash && <>
                      <div>${(stats?.cash || 0)}</div>
                  </>}
              <div className='w-80' style={{
                background: '#005500',
                margin: '0px 0 2px 0',
                height: '1px',
              }}></div>
            <div className='flex-wrap  flex-justify-start'>
                    <div className=''>SyncLevels</div>
                    <div className='pr-1' style={{filter:""}}>🎨{(stats?.color || 0)}</div>
                  {stats?.color >= 3 && <>
                      <div>🪨{(stats?.solid || 0)}</div>
                  </>}
              </div>
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
    {(
      mindStats.chronovisor_ticket ||
      mindStats.pk_pill ||
      mindStats.mars_pass ||
      mindStats.declasification_request
      ) && (<>

<details>
<summary className='flex-col flex-align-start pt-2 pointer'>
<button className="noclick box-shadow-i-5-t bord-r-5 pa-1 tx-xs"
style={{
  background: '#444444',
  color: '#999999',
}}
>
      INVENTORY
    </button>
</summary>

  <div className='mt-2 tx-white tx-xs bord-r-5 w-80px pa-1 flex-col gap-1
  flex-col flex-align-start tx-altfont-1 
  '
  style={{
    background: '#444444',
  }}
  >
    {!!mindStats.chronovisor_ticket && <div className="box-shadow-i-5-t bord-r-5 bg-w-20 pa-1">
      chronoview: {mindStats.chronovisor_ticket}
    </div>}
    {!!mindStats.pk_pill && <div className="box-shadow-i-5-t bord-r-5 bg-w-20 pa-1">
      pk_pill: {mindStats.pk_pill}
    </div>}
    {!!mindStats.mars_pass && <div className="box-shadow-i-5-t bord-r-5 bg-w-20 pa-1">
      mars_pass: {mindStats.mars_pass}
    </div>}
    {!!mindStats.declasification_request && <div className="box-shadow-i-5-t bord-r-5 bg-w-20 pa-1">
      foia_req:      {mindStats.declasification_request}
    </div>}

  </div>
</details>




  </>)}
  </>);
};

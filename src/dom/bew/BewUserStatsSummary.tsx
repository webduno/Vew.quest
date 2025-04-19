'use client';
import { useEffect, useState } from 'react';
import { Tooltip } from 'react-tooltip';

interface CRVObject {
  id: string;
  content: any;
  result: number;
  created_at: string;
  storage_key: string;  
}

export const BewUserStatsSummary = () => {
  const LS_playerId = localStorage.getItem('VB_PLAYER_ID');
  const [crvObjects, setCrvObjects] = useState<CRVObject[]>([]);

  useEffect(() => {
    console.log('crvObjects', crvObjects)
    const fetchData = async () => {
      try {
        const storageKey = localStorage.getItem('VB_PLAYER_ID');
        if (!storageKey) {
          console.log('no storageKey')
          return;
        };

        const response = await fetch(`/api/supabase?storageKey=${storageKey}`, {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'Pragma': 'no-cache'
          },
          cache: 'no-store'
        });
        const data = await response.json();
        console.log('data', data)
        if (data.success) {
          setCrvObjects(data.data);
        }
      } catch (error) {
        console.error('Error fetching CRV objects:', error);
      }
    };

    fetchData();
  }, []);

  const calculateStreak = (objects: CRVObject[]) => {
    if (objects.length === 0) return 0;
    
    // Get unique dates from objects
    const uniqueDates = new Set(
      objects.map(obj => new Date(obj.created_at).toLocaleDateString('en-US'))
    );
    
    // Sort dates in descending order
    const sortedDates = Array.from(uniqueDates).sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
    
    let streak = 0;
    let currentDate = new Date();
    
    // Check for consecutive days starting from today
    for (let i = 0; i < sortedDates.length; i++) {
      const date = new Date(sortedDates[i]);
      const diffDays = Math.floor((currentDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === i) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const streak = calculateStreak(crvObjects);

  const calculateDailyProgress = (objects: CRVObject[]) => {
    if (objects.length === 0) return 0;
    
    const today = new Date().toLocaleDateString('en-US');
    const todayObjects = objects.filter(obj => 
      new Date(obj.created_at).toLocaleDateString('en-US') === today
    );
    
    return todayObjects.length;
  };

  const dailyProgress = calculateDailyProgress(crvObjects);
  const dailyGoal = 5; // Target number of views per day

  return (<>
    <div className='flex-row flex-justify-between tx-altfont-2'>
      <div className='tx- lg pa-2 pt-4  opaci-chov--50 flex-wrap'
        data-tooltip-id="streak-tooltip"
        data-tooltip-content="Streak"
        data-tooltip-place="bottom"
      >
        {/* fire emoji */}
        <div className='tx-lg tx-center'>🔥</div>
        <div className='tx-bold-5' style={{ color: "#FFB02E" }}>{streak}</div>
      </div>
      <div className='tx- lg pa-2 pt-4  opaci-chov--50 flex-wrap'
        data-tooltip-id="points-tooltip"
        data-tooltip-content="Fuel"
        data-tooltip-place="bottom"
      >
        {/* diamond emoji */}
        <div className='tx-lg tx-center'>💎</div>
        <div className='tx-bold-5' style={{ color: "#00A6ED" }}>1224</div>
      </div>
      <div className='tx- lg pa-2 pt-4  opaci-chov--50 flex-wrap'
        data-tooltip-id="hearts-tooltip"
        data-tooltip-content="Friends"
        data-tooltip-place="bottom"
      >
        {/* heart emoji */}
        <div className='tx-lg tx-center'>💖</div>
        <div className='tx-bold-5' style={{ color: "#F92F60" }}>5</div>
      </div>
    </div>







    

    <div className='flex-col flex-align-stretch gap-4'>

<div className='bord-r-10 pa-4 pl-2' 
style={{
  border: "1px solid #E5E5E5",
}}
>
  <div className='flex-row flex-justify-start gap-2'>
    <div>
      {/* lightning emoji  */}
      <div className='tx-lgx'>✨</div>
    </div>
  <div className='flex-col flex-align-start gap-2 flex-1'>
  <div className='tx-bold'
  style={{
    color: "#4B4B4B",
  }}
  >Daily Goal</div>
  <div className='tx-sm tx-bold bord-r-25  w-100 ' style={{
    padding: "3px 0",
    boxShadow: "0 2px 0 #D68800",
    background: "#FDC908",
    color: "#D68800",
  }}>
    <div className='flex-row gap-1'>
      <div>{dailyProgress}/{dailyGoal}</div>
      <div>Targets</div>
    </div>
  </div>

  </div>
  </div>


  <div>









  <div>
            <div className='py-2 mt-4 tx-center tx-white bord-r-10  opaci-chov--75'
            data-tooltip-id="view-profile-tooltip"
            data-tooltip-content={`${LS_playerId }`}
            data-tooltip-place="bottom"
            onClick={()=>{
              alert("Coming soon!");
            }}
            style={{
              backgroundColor: "#807DDB",
              boxShadow: "0px 4px 0 0px #6B69CF",
            }}
            >View Profile</div>
            
          </div>
          <Tooltip id="view-profile-tooltip" />
          <Tooltip id="home-tooltip" />
          <Tooltip id="lessons-tooltip" />
          <Tooltip id="goals-tooltip" />
          <Tooltip id="profile-tooltip" />
          <Tooltip id="settings-tooltip" />
          <Tooltip id="help-tooltip" />
          <Tooltip id="streak-tooltip" />
          <Tooltip id="points-tooltip" />
          <Tooltip id="hearts-tooltip" />

  </div>
</div>




<a target='_blank'
href="https://www.reddit.com/r/remoteviewing/comments/1k1y0ge/weekly_practice_objective_r16487/"
className='bord-r-10 pa-4 pl-2 opaci-chov--75 nodeco' 
style={{
  border: "1px solid #E5E5E5",
}}
>
  <div className='flex-row flex-justify-start gap-2'>
    <div>
      {/* sparks emoji  */}
      <div className='tx-lgx'>💥</div>
    </div>
  <div className='flex-col flex-align-start gap-2'>
  <div className='tx-bold'
  style={{
    color: "#4B4B4B",
  }}
  >Weekly Object</div>
  <div className='tx-sm ' style={{color: "#afafaf"}}>
    <div className='flex-row gap-1'>
      <div>Click to see details</div>
    </div>
  </div>
  </div>
  </div>

  <div></div>
</a>





<div className='bord-r-10 ' 
style={{
  border: "1px solid #E5E5E5",
}}
>
  <div className='flex-row  tx-smd flex-justify-between pt-4 pb-2 gap-2'>
    
  <div className='tx-bold px-4' 
  style={{
    color: "#4B4B4B",
  }}
  >Lessons</div>
  <a 
  className='tx-bold px-4 pointer nodeco' 
  href="https://www.reddit.com/r/remoteviewing/wiki/index/"
  target='_blank'
  style={{
    color: "#22AEFF",
  }}
  >View All</a>
  </div>

  





  
  <a 
  href="https://www.reddit.com/r/remoteviewing/comments/184cl9k/start_here_introduction_faq_resources_welcome_to/"
  target='_blank'
   className='flex-row flex-align-start nodeco flex-justify-start pa-2 opaci-chov--75 gap-2'>
    <div className=''>
      {/* single book emoji  */}
      <div className='tx-lgx'>
      📖
      </div>
    </div>
    <div className='flex-col flex-align-start gap-2'>
  <div className='tx-bold pt-2'
  style={{
    color: "#4B4B4B",
  }}
  >Fundamentals</div>
  <div className='tx-sm flex-col flex-align-start gap-1' style={{color: "#afafaf"}}>
    <div className='flex-row gap-1 tx-xsm'>
      <div>- Sensory perception training</div>
    </div>
    <div className='flex-row gap-1 tx-xsm'>
      <div>- Target recognition</div>
    </div>
  </div>
  </div>
  </a>



  
  <a
  href="https://www.reddit.com/r/AstralProjection/comments/n34zh5/astral_projection_quick_start_guide/"
  target='_blank'
   className='flex-row flex-align-start nodeco flex-justify-start pa-2 opaci-chov--75 gap-2'>
    <div className=''>
      {/* tree emoji  */}
      <div className='tx-lgx'>🌳</div>
    </div>
    <div className='flex-col flex-align-start gap-2'>
  <div className='tx-bold pt-2'
  style={{
    color: "#4B4B4B",
  }}
  >Astral Projection</div>
  <div className='tx-sm flex-col flex-align-start gap-1' style={{color: "#afafaf"}}>
    <div className='flex-row gap-1 tx-xsm'>
      <div>- Meditation &amp; visualization</div>
    </div>
    
    <div className='flex-row gap-1 tx-xsm'>
      <div>- Coordinate remote viewing</div>
    </div>
  </div>
  </div>
</a>





  
  <a 
  href="https://chain.link/vrf"
  target='_blank'
  className='flex-row flex-align-start nodeco pb-4 flex-justify-start pa-2 opaci-chov--75 gap-2'>
    <div className=''>
      {/* eight ball emoji  */}
      <div className='tx-lgx'>🎱</div>
    </div>
    <div className='flex-col flex-align-start gap-2'>
  <div className='tx-bold pt-2'
  style={{
    color: "#4B4B4B",
  }}
  >RNG Basics</div>
  <div className='tx-sm flex-col flex-align-start gap-1' style={{color: "#afafaf"}}>
    <div className='flex-row gap-1 tx-xsm'>
      <div>- Random number generator</div>
    </div>
  </div>
  </div>
  </a>



  <div></div>
</div>




    
    </div>





    
  </>);
};

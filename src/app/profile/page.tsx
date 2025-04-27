'use client';
import { useState, useEffect, useMemo, useContext } from 'react';
import { usePlayerStats } from '@/../script/state/hook/usePlayerStats';
import { BewLogo } from '@/dom/atom/logo/BewLogo';
import { Tooltip } from 'react-tooltip';
import { BewUserStatsSummary, WrappedBewUserStatsSummary } from '../../dom/bew/BewUserStatsSummary';
import { useFetchedStats } from '@/script/state/context/FetchedStatsContext';
import { LessonCard } from '@/dom/bew/LessonCard';
import { BewChoiceButton } from '@/dom/bew/BewChoiceButton';
import { isMobile } from '../../../script/utils/platform/mobileDetection';
import CanvasDraw from 'react-canvas-draw';
import { BewPageHeader } from '@/dom/bew/BewPageHeader';
import { useSearchParams } from 'next/navigation';
import { calculateStreak } from '@/script/utils/streak';
import { 
  calculateUserStats, 
  calculateGuestStats,
  hasMoreThanFirstDays,
  hasMoreThan3DaysStreak,
  getUniqueDays,
  getTodayObjects,
  type UserStats 
} from '@/script/utils/calculations';
import { NavigationHeaderBar } from '../../dom/bew/NavigationHeaderBar';
import { RemoteViewingHistory } from '@/dom/bew/RemoteViewingHistory';
import { BewBadges } from '@/dom/bew/BewBadges';
import { ProfileSnackbarContext, SnackbarSeverity } from '../../../script/state/context/ProfileSnackbarProvider';
import { useBackgroundMusic } from '../../../script/state/context/BackgroundMusicContext';
import { DailyGoalsSection } from '@/dom/organ/vew_profile/DailyGoalsSection';
import { RVStatsSection } from '@/dom/organ/vew_profile/RVStatsSection';


export default function ProfilePage() {
  const { streak, crvObjects, potentialStreak, averageResult } = useFetchedStats();
  const { LS_playerId } = usePlayerStats();
  const searchParams = useSearchParams();
  const { playSoundEffect } = useBackgroundMusic();
  const [guestUrlUsernameParam, setGuestUrlUsernameParam] = useState<string | null>(null);
  const snackbarContext = useContext(ProfileSnackbarContext);
  if (!snackbarContext) {
    throw new Error('ProfileSnackbarContext must be used within a ProfileSnackbarProvider');
  }
  const { triggerSnackbar } = snackbarContext;
  
  useEffect(() => {
    const username = searchParams.get('friend');
    if (username) {
      setGuestUrlUsernameParam(username);
    }
  }, [searchParams]);
  
  const [userStats, setUserStats] = useState<UserStats>({
    totalRequests: 0,
    firstRequestDate: null,
    averageAccuracy: 0,
    bestAccuracy: 0,
    potentialStreak: 0,
    streak: 0,
    dailyGoals: {
      requests: 0,
      accuracy: 0,
      bestAccuracy: 0
    }
  });

  const [showSketchModal, setShowSketchModal] = useState(false);
  const [currentSketch, setCurrentSketch] = useState<any>(null);
  const [currentImage, setCurrentImage] = useState<{id: string, description: string} | null>(null);
  const [modalView, setModalView] = useState<'sketch' | 'image'>('sketch');
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [guestStats, setGuestStats] = useState<{
    crvObjects: any[];
    streak: number;
    potentialStreak: number;
    averageResult: number;
    isLoading: boolean;
    error: string | null;
  }>({
    crvObjects: [],
    streak: 0,
    potentialStreak: 0,
    averageResult: 0,
    isLoading: true,
    error: null
  });

  const hasMoreThanFirstDaysValue = useMemo(() => hasMoreThanFirstDays(crvObjects), [crvObjects]);
  const uniqueDays = useMemo(() => getUniqueDays(crvObjects), [crvObjects]);
  const hasMoreThan3DaysStreakValue = useMemo(() => hasMoreThan3DaysStreak(uniqueDays), [uniqueDays]);
  const didViewToday = useMemo(() => crvObjects.some(obj => obj.created_at.split('T')[0] === new Date().toISOString().split('T')[0]), [crvObjects]);

  const [showSketch, setShowSketch] = useState<any>(null);

  useEffect(() => {
    // Handle hash navigation after page load
    if (window.location.hash) {
      const element = document.getElementById(window.location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        if (window.location.hash.substring(1) === 'guest' && LS_playerId !== guestUrlUsernameParam) {
          setTimeout(() => {
            setShowGuestModal(true);
          }, 200);
        }
      }
    }
  }, [LS_playerId]);

  useEffect(() => {
    if (crvObjects.length > 0) {
      setUserStats(calculateUserStats(crvObjects));
    }
  }, [crvObjects]);

  useEffect(() => {
    const fetchGuestStats = async () => {
      if (!guestUrlUsernameParam) return;
      
      try {
        setGuestStats(prev => ({ ...prev, isLoading: true }));
        const response = await fetch(`/api/supabase?storageKey=${guestUrlUsernameParam}`, {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'Pragma': 'no-cache'
          },
          cache: 'no-store'
        });
        const data = await response.json();
        
        if (data.success) {
          setGuestStats(calculateGuestStats(data.data));
        }
      } catch (error) {
        console.error('Error fetching guest stats:', error);
        setGuestStats(prev => ({ ...prev, error: 'Failed to fetch guest stats', isLoading: false }));
      }
    };

    if (guestUrlUsernameParam) {
      fetchGuestStats();
    }
  }, [guestUrlUsernameParam]);


  const submitStatus = "success"
  const isSubmitting = false
  if (!LS_playerId) {
    return (
      <div className='w-100 autoverflow-y h-100vh  flex-col flex-justify-start'>
        <NavigationHeaderBar />
        {/* <BewPageHeader title={"PROFILE"} /> */}

        
        <div className='flex-col pt-8 w-80 tx-altfont-2'>
          <div className='tx-bold tx-smd mb-2 opaci-75'>
            Username not found!
          </div>
        <img src="/bew/pfp/noprofile.png"
 alt="pfp" className={'bord-r-100p mb-8 noverflow block '+(isMobile() ? 'w-150px' : 'w-250px')} />
        <a href="/tool"  
             className={`nodeco bord-r-25 py-4 tx-lg tx-altfont-2 tx-bold-4 w-100 w-max-600px tx-bold block tx-center ${isSubmitting ? 'opaci-50' : ''}`}
            style={{
              color: submitStatus === 'success' ? "#22aa22" : submitStatus === 'error' ? "#cc2222" : "#ff9900",
              background: submitStatus === 'success' ? "#e5ffe5" : submitStatus === 'error' ? "#ffe5e5" : "#FAeFa5",
              boxShadow: `0px 4px 0 0px ${submitStatus === 'success' ? "#22aa22" : submitStatus === 'error' ? "#aa2222" : "#F7CB28"}`,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
            }}
            >
              {isSubmitting ? 'Sending...' : submitStatus === 'success' ? 'Create Profile' : submitStatus === 'error' ? 'Error Sending' : 'Send Feedback'}
            </a>
        </div>
      </div>
    );
  }
  

  return (
    <>
      <div className='w-100 autoverflow-y h-100vh  flex-col flex-justify-start'>
        <div id="top-of-page"></div>
        
        <NavigationHeaderBar />


        
        {/* <BewPageHeader title={"YOUR PROFILE"} isBigScreenOnly={true} /> */}

        <div className='w-100  w-max-1080px flex-row Q_xs_flex-col-r pt- 8 flex-justify-center flex-align-start gap-4'>

          
        
          <div className='flex-wrap Q_xs_sm_flex-col flex-align-center gap-4 pb-100 pos-rel tx-altfont-2 '
          style={{
            color: "#777777",
          }}
          >
            <div className='flex-col  px-2 pos-rel '>

{/* <img src="/bew/birds.png" style={{ filter: "blur(0px)" }} alt="tool_bg2" className='hover-bird pos-abs noverflow block w-150px Q_xs_pt-8 pb-100' /> */}
<div className="pos-rel">
<button className='pos-abs bottom-0 right-0 mb-8 bg-white bord-r-10 px-2 py-1 tx-bold pointer '
onClick={() => {
  // coming soon
  // alert('Coming soon!');
  playSoundEffect('/sfx/short/errorbip.mp3');
  triggerSnackbar(<div className='tx-center py-1'>
    <div className=''>
      Change of username <br /> is coming soon!
    </div>
  </div>, "errorwarning");

}}
style={{
  color: "#aaaaaa",
  border: "1px solid #f0f0f0",
}}
>
  <div className='Q_sm_x'>Change</div>
  <div className='Q_xs_sm'>🔄</div>
</button>

              <div className='tx-mdl pt- 4 pointer tx-center'
              onClick={() => {
                navigator.clipboard.writeText(LS_playerId || '');
                alert('Copied to clipboard');
              }}
              >
                {/* <div className='tx-bold tx-lg mb-'>Username:</div> */}
                 {/* <br />  */}
                 <div className='tx-altfont-2 tx-lgx'>{LS_playerId || 'Not set'}</div> 
                 {/* 📋 */}
                 </div>
<img src="/bew/pfp/row-4-column-1.png"
 alt="pfp" className={'bord-r-50 noverflow block '+(isMobile() ? 'w-150px' : 'w-250px')} />
 </div>
<div className='bord-r-15 mb-4 pb-2 flex-col ' style={{ border: "1px solid #f0f0f0" }}>
              <WrappedBewUserStatsSummary minified />
              <hr className='w-100 opaci-10 '  />
              <details className='w-150px px-2'>
                <summary className='tx-bold pointer'>More info</summary>


              <div className='flex-col flex-align-start  pt-2 w-150px'>
                <div className='py-2'>🔥 → Streak (Daily Remote Viewings in a row)</div>
                <div className='py-2'
                style={{
                  borderTop: "1px solid #f0f0f0",
                  borderBottom: "1px solid #f0f0f0",
                }}
                >💎 → Points (Total Completed Remote Viewings)</div>
                <div className='py-2'>💖 → Hearts (Accuracy Average)</div>
              </div>
              </details>
            </div>

                
                 {  (<>
                 {!!didViewToday ? <div className='pb-2'>Did see today ✅</div> :
                 <div className='pb-2'>Did not see today ❌</div>
            }
                  <a href="/tool" className='tx-bold tx-center tx-lg mb-2'
                  style={{
                    color: "#22aeff",
                  }}
                  >{didViewToday ? "Continue" : "Start"} <br /> Viewing</a>
                 </>)}
                 
                 
</div>

<div className='flex-wrap px-4 flex-align-start flex-justify-start gap-4 flex-1'>
            
<DailyGoalsSection
  streak={streak}
  userStats={userStats}
  crvObjects={crvObjects}
/>
<RVStatsSection
  uniqueDays={uniqueDays}
  userStats={userStats}
/>



{/* Badges */}

            
<BewBadges 
  hasMoreThan3DaysStreakValue={hasMoreThan3DaysStreakValue}
  hasMoreThanFirstDaysValue={hasMoreThanFirstDaysValue}
  totalRequests={userStats.totalRequests}
  averageAccuracy={userStats.averageAccuracy}
/>





          </div>

          
          </div>



          
        </div>

        <div id="guest"></div>  
        
              {!!guestUrlUsernameParam && guestUrlUsernameParam.toLowerCase() !== LS_playerId.toLowerCase() &&
            <div className='bord-r-15  pb-2 pt- 4 px-4  pb-4 mb-100' 
            style={{
              border: "1px solid #f0f0f0",
            }}
            >
              <div className='tx-mdl pt-4 pointer flex-col'
              
              >
                <div className='tx-bold tx-lg mb-'>Guest name:</div>
                 {/* <br />  */}
                 <i onClick={() => {
                if (guestUrlUsernameParam) {
                  setShowGuestModal(true);
                }
              }} className='pt-2 tx-altfont-1 underline opaci-chov--50'>{guestUrlUsernameParam  || 'Not set'}{"'s details"}</i> 
                 {/* {guestUrlUsernameParam && '👁️'} */}
                 
                 </div>
                 <div className='flex-col'>
                 <img src="/bew/pfp/row-4-column-2.png"
                 onClick={() => {
                  if (guestUrlUsernameParam) {
                    setShowGuestModal(true);
                  }
                 }}
 alt="pfp" className={'bord-r-50 noverflow block pointer w-max-600px w-100'} /></div>
              {crvObjects.length > 0 && !!guestUrlUsernameParam && guestUrlUsernameParam.toLowerCase() !== LS_playerId.toLowerCase() && (
                 <div className='tx-md mt-2 hover-jump py-2 px-4 bord-r-8  pointer opaci-chov--50'
                 style={{
                  color: "#ffffff",
                  backgroundColor: "#7Ce360",
                  boxShadow: "0px 4px 0 0px #5CC310",

                 }}
                 onClick={() => {
                  // navigator.clipboard.writeText(guestUrlUsernameParam || '');
                  alert('Coming soon!');
                 }}
                 >
                  {/* party emoji */}
                  Join Party 🎉
                 </div>
                 )}
            </div>
                 }
            
      <div id="journey"></div>  
      <div className='pb-100 flex-col flex-align-start tx-altfont-2 gap-4 w-100 w-max-1080px'
      >
        <div className="tx-xl opaci-40 tx-altfont-6 px-4 py-8">{LS_playerId.toUpperCase()}&apos;s JOURNEY</div>
        <div className="w-max-600px py-4 ">
          
        <BewChoiceButton
        onClick={() => {
          const journeyElement = document.getElementById('journey');
          if (journeyElement) {
            journeyElement.scrollIntoView({ behavior: 'smooth' });
            triggerSnackbar(<div className='tx-center py-1 flex-col'>
              {/* full date and time human readable */}
              <div>First Remote Viewing</div>
              <div className=''>
                {new Date().toLocaleString()}
              </div>
            </div>, "warning");
          }
        }}
            secondaryColor="#D07900"
            mainColor="#FF9600"
            text={"First View: "+ (userStats.firstRequestDate ? new Date(userStats.firstRequestDate).toLocaleDateString() : 'No views yet')}
            image={<div>⭐</div>}
          />
          <div className="w-100 flex-justify-center mt-4 mb-8 ">
            <svg width="20" height="60" viewBox="0 0 20 60" xmlns="http://www.w3.org/2000/svg">
              <path d="M10,0 Q0,30 10,60" stroke="#FF9600" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <div className='flex-col gap-2 w-100'>
            <div className='tx-altfont-2 w-max-300px opaci-50'>
            {userStats.firstRequestDate ? `You made your first remote viewing on ${new Date(userStats.firstRequestDate).toDateString()} with a high accuracy.` : 'No remote viewings yet.'}
            <br />
            <br />
            And have made {userStats.totalRequests} requests since then.
            </div>
          </div>
          <div className="w-100 flex-justify-center mt-4 mb-8 ">
            <svg width="20" height="60" viewBox="0 0 20 60" xmlns="http://www.w3.org/2000/svg">
              <path d="M10,0 Q0,30 10,60" stroke="#6366f1" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <BewChoiceButton
        onClick={() => {
          const journeyElement = document.getElementById('journey');
          if (journeyElement) {
            journeyElement.scrollIntoView({ behavior: 'smooth' });
            triggerSnackbar(<div className='tx-center py-1 flex-col'>
              {/* full date and time human readable */}
              <div>Last Remote Viewing</div>
              <div className=''>
                {new Date().toLocaleString()}
              </div>
            </div>, "purple");
          }
        }}
            secondaryColor="#6366f1"
            mainColor="#8a8af7"
            text={"Latest View: "+ (crvObjects.length > 0 ? new Date(crvObjects[0].created_at).toLocaleDateString() : 'No views yet')}
            image={<div>⭐</div>}
          />
<div className='tx-altfont-2 w-max-600px px-4 opaci-50 mt-100 pb-8'>
<div className='tx-bold tx-lg pb-4'>Arborization</div>
<div className='tx-altfont-2 px-4'>
The specific order on which you made your requests is important.
<br />
Let the algorithm generate a story based on your viewing history.
</div>

</div>
<div className="px-8">
  
<LessonCard
title="Arborization"
emoji="🌳"
href="#"
forcedClick={() => {
  triggerSnackbar(<div className='tx-center py-1'>
    <div>Arborization is <br /> coming soon!</div>
  </div>, "success");
}}
actionText="Start"

boxShadowColor="#4C8A55"
backgroundColor='#71B44F'

/>

</div>


<hr className='w-100 opaci-10  mt-100 '  />
{crvObjects.length > 0 &&
<RemoteViewingHistory 
  authorId={LS_playerId}
  crvObjects={crvObjects.slice(0, 33)}
  onSketchClick={(sketch, image) => {
    setCurrentSketch(sketch);
    setCurrentImage(image);
    setShowSketchModal(true);
  }}
/>
}
{crvObjects.length > 50 && (<>
<div className=''>
<a className='tx-altfont-2 px-4 py-4 block pointer'
href={"/u?friend="+LS_playerId}
style={{
  color: "#22aeff",
}}
>
Click here to see full history
 <br />
 <br />
 <span>Vew.quest{"/u?friend="+LS_playerId}</span>
</a>
</div>
</>)}

        </div>
      </div>
<div className='opaci-50  pb-100'>
        <button className='tx-green  tx-lg tx-bold' onClick={() => {
          window.location.hash = '#top-of-page';
        }}>
          Go back <br /> to top
        </button>
      </div>
<div className='opaci-50  pb-100'>
        <button className='tx-red' onClick={() => {
          localStorage.removeItem('VB_PLAYER_ID');
          window.location.href = '/tool';
        }}>
          Click here to Logout
        </button>
      </div>
      </div>
      {showGuestModal && !!guestUrlUsernameParam && (
        <div className='pos-abs flex-col top-0 left-0 w-100 h-100 bg-glass-10 z-200'>
          <div className='flex-col px-8 flex-align-center tx-altfont-2 gap-2 bg-white box-shadow-2-b bord-r-15 pa-4'>
            <div className='flex-col w-100'>
              <div onClick={() => setShowGuestModal(false)}
                className='opaci-chov--75 tx-bold tx-lg pb-2'>
                <div className='opaci-25 underline'>Close</div>
              </div>
            </div>
            <div className='bord-r-15 flex-col'
              style={{
                width: '90vw',
                maxWidth: '800px',
                minHeight: '300px'
              }}
            >
              {guestStats.isLoading ? (
                <div className='flex-col flex-align-center flex-justify-center h-100'>
                  <div className='tx-ls-3'>Loading...</div>
                </div>
              ) : guestStats.error ? (
                <div className='flex-col flex-align-center flex-justify-center h-100'>
                  <div className='tx-ls-3'>{guestStats.error}</div>
                </div>
              ) : (
                <div className='flex-col gap-4'>
                  <div className='tx-bold tx-lg'>Guest Stats: {guestUrlUsernameParam}</div>
                  <div className='flex-row gap-4 flex-wrap'>
                    <div className='bord-r-15 pb-2 pt-4 px-4' style={{ border: "1px solid #f0f0f0" }}>
                      <div className='tx-bold tx-lg mb-2'>RV Stats</div>
                      <div className='flex-col gap-2 flex-align-start'>
                        <div>Streak Potential: {guestStats.potentialStreak}</div>
                        <div>Total Requests: {guestStats.crvObjects.length}</div>
                        <div>First Request: {guestStats.crvObjects.length > 0 ? new Date(guestStats.crvObjects[guestStats.crvObjects.length - 1].created_at).toLocaleDateString() : 'No requests yet'}</div>
                        <div>Average Accuracy: {guestStats.averageResult.toFixed(3)}%</div>
                        <div>Personal Record: {guestStats.crvObjects.length > 0 ? Math.max(...guestStats.crvObjects.map((obj: any) => obj.result)).toFixed(3) : 0}%</div>
                      </div>
                    </div>
                    <div className='bord-r-15 pt-4 pb-2 px-4' style={{ border: "1px solid #f0f0f0" }}>
                      <div className='tx-bold tx-lg mb-2'>Daily Goals</div>
                      <div className='flex-col gap-2 flex-align-start'>
                        <div>Current Streak: {guestStats.streak}</div>
                        <div>Viewed Today: {guestStats.crvObjects.filter((obj: any) => obj.created_at.split('T')[0] === new Date().toISOString().split('T')[0]).length}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      


      {showSketchModal && (currentSketch || currentImage) && (
        <div className='pos-abs flex-col top-0 left-0 w-100 h-100 bg-glass-10 z-200'>
          <div className='flex-col px-8 flex-align-center tx-altfont-2 gap-2 bg-white box-shadow-2-b bord-r-15 pa-4'>
            <div className='flex-col w-100'>
              <div onClick={() => {
                setShowSketchModal(false);
                setCurrentSketch(null);
                setCurrentImage(null);
                setModalView('sketch');
              }}
              className='opaci-chov--75 tx-bold tx-lg pb-2'>
                <div className='opaci-25 underline'>Close</div>
              </div>
            </div>
            
            {/* Tab buttons */}
            <div className='flex-row gap-2 w-100'>
              <button 
                className={`tx-sm bg-trans noborder pa-0 pointer tx-altfont-2 underline px-1 ${modalView === 'sketch' ? 'opaci-100' : 'opaci-50'}`}
                onClick={() => setModalView('sketch')}
              >
                <div>Drawing</div>
              </button>
              <button 
                className={`tx-sm bg-trans noborder pa-0 pointer tx-altfont-2 underline px-1 ${modalView === 'image' ? 'opaci-100' : 'opaci-50'}`}
                onClick={() => setModalView('image')}
              >
                <div>Image</div>
              </button>
            </div>

            <div className='bord-r-15 flex-col'
              style={{
                minHeight: "300px",
              }}
            >
              {modalView === 'sketch' && currentSketch && (
                <CanvasDraw
                  disabled
                  hideGrid
                  canvasWidth={300}
                  canvasHeight={300}
                  saveData={currentSketch}
                  style={{
                    borderRadius: "15px",
                  }}
                />
              )}
              {modalView === 'image' && currentImage && (<>
              {/* {JSON.stringify(currentImage)} */}
                 <img className='block pos-rel'
                   src={`https://webduno.com/vew/image/${currentImage.id == "default" ? "default" : currentImage.id.padStart(12, '0')}.jpg`}
                   alt={currentImage.description}
                   style={{
                     overflow: 'hidden',
                     borderRadius: "15x",
                     border: "1px solid #e5e5e5",
                     width: '100%',
                     maxWidth: '300px',
                     maxHeight: '300px',
                     objectFit: 'contain'
                   }}
                 />
                </>)}
            </div>
            <div className="tx-center tx-altfont-2 mt-2 w-250px"
              style={{
                color: "#4B4B4B",
              }}
            >
              {modalView === 'sketch' ? 'Your Drawing' : currentImage?.description}
            </div>
          </div>
        </div>
      )}
    </>
  );
} 




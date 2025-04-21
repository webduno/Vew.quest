'use client';
import { useState, useEffect, useMemo } from 'react';
import { usePlayerStats } from '@/../script/state/hook/usePlayerStats';
import { BewLogo } from '@/dom/atom/logo/BewLogo';
import { Tooltip } from 'react-tooltip';
import { BewUserStatsSummary } from '../../dom/bew/BewUserStatsSummary';
import { useFetchedStats } from '@/script/state/context/FetchedStatsContext';
import { LessonCard } from '@/dom/bew/LessonCard';
import { BewChoiceButton } from '@/dom/bew/BewChoiceButton';
import { isMobile } from '../../../script/utils/platform/mobileDetection';
import CanvasDraw from 'react-canvas-draw';

const NotesCheck = ({ content }: { content: any }) => {
  return content.notes ? <div className='tx-lx pointer'
  onClick={() => {
    if (content.notes) {
      navigator.clipboard.writeText(content.notes);
      alert('Copied to clipboard: \n' + content.notes);
    }
  }}
  >💬</div> : '❌';
};

const SketchCheck = ({ content, onClick }: { content: any, onClick: () => void }) => {
  try {
    const parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
    // sketch emoji 

    return parsedContent.sketch ? (
      <div className='tx-lx pointer'
      onClick={onClick}
      >🎨</div>
    ) : '❌';
  } catch (e) {
    return '❌';
  }
};

export default function ProfilePage() {
  const { isLoading, crvObjects, mailboxRequests, isLoadingMailbox, mailboxError, fetchMailboxRequests } = useFetchedStats();
  const { LS_playerId, typedUsername, setTypedUsername, setPlayerId, sanitizePlayerId } = usePlayerStats();
  const [userStats, setUserStats] = useState<{
    totalRequests: number;
    firstRequestDate: string | null;
    averageAccuracy: number;
    bestAccuracy: number;
    dailyGoals: {
      requests: number;
      accuracy: number;
      bestAccuracy: number;
    };
  }>({
    totalRequests: 0,
    firstRequestDate: null,
    averageAccuracy: 0,
    bestAccuracy: 0,
    dailyGoals: {
      requests: 3,
      accuracy: 70,
      bestAccuracy: 0
    }
  });

  const [showSketchModal, setShowSketchModal] = useState(false);
  const [currentSketch, setCurrentSketch] = useState<any>(null);
  const [currentImage, setCurrentImage] = useState<{id: string, description: string} | null>(null);
  const [modalView, setModalView] = useState<'sketch' | 'image'>('sketch');

  const hasMoreThan14Days = useMemo(() => {
    // get unique days
    const uniqueDays = Array.from(new Set(crvObjects.map(obj => obj.created_at.split('T')[0])));
    return uniqueDays.length > 2;
  }, [crvObjects]);

  const [showSketch, setShowSketch] = useState<any>(null);

  useEffect(() => {
    if (crvObjects.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      const todayObjects = crvObjects.filter(obj => 
        obj.created_at.split('T')[0] === today
      );
      
      const stats = {
        totalRequests: crvObjects.length,
        firstRequestDate: crvObjects[crvObjects.length - 1]?.created_at || null,
        averageAccuracy: 10,
        bestAccuracy: Math.max(...crvObjects.map(obj => obj.result || 0)),
        dailyGoals: {
          requests: todayObjects.length,
          accuracy: todayObjects.reduce((acc, obj) => acc + (obj.result || 0), 0) / todayObjects.length,
          bestAccuracy: todayObjects.length > 0 ? Math.max(...todayObjects.map(obj => obj.result || 0)) : 0
        }
      };
      setUserStats(stats);
    }
  }, [crvObjects]);

  return (
    <>
      <div className='w-100 autoverflow-y h-100vh  flex-col flex-justify-start'>
        <div className='flex-row w-100 w-max-1080px  tx-altfont-2'>
          <a href="/" className='pointer flex-row nodeco pos-rel pt-4'>
            <img src="/bew/pnglogo.png" alt="tool_bg" className='ml-4 w-50px' />
            <div className='tx-bold' style={{ color: "#2B29AF" }}>Bew</div>
            <div className='tx-bold' style={{ color: "#6B69CF" }}>.quest</div>
          </a>

          <div className='px-4 flex-1 flex-row flex-justify-end tx-bold pt-4'>
            <div className='nodeco' data-tooltip-id="support-tooltip" data-tooltip-place="left" style={{ color: "#AFAFAF" }}>
              <div>Support</div>
            </div>
            <Tooltip id="support-tooltip" clickable>
              <a href="https://x.com/webduno" target='_blank' rel='noopener noreferrer' className='nodeco tx-white tx-altfont-2 nodeco tx-bold-2'>
                <div>𝕏 | @webduno</div>
              </a>
            </Tooltip>
          </div>
        </div>

        
        <div className='Q_xs_py-2'></div>
        <div>
          <div className='tx-lg tx-altfont-2 tx-bold opaci-25 tx-ls-1'>PROFILE</div>
        </div>

        <div className='w-100  w-max-1080px flex-row Q_xs_flex-col-r pt-8 flex-justify-center flex-align-start gap-4'>

          
        
          <div className='flex-wrap Q_xs_sm_flex-col flex-align-center gap-4 pb-100 pos-rel tx-altfont-2 '
          style={{
            color: "#777777",
          }}
          >
            <div className='flex-col  px-2 pos-rel '>

{/* <img src="/bew/birds.png" style={{ filter: "blur(0px)" }} alt="tool_bg2" className='hover-bird pos-abs noverflow block w-150px Q_xs_pt-8 pb-100' /> */}
<img src="/bew/pfp/row-4-column-1.png"
 alt="pfp" className={'bord-r-50 noverflow block '+(isMobile() ? 'w-150px' : 'w-250px')} />
<div className='bord-r-15 mb-4 pb-2 ' style={{ border: "1px solid #f0f0f0" }}>
              <BewUserStatsSummary minified />
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
                >💎 → Points (Completed Remote Viewings)</div>
                <div className='py-2'>💖 → Hearts (Accuracy Average)</div>
              </div>
              </details>
            </div>

                
            {!isMobile() && crvObjects.some(obj => obj.created_at.split('T')[0] === new Date().toISOString().split('T')[0]) ? 
                 <LessonCard
                 title="Viewed Today"
                 emoji="✅"
                 href="/"
                 actionText={"Details"}
                 
                 />
                : ''}            
</div>

<div className='flex-wrap px-4 flex-align-start flex-justify-start gap-4 flex-1'>
            
            <div className='bord-r-15  pb-2 pt-4 px-4 ' 
            // style={{ border: "1px solid #f0f0f0" }}
            >
              <div className='tx-bold tx-lg mb-2'>Username</div>
              <div className='tx-mdl'>{typedUsername || 'Not set'}</div>
              <div className='tx-mdl pt-4 pointer'
              onClick={() => {
                navigator.clipboard.writeText(LS_playerId || '');
                alert('Copied to clipboard');
              }}
              >Local name: <br /> <i className='tx-altfont-1 underline'>{LS_playerId || 'Not set'}</i> 📋</div>
            </div>
        

<div className='bord-r-15  pt-4 pb-2 px-4' style={{ border: "1px solid #f0f0f0" }}>
  <div className='tx-bold tx-lg mb-2'>Daily Goals</div>
  <div className='flex-col gap-2 flex-align-start'>
    <div>Completed: {crvObjects.filter(obj => obj.created_at.split('T')[0] === new Date().toISOString().split('T')[0]).length >= 5 ? '✅' : "❌"} ({userStats.dailyGoals.requests} / 5)</div>
    <div>Requests: {userStats.dailyGoals.requests}</div>
    <div>Avg Accuracy: {userStats.dailyGoals.accuracy.toFixed(3)}%</div>
    <div>Best Accuracy Today: {userStats.dailyGoals.bestAccuracy.toFixed(3)}%</div>
  </div>
</div>

            <div className='bord-r-15  pb-2 pt-4 px-4' style={{ border: "1px solid #f0f0f0" }}>
              <div className='tx-bold tx-lg mb-2 '>RV Stats</div>
              <div className='flex-col gap-2 flex-align-start'>
                <div>Total Requests: {userStats.totalRequests}</div>
                <div>First Request: {userStats.firstRequestDate ? new Date(userStats.firstRequestDate).toLocaleDateString() : 'No requests yet'}</div>
                <div>Average Accuracy: {userStats.averageAccuracy.toFixed(3)}%</div>
                <div>Best Accuracy: {userStats.bestAccuracy.toFixed(3)}%</div>
              </div>
            </div>


            <div className='w-100 '>
              <div className='tx-bold tx-lg mb-2 px-4'>Badges</div>
              <div className='flex-wrap flex-align-start flex-justify-start gap-4'>



{/* Badges */}
{hasMoreThan14Days && (
<LessonCard 
styleOverride={{
  width: "100px",
  fontSize: "12px",
}}
title="Regular Viewer"
emoji="🔥"
href="/"
actionText={""}

boxShadowColor="#bb4444"
backgroundColor='#ff7755'

/>
)}

{userStats.totalRequests >= 9 && (
<LessonCard 
title="Seer"
actionText={"Details"}
emoji="👀"
href="/"
/>
)}

{/* Badges */}
{hasMoreThan14Days && (
<LessonCard 
title="Fortnighter"
emoji="🏆"
href="/"
actionText={"Details"}

boxShadowColor="#964400"
backgroundColor='#FF9600'

/>
)}

</div>

</div>



          </div>

          
          </div>



          
        </div>
      <div id="journey"></div>  
      <div className='pb-100 flex-col flex-align-start tx-altfont-2 gap-4 w-100 w-max-1080px'
      >
        <div className="tx-xl opaci-40 tx-altfont-6">Your Journey</div>
        <div className="w-max-600px py-4 ">
          
        <BewChoiceButton
        onClick={() => {
          const journeyElement = document.getElementById('journey');
          if (journeyElement) {
            journeyElement.scrollIntoView({ behavior: 'smooth' });
            alert('Date: \n ' + new Date().toISOString().split('T')[0]);
          }
        }}
            secondaryColor="#D07900"
            mainColor="#FF9600"
            // onClick={() => handleInputTypeChange('multi-options')}
            text={"First View: "+ new Date().toLocaleDateString()}
            image={<div>⭐</div>}
          />
          <div className="w-100 flex-justify-center mt-4 mb-8 ">
            <svg width="20" height="60" viewBox="0 0 20 60" xmlns="http://www.w3.org/2000/svg">
              <path d="M10,0 Q0,30 10,60" stroke="#FF9600" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <div className='flex-col gap-2 w-100'>
            <div className='tx-altfont-2 w-max-300px opaci-50'>
            You made your first remote viewing on {new Date().toDateString()}  with an high accuracy.
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
            alert('Date: \n ' + new Date().toISOString().split('T')[0]);
          }
        }}
            secondaryColor="#6366f1"
            mainColor="#8a8af7"
            // onClick={() => handleInputTypeChange('multi-options')}
            text={"Latest View: "+ new Date().toISOString().split('T')[0]}
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
href="/"
actionText="Start"

boxShadowColor="#4C8A55"
backgroundColor='#71B44F'

/>

</div>


<hr className='w-100 opaci-10 '  />

<div className='flex-col flex-align-start gap-2 '>
  <div className='tx-bold tx-lg w-100'>
    <div>
      <div className='tx-bold tx-lg tx-center pt-8 pb-4'
      style={{
        color: "#4b4b4b",
      }}
      >
        Remote Viewing History
      </div>
      <div className='tx-altfont-2 opaci-50 tx-md flex-row px-4'>
        <div className=''>Date</div>
        <div className='flex-1 pl-8'>Report</div>
        <div className=''>Result/Sketch/Notes</div>
      </div>
      <hr className='w-100 opaci-10 '  />
      <div className='flex-col  gap-2 w-100'>
        {crvObjects.map((obj) => (
          <div key={obj.id} className='tx-altfont-2 w-100  flex-row tx-md pb-4 pt-2'
          style={{
            borderBottom: "1px solid #e5e5e5",
          }}
          >
            <div className='w-50px tx-bold-2 pl-4 opaci-25'>
              {obj.created_at.split('T')[0].replaceAll("-","\n")}
              </div>
            <div className='flex-1'>
              <div className='tx-bold'>
                <div className='tx-altfont-2  tx-md flex-wrap gap-1'>
                  {obj.content && obj.content.sent && Object.entries(obj.content.sent).map(([key, value]) => (
                    <div
                    style={{
                      border: "1px solid #e5e5e5",
                      color: "#aaaaaa",
                    }}
                    className='flex-row tx-bold-4 bord-r-10 px-2 py-1 tx-sm  border'
                     key={key}>{key}: {String(value)}</div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex-col">
            <div className='tx-sm opaci-50'>{obj.result.toFixed(3)}%</div>
            <div className='tx-lg'>{obj.result > 50 ? '🏆' : '💎'}</div>
            </div>
            <div className=''><SketchCheck onClick={() => {
              setCurrentSketch(obj.content.sketch);
              if (obj.content.target) {
                setCurrentImage({
                  id: obj.content.target.code,
                  description: obj.content.target.description || ''
                });
              }
              setShowSketchModal(true);
            }} content={obj.content} /></div>
            <div className=''><NotesCheck content={obj.content} /></div>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>


        </div>
      </div>
      </div>
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
              {modalView === 'image' && currentImage && (
                <img className='block pos-rel'
                  src={`/data/image/${currentImage.id.padStart(12, '0')}.jpg`}
                  alt={currentImage.description}
                  style={{
                    overflow: 'hidden',
                    borderRadius: "3px",
                    width: '100%',
                    maxWidth: '300px',
                    maxHeight: '300px',
                    objectFit: 'contain'
                  }}
                />
              )}
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
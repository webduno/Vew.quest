'use client';
import { useState, useEffect, useMemo } from 'react';
import { usePlayerStats } from '@/../script/state/hook/usePlayerStats';
import { useUserProfile } from '@/script/state/hook/useUserProfile';
import { NavigationHeaderBar } from '../../dom/bew/NavigationHeaderBar';
import { BewPageHeader } from '@/dom/bew/BewPageHeader';
import { useSearchParams } from 'next/navigation';
import { getUniqueDays, hasMoreThanFirstDays, hasMoreThan3DaysStreak } from '@/script/utils/calculations';
import { UserProfileHeader } from '@/dom/bew/UserProfileHeader';
import { DailyGoalsSection } from '@/dom/bew/DailyGoalsSection';
import { RVStatsSection } from '@/dom/bew/RVStatsSection';
import { RemoteViewingHistory } from '@/dom/bew/RemoteViewingHistory';
import { LessonCard } from '@/dom/bew/LessonCard';
import { isMobile } from '@/../script/utils/platform/mobileDetection';
import CanvasDraw from 'react-canvas-draw';

export default function UserProfilePage() {
  const { LS_playerId } = usePlayerStats();
  const searchParams = useSearchParams();
  const friendId = searchParams.get('friend') || searchParams.get('f');
  const [showSketchModal, setShowSketchModal] = useState(false);
  const [currentSketch, setCurrentSketch] = useState<any>(null);
  const [currentImage, setCurrentImage] = useState<{id: string, description: string} | null>(null);
  const [modalView, setModalView] = useState<'sketch' | 'image'>('sketch');

  const {
    crvObjects,
    userStats,
    isLoading,
    error
  } = useUserProfile(friendId);

  useEffect(() => {
    if (friendId) {
      document.title = `/u?f=${friendId} | Vew.quest`;
    } else {
      document.title = "Profile | Vew.quest";
    }
  }, [friendId]);

  useEffect(() => {
    // Handle hash navigation after page load
    if (window.location.hash) {
      console.log('hash 123', window.location.hash);
      const element = document.getElementById(window.location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        
      }
    }
  }, [crvObjects]);
  const hasMoreThanFirstDaysValue = useMemo(() => hasMoreThanFirstDays(crvObjects), [crvObjects]);
  const uniqueDays = useMemo(() => getUniqueDays(crvObjects), [crvObjects]);
  const hasMoreThan3DaysStreakValue = useMemo(() => hasMoreThan3DaysStreak(uniqueDays), [uniqueDays]);

  if (!friendId) {
    return (
      <div className='w-100 autoverflow-y h-100vh flex-col flex-justify-start'>
        <NavigationHeaderBar />
        <BewPageHeader title={"PROFILE"} />
        <div className='flex-col pt-100 w-80 tx-altfont-2'>
          <div className='tx-bold tx-lg mb-2 opaci-75'>
            No profile specified!
          </div>
          <img src="/bew/pfp/row-4-column-1.png"
            alt="pfp" className={'bord-r-50 noverflow block ' + (isMobile() ? 'w-150px' : 'w-250px')} />
          <a href="/tool"
            className={`nodeco bord-r-25 py-4 tx-altfont-2 tx-bold-4 w-100 w-max-600px tx-bold block tx-center`}
            style={{
              color: "#22cc22",
              background: "#e5ffe5",
              boxShadow: `0px 4px 0 0px #22aa22`,
              cursor: 'pointer',
            }}
          >
            Go to Tool
          </a>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='w-100 autoverflow-y h-100vh flex-col flex-justify-start'>
        <NavigationHeaderBar />
        <BewPageHeader title={"PROFILE"} />
        <div className='flex-col pt-100 w-80 tx-altfont-2'>
          <div className='tx-bold tx-lg mb-2 opaci-75'>
            Loading...
          </div>
        </div>
      </div>
    );
  }


  return (
    <>
      <div className='w-100 autoverflow-y h-100vh flex-col flex-justify-start'>
        <NavigationHeaderBar linkList={<>
        <a href="/leaderboard" className='nodeco' style={{ color: "#AFAFAF" }}>
          <div>Leaderboard</div>
        </a>
        <a href="/profile" className='nodeco' style={{ color: "#AFAFAF" }}>
          <div>Profile</div>
        </a>
      </>}  />
        <BewPageHeader title={"FRIEND'S PROFILE"} />

        <div className='w-100 w-max-1080px flex-row Q_xs_flex-col-r pt-8 flex-justify-center flex-align-start gap-4'>
          <UserProfileHeader
            showTrueSummary={false}
            potentialStreak={userStats?.potentialStreak}
            guestStats={{
              streak: userStats?.streak,
              points: userStats?.totalRequests || 0,
              hearts: parseInt(userStats?.averageAccuracy.toString()) || 0,
            }}
            playerId={friendId}
            userStats={userStats}
            crvObjects={crvObjects}
            onCopyUsername={() => {
              navigator.clipboard.writeText(friendId);
              alert('Copied to clipboard');
            }}
          />

          <div className='flex-wrap px-4 flex-align-start flex-justify-start gap-4 flex-1'>
            <DailyGoalsSection
              streak={userStats.streak}
              userStats={userStats}
              crvObjects={crvObjects}
            />

            <RVStatsSection
              userStats={userStats}
              uniqueDays={uniqueDays}
            />

            {hasMoreThan3DaysStreakValue && (
              <LessonCard
                styleOverride={{
                  width: "100px",
                  fontSize: "12px",
                }}
                title="Regular Viewer"
                emoji="🔥"
                href="#"
                actionText={""}
                forcedClick={() => {
                  alert('This user is a regular viewer!\n\nThey have made more than 3 days in a row!');
                }}
                boxShadowColor="#bb4444"
                backgroundColor='#ff7755'
              />
            )}

            {hasMoreThanFirstDaysValue && (
              <LessonCard
                title="First Viewer"
                emoji="♾️"
                href="#"
                forcedClick={() => {
                  alert('This user is a regular viewer!\n\nThey have been here since the first days!');
                }}
                boxShadowColor="#964400"
                backgroundColor='#FF9600'
                actionText={""}
              />
            )}

            {userStats.totalRequests >= 9 && (
              <LessonCard
                title="Seer Achievement"
                actionText={"Details"}
                emoji="👀"
                href="#"
                forcedClick={() => {
                  alert('This user is a seer!\n\nThey have performed more than 9 remote viewings!');
                }}
              />
            )}

            {userStats.averageAccuracy >= 40 && (
              <LessonCard
                title="High Accuracy Viewer"
                emoji="🏆"
                href="/leaderboard"
                actionText={"Check Leaderboard"}
                boxShadowColor="#964400"
                backgroundColor='#FF9600'
              />
            )}
          </div>
        </div>

        <div id="guest"></div>

        <div id="journey"></div>
        <div className='pb-100 flex-col flex-align-start tx-altfont-2 gap-4 w-100 w-max-1080px'>
          <div className="w-max-600px py-4">
            <RemoteViewingHistory
              highlightTarget={window.location.hash.substring(1)}
              authorId={friendId}
              crvObjects={crvObjects}
              onSketchClick={(sketch, image) => {
                setCurrentSketch(sketch);
                setCurrentImage(image);
                setShowSketchModal(true);
              }}
            />
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
                  src={`/data/image/${currentImage.id == "default" ? "default" : currentImage.id.padStart(12, '0')}.jpg`}
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
              )}
            </div>
            <div className="tx-center tx-altfont-2 mt-2 w-250px"
              style={{
                color: "#4B4B4B",
              }}
            >
              {modalView === 'sketch' ? 'Drawing' : currentImage?.description}
            </div>
          </div>
        </div>
      )}
    </>
  );
} 




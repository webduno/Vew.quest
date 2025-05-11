import { LessonCard } from '@/dom/bew/LessonCard';
import { useBackgroundMusic } from '../../../script/state/context/BackgroundMusicContext';
import JSConfetti from 'js-confetti';
import { useRef, useEffect, useContext } from 'react';
import { ProfileSnackbarContext } from '../../../script/state/context/ProfileSnackbarProvider';
import { BadgeCard } from './BadgeCard';

interface BewBadgesProps {
  hasMoreThan3DaysStreakValue: boolean;
  hasMoreThanFirstDaysValue: boolean;
  totalRequests: number;
  averageAccuracy: number;
}

export const BewBadges = ({
  hasMoreThan3DaysStreakValue,
  hasMoreThanFirstDaysValue,
  totalRequests,
  averageAccuracy,
}: BewBadgesProps) => {
  const snackbarContext = useContext(ProfileSnackbarContext);
  if (!snackbarContext) {
    throw new Error('ProfileSnackbarContext must be used within a ProfileSnackbarProvider');
  }
  const { setSnackbarMessage, setSnackbarSeverity, setIsSnackbarOpen, triggerSnackbar } = snackbarContext;
  
  const { playSoundEffect } = useBackgroundMusic();
  const confettiRef = useRef<JSConfetti | null>(null);
  
  useEffect(() => {
    confettiRef.current = new JSConfetti();
  }, []);

  const badgeList = {
    hasMoreThan3DaysStreakValue,
    hasMoreThanFirstDaysValue,
    moreThan9Requests: totalRequests >= 9,
    moreThan40Accuracy: averageAccuracy >= 40,
  }


  const doesntHaveBadges = !badgeList.hasMoreThan3DaysStreakValue && !badgeList.hasMoreThanFirstDaysValue && totalRequests < 9 && averageAccuracy < 40;

  return (
    <>
      {badgeList.hasMoreThan3DaysStreakValue && (
        <BadgeCard 
          styleOverride={{
            width: "100px",
            fontSize: "12px",
          }}
          title="Regular Viewer"
          emoji="🔥"
          href="#"
          actionText={""}
          forcedClick={() => {
            playSoundEffect('/sfx/short/slash.mp3');
            confettiRef.current?.addConfetti({
              confettiColors: ['#FFB02E', '#FF6723', '#333333'],
              confettiNumber: 50,
            });
            triggerSnackbar((<div className='tx-center tx-shadow-2 flex-col'>
            <div>
             Regular viewers club <br /> more than 2<span className='tx-shadow-5'>🔥</span> days in a row!
            </div>
            </div>), 'handbook');
            setTimeout(() => {
              // alert('Congratulations, you are a regular viewer!\n\nYou have made more than 3 days in a row!');
            }, 500);
          }}
          boxShadowColor="#bb4444"
          backgroundColor='#ff7755'
        />
      )}

      {badgeList.hasMoreThanFirstDaysValue && (
        <BadgeCard 
          title="First Viewer"
          emoji="♾️"
          href="#"
          forcedClick={() => {
            playSoundEffect('/sfx/short/rewi.mp3');
            confettiRef.current?.addConfetti({
              emojis: ['🌀', '♾️'],
              emojiSize: 25,
              confettiNumber: 100,
            });
            triggerSnackbar((<div className='tx-center flex-col'>
              <div>
                First of Viewers Badge!
              </div>
              <div>
                You've been here <br /> since the first days! ❤️
              </div>
            </div>), 'info');
          }}
          boxShadowColor="#964400"
          backgroundColor='#FF9600'
          actionText={""}
        />
      )}

      {badgeList.moreThan9Requests && (
        <BadgeCard 
          title="Seer Achievement"
          actionText={"Details"}
          backgroundColor="#80DB7D"
          boxShadowColor="#40aB3D"
          emoji="👀"
          href="#"
          forcedClick={() => {
            playSoundEffect('/sfx/short/myst.mp3');
            confettiRef.current?.addConfetti({
              confettiColors: ['#99ff99', '#aaf9c7'],
              confettiNumber: 100,
            });
            triggerSnackbar((<div className='tx-center flex-col'>
              <div>
                You are a 👀 seer!
              </div>
              <div>
                You've performed more than <br /> 9 remote viewings!
              </div>
            </div>), 'success');
          }}
        />
      )}

      {badgeList.moreThan40Accuracy && (
        <LessonCard 
          title="High Accuracy Viewer"
          emoji="🏆"
          href="#"
          actionText={""}
          forcedClick={() => {
            playSoundEffect('/sfx/short/sssccc.mp3');
            confettiRef.current?.addConfetti({
              confettiColors: ['#aa7700', '#ffcc00', '#ffaa00', '#ff6622'],
              confettiNumber: 150,
            });
            triggerSnackbar((<div className='tx-center flex-col'>
              <div>
              <span className='tx-shadow-5'>🏆</span> High accuracy viewer! <br /> (Your avg is above 40%!)
              </div>
              <div>
                <a href="/leaderboard" className='tx-bold pointer tx-white pt-2 z-1000 block'>
                  View Leaderboard
                </a>
              </div>
            </div>), 'warning');
          }}
          boxShadowColor="#964400"
          backgroundColor='#FF9600'
        />
      )}

      {doesntHaveBadges && (
        <div className="tx-center tx-gray-500">
          <BadgeCard
            title="No Badges Earned"
            emoji="🚫"
            href="/tool"
            actionText={"Continue Practice"}
            backgroundColor="#80DB7D"
            boxShadowColor="#40aB3D"
            styleOverride={{
              width: "300px",
              // fontSize: "12px",
            }}
            forcedClick={() => {}}
          />
        </div>
      )}
    </>
  );
}; 
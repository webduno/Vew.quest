import { LessonCard } from '@/dom/bew/LessonCard';
import { useBackgroundMusic } from '../../../script/state/context/BackgroundMusicContext';
import JSConfetti from 'js-confetti';
import { useRef, useEffect, useContext } from 'react';
import { ProfileSnackbarContext } from '../../../script/state/context/ProfileSnackbarProvider';

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

  return (
    <>
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
            playSoundEffect('/sfx/short/slash.mp3');
            confettiRef.current?.addConfetti({
              confettiColors: ['#FFB02E', '#FF6723', '#333333'],
              confettiNumber: 50,
            });
            triggerSnackbar((<div className='tx-center flex-col'>
            <div>
              Congratulations, you are a regular viewer!
            </div>
            <div>
              You have made more than 3 days in a row!
            </div>
            </div>), 'warning');
            setTimeout(() => {
              // alert('Congratulations, you are a regular viewer!\n\nYou have made more than 3 days in a row!');
            }, 500);
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
            playSoundEffect('/sfx/short/rewi.mp3');
            confettiRef.current?.addConfetti({
              emojis: ['🌀', '♾️'],
              emojiSize: 25,
              confettiNumber: 100,
            });
            triggerSnackbar((<div className='tx-center flex-col'>
              <div>
                Congratulations, you are a first viewer!
              </div>
              <div>
                You have made been here since the first days!
              </div>
            </div>), 'warning');
          }}
          boxShadowColor="#964400"
          backgroundColor='#FF9600'
          actionText={""}
        />
      )}

      {totalRequests >= 9 && (
        <LessonCard 
          title="Seer Achievement"
          actionText={"Details"}
          emoji="👀"
          href="#"
          forcedClick={() => {
            playSoundEffect('/sfx/short/myst.mp3');
            confettiRef.current?.addConfetti({
              confettiColors: ['#ff0a54', '#ff477e', '#ff7096', '#ff85a1', '#fbb1bd', '#f9bec7'],
              confettiNumber: 100,
            });
            triggerSnackbar((<div className='tx-center flex-col'>
              <div>
                Congratulations, you are a seer!
              </div>
              <div>
                You have performed more than 9 remote viewings!
              </div>
            </div>), 'warning');
          }}
        />
      )}

      {averageAccuracy >= 40 && (
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
                Congratulations, you are a high accuracy viewer!
              </div>
              <div>
                Your accuracy is above 40%!
              </div>
            </div>), 'warning');
          }}
          boxShadowColor="#964400"
          backgroundColor='#FF9600'
        />
      )}
    </>
  );
}; 
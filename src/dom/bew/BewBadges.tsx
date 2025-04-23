import { LessonCard } from '@/dom/bew/LessonCard';

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
  averageAccuracy
}: BewBadgesProps) => {
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
            alert('Congratulations, you are a regular viewer!\n\nYou have made more than 3 days in a row!');
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
            alert('Congratulations, you are a regular viewer!\n\nYou have made been here since the first days!');
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
            alert('Congratulations, you are a seer!\n\nYou have performed more than 9 remote viewings!');
          }}
        />
      )}

      {averageAccuracy >= 40 && (
        <LessonCard 
          title="High Accuracy Viewer"
          emoji="🏆"
          href="/leaderboard"
          actionText={"Check Leaderboard"}
          boxShadowColor="#964400"
          backgroundColor='#FF9600'
        />
      )}
    </>
  );
}; 
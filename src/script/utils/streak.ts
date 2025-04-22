import { CRVObject } from '@/script/state/context/FetchedStatsContext';

/**
 * Calculates the streak of consecutive days a user has made remote viewing attempts
 * @param objects Array of CRVObject containing viewing attempts
 * @returns The number of consecutive days with viewing attempts
 */
export const calculateStreak = (objects: CRVObject[]): number => {
  if (objects.length === 0) return 0;
  
  const uniqueDates = new Set(
    objects.map(obj => new Date(obj.created_at).toLocaleDateString('en-US'))
  );
  
  const sortedDates = Array.from(uniqueDates).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );
  
  let streak = 0;
  let currentDate = new Date();
  
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
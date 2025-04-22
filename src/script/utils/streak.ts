import { CRVObject } from '@/script/state/context/FetchedStatsContext';

/**
 * Calculates the streak of consecutive days a user has made remote viewing attempts
 * Uses UTC dates to ensure consistent calculation across timezones
 * Allows for one missed day in the streak
 * @param objects Array of CRVObject containing viewing attempts
 * @returns The number of consecutive days with viewing attempts
 */
export const calculateStreak = (objects: CRVObject[]): number => {
  if (objects.length === 0) return 0;

  // Get today's date at midnight UTC
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const todayTime = today.getTime();
  const yesterdayTime = todayTime - (24 * 60 * 60 * 1000);

  // Get unique dates and convert them to midnight UTC timestamps
  const uniqueDates = Array.from(new Set(
    objects.map(obj => {
      const date = new Date(obj.created_at);
      date.setUTCHours(0, 0, 0, 0);
      return date.getTime();
    })
  )).sort((a, b) => b - a); // Sort in descending order (newest first)

  // If no activity today or yesterday, no current streak
  if (!uniqueDates.length || uniqueDates[0] < yesterdayTime) {
    return 0;
  }

  let streak = 0;
  let expectedDate = todayTime;
  let missedDay = false;

  // Count consecutive days
  for (const timestamp of uniqueDates) {
    if (timestamp === expectedDate) {
      streak++;
      expectedDate -= 24 * 60 * 60 * 1000;
      missedDay = false;
    } else if (!missedDay) {
      // Allow one missed day
      missedDay = true;
      expectedDate -= 24 * 60 * 60 * 1000;
      if (timestamp === expectedDate) {
        streak++;
        expectedDate -= 24 * 60 * 60 * 1000;
      } else {
        break;
      }
    } else {
      break;
    }
  }

  return streak;
};

/**
 * Calculates the potential streak from yesterday, ignoring today's activity
 * Uses UTC dates to ensure consistent calculation across timezones
 * Only returns a non-zero value if there's an active streak that would be lost by missing today
 * @param objects Array of CRVObject containing viewing attempts
 * @returns The number of consecutive days with viewing attempts from yesterday, or 0 if no active streak
 */
export const calculatePotentialStreak = (objects: CRVObject[]): number => {
  if (objects.length === 0) return 0;

  // Get today's date at midnight UTC
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const todayTime = today.getTime();
  const yesterdayTime = todayTime - (24 * 60 * 60 * 1000);
  const twoDaysAgoTime = yesterdayTime - (24 * 60 * 60 * 1000);

  // Get unique dates and convert them to midnight UTC timestamps
  const uniqueDates = Array.from(new Set(
    objects.map(obj => {
      const date = new Date(obj.created_at);
      date.setUTCHours(0, 0, 0, 0);
      return date.getTime();
    })
  )).sort((a, b) => b - a); // Sort in descending order (newest first)

  // Check if there's an entry for today
  const hasToday = uniqueDates[0] === todayTime;
  if (hasToday) return 0;

  // Get the most recent activity date
  const mostRecentDate = uniqueDates[0];
  
  // If most recent activity is from two days ago, return 1 as potential streak
  if (mostRecentDate === twoDaysAgoTime) {
    return 1;
  }

  // If most recent activity is from yesterday, count the streak
  if (mostRecentDate === yesterdayTime) {
    let streak = 1;
    let expectedDate = yesterdayTime - (24 * 60 * 60 * 1000);
    let missedDay = false;

    // Count consecutive days
    for (let i = 1; i < uniqueDates.length; i++) {
      if (uniqueDates[i] === expectedDate) {
        streak++;
        expectedDate -= 24 * 60 * 60 * 1000;
        missedDay = false;
      } else if (!missedDay) {
        // Allow one missed day
        missedDay = true;
        expectedDate -= 24 * 60 * 60 * 1000;
        if (uniqueDates[i] === expectedDate) {
          streak++;
          expectedDate -= 24 * 60 * 60 * 1000;
        } else {
          break;
        }
      } else {
        break;
      }
    }
    return streak;
  }

  return 0;
}; 
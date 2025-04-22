import { CRVObject } from '@/script/state/context/FetchedStatsContext';

/**
 * Calculates the streak of consecutive days a user has made remote viewing attempts
 * Uses UTC dates to ensure consistent calculation across timezones
 * @param objects Array of CRVObject containing viewing attempts
 * @returns The number of consecutive days with viewing attempts
 */
export const calculateStreak = (objects: CRVObject[]): number => {
  if (objects.length === 0) return 0;

  // Get today's date at midnight UTC
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  // Get unique dates and convert them to midnight UTC timestamps
  const uniqueDates = Array.from(new Set(
    objects.map(obj => {
      const date = new Date(obj.created_at);
      date.setUTCHours(0, 0, 0, 0);
      return date.getTime();
    })
  )).sort((a, b) => b - a); // Sort in descending order (newest first)

  // Check if there's an entry for today
  const hasToday = uniqueDates[0] === today.getTime();
  
  let streak = 0;
  let expectedDate = today.getTime();

  // If no entry today, start checking from yesterday
  if (!hasToday) {
    expectedDate = today.getTime() - (24 * 60 * 60 * 1000);
  }

  // Count consecutive days
  for (const timestamp of uniqueDates) {
    if (timestamp === expectedDate) {
      streak++;
      expectedDate -= 24 * 60 * 60 * 1000; // Move to previous day
    } else {
      break; // Break the streak if we find a gap
    }
  }

  return streak;
};

/**
 * Calculates the potential streak from yesterday, ignoring today's activity
 * Uses UTC dates to ensure consistent calculation across timezones
 * @param objects Array of CRVObject containing viewing attempts
 * @returns The number of consecutive days with viewing attempts from yesterday
 */
export const calculatePotentialStreak = (objects: CRVObject[]): number => {
  if (objects.length === 0) return 0;

  // Get today's date at midnight UTC
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const todayTime = today.getTime();

  // Get unique dates and convert them to midnight UTC timestamps
  const uniqueDates = Array.from(new Set(
    objects.map(obj => {
      const date = new Date(obj.created_at);
      date.setUTCHours(0, 0, 0, 0);
      return date.getTime();
    })
  )).sort((a, b) => b - a); // Sort in descending order (newest first)

  // Filter out today's entries and get the most recent previous day
  const previousDates = uniqueDates.filter(date => date < todayTime);
  if (previousDates.length === 0) return 0;

  let streak = 1; // Start with 1 for the first previous day
  let expectedDate = previousDates[0] - (24 * 60 * 60 * 1000); // Start checking from the day before the most recent

  // Count consecutive days before today
  for (let i = 1; i < previousDates.length; i++) {
    if (previousDates[i] === expectedDate) {
      streak++;
      expectedDate -= 24 * 60 * 60 * 1000;
    } else {
      break;
    }
  }

  return streak;
}; 
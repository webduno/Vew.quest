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

  // Get unique dates and convert them to midnight UTC timestamps
  const uniqueDates = Array.from(new Set(
    objects.map(obj => {
      const date = new Date(obj.created_at);
      date.setUTCHours(0, 0, 0, 0);
      return date.getTime();
    })
  )).sort((a, b) => b - a); // Sort in descending order (newest first)

  if (!uniqueDates.length) return 0;

  // Check if the most recent activity is too old (more than 1 missed day from today)
  const daysSinceLastActivity = (todayTime - uniqueDates[0]) / (24 * 60 * 60 * 1000);
  if (daysSinceLastActivity > 2) { // More than one missed day
    return 0;
  }

  let streak = 1;
  let expectedDate = uniqueDates[0];
  let missedDay = false;

  // Count consecutive days
  for (let i = 1; i < uniqueDates.length; i++) {
    const currentDate = uniqueDates[i];
    const dayDiff = (expectedDate - currentDate) / (24 * 60 * 60 * 1000);

    if (dayDiff === 1) {
      streak++;
      expectedDate = currentDate;
      missedDay = false;
    } else if (dayDiff === 2 && !missedDay) {
      // Allow one missed day
      streak++;
      expectedDate = currentDate;
      missedDay = true;
    } else {
      break;
    }
  }

  return streak;
};

/**
 * Calculates the potential streak from yesterday, ignoring today's activity
 * Uses UTC dates to ensure consistent calculation across timezones
 * Returns what the streak would be if the user completes an activity today
 * @param objects Array of CRVObject containing viewing attempts
 * @returns The potential streak if user completes an activity today
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

  if (!uniqueDates.length) return 0;

  // If already completed today, return current streak since that's the minimum potential
  if (uniqueDates[0] === todayTime) {
    return calculateStreak(objects);
  }

  // Calculate days since most recent activity
  const daysSinceLastActivity = (todayTime - uniqueDates[0]) / (24 * 60 * 60 * 1000);
  
  // If last activity was more than 2 days ago, no potential streak
  if (daysSinceLastActivity > 2) {
    return 0;
  }

  // If we get here, completing today would count, so start with 1
  let potentialStreak = 1;
  let expectedDate = uniqueDates[0];
  let missedDay = daysSinceLastActivity === 2; // If last activity was 2 days ago, we're using our missed day

  // Count consecutive days
  for (let i = 1; i < uniqueDates.length; i++) {
    const currentDate = uniqueDates[i];
    const dayDiff = (expectedDate - currentDate) / (24 * 60 * 60 * 1000);

    if (dayDiff === 1) {
      potentialStreak++;
      expectedDate = currentDate;
      missedDay = false;
    } else if (dayDiff === 2 && !missedDay) {
      // Allow one missed day
      potentialStreak++;
      expectedDate = currentDate;
      missedDay = true;
    } else {
      break;
    }
  }

  return potentialStreak + 1; // Add 1 for today's potential activity
};
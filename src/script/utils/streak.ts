import { CRVObject } from '@/script/state/context/FetchedStatsContext';

/**
 * Calculates the streak of consecutive days a user has made remote viewing attempts
 * Uses UTC dates to ensure consistent calculation across timezones
 * Allows for one missed day between any two dates in the streak
 * @param objects Array of CRVObject containing viewing attempts
 * @returns The number of consecutive days with viewing attempts
 */
export const calculateStreak = (objects: CRVObject[], potential = false): number => {
  if (objects.length === 0) return potential ? 1 : 0;

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

  if (!uniqueDates.length) return potential ? 1 : 0;

  // Check if the most recent activity is too old (more than 1 missed day from today)
  const daysSinceLastActivity = (todayTime - uniqueDates[0]) / (24 * 60 * 60 * 1000);
  if (daysSinceLastActivity > 2) { // More than one missed day
    return potential ? 1 : 0;
  }

  let streak = 1;
  let expectedDate = uniqueDates[0];

  // if missed today, add 1 to streak for potential streak calculation
  if (potential && uniqueDates[0] !== todayTime) {
    streak++;
  }

  // Count consecutive days
  for (let i = 1; i < uniqueDates.length; i++) {
    const currentDate = uniqueDates[i];
    const dayDiff = (expectedDate - currentDate) / (24 * 60 * 60 * 1000);

    if (dayDiff === 1) {
      // Consecutive day
      streak++;
      expectedDate = currentDate;
    } else if (dayDiff === 2) {
      // One day gap is allowed between any two dates
      streak++;
      expectedDate = currentDate;
    } else {
      // More than one day gap, break the streak
      break;
    }
  }

  return streak;
};

export const calculatePotentialStreak = (objects: CRVObject[]): number => {
  const streak = calculateStreak(objects, true);
  return streak;
};
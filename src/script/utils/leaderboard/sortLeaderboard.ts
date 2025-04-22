import { clean } from 'profanity-cleaner';

interface LeaderboardEntry {
  storage_key: string;
  streak: number;
  potential_streak: number;
  highest_accuracy: number | string;
  total_score: number | string;
}

export function sortAndFilterLeaderboard(leaderboard: LeaderboardEntry[]): LeaderboardEntry[] {
  if (!leaderboard) return [];

  return leaderboard
    .filter(entry => 
      !clean(entry.storage_key, {
        exceptions: ["funk"],
        customBadWords: ["webduno"],
      }).includes("***")
    )
    .sort((a, b) => {
      // First sort by actual streak
      if (b.streak !== a.streak) {
        return b.streak - a.streak;
      }
      // Then by potential streak if actual streaks are equal
      const potentialStreakA = a.potential_streak || 0;
      const potentialStreakB = b.potential_streak || 0;
      if (potentialStreakB !== potentialStreakA) {
        return potentialStreakB - potentialStreakA;
      }
      // Then by highest accuracy
      const accuracyA = parseInt(a.highest_accuracy?.toString() || '0');
      const accuracyB = parseInt(b.highest_accuracy?.toString() || '0');
      if (accuracyB !== accuracyA) {
        return accuracyB - accuracyA;
      }
      // Finally by total score
      return parseInt(b.total_score.toString()) - parseInt(a.total_score.toString());
    });
} 
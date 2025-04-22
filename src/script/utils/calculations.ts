import { CRVObject } from '@/script/state/context/FetchedStatsContext';

export interface UserStats {
  totalRequests: number;
  firstRequestDate: string | null;
  averageAccuracy: number;
  bestAccuracy: number;
  dailyGoals: {
    requests: number;
    accuracy: number;
    bestAccuracy: number;
  };
}

export const calculateUserStats = (crvObjects: CRVObject[]): UserStats => {
  const today = new Date().toISOString().split('T')[0];
  const todayObjects = crvObjects.filter(obj => 
    obj.created_at.split('T')[0] === today
  );
  
  return {
    totalRequests: crvObjects.length,
    firstRequestDate: crvObjects[crvObjects.length - 1]?.created_at || null,
    averageAccuracy: crvObjects.reduce((acc, obj) => acc + (obj.result || 0), 0) / crvObjects.length,
    bestAccuracy: Math.max(...crvObjects.map(obj => obj.result || 0)),
    dailyGoals: {
      requests: todayObjects.length,
      accuracy: todayObjects.reduce((acc, obj) => acc + (obj.result || 0), 0) / todayObjects.length,
      bestAccuracy: todayObjects.length > 0 ? Math.max(...todayObjects.map(obj => obj.result || 0)) : 0
    }
  };
};

export const getUniqueDays = (crvObjects: CRVObject[]): string[] => {
  return Array.from(new Set(crvObjects.map(obj => obj.created_at.split('T')[0])));
};

export const hasMoreThanFirstDays = (crvObjects: CRVObject[]): boolean => {
  const uniqueDays = getUniqueDays(crvObjects);
  return uniqueDays.length >= 3;
};

export const hasMoreThan3DaysStreak = (uniqueDays: string[]): boolean => {
  return uniqueDays.length >= 3;
};

export const getTodayObjects = (crvObjects: CRVObject[]): CRVObject[] => {
  const today = new Date().toISOString().split('T')[0];
  return crvObjects.filter(obj => obj.created_at.split('T')[0] === today);
};

export const calculateGuestStats = (crvObjects: CRVObject[]) => {
  const streak = calculateStreak(crvObjects);
  const averageResult = crvObjects.length > 0 
    ? crvObjects.reduce((sum: number, obj: any) => sum + obj.result, 0) / crvObjects.length 
    : 0;
  
  return {
    crvObjects,
    streak,
    averageResult,
    isLoading: false,
    error: null
  };
};

// Import this from your existing streak.ts file
import { calculateStreak } from './streak'; 
import { CRVObject } from '@/script/state/context/FetchedStatsContext';

export interface UserStats {
  totalRequests: number;
  firstRequestDate: string | null;
  averageAccuracy: number;
  bestAccuracy: number;
  potentialStreak: number;
  streak: number;
  dailyGoals: {
    requests: number;
    accuracy: number;
    bestAccuracy: number;
  };
}

export const calculateUserStats = (crvObjects: CRVObject[]): UserStats => {
  // Get today's date at midnight UTC
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split('T')[0];

  const todayObjects = crvObjects.filter(obj => {
    const date = new Date(obj.created_at);
    date.setUTCHours(0, 0, 0, 0);
    return date.toISOString().split('T')[0] === todayStr;
  });
  return {
    totalRequests: crvObjects.length,
    firstRequestDate: crvObjects[crvObjects.length - 1]?.created_at || null,
    averageAccuracy: crvObjects.reduce((acc, obj) => acc + (obj.result || 0), 0) / crvObjects.length,
    bestAccuracy: Math.max(...crvObjects.map(obj => obj.result || 0)),
    potentialStreak: calculatePotentialStreak(crvObjects),
    streak: calculateStreak(crvObjects),
    dailyGoals: {
      requests: todayObjects.length,
      accuracy: todayObjects.reduce((acc, obj) => acc + (obj.result || 0), 0) / todayObjects.length,
      bestAccuracy: todayObjects.length > 0 ? Math.max(...todayObjects.map(obj => obj.result || 0)) : 0
    }
  };
};

export const getUniqueDays = (crvObjects: CRVObject[]): string[] => {
  return Array.from(new Set(
    crvObjects.map(obj => {
      const date = new Date(obj.created_at);
      date.setUTCHours(0, 0, 0, 0);
      return date.toISOString().split('T')[0];
    })
  ));
};

export const hasMoreThanFirstDays = (crvObjects: CRVObject[]): boolean => {
  const uniqueDays = getUniqueDays(crvObjects);
  return uniqueDays.length >= 3;
};

export const hasMoreThan3DaysStreak = (uniqueDays: string[]): boolean => {
  return uniqueDays.length >= 2;
};

export const getTodayObjects = (crvObjects: CRVObject[]): CRVObject[] => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split('T')[0];

  return crvObjects.filter(obj => {
    const date = new Date(obj.created_at);
    date.setUTCHours(0, 0, 0, 0);
    return date.toISOString().split('T')[0] === todayStr;
  });
};

export const calculateGuestStats = (crvObjects: CRVObject[]) => {
  const streak = calculateStreak(crvObjects);
  const potentialStreak = calculatePotentialStreak(crvObjects);
  const averageResult = crvObjects.length > 0 
    ? crvObjects.reduce((sum: number, obj: any) => sum + obj.result, 0) / crvObjects.length 
    : 0;
  
  return {
    crvObjects,
    streak,
    potentialStreak,
    averageResult,
    isLoading: false,
    error: null
  };
};

// Import this from your existing streak.ts file
import { calculatePotentialStreak, calculateStreak } from './streak';

export function humanDescription(
  coords: { lat: number, lng: number } | null,
  targetCoords: { lat: number, lng: number },
  countries: { features: any[] }
) {
  if (!coords) return "No coordinates available";

  const distance = Math.sqrt(
    Math.pow(coords.lat - targetCoords.lat, 2) +
      Math.pow(coords.lng - targetCoords.lng, 2)
  );

  // Find the closest country
  let closestCountry: any = null;
  let minDistance = Infinity;

  countries.features.forEach((country) => {
    const countryCoords = country.geometry.coordinates;
    const countryDistance = Math.sqrt(
      Math.pow(coords.lat - countryCoords[1], 2) +
        Math.pow(coords.lng - countryCoords[0], 2)
    );

    if (countryDistance < minDistance) {
      minDistance = countryDistance;
      closestCountry = country;
    }
  });

  if (closestCountry && closestCountry?.properties) {
    const countryName = closestCountry.properties.name;
    const direction = coords.lat > targetCoords.lat ? "north" : "south";
    const eastWest = coords.lng > targetCoords.lng ? "east" : "west";
    return `${distance.toFixed(2)} km away, near ${countryName} (${direction}${eastWest})`;
  }

  return `${distance.toFixed(2)} km away`;
} 
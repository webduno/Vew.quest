'use client';
import { useState, useEffect } from 'react';
import { CRVObject } from '@/script/state/context/FetchedStatsContext';
import { UserStats, calculateUserStats } from '@/script/utils/calculations';

interface UserProfileData {
  crvObjects: CRVObject[];
  userStats: UserStats;
  isLoading: boolean;
  error: string | null;
}

export function useUserProfile(profileId: string | null) {
  const [data, setData] = useState<UserProfileData>({
    crvObjects: [],
    userStats: {
      totalRequests: 0,
      firstRequestDate: null,
      averageAccuracy: 0,
      bestAccuracy: 0,
      potentialStreak: 0,
      streak: 0,
      dailyGoals: {
        requests: 0,
        accuracy: 0,
        bestAccuracy: 0
      }
    },
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!profileId) {
        setData(prev => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        const response = await fetch(`/api/supabase?storageKey=${profileId}`, {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'Pragma': 'no-cache'
          },
          cache: 'no-store'
        });
        const result = await response.json();
        
        if (result.success) {
          const crvObjects = result.data;
          const userStats = calculateUserStats(crvObjects);
          setData({
            crvObjects,
            userStats,
            isLoading: false,
            error: null
          });
        } else {
          setData(prev => ({
            ...prev,
            error: 'Failed to fetch profile data',
            isLoading: false
          }));
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setData(prev => ({
          ...prev,
          error: 'Failed to fetch profile data',
          isLoading: false
        }));
      }
    };

    fetchData();
  }, [profileId]);

  return data;
} 
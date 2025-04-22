'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { calculateStreak } from '@/script/utils/streak';

interface CRVObject {
  id: string;
  content: any;
  result: number;
  created_at: string;
  storage_key: string;  
}

interface UserStatsContextType {
  crvObjects: CRVObject[];
  streak: number;
  dailyProgress: number;
  dailyGoal: number;
  isLoading: boolean;
  error: string | null;
}

const UserStatsContext = createContext<UserStatsContextType | undefined>(undefined);

export function UserStatsProvider({ children }: { children: ReactNode }) {
  const [crvObjects, setCrvObjects] = useState<CRVObject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storageKey = localStorage.getItem('VB_PLAYER_ID');
        if (!storageKey) {
          setIsLoading(false);
          return;
        }

        const response = await fetch(`/api/supabase?storageKey=${storageKey}`, {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'Pragma': 'no-cache'
          },
          cache: 'no-store'
        });
        const data = await response.json();
        
        if (data.success) {
          setCrvObjects(data.data);
        }
      } catch (error) {
        console.error('Error fetching CRV objects:', error);
        setError('Failed to fetch user stats');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateDailyProgress = (objects: CRVObject[]) => {
    if (objects.length === 0) return 0;
    
    const today = new Date().toLocaleDateString('en-US');
    const todayObjects = objects.filter(obj => 
      new Date(obj.created_at).toLocaleDateString('en-US') === today
    );
    
    return todayObjects.length;
  };

  const streak = calculateStreak(crvObjects);
  const dailyProgress = calculateDailyProgress(crvObjects);
  const dailyGoal = 5;

  return (
    <UserStatsContext.Provider value={{
      crvObjects,
      streak,
      dailyProgress,
      dailyGoal,
      isLoading,
      error
    }}>
      {children}
    </UserStatsContext.Provider>
  );
}

export function useUserStats() {
  const context = useContext(UserStatsContext);
  if (context === undefined) {
    throw new Error('useUserStats must be used within a UserStatsProvider');
  }
  return context;
} 
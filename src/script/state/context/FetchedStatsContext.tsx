'use client';
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface CRVObject {
  id: string;
  content: any;
  result: number;
  created_at: string;
  storage_key: string;  
}

interface MailboxRequest {
  description: string;
  bounty: number;
  attempts: number;
  solved: number;
  created_at: string;
}

interface LeaderboardEntry {
  storage_key: string;
  total_score: number;
  rank: number;
  streak: number;
  highest_accuracy: number;
}

interface FetchedStatsContextType {
  crvObjects: CRVObject[];
  streak: number;
  dailyProgress: number;
  dailyGoal: number;
  isLoading: boolean;
  error: string | null;
  // Mailbox related states
  mailboxRequests: MailboxRequest[] | null;
  isLoadingMailbox: boolean;
  mailboxError: string | null;
  fetchMailboxRequests: () => Promise<void>;
  refetchStats: () => Promise<void>;
  averageResult: number;
  // Leaderboard states
  leaderboard: LeaderboardEntry[] | null;
  isLoadingLeaderboard: boolean;
  leaderboardError: string | null;
  fetchLeaderboard: () => Promise<void>;
}

const FetchedStatsContext = createContext<FetchedStatsContextType | undefined>(undefined);

export function FetchedStatsProvider({ children }: { children: ReactNode }) {
  const [crvObjects, setCrvObjects] = useState<CRVObject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Mailbox states
  const [mailboxRequests, setMailboxRequests] = useState<MailboxRequest[] | null>(null);
  const [isLoadingMailbox, setIsLoadingMailbox] = useState(false);
  const [mailboxError, setMailboxError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  // Leaderboard states
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[] | null>(null);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);
  const [leaderboardError, setLeaderboardError] = useState<string | null>(null);

  const fetchMailboxRequests = useCallback(async () => {
    const storageKey = localStorage.getItem('VB_PLAYER_ID');
    if (!storageKey) {
      setMailboxError('No player ID found');
      return;
    }

    // Debounce requests - only allow one request per 5 seconds
    const now = Date.now();
    if (now - lastFetchTime < 5000) {
      return;
    }

    try {
      setIsLoadingMailbox(true);
      const response = await fetch(`/api/supabase/crvmailbox?playerId=${storageKey}`, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache'
        },
        cache: 'no-store'
      });
      const data = await response.json();
      
      if (data.success) {
        setMailboxRequests(data.data);
        setLastFetchTime(now);
      }
    } catch (error) {
      console.error('Error fetching mailbox requests:', error);
      setMailboxError('Failed to fetch mailbox requests');
    } finally {
      setIsLoadingMailbox(false);
    }
  }, [lastFetchTime]);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setIsLoadingLeaderboard(true);
      const response = await fetch('/api/supabase/leaderboard', {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache'
        },
        cache: 'no-store'
      });
      const data = await response.json();
      
      if (data.success) {
        setLeaderboard(data.data);
      } else {
        setLeaderboardError('Failed to fetch leaderboard');
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setLeaderboardError('Failed to fetch leaderboard');
    } finally {
      setIsLoadingLeaderboard(false);
    }
  }, []);

  const fetchData = async () => {
    try {
      const storageKey = localStorage.getItem('VB_PLAYER_ID');
      const searchParams = new URLSearchParams(window.location.search);
      const urlUsername = searchParams.get("username");
      
      // Use either the storage key or URL username
      const identifier = storageKey || urlUsername;
      if (!identifier) {
        setIsLoading(false);
        return;
      }

      const response = await fetch(`/api/supabase?storageKey=${identifier}`, {
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

  useEffect(() => {
    fetchData();
  }, []);

  // Add refetchStats function
  const refetchStats = async () => {
    setIsLoading(true);
    await fetchData();
  };

  const calculateStreak = (objects: CRVObject[]) => {
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

  const calculateAverageResult = (objects: CRVObject[]) => {
    if (objects.length === 0) return 0;
    
    const totalResult = objects.reduce((sum, obj) => sum + obj.result, 0);
    return totalResult / objects.length;
  };

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
  const averageResult = calculateAverageResult(crvObjects);

  return (
    <FetchedStatsContext.Provider value={{
      crvObjects,
      streak,
      dailyProgress,
      dailyGoal,
      isLoading,
      error,
      mailboxRequests,
      isLoadingMailbox,
      mailboxError,
      fetchMailboxRequests,
      refetchStats,
      averageResult,
      leaderboard,
      isLoadingLeaderboard,
      leaderboardError,
      fetchLeaderboard
    }}>
      {children}
    </FetchedStatsContext.Provider>
  );
}

export function useFetchedStats() {
  const context = useContext(FetchedStatsContext);
  if (context === undefined) {
    throw new Error('useFetchedStats must be used within a FetchedStatsProvider');
  }
  return context;
} 
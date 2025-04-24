'use client';
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export function useLSPlayerId() {
  const [LS_playerId, setLS_playerId] = useState<string | null>(null);
  const [typedUsername, setTypedUsername] = useState("");
  const searchParams = useSearchParams();

  const setPlayerId = (playerId: string) => {
    localStorage.VB_PLAYER_ID = playerId;
    setLS_playerId(playerId);
  };

  const sanitizePlayerId = (playerId: string) => {
    return playerId.replace(/[^a-zA-Z0-9@._-]/g, '');
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const playerId: string | null = localStorage.VB_PLAYER_ID;
    if (playerId) {
      setLS_playerId(playerId);
      setTypedUsername(playerId);
    } else {
      const urlUsername = searchParams.get("username");
      if (urlUsername) {
        setTypedUsername(urlUsername);
      }
    }
  }, []);

  return {
    LS_playerId,
    typedUsername,
    setTypedUsername,
    setPlayerId,
    sanitizePlayerId
  };
}

export function usePlayerStats() {
  const { LS_playerId, typedUsername, setTypedUsername, setPlayerId, sanitizePlayerId } = useLSPlayerId();
  const [LS_firstTime, setLS_firstTime] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const alreadyPlayed = localStorage.getItem('VB_ALREADY_PLAYED');
    return !alreadyPlayed;
  });
  const [LS_lowGraphics, setLS_lowGraphics] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const legacyGraphics = localStorage.getItem('VB_LEGACY_GRAPHICS');
    return legacyGraphics === '1';
  });
  const [LS_ultraGraphics, setLS_ultraGraphics] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const ultraGraphics = localStorage.getItem('VB_ULTRA_GRAPHICS');
    return ultraGraphics === '1';
  });
  const [LS_hasFirstKey, setLS_hasFirstKey] = useState<boolean>(false);
  const [mindStats, setMindStats] = useState<{ 
    color: number,
    solid: number,
    cash?: number,
    chronovisor_ticket?: number,
    pk_pill?: number,
    mars_pass?: number,
    declasification_request?: number,
    firstaid_pr?: number,
   }>({
    color: 0,
    solid: 0,
    cash: 0,
    chronovisor_ticket: 0,
    pk_pill: 0,
    mars_pass: 0,
    declasification_request: 0,
    firstaid_pr: 0
  });
  const [tutorials, setTutorials] = useState<{ [key: string]: boolean }>({});
  const [explored, setExplored] = useState<{ [key: string]: boolean }>({});
  const router = useRouter()
  const searchParams = useSearchParams()
  // const pathname = usePathname()

  // Create a proxy for localStorage
  const localStorageProxy = typeof window !== 'undefined' ? new Proxy(localStorage, {
    set: function(target, key, value) {
      target.setItem(key as string, value);
      window.postMessage('localStorageChanged', '*');
      return true;
    }
  }) : {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    key: () => null,
    length: 0
  };

  const disableFirstTime = () => {
    setLS_firstTime(false);
    localStorageProxy.VB_ALREADY_PLAYED = 'true';
  }

  const setHasFirstKey = (value: boolean) => {
    localStorageProxy.VB_HAS_FIRST_KEY = value ? '1' : '0';
    setLS_hasFirstKey(value);
  };

  const formatPortalUrl = (url: string) => {
    const local_username = localStorageProxy.VB_PLAYER_ID || ""
    const url_username = searchParams.get("username") || local_username

    const parsedUrl = !url.startsWith("http") ? "https://" + url : url

    const new_url = new URL(parsedUrl)
    new_url.searchParams.set("username", url_username)
    new_url.searchParams.set("ref", "https://vew.quest")
    return new_url.toString()
  };

  const toggleLowGraphics = () => {
    const newValue = !LS_lowGraphics;
    setLS_lowGraphics(newValue);
    localStorageProxy.VB_LEGACY_GRAPHICS = newValue ? '1' : '0';
    if (newValue) {
      setLS_ultraGraphics(false);
      localStorageProxy.VB_ULTRA_GRAPHICS = '0';
    }
  };

  const toggleUltraGraphics = () => {
    const newValue = !LS_ultraGraphics;
    setLS_ultraGraphics(newValue);
    localStorageProxy.VB_ULTRA_GRAPHICS = newValue ? '1' : '0';
    if (newValue) {
      setLS_lowGraphics(false);
      localStorageProxy.VB_LEGACY_GRAPHICS = '0';
    }
  };

  const updateMindStats = (type: 'color' | 'solid' | 'cash' | 'firstaid_pr', value: number) => {
    const newStats = { ...mindStats, [type]: value };
    setMindStats(newStats);
    localStorageProxy.VB_MINDSTATS = JSON.stringify(newStats);
  };

  const updateTutorialStatus = (tutorialId: string, completed: boolean) => {
    const savedTutorials = localStorageProxy.VB_TUTORIALS;
    const tutorialsObj = savedTutorials ? JSON.parse(savedTutorials) : {};
    tutorialsObj[tutorialId] = completed;
    localStorageProxy.VB_TUTORIALS = JSON.stringify(tutorialsObj);
    setTutorials(tutorialsObj);
  };

  const hasCompletedTutorial = (tutorialId: string) => {
    const savedTutorials = localStorageProxy.VB_TUTORIALS;
    if (!savedTutorials) return false;
    
    try {
      const tutorialsObj = JSON.parse(savedTutorials);
      return tutorialsObj[tutorialId] === true;
    } catch (e) {
      return false;
    }
  };

  const updateExploredStatus = (zoneId: string, isExplored: boolean) => {
    const savedExplored = localStorageProxy.VB_EXPLORED;
    const exploredObj = savedExplored ? JSON.parse(savedExplored) : {};
    exploredObj[zoneId] = isExplored;
    localStorageProxy.VB_EXPLORED = JSON.stringify(exploredObj);
    setExplored(exploredObj);
  };

  const hasExploredZone = (zoneId: string) => {
    const savedExplored = localStorageProxy.VB_EXPLORED;
    if (!savedExplored) return false;
    
    try {
      const exploredObj = JSON.parse(savedExplored);
      return exploredObj[zoneId] === true;
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    if (!localStorageProxy) { return; }

    const legacyGraphics: string | null = localStorageProxy.VB_LEGACY_GRAPHICS;
    if (legacyGraphics !== null) {
      setLS_lowGraphics(legacyGraphics === '1');
    }

    const ultraGraphics: string | null = localStorageProxy.VB_ULTRA_GRAPHICS;
    if (ultraGraphics !== null) {
      setLS_ultraGraphics(ultraGraphics === '1');
    }

    const alreadyPlayed: any = localStorageProxy.VB_ALREADY_PLAYED;
    setLS_firstTime(!alreadyPlayed);

    const hasFirstKey: string | null = localStorageProxy.VB_HAS_FIRST_KEY;
    if (hasFirstKey !== null) {
      setLS_hasFirstKey(hasFirstKey === '1');
    }

    const updateMindStatsFromStorage = () => {
      const savedStats = localStorageProxy.VB_MINDSTATS;
      if (savedStats) {
        try {
          const parsedStats = JSON.parse(savedStats);
          setMindStats({
            color: parsedStats.color || 0,
            solid: parsedStats.solid || 0,
            cash: parsedStats.cash || 0,
            chronovisor_ticket: parsedStats.chronovisor_ticket || 0,
            pk_pill: parsedStats.pk_pill || 0,
            mars_pass: parsedStats.mars_pass || 0,
            declasification_request: parsedStats.declasification_request || 0,
            firstaid_pr: parsedStats.firstaid_pr || 0
          });
        } catch (e) {
          console.error('Error parsing mindStats:', e);
        }
      }
    };

    updateMindStatsFromStorage();

    const savedTutorials = localStorageProxy.VB_TUTORIALS;
    if (savedTutorials) {
      try {
        let parsedTutorials = JSON.parse(savedTutorials);
        if (typeof parsedTutorials === 'string') {
          try {
            parsedTutorials = JSON.parse(parsedTutorials);
          } catch (e) {
            console.error('Error parsing nested tutorials:', e);
          }
        }
        setTutorials(parsedTutorials);
      } catch (e) {
        console.error('Error parsing tutorials:', e);
        setTutorials({});
      }
    } else {
      setTutorials({});
    }

    const savedExplored = localStorageProxy.VB_EXPLORED;
    if (savedExplored) {
      try {
        let parsedExplored = JSON.parse(savedExplored);
        if (typeof parsedExplored === 'string') {
          try {
            parsedExplored = JSON.parse(parsedExplored);
          } catch (e) {
            console.error('Error parsing nested explored:', e);
          }
        }
        setExplored(parsedExplored);
      } catch (e) {
        console.error('Error parsing explored:', e);
        setExplored({});
      }
    } else {
      setExplored({});
    }

    const handleStorageChange = (e: MessageEvent) => {
      if (e.data === 'localStorageChanged') {
        updateMindStatsFromStorage();
        
        const hasFirstKey: string | null = localStorageProxy.VB_HAS_FIRST_KEY;
        if (hasFirstKey !== null) {
          setLS_hasFirstKey(hasFirstKey === '1');
        }
      }
    };

    window.addEventListener('message', handleStorageChange);
    return () => window.removeEventListener('message', handleStorageChange);
  }, []);

  return {
    LS_playerId,
    typedUsername,
    setTypedUsername,
    setPlayerId,
    sanitizePlayerId,
    formatPortalUrl,
    LS_lowGraphics,
    toggleLowGraphics,
    LS_ultraGraphics,
    toggleUltraGraphics,
    LS_firstTime,
    disableFirstTime,
    LS_hasFirstKey,
    setHasFirstKey,
    mindStats,
    updateMindStats,
    tutorials,
    updateTutorialStatus,
    hasCompletedTutorial,
    explored,
    updateExploredStatus,
    hasExploredZone
  };
};

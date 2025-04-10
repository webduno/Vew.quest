'use client';
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";



export function useVibeverse() {
  const [LS_firstTime, setLS_firstTime] = useState<boolean>(true);
  const [LS_playerId, setLS_playerId] = useState<string | null>(null);
  const [typedUsername, setTypedUsername] = useState("");
  const [LS_lowGraphics, setLS_lowGraphics] = useState<boolean>(false);
  const [LS_hasFirstKey, setLS_hasFirstKey] = useState<boolean>(false);
  const [mindStats, setMindStats] = useState<{ color: number }>({ color: 0 });
  const [tutorials, setTutorials] = useState<{ [key: string]: boolean }>({});
  const router = useRouter()
  const searchParams = useSearchParams()
  // const pathname = usePathname()

  const disableFirstTime = () => {
    setLS_firstTime(false);
    localStorage.setItem('VB_ALREADY_PLAYED', 'true');
  }

  const setHasFirstKey = (value: boolean) => {
    localStorage.setItem('VB_HAS_FIRST_KEY', value ? '1' : '0');
    setLS_hasFirstKey(value);
  };

  const formatPortalUrl = (url: string) => {
    const local_username = localStorage.getItem("VB_PLAYER_ID") || ""
    const url_username = searchParams.get("username") || local_username
    // if (!url_username) { return url }

    // if it doesnt have a protocol, add https://
    const parsedUrl = !url.startsWith("http") ? "https://" + url : url

    const new_url = new URL(parsedUrl)
    new_url.searchParams.set("username", url_username)
    new_url.searchParams.set("ref", "https://wbew.vercel.app/game")
    return new_url.toString()
  };

  const setPlayerId = (playerId: string) => {
    localStorage.setItem('VB_PLAYER_ID', playerId);
    setLS_playerId(playerId);
  };

  const sanitizePlayerId = (playerId: string) => {
    // only allow alphanumeric characters plus @ . - and underscore
    return playerId.replace(/[^a-zA-Z0-9@._-]/g, '');
  };

  const toggleLowGraphics = () => {
    const newValue = !LS_lowGraphics;
    setLS_lowGraphics(newValue);
    localStorage.setItem('VB_LEGACY_GRAPHICS', newValue ? '1' : '0');
  };

  const updateMindStats = (type: 'color', value: number) => {
    const newStats = { ...mindStats, [type]: value };
    setMindStats(newStats);
    localStorage.setItem('VB_MINDSTATS', JSON.stringify(newStats));
  };

  const updateTutorialStatus = (tutorialId: string, completed: boolean) => {
    const savedTutorials = localStorage.getItem('VB_TUTORIALS');
    const tutorialsObj = savedTutorials ? JSON.parse(savedTutorials) : {};
    tutorialsObj[tutorialId] = completed;
    localStorage.setItem('VB_TUTORIALS', JSON.stringify(tutorialsObj));
    setTutorials(tutorialsObj);
  };

  const hasCompletedTutorial = (tutorialId: string) => {
    // Get directly from localStorage to ensure we have the latest value
    const savedTutorials = localStorage.getItem('VB_TUTORIALS');
    if (!savedTutorials) return false;
    
    try {
      const tutorialsObj = JSON.parse(savedTutorials);
      return tutorialsObj[tutorialId] === true;
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    if (!localStorage) { return; }

    const playerId: string | null = localStorage.getItem('VB_PLAYER_ID');
    if (playerId) {
      setLS_playerId(playerId);
      setTypedUsername(playerId);
    }

    const legacyGraphics: string | null = localStorage.getItem('VB_LEGACY_GRAPHICS');
    if (legacyGraphics !== null) {
      setLS_lowGraphics(legacyGraphics === '1');
    }

    const alreadyPlayed: any = localStorage.getItem('VB_ALREADY_PLAYED');
    setLS_firstTime(!alreadyPlayed);

    const hasFirstKey: string | null = localStorage.getItem('VB_HAS_FIRST_KEY');
    if (hasFirstKey !== null) {
      setLS_hasFirstKey(hasFirstKey === '1');
    }

    const savedMindStats = localStorage.getItem('VB_MINDSTATS');
    if (savedMindStats) {
      setMindStats(JSON.parse(savedMindStats));
    }

    // Load tutorials first before any other operations
    const savedTutorials = localStorage.getItem('VB_TUTORIALS');
    console.log('Loading tutorials from localStorage:', savedTutorials);
    if (savedTutorials) {
      try {
        // Handle the case where the value might be a string of a stringified object
        let parsedTutorials = JSON.parse(savedTutorials);
        if (typeof parsedTutorials === 'string') {
          try {
            parsedTutorials = JSON.parse(parsedTutorials);
          } catch (e) {
            console.error('Error parsing nested tutorials:', e);
          }
        }
        console.log('Parsed tutorials:', parsedTutorials);
        setTutorials(parsedTutorials);
      } catch (e) {
        console.error('Error parsing tutorials:', e);
        setTutorials({});
      }
    } else {
      setTutorials({});
    }
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
    LS_firstTime,
    disableFirstTime,
    LS_hasFirstKey,
    setHasFirstKey,
    mindStats,
    updateMindStats,
    tutorials,
    updateTutorialStatus,
    hasCompletedTutorial
  };
};

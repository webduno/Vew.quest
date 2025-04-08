'use client';
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";



export function useVibeverse() {
  const [LS_playerId, setLS_playerId] = useState<string | null>(null);
  const [typedUsername, setTypedUsername] = useState("");
  const [LS_lowGraphics, setLS_lowGraphics] = useState<boolean>(false);
  const router = useRouter()
  const searchParams = useSearchParams()
  // const pathname = usePathname()

  const formatPortalUrl = (url: string) => {
    const url_username = searchParams.get("username")
    if (!url_username) { return url }

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
    console.log('toggleLowGraphics: Setting LS_lowGraphics to', newValue);
    setLS_lowGraphics(newValue);
    console.log('toggleLowGraphics: Setting localStorage VB_LEGACY_GRAPHICS to', newValue ? '1' : '0');
    localStorage.setItem('VB_LEGACY_GRAPHICS', newValue ? '1' : '0');
  };

  useEffect(() => {
    if (!localStorage) { return; }

    const playerId: string | null = localStorage.getItem('VB_PLAYER_ID');
    if (playerId) {
      setLS_playerId(playerId);
      setTypedUsername(playerId);
    }

    const legacyGraphics: string | null = localStorage.getItem('VB_LEGACY_GRAPHICS');
    console.log('useVibeverse: VB_LEGACY_GRAPHICS from localStorage is', legacyGraphics);
    if (legacyGraphics !== null) {
      console.log('useVibeverse: Setting LS_lowGraphics to', legacyGraphics === '1');
      setLS_lowGraphics(legacyGraphics === '1');
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
    toggleLowGraphics
  };
};

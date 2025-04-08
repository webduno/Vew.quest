'use client';
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";



export function useVibeverse() {
  const [LS_playerId, setLS_playerId] = useState<string | null>(null);
  const [typedUsername, setTypedUsername] = useState("");
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

  useEffect(() => {
    if (!localStorage) { return; }

    const playerId: string | null = localStorage.getItem('VB_PLAYER_ID');
    if (!playerId) { return; }
    setLS_playerId(playerId);
    setTypedUsername(playerId);
  }, []);

  return {
    LS_playerId,
    typedUsername,
    setTypedUsername,
    setPlayerId,
    sanitizePlayerId,
    formatPortalUrl
  };
};

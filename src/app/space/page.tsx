"use client"
import { useState, useEffect, useRef } from "react";

import SpaceWorldContainer from "@/dom/organ/stage/SpaceWorldContainer";
import { VewAltLogo } from "@/dom/organ/vew_tool/VewAltLogo";
import { useLSPlayerId } from "../../../script/state/hook/usePlayerStats";
import { BewWorldLogo } from "@/dom/bew/BewWorldLogo";

export default function ModelPage() {
  const [clickCounter, setClickCounter] = useState(0);
  const [wincounter, setWincounter] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(59); 
  const [timerLimit, setTimerLimit] = useState(59);
  const {LS_playerId, setPlayerId} = useLSPlayerId();
  const [randomCoord1LatLan, setRandomCoord1LatLan] = useState({lat:0,lng:0})

  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const fetchInitialClicks = async () => {
      if (!LS_playerId) return;
      
      try {
        const response = await fetch('/api/click/findOrCreate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            player_id: LS_playerId,
            isWin: false,
            attempts: 0
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setClickCounter(data.data.attempts);
          setWincounter(data.data.win);
        }
      } catch (error) {
        console.error('Error fetching initial clicks:', error);
      }
    };

    fetchInitialClicks();
  }, [LS_playerId]);

  
  const startGameProcess = () => {
    const randomCoord1LatLan = {
      lat: Math.random() * 180 - 90,
      lng: Math.random() * 360 - 180
    }
    setRandomCoord1LatLan(randomCoord1LatLan)
    setTimeRemaining(timerLimit) // Reset time remaining to current timer limit
    
    // Clear existing timer if any
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    
    // Start new timer
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Reset timer and generate new coordinates when reaching 0
          const newRandomCoord = {
            lat: Math.random() * 180 - 90,
            lng: Math.random() * 360 - 180
          }
          setRandomCoord1LatLan(newRandomCoord)
          return timerLimit // Use the current timer limit
        }
        return prev - 1
      })
    }, 1000)
  }

  return (
    <div>
      <div className="pos-abs top-0 left-0 z-100 ma-2">
      <BewWorldLogo />  
      </div>
      <div className="tx-center py-1 pos-abs top-0 right-0 z-100 tx-white">
        <div className="tx-center py-1">
        ⏲️{timeRemaining}
        </div>
        <div className="tx-center py-1">
        🖱️{clickCounter}
        </div>
        <div className="tx-center py-1">
        📍{wincounter}
        </div>
        </div>
      <SpaceWorldContainer  
        randomCoord1LatLan={randomCoord1LatLan}
        setRandomCoord1LatLan={setRandomCoord1LatLan}
        timerRef={timerRef}
        startGameProcess={startGameProcess}
        clickCounter={clickCounter}
        setClickCounter={setClickCounter}
        wincounter={wincounter}
        setWincounter={setWincounter}
        timeRemaining={timeRemaining}
        setTimerLimit={setTimerLimit}
      >
        <></>
      </SpaceWorldContainer>
    </div>
  )
}

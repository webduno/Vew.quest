"use client"
import { Box } from "@react-three/drei";
import { ReactNode, useRef, useState, useEffect } from "react";
import MiniGameStage from "./MiniGameStage";
import { useProfileSnackbar } from "@/script/state/context/useProfileSnackbar";
import ModelGameStage from "./ModelGameStage";
import { useBackgroundMusic } from "../../../../script/state/context/BackgroundMusicContext";
import JSConfetti from 'js-confetti';
import { useLSPlayerId } from "../../../../script/state/hook/usePlayerStats";

interface SpaceWorldContainerProps {
  children: ReactNode;
  clickCounter: number;
  wincounter: number;
  setClickCounter: (clickCounter: number) => void;
  setWincounter: (wincounter: number) => void;
  timeRemaining: number;
}

export default function SpaceWorldContainer({ children, clickCounter, wincounter, setClickCounter, setWincounter, timeRemaining }: SpaceWorldContainerProps) {
  const {LS_playerId} = useLSPlayerId()
  const { triggerSnackbar } = useProfileSnackbar();
  const { playSoundEffect } = useBackgroundMusic();
  const gameStageRef = useRef<"loading" | "starting" | "playing" | "ended">("loading")
  const [showHelper, setShowHelper] = useState(false)
  const [randomCoord1LatLan, setRandomCoord1LatLan] = useState({lat:0,lng:0})
  const confettiRef = useRef<JSConfetti | null>(null);
  const [attempts, setAttempts] = useState(0)
  const [winAttempts, setWinAttempts] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Generate initial target
  useEffect(() => {
    confettiRef.current = new JSConfetti();
    startGameProcess()
  }, [])

  const onGreenClicked = (e:any) => {
    setShowHelper(!showHelper)
  }

  const startGameProcess = () => {
    const randomCoord1LatLan = {
      lat: Math.random() * 180 - 90,
      lng: Math.random() * 360 - 180
    }
    setRandomCoord1LatLan(randomCoord1LatLan)
    
    // Clear existing timer if any
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    
    // Start new timer
    timerRef.current = setInterval(() => {
      if (timeRemaining <= 1) {
        clearInterval(timerRef.current!)
      }
    }, 1000)
  }

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const onTargetFound = () => {
    triggerSnackbar("Target found", "success")
    setWinAttempts(winAttempts + 1)
    startGameProcess()
    playSoundEffect("/sfx/short/myst.mp3")
    confettiRef.current?.addConfetti({
      confettiColors: ['#FDC908', '#7DDB80', '#807DDB', '#6DcB70'],
      confettiNumber: 50,
    });
    // Track win and reset attempts
    trackClick(true, attempts);
    setWincounter(wincounter + 1)
    setAttempts(0);
  }

  const changeSetAttempts = (newAttempts:number) => {
    console.log("newAttempts", newAttempts)
    playSoundEffect("/sfx/short/goodbip.wav")
    setClickCounter(clickCounter + 1)
    setAttempts(newAttempts)
    // Only track attempts when the game is ongoing
    console.log("gameStageRef.current", gameStageRef.current)
    // if (gameStageRef.current === "playing") {
      trackClick(false, newAttempts);
    // }
  }

  const trackClick = async (isWin: boolean, attempts: number) => {
    if (!LS_playerId) return;
    
    try {
      const response = await fetch('/api/click/findOrCreate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          player_id: LS_playerId,
          isWin,
          attempts: 1
        }),
      });

      if (!response.ok) {
        console.error('Failed to track click');
      }
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  }

  return (
    <ModelGameStage attempts={attempts} setAttempts={changeSetAttempts} 
    winAttempts={winAttempts} setWinAttempts={setWinAttempts}
     onGreenClicked={onGreenClicked} gameStageRef={gameStageRef}
    onTargetFound={onTargetFound}
    gameData={{
      randomCoord1LatLan,
      showHelper,
      timeRemaining
    }}
    >
      <>
        {/* <ambientLight intensity={0.5} />
        <spotLight position={[2,2,2]} intensity={10} castShadow />

        <group position={[0,-1.15,0]}>  
          <Box receiveShadow args={[50,.1,50]}> 
            <meshStandardMaterial color="#ffffff" emissive={"#777777"} /> 
          </Box>
        </group> */}

        {children}
      </>
    </ModelGameStage>
  );
} 
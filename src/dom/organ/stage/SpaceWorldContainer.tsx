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
  startGameProcess: () => void;
  timerRef: React.MutableRefObject<NodeJS.Timeout | null>;
  randomCoord1LatLan: {lat:number,lng:number};
  setRandomCoord1LatLan: (randomCoord1LatLan: {lat:number,lng:number}) => void;
  setTimerLimit: (timerLimit: number) => void;
}

export default function SpaceWorldContainer({ 
  startGameProcess, timerRef, randomCoord1LatLan, setRandomCoord1LatLan,
  children, clickCounter, wincounter, setClickCounter, setWincounter, timeRemaining, setTimerLimit }: SpaceWorldContainerProps) {
  const {LS_playerId} = useLSPlayerId()
  const { triggerSnackbar } = useProfileSnackbar();
  const { playSoundEffect } = useBackgroundMusic();
  const gameStageRef = useRef<"loading" | "starting" | "playing" | "ended">("loading")
  const [showHelper, setShowHelper] = useState(false)
  const confettiRef = useRef<JSConfetti | null>(null);
  const [attempts, setAttempts] = useState(0)
  // const [winAttempts, setWinAttempts] = useState(0)

  // Generate initial target
  useEffect(() => {
    confettiRef.current = new JSConfetti();
    startGameProcess()
  }, [])

  const onGreenClicked = (e:any) => {
    setShowHelper(!showHelper)
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
    // setWinAttempts(winAttempts + 1)
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
    // Set new timer limit when target is found
    setTimerLimit(59); // Reset to 10 seconds when target is found
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
    winAttempts={wincounter} setWinAttempts={setWincounter}
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
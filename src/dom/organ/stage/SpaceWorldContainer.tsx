"use client"
import { Box } from "@react-three/drei";
import { ReactNode, useRef, useState, useEffect } from "react";
import MiniGameStage from "./MiniGameStage";
import { useProfileSnackbar } from "@/script/state/context/useProfileSnackbar";
import ModelGameStage from "./ModelGameStage";
import { useBackgroundMusic } from "../../../../script/state/context/BackgroundMusicContext";
import JSConfetti from 'js-confetti';

interface SpaceWorldContainerProps {
  children: ReactNode;
}

export default function SpaceWorldContainer({ children }: SpaceWorldContainerProps) {
  const { triggerSnackbar } = useProfileSnackbar();
  const { playSoundEffect } = useBackgroundMusic();
  const gameStageRef = useRef<"loading" | "starting" | "playing" | "ended">("loading")
  const [showHelper, setShowHelper] = useState(false)
  const [randomCoord1LatLan, setRandomCoord1LatLan] = useState({lat:0,lng:0})
  const confettiRef = useRef<JSConfetti | null>(null);

  // Generate initial target
  useEffect(() => {
    confettiRef.current = new JSConfetti();
    startGameProcess()
  }, [])

  const onGreenClicked = (e:any) => {
    setShowHelper(!showHelper)
  }

  const [attempts, setAttempts] = useState(0)
  const [winAttempts, setWinAttempts] = useState(0)
  const startGameProcess = () => {
    const randomCoord1LatLan = {
      lat: Math.random() * 180 - 90,
      lng: Math.random() * 360 - 180
    }
    setRandomCoord1LatLan(randomCoord1LatLan)
  }

  const onTargetFound = () => {
    console.log("Target found")
    triggerSnackbar("Target found", "success")
    setWinAttempts(winAttempts + 1)
    startGameProcess()
    playSoundEffect("/sfx/short/myst.mp3")
    confettiRef.current?.addConfetti({
      confettiColors: ['#FDC908', '#7DDB80', '#807DDB', '#6DcB70'],
      confettiNumber: 50,
    });
  }
  const changeSetAttempts = (attempts:number) => {
    playSoundEffect("/sfx/short/goodbip.wav")
    setAttempts(attempts)
  }
  return (
    <ModelGameStage attempts={attempts} setAttempts={changeSetAttempts} winAttempts={winAttempts} setWinAttempts={setWinAttempts} onGreenClicked={onGreenClicked} gameStageRef={gameStageRef}
    onTargetFound={onTargetFound}
    gameData={{
      randomCoord1LatLan,
      showHelper
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
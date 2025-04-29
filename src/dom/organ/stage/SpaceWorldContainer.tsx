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
  confettiRef: React.MutableRefObject<JSConfetti | null>;
  trackClick: (isWin: boolean) => void;
  showHelper: boolean;
  setShowHelper: (showHelper: boolean) => void;
  loadingWin: boolean;
  lastClickedCoords: {lat: number, lng: number} | null;
  setLastClickedCoords: (lastClickedCoords: {lat: number, lng: number} | null) => void;
  isVfxHappening: boolean;
  setIsVfxHappening: (isVfxHappening: boolean) => void;
  inventory: any;
  setShowShopModal: (showshop: boolean) => void;
}

export default function SpaceWorldContainer({
  setShowShopModal,
  inventory,
  isVfxHappening, setIsVfxHappening,
  lastClickedCoords, setLastClickedCoords,
  startGameProcess, timerRef, randomCoord1LatLan, setRandomCoord1LatLan, trackClick,
  showHelper, setShowHelper,
  children, clickCounter, wincounter, setClickCounter, setWincounter, timeRemaining, 
  setTimerLimit, confettiRef, loadingWin }: SpaceWorldContainerProps) {
  const {LS_playerId} = useLSPlayerId()
  const { triggerSnackbar } = useProfileSnackbar();
  const { playSoundEffect } = useBackgroundMusic();
  const gameStageRef = useRef<"loading" | "starting" | "playing" | "ended">("loading")
  const [attempts, setAttempts] = useState(0)
  // const [winAttempts, setWinAttempts] = useState(0)

  // Generate initial target
  useEffect(() => {
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
    // setWinAttempts(winAttempts + 1)
    startGameProcess()
    triggerSnackbar(<div className="tx-center noselect noclick flex-col tx-shadow-5">
      <div className="">{"High Energy Target "}</div>
      {/* red pin emoji */}
        <div className="">{"found, new Pin 📍 added"}</div>
    </div>, "success")
    
  
    const chosensfx =  ["conff", "clapp", "cheer"][Math.floor(Math.random()*3)]
    // const chosensfx =  ["conff", "clapp", "children"][Math.floor(Math.random()*3)]
    playSoundEffect(`/sfx/short/${chosensfx}.mp3`)
    confettiRef.current?.addConfetti({
      confettiColors: ['#B7E999', '#139724', '#ffffff', '#00ff00'],
      confettiNumber: 5,
    });
    // Track win and reset attempts
    trackClick(true);
    
    setWincounter(wincounter + 1)
    setAttempts(1);
    setShowHelper(false)
    // Set new timer limit when target is found
    setTimerLimit(59); // Reset to 10 seconds when target is found

    // setTimeout(() => {
    //   triggerSnackbar(<div className="tx-center flex-col tx-shadow-5">
    //     <div>{"Loading new target..."}</div>
    //   </div>, "handbook")

    // }, 3000);
  }

  const changeSetAttempts = (newAttempts:number) => {
    setClickCounter(clickCounter + 1)
    setAttempts(newAttempts)
    trackClick(false);
  }


  return (
    <ModelGameStage
    setShowShopModal={setShowShopModal}
    inventory={inventory}
    isVfxHappening={isVfxHappening}
    setIsVfxHappening={setIsVfxHappening}
    lastClickedCoords={lastClickedCoords}
    setLastClickedCoords={setLastClickedCoords}
      setShowHelper={setShowHelper} attempts={attempts} setAttempts={changeSetAttempts} 
    winAttempts={wincounter} setWinAttempts={setWincounter}
     onGreenClicked={onGreenClicked} gameStageRef={gameStageRef}
    onTargetFound={onTargetFound}
    gameData={{
      randomCoord1LatLan,
      showHelper,
      timeRemaining,
      loadingWin
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
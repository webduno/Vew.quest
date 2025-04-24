"use client"
import { Box } from "@react-three/drei";
import { ReactNode, useRef, useState } from "react";
import MiniGameStage from "./MiniGameStage";
import { useProfileSnackbar } from "@/script/state/context/useProfileSnackbar";
import ModelGameStage from "./ModelGameStage";
interface SpaceWorldContainerProps {
  children: ReactNode;
}

export default function SpaceWorldContainer({ children }: SpaceWorldContainerProps) {
  const { triggerSnackbar } = useProfileSnackbar();
  const gameStageRef = useRef<"loading" | "starting" | "playing" | "ended">("loading")
  const onGreenClicked = (e:any) => {
    // console.log("Green clicked");
    triggerSnackbar("Session started!", "success");
    gameStageRef.current = "starting"
    startGameProcess()
  }
  const [randomCoord1LatLan, setRandomCoord1LatLan] = useState({lat:0,lng:0})
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
    // gameStageRef.current = "playing"
    startGameProcess()
  }
  return (
    <ModelGameStage onGreenClicked={onGreenClicked} gameStageRef={gameStageRef}
    onTargetFound={onTargetFound}
    gameData={{
      randomCoord1LatLan
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
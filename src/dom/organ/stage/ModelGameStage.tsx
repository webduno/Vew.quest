"use client"
import { Box, Cylinder, OrbitControls, Sphere, Text } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { ReactNode, useEffect, useState } from "react"
import { useMediaQuery } from "usehooks-ts"
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import WormHoleModel from "@/model/parts/WormHoleModel";
import { Fog } from "three";
// import { LoadingFullScreen } from "@/model/tools/LoadingFullScreen";
import TiltShiftEffects from "@/model/tools/tiltshift";
import { WorldModelTextured } from "@/model/level/WorldModelTextured";
import { useProfileSnackbar } from "@/script/state/context/useProfileSnackbar";
import { ComputerModel } from "@/model/core/ComputerModel";

const latLngToCartesian = (lat: number, lng: number, radius: number = 1) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return {
    x: -(radius * Math.sin(phi) * Math.cos(theta)),
    y: radius * Math.cos(phi),
    z: radius * Math.sin(phi) * Math.sin(theta)
  };
};

export default function ModelGameStage({ attempts, setAttempts, winAttempts, setWinAttempts, onGreenClicked,children,gameStageRef,gameData,onTargetFound}:{
  attempts:number,
  setAttempts:(attempts:number)=>void,
  winAttempts:number,
  setWinAttempts:(winAttempts:number)=>void,
  onGreenClicked:(e:any)=>void,
  children:ReactNode,
  gameStageRef:React.MutableRefObject<"loading" | "starting" | "playing" | "ended">,
  gameData:any,
  onTargetFound:()=>void
}) {
  const { triggerSnackbar } = useProfileSnackbar();
  const {randomCoord1LatLan, showHelper} = gameData
  const searchParams = useSearchParams()
  const isDOF = searchParams.has('dof')
  const noAutoRotate = searchParams.has('norotate') || false
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const [mounted, s__Mounted] = useState(false);
  const [lastClickedCoords, setLastClickedCoords] = useState<{lat: number, lng: number} | null>(null);
  useEffect(() => {
    s__Mounted(true);
  }, []);

  const clickedHandler = (coordsLatLan:any) => {
    console.log("Clicked coordinates:", coordsLatLan)
    setLastClickedCoords(coordsLatLan);
    setAttempts(attempts + 1)
  }
  
  // const old_clickedHandler = (coordsLatLan:any) => {
  //   console.log("Clicked coordinates:", coordsLatLan)
  //   console.log("Target coordinates:", randomCoord1LatLan)
  //   const distance = Math.sqrt(Math.pow(coordsLatLan.lat - randomCoord1LatLan.lat, 2) + Math.pow(coordsLatLan.lng - randomCoord1LatLan.lng, 2))
  //   console.log("Distance:", distance)
  //   if (distance < 10) {
  //     onTargetFound()
  //     return
  //   }
  // }
  useEffect(() => {
    if (gameStageRef.current === "starting") {
      
    }
  }, [gameStageRef.current]);

  
  if (!mounted) return <>LoadingFullScreen </>;

  return (
    <div className="flex-col tx-altfont-4  ">
      <Canvas style={{width:"100vw",height:"100vh"}} shadows 
        camera={{fov:50,position:[isSmallDevice?8:6,1,0]}}
        gl={{ preserveDrawingBuffer: true, }}
        onCreated={(state)=>{ state.gl.setClearColor("#101319"); state.scene.fog = new Fog("#101319",16,32) }}
      >
        <OrbitControls
         rotateSpeed={1.75}
          autoRotateSpeed={.25} autoRotate={!noAutoRotate} 
          dampingFactor={.1} maxPolarAngle={1.75}
           minPolarAngle={1.025}
        />
        {isDOF && <TiltShiftEffects />}
        <WorldModelTextured 
          onGreenClicked={onGreenClicked}
          clickedHandler={clickedHandler}
          targetCoords={randomCoord1LatLan}
          onTargetFound={onTargetFound}
          showHelper={showHelper}
          lastClickedCoords={lastClickedCoords}
        />
        <ambientLight intensity={0.02} />
        <pointLight position={[2,2,2]} />
        <pointLight position={[-1,1,-3]} intensity={0.05} />
        {children}
        <group rotation={[0,0,0]}>
          <group position={[0,0,0]} >
          <group position={[0,2,0]}  scale={[.7,.5,.7]} onClick={(e:any)=>{
            onGreenClicked(e)
          }}>
          <Cylinder args={[0,0.5,1,4]}  position={[0,0.54,0]} >
            <meshStandardMaterial color={showHelper ? "#ff9999" : "#aaffaa"} side={1} />
          </Cylinder>
          <Cylinder args={[.5,0,1,4]}  position={[0,-.54,0]} >
            <meshStandardMaterial color={showHelper ? "#ff9999" : "#aaffaa"} />
          </Cylinder>

          </group>    
          {attempts > 0 && (
            <Text fontSize={0.3} color="#ff4400"  position={[0,2.2,0]}>
              {attempts}
            </Text>
          )}
          <group position={[0.1,0,-2]}>
            <Box args={[1.1 ,.08,.6]} position={[0,-0.55,-0.2]}>
              <meshStandardMaterial color={"#ddbb99"} />
            </Box>
          {winAttempts > 0 && (
            <Text fontSize={0.2} color="#44ff00"  position={[-0.09,-.08,-0.02]}>
              {winAttempts}
            </Text>
          )}
            <ComputerModel state={{}} tokensArrayArray={[]} />
          </group>
          <group position={[0,-3, 0]} > <WormHoleModel /> </group>
          </group>    
        </group>
      </Canvas>
    </div>
  )
}

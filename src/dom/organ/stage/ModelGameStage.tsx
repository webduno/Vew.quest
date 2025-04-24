"use client"
import { Box, Cylinder, OrbitControls, Sphere } from "@react-three/drei";
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

const latLngToCartesian = (lat: number, lng: number, radius: number = 1) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return {
    x: -(radius * Math.sin(phi) * Math.cos(theta)),
    y: radius * Math.cos(phi),
    z: radius * Math.sin(phi) * Math.sin(theta)
  };
};

export default function ModelGameStage({onGreenClicked,children,gameStageRef,gameData,onTargetFound}:{onGreenClicked:(e:any)=>void,children:ReactNode,gameStageRef:React.MutableRefObject<"loading" | "starting" | "playing" | "ended">,gameData:any,onTargetFound:()=>void    }) {
  const { triggerSnackbar } = useProfileSnackbar();
  const {randomCoord1LatLan} = gameData
  const searchParams = useSearchParams()
  const isDOF = searchParams.has('dof')
  const noAutoRotate = searchParams.has('norotate') || false
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const [mounted, s__Mounted] = useState(false);
  useEffect(() => {
    s__Mounted(true);
  }, []);

  const clickedHandler = (coordsLatLan:any) => {
    console.log(coordsLatLan)
    // alert("clicked")
    // consloe log how ner it was from the randomCoord1LatLan
    const distance = Math.sqrt(Math.pow(coordsLatLan.lat - randomCoord1LatLan.lat, 2) + Math.pow(coordsLatLan.lng - randomCoord1LatLan.lng, 2))
    console.log(distance)
    // if distance is less than 10, then show a message
    if (distance < 10) {
      // triggerSnackbar("You are close to the target", "success")
    // generate new randomCoord1LatLan thru parent props
    onTargetFound()
      return
    }
    // onTargetFound()
  }
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
          targetCoords={gameStageRef.current === "starting" ? randomCoord1LatLan : null}
          onTargetFound={onTargetFound}
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
            <meshStandardMaterial color={gameStageRef.current === "starting" ? "#ff9999" : "#aaffaa"} side={1} />
          </Cylinder>
          <Cylinder args={[.5,0,1,4]}  position={[0,-.54,0]} >
            <meshStandardMaterial color={gameStageRef.current === "starting" ? "#ff9999" : "#aaffaa"} />
          </Cylinder>
          </group>    
          <group position={[0,-3, 0]} > <WormHoleModel /> </group>
          </group>    
        </group>
      </Canvas>
    </div>
  )
}

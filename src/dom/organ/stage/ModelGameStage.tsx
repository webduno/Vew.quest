"use client"
import { Box, Cylinder, OrbitControls, Plane, Sphere, Text } from "@react-three/drei";
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
import { useBackgroundMusic } from "../../../../script/state/context/BackgroundMusicContext";

const latLngToCartesian = (lat: number, lng: number, radius: number = 1) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return {
    x: -(radius * Math.sin(phi) * Math.cos(theta)),
    y: radius * Math.cos(phi),
    z: radius * Math.sin(phi) * Math.sin(theta)
  };
};

export default function ModelGameStage({ 
  isVfxHappening, setIsVfxHappening,
  lastClickedCoords, setLastClickedCoords,
  setShowHelper,
   attempts,
   setAttempts,
   winAttempts,
   setWinAttempts,
   onGreenClicked,
  children,
  gameStageRef,gameData,onTargetFound}:{
  isVfxHappening:boolean,
  setIsVfxHappening:(isVfxHappening:boolean)=>void,
  lastClickedCoords:any,
  setLastClickedCoords:any,
  setShowHelper:(showHelper:boolean)=>void,
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
  const [hasClickedOnTarget, setHasClickedOnTarget] = useState(false);
  useEffect(() => {
    s__Mounted(true);
  }, []);
const {playSoundEffect} = useBackgroundMusic()
  const clickedHandler = (coordsLatLan:any) => {
    console.log("Clicked coordinates:", coordsLatLan, attempts)
    setLastClickedCoords(coordsLatLan);
    setAttempts(attempts + 1);
    if (!!hasClickedOnTarget){ 
      return
     } else {
      triggerSnackbar(<div className="tx-center flex-col">
        <div className="">{"A random coordinate has been set!"}</div>
        <div className="">{"Find it! "}</div>
      </div>, "success")
     }
    setHasClickedOnTarget(true);
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

  
  if (!mounted) return <> </>;

  return (
    <div className="flex-col tx-altfont-4  ">
      <div className="flex-col pos-fix bottom-0 z-100 px-8 my-8 py-2 gap-2 noclick noselect">
        {!hasClickedOnTarget && (<>
          <div className="flex-col bg-white px-8 tx-sm bord-r-15 py-2 noclick noselect "
          style={{color:"#007700",background:"#d0ffd0",borderBottom:"4px solid #70af70"}}
          >
            <div className="flex-row gap-1">Click the green <div style={{transform:"rotate(45deg)"}}>🟩</div></div>
            
            <div>to toggle the helper</div>
          </div>
          <div className="flex-col bg-white gap-1 px-8  bord-r-15 py-3 noclick noselect "
          style={{color:"#afafaf"}}
          >
            <div>Click the globe to</div>
            <div>start guessing</div>
          </div>
          </>)}
          </div>
          <div className="flex-col pos-fix top-0 z-100  mt-4  gap-2 noclick noselect">
          {attempts > 0 && lastClickedCoords && (<>
      <div className="flex-row bg-white gap-2 px-2  bord-r-15 py-1">
        <div className="tx-center tx-sm">Last <br /> Coords</div>
        <div className="flex-col flex-align-start">

        <div>{(lastClickedCoords?.lat || 0).toFixed(1)}°</div>
        <div>{(lastClickedCoords?.lng || 0).toFixed(1)}°</div>

        </div>
      </div>
      </>)}
      </div>
      <Canvas style={{width:"100vw",height:"100vh"}} shadows 
        camera={{fov:50,position:[isSmallDevice?8:6,1,0]}}
        // gl={{ preserveDrawingBuffer: true, }}
        onCreated={(state)=>{ state.gl.setClearColor("#cccccc"); state.scene.fog = new Fog("#cccccc",16,32) }}
      >
        
        <Plane args={[100,100]} position={[0,-2.4,0]} rotation={[-Math.PI/2,0,0]} 
            receiveShadow>
              <meshStandardMaterial emissive={"#777777"}  color={"#777777"} />
            </Plane>
        <OrbitControls
         rotateSpeed={1.75}
          autoRotateSpeed={.25} autoRotate={!noAutoRotate} 
          dampingFactor={.1} maxPolarAngle={1.8}
          maxDistance={10}
           minPolarAngle={1.025}
           enablePan={false}
        />
        {/* {isDOF && <TiltShiftEffects />} */}
        <WorldModelTextured 
          isVfxHappening={isVfxHappening}
          setIsVfxHappening={setIsVfxHappening}
          state={ {loadingWin:gameData.loadingWin}}
          setShowHelper={setShowHelper}
          onGreenClicked={onGreenClicked}
          clickedHandler={clickedHandler}
          targetCoords={randomCoord1LatLan}
          onTargetFound={(e:any)=>{
            onTargetFound()
            setLastClickedCoords(null)
          }}
          showHelper={showHelper}
          lastClickedCoords={lastClickedCoords}
        />
    <ambientLight intensity={0.85} />
    {/* <ambientLight intensity={0.02} /> */}
        <pointLight position={[2,2,2]} />
        <pointLight position={[-1,1,-3]} intensity={0.05} />
        {children}
        <group rotation={[0,0,0]}>
          <group position={[0,0,0]} >
          <group position={[0,1.5,0]}  scale={[.5,.3,.5]} onClick={(e:any)=>{
            onGreenClicked(e)
          }}>
          <Cylinder args={[0,0.3,.75,4]}  position={[0,0.45,0]} >
            <meshStandardMaterial color={showHelper ? "#aa9999" : "#55aa55"} side={1} />
          </Cylinder>
          <Cylinder args={[.3,0,.75,4]}  position={[0,-.45,0]} >
            <meshStandardMaterial color={showHelper ? "#aa9999" : "#55ff55"} />
          </Cylinder>

          </group>    


          









          
          {hasClickedOnTarget && (<>


          
          <group position={[0,-.5,0]} rotation={[0,Math.PI/2,0]}>
          {attempts > 0 && (
            <Text fontSize={0.07} color="#ff4400"  
            position={[0,-1.02,-0.02]}
            // position={[0,0,-1]}
            // position={[0,2.2,0]}
            >
              Try #{attempts}
            </Text>
          )}
          <group position={[0.1,-1,0]}>

          {/* table top */}
            <Box args={[1.1 ,.08,.6]} position={[-0.1,-0.55,-0.2]} receiveShadow>
              <meshStandardMaterial color={"#ddbb99"} />
            </Box>
            {/* Table legs */}
            <Box args={[.05,.4,.05]} position={[-0.6,-0.75,-0.4]} receiveShadow>
              <meshStandardMaterial color={"#aa8866"} />
            </Box>
            <Box args={[.05,.4,.05]} position={[0.4,-0.75,-0.4]} receiveShadow>
              <meshStandardMaterial color={"#aa8866"} />
            </Box>
            <Box args={[.05,.4,.05]} position={[-0.6,-0.75,0]} receiveShadow>
              <meshStandardMaterial color={"#aa8866"} />
            </Box>
            <Box args={[.05,.4,.05]} position={[0.4,-0.75,0]} receiveShadow>
              <meshStandardMaterial color={"#aa8866"} />
            </Box>
            
          {winAttempts > 0 && (
            <Text fontSize={0.11} color="#44ff00"  position={[-0.1,-.13,-0.02]}>
              W:{winAttempts}
            </Text>
          )}
            <ComputerModel onClick={()=>{
              if (winAttempts < 10){
                playSoundEffect("/sfx/short/errorbip.mp3")
                triggerSnackbar(<div className="tx-center flex-col">
                  <div className="">{"You need to find 10 a"}</div>
                  <div className="">{"min of 10 targets to"}</div>
                  <div className="">{"open the shop"}</div>
                </div>, "error")
                return
              }
              
              triggerSnackbar(<div className="tx-center flex-col">
                <div className="">{"You have "}</div>
                <div className="">{""+winAttempts + " vew chips"}</div>
              </div>, "success")
            }} state={{}} tokensArrayArray={[]} />






            <Box args={[1.41 ,.2,.03]} position={[-0.1,.25,-.2]}>
              
        <meshStandardMaterial color={"#aa8866"} />
      </Box>
          </group>

          <group position={[0,.25,-.2]}>
      {lastClickedCoords && (<>
        <Text fontSize={0.1} color="#ffffff"  position={[
        0,-1,0.02
      ]}>
        {`${randomCoord1LatLan.lat - lastClickedCoords.lat > 0 ? "☝️" : "👇"}Look further ${randomCoord1LatLan.lat - lastClickedCoords.lat > 0 ? "North☝️" : "South👇"}`}
        {/* {`Lat: ${lastClickedCoords.lat.toFixed(1)}° (distance ~${(randomCoord1LatLan.lat - lastClickedCoords.lat).toFixed(1)}°)`} */}
      </Text>
      <Text 
      rotation={[0,Math.PI,0]}
      fontSize={0.1} color="#ffffff"  position={[
        0,-1,-0.02
      ]}>
        {`${randomCoord1LatLan.lat - lastClickedCoords.lat > 0 ? "☝️" : "👇"}Look further ${randomCoord1LatLan.lat - lastClickedCoords.lat > 0 ? "North☝️" : "South👇"}`}
        {/* {`Look further ${randomCoord1LatLan.lng - lastClickedCoords.lng > 0 ? "East" : "West"}`} */}
        {/* {`Lng: ${lastClickedCoords.lng.toFixed(1)}° (distance ~${(randomCoord1LatLan.lng - lastClickedCoords.lng).toFixed(1)}°)`} */}
      </Text>

      </>)}

    </group>
    </group>



    </>)}



      




          {/* <group position={[0,-3, 0]} > <WormHoleModel /> </group> */}
          </group>    
        </group>
      </Canvas>
    </div>
  )
}

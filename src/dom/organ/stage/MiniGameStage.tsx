"use client"
import { Box, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { ReactNode, useEffect, useRef, useState } from "react"
import { useMediaQuery } from "usehooks-ts"
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import WormHoleModel from "@/model/parts/WormHoleModel";
import { Fog } from "three";
import The3DPong from "@/model/npc/The3DPong";
// import { LoadingFullScreen } from "@/model/tools/LoadingFullScreen";


export default function MiniGameStage({onGreenClicked,children}:{onGreenClicked:()=>void,children:ReactNode}) {
  const searchParams = useSearchParams()
  const noAutoRotate = searchParams.has('norotate') || false
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const screenSizeRelativeZoomDistance = isSmallDevice?5:2.5
  const [mounted, s__Mounted] = useState(false);
  const $pongGame:any = useRef()
  const onGameEnd = (val:number)=>{
    if (!$pongGame.current) {return}
    alert(`You've reached +${val} points \n Max Score: ${$pongGame.current.maxScore}`)
  }

  useEffect(() => {
      s__Mounted(true);
  }, []);

  if (!mounted) return <>Full Screen Loading</>;

  return (
    <div className="flex-col tx-altfont-4  ">
      
      <Canvas style={{width:"100vw",height:"100vh"}} shadows 
        camera={{fov:50,position:[screenSizeRelativeZoomDistance,1,0]}}
        gl={{ preserveDrawingBuffer: true, }}
        onCreated={(state)=>{ state.gl.setClearColor("#ffffff"); state.scene.fog = new Fog("#ffffff",4,8) }}
      >
        <OrbitControls rotateSpeed={0.1} autoRotateSpeed={.15} autoRotate={!noAutoRotate} dampingFactor={.2} 
            minAzimuthAngle={Math.PI*2}
            maxAzimuthAngle={Math.PI*2}
            minPolarAngle={0.5}
            maxPolarAngle={1.75}
        />
        <ambientLight intensity={0.02} />
        <pointLight position={[2,2,2]} />

        {children}
        
        <group position={[0,0,-2]}>
            <The3DPong ref={$pongGame} calls={{endGame:onGameEnd}}  />
        </group>
      </Canvas>
    </div>
  )
}

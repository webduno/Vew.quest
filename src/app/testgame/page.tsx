"use client"
import MiniGameStage from "../../dom/organ/stage/MiniGameStage";
import { Box } from "@react-three/drei";

export default function Home() {
  

  return (
    <main className="mainbackground ma-0 pa-0"
    style={{
      backgroundColor: "#ffffff"
    }}
     >
      <MiniGameStage>
        <>
        <ambientLight intensity={0.5} />
        <spotLight position={[2,2,2]} intensity={10} castShadow />

        <group position={[0,-1.15,0]}>  
          <Box receiveShadow args={[50,.1,50]}> 
            <meshStandardMaterial color="#ffffff" emissive={"#777777"} /> 
          </Box>
        </group>
        </>
      </MiniGameStage>
    </main>
  )
}

"use client"
// import BasicFidgetGameStage from "@/dom/organ/stage/BasicFidgetGameStage";
import { WorldModelTextured } from "@/model/level/WorldModelTextured";
import SpaceWorldContainer from "@/dom/organ/stage/SpaceWorldContainer";
import { VewAltLogo } from "@/dom/organ/vew_tool/VewAltLogo";
import { BewLogo } from "@/dom/atom/logo/BewLogo";
import { BewWorldLogo } from "@/dom/bew/BewWorldLogo";


export default function ModelPage() {
  

  return (
    <main className="mainbackground ma-0 pa-0">

      
<div className="pos-abs top-0 left-0  block flex-col pa-4"
      style={{
          filter: "brightness(3.5) hue-rotate(-140deg)",
        zIndex: 10000
      }}
      >
      <VewAltLogo />
      {/* <BewLogo /> */}
      {/* <BewWorldLogo /> */}
      </div>
<SpaceWorldContainer>
        <>
        </>
        </SpaceWorldContainer>
        
      {/* <ModelGameStage>
        <>
        <WorldModelTextured />
        </>

      </ModelGameStage> */}
      {/* <BasicFidgetGameStage>
        <></>
      </BasicFidgetGameStage> */}
    </main>
  )
}

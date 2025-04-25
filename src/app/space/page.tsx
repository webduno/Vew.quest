"use client"
import { useState, useEffect } from "react";

import SpaceWorldContainer from "@/dom/organ/stage/SpaceWorldContainer";
import { VewAltLogo } from "@/dom/organ/vew_tool/VewAltLogo";
import { useLSPlayerId } from "../../../script/state/hook/usePlayerStats";


export default function ModelPage() {
  const [clickCounter, setClickCounter] = useState(0);
  const [wincounter, setWincounter] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(10); 

  return (
    <div>
      <SpaceWorldContainer
        clickCounter={clickCounter}
        setClickCounter={setClickCounter}
        wincounter={wincounter}
        setWincounter={setWincounter}
        timeRemaining={timeRemaining}
      >
        <></>
      </SpaceWorldContainer>
    </div>
  )
}

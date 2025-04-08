'use client'
import { BewMenuButton } from "@/model/bew/BewMenuButton"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useVibeverse } from "./useVibeverse"

export const LandingMainMenu = () => {

  const { LS_playerId, typedUsername, setTypedUsername, setPlayerId,
     sanitizePlayerId, LS_lowGraphics, toggleLowGraphics } = useVibeverse()
  console.log('LandingMainMenu: LS_lowGraphics from useVibeverse is', LS_lowGraphics);
  const [enterUsername, setEnterUsername] = useState(false)
  const [isGameLoading, setGameLoading] = useState(false)

  const router = useRouter()
  const triggerNewGame = () => {
    setGameLoading(true)
    setPlayerId(sanitizePlayerId(typedUsername))
    router.push("/game?username=" + typedUsername)
  }


  return (<>
  <div className='pos-abs bottom-0 pb-100 w-100 flex-col flex-align-start'
    style={{
      background: "linear-gradient(0deg, #1E1B14, #00000000)",

    }}
    >
      <div className='pa-4 flex-col pos-rel tuto-paper'>
        <div style={{filter: "blur(10px)"}}
          className='pa-7 bg-b-90 pos-abs'></div>

        <div className='px-2 pt-2 pb-1 z-100'
        style={{
          transform: "rotate(-8deg)",
          clipPath: "polygon(50% 0%, 100% 0, 98% 60%, 100% 97%, 4% 100%, 0% 60%, 2% 3%)",
          background: "linear-gradient(0deg, #706C61, #8F8B7D, #605C51)",
        }}
        >
          <div className='tx-altfont-8 tx-lgx'>Tutorial</div>
          <div className='tx-xxs tx-altfont-6' style={{filter: "saturate(0)"}}>
            <div className='opaci- 0'>UNCLASSIFIED - Stargate#1A</div>
            <div className='opaci-50 tx-altfont-9'> (SRI) Ingoo swan</div>
            <div style={{paddingTop:"1px"}} className='w-40 opaci-50 bg-b-90 mb-1'/>
            <div>〽🌀 Mconeagle</div>
            <div className='opaci-80 tx-altfont-8' style={{transform: "rotate(-5deg)"}}>- puthoff ufo-lockheed</div>
            <div>-</div>
            <div>- mars 1m y BCE</div>
          </div>
        </div>


      </div>
      <div className="tx-white tx-lg tx-altfont-1  flex-col flex-align-start"
      style={{
        background: "linear-gradient(90deg, #171310, #00000000 50%)",
        transform: "translateX(-10px)",
      }}
      >
        <div onClick={() => {
          setEnterUsername(true)
        }}
        style={{
          color: "#111111",
        }} className="pointer " data-href="/game">
        <BewMenuButton><div style={{borderBottom: "1px solid #111111"}}>New Game</div></BewMenuButton></div>
        {enterUsername && <div className="pa-2 flex-col gap-1 pointer  w-150px">
          <input type="text" placeholder="Username" autoFocus
           className="w-100px tx-center pa-1 bord-r-5"
           onKeyDown={(e) => {
            if (e.key === "Enter") {
              triggerNewGame()
            }
          }}
          style={{ background:"#494644", color: "#ccbbaa" }} value={typedUsername}
          onChange={(e) => { setTypedUsername(sanitizePlayerId(e.target.value)) }} />
          <BewMenuButton onClick={() => { triggerNewGame() }}
            classOverride="tx-altfont-5">
            {isGameLoading ? "Wait..." : "ENTER"}
          </BewMenuButton>
        </div>}
        <Link 
        style={{
          color: "#222222",
        }}
        className=" nodeco" href="/practice">
        <BewMenuButton>Practice</BewMenuButton></Link>
        <Link
        style={{
          color: "#333333",
        }}
          className=" nodeco" href="/about">
        <BewMenuButton>About</BewMenuButton></Link>
      </div>
<div className="pt-2 pl-2">
  
    <div className="  flex-row  bord-r-5" style={{ background: "#262320",}}>
      <input id="vb_legacy_graphics"
      className="pointer ml-2"
        style={{transform: "scale(1.5)", filter: "invert(1)"}} 
        type="checkbox" 
        checked={LS_lowGraphics}
        onChange={toggleLowGraphics}
      />
      <label
       htmlFor="vb_legacy_graphics"
       className="tx-white opaci-50 pa-2 pointer">Low Graphics</label>
      </div>
</div>
    </div>
  </>)
}




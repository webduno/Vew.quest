'use client'
import { BewMenuButton } from "@/model/bew/BewMenuButton"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useVibeverse } from "./useVibeverse"

export const LandingMainMenu = () => {

  const { LS_playerId, typedUsername, setTypedUsername, setPlayerId,
     sanitizePlayerId, LS_lowGraphics, toggleLowGraphics } = useVibeverse()
  const [enterUsername, setEnterUsername] = useState(false)
  const [isGameLoading, setGameLoading] = useState(false)
const random10CharString = () => {
  return Math.random().toString(36).substring(2, 15) 
}

  const router = useRouter()
  const triggerNewGame = () => {
    localStorage.removeItem('VB_HAS_FIRST_KEY')

    setGameLoading(true)

    const pre_thePlayerId = !typedUsername ? random10CharString() : sanitizePlayerId(typedUsername)
    setPlayerId(pre_thePlayerId)
    router.push("/game?username=" + pre_thePlayerId)
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


{!isGameLoading && <>
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
        </>}





      </div>
      <div className="tx-white tx-lg tx-altfont-1  flex-col flex-align-start"
      style={{
        background: "linear-gradient(90deg, #171310, #00000000 50%)",
        transform: "translateX(-10px)",
      }}
      >
      {!!LS_playerId && !isGameLoading && (
        <Link 
      style={{
        color: "#cc8822",
        textShadow: "0 0 10px #996622, 1px 1px 0 #000000",
      }}
      className="ma-2 tx-altfont-5  translate-x-25 nodeco" href="/game">
      <BewMenuButton classOverride="hover-jump">Continue</BewMenuButton></Link>)}
      {!isGameLoading && !enterUsername &&

        <div onClick={() => {
          setEnterUsername(true)
        }}
        style={{
          color: "#111111",
        }} className="pointer " data-href="/game">

        <BewMenuButton><div style={{borderBottom: "1px solid #111111"}}>→ New Game</div></BewMenuButton></div>


      }



      
        {enterUsername && <div className="pa- 2 pl-0 flex-row-r gap-3 pointer  ">
          {!isGameLoading && <>
          {/* <label className="tx-altfont-1 tx-md tx-black">Username</label> */}
          <input type="text" placeholder="Username" autoFocus
           className="w-100px tx-center pa-1 bord-r-5"
           onKeyDown={(e) => {
            if (e.key === "Enter") {
              triggerNewGame()
            }
          }}
          style={{ background:"#494644", color: "#ccbbaa" }} value={typedUsername}
          onChange={(e) => { setTypedUsername(sanitizePlayerId(e.target.value)) }} />
          </>}
          <BewMenuButton onClick={() => { triggerNewGame() }}
            classOverride={"tx-altfont-5 " + (isGameLoading ? " hover-4" : "")}>
            {isGameLoading ? "Loading..." : "ENTER GAME"}
          </BewMenuButton>
        </div>}



          {!isGameLoading && <>
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
          className=" nodeco" href="/config">
        <BewMenuButton>
          {/* cog emoji */}
          <span className="">⚙️</span>
          </BewMenuButton></Link></>}




      </div>



      {!isGameLoading && <>
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
       className="tx-white opaci-50 pa-2 pointer tx-altfont-1">Low Graphics</label>
      </div>
</div>
</>}
    </div>
  </>)
}




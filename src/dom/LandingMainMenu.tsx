import { BewMenuButton } from "@/model/bew/BewMenuButton"
import Link from "next/link"

export const LandingMainMenu = () => {
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
          background: "linear-gradient(90deg, #000000, #00000000 50%)",
          transform: "translateX(-10px)",
        }}
        >
          <Link
          style={{
            color: "#111111",
          }} className=" " href="/game">
          <BewMenuButton>New Game</BewMenuButton></Link>
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
      </div>
    </>)
  }
  
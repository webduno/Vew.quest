import Link from 'next/link';

export default function Webbew() {
  return <div>
    <WebbewPage />
  </div>;
}


const WebbewPage = () => {
  return <div className=""
  style={{
    background: "url('/webbew/bg15.jpg') black",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    width: "100vw",
    height: "100vh",
  }}
  >

    <div className="tx-xl dilating-blur tx-shadow-5 tx-white tx-center w-100 pt-4 pb-200 tx-altfont-5 flex-row
    "
    style={{
      background: "linear-gradient(180deg, #1E1B14, #00000000)",

    }}
    >
      <div>WEB</div>
      <div className='tx-altfont-1 px-1 pb-1'>|</div>
      <div style={{ transform: "scaleX(-1)" }}>WEB</div>
    </div>
    <div className='pos-abs bottom-0 pb-100 w-100 flex-col flex-align-start'
    style={{
      background: "linear-gradient(0deg, #1E1B14, #00000000)",

    }}
    >
      <div className='pa-4 flex-col pos-rel tuto-paper'>
{/*           
      <div className='px-2 pt-2 pb-8 pos-abs'
        style={{
          filter: "blur(1px)",
          transform: "rotate(-3deg)",
          clipPath: "polygon(50% 0%, 100% 0, 98% 60%, 100% 97%, 4% 100%, 0% 60%, 2% 3%)",
          background: "#000000",
          // background: "linear-gradient(45deg, #706C61, #8F8B7D, #706C61)",
        }}
        >
          <div className='tx-altfont-8 tx-lg'>Tutorial</div>
        </div> */}
        <div style={{filter: "blur(10px)"}}
         className='pa-7 bg-b-90 pos-abs'></div>

        <div className='px-3 pt-2 pb-1 z-100'
        style={{
          transform: "rotate(-8deg)",
          clipPath: "polygon(50% 0%, 100% 0, 98% 60%, 100% 97%, 4% 100%, 0% 60%, 2% 3%)",
          background: "linear-gradient(0deg, #706C61, #8F8B7D, #605C51)",
        }}
        >
          <div className='tx-altfont-8 tx-lg'>Tutorial</div>
          <div className='tx-xs tx-altfont-6' style={{filter: "saturate(0)"}}>
            <div className='opaci- 0'>Stargate1A (SRI)</div>
            <div className='opaci-50'>Ingoo swan</div>
            <div style={{paddingTop:"1px"}} className='w-50 opaci-50 bg-b-90 mb-1'/>
            <div>〽🌀 Mconeagle</div>
            <div>- Hal puthoff</div>
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
  </div>;
}



const BewMenuButton = ({children}: {children: React.ReactNode}) => {
  return <div className="px-5 py-1 pb-3 bord-r-5 key-btn"
  
  >
    {children}
  </div>;
}





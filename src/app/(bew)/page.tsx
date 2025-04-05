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

      <div className="tx-white tx-lg tx-altfont-1  flex-col flex-align-start"
      style={{
        background: "linear-gradient(90deg, #000000, #00000000 50%)",
        transform: "translateX(-15px)",
      }}
      >
        <Link
        style={{
          color: "#222222",
        }} className=" " href="/game">
        <BewMenuButton>New Game</BewMenuButton></Link>
        <Link 
        style={{
          color: "#333333",
        }}
        className=" nodeco" href="/practice">
        <BewMenuButton>Practice</BewMenuButton></Link>
        <Link
        style={{
          color: "#444444",
        }}
         className=" nodeco" href="/about">
        <BewMenuButton>About</BewMenuButton></Link>
      </div>
    </div>
  </div>;
}



const BewMenuButton = ({children}: {children: React.ReactNode}) => {
  return <div className="px-8 py-1 pb-3 bord-r-5 key-btn"
  
  >
    {children}
  </div>;
}





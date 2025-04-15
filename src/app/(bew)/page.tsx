import Link from 'next/link';
import { BewMenuButton } from '../../dom/atom/BewMenuButton';
import { LandingMainMenu } from '@/dom/organ/LandingMainMenu';

export default function Webbew() {
  return <div>
    <WebbewPage />
  </div>;
}


const WebbewPage = () => {
  return <div className=""
  style={{
    // background: "url('/webbew/bg15.jpg') black",
    background: "url('/webbew/ingameblur.png') black",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    width: "100vw",
    height: "100vh",
  }}
  >

<div className='flex-col   pb-200 w-100'  style={{
      background: "linear-gradient(180deg, #1E1B14, #00000000)",

    }}>

    <Link href="/" prefetch={false}
     className="tx-xl dilating-blur tx-shadow-5 
     tx-white tx-center  pt-4 tx-altfont-5 flex-row
    "
  
    >
      <div>WEB</div>
      <div className='tx-altfont- 1 '>|</div>
      <div style={{ transform: "scaleX(-1)" }}>WEB</div>
    </Link>
    </div>
    <LandingMainMenu />
  </div>;
}



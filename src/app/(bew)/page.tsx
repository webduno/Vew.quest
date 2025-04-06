import Link from 'next/link';
import { BewMenuButton } from '../../model/bew/BewMenuButton';
import { LandingMainMenu } from '@/dom/LandingMainMenu';

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
    <LandingMainMenu />
  </div>;
}



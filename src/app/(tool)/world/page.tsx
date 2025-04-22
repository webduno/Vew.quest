import { BewLogo } from '@/dom/atom/logo/BewLogo';
import { BewWorldLogo } from '@/dom/bew/BewWorldLogo';
import { BewGameContainer } from '@/model/stage/wrapper/BewGameContainer';
import { BewWorldGameContainer } from '@/model/stage/wrapper/BewWorldGameContainer';

export default function NewGamePage() {
  return (
    <div className='w-100 h-100 '>
      <div className='pos-abs top-0 left-0 '
      style={{
        zIndex: 5000,
      }}
      >
        <div className='pa-4'>
          <div className='bg-white bord-r-100'>
          <a href="/" className='pointer flex-row nodeco pos-rel tx-xsm py-1 px-2 '>
      <img src="/bew/pnglogo.png" alt="tool_bg" width={"20px"} className='mr-1' />
      
      <div className='tx-bold' style={{ color: "#2B29AF" }}>Vew</div>
      <div className='tx-bold' style={{ color: "#6B69CF" }}>.quest</div>
      {/* <div className='tx-bold' style={{ color: "#2B29AF" }}>/world</div> */}
      </a>
          </div>
        </div>
        
      </div>
      <BewWorldGameContainer />
    </div>
  );
} 



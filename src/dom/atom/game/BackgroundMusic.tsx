"use client"

import { useBackgroundMusic } from '@/../scripts/contexts/BackgroundMusicContext';
import { GameButton } from './GameButton';
import { useState } from 'react';

export function BackgroundMusic({ firstTime,disableFirstTime }: { firstTime: boolean,disableFirstTime: () => void }) {
  const { isPlaying, togglePlay } = useBackgroundMusic();
  const [show, setShow] = useState(true);

  if (show)
    {
    return (<>
      <div className=' w-100vw h-100vh bottom-0 left-0 flex-col pos-abs bg-glass-3 z-100' >
        <div className='w-100 h-100  pos-abs'
        style={{
          cursor: "pointer",
        }}
        onClick={() => {
          console.log("clicked start to play")
          togglePlay();
          setShow(false);
          disableFirstTime();
        }}
        ></div>



{/* <div className=' nowrap tx-white opaci-50 tx-shadow-5 top-0 translate-y--100 pb-100 tx-altfont-8 tx-xl tx-center p l-3'>
          Tap the screen to play
        </div> */}

<div className='pos-rel z-1000 noclick'>
      <div className='flex-row-r gap-1  flex-align-center '
      
      style={{
      }}
      >
      <button  className="bord-r-5 noclick pointer py-1 pb-2  tx-white tx-shadow-5 tx-altfont-1 opaci-chov--75"
      
      style={{
        background: "#668866",
        border: "1px solid #66ff66",
      }}
        >
          <span className='tx-xl px-2 py-4 tx-center flex-col'>
            <div>CLICK THE</div>
            <div>SCREEN</div>
            <div>TO START</div>
          </span>
        </button>
      {/* <button  className="bord-r-5 pointer pb-1 "
      onClick={() => {
        disableFirstTime();
        setShow(false)
      }}
      style={{
        background: "#666666",
      }}
        >
          <span className='tx-mdl'>🔇</span>
        </button> */}
        
        </div>
        </div>
      </div>
      </>)
  }
  
  
  
  
//   if (show)
//     {
//     return (<>
//       <div className=' w-100vw h-100vh bottom-0 left-0 flex-col pos-abs bg-glass-3 z-100' >
//         <div className='w-100 h-100  pos-abs'
//         onClick={() => {
//           console.log("clicked start to play")
//           togglePlay();
//           setShow(false);
//           disableFirstTime();
//         }}
//         ></div>

//       <div className='flex-col gap-1 z-1000 px-2 pos-rel py-1 '
//       style={{
//         borderRadius: "2px",
//         background: "radial-gradient(#666666 , #111111 )",
//         boxShadow: "8px 0 0 12px #666666, 8px 0 1px 20px #5A4F43, 12px 2px 1px 25px #302923, 9px -1px 1px 23px #8C887A",
//       }}
//       >
        
// <div className='pos-abs nowrap tx-white opaci-50 tx-shadow-5 top-0 translate-y--100 pb-100 tx-center pl-3'>
//           Click anywhere to play
//         </div>
//         <div className='tx-white tx-shadow-5 tx-altfont-1 pa-2 tx-lg tx-center bord-r-25'
//         onClick={() => {
//           togglePlay();
//           disableFirstTime();
//           setShow(false);
//         }}
//         style={{
//           background: "radial-gradient(#556677 , #101914 )",
//           boxShadow: "inset 0 2px 5px #00000077",
//         }}
//         >
//           Play with  <br /> audio?
//         </div>

//       <div className='flex-col-r gap-1  pos-abs right-0 flex-align-start '
      
//       style={{
//         transform: "translateX(120%)",
//       }}
//       >
//       <button  className="bord-r-5 pointer py-1 pb-2 hover-4 mt-2 tx-white tx-shadow-5"
//       onClick={() => {
//         togglePlay();
//         disableFirstTime();
//         setShow(false)
//       }}
//       style={{
//         background: "#668866",
//         border: "1px solid #66ff66",
//       }}
//         >
//           <span className='tx-mdl'>🔊 Yes</span>
//         </button>
//       <button  className="bord-r-5 pointer pb-1 "
//       onClick={() => {
//         disableFirstTime();
//         setShow(false)
//       }}
//       style={{
//         background: "#666666",
//       }}
//         >
//           <span className='tx-mdl'>🔇</span>
//         </button>
        
//       <button  className="bord-r-100 tx-white px-2 pointer pb-1 "
//       onClick={() => {
//         setShow(false)
//       }}
//       style={{
//         background: "#666666",
//       }}
//         >
//           <span className='tx-mdl opaci-25'>x</span>
//         </button>
//         </div>
        
//         </div>
//       </div>
//       </>)
//   }

  return (
    <div
      className='pos-abs top-0 left-0 mt-3 ml-150  '
      onClick={togglePlay}
      style={{
        zIndex: 9000,
        position: 'fixed',
      }}
    >
      <button  className="bord-r-5 pointer pb-1 " tabIndex={-1}
      style={{
        background: "#333333",
      }}
       >
        {!isPlaying ? (
          <>
            {/* music emoji */}
            <span className='tx-mdl'>🔇</span>
          </>
        ) : (
          <>
            {/* pause emoji */}
            <span className='tx-mdl'>🔊</span>
          </>
        )}
      </button>
    </div>
  );
} 
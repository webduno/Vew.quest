"use client"
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { useBackgroundMusic } from '@/../script/contexts/BackgroundMusicContext';
import { isMobile } from '@/../script/utils/platform/mobileDetection';


export function BackgroundMusic({ firstTime, disableFirstTime, isEverythingLoading }: { 
  firstTime: boolean,
  disableFirstTime: () => void,
  isEverythingLoading: boolean 
}) {
  const { isPlaying, togglePlay, playSoundEffect } = useBackgroundMusic();
  const [show, setShow] = useState(true);
  const [firstIntroText, setFirstIntroText] = useState("");
  const searchParams = useSearchParams()

  useEffect(() => {
    // if ref url param has something, dont show the click to start
    const ref = searchParams.get("ref")
    if (ref) {
      setShow(false)
    }
  }, []);

  if (show) {
    return (<>
      <div className='w-100vw h-100vh bottom-0 left-0 flex-col pos-abs bg-glass-3 '
        style={{
          zIndex: 1500,
        }}
       >
        <div className='w-100 h-100 pos-abs'
          style={{
            cursor: isEverythingLoading ? "default" : "pointer",
          }}
          onClick={() => {
            if (isEverythingLoading) return;

            if (!localStorage.getItem("VB_ALREADY_PLAYED")) {
              playSoundEffect("/sfx/tutorials/gameintro2.ogg")
              setFirstIntroText("Welcome to WebBew Labs!")
              setTimeout(() => {
                
                togglePlay();
                setShow(false);
                disableFirstTime();
              }, 4000)
              return
            }
            togglePlay();
            setShow(false);
            disableFirstTime();            
          }}
        ></div>

        <div className='pos-rel z-1000 noclick'>
          <div className='flex-row gap-1 flex-align-center '
          style={{

          }}
          >
            <div className="block noclick pointer py-1 pb-2 tx-white tx-shadow-5 tx- altfont-1 opaci-chov--75"
              id='click-to-start'
              style={{
                // background: "#668866",
                // border: "1px solid #66ff66",
                  transform: 'scaleY(.7)',
        boxShadow: 'inset  0 0 50px #000000, 0 -20px 0 #333333',
        background: '#333333',

        fontFamily: 'monospace',
          color: '#00ff00',
          textShadow: '0 0 5px #007700',
              }}
            >
              <div className='tx-red pos-abs top-0 right-0 translate-y--100'>
                <div  className='tx-white px-2 py-1'
                style={{background:"#ff5555"}}
                >X</div>
              </div>
              <div className='block tx-xl px-4 py-2 tx-center flex-col'
              
              >
                {!!firstIntroText && !isEverythingLoading && (<>
                  <div className='w-250px'>
                    <div className='tx-xl pb-4'>{firstIntroText}</div>
                    <div className='flex-row gap-2 tx-md'>
                      <div>Psychic</div>
                      <div>Training</div>
                      <div>Program</div>
                    </div>
                  </div>
                </>)}
                {!firstIntroText && (<>
                  {isEverythingLoading ? (
                    <>
                      <div>LOADING</div>
                      <div>PLEASE</div>
                      <div>WAIT</div>
                    </>
                  ) : (
                    <>
                    <div>CLICK</div>
                    <div>ANYWHERE</div>
                    <div>TO START</div>
                    {isMobile() ? (
                      <>
                        </>
                    ) : (
                      <div className='flex-row gap-2 tx-sm pt-2'>
                        <div>AND USE</div>
                        <div>W, A, S, D</div>
                        <div>TO MOVE</div>
                      </div>
                    )}
                    </>
                  )}
                  </>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>)
  }
  
  return (
    <div
      className='pos-abs top-0 left-0 mt-3 ml-100  '
      onClick={togglePlay}
      style={{
        zIndex: 9000,
        position: 'fixed',
      }}
    >
      <button  className="bord-r-5 key-btn noborder pointer pb-1 " tabIndex={-1}
      style={{
        // background: "#333333",
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
"use client"
import { useState, useEffect, useRef } from "react";
import JSConfetti from 'js-confetti';

import SpaceWorldContainer from "@/dom/organ/stage/SpaceWorldContainer";
import { VewAltLogo } from "@/dom/organ/vew_tool/VewAltLogo";
import { useLSPlayerId } from "../../../script/state/hook/usePlayerStats";
import { BewWorldLogo } from "@/dom/bew/BewWorldLogo";
import { useProfileSnackbar } from "@/script/state/context/useProfileSnackbar";
import { Tooltip } from "react-tooltip";
import { useBackgroundMusic } from "../../../script/state/context/BackgroundMusicContext";
export default function ModelPage() {
  const [clickCounter, setClickCounter] = useState(0);
  const [wincounter, setWincounter] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(59); 
  const [timerLimit, setTimerLimit] = useState(59);
  const {LS_playerId, setPlayerId} = useLSPlayerId();
  const [randomCoord1LatLan, setRandomCoord1LatLan] = useState({lat:0,lng:0})
  const { triggerSnackbar } = useProfileSnackbar();
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const confettiRef = useRef<JSConfetti | null>(null);

  const [loadingWin, setLoadingWin] = useState(false)
  const [lastClickedCoords, setLastClickedCoords] = useState<{lat: number, lng: number} | null>(null);


const {playSoundEffect} = useBackgroundMusic()


  useEffect(() => {
    const fetchInitialClicks = async () => {
      if (!LS_playerId) return;
      
      try {
        const response = await fetch('/api/click/findOrCreate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            player_id: LS_playerId,
            isWin: false,
            attempts: 0
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setClickCounter(data.data.attempts);
          setWincounter(data.data.win);
        }
      } catch (error) {
        console.error('Error fetching initial clicks:', error);
      }
    };

    fetchInitialClicks();
  }, [LS_playerId]);

  useEffect(() => {
    confettiRef.current = new JSConfetti();
  }, []);

  const startGameProcess = () => {
    const randomCoord1LatLan = {
      lat: Math.random() * 180 - 90,
      lng: Math.random() * 360 - 180
    }
    setRandomCoord1LatLan(randomCoord1LatLan)
    setTimeRemaining(timerLimit) // Reset time remaining to current timer limit
    
    // Clear existing timer if any
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    
    // Start new timer
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Reset timer and generate new coordinates when reaching 0
          const newRandomCoord = {
            lat: Math.random() * 180 - 90,
            lng: Math.random() * 360 - 180
          }
          setRandomCoord1LatLan(newRandomCoord)
          setLastClickedCoords(null)
          playSoundEffect("/sfx/short/errorbip.mp3")
          triggerSnackbar("Goal not found, target moved!", "error")
          confettiRef.current?.addConfetti({
            confettiColors: ['#FD0008', '#ffDB80'],
            confettiNumber: 50,
          })
          
          return timerLimit // Use the current timer limit
          
        }
        return prev - 1
      })
    }, 1000)
  }
  const [showHelper, setShowHelper] = useState(false)

  const trackClick = async (isWin: boolean) => {
    if (showHelper) return;
    if (!LS_playerId) return;
    
    try {
      const response = await fetch('/api/click/findOrCreate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          player_id: LS_playerId,
          isWin,
          attempts: 1
        }),
      });

      if (!response.ok) {
        console.error('Failed to track click');
      }
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  }
  return (
    <div>
      <div className="pos-abs top-0 left-0 z-100 ma-2">
      <div className='bg-white bord-r-100'>
          <a href="/" className='pointer flex-row nodeco pos-rel tx-xsm py-1 px-2 '>
      <img src="/bew/pnglogo.png" alt="tool_bg" width={"25px"} className='mr -1' />
      
      <div className='tx-bold' style={{ color: "#2B29AF" }}>Vew</div>
      <div className='tx-bold' style={{ color: "#6B69CF" }}>.quest</div>
      {/* <div className='tx-bold' style={{ color: "#2B29AF" }}>/world</div> */}
      </a>
          </div> 
      </div>
      <div className="tx-center pb-0 pa-2 pos-abs top-0 right-0 z-100 flex-col flex-align-stretch  tx-white">
        
      <Tooltip id="my-chip-tooltip" />
        <div data-tooltip-id="my-chip-tooltip" data-tooltip-content="Vew chips" 
        data-tooltip-place="left"
        onClick={()=>{
          triggerSnackbar(<div className="tx-center flex-col tx-shadow-5">
            {/* <div>Remaining time</div> */}
            {/* eye emoji */}
            <div className="flex-row pl-2">
            <div>{" You have"}</div>
            <div
        style={{ background:"#FAeeA5", boxShadow:"inset -2px -4px 6px #77777777, inset -2px -4px 2px #F7CB28, inset 2px 2px 2px #fff7f1, 2px 4px 4px #aaaaaa"}}
         className="tx-lg py-1 px-1  mb-2 bord-r-100">
          <div className="pb-1 tx-md r-1" style={{filter:"saturate(0) brightness(3)"}}>👀</div>
         </div>
              </div>
            <div className="pb-2">{""+clickCounter + " vew chips"}</div>
          </div>, "yellow")
        }}
         className="pr-2 tx-center flex-row flex-justify-end tx-mdl  pointer tx-bold  py-1 gap-1">
          {/* eye emoji */}
        <div className="tx-shadow-2">{clickCounter}</div>
        <div
        style={{ background:"#FAeeA5", boxShadow:"inset -2px -4px 6px #77777777, inset -2px -4px 2px #F7CB28, inset 2px 2px 2px #fff7f1, 2px 4px 4px #aaaaaa"}}
         className="tx-lg py-1 px-1 ml-2 bord-r-100">
          <div className="pb-1 tx-md" style={{filter:"saturate(0) brightness(3)"}}>👀</div>
         </div>
        </div>




        
      <Tooltip id="my-chip-tooltip" />
        <div data-tooltip-id="my-chip-tooltip" data-tooltip-content="Vew pins" 
        data-tooltip-place="left"
        onClick={()=>{
          triggerSnackbar(<div className="tx-center flex-col tx-shadow-5">
            {/* <div>Remaining time</div> */}
            {/* eye emoji */}
            <div className="flex-row pl-2">
            <div>{" You have"}</div>
            <div
        style={{ background:"#B7E999", boxShadow:"inset -2px -4px 6px #77777777, inset -2px -4px 2px #139724, inset 2px 2px 2px #fff7f1, 2px 4px 4px #aaaaaa"}}
         className="tx-lg py-1 px-1  mb-2 bord-r-100">
          <div className="pb-1 tx-md r-1" style={{filter:"saturate(1) brightness(1)"}}>📍</div>
         </div>
              </div>
            <div className="pb-2">{""+wincounter + " vew pins"}</div>
          </div>, "errorwarning")
        }}
         className="pr-2 tx-center flex-row flex-justify-end tx-mdl  pointer tx-bold  py-1 gap-1">
          {/* eye emoji */}
        <div className="tx-shadow-2">{wincounter}</div>
        <div
        style={{ background:"#B7E999", boxShadow:"inset -2px -4px 6px #77777777, inset -2px -4px 2px #139724, inset 2px 2px 2px #fff7f1, 2px 4px 4px #aaaaaa"}}
         className="tx-lg py-1 px-1 ml-2 bord-r-100">
          <div className="pb-1 tx-md" style={{filter:"saturate(1) brightness(1)"}}>📍</div>
         </div>
        </div>

        


        


        {/* <div
        onClick={()=>{
          if(wincounter > 0){
            confettiRef.current?.addConfetti({
              confettiColors: ['#FDC908', '#7DDB80', '#807DDB', '#6DcB70'],
              confettiNumber: 50,
            })
          }
          triggerSnackbar( "📍" + wincounter + " Pins found!", "errorwarning")
        }}
         className="pr-2 tx-center flex-row flex-justify-end tx-mdl tx-shadow-2 pointer tx-bold  py-1 gap-1">
        
        <div>{wincounter}</div>
        <div className="tx-lg py-1 ">📍</div>
        </div> */}


        <div
        onClick={()=>{
          triggerSnackbar(<div className="flex-col tx-shadow-5">
            <div>New target in</div>
            <div className="">{"" + timeRemaining+" seconds"}</div>
          </div>, "handbook")
        }}
         className="pr-2 tx-center flex-row flex-justify-end tx-mdl tx-shadow-2 pointer tx-bold  py-1 gap-1">
        
        <div className="pr-1">{timeRemaining}s</div>
        {/* <div className="tx-lg py-1 ">⏲️</div> */}
        <div
        style={{ background:"#E9B799", 
          boxShadow:"inset -2px -4px 6px #77777777, inset -2px -4px 2px #971324, inset 2px 2px 2px #fff7f1, 2px 4px 4px #aaaaaa"}}
         className="tx-lg py-1 px-1  mb- bord-r-100">
          <div className="pb-1 tx-md r-1" style={{filter:"saturate(1) brightness(1)"}}>🕗</div>
         </div>
        </div>

        </div>
      <SpaceWorldContainer  
        showHelper={showHelper}
        setShowHelper={setShowHelper}
        lastClickedCoords={lastClickedCoords}
        setLastClickedCoords={setLastClickedCoords}
        randomCoord1LatLan={randomCoord1LatLan}
        setRandomCoord1LatLan={setRandomCoord1LatLan}
        timerRef={timerRef}
        startGameProcess={startGameProcess}
        clickCounter={clickCounter}
        trackClick={trackClick}
        setClickCounter={(e)=>{
          setClickCounter(e)
          confettiRef.current?.addConfetti({
            confettiColors: ['#F7CB28', '#FAEFA5', "#ff9900"],
            confettiNumber: 3,
          })
          // triggerSnackbar(<div className="tx-center flex-col tx-shadow-5">
          //   <div>{" You have"}</div>
          //   <div className="">{""+e + " vew chips"}</div>
          // </div>, "yellow")
        }}
        wincounter={wincounter}
        setWincounter={(e)=>{
          setLoadingWin(true)
          setWincounter(e)
          setTimeout(() => {
            setLoadingWin(false)
            
    playSoundEffect("/sfx/short/fff.mp3")
    confettiRef.current?.addConfetti({
      confettiColors: ['#C67Bc7', '#F9EDf4', '#ff99ff'],
      // "emojis": ["📍"],
      // confettiColors: ['#C6AB47', '#F9EDA4', '#ff9900', '#FDC908'],
      // emojiSize: 0.2,
      confettiNumber: 50,
    });
            triggerSnackbar(<div className="tx-center flex-col tx-shadow-5">
              <div>{"New target ready!"}</div>
              {/* <div>{"Max Score: " + wincounter}</div> */}
            </div>, "purple")
          }, 5000)
        }}
        loadingWin={loadingWin}
        timeRemaining={timeRemaining}
        setTimerLimit={setTimerLimit}
        confettiRef={confettiRef}
      >
        <></>
      </SpaceWorldContainer>
    </div>
  )
}

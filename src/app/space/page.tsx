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
import { countries, CountryFeature } from "@/data/countries";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [totalClickCounter, setTotalClickCounter] = useState(0);
  const [loadingWin, setLoadingWin] = useState(false)
  const [lastClickedCoords, setLastClickedCoords] = useState<{lat: number, lng: number} | null>(null);
  const [showShopModal, setShowShopModal] = useState(false);
  const [shopItems, setShopItems] = useState<string[]>([]);
  const [boughtItems, setBoughtItems] = useState<string[]>([]);
  const [shopMessage, setShopMessage] = useState<string>("");
  const [allBoughtItems, setAllBoughtItems] = useState<string[]>([]);
  const [showResultSeshModal, setShowResultSeshModal] = useState(false)
  const [showHelper, setShowHelper] = useState(false)
  const {playSoundEffect} = useBackgroundMusic()
  const [isVfxHappening, setIsVfxHappening] = useState(false)
  const SHOP_ITEM_COST = 10;










  const pre_setIsVfxHappening = async (isVfxHappeningarg:boolean)=>{
    if (isVfxHappening){ return }

    if (containerRef.current) {
      containerRef.current.style.transition = 'filter 1s ease-in-out';
      containerRef.current.style.filter = 'blur(10px)';
    }
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (containerRef.current) {
      containerRef.current.style.filter = 'none';
    }
  }
const humanDescription = (coords: { lat: number, lng: number } | null)=>{
  if (!coords) return "No coordinates available";
  
  const distance = Math.sqrt(Math.pow(coords.lat - randomCoord1LatLan.lat, 2) + Math.pow(coords.lng - randomCoord1LatLan.lng, 2))
  
  // Find the closest country
  let closestCountry: CountryFeature | null = null;
  let minDistance = Infinity;
  
  countries.features.forEach(country => {
    const countryCoords = country.geometry.coordinates;
    const countryDistance = Math.sqrt(
      Math.pow(coords.lat - countryCoords[1], 2) + 
      Math.pow(coords.lng - countryCoords[0], 2)
    );
    
    if (countryDistance < minDistance) {
      minDistance = countryDistance;
      closestCountry = country;
    }
  });

  if (closestCountry && (closestCountry as any)?.properties ) {
    const countryName = (closestCountry as any)?.properties.name;
    const direction = coords.lat > randomCoord1LatLan.lat ? "north" : "south";
    const eastWest = coords.lng > randomCoord1LatLan.lng ? "east" : "west";
    return `${distance.toFixed(2)} km away, near ${countryName} (${direction}${eastWest})`;
  }
  
  return `${distance.toFixed(2)} km away`;
}
  const fetchSetInitialClicks = async () => {
    if (!LS_playerId) return;
    
    try {
      const response = await fetch('/api/click/findOrCreate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          player_id: LS_playerId.toLowerCase(),
          isWin: false,
          attempts: 1
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTotalClickCounter(data.data.attempts);
        setWincounter(data.data.win);
        const spentObj = typeof data.data.spent === 'string' ? JSON.parse(data.data.spent) : data.data.spent;
        console.log("spentObj", data.data)
        console.log("spentObj", spentObj)
        setAllBoughtItems(spentObj.bought);
      }
    } catch (error) {
      console.error('Error fetching initial clicks:', error);
    }
  };
  

  const startGameProcess = () => {
    const randomCoord1LatLan = {
      lat: Math.random() * 180 - 90,
      lng: Math.random() * 360 - 180
    }
    setRandomCoord1LatLan(randomCoord1LatLan)
    setTimeRemaining(timerLimit)
    
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          const newRandomCoord = {
            lat: Math.random() * 180 - 90,
            lng: Math.random() * 360 - 180
          }
          setRandomCoord1LatLan(newRandomCoord)

          // setLastClickedCoords(null)
          if (document.hasFocus()) {
            playSoundEffect("/sfx/short/clock.mp3")
          }
          triggerSnackbar("Goal not found, target moved!", "error")
          pre_setIsVfxHappening(true)
          // confettiRef.current?.addConfetti({
          //   confettiColors: ['#FD0008', '#ffDB80'],
          //   confettiNumber: 50,
          // })
          
          return timerLimit
          
        }
        return prev - 1
      })
    }, 1000)
  }
  

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
          player_id: LS_playerId.toLowerCase(),
          isWin,
          attempts: 1
        }),
      });

      if (!response.ok) {
        console.error('Failed to track click');
      }
      const newClickCounterData = await response.json()
      const newClickCounter = newClickCounterData.data.attempts
      if ((newClickCounter + clickCounter) % 100 === 0) {
    playSoundEffect("/sfx/short/myst.mp3")

        triggerSnackbar(<div className="tx-center flex-col tx-shadow-5">
          <div>{"You've leveled up!"}</div>
        </div>, "yellow")
        confettiRef.current?.addConfetti({
          confettiColors: ['#FDC908', '#7DDB80', '#807DDB', '#6DcB70'],
          confettiNumber: 50,
        })
      }
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  }

  function getRandomShopItems() {
    const allItems = [
      'Golden Chip',
      'Mystery Pin',
      'Time Booster',
      'Chip Doubler',
      'Pin Magnet',
      'Lucky Coin',
      'Map Reveal',
      'Speed Shoes',
      'Confetti Bomb',
    ];
    return allItems.sort(() => 0.5 - Math.random()).slice(0, 3);
  }

  function openShop() {
    setShopItems(getRandomShopItems());
    setBoughtItems([]);
    setShopMessage("");
    setShowShopModal(true);
    if (!LS_playerId) return;
  }


  async function handleBuyItem(item: string) {
    if (!LS_playerId) return;
    if (boughtItems.includes(item)) return;
    if (totalClickCounter + clickCounter < SHOP_ITEM_COST) {
      setShopMessage('Not enough chips!');
      return;
    }
    try {
      const newBought = [...boughtItems, item];
      const response = await fetch('/api/click/saveSpent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player_id: LS_playerId,
          chip: SHOP_ITEM_COST,
          bought: [item],
        }),
      });
      if (!response.ok) {
        setShopMessage('Purchase failed.');
        return;
      }
      setBoughtItems(newBought);
      setShopMessage(`You bought ${item}!`);


      // refetch the data
      fetchSetInitialClicks();
    } catch (e) {
      setShopMessage('Purchase failed.');
    }
  }

  useEffect(() => {
    if (!confettiRef.current) {
      confettiRef.current = new JSConfetti();
    }
    fetchSetInitialClicks();
  }, [LS_playerId]);



  return (
    <div ref={containerRef}>
      <div className="pos-abs top-0 left-0 z-100 ma-2">
      <div className='bg-white bord-r-100'>
          <a href="/" className='pointer flex-row nodeco pos-rel tx-xsm py-1 px-2 '>
      <img src="/bew/pnglogo.png" alt="tool_bg" width={"25px"} className='mr -1' />
      
      <div className='tx-bold' style={{ color: "#2B29AF" }}>Vew</div>
      <div className='tx-bold' style={{ color: "#6B69CF" }}>.quest</div>
      </a>
          </div> 
      </div>
      <div className="tx-center pb-0 pa-2 pos-abs top-0 right-0 z-100 flex-col flex-align-stretch  tx-white">
        
      <div className="mb-1 flex-row gap-2 tx-bold">
        <div className="tx-lg tx-shadow-2"  >
          Lvl: {Math.floor((totalClickCounter + clickCounter)/100)}
        </div>
         <div className='tx-white bord-r-100 mt-1 py-1 px-2 pos-rel'
        style={{
          background: "#E5E5E5",
          boxShadow: "0 3px 0 #D68800",
          overflow: "hidden"
        }}
      >
        <div className=' h-100 pos-abs top-0 left-0'
          style={{
            width: `${Math.floor(((totalClickCounter + clickCounter) % 100)/1)}px`,
            background: "#FDC908",
            transition: "width 0.5s ease-out"
          }}
        ></div>
        <div
          style={{
            color: "#D68800",
          }}
          className='tx-bold pos-rel '>{(((totalClickCounter + clickCounter) % 100)/1) }%</div>
      </div> 
         </div>

      <Tooltip id="my-chip-tooltip" />
        <div data-tooltip-id="my-chip-tooltip" data-tooltip-content="Vew chips" 
        data-tooltip-place="left"
        onClick={()=>{
          triggerSnackbar(<div className="tx-center flex-col tx-shadow-5">
            {(totalClickCounter + clickCounter) + " vew chips"}</div>, "yellow")
        }}
         className="pr-2 tx-center flex-row flex-justify-end tx-mdl  pointer tx-bold  py-1 gap-1">
          <div className="tx-shadow-2">{(totalClickCounter + clickCounter)}</div>
          <div
        style={{ background:"#FAeeA5", boxShadow:" inset -2px -4px 0px #F7CB28, inset 2px 2px 0px #fff7f1, 2px 4px 4px #aaaaaa"}}
         className="tx-lg py-1 px-1 ml-2 bord-r-100">
          <div className="pb-1 tx-md" style={{filter:"saturate(0) brightness(3)"}}>👀</div>
         </div>
        </div>

        <Tooltip id="my-chip-tooltip" />
        <div data-tooltip-id="my-chip-tooltip" data-tooltip-content="Vew pins" 
        data-tooltip-place="left"
        onClick={()=>{
          triggerSnackbar(<div className="tx-center flex-col tx-shadow-5">
            {wincounter + " vew pins"}</div>, "errorwarning")
        }}
         className="pr-2 tx-center flex-row flex-justify-end tx-mdl  pointer tx-bold  py-1 gap-1">
          <div className="tx-shadow-2">{wincounter}</div>
          <div
        style={{ background:"#B7E999", boxShadow:" inset -2px -4px 0px #139724, inset 2px 2px 0px #fff7f1, 2px 4px 4px #aaaaaa"}}
         className="tx-lg py-1 px-1 ml-2 bord-r-100">
          <div className="pb-1 tx-md" style={{filter:"saturate(1) brightness(1)"}}>📍</div>
         </div>
        </div>

        <div
        onClick={()=>{
          triggerSnackbar(<div className="flex-col tx-shadow-5">
            <div>New target in</div>
            <div className="">{"" + timeRemaining+" seconds"}</div>
          </div>, "handbook")
        }}
         className="pr-2 tx-center flex-row flex-justify-end tx-mdl tx-shadow-2 pointer tx-bold  py-1 gap-1">
        
        <div className="pr-1">{timeRemaining}s</div>
        <div
        style={{ background:"#cccccc", 
          boxShadow:"inset -2px -4px 6px #77777777, inset -2px -4px 0px #777777, inset 2px 2px 0px #fff7f1, 2px 4px 4px #aaaaaa"}}
         className="tx-lg py-1 px-1  mb- bord-r-100">
          <div className="pb-1 tx-md r-1" style={{filter:"saturate(1) brightness(1)"}}>🕗</div>
         </div>
        </div>

        <div
        onClick={openShop}
        className="pr-2 tx-center flex-row flex-justify-end tx-mdl tx-shadow-2 pointer tx-bold py-1 gap-1"
        style={{ marginTop: '8px' }}
      >
        <div className="pr-1">Shop</div>
        
      </div>

      </div>
      <SpaceWorldContainer  
        isVfxHappening={isVfxHappening}
        setIsVfxHappening={pre_setIsVfxHappening}
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
            confettiNumber: 1,
          })
    playSoundEffect("/sfx/short/passbip.mp3")
        }}
        wincounter={wincounter}
        setWincounter={(e)=>{
          
          setShowResultSeshModal(true)
          setLoadingWin(true)
          setWincounter(e)
          setTimeout(() => {
            setLoadingWin(false)
            
    playSoundEffect("/sfx/short/fff.mp3")
    confettiRef.current?.addConfetti({
      confettiColors: ['#C67Bc7', '#F9EDf4', '#ff99ff'],
      confettiNumber: 50,
    });
            triggerSnackbar(<div className="tx-center flex-col tx-shadow-5">
              <div>{"New target ready!"}</div>
            </div>, "purple")
            setShowResultSeshModal(false)
            setLastClickedCoords(null)
          }, 4000)
        }}
        loadingWin={loadingWin}
        timeRemaining={timeRemaining}
        setTimerLimit={setTimerLimit}
        confettiRef={confettiRef}
      >
        <></>
      </SpaceWorldContainer>
      {showResultSeshModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', zIndex: 200,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} 
        // onClick={() => setShowResultSeshModal(false)}
        >
          <div style={{ background: 'white', borderRadius: 16, padding: 24, minWidth: 260, boxShadow: '0 4px 24px #0002' }} onClick={e => e.stopPropagation()}>
            {/* <div className="tx-center tx-lg tx-bold mb-2"> {LS_playerId}</div> */}
            <div className="tx-center tx-lg tx-bold opaci-25 mb-2">
              Target found!
              <div className="tx-center tx-lg tx-bold mb-2">
                <div className="flex-row gap-2">
                  <div>lat: {lastClickedCoords?.lat?.toFixed(1)}</div>
                  <div>lng: {lastClickedCoords?.lng?.toFixed(1)}</div>
                </div>
                <div>
                  {humanDescription(lastClickedCoords)}
                </div>
                
              </div>
            </div>
          </div>
        </div>
      )}

      {showShopModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', zIndex: 200,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} onClick={() => setShowShopModal(false)}>
          <div style={{ background: 'white', borderRadius: 16, padding: 24, minWidth: 260, boxShadow: '0 4px 24px #0002' }} onClick={e => e.stopPropagation()}>
            <div className="tx-center tx-lg tx-bold mb-2"> {LS_playerId}</div>
            <div className="tx-center tx-lg tx-bold opaci-25 mb-2">🛒 Shop Purchases</div>
            <div className="mb-2">Choose an item to buy:</div>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {shopItems.map((item, i) => (
                <li key={i} className="mb-1 flex-row flex-align-center gap-2">
                  <span>{item} <span style={{color:'#888', fontSize:'0.9em'}}>({SHOP_ITEM_COST} chips)</span></span>
                  {boughtItems.includes(item) ? (
                    <span style={{ color: '#4caf50', fontWeight: 'bold' }}>Bought</span>
                  ) : (
                    <button
                      className="py-1 px-2 bord-r-100 tx-bold"
                      style={{ background: '#eee', border: 'none' }}
                      onClick={() => handleBuyItem(item)}
                    >Buy</button>
                  )}
                </li>
              ))}
            </ul>
            {shopMessage && <div className="my-2 tx-center" style={{ color: '#4caf50' }}>{shopMessage}</div>}
            {allBoughtItems.length > 0 && (<>
              <div style={{ borderTop: '1px solid #eee' }}
              className="tx-bold  mb-1 pt-2">Your Bought Items:</div>

              <div className=" pt- w-max-250px  w-100" >
                <ul
                className="flex-wrap gap-1"
                 style={{ listStyle: 'none', padding: 0, fontSize: '0.95em', color: '#333' }}>
                  {allBoughtItems.map((item, i) => (
                    <li key={i} className="mb-1 tx-xs">{item}</li>
                  ))}
                </ul>
              </div>
</>            )}
            <button className="mt-2 py-1 px-3 bord-r-100 tx-bold" style={{ background: '#eee', border: 'none' }} onClick={() => setShowShopModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

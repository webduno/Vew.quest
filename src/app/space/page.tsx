"use client"
import { useState, useEffect, useRef, useMemo } from "react";
import JSConfetti from 'js-confetti';

import SpaceWorldContainer from "@/dom/organ/stage/SpaceWorldContainer";
import { VewAltLogo } from "@/dom/organ/vew_tool/VewAltLogo";
import { useLSPlayerId } from "../../../script/state/hook/usePlayerStats";
import { BewWorldLogo } from "@/dom/bew/BewWorldLogo";
import { useProfileSnackbar } from "@/script/state/context/useProfileSnackbar";
import { Tooltip } from "react-tooltip";
import { useBackgroundMusic } from "../../../script/state/context/BackgroundMusicContext";
import { countries, CountryFeature } from "@/data/countries";
import { VersionTag } from "@/dom/bew/VersionTag";
import { DEFAULT_SHOP_ITEMS } from "../../../script/state/constant";

export default function ModelPage() {
  // const [clickCounter, setClickCounter] = useState(0);
  const [wincounter, setWincounter] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(59); 
  // const [availSpend, setAvailSpend] = useState(0);
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
const [spentObj, setSpentObj] = useState<{spent: {chip: number}} | null>(null)
const availSpend = useMemo(()=>{
  return totalClickCounter - (spentObj?.spent.chip || 0)
}, [totalClickCounter, spentObj])








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
        const theSpentObj = typeof data.data.spent === 'string' ? JSON.parse(data.data.spent) : data.data.spent;
        // console.log("theSpentObj", data.data)
        // console.log("theSpentObj", theSpentObj)
        setAllBoughtItems(theSpentObj.bought);
        // console.log(data.data.attempts , theSpentObj.spent.chip);
        setSpentObj(theSpentObj)
        // setAvailSpend(data.data.attempts - theSpentObj.spent.chip);
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
          triggerSnackbar(
            <div className="tx-center flex-col tx-shadow-5">
              {/* clock emoji */}
              <div>🕗 Time is up! </div>
              <div>Target has moved!</div>
            </div>, "handbook")
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
      setTotalClickCounter(newClickCounter)
      if ((newClickCounter) % 100 === 0) {
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
  const ITEM_REFERENCE: { [key: string]: { emoji: string; name: string; description: string; cost: number } } = {
    
    ...DEFAULT_SHOP_ITEMS,
    // "Golden Chip": {
    //   emoji: "💰",
    //   name: "Golden Chip",
    //   description: "A golden chip that can be used to buy items in the shop.",
    //   cost: 30
    // },
    // "Chip Doubler": {
    //   emoji: "💰",
    //   name: "Chip Doubler",
    //   description: "A doubler that can be used to buy items in the shop.",
    //   cost: 30
    // },
    // "Pin Magnet": {
    //   emoji: "🔍",
    //   name: "Pin Magnet",
    //   description: "A magnet that can be used to buy items in the shop.",
    //   cost: 30
    // },
    // "Speed Shoes": {
    //   emoji: "🏃‍♂️",
    //   name: "Speed Shoes",
    //   description: "A pair of speed shoes that can be used to buy items in the shop.",
    //   cost: 30
    // },
    // "Confetti Bomb": {
    //   emoji: "🎉",
    //   name: "Confetti Bomb",
    //   description: "A confetti bomb that can be used to buy items in the shop.",
    //   cost: 30
    // },
    
    
  }

  function getRandomShopItems() {
    const allItems = Object.keys(ITEM_REFERENCE)
    return allItems.sort(() => 0.5 - Math.random()).slice(0, 4);
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
    const itemCost = ITEM_REFERENCE[item].cost;
    if (totalClickCounter < itemCost) {
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
          chip: itemCost,
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
const normalClick = (e:number)=>{
  setTotalClickCounter(e)
          confettiRef.current?.addConfetti({
            confettiColors: ['#F7CB28', '#FAEFA5', "#ff9900"],
            confettiNumber: 1,
          })
    playSoundEffect("/sfx/short/passbip.mp3")
        }


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
      <div className="tx-center pb-0 pa-2 pos-abs top-0  right-0 z-100 flex-row gap-2 flex-align-stretch flex-justify-end tx-white">
        

      <div className="mb-1 flex-row gap-2 tx-bold   ">
        {totalClickCounter > 100 && (<>
        <div className="tx-lg tx-shadow-2 "  >
          Lvl: {Math.floor((totalClickCounter)/100)}
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
            width: `${Math.floor(((totalClickCounter) % 100)/1)}px`,
            background: "#FDC908",
            transition: "width 0.5s ease-out"
          }}
        ></div>
        <div
          style={{
            color: "#D68800",
          }}
          className='tx-bold pos-rel '>{(((totalClickCounter) % 100)/1) }%</div>
      </div> 
        </>)}
        </div>


      <details className='flex-col pos-rel '>
  <summary className='flex-col bg-white bord-r-10  pointer'
  >

  <button className='flex-col  px-2 py-2 px-4 noclick' style={{ color: "#AFAFAF" }}>
    <div className='noselect'>Menu</div>
  </button>
  </summary>
    <div className='pos-abs gap-2 flex-align-start flex-row bottom-0 right-0 z-1000'
    style={{
      transform: "translate(-0%, 100%)",
    }}
    >
     
  <div className='flex-col flex-justify-end pb-2 bg-glass-10 tx-sm z-1000 mt-2 m r-4 bord-r-10 noverflow flex-align-end tx-white'
      style={{
        // background: "#8080f0",
        // boxShadow: "0 4px 0 #6060f0",
      }}
      > 


         <div className="flex-row gap  flex-justify-end -2">

      <Tooltip id="my-chip-tooltip" />
        <div data-tooltip-id="my-chip-tooltip" data-tooltip-content="Vew chips" 
        data-tooltip-place="left"
        onClick={()=>{
          triggerSnackbar(<div className="tx-center flex-col tx-shadow-5">
            {(totalClickCounter) + " vew chips"}</div>, "yellow")
        }}
         className="pr-2 tx-center flex-row flex-justify-end tx-mdl  pointer tx-bold  py-1 gap-1">
          {/* <div className="tx-shadow-2">{(totalClickCounter + clickCounter)}</div> */}
          <div
        style={{ background:"#FAeeA5", boxShadow:" inset -2px -4px 0px #F7CB28, inset 2px 2px 0px #fff7f1"}}
         className="tx-lg py-1 px-1 bord-r-100">
          <div className="pb-1 tx-md flex-row pr-2" style={{filter:"saturate(0) brightness(3)"}}>👀 <div className="tx-shadow-2">{(totalClickCounter )}</div></div>
         </div>
        </div>
{wincounter > 0 && (<>
        <Tooltip id="my-chip-tooltip" style={{zIndex:5000}}/>
        <div data-tooltip-id="my-chip-tooltip" data-tooltip-content="Vew pins" 
        data-tooltip-place="left"
        onClick={()=>{
          triggerSnackbar(<div className="tx-center flex-col tx-shadow-5">
            {wincounter + " vew pins"}</div>, "errorwarning")
        }}
         className=" tx-center flex-row flex-justify-end tx-mdl  pointer tx-bold  py-1 gap-1">
          {/* <div className="tx-shadow-2">{wincounter}</div> */}
          <div
        style={{ background:"#B7E999", boxShadow:" inset -2px -4px 0px #139724, inset 2px 2px 0px #fff7f1"}}
         className="tx-lg py-1 px-1  bord-r-100">
          <div className="pb-1 tx-md flex-row pr-2" style={{filter:"saturate(1) brightness(1)"}}>📍 <div className="tx-shadow-2">{wincounter}</div></div>
         </div>
        </div>
        </>
        )}
        </div>

        <div
        onClick={()=>{
          triggerSnackbar(<div className="flex-col tx-shadow-5">
            <div>New target in</div>
            <div className="">{"" + timeRemaining+" seconds"}</div>
          </div>, "handbook")
        }}
         className=" tx-center flex-row flex-justify-end tx-mdl tx-shadow-2 pointer tx-bold  py-1 gap-1">
        
        
        <div
        style={{ background:"#eeeeee", 
          boxShadow:"inset -2px -4px 0px #bbbbbb, inset 2px 2px 0px #ffffff"}}
         className="tx-lg py-1 px-1  mb- bord-r-100">
          <div className="flex-row px-2 pb-1 tx-md r-1" style={{filter:"saturate(1) brightness(1)"}}>🕗 <div className="pr-1">{timeRemaining}s</div></div>
         </div>
        </div>
{wincounter > 3 && (<>
        <div
        onClick={openShop}
        className="p r-2 tx-center flex-row flex-justify-end tx-mdl tx-shadow-2 pointer tx-bold py-1 gap-1"
        // style={{ marginTop: '8px' }}
      >
        <div className="pr-1">Shop</div>
        
      </div>
      </>
      )}
      </div>
    </div>
  </details>
  





      </div>
      <SpaceWorldContainer  
        setShowShopModal={openShop}
        inventory={allBoughtItems}
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
        // clickCounter={clickCounter}
        clickCounter={totalClickCounter}
        trackClick={trackClick}
        setClickCounter={(e)=>{
          normalClick(e)
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
            // triggerSnackbar(<div className="tx-center flex-col tx-shadow-5">
            //   <div>{"New target ready!"}</div>
            // </div>, "purple")




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
      {showResultSeshModal && false && (
        <div className="w-100vw h-100vh bg-w-90 bg-glass-10 pos-fix flex-col top-0 left-0 z-1000" style={{
        }} 
        // onClick={() => setShowResultSeshModal(false)}
        >
          <div style={{ background: 'white', borderRadius: 16, padding: 24, minWidth: 260, boxShadow: '0 4px 24px #0002' }} onClick={e => e.stopPropagation()}>
            {/* <div className="tx-center tx-lg tx-bold mb-2"> {LS_playerId}</div> */}
            <div className="tx-center tx-lg tx-bold  mb-2">
              <div style={{ color: "#4b4b4b", }}
               className="tx-xsm pb-4">High Energy Target found!</div>
              <div className="tx-center tx-lg tx-bold mb-2 opaci-25">
                <div className="flex-row gap-2">
                  <div>Lat: {lastClickedCoords?.lat?.toFixed(1)}</div>
                  <div>Lng: {lastClickedCoords?.lng?.toFixed(1)}</div>
                </div>
                <div className="w-max-250px">
                  {humanDescription(lastClickedCoords)}
                </div>
                
              </div>
            </div>
          </div>
        </div>
      )}

      {showShopModal && (
        <div className="tx-altfont-2 bg-w-90 bg-glass-5 pos-fix top-0 left-0 z-1000 w-100vw h-100hv" style={{
          height: '100vh', 
         zIndex: 200,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} onClick={() => setShowShopModal(false)}>
          <div className="w-max-400px w-100" style={{ background: 'white', borderRadius: 16, padding: 24, minWidth: 260, boxShadow: '0 4px 24px #0002' }} onClick={e => e.stopPropagation()}>
            {/* <div className="tx-center tx-lg tx-bold opaci-25 mb-2">🛒 Shop Purchases</div> */}
            
            <div className="flex-row gap-2  w-100 "
            style={{
              color: "#AFAFAF",
            }}
            >
              <div className="mb-2 flex-1 nowrap tx-ls-5 tx-sm">🛒 GAME SHOP</div>
              <button className="mb-2 nowrap opaci-50"
              onClick={()=>{
                trackClick(false)
                normalClick(totalClickCounter)
                setShopItems(getRandomShopItems())
                setBoughtItems([])
              }}
              >Refresh</button>
            </div>
            <div className=" nowrap tx-bold"
            style={{
              color: "#4b4b4b",
            }}
            >
             💰 Available: {availSpend}
            </div>
            <ul style={{ listStyle: 'none', padding: 0 }} className="flex-wrap w-100 gap-2">
              {shopItems.map((item, i) => (
                <li key={i} className="mb-1 flex-col flex-align-center gap-2 bord-r-15 pa-2"
                style={{
                  border: "1px solid #AFAFAF",
                  // background: "#eeeeee",
                  // boxShadow:"inset -2px -4px 0px #bbbbbb, inset 2px 2px 0px #ffffff"
                }}
                >
                <Tooltip id={"my-onsale-tooltip-"+ item} >
                <div className="w-100px">{ITEM_REFERENCE[item].description}</div>
                  </Tooltip>
                  <span data-tooltip-id={"my-onsale-tooltip-"+ item} 
                    data-tooltip-place="top">
                      {ITEM_REFERENCE[item].emoji} {item} 
                      </span>
                  {boughtItems.includes(item) ? (
                    <span style={{ color: '#4caf50', fontWeight: 'bold' }}>Bought</span>
                  ) : (
                    <div className="flex-row-r gap-2">
                    <button 
                      className="py-1 px-2 bord-r-100 tx-bold"
                      style={{ background: '#eee', border: 'none' }}
                      onClick={() => handleBuyItem(item)}
                    >Buy</button>
                    <span style={{color:'#888', fontSize:'0.9em'}}>({ITEM_REFERENCE[item].cost} 💰)</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
            {shopMessage && <div className="my-2 tx-center" style={{ color: '#4caf50' }}>{shopMessage}</div>}
            <div className="tx-center tx-lg tx-bold mb -2">🛒  {LS_playerId}</div>
            
            {allBoughtItems.length > 0 && (<>
              <div style={{ borderTop: '1px solid #eee' }} className="tx-bold  p t-2"></div>

              <div className=" pt-   w-100" >
              
                <ul
                className="flex-wrap gap-1"
                 style={{ listStyle: 'none', padding: 0, fontSize: '0.95em', color: '#333' }}>
                  {allBoughtItems.map((item, i) => (
                    <li key={i} 
                    onClick={()=>{
                      triggerSnackbar(<div className="tx-center flex-col tx-shadow-5 w-max-250px">
                        {ITEM_REFERENCE[item].description}</div>, "handbook")
                    }}

                     className="pointer bg-b-10 bord-r-100 pa-1  tx-xs">{ITEM_REFERENCE[item].emoji} {item}</li>
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

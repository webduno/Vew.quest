"use client";
import { Sphere, useTexture, Billboard, Text, Box, Cylinder } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { Vector3, Quaternion } from "three";
import { ComputerModel } from "../core/ComputerModel";
import { useProfileSnackbar } from "@/script/state/context/useProfileSnackbar";
import { useBackgroundMusic } from "../../../script/state/context/BackgroundMusicContext";
import { humanDescription } from '@/script/utils/calculations';
import { countries } from '@/data/countries';

export const WorldModelTextured = ({
  isVfxHappening,
  setIsVfxHappening,
  state,
  setShowHelper,
  onGreenClicked,
  targetCoords,
  onTargetFound,
  showHelper,
  clickedHandler, lastClickedCoords  }:any) => {
  const $cloudsWireframe:any = useRef()
  const $light:any = useRef()
  const $whole:any = useRef()
  const $wholeReversed:any = useRef()
  const { triggerSnackbar } = useProfileSnackbar();
  const [previousTargets, setPreviousTargets] = useState<Array<{lat: number, lng: number, targetLat: number, targetLng: number, humanString: string}>>([]);
  const [previousClicks, setPreviousClicks] = useState<Array<{lat: number, lng: number}>>([]);
  const [helperSphereSize, setHelperSphereSize] = useState(0.04);
  const autoClickInterval = useRef<NodeJS.Timeout | null>(null);
  const hasAutoMoonClick = useMemo(() => state.inventory.includes("Auto Moon Click"), [state.inventory]);

  const rotSpeed = useRef(0)
  const isTimeBoosted = useMemo(()=>{
    return state.inventory.includes("Time Booster") ? 2 : 1
  }, [state.inventory])
  // const rotSpeed = useRef(0.03)

  useFrame(()=>{
    if (!$light.current) return
    if (!$whole.current) return
    $light.current.rotation.y += rotSpeed.current * isTimeBoosted
    $whole.current.rotation.y += rotSpeed.current/30 * isTimeBoosted
    if (!$wholeReversed.current) return
    $wholeReversed.current.rotation.y -= rotSpeed.current/10 * isTimeBoosted
    // $wholeReversed.current.rotation.x -= 0.01
    $wholeReversed.current.position.y = Math.sin(Date.now()/1000)/10
    if (!$cloudsWireframe.current) return
    $cloudsWireframe.current.rotation.y += rotSpeed.current * isTimeBoosted
  })

  const {playSoundEffect} = useBackgroundMusic()

  const [attemptedBefore, setAttemptedBefore] = useState(false);

  const latLngToCartesian = (lat: number, lng: number, radius: number = 0.65) => {
    // Convert to radians
    const latRad = lat * (Math.PI / 180);
    const lngRad = (lng) * -(Math.PI / 180); 
    
    return {
      x: -radius * Math.cos(latRad) * Math.cos(lngRad),
      y: radius * Math.sin(latRad),
      z: radius * Math.cos(latRad) * Math.sin(lngRad)
    };
  };

  const getTextPosition = (lat: number, lng: number, baseRadius: number = 0.65, offset: number = -0.3) => {
    const pos = latLngToCartesian(lat, lng, baseRadius);
    const scale = (baseRadius + offset) / baseRadius;
    return {
      x: pos.x * scale,
      y: pos.y * scale,
      z: pos.z * scale
    };
  };

  const getTextOrientation = (lat: number, lng: number) => {
    const pos = latLngToCartesian(lat, lng, 1);
    const up = new Vector3(0, 1, 0);
    const position = new Vector3(pos.x, pos.y, pos.z);
    const quaternion = new Quaternion();
    position.normalize();
    quaternion.setFromUnitVectors(up, position);
    return quaternion;
  };

  const performAutoClick = useCallback(() => {
    if (isVfxHappening || state.loadingWin) return;
    
    // Generate random coordinates
    const lat = Math.random() * 180 - 90; // -90 to 90
    const lng = Math.random() * 360 - 180; // -180 to 180
    
    // Save the click and adjust longitude based on current rotation
    const adjustedLng = lng - (90 - ($whole.current?.rotation.y * (180 / Math.PI)));
    setPreviousClicks(prev => [...prev, { lat, lng: adjustedLng }]);
    rotSpeed.current += 0.001;

    // Handle the click
    clickedHandler({ lat, lng });
  }, []);

  useEffect(() => {
    if (!hasAutoMoonClick) return;
    
    console.log("Starting auto-click interval");
    performAutoClick(); // Click immediately once
    autoClickInterval.current = setInterval(performAutoClick, 5000);

    return () => {
      console.log("Cleaning up auto-click interval");
      if (autoClickInterval.current) {
        clearInterval(autoClickInterval.current);
        autoClickInterval.current = null;
      }
    };
  }, [hasAutoMoonClick, performAutoClick]);

  return (<>
  <group ref={$wholeReversed}>
    <spotLight
    penumbra={1}
     position={[5,5,5]} intensity={500} distance={15} castShadow />
    {/* <Sphere args={[1.1,8,4]}  >
      <meshStandardMaterial wireframe={true} emissive={"#000000"} color={"#000000"} />
    </Sphere> */}
    {state.inventory.includes("Auto Moon Click") && (
      <Sphere args={[0.15,8,4]}  position={[0,0,3.3]}  onClick={(e)=>{
        e.stopPropagation();
        // auto moon click
        // onGreenClicked()
        // triggerSnackbar(<>
        // <div className="tx-shadow-5">
        //   Moon clicked!
      // </div>
      // </>, "handbook")

    }}>
      <meshStandardMaterial  color={"#aaaaaa"} />
      </Sphere>
    )}
    </group>
  <group ref={$whole}>
    <group ref={$light}></group>
    {previousTargets.map((coords, index) => (
      <group key={index} position={[
        latLngToCartesian(coords.lat, coords.lng,.75).x,
        latLngToCartesian(coords.lat, coords.lng,.75).y,
        latLngToCartesian(coords.lat, coords.lng,.75).z
      ]}>
        {/* <Cylinder args={[0.02,0.02,0.23,8]} rotation={[Math.PI/2,0,0]}
        position={[0,0,.15]}
        >
          <meshStandardMaterial 
            color="#ffffff" 
          />
        </Cylinder> */}
        <Sphere args={[0.035, 8, 8]} onClick={(e) => {
          e.stopPropagation();
          playSoundEffect("/sfx/short/chairsit.mp3")
          triggerSnackbar(<>
            <div className="tx-shadow-5 tx w-200px tx-center">
              {humanDescription(
                { lat: coords.lat, lng: coords.lng },
                { lat: coords.targetLat, lng: coords.targetLng },
                countries
              )}
            </div>
          </>, "handbook");
        }}>
          <meshStandardMaterial 
            color="#ff0000" 
          />
        </Sphere>
      </group>
    ))}
    
    <EarthTextured clickedHandler={state.loadingWin ? (e:any)=>{
      // alert("loadingWin")e
    } : (e)=>{
      clickedHandler(e)
      // Adjust longitude based on current globe rotation
      console.log("e.lng", e.lng, 90-$whole.current?.rotation.y)
      const adjustedLng = e.lng - (90 -($whole.current?.rotation.y*(180/Math.PI)))
      // console.log("adjustedLng", ($whole.current?.rotation.y * 180 / Math.PI || 0))
      // console.log("adjustedLng", adjustedLng)
      setPreviousClicks(prev => [...prev, 
        { lat: e.lat, lng: adjustedLng }
      ])
      rotSpeed.current += 0.001
    }} />
    {previousClicks.map((coords, index) => (
      <group key={`click-${index}`} position={[
        latLngToCartesian(coords.lat, coords.lng,.79).x,
        latLngToCartesian(coords.lat, coords.lng,.79).y,
        latLngToCartesian(coords.lat, coords.lng,.79).z
      ]}>
        <Sphere args={[0.02, 3, 3]}>
          <meshStandardMaterial 
            color="#ffefaa" 
          />
        </Sphere>
      </group>
    ))}
    {targetCoords && (
      <group position={[
        latLngToCartesian(targetCoords.lat, targetCoords.lng, showHelper ? 0.65 : .8).x,
        latLngToCartesian(targetCoords.lat, targetCoords.lng, showHelper ? 0.65 : .8).y,
        latLngToCartesian(targetCoords.lat, targetCoords.lng, showHelper ? 0.65 : .8).z
      ]}>
        <Sphere rotation={[Math.PI/2.6,0,0]}
         args={[ showHelper ? 0.1 : helperSphereSize, 8, 8]} 
          onClick={(e) => {
            e.stopPropagation();
            if (!!isVfxHappening || state.loadingWin) {
              return
            }
            clickedHandler({
              lat: targetCoords.lat,
              lng: targetCoords.lng
            })
            if (!!showHelper) {
              setShowHelper(false)
              // setIsVfxHappening(true)
              if (state.winAttempts == 0) {

                triggerSnackbar(<div className="tx-center flex-col tx-shadow-5">
                  {/* <div className="">{"Findings must be blind"}</div> */}
                  {/* <div className="">{"Helper is off"}</div> */}
                  <div className="">{"Click the same spot again"}</div>
                  <div className="">{"to claim the pin"}</div>
                </div>, "warning")
              }
              // if (true){
              //   playSoundEffect("/sfx/short/chairsit.mp3")
              //   triggerSnackbar(<div className="tx-center flex-col tx-shadow-5">
              //     <div className="">{"DONT click the Helper"}</div>
              //     <div className="">{"Click again"}</div>
              //     <div className="">{"to get the pin"}</div>
              //   </div>, "warning")
              //   setAttemptedBefore(true)
              // }
              // setShowHelper(false)
              return
            };
            setPreviousTargets(prev => [
              ...prev,
              {
                lat: targetCoords.lat,
                lng: targetCoords.lng,
                targetLat: lastClickedCoords?.lat ?? targetCoords.lat,
                targetLng: lastClickedCoords?.lng ?? targetCoords.lng,
                humanString: humanDescription(
                  lastClickedCoords ?? targetCoords,
                  targetCoords,
                  countries
                )
              }
            ]);
            onTargetFound();
            // setHelperSphereSize(prev => Math.max(0.1, prev - 0.01));
          }}
        >
          <meshStandardMaterial 
            color={ showHelper ? "#00ff00" : "#aaffff" } 
            // emissive="#00ff00" 
            // emissiveIntensity={0.3} 
            transparent={true} 
            wireframe={!showHelper ? false : true}
            opacity={ (isVfxHappening || state.loadingWin) ?
               0 : showHelper ? 0.27 : 0.95} 
          />
        </Sphere>
        {showHelper && (
          <Text
            fontSize={0.1}
            color="#ffffff"
            anchorX="center"
            anchorY="bottom"
            outlineWidth={0.02}
            outlineColor="#000000"
            position={[
              getTextPosition(targetCoords.lat, targetCoords.lng).x,
              getTextPosition(targetCoords.lat, targetCoords.lng).y,
              getTextPosition(targetCoords.lat, targetCoords.lng).z
            ]}
            quaternion={getTextOrientation(targetCoords.lat, targetCoords.lng)}
          >
            {`${targetCoords.lat.toFixed(1)}°, ${targetCoords.lng.toFixed(1)}°`}
          </Text>
        )}
      </group>
    )}
  </group>
  </>);
};

export const EarthTextured = ({clickedHandler}:{clickedHandler:(e:any)=>void}) => {
  const bump2 = useTexture("./textures/bump2.jpg");
  const earth_jpg = useTexture("./textures/earthmap1k.jpg");
  
  const cartesianToLatLng = (x: number, y: number, z: number) => {
    const radius = Math.sqrt(x * x + y * y + z * z);
    // Normalize coordinates
    const nx = x / radius;
    const ny = y / radius;
    const nz = z / radius;
    
    // Calculate latitude (-90 to 90)
    const lat = Math.asin(ny) * 180 / Math.PI;
    
    // Calculate longitude (-180 to 180)
    let lng = Math.atan2(nz, nx) * 180 / Math.PI;
    lng = lng - 90; // Adjust to match the texture mapping
    
    // Ensure longitude is in -180 to 180 range
    if (lng > 180) lng -= 360;
    if (lng < -180) lng += 360;
    
    return { lat, lng };
  };

  return (<>
    <Sphere args={[0.7, 64, 64]} castShadow  onClick={(e) => {
      e.stopPropagation();
      const point = e.point;
      const coords = cartesianToLatLng(point.x, point.y, point.z);
      clickedHandler(coords);
    }}>
      <meshStandardMaterial map={earth_jpg}  side={2}
      color={"#ffffff"} emissive={"#112233"}
      displacementScale={.24} displacementMap={bump2} />
    </Sphere>
  </>);
};

"use client";
import { Sphere, useTexture, Billboard, Text, Box } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Vector3, Quaternion } from "three";
import { ComputerModel } from "../core/ComputerModel";
import { useProfileSnackbar } from "@/script/state/context/useProfileSnackbar";

export const WorldModelTextured = ({state, onGreenClicked, targetCoords, onTargetFound, showHelper, clickedHandler, lastClickedCoords  }:any) => {
  const $cloudsWireframe:any = useRef()
  const $light:any = useRef()
  const $whole:any = useRef()
  const $wholeReversed:any = useRef()
  const { triggerSnackbar } = useProfileSnackbar();
  useFrame(()=>{
    if (!$cloudsWireframe.current) return
    if (!$light.current) return
    if (!$whole.current) return
    $cloudsWireframe.current.rotation.y += 0.003
    $light.current.rotation.y += 0.03
    $whole.current.rotation.y += 0.001
    if (!$wholeReversed.current) return
    $wholeReversed.current.rotation.y -= 0.01
    $wholeReversed.current.rotation.x -= 0.006
    $wholeReversed.current.position.y = Math.sin(Date.now()/1000)/10
  })

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

  return (<>
  <group ref={$wholeReversed}>
    <pointLight position={[5,5,5]} intensity={100} />
    {/* <Sphere args={[1.1,8,4]}  >
      <meshStandardMaterial wireframe={true} emissive={"#000000"} color={"#000000"} />
    </Sphere> */}
    <Sphere args={[0.15,8,4]}  position={[0,0,3.3]}  onClick={(e)=>{
      e.stopPropagation();
      onGreenClicked()
      triggerSnackbar(<>
      <div className="tx-shadow-5">
        Moon clicked!
      </div>
      </>, "handbook")

    }}>
      <meshStandardMaterial  color={"#aaaaaa"} />
    </Sphere>
    </group>
    <group position={[0,1.25,-2.2]}>
      <Box args={[1.1 ,.2,.03]} position={[0,-1,0]}>
        <meshStandardMaterial color={"#aa8866"} />
      </Box>
      {lastClickedCoords && (<>
        <Text fontSize={0.1} color="#ffffff"  position={[
        0,-1,0.02
      ]}>
        {`Lat: ${lastClickedCoords.lat.toFixed(1)}° (${(targetCoords.lat - lastClickedCoords.lat).toFixed(1)}°)`}
      </Text>
      <Text 
      rotation={[0,Math.PI,0]}
      fontSize={0.1} color="#ffffff"  position={[
        0,-1,-0.02
      ]}>
        {`Lng: ${lastClickedCoords.lng.toFixed(1)}° (${(targetCoords.lng - lastClickedCoords.lng).toFixed(1)}°)`}
      </Text>
      </>)}
    </group>
  <group ref={$whole}>
    <ambientLight intensity={0.5} />
    <group ref={$light}></group>
    <Sphere args={[.74,16,6,2]} castShadow receiveShadow ref={$cloudsWireframe} >
      <meshStandardMaterial wireframe={true}  color={"#777777"} />
    </Sphere>
      <EarthTextured clickedHandler={clickedHandler} />
      {targetCoords && (
        <group position={[
          latLngToCartesian(targetCoords.lat, targetCoords.lng).x,
          latLngToCartesian(targetCoords.lat, targetCoords.lng).y,
          latLngToCartesian(targetCoords.lat, targetCoords.lng).z
        ]}>
          <Sphere args={[0.3, 32, 32]} 
            onClick={(e) => {
              e.stopPropagation();
              onTargetFound();
            }}
          >
            <meshStandardMaterial 
              color="#00ff00" 
              emissive="#00ff00" 
              emissiveIntensity={0.3} 
              transparent={true} 
              opacity={showHelper ? 0.1 : 0} 
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
    <Sphere args={[0.7, 64, 64]} onClick={(e) => {
      e.stopPropagation();
      const point = e.point;
      const coords = cartesianToLatLng(point.x, point.y, point.z);
      clickedHandler(coords);
    }}>
      <meshStandardMaterial map={earth_jpg} displacementScale={.32} displacementMap={bump2} />
    </Sphere>
  </>);
};

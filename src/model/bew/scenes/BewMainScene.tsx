'use client';
import { useState, useEffect, useCallback, useContext, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, Cylinder, Text } from '@react-three/drei';

import { SolidBox } from '../../core/SolidBox';
import { usePlayerStats } from '../../../../script/contexts/usePlayerStats';

import { ABDoorPortals } from '../../doorwalls/ABDoorPortals';
import { CallibrationSpaces } from '../../rooms/CallibrationSpaces';
import { BCDoorPortals } from '../../doorwalls/BCDoorPortals';

import { MainHallway } from '../../rooms/MainHallway';
import { CommonArea } from '../../rooms/CommonArea';
import { ESPLobby } from '../../rooms/ESPLobby';
import { PsionicHallway } from '../../rooms/PsionicHallway';
import { PortalRoom } from '../../rooms/PortalRoom';

import { BewPortal } from '../../portal/BewPortal';
import { ZuckHead } from '../../bits/ZuckHead';

export const BewMainScene = ({ setPlayerPosition,
  code1,
  code2,
  code3,
  wasFirstDoorOpened,
  onFirstDoorOpened,
  isTakingRequest,
  setIsTakingRequest,
  wasPsionicHallwayEntered,
  setWasPsionicHallwayEntered
}: {
  setPlayerPosition: (position: [number, number, number]) => void, 
  code1?: string, 
  code2?: string, 
  code3?: string,
  wasFirstDoorOpened: boolean,
  onFirstDoorOpened: () => void,
  isTakingRequest: string | null,
  setIsTakingRequest: (value: string | null) => void,
  wasPsionicHallwayEntered: boolean,
  setWasPsionicHallwayEntered: (value: boolean) => void
}) => {

  const {
    LS_playerId,
    LS_lowGraphics,
    hasExploredZone,
    formatPortalUrl,
    LS_hasFirstKey,
    setHasFirstKey
  } =  usePlayerStats()
  const vb_ref = useSearchParams().get("ref")
  // const { hasExploredZone } = usePlayerStats();
  
  // Memoize the handler with useCallback to prevent recreation
  const handleKeyCollection = useCallback((value: boolean) => {
    setHasFirstKey(value);
  }, [setHasFirstKey]);

  return (
    <group position={[0, 0, 0]}>


    {(!!vb_ref || !!hasExploredZone('psionic_asset_zone')) && <>
      <group position={[4.6, 2, 4.25]} rotation={[0,0,0]}>
        <Text fontSize={0.1} color="#404040" position={[0.1,-.2,0.249]}
        font="/fonts/beanie.ttf"
        rotation={[0,Math.PI,0]}
        >
    {`gobekli tepe/solon

  +++Cydonia Valleys

40.75° North
350.54° East`}
        </Text>
        <ZuckHead />
      </group>
    </>}

    {!!vb_ref && <>
      {/* BACK PORTAL */}
      <BewPortal fontSize={0.5}
        position={[2.4,0,1.5]}
        rotation={[0,-Math.PI/2,0]}
        title={vb_ref.split("/").pop()}
        url={formatPortalUrl(vb_ref)}
        portalRadius={2}
        textColor="#777777"
        portalMaterial={<meshStandardMaterial color="#ffaaaa" />}
      />
      {/* VIBEVERSE PORTAL */}
      <Cylinder args={[3, 2, .9, 12, Math.PI]} 
        position={[-3.5,0,1.9]} rotation={[0,0,-Math.PI/2]}
      >
        <meshStandardMaterial color="#ffffff" />
      </Cylinder>
      <BewPortal fontSize={0.5}
        position={[-4,0,1.9]}
        rotation={[0,-Math.PI/2,0]}
        title="portal.pieter.com"
        url={formatPortalUrl("https://portal.pieter.com/")}
        portalRadius={2}
        textColor="#333333"

        portalMaterial={<meshStandardMaterial color="#eeffcc" />}
      />
    </>}



    <MainHallway />

      <PortalRoom />

      <ABDoorPortals setPlayerPosition={setPlayerPosition} 
        hasFirstKey={LS_hasFirstKey} setHasFirstKey={handleKeyCollection}
        onFirstDoorOpened={onFirstDoorOpened}
        openedFirstDoor={wasFirstDoorOpened}
      />

      <BCDoorPortals setPlayerPosition={setPlayerPosition} />
      







      {wasFirstDoorOpened && <>
        <CallibrationSpaces />
      
        <CommonArea />
      </>}

      {wasFirstDoorOpened && <>
        <PsionicHallway wasPsionicHallwayEntered={wasPsionicHallwayEntered} setWasPsionicHallwayEntered={setWasPsionicHallwayEntered} />
        <ESPLobby setPlayerPosition={setPlayerPosition} isTakingRequest={isTakingRequest} setIsTakingRequest={setIsTakingRequest} />  
      </>}





  
      {/* top bevels */}
      <group position={[0, 0, 0]} rotation={[0, 0, 0]}>
        {/* left bevel */}
        <SolidBox  size={[30.5, 1, 1.2]} color="#f7f7f7"
          position={[-3, 3.5, 0]} rotation={[0, Math.PI / 2, 0]} 
        />
        {/* right bevel */}
        <SolidBox 
          size={[30.5, 1, 1.2]} color="#f7f7f7"
          position={[3, 3.5, 0]} rotation={[0, -Math.PI / 2, 0]} 
        />
        {/* outer right bevel */}
        <SolidBox 
          size={[30.5, 1, 1.2]} color="#f7f7f7"
          position={[9, 3.5, 0]} rotation={[0, -Math.PI / 2, 0]} 
        />
      </group>     
      

    </group>
  );
};



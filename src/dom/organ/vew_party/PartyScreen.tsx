'use client';

import React, { useState, useRef, useEffect } from 'react';
import { TopSection } from '../../molecule/game/SenseMeter/TopSection';
import { MiddleSection } from '../../molecule/game/SenseMeter/MiddleSection';
import { BottomSection } from '../../molecule/game/SenseMeter/BottomSection';
import { ExitButton } from '../../molecule/game/SenseMeter/ExitButton';
import { normalizeRotation, buttonColors, buttonTypes } from '@/../script/utils/play/analogHelpers';
import { useAnalogModal } from '../../molecule/game/SenseMeter/useAnalogModal';
import { SenseSectionType } from '@/../script/utils/play/senseMeterTypes';
import { KeyboardBtn } from '@/dom/atom/button/KeyboardBtn';
import { isMobile } from '@/../script/utils/platform/mobileDetection';
import { BewChoiceButton } from '../../bew/BewChoiceButton';
import { MultiOptionInputs } from '../../bew/MultiOptionInputs';
import { NotesInputs } from '../../bew/NotesInputs';
import { SketchInputs, SketchInputsRef } from '../../bew/SketchInputs';
import { BewUserStatsSummary } from '../../bew/BewUserStatsSummary';
import { useBackgroundMusic } from '../../../../script/state/context/BackgroundMusicContext';
import { InputTabs } from '../../bew/InputTabs';
import { FriendCard } from '../../bew/FriendCard';
import { PartyNotesInputs } from './PartyNotesInputs';

// Define input types for better type safety
type InputType = 'sketch' | 'multi-options' | 'notes' | '';

type TargetType = 'object' | 'entity' | 'place' | 'event';

// Define the shape of our options state
type OptionsState = {
  type: TargetType;
  natural: number;
  temp: number;
  light: number;
  color: number;
  solid: number;
};

export const PartyScreen = ({
  room_key,
  ownSubFriendId,
  selectedInputType, setSelectedInputType,
  setEnableLocked, enableLocked, playerRotation = { x: 0, y: 0, z: 0 }, onFullSend,
  absolute = true,
  sharedIdState,
  fullPartyData,
  handleRefresh,
  friendid,
  handleNewTarget,
  fetchPartyData,
  onNotesUpdate
}: {
  room_key: string;
  ownSubFriendId: string;
  selectedInputType: InputType;
  setSelectedInputType: (inputType: InputType) => void;
  setEnableLocked: (enableLocked: boolean) => void;
  enableLocked: boolean;
  playerRotation?: { x: number, y: number, z: number };
  onFullSend: (params: {
    sketch: any;
    notes: any;
    options: {
      type: string;
      natural: number;
      temp: number;
      light: number;
      color: number;
      solid: number;
      confidence: number;
    }
  }, requestId?: string) => void;
  absolute?: boolean;
  sharedIdState: [string | null, (id: string | null) => void]
  fullPartyData: {
    id: string;
    target_code: string;
    friend_list: string[];
    live_data: any
  } | null
  handleRefresh: () => Promise<any>;
  friendid: string;
  handleNewTarget: any;
  fetchPartyData: (id:string) => Promise<any>;
  onNotesUpdate: (newNotes: string) => void;
}) => {

  const [sharedId, setSharedId] = sharedIdState;

  // State management for input types and their values
  const { playSoundEffect } = useBackgroundMusic();
  // Add refresh counter
  const [refreshCounter, setRefreshCounter] = useState(0);
  // Maintain separate states for each input type
  const [sketchValue, setSketchValue] = useState<string>('');
  const [notesValue, setNotesValue] = useState<string>('');
  const [optionsValue, setOptionsValue] = useState<OptionsState>({
    type: 'object',
    natural: 0,
    temp: 0,
    light: 0,
    color: 0,
    solid: 0
  });

  // Initial data loading
  useEffect(() => {
    if (!fullPartyData) return;
    
    let liveData = fullPartyData.live_data;
    // If live_data is a string, parse it
    if (typeof liveData === 'string') {
      try {
        liveData = JSON.parse(liveData);
      } catch (e) {
        console.error('Error parsing live_data:', e);
        return;
      }
    }
    
    if (!liveData) return;

    // Set initial input type if there's live data
    const { sketch, notes, options } = liveData;
    if (sketch) {
      // setSelectedInputType('sketch');
      setSketchValue(sketch);
    }
    if (options) {
      // if (!sketch) setSelectedInputType('notes');
      setOptionsValue(options);
    }
    if (notes) {
      // if (!sketch && !options) setSelectedInputType('notes');
      setNotesValue(notes);
    }

    // setSelectedInputType('notes')
  }, [fullPartyData]);

  // Update input states when fullPartyData changes or refresh is clicked
  useEffect(() => {
    if (!fullPartyData?.live_data) return;
    
    let liveData = fullPartyData.live_data;
    // If live_data is a string, parse it
    if (typeof liveData === 'string') {
      try {
        liveData = JSON.parse(liveData);
      } catch (e) {
        console.error('Error parsing live_data:', e);
        return;
      }
    }

    const { sketch, notes, options } = liveData;
    
    if (sketch !== undefined) setSketchValue(sketch);
    if (notes !== undefined) setNotesValue(notes);
    if (options !== undefined) setOptionsValue(options);
  }, [fullPartyData?.live_data, refreshCounter]);

  const sketchRef = useRef<SketchInputsRef>(null);

  const handleInputTypeChange = (newType: InputType) => {
    // Always save current sketch data before switching
    if (sketchRef.current) {
      const currentData = sketchRef.current.getCurrentData();
      setSketchValue(currentData);
    }
    setSelectedInputType(newType);
  };

  const handleSend = () => {
    // Get the appropriate sketch data
    const currentSketchData = selectedInputType === 'sketch' && sketchRef.current 
      ? sketchRef.current.getCurrentData() 
      : sketchValue;
    
    onFullSend({
      sketch: currentSketchData,
      notes: notesValue,
      options: {
        ...optionsValue,
        confidence: 100
      }
    });
  };

  const handleSendNewTarget = () => {
    // Get the appropriate sketch data
    const currentSketchData = selectedInputType === 'sketch' && sketchRef.current 
      ? sketchRef.current.getCurrentData() 
      : sketchValue;
    
    handleNewTarget({
      sketch: currentSketchData,
      notes: notesValue,
      options: {
        ...optionsValue,
        confidence: 100
      }
    });
  };



  const [isfriendinurl, setIsFriendInUrl] = useState(false);
// useEffect(() => {
//   const urlParams = new URLSearchParams(window.location.search);
//   const friendId = urlParams.get('friend');
//   if (friendId) {
//     setIsFriendInUrl(true);
//     setFriendId(friendId);
//   }
// }, []);
  // Render the appropriate input component based on selected type
  const renderInputComponent = () => {
    switch (selectedInputType) {
      case 'sketch':
        return (
          <SketchInputs 
            ref={sketchRef} 
            onValueChange={(e)=>{
              
              setSketchValue(e)
              // handleSend()

            }}
            initialValue={sketchValue} 
          />
        );
      case 'multi-options':
        return (
          <MultiOptionInputs 
            onValueChange={(e)=>{
              
              setOptionsValue(e)
            }}
            initialValues={optionsValue}
          />
        );
      case 'notes':
        return (
          <PartyNotesInputs 
            room_key={room_key}
            fetchPartyData={fetchPartyData}
            sharedIdState={sharedIdState}
            onNotesUpdate={onNotesUpdate}
            ownSubFriendId={ownSubFriendId}
            onValueChange={(e)=>{
              
              setNotesValue(e)
            }}
            initialValue={notesValue}
          />
        );
      default:
        return null;
    }
  };

  return (<>

<div className='flex-1 w-100'>

<div className='flex-col'>
    {!!selectedInputType && (
      <InputTabs 
        selectedInputType={selectedInputType}
        onInputTypeChange={handleInputTypeChange}
      />
    )}
</div>





{!selectedInputType && (<>

    <div className='flex-row gap-2 px-4 '>
      <div className='flex-1'
        style={{
          height: "2px",
          background: "#E5E5E5",
        }}
      />
      {!selectedInputType && (
        <div style={{ color: "#AFAFAF" }}>Select Input Type</div>
      )}
      {/* {!!selectedInputType && (
        <div style={{ color: "#AFAFAF" }}>
          {selectedInputType === 'sketch' && "Draw anything you see"}
          {selectedInputType === 'multi-options' && "Fill the form"}
          {selectedInputType === 'notes' && "Write your thoughts"}
        </div>
      )} */}
      <div className='flex-1'
        style={{
          height: "2px",
          background: "#E5E5E5",
        }}
      />
    </div>
    </>)}










    {!!selectedInputType && (
      <div className='px-4 py-2'>
        {renderInputComponent()}
      </div>
    )}

    {!!selectedInputType && (
      <>
      

        <div className='px-4 flex-row  gap-4'>
          <div className='tx-white pointer tx-center pa-2 bord-r-10  flex-1'
            onClick={() => {
              handleRefresh();
              setRefreshCounter(prev => prev + 1);
              playSoundEffect("/sfx/short/passbip.mp3");
            }}
            style={{ 
              boxShadow: "0 4px 0 #6BCF69",
              background: "#80DB7D"
             }}
          >
            <div>⬇️ Re-sync</div>
          </div>
          <div className='tx-white pointer tx-center pa-2 bord-r-10  flex-1'
            onClick={handleSend}
            style={{ 
              boxShadow: "0 4px 0 #6B69CF",
              background: "#807DDB"
             }}
          >
            <div>🔔 Update</div>
          </div>
        </div>
      </>
    )}

    {!selectedInputType && (
      <div className='flex-wrap flex-justify-center gap-4 w-100 pt-8'>
        <div className='mt-100'>
          <BewChoiceButton
            secondaryColor="#34BE37"
            mainColor="#7DDB80"
            onClick={() => {
              playSoundEffect("/sfx/short/passbip.mp3")
              handleInputTypeChange('sketch')
            }}
            text="Sketch"
            image={<div><span role="img" aria-label="pen">🖌️</span></div>}
          />
        </div>

        <div>
          <BewChoiceButton
            secondaryColor="#D07900"
            mainColor="#FF9600"
            onClick={() => {
              playSoundEffect("/sfx/short/passbip.mp3")
              handleInputTypeChange('multi-options')
            }}
            text="Multi-Options"
            image={<div>⭐</div>}
          />
        </div>

        <div className='mt-100'>
          <BewChoiceButton
            secondaryColor="#C93E3A"
            mainColor="#DB807D"
            onClick={() => {
              playSoundEffect("/sfx/short/passbip.mp3")
              handleInputTypeChange('notes')
            }}
            text="Notes"
            image={<div><span role="img" aria-label="page">📄</span></div>}
          />
        </div>
      </div>
    )}


</div>
    {true && (
      <div className='w-100  pos-abs-bottom  flex-col flex-justify-end pb-8 mb-4'>
        





{/* {!isfriendinurl && (<InviteFriendCard />)}
  {!!isfriendinurl && (<FriendCard friendid={friendid} />)} */}






{true && (<>

<div className='w-80  '>



  <div className='flex-row flex-justify-center flex-align-stretch tx-altfont-2  gap-2'>
      <a 
      href="/tool"
      className='tx- lg pa-1 px-2  bord-r-15 opaci-chov--50 flex-row nodeco'
      style={{
        border: "2px solid #ccaaaa",
      }}
      onClick={(e) => {
        e.preventDefault();
        handleSendNewTarget();
      }}
      >
        {/* plus emoji */}
        {/* <div className='tx-l tx-center'>➕</div> */}
        <div className='tx-bold-5 tx-center' style={{ color: "#ff4b4b" }}>
          ❌
          </div>
          <div className='tx-bold-5 tx-center' style={{ color: "#ff4b4b" }}>
          End Party
        </div>
      </a>
      <a 
      href={"/u?friend=" + friendid}
      className='tx- lg pa-1 px-3  bord-r-10 opaci-chov--50 flex-wrap nodeco'
      style={{
        border: "1px solid #E5E5E5",
      }}
      >
        <div className='tx-bold-5 tx-center' style={{ color: "#4b4b4b" }}>
          Friend&apos;s <br /> Profile
        </div>
      </a>
      <div 
      className='tx- lg pa-1 px-2  bord-r-10 opaci-chov--50 flex-wrap nodeco'
      style={{
        border: "1px solid #45af45",
      }}
      onClick={(e) => {
        e.preventDefault();
        handleSendNewTarget();
      }}
      >
        {/* green checkmark emoji */}
        {/* <div className='tx-l tx-center'>➕</div> */}

        <div className='tx-bold-5 tx-center' style={{ color: "#2baa2b" }}> 
          <span role="img" aria-label="check">✅</span>
          New Target
        </div> 
      </div>
      {/* <a href="/dashboard#resources"
      style={{
        border: "1px solid #E5E5E5",
      }}
      className='tx- lg pa-2 mt -2 bord-r-10  opaci-chov--50 flex-wrap nodeco'
      >
        <div className='tx-bold-5 tx-center' style={{ color: "#4b4b4b" }}>Auto <br /> Refresh</div>
      </a> */}
    </div>

    </div> </>
  )}




      </div>
    )}
  </>);
};





export const WaitingRoom = ({

  friendList, friendListString, sharedIdState, room_key, setRoom_key
}: {
  friendList: string[],
  friendListString: string,
  sharedIdState: [string | null,
    (id: string | null) => void]
  room_key: string | null,
  setRoom_key: (key: string | null) => void
}) => {

const [sharedId, setSharedId] = sharedIdState;  

useEffect(() => {
  if (!!sharedId) { return }

  const fetchPartyId = async () => {
    try {
      const response = await fetch(`/api/party/findOrCreate?room_key=${friendListString}`);
      const data = await response.json();
      
        console.log('data', data);
      if (data.id) {
        setSharedId(data.id);
        console.log('data.room_key', data.room_key);
        setRoom_key(data.room_key);
      }
    } catch (error) {
      console.error('Error fetching or creating party ID:', error);
    }
  };

  fetchPartyId();
}, [friendListString]);

  return (<>
  <div className="flex-col tx-altfont-2 pt-100 gap-4">
  <div className='tx-center hover-4 opaci-20'>Waiting for party <br /> syncronization...</div>
{!!sharedId && (<>
  <div className='tx-center hover-4 opaci-20'>Found Room Key: {sharedId} <br /> Loading party data...</div>
</>)}

  <div className='flex-col pa-8 mt-8 bord-r-25'
  style={{
    border: "1px solid #E5E5E5",
    boxShadow: "0 4px 0 2px #cccccc",
  }}
  >
    {friendList.map((friend, index) => (
      <div
      style={{color:"#777777"}}
       className='tx-center tx-lx py-1 tx-altfont-8' key={index}>
        {friend}
        {/* if not last, add a line  */}
        {index !== friendList.length - 1 && (
          <div className='w-100 my-4'
          style={{
            height: "1px",
            background: "#E5E5E5",
          }}
          />
        )}
      </div>
    ))}
  </div>
  </div>
  </>);
};



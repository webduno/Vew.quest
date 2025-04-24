'use client';
import React, { useState, useRef, useEffect } from 'react';

import { isMobile } from '@/../script/utils/platform/mobileDetection';
import { useBackgroundMusic } from '@/../script/state/context/BackgroundMusicContext';
import { useProfileSnackbar } from '@/script/state/context/useProfileSnackbar';

import { BewChoiceButton } from '../../bew/BewChoiceButton';
import { MultiOptionInputs } from '../../bew/MultiOptionInputs';
import { NotesInputs } from '../../bew/NotesInputs';
import { SketchInputs, SketchInputsRef } from '../../bew/SketchInputs';
import { InputTabs } from '../../bew/InputTabs';
import { FriendCard } from '../../bew/FriendCard';
import { InviteFriendCard } from '../../bew/InviteFriendCard';


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

export const VewPanelTool = ({
  setEnableLocked, enableLocked, playerRotation = { x: 0, y: 0, z: 0 }, onFullSend,
  absolute = true
}: {
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
}) => {

  // State management for input types and their values
  const [selectedInputType, setSelectedInputType] = useState<InputType>('');
  const { playSoundEffect } = useBackgroundMusic();
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

  const sketchRef = useRef<SketchInputsRef>(null);

  const handleInputTypeChange = (newType: InputType) => {
    // Always save current sketch data before switching
    if (selectedInputType === 'sketch' && sketchRef.current) {
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
  const { triggerSnackbar } = useProfileSnackbar();
  const [isfriendinurl, setIsFriendInUrl] = useState(false);
  const [friendid, setFriendId] = useState('');
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const friendId = urlParams.get('friend');
  if (friendId) {
    setIsFriendInUrl(true);
    setFriendId(friendId);
  }
}, []);
  // Render the appropriate input component based on selected type
  const renderInputComponent = () => {
    switch (selectedInputType) {
      case 'sketch':
        return (
          <SketchInputs 
            ref={sketchRef} 
            onValueChange={(e)=>{
              
              setSketchValue(e)
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
          <NotesInputs 
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

{selectedInputType === 'sketch' && (
      optionsValue.natural === 0 && optionsValue.temp === 0 && optionsValue.light === 0 && optionsValue.color === 0 && optionsValue.solid === 0
    ) && (
      <>
      

        <div className='px-4'>
          <div className='tx-white pointer tx-center pa-2 bord-r-10 mt-4'
            onClick={()=>{
              // early return and triggersnackbar if multi-options are 0
              // if(selectedInputType !== 'multi-options' && optionsValue.natural === 0 && optionsValue.temp === 0 && optionsValue.light === 0 && optionsValue.color === 0 && optionsValue.solid === 0){
              //   triggerSnackbar("Please, attempt to fill the multi-options form", "error")
                setSelectedInputType('multi-options')
              //   return
              // }
              
              
              // handleSend()
            }}
            style={{ 
              boxShadow: "0 4px 0 #6B69CF",
              background: "#807DDB"
             }}
          >
            <div>Continue</div>
          </div>
        </div>
      </>
    )}


{!!selectedInputType &&!( selectedInputType === 'sketch' && (
      optionsValue.natural === 0 && optionsValue.temp === 0 && optionsValue.light === 0 && optionsValue.color === 0 && optionsValue.solid === 0
    )) && (
      <>
      

        <div className='px-4'>
          <div className='tx-white pointer tx-center pa-2 bord-r-10 mt-4'
            onClick={handleSend}
            style={{ 
              boxShadow: "0 4px 0 #6B69CF",
              background: "#807DDB"
             }}
          >
            <div>End Remote Viewing</div>
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
    {!selectedInputType && (
      <div className='    flex-col flex-justify-end mt-100'>
        





{!isfriendinurl && (<InviteFriendCard />)}
  {!!isfriendinurl && (<FriendCard friendid={friendid} />)}

  </div>
    )}





      <div className='w-100    flex-col flex-justify-end pb-8 mb-4'>
      {!!isMobile() && (<>

<details className='w-80  flex-col pos-rel'>
<summary className='flex-row gap-2  w-80 py-4 pointer w-100'>




      <div className='flex-1 w-100'
        style={{
          height: "2px",
          background: "#E5E5E5",
        }}
      />
      {(
        <div 
        className='tx-bol d'
        style={{ color: "#AFAFAF" }}>
          {/* down caret emoji */}
          ▲ More Options</div>
      )}
      <div className='flex-1'
        style={{
          height: "2px",
          background: "#E5E5E5",
        }}
      />
    </summary>



  <div className='flex-row flex-justify-center pa-2 bord-r-10 tx-altfont-2 left-50p    top-0 bg-white gap-2 pos-abs z-1000'
  style={{
    border: "1px solid #E5E5E5",
    transform: "translate(-50%, -100%)",
  }}
  >
      <a href="/dashboard#resources"
      style={{
        border: "1px solid #E5E5E5",
      }}
      className='tx- lg pa-2 mt -2 bord-r-10  opaci-chov--50 flex-wrap nodeco'
      >
        {/* books emoji */}
        <div className='tx-lg tx-center'>📚</div>
        <div className='tx-bold-5' style={{ color: "#4b4b4b" }}>{"Assets"}</div>
      </a>
      <a 
      href="/world"
      className='tx- lg pa-2  bord-r-10 opaci-chov--50 flex-wrap nodeco'
      style={{
        border: "1px solid #E5E5E5",
      }}
      >
        {/* target emoji */}
        <div className='tx-lg tx-center'>🛣️</div>
        <div className='nowrap tx-bold-5' style={{ color: "#4b4b4b" }}>3D World</div>
      </a>
      <a 
      href="/leaderboard"
      className='tx- lg pa-2  bord-r-10 opaci-chov--50 flex-wrap nodeco'
      style={{
        border: "1px solid #E5E5E5",
      }}
      >
        {/* user emoji */}
        <div className='tx-lg tx-center'>🏆</div>
        <div className='tx-bold-5' style={{ color: "#4b4b4b" }}>Ranking</div>
      </a>
    </div>

    </details> </>
  )}




      </div>
  </>);
};






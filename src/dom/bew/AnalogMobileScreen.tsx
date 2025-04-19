'use client';

import React, { useState, useRef } from 'react';
import { TopSection } from '../molecule/game/SenseMeter/TopSection';
import { MiddleSection } from '../molecule/game/SenseMeter/MiddleSection';
import { BottomSection } from '../molecule/game/SenseMeter/BottomSection';
import { ExitButton } from '../molecule/game/SenseMeter/ExitButton';
import { normalizeRotation, buttonColors, buttonTypes } from '@/../script/utils/play/analogHelpers';
import { useAnalogModal } from '../molecule/game/SenseMeter/useAnalogModal';
import { SenseSectionType } from '@/../script/utils/play/senseMeterTypes';
import { KeyboardBtn } from '@/dom/atom/button/KeyboardBtn';
import { isMobile } from '@/../script/utils/platform/mobileDetection';
import { BewChoiceButton } from './BewChoiceButton';
import { MultiOptionInputs } from './MultiOptionInputs';
import { NotesInputs } from './NotesInputs';
import { SketchInputs, SketchInputsRef } from './SketchInputs';

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

export const AnalogMobileScreen = ({
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

  // Render the appropriate input component based on selected type
  const renderInputComponent = () => {
    switch (selectedInputType) {
      case 'sketch':
        return (
          <SketchInputs 
            ref={sketchRef} 
            onValueChange={setSketchValue}
            initialValue={sketchValue} 
          />
        );
      case 'multi-options':
        return (
          <MultiOptionInputs 
            onValuesChange={setOptionsValue}
            initialValues={optionsValue}
          />
        );
      case 'notes':
        return (
          <NotesInputs 
            onValueChange={setNotesValue}
            initialValue={notesValue}
          />
        );
      default:
        return null;
    }
  };

  return (<>
    {!!selectedInputType && (
      <div className='flex-row flex-justify-around mb-4'
        style={{
          color: "#AFAFAF",
        }}
      >
        <div className='py-2 px-4 bord-r-10 opaci-chov--75 '
          onClick={() => handleInputTypeChange('sketch')}
          style={{
            border: selectedInputType === 'sketch' ? "1px solid #7DDB80" : "1px solid #afafaf",
            color: selectedInputType === 'sketch' ? "#7DDB80" : "#afafaf"
          }}
        >
          Sketch
        </div>
        <div className='py-2 px-4 bord-r-10 opaci-chov--75 '
          onClick={() => handleInputTypeChange('multi-options')}
          style={{
            border: selectedInputType === 'multi-options' ? "1px solid #807DDB" : "1px solid #afafaf",
            color: selectedInputType === 'multi-options' ? "#807DDB" : "#afafaf"
          }}
        >
          Multi-Options
        </div>
        <div className='py-2 px-4 bord-r-10 opaci-chov--75 '
          onClick={() => handleInputTypeChange('notes')}
          style={{
            border: selectedInputType === 'notes' ? "1px solid #DB807D" : "1px solid #afafaf",
            color: selectedInputType === 'notes' ? "#DB807D" : "#afafaf"
          }}
        >
          Notes
        </div>
      </div>
    )}

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
      {!!selectedInputType && (
        <div style={{ color: "#AFAFAF" }}>
          {selectedInputType === 'sketch' && "Draw anything you see"}
          {selectedInputType === 'multi-options' && "Fill the form"}
          {selectedInputType === 'notes' && "Write your thoughts"}
        </div>
      )}
      <div className='flex-1'
        style={{
          height: "2px",
          background: "#E5E5E5",
        }}
      />
    </div>

    {!!selectedInputType && (
      <div className='pa-4'>
        {renderInputComponent()}
      </div>
    )}

    {!!selectedInputType && (
      <>
        <div className='flex-row gap-2 px-4 '>
          <div className='flex-1'
            style={{
              height: "2px",
              background: "#E5E5E5",
            }}
          />
          <div style={{ color: "#AFAFAF" }}>
            Finish Session
          </div>
          <div className='flex-1'
            style={{
              height: "2px",
              background: "#E5E5E5",
            }}
          />
        </div>

        <div className='px-4'>
          <div className='tx-white pointer tx-center pa-2 bord-r-10 mt-4'
            onClick={handleSend}
            style={{ background: "#303DeB" }}
          >
            <div>End Remote Viewing</div>
          </div>
        </div>
      </>
    )}

    {!selectedInputType && (
      <div className='flex-wrap flex-justify-around w-100 pt-100'>
        <div className='mt-8'>
          <BewChoiceButton
            secondaryColor="#34BE37"
            mainColor="#7DDB80"
            onClick={() => handleInputTypeChange('sketch')}
            text="Sketch"
            image={<div><span role="img" aria-label="pen">🖌️</span></div>}
          />
        </div>

        <div>
          <BewChoiceButton
            secondaryColor="#5B59AF"
            mainColor="#807DDB"
            onClick={() => handleInputTypeChange('multi-options')}
            text="Multi-Options"
            image={<div>⭐</div>}
          />
        </div>

        <div className='mt-8'>
          <BewChoiceButton
            secondaryColor="#C93E3A"
            mainColor="#DB807D"
            onClick={() => handleInputTypeChange('notes')}
            text="Notes"
            image={<div><span role="img" aria-label="page">📄</span></div>}
          />
        </div>
      </div>
    )}
  </>);
};




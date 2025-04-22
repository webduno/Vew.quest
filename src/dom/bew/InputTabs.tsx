import React from 'react';
import { useBackgroundMusic } from '../../../script/state/context/BackgroundMusicContext';

type InputType = 'sketch' | 'multi-options' | 'notes' | '';

interface InputTabsProps {
  selectedInputType: InputType;
  onInputTypeChange: (newType: InputType) => void;
}

export const InputTabs: React.FC<InputTabsProps> = ({ selectedInputType, onInputTypeChange }) => {
  const { playSoundEffect } = useBackgroundMusic();

  return (
    <div className='flex-row w-100  flex-justify-around w-max-700px mb- ' id="input-tabs"
      style={{
        alignSelf: "center",
        color: "#AFAFAF",
      }}
    >
      <div className='py-2 px-3 bord-r-10 opaci-chov--75 '
        onClick={() => {
          playSoundEffect("/sfx/short/passbip.mp3")
          onInputTypeChange('sketch')
        }}
        style={{
          border: selectedInputType === 'sketch' ? "1px solid #7DDB80" : "1px solid #afafaf",
          color: selectedInputType === 'sketch' ? "#7DDB80" : "#afafaf"
        }}
      >
        Sketch
      </div>
      <div className='py-2 px-3 bord-r-10 opaci-chov--75 '
        onClick={() => {
          playSoundEffect("/sfx/short/passbip.mp3")
          onInputTypeChange('multi-options')
        }}
        style={{
          border: selectedInputType === 'multi-options' ? "1px solid #FF9600" : "1px solid #afafaf",
          color: selectedInputType === 'multi-options' ? "#FF9600" : "#afafaf"
        }}
      >
        Multi-Options
      </div>
      <div className='py-2 px-3 bord-r-10 opaci-chov--75 '
        onClick={() => {
          playSoundEffect("/sfx/short/passbip.mp3")
          onInputTypeChange('notes')
        }}
        style={{
          border: selectedInputType === 'notes' ? "1px solid #DB807D" : "1px solid #afafaf",
          color: selectedInputType === 'notes' ? "#DB807D" : "#afafaf"
        }}
      >
        Notes
      </div>
    </div>
  );
}; 
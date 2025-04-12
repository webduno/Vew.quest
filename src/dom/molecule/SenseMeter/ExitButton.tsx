import React from 'react';
import { isMobile } from '../../../../scripts/utils/mobileDetection';

type SectionType = 'buttons' | 'natural' | 'temp' | 'sliders' | 'meter' | 'send';

interface ExitButtonProps {
  activeSection: SectionType;
  activeButtonIndex: number;
  gaugeValues: number[];
  sliderValues: number[];
  meterValue: number;
  buttonTypes: string[];
  onSend: (params: {
    type: string;
    natural: number;
    temp: number;
    light: number;
    color: number;
    solid: number;
    confidence: number;
  }) => void;
  setActiveSection: (section: SectionType) => void;
  modalRef: React.RefObject<HTMLDivElement>;
}

export const ExitButton: React.FC<ExitButtonProps> = ({
  activeSection,
  activeButtonIndex,
  gaugeValues,
  sliderValues,
  meterValue,
  buttonTypes,
  onSend,
  setActiveSection,
  modalRef
}) => {
  return (
    <div className='pos-abs top-0 right-0 mr-4 pt-4 flex-col flex-justify-end flex-align-end'>
      <div 
        className=' px-2 bord-r-5 border-white opaci-chov--50'
        onClick={() => {
          if (activeSection === 'send') {
            onSend({
              type: buttonTypes[activeButtonIndex],
              natural: gaugeValues[0],
              temp: gaugeValues[1],
              light: sliderValues[0],
              color: sliderValues[1],
              solid: sliderValues[2],
              confidence: meterValue
            });
          } else {
            setActiveSection('send');
            if (modalRef.current) {
              modalRef.current.focus();
            }
          }
        }}
        style={{
          background: '#333333',
          color: activeSection === 'send' ? '#55ff55' : '#ff5555',
          border: activeSection === 'send' ? '2px solid white' : '',
          transform: activeSection === 'send' ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
      >
        SEND
      </div>
      {activeSection === 'send' && !isMobile() &&
        <div className='tx-xs tx-center tx-white  bord-r-5  pt-1'>
          SPACEBAR TO SEND
        </div>
      }
    </div>
  );
}; 
import React from 'react';
import { ControlButton } from './parts/ControlButton';
import { SectionType } from './types';

interface TopLeftSectionProps {
  activeButtonIndex: number;
  activeSection: SectionType;
  buttonColors: string[];
  buttonTypes: string[];
  setActiveButtonIndex: (index: number) => void;
  setActiveSection: (section: SectionType) => void;
  modalRef: React.RefObject<HTMLDivElement>;
}

export const TopLeftSection: React.FC<TopLeftSectionProps> = ({
  activeButtonIndex,
  activeSection,
  buttonColors,
  buttonTypes,
  setActiveButtonIndex,
  setActiveSection,
  modalRef
}) => {
  return (
    <div className='flex-col'>
      <div className='tx-sm pb-1 flex-row flex-justify-start gap-1 w-100'>
        <div className='opaci-50'>Type:</div>
        <div>{buttonTypes[activeButtonIndex]}</div>
      </div>
      <div className='flex-wrap pa-1 bord-r-5' 
        style={{
          border: activeSection === 'buttons' ? '1px solid #ff3300' : '1px solid transparent',
          background: '#7d807d'
        }}
      >
        {buttonColors.map((color, index) => (
          <ControlButton 
            key={index}
            color={color}
            isActive={activeButtonIndex === index}
            onClick={() => {
              setActiveButtonIndex(index);
              setActiveSection('buttons');
              if (modalRef.current) {
                modalRef.current.focus();
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}; 
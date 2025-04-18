import React from 'react';
import { ControlButton } from './parts/ControlButton';
import { SenseSectionType } from '@/../script/utils/play/senseMeterTypes';

interface TopLeftSectionProps {
  activeButtonIndex: number;
  activeSection: SenseSectionType;
  buttonColors: string[];
  buttonTypes: string[];
  setActiveButtonIndex: (index: number) => void;
  setActiveSection: (section: SenseSectionType) => void;
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
        <div className='opaci-50 tx-xs'>Type:</div>
        <div className='tx-shadow-5'>{buttonTypes[activeButtonIndex]}</div>
      </div>
      <div className='flex-wrap pa-1 gap-1 w-max-80px' 
        style={{
          background: 'linear-gradient(-45deg, #8d908d 40%, #666666)',
          borderRadius: '3px',
          boxShadow: (
            activeSection !== 'buttons' ? (
              " -1px -1px 1px 1px #444444,  2px 2px 1px 1px #bbbbbb, inset 3px 3px 8px #555555 "
            ) : (
              "0 0 5px 1px #bb7777, 1px 1px 1px 1px #444444,  -2px -2px 1px 1px #bbbbbb, inset -3px -3px 8px #555555 "
            )
          ),

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
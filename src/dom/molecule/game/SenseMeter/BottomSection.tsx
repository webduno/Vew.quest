import React from 'react';
import { LargeSemicircularMeter } from './parts/LargeSemicircularMeter';
import { SenseSectionType } from '@/../script/utils/play/senseMeterTypes';

interface BottomSectionProps {
  activeSection: SenseSectionType;
  meterValue: number;
  meterRef: React.RefObject<HTMLDivElement>;
  handleMeterClick: (e: React.MouseEvent) => void;
}

export const BottomSection: React.FC<BottomSectionProps> = ({
  activeSection,
  meterValue,
  meterRef,
  handleMeterClick
}) => {
  return (
    <div className='flex-col w-100'>
      <div 
        ref={meterRef}
        onClick={handleMeterClick}
        style={{ 
          width: '100%', 
          cursor: activeSection === 'meter' ? 'pointer' : 'default',
          borderRadius: '5px',
          zIndex: 29000,
        }}
      >
        <LargeSemicircularMeter value={meterValue} isActive={activeSection === 'meter'} />
      </div>
      <div className='px-4 mt-1 tx-xs tx-center tx-white pa-1  ' 
      style={{ background: '#2d302d',
        borderRadius: '0 0 5px 5px',
      }}
      >
        CONFIDENCE: {meterValue}%
      </div>

    </div>
  );
}; 
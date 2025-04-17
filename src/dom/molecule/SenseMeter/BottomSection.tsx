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
      <div className='px-4 mt-1 tx-xs tx-center tx-white pa-1 bord-r-5 ' style={{ background: '#2d302d'}}>
        CONFIDENCE: {meterValue}%
      </div>

      <div className='pos-abs bottom-0 left-0 flex-row gap-1 pa-3'
        style={{
          paddingBottom: "12px"
        }}
      >
        <div className='border-white bord-r-100 bg-b-90'>
          <div className='flicker-5 _ddg pl-1 pt-1 bord-r-100'></div>
        </div>
        <div>
          <div className='pa-2 bg-b-50 bord-r-100 pos-rel flex-col'>
            <div className='tx-white pos-abs tx-lg'
              style={{color: '#aaaaaa',paddingBottom: "4px"}}
            >+</div>
          </div>
        </div>
      </div>
      
      <div className='pos-abs bottom-0 right-0 flex-row gap-1 pa-3'>
        <div className='border-white bord-r-100 bg-b-90'>
          <div className='flicker-3 _ddb pl-1 pt-1 bord-r-100'></div>
        </div>
        <div className='border-white bord-r-100 bg-b-90'>
          <div className='flicker-5 _ddg pl-1 pt-1 bord-r-100'></div>
        </div>
        <div className='border-white bord-r-100 bg-b-50'>
          <div className='flicker-2 _ddr pl-1 pt-1 bord-r-100'></div>
        </div>
      </div>
    </div>
  );
}; 
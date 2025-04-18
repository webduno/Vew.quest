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

      <div className='pos-abs bottom-0 left-0 flex-row gap-1 pa-3'
        style={{
          paddingBottom: "12px"
        }}
      >
        <div className=' bord-r-100 bg-b-90'
        style={{
          boxShadow:"-1px -1px 2px #333333, 1px 1px 2px #cccccc",
          border: "1px solid #77aa77"
        }}
        >
          <div className='flicker-5 _ddg pl-1 pt-1 bord-r-100'></div>
        </div>
        <div>
          <div className='pa-2 bg-b-40 bord-r-100 pos-rel flex-col'
          style={{boxShadow:"inset -1px -1px 8px #333333"}}
          >
            <div className='tx-white pos-abs tx-lg'
              style={{
                color: '#aaaaaa',paddingBottom: "4px",
              }}
            >+</div>
          </div>
        </div>
      </div>
      
      <div className='pos-abs bottom-0 right-0 flex-row gap-1 pa-3'>
        <div className=' bord-r-100 bg-b-90'
        style={{boxShadow:"inset -1px -1px 0 #000000"}}
        >
          <div className='flicker-3 _ddb pl-1 pt-1 bord-r-100'></div>
        </div>
        <div className=' bord-r-100 bg-b-90'
        style={{boxShadow:"inset -1px -1px 0 #000000"}}
        >
          <div className='flicker-5 _ddg pl-1 pt-1 bord-r-100'></div>
        </div>
        <div className=' bord-r-100 bg-b-50'
        style={{boxShadow:"inset -1px -1px 0 #000000"}}
        >
          <div className='flicker-2 _ddr pl-1 pt-1 bord-r-100'></div>
        </div>
      </div>
    </div>
  );
}; 
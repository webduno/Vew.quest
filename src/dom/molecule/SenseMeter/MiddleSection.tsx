import React from 'react';
import { SliderBar } from './parts/SliderBar';
import { CircularMeter } from './parts/CircularMeter';
import { SectionType } from './types';

interface MiddleSectionProps {
  activeSection: SectionType;
  sliderValues: number[];
  setActiveSection: (section: SectionType) => void;
  setSliderValues: (values: number[] | ((prev: number[]) => number[])) => void;
  modalRef: React.RefObject<HTMLDivElement>;
}

export const MiddleSection: React.FC<MiddleSectionProps> = ({
  activeSection,
  sliderValues,
  setActiveSection,
  setSliderValues,
  modalRef
}) => {
  return (
    <div className='w-100  flex-row gap-2 mb-1'>
      <div className='flex-1 pa-1 flex-col w-100 ' style={{ 
        background: '#adb0ad', 
      }}>
        <div className='flex-row flex-justify-around w-100 gap-1'>
          <div className='bg-b-20 bord-r-5 h-50px box-shadow-i-5'>
            <div className='translate-y--25'>
              <div className='hover-4  tx-xl tx-shadow-5'
                style={{ color: '#ff9900' }}
              >.</div>
            </div>
          </div>
          {[
            { label: "Light", section: 'light' as const, index: 0 },
            { label: "Color", section: 'color' as const, index: 1 },
            { label: "Solid", section: 'solid' as const, index: 2 }
          ].map(({ label, section, index }) => (
            <div className='bord-r-5' 
              key={index}
              style={{ 
                border: activeSection === section ? '1px solid #ff3333' : '1px solid transparent'
              }}
              onClick={() => {
                setActiveSection(section);
                if (modalRef.current) {
                  modalRef.current.focus();
                }
              }}
            >
              <div className=' tx-white pos-abs tx-xsm opaci-75'
                style={{
                  transform: 'rotate(-90deg) translate(-100%, -180%)'
                }}
              >
                <div className="flex-col pos-rel">
                  {activeSection === section &&
                    <div className=' pos-abs left-0 translate-x--100 tx-bold'
                      style={{
                        color: '#ff0000'
                      }}
                    >→</div>
                  }
                  <div>{label}</div>
                </div>
              </div>
              <div className=' bord-r-5 noverflow'>
                <SliderBar 
                  sliderPosition={sliderValues[index]} 
                  onSliderClick={(value) => {
                    setSliderValues(prev => {
                      const newValues = [...prev];
                      // Convert 0-100 value to 0-80 range for consistency with existing implementation
                      newValues[index] = Math.round((value / 100) * 80);
                      return newValues;
                    });
                    if (modalRef.current) {
                      modalRef.current.focus();
                    }
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='flex-col gap-1'>
        <CircularMeter needleRotation={20} />
        <CircularMeter needleRotation={300} />
      </div>
    </div>
  );
}; 
import React from 'react';
import { SliderBar } from './parts/SliderBar';
import { CircularMeter } from './parts/CircularMeter';
import { SenseSectionType } from '@/../script/utils/play/senseMeterTypes';

interface MiddleSectionProps {
  activeSection: SenseSectionType;
  sliderValues: number[];
  setActiveSection: (section: SenseSectionType) => void;
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
        boxShadow: 'inset -1px -1px 2px #444444, inset 1px 1px 2px #cccccc'
      }}>
        <div className='flex-row flex-justify-around w-100 gap-1 py-1'>
          <div className=' bord-r-100 h-50px box-shadow-i-5'
            style={{
              background: 'linear-gradient(90deg, #999999 45%, #666666 50%, #999999 55%)',
            }}
          >
            <div className=' px-1'
              style={{
                transform: 'translateY(150%)'
              }}
            >
              <div className='hover-4  tx-xl pa-1 bord-r-100'
                style={{
                  boxShadow: 'inset -2px -2px 3px #000000',
                  background: '#ee9955' }}
              ></div>
            </div>
          </div>
          {[
            { label: "Light", section: 'light' as const, index: 0 },
            { label: "Color", section: 'color' as const, index: 1 },
            { label: "Solid", section: 'solid' as const, index: 2 }
          ].map(({ label, section, index }) => (
            <div className='' 
              key={index}
              style={{ 
                borderRadius: '2px',
                boxShadow: activeSection === section ? '0 10px 5px -5px #ff0000, 0 -10px 5px -5px #ff0000' : '0 7px 1px -3px #777777, 0 -7px 1px -3px #777777'
              }}
              onClick={() => {
                setActiveSection(section);
                if (modalRef.current) {
                  modalRef.current.focus();
                }
              }}
            >
              <div className='  pos-abs tx-xsm opaci-75'
                style={{
                  color: '#555555',
                  transform: 'rotate(-90deg) translate(-100%, -180%)'
                }}
              >
                <div className="flex-col pos-rel">
                  {activeSection === section &&
                    <div className=' tx-ls-1 pl-1 pos-abs right-0 translate-x-100 tx-bold'
                      style={{
                        color: '#aa   0000'
                      }}
                    >{sliderValues[index]}</div>
                  }
                  <div className='tx-xsm'>{label}</div>
                </div>
              </div>
              <div className=' bord- noverflow'
                style={{
                  borderRadius: '2px'
                }}
              >
                <SliderBar 
                  sliderPosition={sliderValues[index]} 
                  onSliderClick={(value) => {
                    setSliderValues(prev => {
                      const newValues = [...prev];
                      newValues[index] = value;
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
      <div className='flex-col gap-3'>
        <CircularMeter needleRotation={20} />
        <CircularMeter needleRotation={300} />
      </div>
    </div>
  );
}; 
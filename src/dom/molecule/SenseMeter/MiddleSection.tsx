import React from 'react';
import { SliderBar } from './parts/SliderBar';
import { CircularMeter } from './parts/CircularMeter';

type SectionType = 'buttons' | 'natural' | 'temp' | 'sliders' | 'meter' | 'send';

interface MiddleSectionProps {
  activeSection: SectionType;
  activeSliderIndex: number;
  oscillationValue: number;
  sliderValues: number[];
  setActiveSection: (section: SectionType) => void;
  setActiveSliderIndex: (index: number) => void;
  setOscillationValue: (value: number) => void;
  setSliderValues: (values: number[] | ((prev: number[]) => number[])) => void;
  modalRef: React.RefObject<HTMLDivElement>;
}

export const MiddleSection: React.FC<MiddleSectionProps> = ({
  activeSection,
  activeSliderIndex,
  oscillationValue,
  sliderValues,
  setActiveSection,
  setActiveSliderIndex,
  setOscillationValue,
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
          {["Light", "Color", "Solid"].map((label, index) => (
            <div className='bord-r-5' 
              key={index}
              style={{ 
                border: activeSection === 'sliders' && activeSliderIndex === index ? '1px solid #ff3333' : '1px solid transparent'
              }}
              onClick={() => {
                if (activeSection === 'sliders') {
                  setSliderValues(prev => {
                    const newValues = [...prev];
                    newValues[activeSliderIndex] = oscillationValue;
                    return newValues;
                  });
                }
                setActiveSliderIndex(index);
                setActiveSection('sliders');
                setOscillationValue(sliderValues[index]);
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
                  { activeSection === 'sliders' && activeSliderIndex === index &&
                    <div className=' pos-abs left-0 translate-x--100 tx-bold'
                      style={{
                        color: '#ff0000'
                      }}
                    >→</div>
                  }
                  <div> {label}</div>
                </div>
              </div>
              <div className=' bord-r-5 noverflow'>
                <SliderBar 
                  sliderPosition={activeSection === 'sliders' && activeSliderIndex === index ? oscillationValue : sliderValues[index]} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-col gap-3">
        <CircularMeter needleRotation={20} />
        <CircularMeter needleRotation={300} />
      </div>
    </div>
  );
}; 
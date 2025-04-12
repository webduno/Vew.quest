import React from 'react';
import { ControlButton } from '../ControlButton';
import { GaugeDial } from '../GaugeDial';

type SectionType = 'buttons' | 'natural' | 'temp' | 'sliders' | 'meter' | 'send';

interface TopSectionProps {
  activeButtonIndex: number;
  activeSection: SectionType;
  buttonColors: string[];
  buttonTypes: string[];
  gaugeValues: number[];
  oscillationValue: number;
  setActiveButtonIndex: (index: number) => void;
  setActiveSection: (section: SectionType) => void;
  setOscillationValue: (value: number) => void;
  setGaugeValues: (values: number[] | ((prev: number[]) => number[])) => void;
  modalRef: React.RefObject<HTMLDivElement>;
}

export const TopSection: React.FC<TopSectionProps> = ({
  activeButtonIndex,
  activeSection,
  buttonColors,
  buttonTypes,
  gaugeValues,
  oscillationValue,
  setActiveButtonIndex,
  setActiveSection,
  setOscillationValue,
  setGaugeValues,
  modalRef
}) => {
  return (
    <>
      <div className='tx-sm pb-1 flex-row flex-justify-start gap-1 w-100'>
        <div className='opaci-50'>Type:</div>
        <div>{buttonTypes[activeButtonIndex]}</div>
      </div>
      <div className='flex-row gap-1 flex-align-end'>
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
        <div className='flex-row pa-1 gap-1 bord-r-5' style={{ background: '#7d807d'}}>
          <div 
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => {
              if (activeSection === 'natural' || activeSection === 'temp') {
                setGaugeValues(prev => {
                  const newValues = [...prev];
                  newValues[activeSection === 'natural' ? 0 : 1] = oscillationValue;
                  return newValues;
                });
              }
              setActiveSection('natural');
              setOscillationValue(gaugeValues[0]);
              if (modalRef.current) {
                modalRef.current.focus();
              }
            }}
          >
            <div style={{ color: '#f0f0f0', fontWeight: 'bold', marginBottom: '3px', fontSize: '10px' }}>Natural</div>
            <GaugeDial 
              key="y" 
              needleRotation={activeSection === 'natural' ? oscillationValue : gaugeValues[0]}
              isActive={activeSection === 'natural'}
            />
          </div>
          <div 
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => {
              if (activeSection === 'natural' || activeSection === 'temp') {
                setGaugeValues(prev => {
                  const newValues = [...prev];
                  newValues[activeSection === 'natural' ? 0 : 1] = oscillationValue;
                  return newValues;
                });
              }
              setActiveSection('temp');
              setOscillationValue(gaugeValues[1]);
              if (modalRef.current) {
                modalRef.current.focus();
              }
            }}
          >
            <div style={{ color: '#f0f0f0', fontWeight: 'bold', marginBottom: '3px', fontSize: '10px' }}>Temp</div>
            <GaugeDial 
              key="z" 
              needleRotation={activeSection === 'temp' ? oscillationValue : gaugeValues[1]}
              isActive={activeSection === 'temp'}
            />
          </div>
        </div>
      </div>
      <div className='tx-xxs mt-1 tx-ls-1 tx-center tx-white pa-1 bord-r-5 ' style={{ background: '#2d302d'}}>
        USE TAB / SCROLL TO NAVIGATE SETTINGS
      </div>
      <hr className='w-100 opaci-20 my-1' />
    </>
  );
}; 
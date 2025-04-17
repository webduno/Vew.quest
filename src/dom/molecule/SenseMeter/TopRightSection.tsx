import React from 'react';
import { GaugeDial } from './parts/GaugeDial';
import { SenseSectionType } from '../../../../script/utils/play/senseMeterTypes';

interface TopRightSectionProps {
  activeSection: SenseSectionType;
  gaugeValues: number[];
  setActiveSection: (section: SenseSectionType) => void;
  setGaugeValues: (values: number[] | ((prev: number[]) => number[])) => void;
  modalRef: React.RefObject<HTMLDivElement>;
}

export const TopRightSection: React.FC<TopRightSectionProps> = ({
  activeSection,
  gaugeValues,
  setActiveSection,
  setGaugeValues,
  modalRef
}) => {
  return (
    <div className='flex-row gap-1'
    style={{
      background: "#5a5a5a",
      padding: "5px",
      borderRadius: "5px"
    }}
    
    >
      <div 
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
        onClick={() => {
          setActiveSection('natural');
          if (modalRef.current) {
            modalRef.current.focus();
          }
        }}
      >
        <div className='tx-xs tx-white mb-1 flex-row' style={{gap:"2px"}}>
          <div className='opaci-50'>Natural</div>
          <div>{gaugeValues[0]}</div>
        </div>
        <div>
          <GaugeDial 
            key="y" 
            needleRotation={gaugeValues[0]}
            isActive={activeSection === 'natural'}
            onChange={(angle) => {
              setGaugeValues(prev => {
                const newValues = [...prev];
                newValues[0] = angle;
                return newValues;
              });
              setActiveSection('natural');
              if (modalRef.current) {
                modalRef.current.focus();
              }
            }}
          />
        </div>
      </div>
      
      <div 
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
        onClick={() => {
          setActiveSection('temp');
          if (modalRef.current) {
            modalRef.current.focus();
          }
        }}
      >
        <div className='tx-xs tx-white mb-1 flex-row' style={{gap:"2px"}}>
          <div className='opaci-50'>Temp</div>
          <div>{gaugeValues[1]}</div>
        </div>
        <div>
          <GaugeDial 
            key="z" 
            needleRotation={gaugeValues[1]}
            isActive={activeSection === 'temp'}
            onChange={(angle) => {
              setGaugeValues(prev => {
                const newValues = [...prev];
                newValues[1] = angle;
                return newValues;
              });
              setActiveSection('temp');
              if (modalRef.current) {
                modalRef.current.focus();
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}; 
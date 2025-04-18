import React from 'react';
import { GaugeDial } from './parts/GaugeDial';
import { SenseSectionType } from '@/../script/utils/play/senseMeterTypes';

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
    <div className='flex-row gap-1 pa-1'
    style={{
      // background: "#aaaaaa",
      background: "linear-gradient(-45deg, #727272, #929292)",
      boxShadow: "inset -2px -2px 1px 0 #444444, inset 2px 2px 1px 0 #bbbbbb, 2px 2px 3px #666666",
      borderRadius: "3px"
      
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
        <div className='tx-xs tx-black mb- flex-col' style={{gap:"2px"}}>
          <div className='opaci-50'>Natural</div>
          <div className="px-1 bord-r-100"
           style={{color: '#229922',background:"#444444"}}>
            {/* show percentage based on 360 */}
            {Math.round(gaugeValues[0] / 360 * 100)} %
            </div>
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
        <div className='tx-xs tx-black mb- flex-col' style={{gap:"2px"}}>
          <div className='opaci-50'>Temperature</div>
          <div className="px-1 bord-r-100"
           style={{color: '#229922',background:"#444444"}}>
            {/* show percentage based on 360 */}
            {Math.round(gaugeValues[1] / 360 * 100)} %
            </div>
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
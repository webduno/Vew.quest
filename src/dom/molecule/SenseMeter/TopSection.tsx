import React from 'react';
import { TopLeftSection } from './TopLeftSection';
import { TopRightSection } from './TopRightSection';
import { SenseSectionType } from '../../../../script/utils/platform/senseMeterTypes';

interface TopSectionProps {
  activeButtonIndex: number;
  activeSection: SenseSectionType;
  buttonColors: string[];
  buttonTypes: string[];
  gaugeValues: number[];
  setActiveButtonIndex: (index: number) => void;
  setActiveSection: (section: SenseSectionType) => void;
  setGaugeValues: (values: number[] | ((prev: number[]) => number[])) => void;
  modalRef: React.RefObject<HTMLDivElement>;
  shouldShowTopRightSection: boolean;
}

export const TopSection: React.FC<TopSectionProps> = ({
  activeButtonIndex,
  activeSection,
  buttonColors,
  buttonTypes,
  gaugeValues,
  setActiveButtonIndex,
  setActiveSection,
  setGaugeValues,
  modalRef,
  shouldShowTopRightSection
}) => {
  return (
    <>
      <div className='flex-row gap-2 flex-align-end'>
        <TopLeftSection
          activeButtonIndex={activeButtonIndex}
          activeSection={activeSection}
          buttonColors={buttonColors}
          buttonTypes={buttonTypes}
          setActiveButtonIndex={setActiveButtonIndex}
          setActiveSection={setActiveSection}
          modalRef={modalRef}
        />
        {shouldShowTopRightSection && (
          <TopRightSection
            activeSection={activeSection}
            gaugeValues={gaugeValues}
            setActiveSection={setActiveSection}
            setGaugeValues={setGaugeValues}
            modalRef={modalRef}
          />
        )}
      </div>
    </>
  );
}; 
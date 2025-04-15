'use client';

import React from 'react';
import { TopSection } from './TopSection';
import { MiddleSection } from './MiddleSection';
import { BottomSection } from './BottomSection';
import { ExitButton } from './ExitButton';
import { normalizeRotation, buttonColors, buttonTypes } from '../../../../scripts/helpers/analogHelpers';
import { useAnalogModal } from './useAnalogModal';

export const AnalogModalScreen = ({
  setEnableLocked, enableLocked, playerRotation = { x: 0, y: 0, z: 0 }, onSend
}: {
  setEnableLocked: (enableLocked: boolean) => void;
  enableLocked: boolean;
  playerRotation?: { x: number, y: number, z: number };
  onSend: (params: {
    type: string;
    natural: number;
    temp: number;
    light: number;
    color: number;
    solid: number;
    confidence: number;
  }, requestId?: string) => void;
  }) => {
  const {
    activeButtonIndex,
    activeSection,
    activeGaugeIndex,
    activeSliderIndex,
    meterValue,
    gaugeValues,
    sliderValues,
    oscillationValue,
    modalRef,
    meterRef,
    setActiveButtonIndex,
    setActiveSection,
    setActiveGaugeIndex,
    setActiveSliderIndex,
    setMeterValue,
    setGaugeValues,
    setSliderValues,
    setOscillationValue,
    handleMeterClick,
    handleKeyDown
  } = useAnalogModal(onSend);

  // Prevent event propagation to avoid triggering pointer lock
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Re-focus the modal when clicked
    if (modalRef.current) {
      modalRef.current.focus();
    }
  };

  // Convert radians to degrees and normalize to 0-360 for gauge display
  const normalizedRotation = normalizeRotation(playerRotation.y);

  return (<div 
    className='pos-abs tx-white' 
    onClick={handleModalClick}
    tabIndex={0}
    ref={modalRef}
    style={{ outline: 'none', zIndex: 1000 }}
    onKeyDown={handleKeyDown}
  >
    <div className='pos-abs top-0 left-0  translate-y--100 w-100 flex-col'>
      <div className='tx-xs pa-1 px-2 box-shadow-2-t tx-ls-3 '
      style={{
        background: '#444744',
        borderRadius: '5px 5px 0 0',
      }}
      >
        <div className='opaci-25'>SENSE METER</div>
      </div>
    </div>

    <ExitButton
      activeSection={activeSection}
      activeButtonIndex={activeButtonIndex}
      gaugeValues={gaugeValues}
      sliderValues={sliderValues}
      meterValue={meterValue}
      buttonTypes={buttonTypes}
      onSend={onSend}
      setActiveSection={setActiveSection}
      modalRef={modalRef}
    />

    <div className='flex-col w-200px bord-r-5 pa-2' style={{
      background: '#9aa39a',
      border: '8px solid #565956',
    }}>
      <TopSection
        activeButtonIndex={activeButtonIndex}
        activeSection={activeSection}
        buttonColors={buttonColors}
        buttonTypes={buttonTypes}
        gaugeValues={gaugeValues}
        oscillationValue={oscillationValue}
        setActiveButtonIndex={setActiveButtonIndex}
        setActiveSection={setActiveSection}
        setOscillationValue={setOscillationValue}
        setGaugeValues={setGaugeValues}
        modalRef={modalRef}
      />

      <MiddleSection
        activeSection={activeSection}
        activeSliderIndex={activeSliderIndex}
        oscillationValue={oscillationValue}
        sliderValues={sliderValues}
        setActiveSection={setActiveSection}
        setActiveSliderIndex={setActiveSliderIndex}
        setOscillationValue={setOscillationValue}
        setSliderValues={setSliderValues}
        modalRef={modalRef}
      />

      <BottomSection
        activeSection={activeSection}
        meterValue={meterValue}
        meterRef={meterRef}
        handleMeterClick={handleMeterClick}
      />
    </div>
  </div>
  );
};

'use client';

import React from 'react';
import { TopSection } from './TopSection';
import { MiddleSection } from './MiddleSection';
import { BottomSection } from './BottomSection';
import { ExitButton } from './ExitButton';
import { normalizeRotation, buttonColors, buttonTypes } from '@/../script/utils/play/analogHelpers';
import { useAnalogModal } from './useAnalogModal';
import { SenseSectionType } from '@/../script/utils/play/senseMeterTypes';
import { KeyboardBtn } from '@/dom/atom/button/KeyboardBtn';
import { isMobile } from '@/../script/utils/platform/mobileDetection';
export const AnalogModalScreen = ({
  setEnableLocked, enableLocked, playerRotation = { x: 0, y: 0, z: 0 }, onSend,
  absolute = true
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
  absolute?: boolean;
  }) => {
  const {
    activeButtonIndex,
    activeSection,
    activeGaugeIndex,
    meterValue,
    gaugeValues,
    sliderValues,
    modalRef,
    meterRef,
    hasCompletedLoop,
    shouldShowTopRightSection,
    shouldShowMiddleSection,
    shouldShowBottomSection,
    setActiveButtonIndex,
    setActiveSection: setActiveSectionState,
    setActiveGaugeIndex,
    setMeterValue,
    setGaugeValues,
    setSliderValues,
    handleMeterClick,
    handleKeyDown
  } = useAnalogModal(onSend);

  // Create a wrapper function to handle the type conversion
  const setActiveSection = (section: SenseSectionType) => {
    setActiveSectionState(section);
  };

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
    className={`${absolute ? 'pos-abs' : ''} tx-white`} 
    onClick={handleModalClick}
    tabIndex={0}
    ref={modalRef}
    style={{ 
      outline: 'none', zIndex: 1000,
    }}
    onKeyDown={handleKeyDown}
  >
    <div className='pos-abs top-0 left-0  translate-y--100 w-100 flex-col'
    style={{
    }}
    >
      <div className='tx-xs pa-1 px-2 box-shadow-2-t tx-ls-3 '
      style={{
        background: '#444744',
        borderRadius: '5px 5px 0 0',
        boxShadow: 'inset 1px 2px 3px -1px  #777777'
      }}
      >
        <div className='opaci-25'>SENSE METER</div>
      </div>
    </div>

      
    {shouldShowMiddleSection && shouldShowBottomSection &&
      shouldShowTopRightSection && (<>
      
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
      </>)}

    

    <div className='flex-col w-200px bord-r-5 pa-2 tx-altfont-1' style={{
      background: 'linear-gradient(-45deg, #6a736a, #9aa39a)',
      // border: '8px solid #565956',
      boxShadow: `inset 2px 2px 5px 0 #aaaaaa, inset -2px -2px 5px 0 #555555,
      0px 0px 3px 5px #444744,3px 3px 3px 6px #2a2a2a,  0 0 0 7px #565956`,
    }}>

      
    {!shouldShowMiddleSection && !shouldShowBottomSection &&
          !shouldShowTopRightSection && (<>
          
          <div className='tx-center tx-smd tx-altfont-1 opaci-75 w-100 tx-black flex-col w-100'>
            <div>{"1)"} What &apos;type&apos; of target are you sensing?</div>
            {/* <div className='flex-wrap gap-1 tx-altfont-5 w-150px  pt-2 flex-justify-center w-100'>
              <div className='tx-center'>Object</div>
              <div className='tx-center'>Entity</div>
              <div className='tx-center'>Place</div>
              <div className='tx-center'>Event</div>
            </div> */}
            <div>↓</div>
            </div>
          </>)}

      
{!shouldShowMiddleSection && !shouldShowBottomSection &&
 shouldShowTopRightSection && (<>
      
      <div className='tx-center tx-altfont-1 tx-xsm opaci-75 pos-rel w-100 tx-black pb- flex-col w-100 flex-align-end'>
        <div>{"2)"} Whats the nature/temperature of the target?</div>
        {/* <div className='tx-xsm'>Artificial/Organic | Cold/Hot</div> */}
        
        <div className='pos-abs tx-xl translate-y-50 pr-4'>↓</div>
        </div>
      </>)}


      <TopSection
        activeButtonIndex={activeButtonIndex}
        activeSection={activeSection}
        buttonColors={buttonColors}
        buttonTypes={buttonTypes}
        gaugeValues={gaugeValues}
        setActiveButtonIndex={setActiveButtonIndex}
        setActiveSection={setActiveSection}
        setGaugeValues={setGaugeValues}
        modalRef={modalRef}
        shouldShowTopRightSection={shouldShowTopRightSection}
      />


      {shouldShowMiddleSection && (<>
<hr className='w-100 opaci-20 my-1' />
        <MiddleSection
          activeSection={activeSection}
          sliderValues={sliderValues}
          setActiveSection={setActiveSection}
          setSliderValues={setSliderValues}
          modalRef={modalRef}
        />

      </>)}

      
{shouldShowMiddleSection && shouldShowBottomSection &&
shouldShowTopRightSection && !isMobile() && (<>

<div className='tx-xs mb-1 tx-ls- 1 tx-center tx-white pa-1 bord-r-5 ' style={{ background: '#2d302d'}}>
        USE SCROLL / TAB TO NAVIGATE SETTINGS
      </div>
      </>)}

      {shouldShowBottomSection && (
        <BottomSection
          activeSection={activeSection}
          meterValue={meterValue}
          meterRef={meterRef}
          handleMeterClick={handleMeterClick}
        />
      )}




{shouldShowMiddleSection && !shouldShowBottomSection &&
          shouldShowTopRightSection && (<>
          
          <div className='tx-center tx-sm tx-altfont-1 w-100 tx-black flex-col w-100'>
            <div>↑</div>
            <div>{"3)"} Choose brightness, saturation and solidity</div>
            {/* <div className='flex-wrap gap-1 tx-altfont-5 w-150px  pt-2 flex-justify-center w-100'>
              <div className='tx-center'>Object</div>
              <div className='tx-center'>Entity</div>
              <div className='tx-center'>Place</div>
              <div className='tx-center'>Event</div>
            </div> */}
            </div>
          </>)}




      
{!shouldShowMiddleSection && !shouldShowBottomSection &&
      !shouldShowTopRightSection && (<>
      <div className='pt-3 mt-8 pb-8' >
        <KeyboardBtn classOverride='pointer' onClick={() => {
          setActiveSection("natural")
        }}>
          <div>Continue</div>
        </KeyboardBtn>

      </div>
      </>)}


      
      {!shouldShowMiddleSection && !shouldShowBottomSection && 
shouldShowTopRightSection && (<>
      <div className='pt-8 mt-8 pb-8 ' >
        <KeyboardBtn classOverride='pointer' onClick={() => {
          setActiveSection("light")
        }}>
          <div>Continue</div>
        </KeyboardBtn>

      </div>
      </>)}


      
      
{shouldShowMiddleSection && !shouldShowBottomSection && 
shouldShowTopRightSection && (<>
      <div className='pt-1 ' >
        <KeyboardBtn classOverride='pointer' onClick={() => {
          setActiveSection("meter")
        }}>
          <div>Continue</div>
        </KeyboardBtn>

      </div>
      </>)}

{shouldShowBottomSection && shouldShowMiddleSection && shouldShowTopRightSection && (<>
      <div className='pos-abs bottom-0 left-0 flex-row gap-1 pa-3'
        style={{
          paddingBottom: "7px"
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
      </>)}




      {(!shouldShowMiddleSection || !shouldShowBottomSection ||
      !shouldShowTopRightSection) && !isMobile() && (<>
      
<hr className='w-100 opaci-20 my-1' />
<div className='tx-xs mt-1 tx-ls- 1 tx-center tx-white pa-1 bord-r-5 ' style={{ 
  background: '#2d302d',
  boxShadow: 'inset -1px -1px 0 0px #000000'

}}>
        USE SCROLL / TAB TO NAVIGATE SETTINGS
      </div>
      </>)}


    </div>
  </div>
  );
};

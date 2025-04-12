'use client';

import React from 'react';
import { TopSection } from './TopSection';
import { MiddleSection } from './MiddleSection';
import { BottomSection } from './BottomSection';
import { ExitButton } from './ExitButton';

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
  }) => void;
}) => {
  // Add state for active control button and active section
  const [activeButtonIndex, setActiveButtonIndex] = React.useState(0);
  const [activeSection, setActiveSection] = React.useState<'buttons' | 'natural' | 'temp' | 'sliders' | 'meter' | 'send'>('buttons');
  const [activeGaugeIndex, setActiveGaugeIndex] = React.useState(0);
  const [activeSliderIndex, setActiveSliderIndex] = React.useState(0);
  const [meterValue, setMeterValue] = React.useState(50); // 0-100 percentage value for the large meter
  
  // State for gauge values (0-360 degrees)
  const [gaugeValues, setGaugeValues] = React.useState([180, 180]);
  // State for slider values (0-80)
  const [sliderValues, setSliderValues] = React.useState([40, 40, 40]);
  
  // For oscillation
  const [oscillationDirection, setOscillationDirection] = React.useState(1);
  const [oscillationValue, setOscillationValue] = React.useState(180);
  
  // Add ref for focusing
  const modalRef = React.useRef<HTMLDivElement>(null);
  // Add ref for the large meter to get its dimensions
  const meterRef = React.useRef<HTMLDivElement>(null);
  // Add ref for the send button
  const exitButtonRef = React.useRef<HTMLDivElement>(null);

  // Oscillation animation for active gauge or slider
  React.useEffect(() => {
    if (activeSection !== 'natural' && activeSection !== 'temp' && activeSection !== 'sliders') return;
    
    let animationFrameId: number;
    const gaugeOscillationSpeed = 1; // speed for gauges
    const sliderOscillationSpeed = 0.3; // speed for sliders
    const minValue = activeSection === 'sliders' ? 0 : 0;
    const maxValue = activeSection === 'sliders' ? 50 : 360;
    
    const animate = () => {
      setOscillationValue(prev => {
        // Calculate the new value based on direction
        const newValue = prev + (activeSection === 'sliders' ? sliderOscillationSpeed : gaugeOscillationSpeed) * oscillationDirection;
        
        // Change direction when reaching bounds
        if (newValue >= maxValue) {
          setOscillationDirection(-1);
          return maxValue; // Cap at max
        } else if (newValue <= minValue) {
          setOscillationDirection(1);
          return minValue; // Cap at min
        }
        
        return newValue;
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [activeSection, oscillationDirection]);
  
  // Update gauge/slider values when switching between them
  React.useEffect(() => {
    if (activeSection === 'natural' || activeSection === 'temp') {
      // Save current oscillation value to the previously active gauge
      setGaugeValues(prev => {
        const newValues = [...prev];
        // Only update if coming from an active gauge state
        if (prev[activeSection === 'natural' ? 0 : 1] !== oscillationValue && oscillationValue !== 0) {
          newValues[activeSection === 'natural' ? 0 : 1] = oscillationValue;
        }
        return newValues;
      });
      
      // Reset oscillation value to match the newly active gauge
      setOscillationValue(gaugeValues[activeSection === 'natural' ? 0 : 1]);
    } else if (activeSection === 'sliders') {
      // Save current oscillation value to the previously active slider
      setSliderValues(prev => {
        const newValues = [...prev];
        // Only update if coming from an active slider state
        if (prev[activeSliderIndex] !== oscillationValue && oscillationValue >= 0) {
          newValues[activeSliderIndex] = oscillationValue;
        }
        return newValues;
      });
      
      // Reset oscillation value to match the newly active slider
      setOscillationValue(sliderValues[activeSliderIndex]);
    }
  }, [activeGaugeIndex, activeSliderIndex, activeSection]);

  // Handle wheel event globally to ensure it works
  React.useEffect(() => {
    const handleGlobalWheel = (e: WheelEvent) => {
      // Only handle wheel events when modal is shown
      e.preventDefault();
      e.stopPropagation();
      
      if (activeSection === 'buttons') {
        // Cycle through buttons
        if (e.deltaY > 0) {
          setActiveButtonIndex((prev) => (prev + 1) % 4);
        } else {
          setActiveButtonIndex((prev) => (prev - 1 + 4) % 4);
        }
      } else if (activeSection === 'natural' || activeSection === 'temp') {
        // Before switching, save current oscillation value
        setGaugeValues(prev => {
          const newValues = [...prev];
          newValues[activeSection === 'natural' ? 0 : 1] = oscillationValue;
          return newValues;
        });
        
        // Cycle through gauges
        if (e.deltaY > 0) {
          setActiveGaugeIndex((prev) => (prev + 1) % 2);
        } else {
          setActiveGaugeIndex((prev) => (prev - 1 + 2) % 2);
        }
      } else if (activeSection === 'sliders') {
        // Before switching, save current oscillation value
        setSliderValues(prev => {
          const newValues = [...prev];
          newValues[activeSliderIndex] = oscillationValue;
          return newValues;
        });
        
        // Cycle through sliders
        if (e.deltaY > 0) {
          setActiveSliderIndex((prev) => (prev + 1) % 3);
        } else {
          setActiveSliderIndex((prev) => (prev - 1 + 3) % 3);
        }
      } else if (activeSection === 'meter') {
        // Adjust meter value with scroll
        setMeterValue(prev => {
          // Decrease on scroll down, increase on scroll up
          const newValue = prev + (e.deltaY > 0 ? -5 : 5);
          // Clamp between 0 and 100
          return Math.min(100, Math.max(0, newValue));
        });
      }
    };

    // Add global wheel event listener with passive: false to allow preventDefault
    window.addEventListener('wheel', handleGlobalWheel, { passive: false });
    
    // Focus the modal when it mounts
    if (modalRef.current) {
      modalRef.current.focus();
    }
    
    return () => {
      window.removeEventListener('wheel', handleGlobalWheel);
    };
  }, [activeSection, activeGaugeIndex, activeSliderIndex, oscillationValue]); // Include dependencies

  // Prevent event propagation to avoid triggering pointer lock
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Re-focus the modal when clicked
    if (modalRef.current) {
      modalRef.current.focus();
    }
  };

  // Convert radians to degrees and normalize to 0-360 for gauge display
  const normalizeRotation = (rotation: number): number => {
    // Convert radians to degrees
    const degrees = (rotation * 180 / Math.PI) % 360;
    // Normalize to 0-360
    return degrees < 0 ? degrees + 360 : degrees;
  };

  // Handle key press for space to switch between sections
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Tab') {
        e.preventDefault();
        setActiveSection(prev => {
          if (prev === 'buttons') return 'natural';
          if (prev === 'natural') return 'temp';
          if (prev === 'temp') return 'sliders';
          if (prev === 'sliders') return 'meter';
          if (prev === 'meter') return 'send';
          return 'buttons'; // From send back to buttons
        });
      } else if (e.code === 'Space' && activeSection === 'send') {
        // Only send when enter is pressed while send button is focused
        e.preventDefault(); // Prevent default to avoid interference with movement controls
        // Force document focus and blur to release keyboard controls
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        // Use setTimeout to ensure the event queue is clear before closing
        setTimeout(() => {
          onSend({
            type: buttonTypes[activeButtonIndex],
            natural: gaugeValues[0],
            temp: gaugeValues[1],
            light: sliderValues[0],
            color: sliderValues[1],
            solid: sliderValues[2],
            confidence: meterValue
          });
          // Dispatch a click event to ensure walking controls are re-enabled
          document.body.click();
        }, 0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSection, onSend]);

  // Handle meter click to set value based on click position
  const handleMeterClick = (e: React.MouseEvent) => {
    if (meterRef.current) {
      const rect = meterRef.current.getBoundingClientRect();
      // Calculate percentage based on click position relative to the meter width
      const clickX = e.clientX - rect.left;
      const meterWidth = rect.width;
      const percentage = Math.min(100, Math.max(0, (clickX / meterWidth) * 100));
      setMeterValue(percentage);
      setActiveSection('meter');
      if (modalRef.current) {
        modalRef.current.focus();
      }
    }
  };

  // Handle arrow keys for navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (activeSection === 'buttons') {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveButtonIndex((prev) => (prev + 1) % 4);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveButtonIndex((prev) => (prev - 1 + 4) % 4);
      }
    } else if (activeSection === 'natural' || activeSection === 'temp') {
      // Save current value before switching
      const newGaugeValues = [...gaugeValues];
      newGaugeValues[activeSection === 'natural' ? 0 : 1] = oscillationValue;
      setGaugeValues(newGaugeValues);
      
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveGaugeIndex((prev) => (prev + 1) % 2);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveGaugeIndex((prev) => (prev - 1 + 2) % 2);
      }
    } else if (activeSection === 'sliders') {
      // Save current value before switching
      const newSliderValues = [...sliderValues];
      newSliderValues[activeSliderIndex] = oscillationValue;
      setSliderValues(newSliderValues);
      
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveSliderIndex((prev) => (prev + 1) % 3);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveSliderIndex((prev) => (prev - 1 + 3) % 3);
      }
    } else if (activeSection === 'meter') {
      // Control meter value with arrow keys
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setMeterValue(prev => Math.min(100, prev + 5));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setMeterValue(prev => Math.max(0, prev - 5));
      }
    } else if (activeSection === 'send') {
      // Handle enter key for send button
      if (e.key === 'Enter') {
        e.preventDefault();
        // Force document focus and blur to release keyboard controls
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        // Use setTimeout to ensure the event queue is clear before closing
        setTimeout(() => {
          onSend({
            type: buttonTypes[activeButtonIndex],
            natural: gaugeValues[0],
            temp: gaugeValues[1],
            light: sliderValues[0],
            color: sliderValues[1],
            solid: sliderValues[2],
            confidence: meterValue
          });
          // Dispatch a click event to ensure walking controls are re-enabled
          document.body.click();
        }, 0);
      }
    }
    
    // Handle general Enter key for any section
    if (e.key === 'Enter' && activeSection === 'send') {
      e.preventDefault(); // Prevent default to avoid interference with movement controls
      // Force document focus and blur to release keyboard controls
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      // Use setTimeout to ensure the event queue is clear before closing
      setTimeout(() => {
        onSend({
          type: buttonTypes[activeButtonIndex],
          natural: gaugeValues[0],
          temp: gaugeValues[1],
          light: sliderValues[0],
          color: sliderValues[1],
          solid: sliderValues[2],
          confidence: meterValue
        });
        // Dispatch a click event to ensure walking controls are re-enabled
        document.body.click();
      }, 0);
    }
  };

  // Button colors
  const buttonColors = ['#ff5555', '#55ff55', '#ffff55', '#55ffff'];
  const buttonTypes = ['Object', 'Entity', 'Place', 'Event'];

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

import { useState, useEffect, useRef } from 'react';
import { buttonTypes } from '@/../script/helpers/analogHelpers';
import { SenseSectionType } from '../../../../script/utils/platform/senseMeterTypes';

export const useAnalogModal = (onSend: (params: {
  type: string;
  natural: number;
  temp: number;
  light: number;
  color: number;
  solid: number;
  confidence: number;
}) => void) => {
  // State for active control button and active section
  const [activeButtonIndex, setActiveButtonIndex] = useState(0);
  const [activeSection, setActiveSection] = useState<SenseSectionType>('buttons');
  const [activeGaugeIndex, setActiveGaugeIndex] = useState(0);
  const [meterValue, setMeterValue] = useState(50); // 0-100 percentage value for the large meter
  const [hasCompletedLoop, setHasCompletedLoop] = useState(false);
  
  // State for gauge values (0-360 degrees)
  const [gaugeValues, setGaugeValues] = useState([180, 180]);
  // State for slider values (0-100)
  const [sliderValues, setSliderValues] = useState([50, 50, 50]);
  
  // Add ref for focusing
  const modalRef = useRef<HTMLDivElement>(null);
  // Add ref for the large meter to get its dimensions
  const meterRef = useRef<HTMLDivElement>(null);

  // Handle wheel event globally to ensure it works
  useEffect(() => {
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
        const gaugeIndex = activeSection === 'natural' ? 0 : 1;
        
        // Update the gauge value directly
        setGaugeValues(prev => {
          const newValues = [...prev];
          // Decrease on scroll down, increase on scroll up
          const change = e.deltaY > 0 ? -15 : 15;
          newValues[gaugeIndex] = Math.min(360, Math.max(0, newValues[gaugeIndex] + change));
          return newValues;
        });
      } else if (activeSection === 'light' || activeSection === 'color' || activeSection === 'solid') {
        // Map section to slider index
        const sliderIndex = activeSection === 'light' ? 0 : activeSection === 'color' ? 1 : 2;
        
        // Update slider values directly
        setSliderValues(prev => {
          const newValues = [...prev];
          // Decrease on scroll down, increase on scroll up
          const change = e.deltaY > 0 ? -5 : 5;
          newValues[sliderIndex] = Math.min(100, Math.max(0, newValues[sliderIndex] + change));
          return newValues;
        });
      } else if (activeSection === 'meter') {
        // Adjust meter value with scroll
        setMeterValue(prev => {
          // Decrease on scroll down, increase on scroll up
          const newValue = prev + (e.deltaY > 0 ? -5 : 5);
          // Clamp between 0 and 100
          return Math.round(Math.min(100, Math.max(0, newValue)));
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
  }, [activeSection]);

  // Handle key press for space to switch between sections
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Tab') {
        e.preventDefault();
        setActiveSection(prev => {
          if (prev === 'buttons') return 'natural';
          if (prev === 'natural') return 'temp';
          if (prev === 'temp') return 'light';
          if (prev === 'light') return 'color';
          if (prev === 'color') return 'solid';
          if (prev === 'solid') return 'meter';
          if (prev === 'meter') return 'send';
          if (prev === 'send') {
            setHasCompletedLoop(true);
            return 'buttons';
          }
          return 'buttons';
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

  const handleMeterClick = (e: React.MouseEvent) => {
    if (meterRef.current) {
      const rect = meterRef.current.getBoundingClientRect();
      // Calculate percentage based on click position relative to the meter width
      const clickX = e.clientX - rect.left;
      const meterWidth = rect.width;
      const percentage = Math.round(Math.min(100, Math.max(0, (clickX / meterWidth) * 100)));
      setMeterValue(percentage);
      setActiveSection('meter');
      if (modalRef.current) {
        modalRef.current.focus();
      }
    }
  };

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
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveGaugeIndex((prev) => (prev + 1) % 2);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveGaugeIndex((prev) => (prev - 1 + 2) % 2);
      }
    } else if (activeSection === 'light' || activeSection === 'color' || activeSection === 'solid') {
      // Map section to slider index
      const sliderIndex = activeSection === 'light' ? 0 : activeSection === 'color' ? 1 : 2;
      
      // Handle arrow keys for value adjustment
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        setSliderValues(prev => {
          const newValues = [...prev];
          newValues[sliderIndex] = Math.min(100, newValues[sliderIndex] + 5);
          return newValues;
        });
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        setSliderValues(prev => {
          const newValues = [...prev];
          newValues[sliderIndex] = Math.max(0, newValues[sliderIndex] - 5);
          return newValues;
        });
      }
    } else if (activeSection === 'meter') {
      // Control meter value with arrow keys
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setMeterValue(prev => Math.round(Math.min(100, prev + 5)));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setMeterValue(prev => Math.round(Math.max(0, prev - 5)));
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
  };

  return {
    activeButtonIndex,
    activeSection,
    activeGaugeIndex,
    meterValue,
    gaugeValues,
    sliderValues,
    modalRef,
    meterRef,
    hasCompletedLoop,
    shouldShowTopRightSection: hasCompletedLoop || ['natural', 'temp', 'light', 'color', 'solid', 'meter', 'send'].includes(activeSection),
    shouldShowMiddleSection: hasCompletedLoop || ['light', 'color', 'solid', 'meter', 'send'].includes(activeSection),
    shouldShowBottomSection: hasCompletedLoop || ['meter', 'send'].includes(activeSection),
    setActiveButtonIndex,
    setActiveSection,
    setActiveGaugeIndex,
    setMeterValue,
    setGaugeValues,
    setSliderValues,
    handleMeterClick,
    handleKeyDown
  };
}; 
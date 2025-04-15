import { useState, useEffect, useRef } from 'react';
import { buttonTypes } from '../../../../scripts/helpers/analogHelpers';

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
  const [activeSection, setActiveSection] = useState<'buttons' | 'natural' | 'temp' | 'sliders' | 'meter' | 'send'>('buttons');
  const [activeGaugeIndex, setActiveGaugeIndex] = useState(0);
  const [activeSliderIndex, setActiveSliderIndex] = useState(0);
  const [meterValue, setMeterValue] = useState(50); // 0-100 percentage value for the large meter
  
  // State for gauge values (0-360 degrees)
  const [gaugeValues, setGaugeValues] = useState([180, 180]);
  // State for slider values (0-80)
  const [sliderValues, setSliderValues] = useState([40, 40, 40]);
  
  // For oscillation value (but no automatic oscillation)
  const [oscillationValue, setOscillationValue] = useState(180);
  
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
          const change = e.deltaY < 0 ? -15 : 15;
          newValues[gaugeIndex] = Math.min(360, Math.max(0, newValues[gaugeIndex] + change));
          // Also update oscillation value to match
          setOscillationValue(newValues[gaugeIndex]);
          return newValues;
        });
      } else if (activeSection === 'sliders') {
        // Update slider values directly
        setSliderValues(prev => {
          const newValues = [...prev];
          // Decrease on scroll down, increase on scroll up
          const change = e.deltaY > 0 ? -5 : 5;
          newValues[activeSliderIndex] = Math.min(80, Math.max(0, newValues[activeSliderIndex] + change));
          // Also update oscillation value to match
          setOscillationValue(newValues[activeSliderIndex]);
          return newValues;
        });
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
  }, [activeSection, activeSliderIndex, oscillationValue]);

  // Handle key press for space to switch between sections
  useEffect(() => {
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
  };

  return {
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
  };
}; 
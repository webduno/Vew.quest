'use client';

import React from 'react';
import { GaugeDial } from './GaugeDial';
import { CircularMeter } from './CircularMeter';
import { LargeSemicircularMeter } from './LargeSemicircularMeter';
import { SliderBar } from './SliderBar';

// Control Button Component
export const ControlButton = ({ 
  color = '#55ff55',
  isActive = false,
  onClick
}: { 
  color?: string;
  isActive?: boolean;
  onClick?: () => void;
}) => {
  return (
    <div 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '5px',
        cursor: 'pointer',
        padding: '5px',
        background: isActive ? '#444' : 'transparent',
        borderRadius: '5px'
      }}
      onClick={onClick}
    >
      <div style={{ 
        width: '15px', 
        height: '15px', 
        borderRadius: '50%', 
        background: color,
        border: `2px solid ${isActive ? '#ffffff' : '#3e3e3e'}`
      }}></div>
      <div style={{ 
        width: '10px', 
        height: '10px', 
        borderRadius: '50%', 
        background: '#222',
        border: '1px solid #111'
      }}></div>
    </div>
  );
};

export const AnalogModalScreen = ({
  setEnableLocked, enableLocked, playerRotation = { x: 0, y: 0, z: 0 }, onClose
}: {
  setEnableLocked: (enableLocked: boolean) => void;
  enableLocked: boolean;
  playerRotation?: { x: number, y: number, z: number };
  onClose: () => void;
}) => {
  // Add state for active control button and active section
  const [activeButtonIndex, setActiveButtonIndex] = React.useState(0);
  const [activeSection, setActiveSection] = React.useState<'buttons' | 'gauges' | 'sliders' | 'meter' | 'exit'>('buttons');
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
  // Add ref for the exit button
  const exitButtonRef = React.useRef<HTMLDivElement>(null);

  // Oscillation animation for active gauge or slider
  React.useEffect(() => {
    if (activeSection !== 'gauges' && activeSection !== 'sliders') return;
    
    let animationFrameId: number;
    const oscillationSpeed = 2; // adjust as needed
    const minValue = activeSection === 'sliders' ? 0 : 0;
    const maxValue = activeSection === 'sliders' ? 80 : 360;
    
    const animate = () => {
      setOscillationValue(prev => {
        // Calculate the new value based on direction
        const newValue = prev + oscillationSpeed * oscillationDirection;
        
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
    if (activeSection === 'gauges') {
      // Save current oscillation value to the previously active gauge
      setGaugeValues(prev => {
        const newValues = [...prev];
        // Only update if coming from an active gauge state
        if (prev[activeGaugeIndex] !== oscillationValue && oscillationValue !== 0) {
          newValues[activeGaugeIndex] = oscillationValue;
        }
        return newValues;
      });
      
      // Reset oscillation value to match the newly active gauge
      setOscillationValue(gaugeValues[activeGaugeIndex]);
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
      } else if (activeSection === 'gauges') {
        // Before switching, save current oscillation value
        setGaugeValues(prev => {
          const newValues = [...prev];
          newValues[activeGaugeIndex] = oscillationValue;
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
      if (e.code === 'Space') {
        e.preventDefault();
        setActiveSection(prev => {
          if (prev === 'buttons') return 'gauges';
          if (prev === 'gauges') return 'sliders';
          if (prev === 'sliders') return 'meter';
          if (prev === 'meter') return 'exit';
          return 'buttons'; // From exit back to buttons
        });
      } else if (e.code === 'Enter' && activeSection === 'exit') {
        // Only exit when enter is pressed while exit button is focused
        e.preventDefault(); // Prevent default to avoid interference with movement controls
        // Force document focus and blur to release keyboard controls
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        // Use setTimeout to ensure the event queue is clear before closing
        setTimeout(() => {
          onClose();
          // Dispatch a click event to ensure walking controls are re-enabled
          document.body.click();
        }, 0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSection, onClose]);

  // Handle meter click to set value based on click position
  const handleMeterClick = (e: React.MouseEvent) => {
    if (activeSection === 'meter' && meterRef.current) {
      const rect = meterRef.current.getBoundingClientRect();
      // Calculate percentage based on click position relative to the meter width
      const clickX = e.clientX - rect.left;
      const meterWidth = rect.width;
      const percentage = Math.min(100, Math.max(0, (clickX / meterWidth) * 100));
      setMeterValue(percentage);
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
    } else if (activeSection === 'gauges') {
      // Save current value before switching
      const newGaugeValues = [...gaugeValues];
      newGaugeValues[activeGaugeIndex] = oscillationValue;
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
    } else if (activeSection === 'exit') {
      // Handle enter key for exit button
      if (e.key === 'Enter') {
        e.preventDefault();
        // Force document focus and blur to release keyboard controls
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        // Use setTimeout to ensure the event queue is clear before closing
        setTimeout(() => {
          onClose();
          // Dispatch a click event to ensure walking controls are re-enabled
          document.body.click();
        }, 0);
      }
    }
    
    // Handle general Enter key for any section
    if (e.key === 'Enter' && activeSection === 'exit') {
      e.preventDefault(); // Prevent default to avoid interference with movement controls
      // Force document focus and blur to release keyboard controls
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      // Use setTimeout to ensure the event queue is clear before closing
      setTimeout(() => {
        onClose();
        // Dispatch a click event to ensure walking controls are re-enabled
        document.body.click();
      }, 0);
    }
  };

  // Button colors
  const buttonColors = ['#ff5555', '#55ff55', '#ffff55', '#55ffff'];
  const buttonTypes = ['Object', 'Entity', 'Place', 'Event'];

  return (<div 
    className='pos-abs z-100 tx-white' 
    onClick={handleModalClick}
    tabIndex={0}
    ref={modalRef}
    style={{ outline: 'none' }}
    onKeyDown={handleKeyDown}
  >
    <div className='pos-abs top-0 right-0 mr-4 pt-4'>
      <div 
        ref={exitButtonRef}
        className='py-1 px-2 bord-r-5 border-white opaci-chov--50'
        onClick={() => {
          if (activeSection === 'exit') {
            onClose();
          } else {
            setActiveSection('exit');
            if (modalRef.current) {
              modalRef.current.focus();
            }
          }
        }}
        style={{
          background: '#333333',
          color: '#ff5555',
          border: activeSection === 'exit' ? '2px solid white' : '',
          transform: activeSection === 'exit' ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
      >
        EXIT
      </div>
      {activeSection === 'exit' &&
    <div className='tx-xs tx-center tx-red  bord-r-5  pt-1'>
        ENTER TO EXIT
      </div>
      }
    </div>
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      background: '#9aa39a',
      padding: '20px',
      width: '200px',
      border: '8px solid #565956',
      borderRadius: '5px'
    }}>
      
      {/* Top section with gauges and danger sign */}
      <div className='tx-sm pb-1 flex-row flex-justify-start gap-1'>
        <div className='opaci-50'>Type:</div>
        <div>{buttonTypes[activeButtonIndex]}</div>
      </div>
      <div className='flex-row gap-1 flex-align-end'>
        
      <div className='flex-wrap pa-1 bord-r-5' style={{ background: '#7d807d'}}>
        {buttonColors.map((color, index) => (
          <ControlButton 
            key={index}
            color={color}
            isActive={activeSection === 'buttons' && activeButtonIndex === index}
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
        {/* Left gauges */}
        <div className='flex-row pa-1 bord-r-5' style={{ background: '#7d807d'}}>
          {/* <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ color: '#f0f0f0', fontWeight: 'bold', marginBottom: '3px', fontSize: '10px' }}>X</div>
            <GaugeDial key="x" needleRotation={xNeedleRotation} />
          </div> */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ color: '#f0f0f0', fontWeight: 'bold', marginBottom: '3px', fontSize: '10px' }}>Natural</div>
            <GaugeDial 
              key="y" 
              needleRotation={activeSection === 'gauges' && activeGaugeIndex === 0 ? oscillationValue : gaugeValues[0]}
              isActive={activeSection === 'gauges' && activeGaugeIndex === 0}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ color: '#f0f0f0', fontWeight: 'bold', marginBottom: '3px', fontSize: '10px' }}>Temp</div>
            <GaugeDial 
              key="z" 
              needleRotation={activeSection === 'gauges' && activeGaugeIndex === 1 ? oscillationValue : gaugeValues[1]}
              isActive={activeSection === 'gauges' && activeGaugeIndex === 1}
            />
          </div>
        </div>
        
        {/* Center alarm */}
        {/* Danger sign */}
        {/* <div style={{ 
          background: '#ff5555', 
          width: '50px', 
          height: '50px', 
          borderRadius: '50%',
          border: '5px solid #3e3e3e'
        }}></div>
        
        <div style={{ 
          background: 'black', 
          color: '#ff5555', 
          padding: '8px 15px',
          fontWeight: 'bold',
          fontSize: '24px',
          letterSpacing: '2px'
        }}>DANGER</div> */}
      </div>
      <hr className='w-100 opaci-20 my-1' />
      <div className='tx-xs tx-center tx-white pa-1 bord-r-5 ' style={{ background: '#2d302d'}}>
        USE SPACEBAR / SCROLL TO NAVIGATE
      </div>
      <hr className='w-100 opaci-20 my-1' />
      {/* Middle section with sliders and meters */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
        {/* Sliders section */}
        <div style={{ 
          flex: '1', 
          background: '#adb0ad', 
          padding: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-around' 
          }}>
            {["Light", "Color", "Solid"].map((label, index) => (
              <div 
                key={index}
                style={{ 
                  // padding: '1px', 
                  border: activeSection === 'sliders' && activeSliderIndex === index ? '1px solid #333333' : '1px solid transparent'
                }}
                onClick={() => {
                  setActiveSliderIndex(index);
                  setActiveSection('sliders');
                  if (modalRef.current) {
                    modalRef.current.focus();
                  }
                }}
              >
                <div className=' tx-white pos-abs tx-xsm opaci-75'
                style={{
                  // top: '50%',
                  // left: '50%',
                  // color: activeSliderIndex === index ? '#ff0000' : '#ffffff',
                  transform: 'rotate(-90deg) translate(-100%, -180%)'
                }}
                >
                  <div className="flex-col pos-rel">
                    {activeSliderIndex === index &&
                  <div className=' pos-abs left-0 translate-x--100 tx-bold'
                  style={{
                    color: '#ff0000'
                  }}
                  >→</div>}
                  
                  <div> {label}</div>
                  </div>
                </div>
                <SliderBar 
                  sliderPosition={activeSection === 'sliders' && activeSliderIndex === index ? oscillationValue : sliderValues[index]} 
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Meters section */}
        <div className="flex-col gap-3">
          {[1, 2].map((_, i) => (
            <CircularMeter key={i} needleRotation={-45 + i * 30} />
          ))}
        </div>
      </div>
      
      {/* Bottom section with controls and large meter */}
      <div style={{ display: 'flex', gap: '20px' }}>
        <div 
          ref={meterRef}
          onClick={handleMeterClick}
          style={{ 
            width: '100%', 
            cursor: activeSection === 'meter' ? 'pointer' : 'default',
            border: activeSection === 'meter' ? '2px solid #333333' : 'none',
            borderRadius: '5px',
            padding: activeSection === 'meter' ? '2px' : '4px'
          }}
        >
          <LargeSemicircularMeter value={meterValue} isActive={activeSection === 'meter'} />
        </div>
      </div>
{/* 
      <div className='pa-2 bg-b-90 mt-4 text-center'
        onClick={() => {
          setEnableLocked(true);
        }}
        style={{
          cursor: 'pointer',
          border: '3px solid #555',
          borderRadius: '5px',
          fontWeight: 'bold'
        }}
      >
        Click to continue
      </div> */}
    </div>
  </div>
  );
};

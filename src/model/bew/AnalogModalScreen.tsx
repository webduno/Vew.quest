'use client';

import React from 'react';
import { GaugeDial } from './GaugeDial';
import { CircularMeter } from './CircularMeter';
import { LargeSemicircularMeter } from './LargeSemicircularMeter';
import { SliderBar } from './SliderBar';
import { ControlButton } from './ControlButton';
import { isMobile } from '../../../scripts/utils/mobileDetection';

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
  const [activeSection, setActiveSection] = React.useState<'buttons' | 'gauges' | 'sliders' | 'meter' | 'send'>('buttons');
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
    if (activeSection !== 'gauges' && activeSection !== 'sliders') return;
    
    let animationFrameId: number;
    const gaugeOscillationSpeed = 1; // speed for gauges
    const sliderOscillationSpeed = 0.3; // speed for sliders
    const minValue = activeSection === 'sliders' ? 0 : 0;
    const maxValue = activeSection === 'sliders' ? 50 : 360;
    
    const animate = () => {
      setOscillationValue(prev => {
        // Calculate the new value based on direction
        const newValue = prev + (activeSection === 'gauges' ? gaugeOscillationSpeed : sliderOscillationSpeed) * oscillationDirection;
        
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
      if (e.code === 'Tab') {
        e.preventDefault();
        setActiveSection(prev => {
          if (prev === 'buttons') return 'gauges';
          if (prev === 'gauges') return 'sliders';
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
    <div className='pos-abs top-0 right-0 mr-4 pt-4 flex-col flex-justify-end flex-align-end'>
      <div 
        ref={exitButtonRef}
        className=' px-2 bord-r-5 border-white opaci-chov--50'
        onClick={() => {
          if (activeSection === 'send') {
            onSend({
              type: buttonTypes[activeButtonIndex],
              natural: gaugeValues[0],
              temp: gaugeValues[1],
              light: sliderValues[0],
              color: sliderValues[1],
              solid: sliderValues[2],
              confidence: meterValue
            });
          } else {
            setActiveSection('send');
            if (modalRef.current) {
              modalRef.current.focus();
            }
          }
        }}
        style={{
          background: '#333333',
          color: activeSection === 'send' ? '#55ff55' : '#ff5555',
          border: activeSection === 'send' ? '2px solid white' : '',
          transform: activeSection === 'send' ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
      >
        SEND
      </div>
      {activeSection === 'send' && !isMobile() &&
    <div className='tx-xs tx-center tx-white  bord-r-5  pt-1'>
        SPACEBAR TO SEND
      </div>
      }
    </div>
    <div className='flex-col w-200px bord-r-5 pa-2' style={{
      background: '#9aa39a',
      border: '8px solid #565956',
    }}>
      
      {/* Top section with gauges and danger sign */}
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
        {/* Left gauges */}
        <div className='flex-row pa-1 gap-1 bord-r-5' style={{ background: '#7d807d'}}>
          {/* <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ color: '#f0f0f0', fontWeight: 'bold', marginBottom: '3px', fontSize: '10px' }}>X</div>
            <GaugeDial key="x" needleRotation={xNeedleRotation} />
          </div> */}
          <div 
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => {
              // Save current gauge value before switching
              if (activeSection === 'gauges') {
                setGaugeValues(prev => {
                  const newValues = [...prev];
                  newValues[activeGaugeIndex] = oscillationValue;
                  return newValues;
                });
              }
              setActiveGaugeIndex(0);
              setActiveSection('gauges');
              setOscillationValue(gaugeValues[0]); // Set oscillation to this gauge's value
              if (modalRef.current) {
                modalRef.current.focus();
              }
            }}
          >
            <div style={{ color: '#f0f0f0', fontWeight: 'bold', marginBottom: '3px', fontSize: '10px' }}>Natural</div>
            <GaugeDial 
              key="y" 
              needleRotation={activeSection === 'gauges' && activeGaugeIndex === 0 ? oscillationValue : gaugeValues[0]}
              isActive={activeSection === 'gauges' && activeGaugeIndex === 0}
            />
          </div>
          <div 
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => {
              // Save current gauge value before switching
              if (activeSection === 'gauges') {
                setGaugeValues(prev => {
                  const newValues = [...prev];
                  newValues[activeGaugeIndex] = oscillationValue;
                  return newValues;
                });
              }
              setActiveGaugeIndex(1);
              setActiveSection('gauges');
              setOscillationValue(gaugeValues[1]); // Set oscillation to this gauge's value
              if (modalRef.current) {
                modalRef.current.focus();
              }
            }}
          >
            <div style={{ color: '#f0f0f0', fontWeight: 'bold', marginBottom: '3px', fontSize: '10px' }}>Temp</div>
            <GaugeDial 
              key="z" 
              needleRotation={activeSection === 'gauges' && activeGaugeIndex === 1 ? oscillationValue : gaugeValues[1]}
              isActive={activeSection === 'gauges' && activeGaugeIndex === 1}
            />
          </div>
        </div>
      </div>
      {/* <hr className='w-100 opaci-20 my-1' /> */}
      <div className='tx-xxs mt-1 tx-ls-1 tx-center tx-white pa-1 bord-r-5 ' style={{ background: '#2d302d'}}>
        USE TAB / SCROLL TO NAVIGATE SETTINGS
      </div>
      <hr className='w-100 opaci-20 my-1' />
      {/* Middle section with sliders and meters */}
      <div className='w-100  flex-row gap-2 mb-1'>
        {/* Sliders section */}
        <div className='flex-1 pa-1 flex-col w-100 ' style={{ 
          background: '#adb0ad', 
        }}>
          <div className='flex-row flex-justify-around w-100 gap-1'>
            <div className='bg-b-20 bord-r-5 h-50px box-shadow-i-5'>
            <div className='translate-y--25'>
            <div className='hover-4  tx-xl tx-shadow-5'
            style={{ color: '#ff9900' }}
            >.</div>
            </div>
            </div>
            {["Light", "Color", "Solid"].map((label, index) => (
              <div className='bord-r-5' 
                key={index}
                style={{ 
                  // padding: '1px', 
                  border: activeSection === 'sliders' && activeSliderIndex === index ? '1px solid #ff3333' : '1px solid transparent'
                }}
                onClick={() => {
                  // Save current slider value before switching to new slider
                  if (activeSection === 'sliders') {
                    setSliderValues(prev => {
                      const newValues = [...prev];
                      newValues[activeSliderIndex] = oscillationValue;
                      return newValues;
                    });
                  }
                  setActiveSliderIndex(index);
                  setActiveSection('sliders');
                  setOscillationValue(sliderValues[index]); // Set oscillation to the new slider's value
                  if (modalRef.current) {
                    modalRef.current.focus();
                  }
                }}
              >
                <div className=' tx-white pos-abs tx-xsm opaci-75'
                style={{
                  transform: 'rotate(-90deg) translate(-100%, -180%)'
                }}
                >
                  <div className="flex-col pos-rel">
                    { activeSection === 'sliders' && activeSliderIndex === index &&
                  <div className=' pos-abs left-0 translate-x--100 tx-bold'
                  style={{
                    color: '#ff0000'
                  }}
                  >→</div>}
                  
                  <div> {label}</div>
                  </div>
                </div>
                <div className=' bord-r-5 noverflow'>
                  <SliderBar 
                    sliderPosition={activeSection === 'sliders' && activeSliderIndex === index ? oscillationValue : sliderValues[index]} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Meters section */}
        <div className="flex-col gap-3">
        <CircularMeter  needleRotation={  20  } />
        <CircularMeter  needleRotation={  300} />

        </div>
      </div>
      <hr className='w-100 opaci-20 mt-0 mb-1' />
      {/* Bottom section with controls and large meter */}
      <div className='flex-col w-100'>
        <div 
          ref={meterRef}
          onClick={handleMeterClick}
          style={{ 
            width: '100%', 
            cursor: activeSection === 'meter' ? 'pointer' : 'default',
            // border: activeSection === 'meter' ? '2px solid #333333' : 'none',
            borderRadius: '5px',
            zIndex: 29000,
            // padding: activeSection === 'meter' ? '2px' : '4px'
          }}
        >
          <LargeSemicircularMeter value={meterValue} isActive={activeSection === 'meter'} />
        </div>
        {/* <div className='tx-xs pt-2'>INTENT / CONFIDENCE</div> */}
        {/* <hr className='w-100 opaci-20 my-1' /> */}
      <div className='px-4 mt-1 tx-xs tx-center tx-white pa-1 bord-r-5 ' style={{ background: '#2d302d'}}>
        CONFIDENCE: {meterValue}%
      </div>









      <div className='pos-abs bottom-0 left-0 flex-row gap-1 pa-3'
      style={{
        paddingBottom: "12px"
      }}
      >
        <div className='border-white bord-r-100 bg-b-90'>
          <div className='flicker-5 _ddg pl-1 pt-1 bord-r-100'></div>
        </div>
          <div>
            <div className='pa-2 bg-b-50 bord-r-100 pos-rel flex-col'>
              <div className='tx-white pos-abs tx-lg'
              style={{color: '#aaaaaa',paddingBottom: "4px"}}
              >+</div>
            </div>
          </div>
      </div>
      
      <div className='pos-abs bottom-0 right-0 flex-row gap-1 pa-3'>
{/*         
      <div className='border-white bord-r-100 bg-b-90'>
          <div className='flicker-5 _ddr pl-1 pt-1 bord-r-100'></div>
        </div> */}
      <div className='border-white bord-r-100 bg-b-90'>
          <div className='flicker-3 _ddb pl-1 pt-1 bord-r-100'></div>
        </div>
        <div className='border-white bord-r-100 bg-b-90'>
          <div className='flicker-5 _ddg pl-1 pt-1 bord-r-100'></div>
        </div>
        <div className='border-white bord-r-100 bg-b-50'>
          <div className='flicker-2 _ddr pl-1 pt-1 bord-r-100'></div>
        </div>
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

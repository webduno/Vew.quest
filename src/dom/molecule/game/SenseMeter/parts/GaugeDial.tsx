'use client';
import React from 'react';

// Gauge/Dial Component

export const GaugeDial = ({
  size = 40, needleRotation = 45,
  borderWidth = 2,
  needleHeight = 20, isActive = false,
  onChange
}: {
  size?: number;
  needleRotation?: number;
  borderWidth?: number;
  needleHeight?: number;
  isActive?: boolean;
  onChange?: (angle: number) => void;
}) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onChange) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate angle from center to click point
    const angle = Math.atan2(
      e.clientY - centerY,
      e.clientX - centerX
    ) * (180 / Math.PI);
    
    // Convert to 0-360 range and round to nearest integer
    const normalizedAngle = Math.round(((angle + 90) + 360) % 360);
    
    onChange(normalizedAngle);
  };

  return (
    <div className='flex-col pointer pos-rel bord-r-100'
      onClick={handleClick}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: 'radial-gradient(#ffffff 30%,#c0c0b0, #ff9900)',
        border: `${borderWidth}px solid #555555`,
        boxShadow: `1px 1px 2px #000000, inset ${borderWidth}px ${borderWidth}px 10px ${isActive ? '#ff5555' : '#777777'}`,
      }}>
      <div className='pos-abs' style={{
        bottom: '50%',
        width: '4px',
        height: `${needleHeight}px`,
        background: isActive ? 'linear-gradient(90deg, #000000, red)' : 'linear-gradient(90deg, #000000, #ffffff)' ,
        transform: `rotate(${needleRotation}deg)`,
        clipPath: "polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)",
        transformOrigin: 'bottom center'
      }}></div>
    </div>
  );
};

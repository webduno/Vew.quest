'use client';
import React from 'react';

// Gauge/Dial Component

export const GaugeDial = ({
  size = 40, needleRotation = 45,
  borderWidth = 4,
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
    <div 
      onClick={handleClick}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: '#f5f5f5',
        border: `${borderWidth}px solid ${isActive ? '#ff5555' : '#3e3e3e'}`,
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer'
      }}>
      <div style={{
        position: 'absolute',
        bottom: '50%',
        width: '2px',
        height: `${needleHeight}px`,
        background: 'grey',
        transform: `rotate(${needleRotation}deg)`,
        transformOrigin: 'bottom center'
      }}></div>
    </div>
  );
};

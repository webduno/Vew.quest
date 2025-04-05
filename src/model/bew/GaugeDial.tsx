'use client';
import React from 'react';

// Gauge/Dial Component

export const GaugeDial = ({
  size = 40, needleRotation = 45,
  borderWidth = 4,
  needleHeight = 20, isActive = false
}: {
  size?: number;
  needleRotation?: number;
  borderWidth?: number;
  needleHeight?: number;
  isActive?: boolean;
}) => {
  return (
    <div style={{
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      background: '#f5f5f5',
      border: `${borderWidth}px solid ${isActive ? '#ff5555' : '#3e3e3e'}`,
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
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

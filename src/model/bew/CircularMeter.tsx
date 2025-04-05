'use client';
import React from 'react';

// Meter Component

export const CircularMeter = ({
  size = 24, needleRotation = 0, background = '#f0f0c0'
}: {
  size?: number;
  needleRotation?: number;
  background?: string;
}) => {
  return (
    <div style={{
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      background,
      border: '3px solid #3e3e3e',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        bottom: (size / 2)+"px",
        left: '50%',
        width: '2px',
        height: `${size / 2.4}px`,
        background: '#aaaaaa',
        transformOrigin: 'bottom center',
        transform: `translateX(-50%) rotate(${needleRotation}deg)`
      }}></div>
    </div>
  );
};

'use client';
import React from 'react';

// Meter Component

export const CircularMeter = ({
  size = 24, needleRotation = 0,
  background = '#f0f0c0'
}: {
  size?: number;
  needleRotation?: number;
  background?: string;
}) => {
  return (
    <div className='pos-rel noverflow' style={{
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      background,
      boxShadow: 'inset 0 0 6px #777777, 0 0 1px 2px #777777, 1px 1px 0 3px #333333, -1px -1px 0 2px #cccccc',
      // border: '3px solid #3e3e3e',
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

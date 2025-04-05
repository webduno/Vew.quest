'use client';
import React from 'react';

// Large Semicircular Meter Component

export const LargeSemicircularMeter = ({ 
  needleRotation = -30,
  value = 50,
  isActive = false
}: { 
  needleRotation?: number;
  value?: number;
  isActive?: boolean;
}) => {
  // Convert value (0-100) to needle rotation (-90 to 90 degrees)
  const calculatedRotation = needleRotation !== -30 ? needleRotation : (value * 1.8) - 90;
  
  return (
    <div style={{
      flex: '1',
      position: 'relative',
      height: '120px'
    }}>
      <div style={{
        width: '100%',
        height: '100%',
        borderRadius: '100px 100px 0 0',
        background: '#f0f0c0',
        border: `4px solid ${isActive ? '#333333' : '#3e3e3e'}`,
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          bottom: '0',
          left: '50%',
          width: '4px',
          height: '90px',
          background: isActive ? '#ff5555' : 'red',
          transformOrigin: 'bottom center',
          transform: `rotate(${calculatedRotation}deg) translateX(-50%)`
        }}></div>
      </div>
    </div>
  );
};

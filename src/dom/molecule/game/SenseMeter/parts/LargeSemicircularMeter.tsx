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
    <div className='pos-rel flex-1 h-80px' style={{}}>
      <div className='w-100 h-100 flex-col ' style={{
        borderRadius: '100px 100px 0 0',
        background: '#f0f0c0',
        boxShadow: "inset 0 0 25px #555555, inset 5px 5px 8px #888888, -1px -1px #aaaaaa, 1px 1px #333333",
        border: `2px solid ${isActive ? '#933333' : '#444444'}`,
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Arc line */}
        <div className='pos-abs' style={{
          top: '25%',
          left: '15%',
          width: '70%',
          height: '100px',
          border: '1.5px solid #cccccc',
          borderBottom: 'none',
          borderRadius: '100px 100px 0 0',
          opacity: 0.8
        }} />
        
        {/* Gauge lines */}
        <div style={{transform: 'scaleX(1.3)'}}>
          
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = -90 + (i * 25.7); // Evenly spaced from -90 to 90 degrees
          return (
            <div
              key={i}
              className='pos-abs '
              style={{
                bottom: '45%',
                left: '50%',
                width: '1px',
                height: '40px',
                background: '#999999',
                clipPath: "polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)",

                transformOrigin: 'center 70px',
                transform: `rotate(${angle}deg) translateX(-50%)`
              }}
            />
          );
        })}
        </div>
        <div className='pos-abs' style={{
          bottom: '6px',
          width: isActive ? '8px' : '4px',
          height: '60px',
          clipPath: "polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)",
          background: isActive ? '#ff0000' : '#aa5555',
          transformOrigin: 'bottom center',
          transform: `rotate(${calculatedRotation}deg) translateX(-50%)`
        }}></div>
      </div>
    </div>
  );
};

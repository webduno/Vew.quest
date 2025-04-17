'use client';
import React from 'react';

// Control Button Component

export const ControlButton = ({
  color = '#55ff55', isActive = false, onClick
}: {
  color?: string;
  isActive?: boolean;
  onClick?: () => void;
}) => {
  // Extract the active button information from isActive
  // The circle will show based on this condition, regardless of which section is active
  
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
        border: '1px solid #111',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          background: color,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          // Show the inner circle always when the button is selected
          // This makes it visible even when other sections are active
          display: isActive ? 'block' : 'none'
        }}></div>
      </div>
    </div>
  );
};

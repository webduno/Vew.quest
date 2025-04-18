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
  
  return (
    <div className='flex-col pointer gap-1 pa-1 bord-r-5'
      style={{
        background: isActive ? '#444' : 'transparent',
      }}
      onClick={onClick}
    >
      <div className='flex-col pos-rel' style={{
        padding: '3px',
        width: '10px',
        height: '10px',
        background: "#aaaaaa",
        // borderRadius: '3px',
        clipPath: "polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%)"
        // border: `2px solid ${isActive ? '#ffffff' : '#3e3e3e'}`
      }}>
        <div className='pos-abs  bord-r-100' style={{
          margin: !isActive ? '-5px 0 0 0' : '5px 0 0 0',
          padding: '4px',
          background: color,
          boxShadow: !isActive ? (
            "inset -2px -2px 2px #00000077, 0 4px 0 -2px #eeeeee, 0 6px 0 -2px #cccccc"
          ) : (
            "inset -2px -2px 2px #00000077, 0 -4px 0 -2px #eeeeee, 0 -6px 0 -2px #cccccc"
          ),
          // display: isActive ? 'block' : 'none'
        }}></div>
      </div>
      <div className="flex-col pos-rel bord-r-100" style={{
        width: '10px',
        height: '10px',
        background: '#222',
        border: '1px solid #111',
      }}>
        <div className='pos-abs bord-r-100' style={{
          padding: '2px',
          background: color,
          boxShadow: `0 0 10px 2px ${color}`,
          display: isActive ? 'block' : 'none'
        }}></div>
      </div>
    </div>
  );
};

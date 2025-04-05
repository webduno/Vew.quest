'use client';
import React from 'react';

// Slider Bar Component

export const SliderBar = ({
  width = 15, height = 80, sliderPosition = 0
}: {
  width?: number;
  height?: number;
  sliderPosition?: number;
}) => {
  return (
    <div style={{
      width: `${width}px`,
      height: `${height}px`,
      background: '#333',
      position: 'relative'
    }}>
      {/* <div className={`pos-abs bottom-0 left-0 translate-xy--100 px-1 `}>
              ⚠️
            </div> */}
      <div style={{
        position: 'absolute',
        bottom: `${sliderPosition}px`,
        left: '0',
        width: `${width}px`,
        height: '10px',
        background: '#666'
      }}></div>
    </div>
  );
};

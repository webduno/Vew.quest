'use client';
import React from 'react';

// Slider Bar Component

export const SliderBar = ({
  width = 15, height = 60, sliderPosition = 0,
  onSliderClick
}: {
  width?: number;
  height?: number;
  sliderPosition?: number;
  onSliderClick?: (value: number) => void;
}) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSliderClick) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    // Adjust calculation to account for the slider height (10px)
    const percentage = 100 - ((clickY - 5) / (rect.height - 10) * 100);
    const clampedValue = Math.max(0, Math.min(100, percentage));
    
    onSliderClick(clampedValue);
  };

  // Convert sliderPosition (0-100) to percentage of available height
  const sliderHeightPx = 10; // Height of the slider indicator
  const availableHeight = height - sliderHeightPx;
  const bottomPosition = Math.min(availableHeight, (sliderPosition / 100) * availableHeight);

  return (
    <div 
      style={{
        width: `${width}px`,
        height: `${height}px`,
        background: '#333',
        position: 'relative',
        cursor: onSliderClick ? 'pointer' : 'default'
      }}
      onClick={handleClick}
    >
      {/* <div className={`pos-abs bottom-0 left-0 translate-xy--100 px-1 `}>
              ⚠️
            </div> */}
      <div style={{
        position: 'absolute',
        bottom: `${bottomPosition}px`,
        left: '0',
        width: `${width}px`,
        height: `${sliderHeightPx}px`,
        background: '#666'
      }}></div>
    </div>
  );
};

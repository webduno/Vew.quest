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
    
    // round value to integer
    const roundedValue = Math.round(clampedValue);
    onSliderClick(roundedValue);
  };

  // Convert sliderPosition (0-100) to percentage of available height
  const sliderHeightPx = 10; // Height of the slider indicator
  const availableHeight = height - sliderHeightPx;
  const bottomPosition = Math.min(availableHeight, (sliderPosition / 100) * availableHeight);

  return (
    <div  className='pos-rel'
      style={{
        width: `${width}px`,
        height: `${height}px`,
        background: 'linear-gradient(90deg, #555555 40%, #222222 50%, #555555 60%)',
        boxShadow: 'inset 2px 2px 6px #222222',
        cursor: onSliderClick ? 'pointer' : 'default'
      }}
      onClick={handleClick}
    >
      <div className='pos-abs left-0' style={{
        bottom: `${bottomPosition}px`,
        width: `${width}px`,
        height: `${sliderHeightPx}px`,
        background: '#cccccc',
        borderRadius: '2px',
        boxShadow: 'inset -1px -1px 3px #444444, inset 2px 2px 1px #ffffff'
      }}></div>
    </div>
  );
};

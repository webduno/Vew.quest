'use client';
import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import CanvasDraw from 'react-canvas-draw';

export type SketchInputsRef = {
  getCurrentData: () => string;
  loadSavedData: (data: string) => void;
};

export const SketchInputs = forwardRef<SketchInputsRef, { 
  onValueChange: (value: string) => void;
  initialValue?: string;
}>(({ onValueChange, initialValue = '' }, ref) => {
  const canvasRef = useRef<CanvasDraw>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0 });
  const [isCanvasReady, setIsCanvasReady] = useState(false);

  useImperativeHandle(ref, () => ({
    getCurrentData: () => {
      if (canvasRef.current) {
        return canvasRef.current.getSaveData();
      }
      return '';
    },
    loadSavedData: (data: string) => {
      if (canvasRef.current && data) {
        try {
          canvasRef.current.loadSaveData(data);
        } catch (e) {
          console.warn('Failed to load canvas data:', e);
        }
      }
    }
  }));

  // Update dimensions when container size changes
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setDimensions({ width });
        if (width > 0) {
          setIsCanvasReady(true);
        }
      }
    };

    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Load initial data when canvas is ready
  useEffect(() => {
    if (isCanvasReady && canvasRef.current && initialValue) {
      try {
        canvasRef.current.loadSaveData(initialValue);
      } catch (e) {
        console.warn('Failed to load initial canvas data:', e);
      }
    }
  }, [isCanvasReady, initialValue]);

  // Notify parent of canvas changes
  useEffect(() => {
    if (canvasRef.current) {
      const interval = setInterval(() => {
        if (canvasRef.current) {
          const data = canvasRef.current.getSaveData();
          onValueChange(data);
        }
      }, 500); // Update more frequently
      return () => clearInterval(interval);
    }
  }, [onValueChange]);

  return (
    <div ref={containerRef} 
    className='pos-rel'
    style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
      {dimensions.width > 0 && (
        <CanvasDraw
          ref={canvasRef}
          className='w-100'
          brushColor="#000000"
          brushRadius={2}
          lazyRadius={0}
          canvasWidth={dimensions.width}
          canvasHeight={300}
          hideGrid={true}
          loadTimeOffset={0}
          style={{
            width: '100%',
            height: '300px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
          }}
          saveData={initialValue}
          immediateLoading={true}
        />
      )}
      <div className='flex-col flex-align-end pos-abs right-0 bottom-0 mb-8 mr-2 gap-2'>
        <button 
          className=' z-1000'
          onClick={() => {
            if (canvasRef.current) {
              canvasRef.current.undo();
              const data = canvasRef.current.getSaveData();
              onValueChange(data);
            }
          }}
          style={{
            padding: '8px 16px',
            backgroundColor: '#e5e7eb',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Undo
        </button>
        <button  className='z-1000 '
          onClick={() => {
            if (canvasRef.current) {
              canvasRef.current.clear();
              onValueChange('');
            }
          }}
          style={{
            padding: '8px 16px',
            backgroundColor: '#e5e7eb',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
});

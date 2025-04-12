'use client';
import { useThree, useFrame } from '@react-three/fiber';
import { useRef } from 'react';

// Performance stats component that works inside Canvas

export const PerformanceStats = ({ onStatsUpdate }: { onStatsUpdate: (stats: any) => void; }) => {
  const { gl, scene } = useThree();
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());



  useFrame(() => {
    frameCount.current++;

    // Update stats every second
    const currentTime = performance.now();
    if (currentTime - lastTime.current >= 1000) {
      const elapsed = currentTime - lastTime.current;
      const fps = Math.round((frameCount.current * 1000) / elapsed);

      onStatsUpdate({
        drawCalls: gl.info.render.calls,
        objectCount: scene.children.length,
        fps,
        frameTime: Math.round(elapsed / frameCount.current)
      });

      frameCount.current = 0;
      lastTime.current = currentTime;
    }
  });

  // Return null since we don't want to render anything in the 3D scene
  return null;
};

'use client';
import { Text, Box } from '@react-three/drei';
import { useState, useRef, useCallback, useEffect } from 'react';

class ColorGenerator {
  static generate() {
    const hue = Math.random() * 360;
    const saturation = Math.random() * 100;
    return `hsl(${hue}, ${saturation}%, 50%)`;
  }
}

class GameTimer {
  private startTime: number;
  private currentRound: number;
  private readonly roundDuration: number;
  private readonly maxRounds: number;

  constructor(roundDuration: number, maxRounds: number) {
    this.startTime = Date.now();
    this.currentRound = 1;
    this.roundDuration = roundDuration;
    this.maxRounds = maxRounds;
  }

  update() {
    const elapsedTime = Date.now() - this.startTime;
    const newRound = Math.min(
      Math.floor(elapsedTime / this.roundDuration) + 1,
      this.maxRounds + 1
    );

    const isNewRound = newRound > this.currentRound;
    this.currentRound = newRound;

    return {
      currentRound: Math.min(this.currentRound, this.maxRounds),
      isNewRound,
      isGameOver: this.currentRound > this.maxRounds
    };
  }
}

export const ColorGameLoop = ({
  hardMode,
  onGameEnd,
  onCheckSaturation,
  points,
  misses
}: {
  hardMode: boolean;
  onGameEnd: () => void;
  onCheckSaturation: (isLess: boolean, currentColor: string, currentColorAnswered: boolean) => boolean;
  points: number;
  misses: number;
}) => {
  const [currentRound, setCurrentRound] = useState(1);
  const [currentColor, setCurrentColor] = useState(ColorGenerator.generate());
  const [isAnswered, setIsAnswered] = useState(false);
  
  const gameTimerRef = useRef<GameTimer>(new GameTimer(3000, 5));
  const animationFrameRef = useRef<number>();
  const isGameOverRef = useRef(false);

  const gameLoop = useCallback(() => {
    if (isGameOverRef.current) return;

    const { currentRound: newRound, isNewRound, isGameOver } = gameTimerRef.current.update();

    if (isNewRound) {
      if (!isAnswered) {
        onCheckSaturation(false, currentColor, false);
      }
      setCurrentRound(newRound);
      setCurrentColor(ColorGenerator.generate());
      setIsAnswered(false);
    }

    if (isGameOver) {
      isGameOverRef.current = true;
      onGameEnd();
      return;
    }

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [onGameEnd, points, misses, isAnswered, currentColor, onCheckSaturation]);

  // Start game loop
  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameLoop]);

  const handleAnswer = useCallback((isLess: boolean) => {
    if (isAnswered) return;
    onCheckSaturation(isLess, currentColor, true);
    setIsAnswered(true);
  }, [currentColor, isAnswered, onCheckSaturation]);

  return (
    <>
    {!hardMode && 
      <pointLight
        position={[-8, 1.49, 9]}
        intensity={1}
        color={currentColor}
      />
    }
      <Text
        font="/fonts/wallpoet.ttf"
        fontSize={0.17}
        color="#ffffff"
        anchorX="right"
        anchorY="middle"
        textAlign="right"
        position={[-8.28, 1.73, 13.839]}
        rotation={[0, Math.PI, 0]}
      >
        {`${currentRound}`}
      </Text>
      <Text
        font="/fonts/wallpoet.ttf"
        fontSize={0.07}
        color="#ffffff"
        anchorX="right"
        anchorY="middle"
        textAlign="right"
        position={[-8.38, 1.75, 13.839]}
        rotation={[0, Math.PI, 0]}
      >
        {`/5`}
      </Text>
      <Box
        position={[-8.2, 1.3, 13.82]}
        rotation={[0, 0, 0]}
        args={[.3, .3, .1]}
        onClick={() => handleAnswer(false)}
      >
        <meshStandardMaterial color="#ffffff" emissive="#333333" />
      </Box>
      <Box
        position={[-7.8, 1.3, 13.82]}
        rotation={[0, 0, 0]}
        args={[.3, .3, .1]}
        onClick={() => handleAnswer(true)}
      >
        <meshStandardMaterial color="#dddddd" />
      </Box>
    </>
  );
};

'use client';
import { Text, Box, Sphere } from '@react-three/drei';
import { useState, useRef, useCallback, useEffect } from 'react';

class PrimitivesGenerator {
  static generate() {
    const primitives: { type: 'box' | 'sphere', count: number }[] = [];
    const totalPrimitives = 5;
    const boxCount = Math.floor(Math.random() * (totalPrimitives + 1));
    const sphereCount = totalPrimitives - boxCount;

    for (let i = 0; i < boxCount; i++) {
      primitives.push({ type: 'box', count: i });
    }
    for (let i = 0; i < sphereCount; i++) {
      primitives.push({ type: 'sphere', count: i });
    }

    // Shuffle the array
    for (let i = primitives.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [primitives[i], primitives[j]] = [primitives[j], primitives[i]];
    }

    return primitives;
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

export const SolidGameLoop = ({
  hardMode,
  onGameEnd,
  onCheckPrimitives,
  points,
  misses
}: {
  hardMode: boolean;
  onGameEnd: () => void;
  onCheckPrimitives: (isMoreBoxes: boolean, currentPrimitives: { type: 'box' | 'sphere', count: number }[], currentPrimitivesAnswered: boolean) => boolean;
  points: number;
  misses: number;
}) => {
  const [currentRound, setCurrentRound] = useState(1);
  const [currentPrimitives, setCurrentPrimitives] = useState(PrimitivesGenerator.generate());
  const [isAnswered, setIsAnswered] = useState(false);
  
  const gameTimerRef = useRef<GameTimer>(new GameTimer(3000, 5));
  const animationFrameRef = useRef<number>();
  const isGameOverRef = useRef(false);

  const gameLoop = useCallback(() => {
    if (isGameOverRef.current) return;

    const { currentRound: newRound, isNewRound, isGameOver } = gameTimerRef.current.update();

    if (isNewRound) {
      if (!isAnswered) {
        onCheckPrimitives(false, currentPrimitives, false);
      }
      setCurrentRound(newRound);
      setCurrentPrimitives(PrimitivesGenerator.generate());
      setIsAnswered(false);
    }

    if (isGameOver) {
      isGameOverRef.current = true;
      onGameEnd();
      return;
    }

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [onGameEnd, points, misses, isAnswered, currentPrimitives, onCheckPrimitives]);

  // Start game loop
  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameLoop]);

  const handleAnswer = useCallback((isMoreBoxes: boolean) => {
    if (isAnswered) return;
    onCheckPrimitives(isMoreBoxes, currentPrimitives, true);
    setIsAnswered(true);
  }, [currentPrimitives, isAnswered, onCheckPrimitives]);

  return (
    <>
      <group position={[-11, 1.49, 9]}>
        {currentPrimitives.map((primitive, index) => {
          const angle = (index / currentPrimitives.length) * Math.PI * 2;
          const radius = 1;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          
          if (primitive.type === 'box') {
            return (
              <Box
                key={`box-${index}`}
                position={[x, 0, z]}
                args={[0.3, 0.3, 0.3]}
              >
                <meshStandardMaterial color="#ffffff" />
              </Box>
            );
          } else {
            return (
              <Sphere
                key={`sphere-${index}`}
                position={[x, 0, z]}
                args={[0.15, 16, 16]}
              >
                <meshStandardMaterial color="#ffffff" />
              </Sphere>
            );
          }
        })}
      </group>

      <Text
        font="/fonts/wallpoet.ttf"
        fontSize={0.17}
        color="#ffffff"
        anchorX="right"
        anchorY="middle"
        textAlign="right"
        position={[-11.28, 1.73, 13.839]}
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
        position={[-11.38, 1.75, 13.839]}
        rotation={[0, Math.PI, 0]}
      >
        {`/5`}
      </Text>
      <Box
        position={[-11.2, 1.3, 13.82]}
        rotation={[0, 0, 0]}
        args={[.3, .3, .1]}
        onClick={() => handleAnswer(true)}
      >
        <meshStandardMaterial color="#ffffff" emissive="#333333" />
      </Box>
      <Box
        position={[-10.8, 1.3, 13.82]}
        rotation={[0, 0, 0]}
        args={[.3, .3, .1]}
        onClick={() => handleAnswer(false)}
      >
        <meshStandardMaterial color="#dddddd" />
      </Box>
    </>
  );
}; 
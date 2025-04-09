'use client';
import { Text } from '@react-three/drei';






export const AnalysisScreen = ({ analysisResult }: { analysisResult: string; }) => {
  return (
    <Text font={"/fonts/wallpoet.ttf"} fontSize={0.1} color={"#448844"}
      anchorX="center" anchorY="top" textAlign="left"
    >
      {analysisResult}
    </Text>
  );
};

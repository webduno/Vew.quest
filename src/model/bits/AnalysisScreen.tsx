'use client';
import { Text } from '@react-three/drei';
import { useMemo } from 'react';

export const AnalysisScreen = ({
  analysisResult,
  accuracyResult,
  targetResults,
  submitted,
}: {
  analysisResult: string;
  targetResults: any;
  accuracyResult: any;
  submitted: any;
}) => {
  const toFixedObject = useMemo(() => {
    return (obj: Record<string, any>) => {
      return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [
          key, 
          typeof value === 'number' ? value.toFixed(2) : value
        ])
      );
    };
  }, []);

  const formattedAccuracy = useMemo(() => toFixedObject(accuracyResult), [accuracyResult, toFixedObject]);

  return (<>
    <Text font={"/fonts/wallpoet.ttf"} fontSize={0.1} color={"#448844"}
      anchorX="center" anchorY="top" textAlign="left"
    >
      {analysisResult}
    </Text>
    <Text font={"/fonts/wallpoet.ttf"} fontSize={0.1} color={"#448844"}
      anchorX="center" anchorY="top" textAlign="left"
      position={[0, -.95, 0]}
    >
{`
type        natural        temp        light        color        solidness        
  ${accuracyResult.typeMatch ? "✅" : "❌"}   ${formattedAccuracy.naturalityAccuracy*100}%                  ${formattedAccuracy.temperatureAccuracy*100}%            ${formattedAccuracy.lightAccuracy*100}%            ${formattedAccuracy.colorAccuracy*100}%              ${formattedAccuracy.solidAccuracy*100}%


target         ${targetResults.natural}               ${targetResults.temp}              ${targetResults.light}            ${targetResults.color}               ${targetResults.solid}
sent            ${parseInt(submitted.natural)}            ${parseInt(submitted.temp)}              ${parseInt(submitted.light)}              ${parseInt(submitted.color)}                ${parseInt(submitted.solid)}

`}
    </Text>
  </>);
};

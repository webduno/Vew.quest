'use client';
import { Text } from '@react-three/drei';
import { useMemo } from 'react';

export const AnalysisScreen = ({
  analysisResult,
  accuracyResult,
  targetResults,
  submitted,
  rewardAmount
}: {
  analysisResult: string;
  targetResults: any;
  accuracyResult: any;
  submitted: any;
  rewardAmount: any
}) => {
  const toFixedObject = useMemo(() => {
    return (obj: Record<string, any>) => {
      return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [
          key, 
          typeof value === 'number' ? value : value
        ])
      );
    };
  }, []);

  const formattedAccuracy = useMemo(() => toFixedObject(accuracyResult), [accuracyResult, toFixedObject]);

  return (<>
    <Text font={"/fonts/wallpoet.ttf"} fontSize={0.1} color={"#446644"}
      anchorX="left" anchorY="top" textAlign="left"
      position={[-1.5,0,0]}
    >
      {analysisResult}
    </Text>
    <Text font={"/fonts/wallpoet.ttf"} fontSize={0.1} color={"#337733"}
      anchorX="center" anchorY="top" textAlign="left"
      position={[0, -.8, 0]}
    >
{`${accuracyResult.typeMatch ? "✅" : "❌"}
type        natural        temp        light        color        solidness        
${targetResults.type}       ${formattedAccuracy.naturalityAccuracy}%                  ${formattedAccuracy.temperatureAccuracy}%            ${formattedAccuracy.lightAccuracy}%            ${formattedAccuracy.colorAccuracy}%              ${formattedAccuracy.solidAccuracy}%

TARGET         ${targetResults.natural}               ${targetResults.temp}                 ${targetResults.light}            ${targetResults.color}               ${targetResults.solid}
SENT            ${parseInt(submitted.natural)}            ${parseInt(submitted.temp)}              ${parseInt(submitted.light)}              ${parseInt(submitted.color)}                ${parseInt(submitted.solid)}

`}
    </Text>



    
    <Text font={"/fonts/wallpoet.ttf"} fontSize={0.15} color={"#22aa22"}
      anchorX="right" anchorY="top" textAlign="right"
      letterSpacing={.2}
      position={[1.6, -1.65, 0]}
    >
{`REWARD = $${rewardAmount}`}
    </Text>
  </>);
};

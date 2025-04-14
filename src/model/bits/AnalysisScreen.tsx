'use client';
import { Box, Text } from '@react-three/drei';
import { useMemo } from 'react';

export const AnalysisScreen = ({
  analysisResult,
  accuracyResult,
  targetResults,
  submitted,
  rewardAmount,
  onReset
}: {
  analysisResult: string;
  targetResults: any;
  accuracyResult: any;
  submitted: any;
  rewardAmount: any;
  onReset: () => void;
}) => {
  const toFixedObject = useMemo(() => {
    return (obj: Record<string, any>) => {
      return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [
          key, 
          typeof value === 'number' ? Math.round(value) : value
        ])
      );
    };
  }, []);

  const formattedAccuracy = useMemo(() => toFixedObject(accuracyResult), [accuracyResult, toFixedObject]);

  return (<>
    <Text font={"/fonts/wallpoet.ttf"} fontSize={0.1} color={"#446644"}
      anchorX="left" anchorY="top" textAlign="left"
      position={[-1.75,-0.1,0]}
    >
      {analysisResult}
    </Text>
    <Text font={"/fonts/beanie.ttf"} fontSize={0.1} color={"#337733"}
      anchorX="center" anchorY="top" textAlign="left"
      position={[0, -.8, 0]}
    >
{`
SENT
type         natural          temp             light            color            solidness        
${submitted.type.toLowerCase()}${accuracyResult.typeMatch ? "✓" : "✗"}             ${parseInt(submitted.natural)}            ${parseInt(submitted.temp)}              ${parseInt(submitted.light)}              ${parseInt(submitted.color)}                ${parseInt(submitted.solid)}

TARGET         ${targetResults.natural}               ${targetResults.temp}               ${targetResults.light}           ${targetResults.color}                 ${targetResults.solid}
${targetResults.type}           ${formattedAccuracy.naturalityAccuracy}%             ${formattedAccuracy.temperatureAccuracy}%            ${formattedAccuracy.lightAccuracy}%            ${formattedAccuracy.colorAccuracy}%              ${formattedAccuracy.solidAccuracy}%
`}
    </Text>



    
    <Text font={"/fonts/wallpoet.ttf"} fontSize={0.15} color={"#22aa22"}
      anchorX="right" anchorY="top" textAlign="right"
      letterSpacing={.2}
      position={[1.6, -1.65, 0]}
    >
{`(${formattedAccuracy.overallAccuracy}%) | REWARD = $${rewardAmount}`}
    </Text>



    <Text font={"/fonts/wallpoet.ttf"} fontSize={0.2} color={"#2a2a2a"}
      anchorX="center" anchorY="top" textAlign="center"
      letterSpacing={.2}
      rotation={[0, Math.PI, 0]}
      position={[-3, -.2, 10.9]}
    >
      {`NEW TARGET`}
    </Text>
<Box position={[-3, -1.2, 10.9]} onClick={onReset} receiveShadow
args={[1, 1, .1]}
>
  <meshStandardMaterial color={"#cccccc"} />
</Box>
  </>);
};

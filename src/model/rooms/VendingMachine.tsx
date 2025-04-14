'use client';
import { Box, Text, Sphere, Cylinder, Plane } from '@react-three/drei';
import { PhysicalWall } from '../core/PhysicalWall';
import { useState } from 'react';

export const VendingMachine = () => {
  const [selectedItem, setSelectedItem] = useState(0);
  const items = [
    { name: 'PK Pill', position: [-0.3, 0.5, -0.25], cost: 1350 },
    { name: 'Mars Pass', position: [-0.3, 0.5, 0.35], cost: 2910 },
    { name: 'Declasification request', position: [-0.3, 0.1, -0.25], cost: 830 },
    { name: 'Chronovisor Ticket', position: [-0.3, 0.1, 0.3], cost: 4720 }
  ];

  const handleNext = () => {
    setSelectedItem((prev) => (prev + 1) % items.length);
  };

  const handlePrevious = () => {
    setSelectedItem((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleBuy = () => {
    console.log(`Buying ${items[selectedItem].name}`);
  };

  return (
    <group position={[0, 0, 0]} rotation={[0, 0, 0]}>
      {/* veending machine */}
      <PhysicalWall size={[1.1, 2.6, 2.5]} color="#ff9933" visible={false}
        position={[2.1, 1.3, 12]} />

      <group position={[1.9, 1.26, 12]}>
        {/* top */}
        <Box position={[0, 1.2, 0]} args={[1.11, .2, 2.45]}>
          <meshStandardMaterial color={"#ffffff"} emissive={"#222222"} />
        </Box>
        <Box position={[0, 0, -1.11]} args={[1.1, 2.55, .2]}>
          <meshStandardMaterial color={"#ffffff"} emissive={"#222222"} />
        </Box>
        <Box position={[0, 0, 1.11]} args={[1.1, 2.55, .2]}>
          <meshStandardMaterial color={"#ffffff"} emissive={"#222222"} />
        </Box>

        {/* console */}
          <Box position={[-0.5, -.15, 0.6]} args={[.01, .7, .6,1,5,5]} 
          >
            <meshStandardMaterial emissive="#222222" wireframe={true}
             color={"#ffffff"} />
          </Box>
        <Box position={[0, 0.2, 0.6]} args={[1, 1.8, .8]}>
          <meshStandardMaterial color={"#ffffff"} />
        </Box>
        <group position={[-0.5, 0.5, 0.6]}>
          <Plane position={[-0.01, 0.4, 0]}  args={[.7, .3]}
          rotation={[0, -Math.PI / 2, 0]}
          >
            <meshStandardMaterial color={"#dddddd"} />
          </Plane>
          <Text font="/fonts/wallpoet.ttf" fontSize={0.07} 
          color={"#55cc55"}
            anchorX="center" anchorY="middle" textAlign="center"
            position={[-0.02, 0.45, 0]} rotation={[0, -Math.PI / 2, 0]}
          >
            {/* selected item */}
{`${items[selectedItem].name.replace(" ", "\n")}`}
          </Text>
          
          <Text font="/fonts/consolas.ttf" fontSize={0.07} 
          color={"#557755"}
            anchorX="center" anchorY="middle" textAlign="center"
            position={[-0.02, 0.3, 0]} rotation={[0, -Math.PI / 2, 0]}
          >
            {/* selected item */}
{`PRICE: ${items[selectedItem].cost}`}
          </Text>
          {/* next */}
          <Text font="/fonts/consolas.ttf" fontSize={0.05} 
          color={"#555555"}
            anchorX="center" anchorY="middle" textAlign="center"
            position={[-0.051, 0, -0.25]} rotation={[0, -Math.PI / 2, 0]}
          >
            {`NEXT`}
          </Text>
          <Box position={[0, 0, -.25]} args={[.1, .3, .2]} onClick={handleNext}>
            <meshStandardMaterial emissive="#222222"
             color={"#ffffff"} />
          </Box>
          {/* previous */}
          <Text font="/fonts/consolas.ttf" fontSize={0.05} 
          color={"#555555"}
            anchorX="center" anchorY="middle" textAlign="center"
            position={[-0.051, 0, 0]} rotation={[0, -Math.PI / 2, 0]}
          >
            {`PREV`}
          </Text>
          <Box position={[0, 0, 0]} args={[.1, .3, .2]} onClick={handlePrevious}>
            <meshStandardMaterial emissive="#222222"
             color={"#ffffff"} />
          </Box>
          {/* buy */}
          <Text font="/fonts/consolas.ttf" fontSize={0.1} 
          color={"#55ff55"}
            anchorX="center" anchorY="middle" textAlign="center"
            position={[-0.051, 0, 0.25]} rotation={[0, -Math.PI / 2, 0]}
          >
            {`BUY`}
          </Text>
          <Box position={[0, 0, .25]} args={[.1, .4, .2]} onClick={handleBuy}>
            <meshStandardMaterial emissive="#112211"
             color={"#ffffff"} />
          </Box>
        </group>

        {/* insied floors */}
        <group position={[.1, 0, -0.5]}>
          <Box position={[0, 0.9, 0]} args={[.6, .05, 1.4]}>
            <meshStandardMaterial color={"#ffffff"} />
          </Box>

          <Box position={[0, 0.6, -0.3]} args={[.2, .2, .3]}>
            <meshStandardMaterial color={"#eeeeee"} />
          </Box>
          <Box position={[0, 0.7, -0.3]} args={[.22, .1, .33]}>
            <meshStandardMaterial color={"#dddddd"} />
          </Box>









          
{/* /////////////////////////////////////////////////////////////////////////// */}
          <Box position={[-0.3, 0.5, -0.25]} args={[.02, .15, .25]}>
            <meshStandardMaterial color={selectedItem === 0 ? "#ffffff" : "#bbbbbb"}  />
          </Box>

          <Text font="/fonts/consolas.ttf" fontSize={0.05} 
          color={selectedItem === 0 ? "#ffffff" : "#555555"}
            anchorX="center" anchorY="middle" textAlign="center"
            position={[-0.32, 0.5, -0.25]} rotation={[0, -Math.PI / 2, 0]}
          >
            {`PK Pill`}
          </Text>
{/* /////////////////////////////////////////////////////////////////////////// */}

<Box position={[-0.3, 0.5, 0.35]} args={[.02, .15, .2]}>
            <meshStandardMaterial 
            color={selectedItem === 1 ? "#ffffff" : "#bbbbbb"}  />
          </Box>

          <Sphere position={[0, 0.65, 0.3]} args={[.15]}>
            <meshStandardMaterial color={"#eeeeee"} />
          </Sphere>
          <Text font="/fonts/consolas.ttf" fontSize={0.05} 
          color={selectedItem === 1 ? "#ffffff" : "#555555"}
            anchorX="center" anchorY="middle" textAlign="center"
            position={[-0.32, 0.5, 0.35]} rotation={[0, -Math.PI / 2, 0]}
          >
            {`Mars
Pass`}
          </Text>
{/* /////////////////////////////////////////////////////////////////////////// */}

          <Box position={[0, 0.5, 0]} args={[.6, .05, 1.4]}>
            <meshStandardMaterial color={"#ffffff"} />
          </Box>

{/* /////////////////////////////////////////////////////////////////////////// */}

<Box position={[-0.3, 0.1, -0.25]} args={[.02, .15, .4]}>
            <meshStandardMaterial
               color={selectedItem === 2 ? "#ffffff" : "#bbbbbb"}
            />
          </Box>
          <Box position={[0, 0.125, -0.3]} args={[.33, .02, .33]}>
            <meshStandardMaterial color={"#eeeeee"} />
          </Box>

          <Box position={[0, 0.1, 0]} args={[.6, .05, 1.4]}>
            <meshStandardMaterial color={"#ffffff"} />
          </Box>

          <Box position={[0, 0.15, -0.33]} args={[.3, .02, .3]}
            rotation={[0, 0.2, 0]}
          >
            <meshStandardMaterial color={"#eeeeee"} />
          </Box>

          <Text font="/fonts/consolas.ttf" fontSize={0.05}
           color={selectedItem === 2 ? "#ffffff" : "#555555"}
            anchorX="center" anchorY="middle" textAlign="center"
            position={[-0.32, 0.1, -0.25]} rotation={[0, -Math.PI / 2, 0]}
          >
            {`Declasific-
ation request`}
          </Text>
{/* /////////////////////////////////////////////////////////////////////////// */}

<Box position={[-0.3, 0.1, 0.3]} args={[.02, .15, .3]}>
            <meshStandardMaterial 
            color={selectedItem === 3 ? "#ffffff" : "#bbbbbb"}
            />
          </Box>
          <Cylinder position={[0, 0.2, 0.3]} args={[.2, .2, .1]}>
            <meshStandardMaterial color={"#eeeeee"} />
          </Cylinder>
          <Text font="/fonts/consolas.ttf" fontSize={0.05} 
          color={selectedItem === 3 ? "#ffffff" : "#555555"}
            anchorX="center" anchorY="middle" textAlign="center"
            position={[-0.32, 0.1, 0.3]} rotation={[0, -Math.PI / 2, 0]}
          >
            {`Chronovis-
or Ticket`}
          </Text>

          <Box position={[0, -0.3, 0]} args={[.6, .05, 1.4]}>
            <meshStandardMaterial color={"#ffffff"} />
          </Box>
        </group>
{/* /////////////////////////////////////////////////////////////////////////// */}

        {/* bottom */}
        <Box position={[0, -1, 0]} args={[1.1, .8, 2]}>
          <meshStandardMaterial color={"#ffffff"} emissive={"#222222"} />
        </Box>
        <Box position={[-.5, -.92, 0]} args={[.11, .5, 1.8]}>
          <meshStandardMaterial color={"#dddddd"} />
        </Box>

      </group>

      {/* back */}
      <Box position={[2.3, 1.5, 12]} args={[.1, 1.9, 2.1]}>
        <meshStandardMaterial color={"#ffffff"} />
      </Box>
      {/* glass */}
      <Box position={[1.45, 1.5, 12]} args={[.05, 1.9, 2.1]}>
        <meshStandardMaterial color={"#ffffff"}
          opacity={0.5}
          transparent={true} />
      </Box>

    </group>
  );
};

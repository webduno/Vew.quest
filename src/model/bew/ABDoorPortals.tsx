'use client';
import { Box } from '@react-three/drei';
import { PhysicalTrigger } from './PhysicalTrigger';
import { PhysicalWall } from './PhysicalWall';
import { useState } from 'react';
import { StyledWall } from './StyledWall';




export const ABDoorPortals = ({ setPlayerPosition }: { setPlayerPosition: (position: [number, number, number]) => void; }) => {
  const [cooldown, setCooldown] = useState(false);
  const [doorVisible, setDoorVisible] = useState(true);



const randomPromptDoor = () => {
  setTimeout(() => {

    setDoorVisible(false);
  }, 1000)
  // between 1 and 3
  // const randomNumber = Math.floor(Math.random() * 3) + 1;
  // console.log(randomNumber);

  // const randomGuess = prompt(`Guess the number between 1 and 3`);
  // if (randomGuess === randomNumber.toString()) {
  //   console.log('You guessed the number!');
  //   setDoorVisible(false);
  // } else {
  //   console.log('You guessed the wrong number!');
  // }
}



  return (<>



  

      {/* front bevel */}
      <PhysicalWall color="#f7f7f7"
        size={[1.1, 1, 20.1]}
        position={[-4, 3.6, 5]} rotation={[0, -Math.PI / 2, 0]} />


<PhysicalWall color="#ffffff"
        size={[1, 4, 5]}
        position={[3.5, 2, 5]} rotation={[0, -Math.PI / 2, 0]} />
     
      {/* front bottom barriers */}
      <Box args={[5.1, 0.4, 1.1]} position={[3.5, 0, 5]}>
        <meshStandardMaterial color="#cccccc" />
      </Box>

<StyledWall color="#ffffff"
        size={[10, 4, 1]}
        position={[-6, 2, 5]} 
         />





    <PhysicalTrigger visible={false} triggerCount={999}
      onCollide={() => {
        if (cooldown) {
          return;
        }
        setCooldown(true);
        randomPromptDoor()
        
        
        setTimeout(() => {
          setDoorVisible(true);
          setCooldown(false);
        }, 3000);
      }}

      size={[1, 4, 0.2]}
      position={[0, 1, 4.8]}
      rotation={[0, 0, 0]} />



{/* actual door */}
{doorVisible && (
  <>
    <PhysicalWall color="#ffddaa"
        visible={true}
        size={[.2, 4, 2]}
        position={[0, 2, 5]} rotation={[0, -Math.PI / 2, 0]} />
    {/* doorknob */}
    <Box position={[.5, 1.5, 4.75]} args={[.2, .2, .2]} castShadow>
      <meshStandardMaterial color="#cccccc" />
    </Box>
    {/* <Box position={[-.5, 1.5, 5.25]} args={[.2, .2, .2]} castShadow>
      <meshStandardMaterial color="#cccccc" />
    </Box> */}
  </>
)}






    {/* door light */}
    <Box position={[0, 3.3, 4.45]} args={[.12, .12, .05]}>
      <meshStandardMaterial color="#cccccc" />
    </Box>
    <Box position={[0, 3.3, 4.45]} args={[.06, .06, .1]}>
      <meshStandardMaterial color={cooldown ? "#ff5555" : "#55ff55"} />
    </Box>
    







    
  </>);
};

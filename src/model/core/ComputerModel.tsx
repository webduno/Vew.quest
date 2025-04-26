import { Vector3 } from "three";
import { RoundedBox } from "@react-three/drei";
import { Cylinder } from "@react-three/drei";

export const ComputerModel = ({state,tokensArrayArray,onClick}:any) => {
    return (<>
    <group position={[0,-0.15,0]} onClick={onClick}>




      {<>

        {  // hovered active button
        <>
          <group position={new Vector3(-0.1,0.05,0.065)} >
            <group position={new Vector3(-0.12,0.02,-0.086)}>
            {/* // north facing
            // south facing */}
              {/* {
                <DynaText text={state?.token.toUpperCase()+"" || ""} 
                  color={ !false ? state?.tokenColor : "#222222"}
                  position={new Vector3(0.12,0,0.0)}
                  rotation={[0,0,0]}
                  isSelected={state?.isSelectedId}  font={0.08} onClick={()=>{}}
                />
              }
              { 
                <DynaText text={state?.token.toUpperCase()+"" || ""} 
                  color={ !false ? state?.tokenColor : "#222222"}
                  position={new Vector3(0.12,0,-0.03)}
                  rotation={[0,Math.PI,0]}
                  isSelected={state?.isSelectedId}  font={0.08} onClick={()=>{}}
                />
              } */}
            </group>
          </group>
        </>}
      </>}
      { /* (state?.isSelectedId || !false) && */ <>
        <group position={new Vector3(-0.1,0.06,0.063)} // big monitor SCREEN
        >
          <mesh castShadow receiveShadow position={[0.0,0.,-0.099]} >
            <boxGeometry args={[0.3, 0.25, 0.025]} />
            <meshStandardMaterial color={"#000000"} 
              opacity={0.5}
             />
          </mesh>        
        </group>
      </>}
      
      {/* BASEBASEBASE */}
      {/* <mesh castShadow receiveShadow position={[-0.1,-0.28,-0.25]} >
            <boxGeometry args={[0.5, 0.15, 0.33]} />
            <meshStandardMaterial color={"#ffffff"}  />
          </mesh>    */}
          <RoundedBox args={[0.5, 0.2, 0.33]} position={[-0.1,-0.3,-0.25]}  castShadow receiveShadow>
          <meshStandardMaterial color={"#ffffff"}  />
          {/* <meshStandardMaterial color={"#ffffff"}  metalness={.6} roughness={0.25} /> */}
          </RoundedBox>

      <group position={new Vector3(-0.1,0,-0.2)} >
        { // big monitor BASE
          <>
         {/* {!!tokensArrayArray && 
           <Cylinder args={[0.1, 0.2, 0.17, 4]} position={[0.0,-0.12,-0.05]} // base base
            receiveShadow castShadow
            rotation={[0,Math.PI/4*3,0]}
          >
            <meshStandardMaterial color={"#808080"}  />
          </Cylinder>
         } */}
            <Cylinder args={[0.008, 0.15, 0.43, 4]} position={[0,-0.11,-0.04]} // base connector
              receiveShadow castShadow
              rotation={[0,Math.PI/4*3,0]}
            >
              <meshStandardMaterial color={"#ccc"}  />
            </Cylinder>
            {/* {state?.isSelectedId &&
            <Cylinder args={[0.03, 0.01, 0.12, 7]} position={[0.0,0.23,0.065]} // webcam camera
              receiveShadow castShadow
              rotation={[0,Math.PI/2,Math.PI/2]}
            >
              <meshStandardMaterial color={"#808080"}  />
            </Cylinder>
            } */}
          </>
        }
      </group>

      { <>
        <group position={new Vector3(-0.1,0,-0.2)} >
          <Cylinder args={[0.27, 0.15, 0.35, 4]} position={[0.0,0.06,-0.0]} // big monitor CASE
            rotation={[Math.PI/2,Math.PI/4*3,0]} receiveShadow castShadow
          >
            <meshStandardMaterial color={"#ffffff"}   />
            {/* <meshStandardMaterial color={"#ffffff"} metalness={.5} roughness={0.5} /> */}

            
          </Cylinder>
        </group>
      </>}


    </group>
    </>)
}
import { Vector3 } from "three"

import { Cylinder } from "@react-three/drei"
import { Text } from "@react-three/drei"

// import DynaText from "@/model/core/DynaText"
import BankRoofContainer from "./BankRoofContainer"

function Bank({ tokensArrayArray, state, calls }: any) {
  return (
    <group position={[0, -0.1, 0]}>
      <group scale={[0.24, 0.12, 0.24]} position={[0.03, 0.0, 0.29]}>
        <BankRoofContainer roofWidth={0.05} width={0.5} position={[-0.5, 2, -3]} wallWidth={0.05}
          length={2}
        />
      </group>

      <group position={new Vector3(-0.1, 0.04, 0.045)} >
        <group position={new Vector3(-0.1, 0.02, -0.)}>
          { // north facing
            <Text  fontSize={0.05} font="/fonts/raleway.ttf"
              color={!!tokensArrayArray ? state?.tokenColor : "#292222"}
              position={new Vector3(0.1, 0.25, 0.01)}
               textAlign="center"
              rotation={[0, 0, 0]}
            >
              {"Bank of\nMemories"}
            </Text>
          }
        </group>
      </group>
      {/* LOWER ROOF SEPARATOR */}
      {state?.isSelectedId &&
        <group position={new Vector3(-0.1, -0.1, -0.)} >
          <mesh castShadow receiveShadow position={[0.0, 0.24, -0.2]} >
            <boxGeometry args={[0.48, 0.025, 0.46]} />
            <meshStandardMaterial color={"#cccccc"}
            />
          </mesh>
        </group>
      }
      <group position={new Vector3(-0.1, -0.13, -0.)} // big monitor SCREEN
      >
        {/* INNER ROOF SEPARATOR */}
        <mesh castShadow={state?.isSelectedId} receiveShadow position={[0.0, 0.315, -0.2]} >
          <boxGeometry args={[0.45, 0.11, 0.44]} />
          <meshStandardMaterial color={"#dddddd"}
          />
        </mesh>
        {/* ROOF SEPARATOR */}
        <mesh castShadow receiveShadow position={[0.0, 0.36, -0.2]} >
          <boxGeometry args={[0.58, 0.025, 0.52]} />
          <meshStandardMaterial color={"#cccccc"}
          />
        </mesh>
        {/* BUILDING BODY */}
        <mesh castShadow receiveShadow position={[0.0, 0.13, -0.23]} >
          <boxGeometry args={[0.44, 0.5, 0.32]} />
          <meshStandardMaterial color={"#cccccc"}
          />
        </mesh>
      </group>

      <group position={new Vector3(-0.1, 0, -0.2)} >
        {/* BUILDING BASE */}
        <Cylinder args={[0.33, 0.38, 0.2, 4]} position={[0.0, -0.3, -0.02]}
          receiveShadow castShadow
          rotation={[0, Math.PI / 4 * 3, 0]}
        >
          <meshStandardMaterial color={"#ccc4c0"} />
        </Cylinder>
        {/* STAIRS */}
        <group position={new Vector3(-0.17, -0.07, -0.)} >
          <mesh castShadow receiveShadow position={[0.1, -0.28, 0.2]} >
            <boxGeometry args={[0.3, 0.1, 0.32]} />
            <meshStandardMaterial color={"#ffffff"}
            />
          </mesh>
          <mesh castShadow receiveShadow position={[0.1, -0.24, 0.15]} >
            <boxGeometry args={[0.25, 0.1, 0.32]} />
            <meshStandardMaterial color={"#ffffff"}
            />
          </mesh>
          <mesh castShadow receiveShadow position={[0.1, -0.2, 0.1]} >
            <boxGeometry args={[0.2, 0.1, 0.32]} />
            <meshStandardMaterial color={"#ffffff"}
            />
          </mesh>
        </group>







        
        {/* PILLARS */}
        <Cylinder args={[0.02, 0.03, 0.46, 4]} position={[-0.2, 0.03, 0.17]}
          receiveShadow castShadow rotation={[0, Math.PI / 4 * 3, 0]}
        >
          <meshStandardMaterial color={"#ffffff"} />
        </Cylinder>
        <Cylinder args={[0.02, 0.03, 0.46, 4]} position={[0.2, 0.03, 0.17]} 
          receiveShadow castShadow rotation={[0, Math.PI / 4 * 3, 0]}
        >
          <meshStandardMaterial color={"#ffffff"} />
        </Cylinder>
          <>

            <Cylinder args={[0.02, 0.03, 0.46, 4]} position={[-0.1, 0.03, 0.17]} 
              receiveShadow castShadow rotation={[0, Math.PI / 4 * 3, 0]}
            >
              <meshStandardMaterial color={"#ffffff"} />
            </Cylinder>
            <Cylinder args={[0.02, 0.03, 0.46, 4]} position={[0.1, 0.03, 0.17]} 
              receiveShadow castShadow rotation={[0, Math.PI / 4 * 3, 0]}
            >
              <meshStandardMaterial color={"#ffffff"} />
            </Cylinder>

            <Cylinder args={[0.02, 0.03, 0.46, 4]} position={[0.0, 0.03, 0.17]} 
              receiveShadow castShadow rotation={[0, Math.PI / 4 * 3, 0]}
            >
              <meshStandardMaterial color={"#ffffff"} />
            </Cylinder>
          </>
        {/* PILLARS */}
        <group position={[0, -0.22, 0]}>


          <Cylinder args={[0.035, 0.04, 0.05, 4]} position={[-0.2, 0.04, 0.17]} 
            receiveShadow castShadow rotation={[0, Math.PI / 4 * 3, 0]}
          >
            <meshStandardMaterial color={"#eeeeee"} />
          </Cylinder>
          <Cylinder args={[0.035, 0.04, 0.05, 4]} position={[-0.1, 0.04, 0.17]} 
            receiveShadow castShadow rotation={[0, Math.PI / 4 * 3, 0]}
          >
            <meshStandardMaterial color={"#eeeeee"} />
          </Cylinder>


          <Cylinder args={[0.035, 0.04, 0.05, 4]} position={[0.0, 0.04, 0.17]} 
            receiveShadow castShadow rotation={[0, Math.PI / 4 * 3, 0]}
          >
            <meshStandardMaterial color={"#eeeeee"} />
          </Cylinder>
          <Cylinder args={[0.035, 0.04, 0.05, 4]} position={[0.1, 0.04, 0.17]} 
            receiveShadow castShadow rotation={[0, Math.PI / 4 * 3, 0]}
          >
            <meshStandardMaterial color={"#eeeeee"} />
          </Cylinder>

          <Cylinder args={[0.035, 0.04, 0.05, 4]} rotation={[0, Math.PI / 4 * 3, 0]} 
            position={[0.2, 0.04, 0.17]} receiveShadow castShadow
          >
            <meshStandardMaterial color={"#eeeeee"} />
          </Cylinder>
        </group>
      </group>
    </group>
  )
}

export default Bank
import { Vector3 } from "three"
import { Cylinder, Box } from "@react-three/drei"
import { Text } from "@react-three/drei"
import BankRoofContainer from "./BankRoofContainer"

function CityHall({ tokensArrayArray, state, calls }: any) {
  return (
    <group position={[0, -0.1, 0]}>
      {/* Main Building Body - Made wider and taller */}
      <group position={new Vector3(-0.1, -0.13, -0.)} >
        {/* BUILDING BODY - Asymmetrical with side extension */}
        <mesh castShadow receiveShadow position={[0.0, 0.13, -0.23]} >
          <boxGeometry args={[0.65, 0.7, 0.4]} />
          <meshStandardMaterial color={"#e6e6e6"} />
        </mesh>
        
        {/* Side Extension */}
        <mesh castShadow receiveShadow position={[0.4, 0.0, -0.23]} >
          <boxGeometry args={[0.3, 0.44, 0.35]} />
          <meshStandardMaterial color={"#d4d4d4"} />
        </mesh>

        {/* ROOF MAIN */}
        <mesh castShadow receiveShadow position={[0.0, 0.48, -0.23]}>
          <boxGeometry args={[0.7, 0.2, 0.45]} />
          <meshStandardMaterial color={"#c4c4c4"} />
        </mesh>

        {/* ROOF SIDE */}
        <mesh castShadow receiveShadow position={[0.4, 0.25, -0.23]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.32, 0.25, 0.38]} />
          <meshStandardMaterial color={"#b4b4b4"} />
        </mesh>
      </group>

      {/* Text */}
      <group position={new Vector3(-0.1, 0.04, 0.045)} >
        <group position={new Vector3(-0.1, 0.02, -0.)}>
          <Text fontSize={0.12}
            color={!!tokensArrayArray ? state?.tokenColor : "#292222"}
            position={new Vector3(0.1, 0.4, 0.01)}
            rotation={[0, 0, 0]}
          >
            City Hall
          </Text>
        </group>
      </group>

      <group position={new Vector3(-0.1, 0, -0.2)} >
        {/* BUILDING BASE - Wider */}
        <Cylinder args={[0.4, 0.45, 0.2, 6]} position={[0.0, -0.3, -0.02]}
          receiveShadow castShadow
          rotation={[0, Math.PI / 6, 0]}
        >
          <meshStandardMaterial color={"#d4d4d4"} />
        </Cylinder>

        {/* STAIRS - Wider and more grand */}
        <group position={new Vector3(-0.25, -0.07, -0.)} >
          <mesh castShadow receiveShadow position={[0.15, -0.28, 0.2]} >
            <boxGeometry args={[0.5, 0.1, 0.4]} />
            <meshStandardMaterial color={"#ffffff"} />
          </mesh>
          <mesh castShadow receiveShadow position={[0.15, -0.24, 0.15]} >
            <boxGeometry args={[0.4, 0.1, 0.35]} />
            <meshStandardMaterial color={"#ffffff"} />
          </mesh>
          <mesh castShadow receiveShadow position={[0.15, -0.2, 0.1]} >
            <boxGeometry args={[0.3, 0.1, 0.3]} />
            <meshStandardMaterial color={"#ffffff"} />
          </mesh>
        </group>

        {/* PILLARS - Fewer but larger pillars */}
        <Cylinder args={[0.03, 0.04, 0.7, 6]} position={[-0.25, 0.05, 0.17]}
          receiveShadow castShadow rotation={[0, Math.PI / 6, 0]}
        >
          <meshStandardMaterial color={"#ffffff"} />
        </Cylinder>
        <Cylinder args={[0.03, 0.04, 0.7, 6]} position={[0.25, 0.05, 0.17]} 
          receiveShadow castShadow rotation={[0, Math.PI / 6, 0]}
        >
          <meshStandardMaterial color={"#ffffff"} />
        </Cylinder>
        <Cylinder args={[0.03, 0.04, 0.7, 6]} position={[0.0, 0.05, 0.17]} 
          receiveShadow castShadow rotation={[0, Math.PI / 6, 0]}
        >
          <meshStandardMaterial color={"#ffffff"} />
        </Cylinder>

        {/* PILLAR BASES */}
        <group position={[0, -0.22, 0]}>
          <Cylinder args={[0.045, 0.05, 0.05, 6]} position={[-0.25, 0.04, 0.17]} 
            receiveShadow castShadow rotation={[0, Math.PI / 6, 0]}
          >
            <meshStandardMaterial color={"#eeeeee"} />
          </Cylinder>
          <Cylinder args={[0.045, 0.05, 0.05, 6]} position={[0.0, 0.04, 0.17]} 
            receiveShadow castShadow rotation={[0, Math.PI / 6, 0]}
          >
            <meshStandardMaterial color={"#eeeeee"} />
          </Cylinder>
          <Cylinder args={[0.045, 0.05, 0.05, 6]} position={[0.25, 0.04, 0.17]} 
            receiveShadow castShadow rotation={[0, Math.PI / 6, 0]}
          >
            <meshStandardMaterial color={"#eeeeee"} />
          </Cylinder>
        </group>
      </group>
    </group>
  )
}

export default CityHall 
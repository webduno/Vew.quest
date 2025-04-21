import { Vector3 } from "three"
import { Cylinder, Box } from "@react-three/drei"
import BankRoofContainer from "./BankRoofContainer"

function SimpleHouse() {
  return (
    <group position={[0, -0.1, 0]}>
      {/* Main Building Body */}
      <group position={new Vector3(-0.1, -0.13, -0.)}>
        {/* BUILDING BODY */}
        <mesh castShadow receiveShadow position={[0.1, 0, 0]}>
          <boxGeometry args={[0.4, 0.35, 0.3]} />
          <meshStandardMaterial color={"#e6e6e6"} />
        </mesh>

        {/* ROOF */}
        <group scale={[0.24, 0.12, 0.24]} position={[0.23, -0.1, 0.5]}>
          <BankRoofContainer 
            roofWidth={0.05} 
            width={0.5} 
            position={[-0.5, 2, -3]} 
            wallWidth={0.05}
            length={2}
          />
        </group>
      </group>

      {/* BUILDING BASE */}
      <Cylinder args={[0.25, 0.3, 0.15, 4]} 
        scale={[1.2,1,1.25]}
        position={[0.0, -0.3, -0.02]}
        receiveShadow castShadow
        rotation={[0, Math.PI / 4 * 3, 0]}
      >
        <meshStandardMaterial color={"#ccc4c0"} />
      </Cylinder>

      {/* STAIRS */}
      <group position={new Vector3(-0.17, -0.07, -0.)}>
        <mesh castShadow receiveShadow position={[0.1, -0.28, 0.2]}>
          <boxGeometry args={[0.25, 0.1, 0.25]} />
          <meshStandardMaterial color={"#ffffff"} />
        </mesh>
        <mesh castShadow receiveShadow position={[0.1, -0.24, 0.15]}>
          <boxGeometry args={[0.2, 0.1, 0.25]} />
          <meshStandardMaterial color={"#ffffff"} />
        </mesh>
      </group>
    </group>
  )
}

export default SimpleHouse 
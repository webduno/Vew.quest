import { Physics, useCylinder, usePlane } from '@react-three/cannon'
import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PointerLockControls, Sphere } from '@react-three/drei'
import { Object3D, Vector3, Mesh, CylinderGeometry, MeshStandardMaterial } from 'three'
import { PhysicsSceneProps } from '../../../scripts/types/canonPOV'
import { useKeyboardControls } from '../../../scripts/hooks/useKeyboardControls'
import { PhysicalBall } from './PhysicalObjects'


// Visual player cylinder component
function PlayerCylinder({ 
  playerHeight, 
  playerRadius, 
  visible 
}: { 
  playerHeight: number,
  playerRadius: number,
  visible: boolean
}) {
  const cylinderRef = useRef<any>(null)
  const { camera } = useThree()
  
  useFrame(() => {
    if (cylinderRef.current && camera) {
      // Position the cylinder at the camera position but adjusted for height
      // (The camera is positioned at eye level, need to move cylinder down)
      cylinderRef.current.position.x = camera.position.x
      cylinderRef.current.position.z = camera.position.z
      cylinderRef.current.position.y = camera.position.y - (playerHeight/1.5)

      // Extract forward direction from camera quaternion
      const forward = new Vector3(0, 0, -1);
      forward.applyQuaternion(camera.quaternion);
      
      // Calculate rotation angle on XZ plane (horizontal only)
      const angle = Math.atan2(forward.x, forward.z);
      cylinderRef.current.rotation.y = angle;
    }
  })

  // Create shared materials to reduce draw calls
  const greyMaterial = new MeshStandardMaterial({ color: "grey" });
  const orangeMaterial = new MeshStandardMaterial({ color: "orangered" });

  return (
    <group ref={cylinderRef}>
      <Sphere args={[playerRadius*.6, 16, 16]} castShadow
        position={[0, playerHeight/3, 0]} 
        scale={[1,3.5,1]}
        material={greyMaterial}
      />
      <Sphere args={[playerRadius*.75, 16, 16]} castShadow
        position={[0, playerHeight*.75, 0]} 
        scale={[1,1.5,1]}
        material={orangeMaterial}
      />
{/* 
      <mesh  visible={visible} castShadow scale={[1,1,.5]} >
        <cylinderGeometry args={[playerRadius*.15, playerRadius*2, playerHeight, 16]} />
        <meshStandardMaterial color="#dddddd" />
      </mesh> */}
      
      
      {/* <mesh  visible={visible} castShadow scale={[0.5,1,1]} position={[playerRadius*0.5,-playerHeight/3.3,0]} >
        <cylinderGeometry 
        args={[playerRadius*0.5, playerRadius*0.75, playerRadius*0.25, 8]} />
        <meshStandardMaterial color="#dddddd" />
      </mesh>
      <mesh  visible={visible} castShadow scale={[0.5,1,1]} 
        position={[playerRadius*0.5,-playerHeight/4.3,0]} 
      >
        <cylinderGeometry 
        args={[playerRadius*0.25, playerRadius*0.5, playerHeight/2, 8]} />
        <meshStandardMaterial color="#dddddd" />
      </mesh> */}
{/* 


      <mesh  visible={visible} castShadow scale={[0.5,1,1]} position={[-playerRadius*0.5,-playerHeight/3.3,0]} >
        <cylinderGeometry
         args={[playerRadius*0.5, playerRadius*0.75, playerRadius*0.25, 8]} />
        <meshStandardMaterial color="#dddddd" />
      </mesh>
      <mesh  visible={visible} castShadow scale={[0.5,1,1]} 
        position={[-playerRadius*0.5,-playerHeight/4.3,0]} 
      >
        <cylinderGeometry 
        args={[playerRadius*0.25, playerRadius*0.5, playerHeight/2, 8]} />
        <meshStandardMaterial color="#dddddd" />
      </mesh> */}
    </group>
  )
}

export function BewPhysicsScene({ 
  position, 
  onExit, 
  isMobile, 
  ballCount,
  playerHeight = 0.3,
  playerRadius = 0.15,
  moveSpeed = 5,
  jumpForce = 7,
  maxVelocity = 30,
  // enableLocked, setEnableLocked,
  isLocked, setIsLocked,
  onRotationUpdate,
  currentPosition,
  teleportTrigger = 0
}: PhysicsSceneProps) {
  const controlsRef = useRef<any>(null)
  const { camera } = useThree()
  const [showHitbox, setShowHitbox] = useState(true)
  const [isOnGround, setIsOnGround] = useState(false)
  const lastTeleportTrigger = useRef(teleportTrigger);
  
  // Multiple balls state
  const [balls, setBalls] = useState<Array<{
    position: [number, number, number],
    velocity: [number, number, number],
    id: number
  }>>([])
  const [remainingBalls, setRemainingBalls] = useState(ballCount)
  
  // Track if click was handled to prevent double firing
  const clickHandled = useRef(false)
  
  // Mobile touch controls state
  const [touchMove, setTouchMove] = useState<{x: number, y: number}>({x: 0, y: 0})
  const [touchJump, setTouchJump] = useState(false)
  const [touchLook, setTouchLook] = useState<{x: number, y: number}>({x: 0, y: 0})
  const joystickActive = useRef(false)
  const lastTouchPosition = useRef<{x: number, y: number}>({x: 0, y: 0})
  
  // Track camera rotation for the gauge dials
  const prevRotation = useRef<{ x: number, y: number, z: number }>({ x: 0, y: 0, z: 0 })
  
  // Player physics properties are now passed as props with defaults
  
  // Use Cannon.js cylinder for player physics
  const [playerRef, playerApi] = useCylinder(
    () => ({
      mass: 75, // kg
      position: [position[0], position[1] + playerHeight / 2, position[2]],
      args: [playerRadius, playerRadius, playerHeight, 16],
      fixedRotation: true, // Prevent the player from tipping over
      linearDamping: 0, // No resistance to movement
      material: 'player',
      userData: { type: 'player' }, // Add type information for the collision detection
      onCollide: (e) => {
        // Check if collision is with ground or other objects below player
        const contactNormal = e.contact.ni;
        
        // If the normal's Y component is positive, we're hitting something from below
        // which means we're standing on it
        if (contactNormal[1] > 0.5) {
          setIsOnGround(true);
          return; // Exit early once we know we're on ground
        }
        
        // Only allow jumping from sloped surfaces, not vertical walls
        // A slope is defined by having some upward component (Y > 0.2) but not being completely flat
        if (contactNormal[1] > 0.2 && contactNormal[1] < 0.5 && 
            (Math.abs(contactNormal[0]) > 0.1 || Math.abs(contactNormal[2]) > 0.1)) {
          // This is a slope that's angled but not vertical
          setIsOnGround(true);
          return; // Exit early once we know we're on ground
        }
        
        // Check for wall collisions but don't override ground state if we're already on ground
        // Only set to false if we're explicitly hitting a wall and not on ground yet
        if (Math.abs(contactNormal[1]) < 0.1 && 
            (Math.abs(contactNormal[0]) > 0.9 || Math.abs(contactNormal[2]) > 0.9)) {
          // This is a nearly vertical wall - only affect ground state if we're not already on ground
          // and only if we're not moving downward (which might indicate we're landing)
          const velocity = velocityRef.current;
          if (velocity[1] >= -0.5) { // Not falling significantly
            // Don't change isOnGround state when hitting walls
          }
        }
      }
    }),
    useRef<Mesh>(null)
  )
  
  // Setup keyboard controls for non-mobile
  const { moveForward, moveBackward, moveLeft, moveRight, jump } = useKeyboardControls()
  
  // Set initial player position
  useEffect(() => {
    if (camera) {
      camera.position.set(position[0] || 0, position[1] + playerHeight || 0, position[2] || 0)
      
      // Lock camera rotation to only horizontal movement
      camera.rotation.x = 0
      camera.rotation.z = 0
    }
  }, [camera, position, playerHeight])
  
  // Mobile touch controls setup
  useEffect(() => {
    if (!isMobile) return
    
    const joystickContainer = document.getElementById('joystick-container')
    const jumpButton = document.getElementById('jump-button')
    const lookArea = document.getElementById('look-area')
    if (!joystickContainer || !jumpButton || !lookArea) return
    
    // Joystick handlers
    const handleJoystickStart = (e: TouchEvent) => {
      joystickActive.current = true
      const touch = e.touches[0]
      const rect = joystickContainer.getBoundingClientRect()
      lastTouchPosition.current = {
        x: touch.clientX,
        y: touch.clientY
      }
      e.preventDefault()
    }
    
    const handleJoystickMove = (e: TouchEvent) => {
      if (!joystickActive.current) return
      const touch = e.touches[0]
      const rect = joystickContainer.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      // Calculate joystick displacement
      const dx = (touch.clientX - centerX) / (rect.width / 2)
      const dy = (touch.clientY - centerY) / (rect.height / 2)
      
      // Normalize and clamp values to -1 to 1
      const magnitude = Math.sqrt(dx * dx + dy * dy)
      const normalizedX = magnitude > 1 ? dx / magnitude : dx
      const normalizedY = magnitude > 1 ? dy / magnitude : dy
      
      setTouchMove({
        x: normalizedX,
        y: normalizedY
      })
      
      e.preventDefault()
    }
    
    const handleJoystickEnd = (e: TouchEvent) => {
      joystickActive.current = false
      setTouchMove({x: 0, y: 0})
      e.preventDefault()
    }
    
    // Jump button handlers
    const handleJumpStart = (e: TouchEvent) => {
      setTouchJump(true)
      e.preventDefault()
    }
    
    const handleJumpEnd = (e: TouchEvent) => {
      setTouchJump(false)
      e.preventDefault()
    }
    
    // Look area handlers for camera rotation
    const handleLookStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      lastTouchPosition.current = {
        x: touch.clientX,
        y: touch.clientY
      }
      e.preventDefault()
    }
    
    const handleLookMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      const dx = (touch.clientX - lastTouchPosition.current.x) * 0.01
      
      if (camera) {
        // Only allow horizontal rotation (y-axis)
        camera.rotation.y -= dx
        
        // Lock vertical rotation and prevent dutch angles
        camera.rotation.x = 0
        camera.rotation.z = 0
      }
      
      lastTouchPosition.current = {
        x: touch.clientX,
        y: touch.clientY
      }
      
      e.preventDefault()
    }
    
    // Add event listeners
    joystickContainer.addEventListener('touchstart', handleJoystickStart)
    joystickContainer.addEventListener('touchmove', handleJoystickMove)
    joystickContainer.addEventListener('touchend', handleJoystickEnd)
    joystickContainer.addEventListener('touchcancel', handleJoystickEnd)
    
    jumpButton.addEventListener('touchstart', handleJumpStart)
    jumpButton.addEventListener('touchend', handleJumpEnd)
    jumpButton.addEventListener('touchcancel', handleJumpEnd)
    
    lookArea.addEventListener('touchstart', handleLookStart)
    lookArea.addEventListener('touchmove', handleLookMove)
    
    // Cleanup
    return () => {
      joystickContainer.removeEventListener('touchstart', handleJoystickStart)
      joystickContainer.removeEventListener('touchmove', handleJoystickMove)
      joystickContainer.removeEventListener('touchend', handleJoystickEnd)
      joystickContainer.removeEventListener('touchcancel', handleJoystickEnd)
      
      jumpButton.removeEventListener('touchstart', handleJumpStart)
      jumpButton.removeEventListener('touchend', handleJumpEnd)
      jumpButton.removeEventListener('touchcancel', handleJumpEnd)
      
      lookArea.removeEventListener('touchstart', handleLookStart)
      lookArea.removeEventListener('touchmove', handleLookMove)
    }
  }, [isMobile, camera])
  
  const handleLockChange = () => {
    // early return if enableLocked is false
    // if (!enableLocked) return
    // if velocity and maxVelocity are both 0, early return
    // if (moveSpeed === 0 && maxVelocity === 0) return
    // if(isLocked) return
    
    if (document.pointerLockElement) {
      setIsLocked && setIsLocked(true)
    } else {
      setIsLocked && setIsLocked(false)
      onExit()
    }
  }
  // Handle pointer lock change for desktop mode
  useEffect(() => {
    if (isMobile) return // Skip for mobile
    
    
    document.addEventListener('pointerlockchange', handleLockChange)
    
    return () => {
      document.removeEventListener('pointerlockchange', handleLockChange)
    }
  }, [onExit, isMobile,
    // enableLocked
  ])
  
  // Simplified throw ball function
  const throwBall = () => {
    // Check if we have any balls remaining
    if (remainingBalls <= 0) return;
    
    // Get current camera position and direction
    const cameraDirection = new Vector3(0, 0, -1)
    cameraDirection.applyQuaternion(camera.quaternion)
    cameraDirection.normalize() // Make sure it's a unit vector
    
    // Set initial ball position slightly in front of camera
    const cameraPos = camera.position.clone()
    const initialPos: [number, number, number] = [
      cameraPos.x + cameraDirection.x * 0.5,
      cameraPos.y + cameraDirection.y * 0.5, 
      cameraPos.z + cameraDirection.z * 0.5
    ]
    
    // Calculate initial velocity - 20 units/s in camera direction
    const throwForce = 20
    const initialVel: [number, number, number] = [
      cameraDirection.x * throwForce,
      cameraDirection.y * throwForce,
      cameraDirection.z * throwForce
    ]
    
    // Create new ball with unique ID
    const newBall = {
      position: initialPos,
      velocity: initialVel,
      id: Date.now() // Use timestamp as unique ID
    }
    
    // Add new ball to state and decrease remaining count
    setBalls(prevBalls => [...prevBalls, newBall])
    setRemainingBalls(prev => prev - 1)
  }
  
  // Simple click handler
  const handleClick = () => {
    if (isLocked && remainingBalls > 0 && !clickHandled.current) {
      clickHandled.current = true;
      throwBall();
      // Reset the click handler flag after a short delay
      setTimeout(() => {
        clickHandled.current = false;
      }, 500);
    }
  }
  
  // Handle click for desktop mode
  useEffect(() => {
    if (isMobile) {
      // For mobile, we'll use the throw button
      const throwButton = document.getElementById('throw-button')
      if (!throwButton) return
      
      const handleThrow = () => {
        if (remainingBalls > 0 && !clickHandled.current) {
          clickHandled.current = true;
          throwBall();
          // Reset the click handler flag after a short delay
          setTimeout(() => {
            clickHandled.current = false;
          }, 500);
        }
      }
      
      throwButton.addEventListener('touchstart', handleThrow)
      return () => {
        throwButton.removeEventListener('touchstart', handleThrow)
      }
    } else {
      // For desktop, listen for clicks but don't disrupt pointer lock
      window.addEventListener('click', handleClick)
      return () => {
        window.removeEventListener('click', handleClick)
      }
    }
  }, [isMobile, isLocked, remainingBalls])
  
  // Track velocity for jump mechanics
  const velocityRef = useRef<[number, number, number]>([0, 0, 0])
  const positionRef = useRef<[number, number, number]>([position[0], position[1], position[2]])
  useEffect(() => {
    // Subscribe to velocity changes for jump detection
    playerApi.velocity.subscribe((v) => {
      velocityRef.current = v
    })
    
    // Subscribe to position changes to detect reset condition
    playerApi.position.subscribe((p) => {
      positionRef.current = p
    })
  }, [playerApi])
  
  // Connect player mesh to camera
  useEffect(() => {
    if (playerRef.current) {
      // Add a listener to update the camera position based on the player physics body
      playerApi.position.subscribe((pos) => {
        if (camera) {
          // Set camera position with an offset for eye level (top of cylinder)
          camera.position.set(pos[0], pos[1] + (playerHeight/2), pos[2])
        }
      })
      
      // More reliable ground detection
      const interval = setInterval(() => {
        // Use current velocity reference instead of the get method
        const velocity = velocityRef.current;
        const position = positionRef.current;
        
        // If velocity is very close to zero and we're not moving up or down much,
        // we're probably on ground or at least not in free fall
        if (Math.abs(velocity[1]) < 0.1) {
          // If we're not falling, we might be on ground
          if (!isOnGround) {
            // Check if we have near-zero vertical velocity for a short period
            if (Math.abs(velocity[1]) < 0.2) {
              setIsOnGround(true);
            }
          }
        }
        // If we're falling significantly, definitely not on ground
        else if (velocity[1] < -2) {
          setIsOnGround(false);
        }
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [camera, playerApi, playerHeight, isOnGround])
  
  // Update player rotation values based on camera orientation
  useFrame(() => {
    if (camera) {
      const newRotation = {
        x: camera.rotation.x,
        y: camera.rotation.y,
        z: camera.rotation.z
      }
      
      // Only update if rotation has changed sufficiently
      if (
        Math.abs(newRotation.x - prevRotation.current.x) > 0.01 ||
        Math.abs(newRotation.y - prevRotation.current.y) > 0.01 ||
        Math.abs(newRotation.z - prevRotation.current.z) > 0.01
      ) {
        prevRotation.current = newRotation
        onRotationUpdate && onRotationUpdate(newRotation)
      }
    }
    
    // Reset position if player falls below -15 on any axis
    const currentPosition = positionRef.current
    if (currentPosition[1] < -15) {
      // Reset to initial position
      playerApi.position.set(position[0], position[1] + playerHeight / 2, position[2])
      playerApi.velocity.set(0, 0, 0)
      setIsOnGround(true); // Reset ground state when respawning
    }
    
    // Stop player movement completely if moveSpeed and maxVelocity are both 0
    if (moveSpeed === 0 && maxVelocity === 0) {
      const currentVelocity = velocityRef.current
      // Preserve vertical velocity for gravity but stop horizontal movement
      playerApi.velocity.set(0, currentVelocity[1], 0)
      return
    }
    
    if (isMobile) {
      // Mobile controls logic
      const direction = new Vector3()
      
      // Use joystick input for movement direction
      const frontVector = new Vector3(0, 0, touchMove.y)
      const sideVector = new Vector3(-touchMove.x, 0, 0)
      
      direction
        .subVectors(frontVector, sideVector)
        .normalize()
        .multiplyScalar(moveSpeed)
        .applyEuler(camera.rotation)
      
      const currentVelocity = velocityRef.current
      
      // Only change velocity if there's input
      if (Math.abs(touchMove.x) > 0.1 || Math.abs(touchMove.y) > 0.1) {
        // Apply smoothing factor for gradual acceleration
        const smoothFactor = 0.3 // Increased for faster acceleration
        const targetVelX = Math.max(Math.min(direction.x, maxVelocity), -maxVelocity)
        const targetVelZ = Math.max(Math.min(direction.z, maxVelocity), -maxVelocity)
        
        // Blend current velocity with target velocity for smoother acceleration
        const newVelX = currentVelocity[0] + (targetVelX - currentVelocity[0]) * smoothFactor
        const newVelZ = currentVelocity[2] + (targetVelZ - currentVelocity[2]) * smoothFactor
        
        playerApi.velocity.set(newVelX, currentVelocity[1], newVelZ)
      } else if (Math.abs(currentVelocity[0]) > 0.1 || Math.abs(currentVelocity[2]) > 0.1) {
        // Apply friction/deceleration when no input is given
        const frictionFactor = 0.5 // Almost no deceleration
        playerApi.velocity.set(
          currentVelocity[0] * frictionFactor,
          currentVelocity[1],
          currentVelocity[2] * frictionFactor
        )
      }
      
      // Handle jumping with touch button
      if (touchJump && isOnGround) {
        playerApi.velocity.set(currentVelocity[0], jumpForce, currentVelocity[2])
        setIsOnGround(false)
      }

      // Add camera rotation based on side movement (joystick x-axis)
      const rotationSpeed = 0.05; // Adjust for sensitivity
      if (touchMove.x !== 0) {
        camera.rotation.y -= touchMove.x * rotationSpeed;
      }
    } else {
      // Desktop controls logic
      if (!isLocked || !controlsRef.current) return
      
      // Calculate movement direction based on camera rotation
      const direction = new Vector3()
      const frontVector = new Vector3(0, 0, moveBackward ? 1 : moveForward ? -1 : 0)
      const sideVector = new Vector3(moveLeft ? 1 : moveRight ? -1 : 0, 0, 0)
      
      direction
        .subVectors(frontVector, sideVector)
        .normalize()
        .multiplyScalar(moveSpeed)
        .applyEuler(camera.rotation)
      
      // Apply horizontal movement with max speed limit and smoothing
      const currentVelocity = velocityRef.current
      
      // Only change velocity if there's input
      if (frontVector.length() > 0 || sideVector.length() > 0) {
        // Apply smoothing factor for gradual acceleration
        const smoothFactor = 0.3 // Increased for faster acceleration
        const targetVelX = Math.max(Math.min(direction.x, maxVelocity), -maxVelocity)
        const targetVelZ = Math.max(Math.min(direction.z, maxVelocity), -maxVelocity)
        
        // Blend current velocity with target velocity for smoother acceleration
        const newVelX = currentVelocity[0] + (targetVelX - currentVelocity[0]) * smoothFactor
        const newVelZ = currentVelocity[2] + (targetVelZ - currentVelocity[2]) * smoothFactor
        
        playerApi.velocity.set(newVelX, currentVelocity[1], newVelZ)
      } else if (Math.abs(currentVelocity[0]) > 0.1 || Math.abs(currentVelocity[2]) > 0.1) {
        // Apply friction/deceleration when no input is given
        const frictionFactor = 0.5 // Almost no deceleration
        playerApi.velocity.set(
          currentVelocity[0] * frictionFactor,
          currentVelocity[1],
          currentVelocity[2] * frictionFactor
        )
      }
      
      // Handle jumping - check if on ground using collision detection
      if (jump && isOnGround) {
        playerApi.velocity.set(currentVelocity[0], jumpForce, currentVelocity[2])
        setIsOnGround(false)
      }
    }
    
    // Only check for falling in free fall, not when already determined to be on ground
    // This prevents overriding ground status during normal movement
    if (velocityRef.current[1] < -1.0 && !isOnGround) {
      setIsOnGround(false);
    }
  })
  
  // Reset balls when component unmounts or onExit is called
  useEffect(() => {
    return () => {
      setBalls([])
      setRemainingBalls(ballCount)
    }
  }, [ballCount])
  
  // Handle teleportation when teleportTrigger changes
  useEffect(() => {
    if (teleportTrigger !== lastTeleportTrigger.current && currentPosition) {
      
      // Update the player's physics body position
      playerApi.position.set(
        currentPosition[0], 
        currentPosition[1] + playerHeight / 2, 
        currentPosition[2]
      );
      
      // Reset velocity to prevent momentum carrying over
      playerApi.velocity.set(0, 0, 0);
      
      // Update camera position to match
      if (camera) {
        camera.position.set(
          currentPosition[0], 
          currentPosition[1] + playerHeight, 
          currentPosition[2]
        );
      }
      
      // Reset ground state
      setIsOnGround(true);
      
      // Update the last trigger value
      lastTeleportTrigger.current = teleportTrigger;
    }
  }, [teleportTrigger, currentPosition, camera, playerHeight]);
  
  return (
    <>
      {!isMobile && (
        <PointerLockControls 
          ref={controlsRef}
          // Vertical rotation enabled for desktop
        />
      )}
      {/* <SceneObjects sceneObjects={sceneObjects} isMobile={isMobile} /> */}
      
      {/* Multiple balls */}
      {balls.map((ball) => (
        <PhysicalBall 
          key={ball.id}
          position={ball.position} 
          velocity={ball.velocity} 
        />
      ))}
      
      {/* Player cylinder */}
      <PlayerCylinder 
        playerHeight={playerHeight}
        playerRadius={playerRadius}
        visible={showHitbox}
      />
    </>
  )
} 
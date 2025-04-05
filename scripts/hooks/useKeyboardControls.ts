import { useEffect, useState } from 'react'

interface KeyboardControls {
  moveForward: boolean
  moveBackward: boolean
  moveLeft: boolean
  moveRight: boolean
  jump: boolean
}

export function useKeyboardControls(): KeyboardControls {
  const [keys, setKeys] = useState<KeyboardControls>({
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
    jump: false
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Update key states based on key down events
      if (e.code === 'KeyW' || e.code === 'ArrowUp') {
        setKeys(prev => ({ ...prev, moveForward: true }))
      }
      if (e.code === 'KeyS' || e.code === 'ArrowDown') {
        setKeys(prev => ({ ...prev, moveBackward: true }))
      }
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
        setKeys(prev => ({ ...prev, moveLeft: true }))
      }
      if (e.code === 'KeyD' || e.code === 'ArrowRight') {
        setKeys(prev => ({ ...prev, moveRight: true }))
      }
      if (e.code === 'Space') {
        setKeys(prev => ({ ...prev, jump: true }))
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      // Update key states based on key up events
      if (e.code === 'KeyW' || e.code === 'ArrowUp') {
        setKeys(prev => ({ ...prev, moveForward: false }))
      }
      if (e.code === 'KeyS' || e.code === 'ArrowDown') {
        setKeys(prev => ({ ...prev, moveBackward: false }))
      }
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
        setKeys(prev => ({ ...prev, moveLeft: false }))
      }
      if (e.code === 'KeyD' || e.code === 'ArrowRight') {
        setKeys(prev => ({ ...prev, moveRight: false }))
      }
      if (e.code === 'Space') {
        setKeys(prev => ({ ...prev, jump: false }))
      }
    }

    // Add event listeners
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    // Clean up event listeners
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return keys
} 
# BEW Game Architecture

## Game-Specific Subsystems

### Player Mechanics
- State Machine & Animation
  - Mind stats progression
  - Zone exploration tracking
  - Player state management

- Movement & Controls
  - Physics-based player movement
  - Position and rotation tracking
  - Movement locking system
  - Mobile-responsive controls

### Game Cameras
- Player-Follow Camera
- Debug Camera (optional)

### Game-Specific Rendering
- Room Components
  - `TheRoom` (White Mirror Room)
    - `TheTable` - Interactive table component
    - `TheChair` - Sittable chair
  - `TheWhiteMirror` - Crystal orb system
- Scene Components
  - `BewCoreLights` - Dynamic lighting system
  - Portal rendering
  - Environment mapping

## Gameplay Foundations

### Front End
- HUD Elements
  - `MindStats` display
  - Crosshair
  - Performance stats (optional)
- In-Game GUI
  - `BgMusicToggle`
  - Analysis interface
  - Transition screens
- In-Game Menus
  - Code input interfaces
  - Settings controls

### Visual Effects
- Lighting System
  - Dynamic light targets
  - Ambient lighting
  - Portal effects
- Post-Processing
  - Transition effects
  - Analysis screen effects

### Scene Management
- `BewMainScene`
  - Hallways and common areas
  - ESP Lobby
  - Psionic Zone
  - Portal Room
  - Door portals system

### Physics & Collision
- `PlayerPhysicsScene`
  - Collision detection
  - Physics interactions
  - Movement constraints
- Collision Triggers
  - Door interactions
  - Zone transitions
  - Chair sitting mechanics

### Online Systems
- Player Stats Synchronization
- Analysis System
  - Target tracking
  - Result processing
  - Reward calculations

### Audio
- Background Music System
  - Zone-specific music
  - Volume control
  - Music state management
- Sound Effects
  - Interaction sounds
  - Environment audio
  - UI feedback

## Core Systems

### Context Providers
1. **GameCoreProvider**
   - Game state management
   - Cutscene control
   - Notification system
   - Sound management

2. **PlayerStatsProvider**
   - Player identity management
   - Settings persistence
   - Progress tracking
   - First-time experience

3. **BackgroundMusicProvider**
   - Audio playback control
   - Sound effect management
   - Volume settings
   - Audio state persistence

### Resource Management
- Asset Loading
  - 3D Models
  - Textures
  - Audio files
  - UI elements

### Platform Independence Layer
- Mobile Support
  - Touch controls
  - Performance optimization
  - Device-specific adaptations

## Third-Party Integration
- React Three Fiber (@react-three/fiber)
- React Three Drei (@react-three/drei)
- Physics Engine (@react-three/cannon)
- Audio Processing
- State Management 
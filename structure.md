# Vibe Game Architecture

## Platform Independence Layer
- Cross-Platform Support
  - Mobile device adaptation
  - Touch input handling
  - Performance optimization
- Graphics Abstraction
  - React Three Fiber (@react-three/fiber)
  - WebGL rendering
- Input System
  - Touch controls
  - Keyboard/Mouse handling
  - Device-specific I/O

## Core Systems

### Resource Management
- Asset Loading & Caching
  - 3D Models
  - Textures
  - Audio files
  - UI elements
- Memory Management
- Asset Streaming

### Context System
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

### Third-Party Integration
- React Three Drei (@react-three/drei)
- React Three fiber (@react-three/fiber)
- Supabase Database (@supabase/js)
- Hosting and Analytics (@vercel/analytics)
- Google Auth (@next/auth)
- Physics Engine (@react-three/cannon)
- Audio Processing
- State Management

## Gameplay Foundations

### Physics & Collision
- `PlayerPhysicsScene`
  - Collision detection
  - Physics interactions
  - Movement constraints
- Collision Triggers
  - Door interactions
  - Zone transitions
  - Chair sitting mechanics

### Visual Effects
- Lighting System
  - Dynamic light targets
  - Ambient lighting
  - Portal effects
- Post-Processing
  - Transition effects
  - Analysis screen effects

### Audio
- Background Music System
  - Zone-specific music
  - Volume control
  - Music state management
- Sound Effects
  - Interaction sounds
  - Environment audio
  - UI feedback

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

### Online Systems
- Player Stats Synchronization
- Analysis System
  - Target tracking
  - Result processing
  - Reward calculations

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

### Scene Management
- `BewMainScene`
  - Hallways and common areas
  - ESP Lobby
  - Psionic Zone
  - Portal Room
  - Door portals system

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

## Model Layer Structure

### Core Models (`/model/core`)
- Physics & Collision Components
  - `PlayerPhysicsScene` - Main physics scene controller
  - `PhysicalObjects` - Base physical object implementations
  - `PhysicalFloor` - Floor collision and rendering
  - `CollisionBox` - Generic collision detection
  - `SolidBox` - Solid object implementation
  - `StyledWall` - Wall component with styling
  - `BewPortal` - Portal system implementation

### Stage Models (`/model/stage`)
- Room Components
  - Score Lobby
    - `ESPLobby` - ESP testing environment
    - `DailyQuota` - Daily task tracking
    - `Scoreboard` - Player rankings
    - `PublicRequests` - CRV request system
- Data Interfaces
  - `CRVObject` - Crystal reading verification object
  - `CRVRequest` - Verification request data
  - Score tracking interfaces

### Bit Models (`/model/bit`)
- Visual Components
  - `PersonSilhouette` - Character silhouette rendering
  - Basic geometric components
  - Interactive elements

### Byte Models (`/model/byte`)
- Enhanced Visual Components
  - Animated versions of Bit components
  - Advanced interaction handlers
  - Components with additional features and effects
- Animation Systems
  - State-based animations
  - Transition effects
  - Interactive feedback

  
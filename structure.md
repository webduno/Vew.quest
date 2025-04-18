# BEW Game Structure

## Top Level Container
- `BewGameContainer`
  - Wraps the game with necessary providers:
    - `BackgroundMusicProvider`
    - `PlayerStatsProvider`
    - `GameCoreProvider`
  - Contains `BewGame` as the main component

## Main Game Component (`BewGame`)
- Core game component with the following main parts:
  1. **Canvas & Physics Setup**
     - Uses `@react-three/fiber` Canvas
     - Physics engine setup with gravity and collision settings
     - Performance stats (optional)

  2. **Core Components**
     - `BewCoreLights` - Handles game lighting with dynamic light targets
     - `PlayerPhysicsScene` - Manages player movement, physics, and interactions
     - `MobileControlOverlay` - Mobile controls (conditional)

  3. **Scene Management**
     - `BewMainScene` - Main game scene containing:
       - Hallways and common areas
       - ESP Lobby
       - Psionic Zone
       - Portal Room
       - Door portals (CD)
     - Scene transition management
     - Background music changes based on zones

  4. **Room Components**
     - `TheRoom` (White Mirror Room)
       - `TheTable` - Interactive table component
       - `TheChair` - Sittable chair with collision detection
       - Physical walls and collision triggers
       - Credits cube (conditional based on mind stats)
     - `TheWhiteMirror`
       - Crystal orb interaction
       - Target display system
       - Analysis interface

  5. **UI Elements**
     - `MindStats` - Player statistics display
     - `BgMusicToggle` - Music control interface
     - `PerformanceStats` - Optional performance monitoring
     - Crosshair
     - Analysis results display
     - Transition screens

## Key Features
1. **Movement System**
   - Physics-based player movement with configurable parameters
   - Position and rotation tracking
   - Mobile-responsive controls
   - Movement locking system

2. **Interaction System**
   - Door portal interactions
   - Chair sitting mechanics
   - Crystal orb interaction
   - Analysis submission system
   - Sound effect triggers

3. **Room Access Control**
   - Code-based door system
   - Zone exploration tracking
   - Progressive unlocking based on mind stats
   - Transition management

4. **Analysis System**
   - Target display and tracking
   - Analysis result processing
   - Reward calculations
   - Mind stats progression

## Context Providers
1. **GameCoreProvider**
   - Manages game state and cutscenes
   - Controls snackbar notifications
   - Handles sound effects
   - Manages background music changes

2. **PlayerStatsProvider**
   - Player ID and username management
   - Graphics settings control
   - Zone exploration status tracking
   - Mind stats progression
   - First-time user experience

3. **BackgroundMusicProvider**
   - Background music playback control
   - Sound effects management
   - Volume control
   - Audio state persistence

## Mobile Support
- Responsive touch controls
- Mobile-specific overlay interface
- Performance optimization settings
- Device-specific interaction adaptations 
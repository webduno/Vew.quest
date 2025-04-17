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
     - `BewCoreLights` - Handles game lighting
     - `BewPhysicsScene` - Manages player movement and physics
     - `BewMobileOverlay` - Mobile controls (conditional)

  3. **Scene Management**
     - `BewMainScene` - Main game scene containing:
       - Hallways
       - Common areas
       - ESP Lobby
       - Psionic Zone
       - Portal Room
       - Various door portals (AB, BC, CD)

  4. **Room Components**
     - `TheRoom` (White Mirror Room)
       - `TheTable`
       - `TheChair`
       - Physical walls and triggers
     - `TheWhiteMirror`
       - Crystal ball interaction
       - Target display
       - Analysis screen

  5. **UI Elements**
     - `MindStats`
     - `BackgroundMusic`
     - Performance Stats (optional)
     - Crosshair
     - Code input interfaces
     - Analysis results display

## Key Features
1. **Movement System**
   - Physics-based player movement
   - Teleportation system
   - Mobile controls support

2. **Interaction System**
   - Door portals with code requirements
   - Chair sitting mechanics
   - Crystal ball interaction
   - Analysis submission system

3. **Room Access Control**
   - Code-based door system (CODE_1, CODE_2, CODE_3)
   - Zone exploration tracking
   - Progressive unlocking system

4. **Analysis System**
   - CRV (Controlled Remote Viewing) reporting
   - Accuracy calculations
   - Reward system
   - Analysis result display

## Context Providers
1. **GameCoreProvider**
   - Manages game state
   - Handles snackbar notifications
   - Controls cutscenes
   - Manages sound effects

2. **PlayerStatsProvider**
   - Player ID management
   - Graphics settings
   - Zone exploration status
   - Mind stats tracking

3. **BackgroundMusicProvider**
   - Music playback control
   - Sound effect management

## Mobile Support
- Responsive controls
- Touch-based movement system
- Mobile-specific overlay
- Optimized performance settings 
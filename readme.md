**Game Design Document: Parapsychology 3D Web Game**

---

## **Game Overview**
**Title:** Web Bew (Brain Extrasensorial White Mirror)
**Genre:** First-person Parapsychology Puzzle/Exploration  
**Platform:** Web (HTML5/WebGL)  
**Game Modes:** Single-player, Multiplayer  
**Art Style:** Abstract, composed of simple primitives (cubes, pyramids, spheres), with a retro, analog research lab aesthetic 80s
**Target Audience:** Players interested in cognitive science, extra sensorial perception, and experimental gameplay

## **Description**
*Psionic Calibration* is an immersive, first-person exploration and calibration game where players train their perception and intuitive skills in a surreal, vintage office-like setting.

The game introduces players to psychic development concepts through interactive puzzles, arcade machines, and agent-level progression.


## **Core Gameplay Mechanics**
- Players control a test subject enrolled in a fictionalized version of the early SRI parapsychology program.
- The game revolves around learning, testing, and enhancing extrasensory abilities through structured experiments.
- Players complete a series of research-based challenges designed to test mental focus, pattern recognition, and remote perception.

## **Game Structure**
- Player starts in a main office area with several doors.
- Initial interaction is choosing a key and progressing to a hallway with three labeled rooms:
  - **Psionic Zone** *(Level 3 agents only)*
  - **Mars Archives**
  - **Calibration Spaces**
- The **Calibration Spaces** room is open. Inside is an arcade-like color calibration machine.
- A light appears on a monitor; the player judges whether it is 'full' (colorful) or 'less' (muted).
- Responses earn calibration points across several rounds (3–10 sec per color).
- After achieving Level 3 calibration, the player gains access to the Psionic Zone area.
- Navigating through boxes, the player enters the **Psionic Asset Training Zone**.
- A new calibration appears — **Solidness Calibration**. Another arcade machine shows boxes and spheres:
  - More boxes = More Solid
  - More spheres = Solid Less
- Upon earning at least two solidness calibration points, the player can phase through a wall in the Psionic Asset Training Zone.
- Beyond the wall, a door requires two hidden codes found on walls throughout the rooms.
- After entering the codes, the player enters the **Witness Room**.
- The player sits with two agents and uses a **Sense Meter** to intuitively describe a hidden target.

## Calibration Mechanics

### Color Calibration
- Interactive console shows a random color intensity.
- Player chooses **'Full'** or **'Less'** using buttons.
- Points awarded for correct perception; multiple attempts required.
- Must reach Level 3 for Psionic Zone access.

### Solidness Calibration
- A machine displays shapes (boxes and spheres).
- Player determines **'More Solid'** or **'Solid Less'** based on count.
- Minimum of 2 points required to progress.

## Progression & Access

Progress is achieved through correct calibrations:
- Level 3 Color Calibration → Psionic Zone
- Solid Calibration → Asset Training Wall Access
- Code Input → Witness Room Entry

## Witness Room (Final Task)

- Room contains a table, two agents, and a chair.
- Player sits and is presented with a **Sense Meter**.
- A target is randomly selected but hidden.
- Player must use calibrated intuition to determine characteristics:
  - **Temperature** (Hot/Cold)
  - **Origin** (Natural/Man-made)
  - **Solidness**
  - **Colorness**

## ESP Lobby Features

The ESP Lobby is a central hub for CRV (Controlled Remote Viewing) activities, featuring several interactive components:

### Public Requests
- Display of available CRV requests from other players
- Each request shows ID, timestamp, and optional bounty
- Players can take requests using color points
- Interface to submit new CRV requests with optional bounties

### Your Requests
- Shows player's submitted CRV requests
- Displays attempts, solved status, and bounty information
- Time-stamped entries for tracking request history

### Scoreboard
- Top performers in CRV tasks
- Displays accuracy percentages and player IDs
- Highlights top 3 performers with enhanced visibility
- Shows up to 8 entries

### Daily Quota
- Tracks daily CRV attempts (limit of 3 per day)
- Shows completion percentage and rewards
- Displays recent results with timestamps
- Includes refresh functionality to update stats
- Reward calculations based on multiple accuracy factors:
  - Naturality
  - Temperature
  - Light
  - Color
  - Solidness

### Networking Features
- Real-time updates for requests and scores
- Asynchronous request handling
- Player-to-player interaction through request system

## **Player Abilities & Controls**
- **Move:** WASD / Arrow Keys
- **Look Around:** Mouse
- **Interact with Objects:** Left Click
- **Use Psychic Ability:** Right Click
- **Jump:** Spacebar
- **Sprint:** Shift (optional in multiplayer)

## **Game Modes**
### **Single Player Mode**
- Players progress through cognitive and perceptual experiments alone.
- The goal is to unlock advanced testing protocols through consistent performance.

### **Multiplayer Mode**
- Players can join a cooperative session to complete experiments together.
- Competitive mode where players race to complete perception trials first.


## **Visual & Audio Design**
- **Graphics:** Minimalist, composed of geometric shapes with glowing effects to represent mental energies and focus zones.
- **Aesthetic:** Mid-to-late 20th century research facility look, using muted colors, CRT-style visual distortions, and analog instruments to emphasize a scientific rather than futuristic atmosphere.
- **Sound Design:** Clean and synthetic, with subtle tones to guide or mislead perception.
- **Music:** Ambient, experimental electronic, dynamically adapting to player success.

## **Multiplayer Networking**
- Uses WebRTC or WebSockets for real-time synchronization.
- P2P connectivity for small-scale multiplayer (up to 4 players).
- Room-based system where players can create or join sessions.

## **Development Stack**
- **Engine:** Three.js / React three fiber / Canon.js (WebGL-based frameworks)
- **Networking:** WebSockets / WebRTC / Supabase
- **Procedural Generation:** Randomized layouts based on predefined rules

## **Conclusion**
This 3D web-based parapsychology game is a fictionalized simulation of experimental psi research. By combining cognitive tests, perceptual challenges, and minimalist visuals, it offers players a fresh exploration of mental phenomena in both solo and cooperative settings, with an aesthetic inspired by mid-20th century research environments






## low graphics

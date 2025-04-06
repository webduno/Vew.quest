**Game Design Document: Parapsychology 3D Web Game**

---

## **Game Overview**
**Title:** TBD  
**Genre:** First-person Parapsychology Puzzle/Exploration  
**Platform:** Web (HTML5/WebGL)  
**Game Modes:** Single-player, Multiplayer  
**Art Style:** Abstract, composed of simple primitives (cubes, pyramids, spheres), with a retro, analog research lab aesthetic rather than a futuristic look.  
**Target Audience:** Players interested in cognitive science, perception, and experimental gameplay

## **Core Gameplay Mechanics**
- Players control a test subject enrolled in a fictionalized version of the early SRI parapsychology program.
- The game revolves around learning, testing, and enhancing extrasensory abilities through structured experiments.
- Players complete a series of research-based challenges designed to test mental focus, pattern recognition, and remote perception.

## **Game Structure**
- **Level 1-4:** Predefined experimental environments with increasing cognitive difficulty.
- **Level 5 (Final Level):** Procedurally generated, providing infinite experimental permutations.

### **Player Abilities & Controls**
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

## **Game Levels**
### **Level 1 (Orientation Lab)**
- **Objective:** Introduce the facility and begin initial cognitive calibration.
- **Gameplay:**
  - Players enter a simulated training center with voice-over guidance.
  - Tasks include identifying symbols hidden within visual noise, completing simple pattern sequences.
  - Introduction to "mental focus zones"—areas requiring players to slow down and stabilize their view to reveal hidden elements.
- **Challenges:**
  - Visual decryption: Find patterns within layered abstract shapes.
  - Basic spatial memory: Reconstruct shape sequences after brief exposure.

### **Level 2 (Remote Perception Test)**
- **Objective:** Train players to perceive environments not visible to the eye.
- **Gameplay:**
  - Players enter isolated rooms where a random location is being projected remotely.
  - Using vague cues and audio hints, players must match what they "sense" with correct 3D layouts.
  - Successful guesses improve the player's signal clarity stat.
- **Challenges:**
  - Choosing the correct matching room from multiple decoys.
  - Solving rotating puzzles that only align from a certain perspective.

### **Level 3 (Psi-Energy Calibration)**
- **Objective:** Allow players to manipulate psi-energy fields under test conditions.
- **Gameplay:**
  - Players must stabilize and direct streams of abstract energy to complete circuits.
  - Introduces calibration nodes and field amplifiers.
  - Players need to match frequency patterns in order to unlock the next room.
- **Challenges:**
  - Route fluctuating energy beams using primitive mirrors and filters.
  - Solve frequency-matching puzzles while under a time constraint.

### **Level 4 (ESP Pattern Synthesis)**
- Players must decipher increasingly complex visual or auditory sequences.
- Timed trials and recognition of evolving waveforms.

### **Level 5 (Infinite Perceptual Matrix)**
- Procedurally generated test chambers.
- Randomized challenges that adapt based on the player’s stats and performance.
- Endless replayability and experimentation.

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
- **Engine:** Three.js / Babylon.js (WebGL-based frameworks)
- **Networking:** WebSockets / WebRTC
- **Procedural Generation:** Randomized layouts based on predefined rules

## **Conclusion**
This 3D web-based parapsychology game is a fictionalized simulation of experimental psi research. By combining cognitive tests, perceptual challenges, and minimalist visuals, it offers players a fresh exploration of mental phenomena in both solo and cooperative settings, with an aesthetic inspired by mid-20th century research environments rather than a futuristic setting.


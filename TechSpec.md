# TechSpec for National Parks Game

## Tech Stack

### PIXI.js + GSAP + TailwindCSS
The game is built using **PIXI.js** for rendering, **GSAP** for animations, and **TailwindCSS** for styling.

#### Why PIXI.js?
- **Pros:**
  - Lightweight and efficient for 2D rendering.
  - Well-documented with an active community.
  - Compatible with modern web technologies.
- **Cons:**
  - Limited to 2D graphics.
  - Requires manual implementation for features like a scene graph.

---

## Architecture

### Game State
Tracks gameplay variables and methods affecting the park.

#### Variables
- **`entities`**: Tracks all elements on the map (planned but not implemented).  
- **`time`**: Represents game progression (planned but not implemented).  

#### Methods
- **`addEntity(entity)`**: Planned but not implemented.  
- **`tickGamePlay()`**: Planned but not implemented.  

---

### Entity
Elements (e.g., trees, mountains) placed on the map.

#### Variables
- **`position: {x: number, y: number}`**: The tile's grid coordinates.  
- **`texture: PIXI.Texture`**: Graphical representation of the element.

---

### Game Map
The map consists of a **15x15** grid of tiles.

- **Tile Size**: 80px.
- **Interactions**:
  - Clicking a tile applies the selected tool’s texture.
  - Hovering changes tile opacity.

#### Textures
- **Tree**: Green triangle with a brown base.  
- **Mountain**: Gray triangle.  
- **Rock**: Gray ellipse.  
- **River**: Blue bezier curve.  
- **Grass**: Green vertical lines.  

Textures are dynamically created using **PIXI.Graphics**.

---

## User Interface

### Welcome Screen
A styled introduction invites users to "Build Your Own National Park."  

- Features:
  - Animated title.
  - Descriptive icons (trees, mountains, rivers, rocks, animals).
  - "Start Exploring" button to initialize the game.

### Toolbar
A menu for placing or clearing elements:
- Tools:
  - `Tree`, `Mountain`, `River`, `Rock`, `Grass`, `Animal`, `Clear`.

### Controls
Navigation buttons for map manipulation:
- **Movement**: `↑`, `↓`, `←`, `→`.  
- **Zoom**: `+` (zoom in), `-` (zoom out).  
- **View Full Map**: Centers and scales the map to fit the screen.

---

## Features in Progress
- Placeholder state management (`time` and `entities`) planned for future iterations.

## Data Model
[here](https://www.figma.com/board/xqyhuKFsVyTD0bIMtytAwT/Untitled?node-id=0-1&node-type=canvas&t=jQZwJDpvA3CjMZgu-0)
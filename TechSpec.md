# TechSpec for National Parks Game

## Tech Stack

**#1 Unreal Engine with Pixel Streaming**
Unreal engine is a seasoned game engine, and supports the web as a target via Pixel Streaming.
Pros:
Ray tracing graphics.
You can hire Unreal Engine developers!
Battle tested and well documented.
Cons:
You need to pay for a server to run the game :(
You need to code in c++
Contenders:
Unity (with WebGL Export), Three.js, Babylon.js:

- Unity runs into performance issues for a game of this scale in the browser
- Three.js is awesome for graphics, but it doesn't give you a visual way to build scenes, and lacks global illumination (that can be baked into unity games)
- Babylon.js is ugly and also doesn't have a viewport. It's documentation is ugly too.

## Architecture

### State

This is the global state of the game

- Variables
   -  `entities: std::List<Entity>`: a list of the objects in the user's national park (P0)
   -  `time: int`: This is modified every tick, and the weather and season is a function of it (P0)
- Methods
   - `addEntity`
     - **Behavior:** places an entity into the national park (P0)
   - `getWeather`
     - **Behavior:** gets the weather based on the game time (P1)
   - `tickGamePlay`
     - **Behavior:** increments time (P0)

### Entity

 - Variables
   - `position: Point` the location of the national park element (P0)
   - `geometry: Geometry` what to display at the given location (P0)

## Data Model
[here](https://www.figma.com/board/xqyhuKFsVyTD0bIMtytAwT/Untitled?node-id=0-1&node-type=canvas&t=jQZwJDpvA3CjMZgu-0)
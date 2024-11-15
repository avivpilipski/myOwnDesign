import * as PIXI from 'https://cdn.jsdelivr.net/npm/pixi.js@7/dist/pixi.min.mjs';

const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0x87CEEB, // Sky blue color
});
document.body.appendChild(app.view);

// Load assets (replace with actual images)
const assets = {
  tree: PIXI.Texture.from('/mnt/data/output-2.jpg'),   // Placeholder for tree
  mountain: PIXI.Texture.from('/mnt/data/output-3.jpg'), // Placeholder for mountain
  rock: PIXI.Texture.from('path/to/rock.jpg'), // Replace with actual rock image
  river: PIXI.Texture.from('path/to/river.jpg'), // Replace with actual river image
  animal: PIXI.Texture.from('path/to/animal.jpg'), // Replace with animal image
  bird: PIXI.Texture.from('path/to/bird.jpg'), // Replace with bird image
};

const tileSize = 200;
const mapContainer = new PIXI.Container();
app.stage.addChild(mapContainer);

let zoomLevel = 1; // Initial zoom level

// Function to create scenery tile with random elements
function createTile(x, y) {
  const tile = new PIXI.Container();
  tile.x = x;
  tile.y = y;

  const randomElement = Math.floor(Math.random() * 5);
  let sprite;
  switch (randomElement) {
    case 0:
      sprite = new PIXI.Sprite(assets.tree); // Tree
      break;
    case 1:
      sprite = new PIXI.Sprite(assets.mountain); // Mountain
      break;
    case 2:
      sprite = new PIXI.Sprite(assets.rock); // Rock
      break;
    case 3:
      sprite = new PIXI.Sprite(assets.river); // River
      break;
    case 4:
      sprite = new PIXI.Sprite(assets.animal); // Animal (deer, bear, etc.)
      break;
    default:
      sprite = new PIXI.Graphics();
      sprite.beginFill(0x228B22); // Green color
      sprite.drawRect(0, 0, tileSize, tileSize);
      sprite.endFill();
  }

  sprite.width = tileSize;
  sprite.height = tileSize;
  tile.addChild(sprite);
  return tile;
}

// Generate the map grid
const gridWidth = 10;
const gridHeight = 10;
const tiles = [];
for (let y = 0; y < gridHeight; y++) {
  for (let x = 0; x < gridWidth; x++) {
    const tile = createTile(x * tileSize, y * tileSize);
    mapContainer.addChild(tile);
    tiles.push(tile);
  }
}

// Variables for map offset and zoom
let offsetX = 0;
let offsetY = 0;
const scrollSpeed = tileSize;

// Update the position of tiles for infinite scrolling effect
function updateMap() {
  tiles.forEach(tile => {
    tile.x = (tile.x - offsetX + gridWidth * tileSize) % (gridWidth * tileSize);
    tile.y = (tile.y - offsetY + gridHeight * tileSize) % (gridHeight * tileSize);
  });
}

// Event listeners for movement and zoom
document.getElementById('up').addEventListener('click', () => {
  offsetY -= scrollSpeed;
  updateMap();
});

document.getElementById('down').addEventListener('click', () => {
  offsetY += scrollSpeed;
  updateMap();
});

document.getElementById('left').addEventListener('click', () => {
  offsetX -= scrollSpeed;
  updateMap();
});

document.getElementById('right').addEventListener('click', () => {
  offsetX += scrollSpeed;
  updateMap();
});

document.getElementById('zoom-in').addEventListener('click', () => {
  zoomLevel += 0.1;
  mapContainer.scale.set(zoomLevel);
});

document.getElementById('zoom-out').addEventListener('click', () => {
  zoomLevel = Math.max(0.1, zoomLevel - 0.1);
  mapContainer.scale.set(zoomLevel);
});

document.getElementById('view-full-map').addEventListener('click', () => {
  mapContainer.scale.set(0.1); // Scale down to show the entire map
  setTimeout(() => mapContainer.scale.set(zoomLevel), 2000); // Zoom back after 2 seconds
});

// Handle window resize
window.addEventListener('resize', () => {
  app.renderer.resize(window.innerWidth, window.innerHeight);
});

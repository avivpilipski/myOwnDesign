import * as PIXI from 'https://cdn.jsdelivr.net/npm/pixi.js@7/dist/pixi.min.mjs';
import gsap from 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/gsap.min.js';

// Welcome Screen Component (React-style)
class WelcomeScreen {
  constructor(onStartCallback) {
    this.container = document.getElementById('welcome-container');
    this.createUI(onStartCallback);
  }

  createUI(onStartCallback) {
    this.container.innerHTML = `
      <div class="fixed inset-0 z-50 bg-gradient-to-br from-green-900 to-blue-900 
        flex items-center justify-center transition-all duration-1000">
        <div class="text-center p-8 max-w-3xl">
          <h1 class="text-6xl font-bold text-green-300 mb-6 animate-pulse">
            Build Your Own National Park
          </h1>
          <p class="text-2xl text-gray-200 mb-8">
            Craft your wilderness, one tile at a time
          </p>
          <div class="space-x-8 mb-12 flex justify-center">
            ${['🌲 Trees', '⛰️ Mountains', '💧 Rivers', '🪨 Rocks', '🐻 Animals']
              .map(item => `
                <div class="text-center">
                  <span class="text-4xl">${item.split(' ')[0]}</span>
                  <p class="text-gray-400 mt-2">${item.split(' ')[1]}</p>
                </div>
              `).join('')}
          </div>
          <button id="start-game-btn" 
            class="px-10 py-4 bg-green-500 text-white rounded-lg text-xl 
            hover:bg-green-600 transform hover:-translate-y-1 transition-all">
            Start Exploring
          </button>
          <p class="text-sm text-gray-400 mt-4">
            Created by Aviv Pilipski
          </p>
        </div>
      </div>
    `;

    this.container.querySelector('#start-game-btn').addEventListener('click', () => {
      this.container.classList.add('opacity-0', 'scale-150');
      setTimeout(() => {
        this.container.innerHTML = '';
        onStartCallback();
      }, 1000);
    });
  }
}

class NationalParkGame {
  constructor() {
    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x87CEEB,
      antialias: true,
      resolution: window.devicePixelRatio || 1
    });
    document.body.appendChild(this.app.view);

    this.tileSize = 80;
    this.gridWidth = 15;
    this.gridHeight = 15;
    this.tileGrid = Array(this.gridHeight).fill().map(() => 
      Array(this.gridWidth).fill().map(() => ({ type: null, sprite: null }))
    );

    this.setupTextures();
    this.createMap();
    this.setupControls();
    this.setupAnimations();
    this.setupTicker();
  }

  setupTextures() {
    // Create base textures
    const createTreeTexture = () => {
      const graphics = new PIXI.Graphics();
      graphics.beginFill(0x2E7D32);
      graphics.drawPolygon([25, 80, 40, 30, 55, 80]);
      graphics.endFill();
      graphics.beginFill(0x795548);
      graphics.drawRect(37, 80, 6, 20);
      graphics.endFill();
      return this.app.renderer.generateTexture(graphics);
    };

    const createLargeTreeTexture = () => {
      const graphics = new PIXI.Graphics();
      graphics.beginFill(0x2E7D32);
      graphics.drawPolygon([25, 160, 80, 30, 135, 160]);
      graphics.endFill();
      graphics.beginFill(0x795548);
      graphics.drawRect(74, 160, 12, 40);
      graphics.endFill();
      return this.app.renderer.generateTexture(graphics);
    };

    this.textures = {
      tree: createTreeTexture(),
      largeTree: createLargeTreeTexture(),
      animals: {
        bear: this.createAnimalSprite('🐻'),
        deer: this.createAnimalSprite('🦌'),
        wolf: this.createAnimalSprite('🐺'),
        rabbit: this.createAnimalSprite('🐰'),
        fox: this.createAnimalSprite('🦊')
      }
    };
  }

  createAnimalSprite(emoji) {
    const style = new PIXI.TextStyle({
      fontSize: 40,
      fill: '#ffffff'
    });
    return new PIXI.Text(emoji, style);
  }

  createMap() {
    this.mapContainer = new PIXI.Container();
    this.app.stage.addChild(this.mapContainer);

    for (let y = 0; y < this.gridHeight; y++) {
      for (let x = 0; x < this.gridWidth; x++) {
        const tile = this.createTile(x, y);
        this.mapContainer.addChild(tile);
      }
    }

    this.centerMap();
  }

  createTile(x, y) {
    const tile = new PIXI.Container();
    tile.x = x * this.tileSize;
    tile.y = y * this.tileSize;
    tile.interactive = true;
    tile.buttonMode = true;

    // Background
    const background = new PIXI.Graphics();
    background.beginFill(0x81C784);
    background.drawRect(0, 0, this.tileSize, this.tileSize);
    background.endFill();
    background.lineStyle(1, 0x000000, 0.1);
    background.drawRect(0, 0, this.tileSize, this.tileSize);
    tile.addChild(background);

    // Add hover effects
    tile.on('pointerover', () => {
      gsap.to(background, { alpha: 0.8, duration: 0.2 });
    });
    
    tile.on('pointerout', () => {
      gsap.to(background, { alpha: 1, duration: 0.2 });
    });

    // Add click handler
    tile.on('pointerdown', () => this.handleTileClick(x, y));

    return tile;
  }

  handleTileClick(x, y) {
    if (!this.selectedTool) return;

    if (this.selectedTool === 'clear') {
      this.clearTile(x, y);
    } else if (this.selectedTool === 'animal') {
      this.addAnimal(x, y);
    } else {
      this.addElement(x, y, this.selectedTool);
      this.checkAndCombineTiles(x, y);
    }
  }

  addElement(x, y, type) {
    this.clearTile(x, y);
    
    const sprite = new PIXI.Sprite(this.textures[type]);
    sprite.width = this.tileSize * 0.8;
    sprite.height = this.tileSize * 0.8;
    sprite.x = this.tileSize * 0.1;
    sprite.y = this.tileSize * 0.1;
    
    const container = this.getTileContainer(x, y);
    container.addChild(sprite);
    
    this.tileGrid[y][x] = { type, sprite };
  }

  addAnimal(x, y) {
    this.clearTile(x, y);
    
    const animals = Object.keys(this.textures.animals);
    const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
    const sprite = this.textures.animals[randomAnimal].clone();
    
    sprite.x = this.tileSize * 0.2;
    sprite.y = this.tileSize * 0.2;
    
    // Add wandering animation
    this.setupAnimalAnimation(sprite);
    
    const container = this.getTileContainer(x, y);
    container.addChild(sprite);
    
    this.tileGrid[y][x] = { type: 'animal', sprite, animalType: randomAnimal };
  }

  setupAnimalAnimation(sprite) {
    const randomMovement = () => {
      const duration = 2 + Math.random() * 3;
      const xOffset = (Math.random() - 0.5) * this.tileSize * 0.4;
      const yOffset = (Math.random() - 0.5) * this.tileSize * 0.4;
      
      gsap.to(sprite, {
        x: this.tileSize * 0.2 + xOffset,
        y: this.tileSize * 0.2 + yOffset,
        duration,
        ease: "power1.inOut",
        onComplete: randomMovement
      });
    };
    
    randomMovement();
  }

  checkAndCombineTiles(x, y) {
    const current = this.tileGrid[y][x];
    if (!current || current.type === 'animal') return;

    const adjacent = this.getAdjacentTiles(x, y);
    const sameTypeAdjacent = adjacent.filter(tile => 
      tile && this.tileGrid[tile.y][tile.x].type === current.type
    );

    if (sameTypeAdjacent.length > 0) {
      const combinedTile = this.createCombinedTile(x, y, sameTypeAdjacent);
      this.animateTileCombination(combinedTile, [{ x, y }, ...sameTypeAdjacent]);
    }
  }

  createCombinedTile(x, y, adjacentTiles) {
    const sprite = new PIXI.Sprite(this.textures.largeTree);
    sprite.width = this.tileSize * 1.6;
    sprite.height = this.tileSize * 1.6;
    sprite.x = -this.tileSize * 0.3;
    sprite.y = -this.tileSize * 0.3;
    
    const container = this.getTileContainer(x, y);
    container.addChild(sprite);
    
    // Clear adjacent tiles
    adjacentTiles.forEach(tile => this.clearTile(tile.x, tile.y));
    
    return sprite;
  }

  animateTileCombination(sprite, tiles) {
    gsap.from(sprite, {
      alpha: 0,
      scale: 0.5,
      duration: 0.5,
      ease: "back.out(1.7)"
    });

    tiles.forEach(tile => {
      const container = this.getTileContainer(tile.x, tile.y);
      gsap.to(container, {
        alpha: 0,
        scale: 0.8,
        duration: 0.3,
        onComplete: () => this.clearTile(tile.x, tile.y)
      });
    });
  }

  getAdjacentTiles(x, y) {
    const adjacent = [];
    if (x > 0) adjacent.push({ x: x - 1, y });
    if (x < this.gridWidth - 1) adjacent.push({ x: x + 1, y });
    if (y > 0) adjacent.push({ x, y: y - 1 });
    if (y < this.gridHeight - 1) adjacent.push({ x, y: y + 1 });
    return adjacent;
  }

  getTileContainer(x, y) {
    return this.mapContainer.children[y * this.gridWidth + x];
  }

  clearTile(x, y) {
    const container = this.getTileContainer(x, y);
    while (container.children.length > 1) {
      container.removeChildAt(1);
    }
    this.tileGrid[y][x] = { type: null, sprite: null };
  }

  setupControls() {
    this.selectedTool = null;
    this.setupToolbarListeners();
    this.setupNavigationControls();
    this.setupKeyboardControls();
  }

  setupToolbarListeners() {
    document.querySelectorAll('.tool-btn').forEach(button => {
      button.addEventListener('click', () => {
        document.querySelectorAll('.tool-btn').forEach(b => 
          b.classList.remove('bg-orange-500'));
        button.classList.add('bg-orange-500');
        this.selectedTool = button.id.replace('add-', '').replace('clear-', 'clear');
      });
    });
  }

  setupNavigationControls() {
    // ... (previous navigation controls code remains the same)
  }

  setupKeyboardControls() {
    window.addEventListener('keydown', (e) => {
      const moveAmount = 50;
      switch(e.key) {
        case 'ArrowUp': this.mapContainer.y += moveAmount; break;
        case 'ArrowDown': this.mapContainer.y -= moveAmount; break;
        case 'ArrowLeft': this.mapContainer.x += moveAmount; break;
        case 'ArrowRight': this.mapContainer.x -= moveAmount; break;
      }
    });
  }

  setupAnimations() {
    gsap.to(this.mapContainer, {
      duration: 4,
      y: '+=5',
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    });
  }

  setupTicker() {
    this.app.ticker.add(() => {
      // Add any per-frame updates here
    });
  }

  centerMap() {
    this.mapContainer.x = (this.app.screen.width - this.gridWidth * this.tileSize) / 2;
    this.mapContainer.y = (this.app.screen.height - this.gridHeight * this.tileSize) / 2;
  }
}

// Initialize the game
document.getElementById('start-game-btn').addEventListener('click', () => {
  document.getElementById('welcome-container').style.display = 'none';
  document.querySelector('.toolbar').style.display = 'block';
  document.querySelector('.controls').style.display = 'block';
  new NationalParkGame();
});
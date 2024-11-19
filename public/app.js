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

    this.setupTextures();
    this.createMap();
    this.setupControls();
    this.setupAnimations();
  }

  setupTextures() {
    this.textures = {
      tree: this.createTextureWithAnimation('tree', 0x2E7D32),
      mountain: this.createTextureWithAnimation('mountain', 0x757575),
      river: this.createFlowingRiverTexture(),
      rock: this.createTextureWithAnimation('rock', 0x9E9E9E),
      grass: this.createSwayingGrassTexture(),
      animals: {
        bear: this.createAnimalTexture('🐻'),
        deer: this.createAnimalTexture('🦌'),
        wolf: this.createAnimalTexture('🐺')
      }
    };
  }

  createTextureWithAnimation(name, color) {
    const graphics = new PIXI.Graphics();
    graphics.beginFill(color);
    graphics.drawPolygon([25, 80, 40, 30, 55, 80]);
    graphics.endFill();
    return this.app.renderer.generateTexture(graphics);
  }

  createFlowingRiverTexture() {
    const graphics = new PIXI.Graphics();
    graphics.lineStyle(6, 0x2196F3, 0.7);
    graphics.moveTo(20, 10);
    graphics.bezierCurveTo(40, 30, 30, 60, 50, 80);
    return this.app.renderer.generateTexture(graphics);
  }

  createSwayingGrassTexture() {
    const graphics = new PIXI.Graphics();
    graphics.lineStyle(3, 0x4CAF50);
    graphics.moveTo(40, 80);
    graphics.lineTo(40, 60);
    return this.app.renderer.generateTexture(graphics);
  }

  createAnimalTexture(emoji) {
    const text = new PIXI.Text(emoji, {
      fontSize: 40,
      fill: 0xFFFFFF
    });
    return this.app.renderer.generateTexture(text);
  }

  createMap() {
    this.mapContainer = new PIXI.Container();
    this.app.stage.addChild(this.mapContainer);

    const tileSize = 80;
    const gridWidth = 15;
    const gridHeight = 15;

    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        const tile = this.createTile(x * tileSize, y * tileSize, tileSize);
        this.mapContainer.addChild(tile);
      }
    }

    this.centerMap(gridWidth * tileSize, gridHeight * tileSize);
  }

  createTile(x, y, size) {
    const tile = new PIXI.Container();
    tile.x = x;
    tile.y = y;

    const background = new PIXI.Graphics();
    background.beginFill(0x81C784);
    background.drawRect(0, 0, size, size);
    background.endFill();
    tile.addChild(background);

    return tile;
  }

  centerMap(mapWidth, mapHeight) {
    this.mapContainer.x = (this.app.screen.width - mapWidth) / 2;
    this.mapContainer.y = (this.app.screen.height - mapHeight) / 2;
  }

  setupControls() {
    this.selectedTool = null;
    this.setupToolbarListeners();
    this.setupNavigationListeners();
  }

  setupToolbarListeners() {
    const toolButtons = document.querySelectorAll('.tool-btn');
    toolButtons.forEach(button => {
      button.addEventListener('click', () => {
        toolButtons.forEach(b => b.classList.remove('bg-orange-500'));
        button.classList.add('bg-orange-500');
        this.selectedTool = button.id.replace('add-', '').replace('clear-', 'clear');
      });
    });
  }

  setupNavigationListeners() {
    const moveAmount = 50;
    document.getElementById('up').onclick = () => this.mapContainer.y += moveAmount;
    document.getElementById('down').onclick = () => this.mapContainer.y -= moveAmount;
    document.getElementById('left').onclick = () => this.mapContainer.x += moveAmount;
    document.getElementById('right').onclick = () => this.mapContainer.x -= moveAmount;

    let scale = 1;
    document.getElementById('zoom-in').onclick = () => {
      scale = Math.min(2, scale + 0.1);
      this.mapContainer.scale.set(scale);
    };

    document.getElementById('zoom-out').onclick = () => {
      scale = Math.max(0.5, scale - 0.1);
      this.mapContainer.scale.set(scale);
    };

    document.getElementById('view-full-map').onclick = () => {
      scale = Math.min(
        this.app.screen.width / (15 * 80),
        this.app.screen.height / (15 * 80)
      ) * 0.9;
      this.mapContainer.scale.set(scale);
    };
  }

  setupAnimations() {
    // Add subtle breathing/movement animations
    gsap.to(this.mapContainer, {
      duration: 2,
      y: `+=${5}`,
      ease: 'power1.inOut',
      repeat: -1,
      yoyo: true
    });
  }

  start() {
    window.addEventListener('resize', () => {
      this.app.renderer.resize(window.innerWidth, window.innerHeight);
    });
  }
}

// Game Initialization
document.addEventListener('DOMContentLoaded', () => {
  const welcomeScreen = new WelcomeScreen(() => {
    const game = new NationalParkGame();
    game.start();
  });
});
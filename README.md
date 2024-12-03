# 🏞️ National Park Explorer

## Overview

**National Park Explorer** is an interactive web-based game that allows players to design and build their own virtual national park by placing various elements like trees, mountains, rivers, and animals on a grid-based map.

## 🛠 Technology Stack

- **PIXI.js**: 2D graphics rendering
- **Tailwind CSS**: Styling and layout
- **Vanilla JavaScript**: Game logic and interactivity
- **Firebase**: Hosting and server functionality

## 🚀 Getting Started

### Prerequisites

- Git
- Node.js and npm
- Firebase CLI
- Modern web browser

### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/avivpilipski/myOwnDesign.git
   cd myOwnDesign
   ```

2. Install Firebase CLI globally:
   ```bash
   npm install -g firebase-tools
   ```

3. Log in to Firebase:
   ```bash
   firebase login
   ```

4. Initialize Firebase in the project:
   ```bash
   firebase init
   ```
   - Choose "Hosting" when prompted
   - Select your Firebase project or create a new one
   - Set the public directory to your project's root or `public` folder
   - Configure as a single-page app if needed

5. Deploy to Firebase:
   ```bash
   firebase deploy
   ```

### Running Locally

- To run the project locally:
  ```bash
  firebase serve
  ```
- Open the provided local host URL in your web browser

## ✨ Features

- Interactive grid-based map
- Drag-and-drop landscape elements
- Zoom and pan controls
- Firebase hosting
- Simple, intuitive user interface

## 🎮 How to Play

1. Click "Start Exploring"
2. Select elements from the toolbar (trees, mountains, etc.)
3. Click on grid tiles to place elements
4. Use navigation buttons to move around the map
5. Use +/- buttons to zoom in and out

## 📂 Project Structure

### Main Components

- **Canvas Rendering**: Using PIXI.js
- **Tile System**: Custom `Tile` class for grid interactions
- **Texture Creation**: Dynamic graphic generation for park elements
- **Navigation Controls**: Pan and zoom functionality
- **Firebase**: Hosting and potential future backend integration

### Key Functions

- `createTreeTexture()`: Generates tree graphics
- `createMountainTexture()`: Generates mountain graphics
- `Tile.onClick()`: Handles tile interaction and element placement

## 🔧 Troubleshooting

- Ensure you have the latest version of Firebase CLI
- Check your Firebase project configuration
- Verify Node.js and npm are up to date

## 🌐 Deployment

The project is set up for easy deployment via Firebase Hosting. Each push to the main branch can be configured for automatic deployment.

## 📄 License

Open-source project. Feel free to use, modify, and distribute.

## 👥 Contributors

- Aviv Pilipski

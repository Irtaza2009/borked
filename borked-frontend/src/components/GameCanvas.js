import React, { useRef, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './GameCanvas.css';

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 600;
const STICKMAN_SIZE = 20;
const STICKMAN_SPEED = 3;

const GameCanvas = ({ user }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  // Game state
  const [gameState, setGameState] = useState({
    stickman: { x: 100, y: 500, isAlive: true },
    blockingStickman: { x: 400, y: 500, hasBeenAsked: false, moved: false },
    bridgeSquare: { x: 600, y: 520, activated: false },
    bridgePlaced: false,
    keys: {},
    currentModal: null, // 'submit', 'gallery', 'voting', or null
    submissions: [],
    isInPit: false
  });

  // Game world layout
  const WORLD = {
    PIT: { x: 550, y: 520, width: 100, height: 80 },
    DOORS: [
      { x: 800, y: 200, width: 80, height: 100, type: 'submit', label: '📝 SUBMIT' },
      { x: 950, y: 200, width: 80, height: 100, type: 'gallery', label: '🖼️ GALLERY' },
      { x: 1100, y: 200, width: 80, height: 100, type: 'voting', label: '🗳️ VOTE' }
    ],
    PATHS: [
      // Bottom path
      { x: 50, y: 520, width: 500, height: 20 },
      // Bridge area (when activated)
      { x: 650, y: 520, width: 100, height: 20 },
      // Upper paths to doors
      { x: 750, y: 520, width: 50, height: 20 },
      { x: 800, y: 300, width: 80, height: 220 },
      { x: 880, y: 300, width: 70, height: 20 },
      { x: 950, y: 300, width: 80, height: 220 },
      { x: 1030, y: 300, width: 70, height: 20 },
      { x: 1100, y: 300, width: 80, height: 220 }
    ]
  };

  // Input handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      setGameState(prev => ({
        ...prev,
        keys: { ...prev.keys, [e.key.toLowerCase()]: true }
      }));
    };

    const handleKeyUp = (e) => {
      setGameState(prev => ({
        ...prev,
        keys: { ...prev.keys, [e.key.toLowerCase()]: false }
      }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Game logic
  const updateGame = useCallback(() => {
    if (gameState.currentModal || gameState.isInPit) return;

    setGameState(prev => {
      const newState = { ...prev };
      const { keys, stickman, blockingStickman, bridgeSquare } = prev;

      // Move stickman based on input
      let newX = stickman.x;
      let newY = stickman.y;

      if (keys['a'] || keys['arrowleft']) newX -= STICKMAN_SPEED;
      if (keys['d'] || keys['arrowright']) newX += STICKMAN_SPEED;
      if (keys['w'] || keys['arrowup']) newY -= STICKMAN_SPEED;
      if (keys['s'] || keys['arrowdown']) newY += STICKMAN_SPEED;

      // Boundary checking
      newX = Math.max(0, Math.min(CANVAS_WIDTH - STICKMAN_SIZE, newX));
      newY = Math.max(0, Math.min(CANVAS_HEIGHT - STICKMAN_SIZE, newY));

      // Check if stickman falls in pit
      const pitCollision = newX + STICKMAN_SIZE > WORLD.PIT.x && 
                          newX < WORLD.PIT.x + WORLD.PIT.width &&
                          newY + STICKMAN_SIZE > WORLD.PIT.y && 
                          newY < WORLD.PIT.y + WORLD.PIT.height;

      if (pitCollision && !newState.bridgePlaced) {
        newState.isInPit = true;
        newY = WORLD.PIT.y + 20; // Fall into pit
      } else {
        // Check collision with blocking stickman
        const blockingCollision = newX + STICKMAN_SIZE > blockingStickman.x && 
                                 newX < blockingStickman.x + STICKMAN_SIZE &&
                                 newY + STICKMAN_SIZE > blockingStickman.y && 
                                 newY < blockingStickman.y + STICKMAN_SIZE;

        if (blockingCollision && !blockingStickman.moved) {
          // Don't allow movement past blocking stickman
          newX = stickman.x;
          newY = stickman.y;
        }
      }

      newState.stickman = { ...stickman, x: newX, y: newY };

      // Move bridge square if not activated
      if (!bridgeSquare.activated) {
        newState.bridgeSquare = {
          ...bridgeSquare,
          x: bridgeSquare.x + Math.sin(Date.now() * 0.003) * 2,
          y: bridgeSquare.y + Math.cos(Date.now() * 0.005) * 1
        };
      }

      return newState;
    });
  }, [gameState.currentModal, gameState.isInPit]);

  // Game loop
  useEffect(() => {
    const gameLoop = () => {
      updateGame();
      animationRef.current = requestAnimationFrame(gameLoop);
    };
    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [updateGame]);

  // Drawing function
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    const draw = () => {
      // Clear canvas
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw ground/paths
      ctx.fillStyle = '#8B4513';
      WORLD.PATHS.forEach(path => {
        ctx.fillRect(path.x, path.y, path.width, path.height);
      });

      // Draw bridge if placed
      if (gameState.bridgePlaced) {
        ctx.fillStyle = '#654321';
        ctx.fillRect(WORLD.PIT.x, WORLD.PIT.y, WORLD.PIT.width, 20);
      } else {
        // Draw pit
        ctx.fillStyle = '#000000';
        ctx.fillRect(WORLD.PIT.x, WORLD.PIT.y, WORLD.PIT.width, WORLD.PIT.height);
      }

      // Draw doors
      WORLD.DOORS.forEach(door => {
        ctx.fillStyle = door.type === 'submit' ? '#FF6B6B' : 
                       door.type === 'gallery' ? '#4ECDC4' : '#45B7D1';
        ctx.fillRect(door.x, door.y, door.width, door.height);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(door.label, door.x + door.width/2, door.y + door.height/2);
      });

      // Draw bridge square
      if (!gameState.bridgeSquare.activated) {
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(gameState.bridgeSquare.x, gameState.bridgeSquare.y, 20, 20);
        
        ctx.fillStyle = '#000000';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('?', gameState.bridgeSquare.x + 10, gameState.bridgeSquare.y + 15);
      }

      // Draw blocking stickman
      if (!gameState.blockingStickman.moved) {
        drawStickman(ctx, gameState.blockingStickman.x, gameState.blockingStickman.y, '#FF0000');
        
        ctx.fillStyle = '#000000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🚫', gameState.blockingStickman.x + 10, gameState.blockingStickman.y - 10);
      }

      // Draw player stickman
      drawStickman(ctx, gameState.stickman.x, gameState.stickman.y, '#000000');

      // Draw pit death message
      if (gameState.isInPit) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('💀 YOU FELL IN THE PIT! 💀', CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
        ctx.font = '18px Arial';
        ctx.fillText('Reload the page to escape this terrible fate!', CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 50);
      }
      
      animationRef.current = requestAnimationFrame(draw);
    };
    
    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState]);

  const drawStickman = (ctx, x, y, color = '#000000') => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    
    // Head
    ctx.beginPath();
    ctx.arc(x + 10, y + 5, 3, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Body
    ctx.beginPath();
    ctx.moveTo(x + 10, y + 8);
    ctx.lineTo(x + 10, y + 15);
    ctx.stroke();
    
    // Arms
    ctx.beginPath();
    ctx.moveTo(x + 5, y + 11);
    ctx.lineTo(x + 15, y + 11);
    ctx.stroke();
    
    // Legs
    ctx.beginPath();
    ctx.moveTo(x + 10, y + 15);
    ctx.lineTo(x + 7, y + 20);
    ctx.moveTo(x + 10, y + 15);
    ctx.lineTo(x + 13, y + 20);
    ctx.stroke();
  };

  // Interaction handlers
  const handleInteraction = (e) => {
    if (gameState.isInPit || gameState.currentModal) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    // Check bridge square interaction
    const bridgeDistance = Math.sqrt(
      Math.pow(clickX - (gameState.bridgeSquare.x + 10), 2) + 
      Math.pow(clickY - (gameState.bridgeSquare.y + 10), 2)
    );
    
    if (bridgeDistance < 30 && !gameState.bridgeSquare.activated) {
      setGameState(prev => ({
        ...prev,
        bridgeSquare: { ...prev.bridgeSquare, activated: true },
        bridgePlaced: true
      }));
      return;
    }
    
    // Check blocking stickman interaction
    const blockingDistance = Math.sqrt(
      Math.pow(clickX - (gameState.blockingStickman.x + 10), 2) + 
      Math.pow(clickY - (gameState.blockingStickman.y + 10), 2)
    );
    
    if (blockingDistance < 30 && !gameState.blockingStickman.moved) {
      if (!gameState.blockingStickman.hasBeenAsked) {
        alert('Stickman: "No! Bwahahaha! I will never move!"');
        setGameState(prev => ({
          ...prev,
          blockingStickman: { ...prev.blockingStickman, hasBeenAsked: true }
        }));
      } else {
        alert('Stickman: "Fine... I guess I\'ll move. But I don\'t like it!"');
        setGameState(prev => ({
          ...prev,
          blockingStickman: { ...prev.blockingStickman, moved: true }
        }));
      }
      return;
    }
    
    // Check door interactions
    WORLD.DOORS.forEach(door => {
      if (clickX >= door.x && clickX <= door.x + door.width &&
          clickY >= door.y && clickY <= door.y + door.height) {
        // Check if player is close enough
        const playerDistance = Math.sqrt(
          Math.pow(gameState.stickman.x - door.x, 2) + 
          Math.pow(gameState.stickman.y - door.y, 2)
        );
        
        if (playerDistance < 100) {
          setGameState(prev => ({ ...prev, currentModal: door.type }));
        } else {
          alert('You need to get closer to the door first!');
        }
      }
    });
  };

  const closeModal = () => {
    setGameState(prev => ({ ...prev, currentModal: null }));
  };

  return (
    <div className="game-container">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onClick={handleInteraction}
        className="game-canvas"
      />
      
      {gameState.currentModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button onClick={closeModal} className="close-btn">❌</button>
            {gameState.currentModal === 'submit' && <SubmissionModal user={user} />}
            {gameState.currentModal === 'gallery' && <GalleryModal />}
            {gameState.currentModal === 'voting' && <VotingModal user={user} />}
          </div>
        </div>
      )}
    </div>
  );
};

// Modal components will be created separately
const SubmissionModal = ({ user }) => (
  <div>
    <h2>📝 Submit Your Bad Design</h2>
    <p>Upload your terribly designed creation!</p>
    <p>Coming soon... (this is intentionally unfinished)</p>
  </div>
);

const GalleryModal = () => (
  <div>
    <h2>🖼️ Gallery of Horrors</h2>
    <p>Behold the worst designs ever created!</p>
    <p>Coming soon... (also intentionally incomplete)</p>
  </div>
);

const VotingModal = ({ user }) => (
  <div>
    <h2>🗳️ Vote for the Worst</h2>
    <p>Choose your least favorite design!</p>
    <p>Coming soon... (you get the pattern)</p>
  </div>
);

export default GameCanvas;
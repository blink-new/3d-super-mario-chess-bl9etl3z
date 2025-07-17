import { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { ChessBoard3D } from './components/ChessBoard3D';
import { GameUI } from './components/GameUI';
import { GameState, Position } from './types/chess';
import { createInitialGameState, getValidMoves, makeMove } from './utils/chessLogic';

function App() {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  const orbitControlsRef = useRef<any>(null);

  const handleSquareClick = (position: Position) => {
    const square = gameState.board[position.row][position.col];
    
    // If no piece is selected
    if (!gameState.selectedSquare) {
      // Select piece if it belongs to current player
      if (square.piece && square.piece.color === gameState.currentPlayer) {
        const validMoves = getValidMoves(gameState.board, square.piece, position);
        setGameState(prev => ({
          ...prev,
          selectedSquare: position,
          validMoves
        }));
      }
      return;
    }
    
    // If clicking on the same square, deselect
    if (gameState.selectedSquare.row === position.row && gameState.selectedSquare.col === position.col) {
      setGameState(prev => ({
        ...prev,
        selectedSquare: null,
        validMoves: []
      }));
      return;
    }
    
    // If clicking on a valid move
    const isValidMove = gameState.validMoves.some(
      move => move.row === position.row && move.col === position.col
    );
    
    if (isValidMove) {
      const newGameState = makeMove(gameState, gameState.selectedSquare, position);
      setGameState(newGameState);
    } else {
      // Select new piece if it belongs to current player
      if (square.piece && square.piece.color === gameState.currentPlayer) {
        const validMoves = getValidMoves(gameState.board, square.piece, position);
        setGameState(prev => ({
          ...prev,
          selectedSquare: position,
          validMoves
        }));
      } else {
        // Deselect if clicking on invalid square
        setGameState(prev => ({
          ...prev,
          selectedSquare: null,
          validMoves: []
        }));
      }
    }
  };

  const handleResetGame = () => {
    setGameState(createInitialGameState());
  };

  const handleRotateLeft = () => {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.autoRotate = true;
      orbitControlsRef.current.autoRotateSpeed = -2;
      setTimeout(() => {
        if (orbitControlsRef.current) {
          orbitControlsRef.current.autoRotate = false;
        }
      }, 1000);
    }
  };

  const handleRotateRight = () => {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.autoRotate = true;
      orbitControlsRef.current.autoRotateSpeed = 2;
      setTimeout(() => {
        if (orbitControlsRef.current) {
          orbitControlsRef.current.autoRotate = false;
        }
      }, 1000);
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-sky-300 to-sky-500 relative overflow-hidden">
      {/* Game UI */}
      <GameUI
        gameState={gameState}
        onResetGame={handleResetGame}
        onRotateLeft={handleRotateLeft}
        onRotateRight={handleRotateRight}
      />
      
      {/* Title */}
      <div className="absolute top-4 right-4 z-10">
        <h1 className="font-pixel text-2xl text-white drop-shadow-lg">
          3D SUPER MARIO CHESS
        </h1>
      </div>
      
      {/* 3D Scene */}
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[8, 8, 8]} fov={60} />
        
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <pointLight position={[-10, 10, -10]} intensity={0.3} />
        
        {/* Environment */}
        <Environment preset="sunset" />
        
        {/* Chess Board */}
        <ChessBoard3D
          board={gameState.board}
          selectedSquare={gameState.selectedSquare}
          validMoves={gameState.validMoves}
          onSquareClick={handleSquareClick}
        />
        
        {/* Camera Controls */}
        <OrbitControls
          ref={orbitControlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={20}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2}
          target={[0, 0, 0]}
        />
      </Canvas>
      
      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2">
          <p className="text-sm text-center">
            <span className="font-pixel text-xs">Click pieces to select • Drag to rotate camera • Scroll to zoom</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
import { GameState, MARIO_CHARACTERS } from '../types/chess';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { RotateCcw, RotateCw, RefreshCw } from 'lucide-react';

interface GameUIProps {
  gameState: GameState;
  onResetGame: () => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
}

export function GameUI({ gameState, onResetGame, onRotateLeft, onRotateRight }: GameUIProps) {
  const currentPlayerName = gameState.currentPlayer === 'white' ? 'White' : 'Black';
  
  return (
    <div className="absolute top-4 left-4 z-10 space-y-4">
      {/* Game Status */}
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="font-pixel text-sm text-primary">
            Super Mario Chess
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-sm">
            <span className="font-medium">Current Turn:</span>
            <span className={`ml-2 font-pixel text-xs ${
              gameState.currentPlayer === 'white' ? 'text-blue-600' : 'text-red-600'
            }`}>
              {currentPlayerName}
            </span>
          </div>
          
          {gameState.isCheck && (
            <div className="text-red-600 font-pixel text-xs">
              CHECK!
            </div>
          )}
          
          {gameState.isCheckmate && (
            <div className="text-red-600 font-pixel text-xs">
              CHECKMATE!
            </div>
          )}
          
          {gameState.isStalemate && (
            <div className="text-yellow-600 font-pixel text-xs">
              STALEMATE!
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Controls */}
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="font-pixel text-sm">Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onRotateLeft}
              className="flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="text-xs">Rotate</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onRotateRight}
              className="flex items-center gap-1"
            >
              <RotateCw className="w-3 h-3" />
              <span className="text-xs">Rotate</span>
            </Button>
          </div>
          
          <Button
            size="sm"
            variant="destructive"
            onClick={onResetGame}
            className="w-full flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="text-xs">New Game</span>
          </Button>
        </CardContent>
      </Card>
      
      {/* Captured Pieces */}
      {gameState.capturedPieces.length > 0 && (
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="font-pixel text-sm">Captured</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-1">
              {gameState.capturedPieces.map((piece, index) => {
                const character = MARIO_CHARACTERS[piece.type];
                return (
                  <div
                    key={`${piece.id}-${index}`}
                    className="w-8 h-8 rounded border-2 flex items-center justify-center text-xs font-pixel"
                    style={{ 
                      backgroundColor: piece.color === 'white' ? '#f8f8f8' : '#2a2a2a',
                      borderColor: character.color,
                      color: piece.color === 'white' ? '#2a2a2a' : '#f8f8f8'
                    }}
                  >
                    {character.name.charAt(0)}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Character Legend */}
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="font-pixel text-sm">Characters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1 text-xs">
            {Object.entries(MARIO_CHARACTERS).map(([pieceType, character]) => (
              <div key={pieceType} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: character.color }}
                />
                <span className="font-pixel text-xs">{character.name}</span>
                <span className="text-gray-500 capitalize">({pieceType})</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
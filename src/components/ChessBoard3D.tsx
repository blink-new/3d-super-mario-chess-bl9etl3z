import { ChessSquare, Position } from '../types/chess';
import { ChessPiece3D } from './ChessPiece3D';

interface ChessBoard3DProps {
  board: ChessSquare[][];
  selectedSquare: Position | null;
  validMoves: Position[];
  onSquareClick: (position: Position) => void;
}

export function ChessBoard3D({ board, selectedSquare, validMoves, onSquareClick }: ChessBoard3DProps) {
  const isValidMove = (row: number, col: number) => {
    return validMoves.some(move => move.row === row && move.col === col);
  };
  
  const isSelected = (row: number, col: number) => {
    return selectedSquare?.row === row && selectedSquare?.col === col;
  };
  
  return (
    <group>
      {/* Chess board squares */}
      {board.map((row, rowIndex) =>
        row.map((square, colIndex) => {
          const isLight = (rowIndex + colIndex) % 2 === 0;
          const x = (colIndex - 3.5) * 1;
          const z = (rowIndex - 3.5) * 1;
          
          return (
            <group key={`${rowIndex}-${colIndex}`}>
              {/* Board square */}
              <mesh 
                position={[x, -0.1, z]} 
                receiveShadow
                onClick={() => onSquareClick({ row: rowIndex, col: colIndex })}
              >
                <boxGeometry args={[0.9, 0.2, 0.9]} />
                <meshStandardMaterial 
                  color={isLight ? '#f0d9b5' : '#b58863'}
                  metalness={0.1}
                  roughness={0.8}
                />
              </mesh>
              
              {/* Valid move indicator */}
              {isValidMove(rowIndex, colIndex) && (
                <mesh position={[x, 0.01, z]}>
                  <cylinderGeometry args={[0.15, 0.15, 0.02, 16]} />
                  <meshStandardMaterial 
                    color="#00ff00"
                    emissive="#00ff00"
                    emissiveIntensity={0.3}
                    transparent
                    opacity={0.6}
                  />
                </mesh>
              )}
              
              {/* Selection highlight */}
              {isSelected(rowIndex, colIndex) && (
                <mesh position={[x, 0.01, z]}>
                  <boxGeometry args={[0.95, 0.02, 0.95]} />
                  <meshStandardMaterial 
                    color="#FFCC02"
                    emissive="#FFCC02"
                    emissiveIntensity={0.4}
                    transparent
                    opacity={0.7}
                  />
                </mesh>
              )}
              
              {/* Chess piece */}
              {square.piece && (
                <ChessPiece3D
                  piece={square.piece}
                  position={[x, 0.3, z]}
                  isSelected={isSelected(rowIndex, colIndex)}
                  onClick={() => onSquareClick({ row: rowIndex, col: colIndex })}
                />
              )}
            </group>
          );
        })
      )}
      
      {/* Board border */}
      <mesh position={[0, -0.25, 0]} receiveShadow>
        <boxGeometry args={[9, 0.3, 9]} />
        <meshStandardMaterial 
          color="#8B4513"
          metalness={0.2}
          roughness={0.7}
        />
      </mesh>
    </group>
  );
}
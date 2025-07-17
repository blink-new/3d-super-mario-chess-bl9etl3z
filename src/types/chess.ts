export type PieceType = 'king' | 'queen' | 'bishop' | 'knight' | 'rook' | 'pawn';
export type PieceColor = 'white' | 'black';

export interface ChessPiece {
  type: PieceType;
  color: PieceColor;
  id: string;
  hasMoved?: boolean;
}

export interface Position {
  row: number;
  col: number;
}

export interface ChessSquare {
  piece: ChessPiece | null;
  position: Position;
  isHighlighted?: boolean;
  isSelected?: boolean;
  isValidMove?: boolean;
}

export interface GameState {
  board: ChessSquare[][];
  currentPlayer: PieceColor;
  selectedSquare: Position | null;
  validMoves: Position[];
  capturedPieces: ChessPiece[];
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
}

export interface MarioCharacter {
  name: string;
  color: string;
  pieceType: PieceType;
}

export const MARIO_CHARACTERS: Record<PieceType, MarioCharacter> = {
  king: { name: 'Mario', color: '#E60012', pieceType: 'king' },
  queen: { name: 'Luigi', color: '#00A652', pieceType: 'queen' },
  bishop: { name: 'Yoshi', color: '#00A652', pieceType: 'bishop' },
  knight: { name: 'Toad', color: '#FF6B35', pieceType: 'knight' },
  rook: { name: 'Koopa', color: '#8B4513', pieceType: 'rook' },
  pawn: { name: 'Goomba', color: '#8B4513', pieceType: 'pawn' }
};
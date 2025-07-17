import { ChessPiece, Position, ChessSquare, GameState, PieceType, PieceColor } from '../types/chess';

export function createInitialBoard(): ChessSquare[][] {
  const board: ChessSquare[][] = [];
  
  // Initialize empty board
  for (let row = 0; row < 8; row++) {
    board[row] = [];
    for (let col = 0; col < 8; col++) {
      board[row][col] = {
        piece: null,
        position: { row, col }
      };
    }
  }
  
  // Place pieces
  const pieceOrder: PieceType[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
  
  // Black pieces (top)
  for (let col = 0; col < 8; col++) {
    board[0][col].piece = {
      type: pieceOrder[col],
      color: 'black',
      id: `black-${pieceOrder[col]}-${col}`,
      hasMoved: false
    };
    
    board[1][col].piece = {
      type: 'pawn',
      color: 'black',
      id: `black-pawn-${col}`,
      hasMoved: false
    };
  }
  
  // White pieces (bottom)
  for (let col = 0; col < 8; col++) {
    board[7][col].piece = {
      type: pieceOrder[col],
      color: 'white',
      id: `white-${pieceOrder[col]}-${col}`,
      hasMoved: false
    };
    
    board[6][col].piece = {
      type: 'pawn',
      color: 'white',
      id: `white-pawn-${col}`,
      hasMoved: false
    };
  }
  
  return board;
}

export function isValidPosition(pos: Position): boolean {
  return pos.row >= 0 && pos.row < 8 && pos.col >= 0 && pos.col < 8;
}

export function getValidMoves(board: ChessSquare[][], piece: ChessPiece, position: Position): Position[] {
  const moves: Position[] = [];
  
  switch (piece.type) {
    case 'pawn':
      moves.push(...getPawnMoves(board, piece, position));
      break;
    case 'rook':
      moves.push(...getRookMoves(board, piece, position));
      break;
    case 'knight':
      moves.push(...getKnightMoves(board, piece, position));
      break;
    case 'bishop':
      moves.push(...getBishopMoves(board, piece, position));
      break;
    case 'queen':
      moves.push(...getQueenMoves(board, piece, position));
      break;
    case 'king':
      moves.push(...getKingMoves(board, piece, position));
      break;
  }
  
  return moves.filter(isValidPosition);
}

function getPawnMoves(board: ChessSquare[][], piece: ChessPiece, position: Position): Position[] {
  const moves: Position[] = [];
  const direction = piece.color === 'white' ? -1 : 1;
  const startRow = piece.color === 'white' ? 6 : 1;
  
  // Forward move
  const oneForward = { row: position.row + direction, col: position.col };
  if (isValidPosition(oneForward) && !board[oneForward.row][oneForward.col].piece) {
    moves.push(oneForward);
    
    // Two squares forward from starting position
    if (position.row === startRow) {
      const twoForward = { row: position.row + 2 * direction, col: position.col };
      if (isValidPosition(twoForward) && !board[twoForward.row][twoForward.col].piece) {
        moves.push(twoForward);
      }
    }
  }
  
  // Diagonal captures
  const captureLeft = { row: position.row + direction, col: position.col - 1 };
  const captureRight = { row: position.row + direction, col: position.col + 1 };
  
  if (isValidPosition(captureLeft) && board[captureLeft.row][captureLeft.col].piece?.color !== piece.color) {
    moves.push(captureLeft);
  }
  
  if (isValidPosition(captureRight) && board[captureRight.row][captureRight.col].piece?.color !== piece.color) {
    moves.push(captureRight);
  }
  
  return moves;
}

function getRookMoves(board: ChessSquare[][], piece: ChessPiece, position: Position): Position[] {
  const moves: Position[] = [];
  const directions = [
    { row: 0, col: 1 },   // right
    { row: 0, col: -1 },  // left
    { row: 1, col: 0 },   // down
    { row: -1, col: 0 }   // up
  ];
  
  for (const dir of directions) {
    for (let i = 1; i < 8; i++) {
      const newPos = { row: position.row + dir.row * i, col: position.col + dir.col * i };
      
      if (!isValidPosition(newPos)) break;
      
      const targetSquare = board[newPos.row][newPos.col];
      
      if (!targetSquare.piece) {
        moves.push(newPos);
      } else {
        if (targetSquare.piece.color !== piece.color) {
          moves.push(newPos);
        }
        break;
      }
    }
  }
  
  return moves;
}

function getKnightMoves(board: ChessSquare[][], piece: ChessPiece, position: Position): Position[] {
  const moves: Position[] = [];
  const knightMoves = [
    { row: -2, col: -1 }, { row: -2, col: 1 },
    { row: -1, col: -2 }, { row: -1, col: 2 },
    { row: 1, col: -2 }, { row: 1, col: 2 },
    { row: 2, col: -1 }, { row: 2, col: 1 }
  ];
  
  for (const move of knightMoves) {
    const newPos = { row: position.row + move.row, col: position.col + move.col };
    
    if (isValidPosition(newPos)) {
      const targetSquare = board[newPos.row][newPos.col];
      if (!targetSquare.piece || targetSquare.piece.color !== piece.color) {
        moves.push(newPos);
      }
    }
  }
  
  return moves;
}

function getBishopMoves(board: ChessSquare[][], piece: ChessPiece, position: Position): Position[] {
  const moves: Position[] = [];
  const directions = [
    { row: 1, col: 1 },   // down-right
    { row: 1, col: -1 },  // down-left
    { row: -1, col: 1 },  // up-right
    { row: -1, col: -1 }  // up-left
  ];
  
  for (const dir of directions) {
    for (let i = 1; i < 8; i++) {
      const newPos = { row: position.row + dir.row * i, col: position.col + dir.col * i };
      
      if (!isValidPosition(newPos)) break;
      
      const targetSquare = board[newPos.row][newPos.col];
      
      if (!targetSquare.piece) {
        moves.push(newPos);
      } else {
        if (targetSquare.piece.color !== piece.color) {
          moves.push(newPos);
        }
        break;
      }
    }
  }
  
  return moves;
}

function getQueenMoves(board: ChessSquare[][], piece: ChessPiece, position: Position): Position[] {
  return [
    ...getRookMoves(board, piece, position),
    ...getBishopMoves(board, piece, position)
  ];
}

function getKingMoves(board: ChessSquare[][], piece: ChessPiece, position: Position): Position[] {
  const moves: Position[] = [];
  const directions = [
    { row: -1, col: -1 }, { row: -1, col: 0 }, { row: -1, col: 1 },
    { row: 0, col: -1 },                       { row: 0, col: 1 },
    { row: 1, col: -1 }, { row: 1, col: 0 }, { row: 1, col: 1 }
  ];
  
  for (const dir of directions) {
    const newPos = { row: position.row + dir.row, col: position.col + dir.col };
    
    if (isValidPosition(newPos)) {
      const targetSquare = board[newPos.row][newPos.col];
      if (!targetSquare.piece || targetSquare.piece.color !== piece.color) {
        moves.push(newPos);
      }
    }
  }
  
  return moves;
}

export function makeMove(gameState: GameState, from: Position, to: Position): GameState {
  const newBoard = gameState.board.map(row => 
    row.map(square => ({ ...square, isSelected: false, isValidMove: false }))
  );
  
  const piece = newBoard[from.row][from.col].piece;
  if (!piece) return gameState;
  
  // Capture piece if present
  const capturedPiece = newBoard[to.row][to.col].piece;
  const newCapturedPieces = capturedPiece 
    ? [...gameState.capturedPieces, capturedPiece]
    : gameState.capturedPieces;
  
  // Move piece
  newBoard[to.row][to.col].piece = { ...piece, hasMoved: true };
  newBoard[from.row][from.col].piece = null;
  
  return {
    ...gameState,
    board: newBoard,
    currentPlayer: gameState.currentPlayer === 'white' ? 'black' : 'white',
    selectedSquare: null,
    validMoves: [],
    capturedPieces: newCapturedPieces
  };
}

export function createInitialGameState(): GameState {
  return {
    board: createInitialBoard(),
    currentPlayer: 'white',
    selectedSquare: null,
    validMoves: [],
    capturedPieces: [],
    isCheck: false,
    isCheckmate: false,
    isStalemate: false
  };
}
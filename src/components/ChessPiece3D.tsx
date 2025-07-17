import { useRef } from 'react';
import { Mesh } from 'three';
import { useFrame } from '@react-three/fiber';
import { ChessPiece, MARIO_CHARACTERS } from '../types/chess';

interface ChessPiece3DProps {
  piece: ChessPiece;
  position: [number, number, number];
  isSelected?: boolean;
  onClick?: () => void;
}

export function ChessPiece3D({ piece, position, isSelected, onClick }: ChessPiece3DProps) {
  const meshRef = useRef<Mesh>(null);
  const character = MARIO_CHARACTERS[piece.type];
  
  // Gentle floating animation for selected piece
  useFrame((state) => {
    if (meshRef.current && isSelected) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.1;
    } else if (meshRef.current) {
      meshRef.current.position.y = position[1];
    }
  });
  
  const getGeometry = () => {
    switch (piece.type) {
      case 'king':
        return <cylinderGeometry args={[0.3, 0.4, 0.8, 8]} />;
      case 'queen':
        return <cylinderGeometry args={[0.25, 0.35, 0.7, 8]} />;
      case 'bishop':
        return <coneGeometry args={[0.25, 0.6, 8]} />;
      case 'knight':
        return <boxGeometry args={[0.4, 0.6, 0.3]} />;
      case 'rook':
        return <cylinderGeometry args={[0.3, 0.3, 0.5, 4]} />;
      case 'pawn':
        return <sphereGeometry args={[0.2, 8, 6]} />;
      default:
        return <boxGeometry args={[0.3, 0.3, 0.3]} />;
    }
  };
  
  const baseColor = piece.color === 'white' ? '#f8f8f8' : '#2a2a2a';
  const accentColor = character.color;
  
  return (
    <group position={position} onClick={onClick}>
      {/* Base piece */}
      <mesh ref={meshRef} castShadow receiveShadow>
        {getGeometry()}
        <meshStandardMaterial 
          color={baseColor}
          metalness={0.1}
          roughness={0.3}
        />
      </mesh>
      
      {/* Character accent */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <sphereGeometry args={[0.15, 8, 6]} />
        <meshStandardMaterial 
          color={accentColor}
          metalness={0.2}
          roughness={0.4}
        />
      </mesh>
      
      {/* Selection highlight */}
      {isSelected && (
        <mesh position={[0, -0.01, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.02, 16]} />
          <meshStandardMaterial 
            color="#FFCC02"
            emissive="#FFCC02"
            emissiveIntensity={0.3}
            transparent
            opacity={0.7}
          />
        </mesh>
      )}
    </group>
  );
}
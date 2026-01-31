
import React from 'react';
import Svg, { Path, Defs, LinearGradient, Stop, Ellipse } from 'react-native-svg';
import { PieceType, Color } from '@/data/types';

interface PieceIcon3DProps {
  type: PieceType;
  color: Color;
  size: number;
}

/**
 * 3D-styled chess piece icons using react-native-svg
 * Uses gradient fills and subtle shadows for a 3D appearance
 * Consistent across iOS and Android
 */
export function PieceIcon3D({ type, color, size }: PieceIcon3DProps) {
  const isWhite = color === 'w';
  const iconSize = size * 0.75;
  const viewBox = '0 0 100 100';

  const gradientId = `gradient-${type}-${color}`;
  const shadowId = `shadow-${type}-${color}`;

  const lightColor = isWhite ? '#FFFFFF' : '#2C2C2C';
  const darkColor = isWhite ? '#D0D0D0' : '#000000';
  const shadowColor = isWhite ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.4)';

  const renderPiece = () => {
    switch (type) {
      case 'K': // King
        return (
          <>
            <Ellipse cx="50" cy="92" rx="18" ry="3" fill={shadowColor} />
            <Path
              d="M 48 15 L 48 8 M 45 11.5 L 51 11.5"
              stroke={darkColor}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <Path
              d="M 50 20 C 50 20 54 16 54 12 C 54 12 53 10 50 10 C 47 10 46 12 46 12 C 46 16 50 20 50 20 Z"
              fill={`url(#${gradientId})`}
              stroke={darkColor}
              strokeWidth="2"
            />
            <Path
              d="M 35 85 L 65 85 L 65 75 C 65 75 70 65 65 55 C 60 45 50 50 50 60 C 50 50 40 45 35 55 C 30 65 35 75 35 75 Z"
              fill={`url(#${gradientId})`}
              stroke={darkColor}
              strokeWidth="2"
            />
          </>
        );

      case 'Q': // Queen
        return (
          <>
            <Ellipse cx="50" cy="92" rx="18" ry="3" fill={shadowColor} />
            <Path
              d="M 30 70 C 35 68 45 68 50 68 C 55 68 65 68 70 70 L 72 50 L 65 60 L 62 45 L 55 58 L 50 40 L 45 58 L 38 45 L 35 60 L 28 50 Z"
              fill={`url(#${gradientId})`}
              stroke={darkColor}
              strokeWidth="2"
            />
            <Path
              d="M 30 70 C 30 72 31 73 32 75 C 33 77 33 78 32 80 C 31 82 32 84 32 84 L 68 84 C 68 84 69 82 68 80 C 67 78 67 77 68 75 C 69 73 70 72 70 70 Z"
              fill={`url(#${gradientId})`}
              stroke={darkColor}
              strokeWidth="2"
            />
          </>
        );

      case 'R': // Rook
        return (
          <>
            <Ellipse cx="50" cy="92" rx="16" ry="3" fill={shadowColor} />
            <Path
              d="M 32 85 L 68 85 L 68 80 L 32 80 Z"
              fill={`url(#${gradientId})`}
              stroke={darkColor}
              strokeWidth="2"
            />
            <Path
              d="M 35 80 L 35 70 L 65 70 L 65 80"
              fill={`url(#${gradientId})`}
              stroke={darkColor}
              strokeWidth="2"
            />
            <Path
              d="M 33 35 L 33 25 L 40 25 L 40 30 L 47 30 L 47 25 L 53 25 L 53 30 L 60 30 L 60 25 L 67 25 L 67 35"
              fill={`url(#${gradientId})`}
              stroke={darkColor}
              strokeWidth="2"
            />
            <Path
              d="M 67 35 L 65 40 L 35 40 L 33 35"
              fill={`url(#${gradientId})`}
              stroke={darkColor}
              strokeWidth="2"
            />
            <Path
              d="M 65 40 L 65 65 L 35 65 L 35 40"
              fill={`url(#${gradientId})`}
              stroke={darkColor}
              strokeWidth="2"
            />
            <Path
              d="M 65 65 L 67 70 L 33 70 L 35 65"
              fill={`url(#${gradientId})`}
              stroke={darkColor}
              strokeWidth="2"
            />
          </>
        );

      case 'B': // Bishop
        return (
          <>
            <Ellipse cx="50" cy="92" rx="16" ry="3" fill={shadowColor} />
            <Path
              d="M 32 80 C 35 79 45 80 50 78 C 55 80 65 79 68 80 C 68 80 70 81 71 83 C 70 84 69 84 68 84 C 65 83 55 84 50 83 C 45 84 35 83 32 84 C 31 84 30 84 29 83 C 30 81 32 80 32 80 Z"
              fill={`url(#${gradientId})`}
              stroke={darkColor}
              strokeWidth="2"
            />
            <Path
              d="M 38 70 C 40 72 60 72 62 70 C 63 68 62 67 62 67 C 62 64 60 62 60 62 C 65 60 66 50 50 45 C 34 50 35 60 40 62 C 40 62 38 64 38 67 C 38 67 37 68 38 70 Z"
              fill={`url(#${gradientId})`}
              stroke={darkColor}
              strokeWidth="2"
            />
            <Ellipse
              cx="50"
              cy="20"
              rx="4"
              ry="4"
              fill={`url(#${gradientId})`}
              stroke={darkColor}
              strokeWidth="2"
            />
          </>
        );

      case 'N': // Knight
        return (
          <>
            <Ellipse cx="50" cy="92" rx="16" ry="3" fill={shadowColor} />
            <Path
              d="M 45 25 C 55 26 60 32 60 80 L 35 80 C 35 70 45 72 44 50"
              fill={`url(#${gradientId})`}
              stroke={darkColor}
              strokeWidth="2"
            />
            <Path
              d="M 46 50 C 46 53 40 57 38 59 C 35 61 35 63 33 63 C 32 62 34 60 33 60 C 32 60 33 61 32 62 C 31 62 28 63 28 58 C 28 56 34 46 34 46 C 34 46 36 44 36 42 C 35 41 36 40 36 39 C 37 38 39 42 39 42 L 41 42 C 41 42 42 40 44 39 C 45 39 45 42 45 42"
              fill={`url(#${gradientId})`}
              stroke={darkColor}
              strokeWidth="2"
            />
            <Ellipse
              cx="31"
              cy="55"
              rx="1.5"
              ry="1.5"
              fill={isWhite ? darkColor : lightColor}
            />
          </>
        );

      case 'P': // Pawn
        return (
          <>
            <Ellipse cx="50" cy="92" rx="14" ry="3" fill={shadowColor} />
            <Ellipse
              cx="50"
              cy="30"
              rx="10"
              ry="10"
              fill={`url(#${gradientId})`}
              stroke={darkColor}
              strokeWidth="2"
            />
            <Path
              d="M 42 40 C 40 42 38 45 38 50 C 38 55 42 58 50 58 C 58 58 62 55 62 50 C 62 45 60 42 58 40"
              fill={`url(#${gradientId})`}
              stroke={darkColor}
              strokeWidth="2"
            />
            <Path
              d="M 35 80 C 35 75 40 70 50 70 C 60 70 65 75 65 80 Z"
              fill={`url(#${gradientId})`}
              stroke={darkColor}
              strokeWidth="2"
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Svg width={iconSize} height={iconSize} viewBox={viewBox}>
      <Defs>
        <LinearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={lightColor} stopOpacity="1" />
          <Stop offset="100%" stopColor={darkColor} stopOpacity="1" />
        </LinearGradient>
      </Defs>
      {renderPiece()}
    </Svg>
  );
}

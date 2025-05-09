import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '@/constants/colors';
import Button from '@/components/ui/Button';

type Position = [number, number]; // [x, y]
type Tetromino = Position[];
type GameState = 'PLAYING' | 'GAME_OVER';
type Rotation = 0 | 1 | 2 | 3;

// Define tetromino shapes (I, J, L, O, S, T, Z)
const SHAPES: Tetromino[] = [
  [[0, 0], [1, 0], [2, 0], [3, 0]], // I
  [[0, 0], [0, 1], [1, 1], [2, 1]], // J
  [[0, 1], [1, 1], [2, 1], [2, 0]], // L
  [[0, 0], [0, 1], [1, 0], [1, 1]], // O
  [[0, 1], [1, 1], [1, 0], [2, 0]], // S
  [[0, 1], [1, 0], [1, 1], [2, 1]], // T
  [[0, 0], [1, 0], [1, 1], [2, 1]], // Z
];

interface TetrisGameProps {
  onGameEnd: (result: 'win' | 'loss', score: number) => void;
}

const GRID_WIDTH = 10;
const GRID_HEIGHT = 20;
const GRID_SIZE = 20;
const INITIAL_SPEED = 1000; // milliseconds per drop

const TetrisGame: React.FC<TetrisGameProps> = ({ onGameEnd }) => {
  const [grid, setGrid] = useState<(0 | 1 | 2)[][]>(
    Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill(0))
  );
  const [currentPiece, setCurrentPiece] = useState<Tetromino>(SHAPES[0]);
  const [piecePosition, setPiecePosition] = useState<Position>([3, 0]); // Top-middle start
  const [rotation, setRotation] = useState<Rotation>(0);
  const [gameState, setGameState] = useState<GameState>('PLAYING');
  const [score, setScore] = useState(0);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const speedRef = useRef(INITIAL_SPEED);

  // Rotate a tetromino
  const rotatePiece = (piece: Tetromino, times: Rotation): Tetromino => {
    let rotated = piece;
    for (let i = 0; i < times; i++) {
      rotated = rotated.map(([x, y]) => [-y, x]);
      // Normalize to top-left corner after rotation
      const minX = Math.min(...rotated.map(p => p[0]));
      const minY = Math.min(...rotated.map(p => p[1]));
      rotated = rotated.map(([x, y]) => [x - minX, y - minY]);
    }
    return rotated;
  };

  // Check if a position is valid for the current piece
  const isValidPosition = (piece: Tetromino, pos: Position, currentGrid: (0 | 1 | 2)[][]): boolean => {
    return piece.every(([dx, dy]) => {
      const x = pos[0] + dx;
      const y = pos[1] + dy;
      return x >= 0 && x < GRID_WIDTH && y < GRID_HEIGHT && (y < 0 || currentGrid[y][x] === 0);
    });
  };

  // Merge piece into grid when it lands
  const mergePiece = () => {
    const newGrid = grid.map(row => [...row]);
    currentPiece.forEach(([dx, dy]) => {
      const x = piecePosition[0] + dx;
      const y = piecePosition[1] + dy;
      if (y >= 0 && y < GRID_HEIGHT) {
        newGrid[y][x] = 2; // Landed piece
      }
    });
    setGrid(newGrid);
    setCurrentPiece(SHAPES[Math.floor(Math.random() * SHAPES.length)]);
    setPiecePosition([Math.floor(GRID_WIDTH / 2) - 1, 0]);
    setRotation(0);
    checkLines(newGrid);
    // Check if new piece immediately collides (game over)
    if (!isValidPosition(currentPiece, [Math.floor(GRID_WIDTH / 2) - 1, 0], newGrid)) {
      setGameState('GAME_OVER');
      onGameEnd('loss', score);
    }
  };

  // Check for completed lines and update score
  const checkLines = (currentGrid: (0 | 1 | 2)[][]) => {
    let linesCleared = 0;
    const newGrid = currentGrid.filter(row => row.some(cell => cell === 0));
    linesCleared = GRID_HEIGHT - newGrid.length;
    if (linesCleared > 0) {
      setScore(prev => {
        const newScore = prev + (linesCleared * 100);
        speedRef.current = Math.max(300, INITIAL_SPEED - Math.floor(newScore / 500) * 50);
        return newScore;
      });
      setGrid([
        ...Array.from({ length: linesCleared }, () => Array(GRID_WIDTH).fill(0)),
        ...newGrid
      ]);
    }
  };

  // Game loop for automatic drop
  useEffect(() => {
    if (gameState !== 'PLAYING') return;
    gameLoopRef.current = setInterval(() => {
      movePiece(0, 1);
    }, speedRef.current);
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, [gameState]);

  // Move piece (dx, dy) or rotate
  const movePiece = (dx: number, dy: number) => {
    if (gameState !== 'PLAYING') return;
    const newPos: Position = [piecePosition[0] + dx, piecePosition[1] + dy];
    if (isValidPosition(currentPiece, newPos, grid)) {
      setPiecePosition(newPos);
    } else if (dy > 0) {
      // If moving down is blocked, merge the piece
      mergePiece();
    }
  };

  const handleRotate = () => {
    if (gameState !== 'PLAYING') return;
    const newRotation = ((rotation + 1) % 4) as Rotation;
    const rotatedPiece = rotatePiece(currentPiece, 1);
    if (isValidPosition(rotatedPiece, piecePosition, grid)) {
      setRotation(newRotation);
      setCurrentPiece(rotatedPiece);
    }
  };

  const resetGame = () => {
    setGrid(Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill(0)));
    setCurrentPiece(SHAPES[Math.floor(Math.random() * SHAPES.length)]);
    setPiecePosition([Math.floor(GRID_WIDTH / 2) - 1, 0]);
    setRotation(0);
    setGameState('PLAYING');
    setScore(0);
    speedRef.current = INITIAL_SPEED;
  };

  // Render the game grid including the current piece
  const renderGrid = () => {
    const displayGrid = grid.map(row => [...row]);
    if (gameState === 'PLAYING') {
      currentPiece.forEach(([dx, dy]) => {
        const x = piecePosition[0] + dx;
        const y = piecePosition[1] + dy;
        if (y >= 0 && y < GRID_HEIGHT && x >= 0 && x < GRID_WIDTH) {
          displayGrid[y][x] = 1; // Current piece
        }
      });
    }
    return displayGrid.map((row, y) =>
      row.map((cell, x) => (
        <View
          key={`${x}-${y}`}
          style={[
            styles.cell,
            cell === 1 && styles.currentPieceCell,
            cell === 2 && styles.landedPieceCell,
          ]}
        />
      ))
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tetris</Text>
      <Text style={styles.score}>Score: {score}</Text>
      {gameState === 'GAME_OVER' && <Text style={styles.gameOver}>Game Over!</Text>}
      
      <View style={styles.grid}>
        {renderGrid()}
      </View>
      
      {gameState === 'PLAYING' && (
        <View style={styles.controls}>
          <Button
            title="Left"
            onPress={() => movePiece(-1, 0)}
            style={styles.controlButton}
          />
          <Button
            title="Right"
            onPress={() => movePiece(1, 0)}
            style={styles.controlButton}
          />
          <Button
            title="Down"
            onPress={() => movePiece(0, 1)}
            style={styles.controlButton}
          />
          <Button
            title="Rotate"
            onPress={handleRotate}
            style={styles.controlButton}
          />
        </View>
      )}
      
      {gameState === 'GAME_OVER' && (
        <Button
          title="Play Again"
          onPress={resetGame}
          style={styles.playAgainButton}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
  },
  score: {
    fontSize: 18,
    color: colors.text,
    marginBottom: 10,
  },
  gameOver: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.error,
    marginBottom: 20,
  },
  grid: {
    width: GRID_WIDTH * GRID_SIZE,
    height: GRID_HEIGHT * GRID_SIZE,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.primaryLight,
    borderRadius: 5,
  },
  cell: {
    width: GRID_SIZE,
    height: GRID_SIZE,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  currentPieceCell: {
    backgroundColor: colors.primary,
  },
  landedPieceCell: {
    backgroundColor: colors.secondary,
  },
  controls: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },
  controlButton: {
    width: 80,
    margin: 5,
    paddingVertical: 8,
  },
  playAgainButton: {
    marginTop: 20,
    width: 200,
  },
});

export default TetrisGame;
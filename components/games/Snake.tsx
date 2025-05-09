import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, PanResponder } from 'react-native';
import colors from '@/constants/colors';
import Button from '@/components/ui/Button';

type Position = [number, number]; // [x, y]
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type GameState = 'PLAYING' | 'GAME_OVER';

interface SnakeGameProps {
  onGameEnd: (result: 'win' | 'loss', score: number) => void;
}

const GRID_SIZE = 20;
const GRID_WIDTH = 15;
const GRID_HEIGHT = 20;
const INITIAL_SNAKE: Position[] = [[7, 10], [7, 11], [7, 12]];
const INITIAL_DIRECTION = 'UP';
const INITIAL_SPEED = 150; // milliseconds per move

const SnakeGame: React.FC<SnakeGameProps> = ({ onGameEnd }) => {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>(generateFood(INITIAL_SNAKE));
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [gameState, setGameState] = useState<GameState>('PLAYING');
  const [score, setScore] = useState(0);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const speedRef = useRef(INITIAL_SPEED);

  // Generate random food position not on snake
  function generateFood(snakeBody: Position[]): Position {
    let newFood: Position;
    do {
      newFood = [
        Math.floor(Math.random() * GRID_WIDTH),
        Math.floor(Math.random() * GRID_HEIGHT)
      ];
    } while (snakeBody.some(segment => segment[0] === newFood[0] && segment[1] === newFood[1]));
    return newFood;
  }

  // Game loop
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    gameLoopRef.current = setInterval(() => {
      moveSnake();
    }, speedRef.current);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, [gameState]);

  // Handle swipe gestures for direction control
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      const { dx, dy } = gestureState;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 30 && direction !== 'LEFT') setDirection('RIGHT');
        else if (dx < -30 && direction !== 'RIGHT') setDirection('LEFT');
      } else {
        if (dy > 30 && direction !== 'UP') setDirection('DOWN');
        else if (dy < -30 && direction !== 'DOWN') setDirection('UP');
      }
    },
  });

  const moveSnake = () => {
    setSnake(prevSnake => {
      const head = [...prevSnake[0]] as Position;
      
      // Move head based on direction
      switch (direction) {
        case 'UP': head[1] -= 1; break;
        case 'DOWN': head[1] += 1; break;
        case 'LEFT': head[0] -= 1; break;
        case 'RIGHT': head[0] += 1; break;
      }
      
      // Check for collision with walls
      if (head[0] < 0 || head[0] >= GRID_WIDTH || head[1] < 0 || head[1] >= GRID_HEIGHT) {
        setGameState('GAME_OVER');
        onGameEnd('loss', score);
        return prevSnake;
      }
      
      // Check for collision with self (skip the tail as it moves)
      if (prevSnake.slice(0, -1).some(segment => segment[0] === head[0] && segment[1] === head[1])) {
        setGameState('GAME_OVER');
        onGameEnd('loss', score);
        return prevSnake;
      }
      
      const newSnake = [head, ...prevSnake.slice(0, -1)];
      
      // Check if food eaten
      if (head[0] === food[0] && head[1] === food[1]) {
        setScore(prev => {
          const newScore = prev + 10;
          // Increase speed slightly with each food (cap at 60ms)
          speedRef.current = Math.max(60, INITIAL_SPEED - Math.floor(newScore / 50) * 10);
          return newScore;
        });
        setFood(generateFood(newSnake));
        return [head, ...prevSnake]; // Grow snake
      }
      
      return newSnake;
    });
  };

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setGameState('PLAYING');
    setScore(0);
    speedRef.current = INITIAL_SPEED;
  };

  const renderGrid = () => {
    const grid = [];
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        const isSnake = snake.some(segment => segment[0] === x && segment[1] === y);
        const isFood = food[0] === x && food[1] === y;
        grid.push(
          <View
            key={`${x}-${y}`}
            style={[
              styles.cell,
              isSnake && styles.snakeCell,
              isFood && styles.foodCell,
            ]}
          />
        );
      }
    }
    return grid;
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Text style={styles.title}>Snake</Text>
      <Text style={styles.score}>Score: {score}</Text>
      {gameState === 'GAME_OVER' && <Text style={styles.gameOver}>Game Over!</Text>}
      
      <View style={styles.grid}>
        {renderGrid()}
      </View>
      
      {gameState === 'GAME_OVER' && (
        <Button
          title="Play Again"
          onPress={resetGame}
          style={styles.playAgainButton}
        />
      )}
      
      {gameState === 'PLAYING' && (
        <View style={styles.controls}>
          <Button
            title="Up"
            onPress={() => direction !== 'DOWN' && setDirection('UP')}
            style={styles.controlButton}
          />
          <View style={styles.horizontalControls}>
            <Button
              title="Left"
              onPress={() => direction !== 'RIGHT' && setDirection('LEFT')}
              style={styles.controlButton}
            />
            <Button
              title="Right"
              onPress={() => direction !== 'LEFT' && setDirection('RIGHT')}
              style={styles.controlButton}
            />
          </View>
          <Button
            title="Down"
            onPress={() => direction !== 'UP' && setDirection('DOWN')}
            style={styles.controlButton}
          />
        </View>
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
  snakeCell: {
    backgroundColor: colors.primary,
  },
  foodCell: {
    backgroundColor: colors.secondary,
    borderRadius: GRID_SIZE / 2,
    margin: 2,
    width: GRID_SIZE - 4,
    height: GRID_SIZE - 4,
  },
  playAgainButton: {
    marginTop: 20,
    width: 200,
  },
  controls: {
    marginTop: 20,
    alignItems: 'center',
  },
  horizontalControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    marginVertical: 10,
  },
  controlButton: {
    width: 80,
    paddingVertical: 8,
  },
});

export default SnakeGame;
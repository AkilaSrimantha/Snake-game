import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
  Dimensions,
  Pressable,
} from 'react-native';

const CELL_SIZE = 20;
const GRID_SIZE = 15;
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const getRandomPosition = () => ({
  x: Math.floor(Math.random() * GRID_SIZE),
  y: Math.floor(Math.random() * GRID_SIZE),
});

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type GameState = 'MENU' | 'PLAYING' | 'GAME_OVER';

export default function App() {
  const [snake, setSnake] = useState([{ x: 5, y: 5 }]);
  const [food, setFood] = useState(getRandomPosition());
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<GameState>('MENU');
  const moveInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (gameState === 'PLAYING') {
      moveInterval.current = setInterval(moveSnake, 150);
    }

    return () => {
      if (moveInterval.current) clearInterval(moveInterval.current);
    };
  }, [snake, direction, gameState]);

  const moveSnake = () => {
    const head = { ...snake[0] };

    switch (direction) {
      case 'UP': head.y -= 1; break;
      case 'DOWN': head.y += 1; break;
      case 'LEFT': head.x -= 1; break;
      case 'RIGHT': head.x += 1; break;
    }

    if (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE ||
      snake.some(s => s.x === head.x && s.y === head.y)
    ) {
      setGameState('GAME_OVER');
      return;
    }

    const newSnake = [head, ...snake];

    if (head.x === food.x && head.y === food.y) {
      setFood(getRandomPosition());
      setScore(score + 1);
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  const changeDirection = (newDirection: Direction) => {
    const opposite = {
      UP: 'DOWN',
      DOWN: 'UP',
      LEFT: 'RIGHT',
      RIGHT: 'LEFT',
    } as const;

    if (newDirection !== opposite[direction]) {
      setDirection(newDirection);
    }
  };

  const startGame = () => {
    setSnake([{ x: 5, y: 5 }]);
    setFood(getRandomPosition());
    setDirection('RIGHT');
    setScore(0);
    setGameState('PLAYING');
  };

  return (
    <TouchableWithoutFeedback
      onPress={(e) => {
        if (gameState !== 'PLAYING') return;

        const x = e.nativeEvent.locationX;
        const y = e.nativeEvent.locationY;

        if (Math.abs(x - SCREEN_WIDTH / 2) > Math.abs(y - SCREEN_HEIGHT / 2)) {
          changeDirection(x > SCREEN_WIDTH / 2 ? 'RIGHT' : 'LEFT');
        } else {
          changeDirection(y > SCREEN_HEIGHT / 2 ? 'DOWN' : 'UP');
        }
      }}
    >
      <View style={styles.container}>
        {/* Grid */}
        <View style={styles.grid}>
          {snake.map((segment, index) => (
            <View
              key={index}
              style={[
                styles.snakeSegment,
                {
                  left: segment.x * CELL_SIZE,
                  top: segment.y * CELL_SIZE,
                  backgroundColor: index === 0 ? 'red' : '#00FF00',
                },
              ]}
            />
          ))}
          <View
            style={[
              styles.food,
              {
                left: food.x * CELL_SIZE,
                top: food.y * CELL_SIZE,
              },
            ]}
          />
        </View>

        {/* Score */}
        {gameState === 'PLAYING' && (
          <View style={styles.scoreBox}>
            <Text style={styles.scoreText}>Score: {score}</Text>
          </View>
        )}

        {/* Menu / Game Over */}
        {gameState !== 'PLAYING' && (
          <View style={styles.overlay}>
            <Text style={styles.title}>
              {gameState === 'MENU' ? 'Snake Game' : 'Game Over'}
            </Text>
            {gameState === 'GAME_OVER' && (
              <Text style={styles.finalScore}>Final Score: {score}</Text>
            )}
            <Pressable onPress={startGame} style={styles.startButton}>
              <Text style={styles.startText}>
                {gameState === 'MENU' ? 'Start Game' : 'Play Again'}
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  grid: {
    position: 'absolute',
    top: 200,
    left: (SCREEN_WIDTH - GRID_SIZE * CELL_SIZE) / 2,
    width: GRID_SIZE * CELL_SIZE,
    height: GRID_SIZE * CELL_SIZE,
    backgroundColor: '#111',
    borderColor: '#444',
    borderWidth: 2,
  },
  snakeSegment: {
    position: 'absolute',
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 4,
  },
  food: {
    position: 'absolute',
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: 'yellow',
    borderRadius: 10,
  },
  scoreBox: {
    position: 'absolute',
    top: 40,
    alignSelf: 'center',
    backgroundColor: '#222',
    padding: 10,
    borderRadius: 10,
  },
  scoreText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  overlay: {
    position: 'absolute',
    top: SCREEN_HEIGHT / 3,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  finalScore: {
    color: '#ccc',
    fontSize: 24,
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#00AAFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  startText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

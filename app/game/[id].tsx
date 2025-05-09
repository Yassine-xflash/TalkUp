import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import colors from '@/constants/colors';
import { Brain, Users, Grid, Worm, Boxes } from 'lucide-react-native';
import TicTacToe from '@/components/games/TicTacToe';
import SnakeGame from '@/components/games/Snake';
import TetrisGame from '@/components/games/Tetris';
import { useGamesStore } from '@/store/games-store';

type GameModeType = 'Solo' | 'Multiplayer' | 'Versus';

interface GameData {
  name: string;
  description: string;
  modes: GameModeType[];
  rules: string[];
  icon: React.ComponentType<{ size: number; color: string }>;
}

interface GameDataMap {
  [key: string]: GameData;
}

// Mock game data - in real app, this would come from a backend
const gameData: GameDataMap = {
  quiz: {
    name: 'Academic Quiz',
    description: 'Test your knowledge in various subjects',
    modes: ['Solo', 'Multiplayer'],
    icon: Brain,
    rules: [
      'Answer questions within time limit',
      'Score points for correct answers',
      'Compete with friends in real-time',
    ],
  },
  memory: {
    name: 'Memory Match',
    description: 'Match pairs of academic concepts',
    modes: ['Solo', 'Versus'],
    icon: Brain,
    rules: [
      'Find matching pairs',
      'Complete in minimum moves',
      'Race against time',
    ],
  },
  word: {
    name: 'Word Chain',
    description: 'Build words from previous word endings',
    modes: ['Multiplayer'],
    icon: Brain,
    rules: [
      'Continue fromlast letter',
      'No word repetition',
      'Academic terms only',
    ],
  },
  math: {
    name: 'Speed Math',
    description: 'Solve math problems against time',
    modes: ['Solo'],
    icon: Brain,
    rules: [
      'Solve equations quickly',
      'Progressive difficulty',
      'Beat your high score',
    ],
  },
  tictactoe: {
    name: 'Tic Tac Toe',
    description: 'Classic game of Xs and Os',
    modes: ['Solo', 'Versus'],
    icon: Grid,
    rules: [
      'Take turns placing X or O',
      'First to get 3 in a row wins',
      'Block your opponent',
    ],
  },
  snake: {
    name: 'Snake',
    description: 'Guide the snake to eat food and grow',
    modes: ['Solo'],
    icon: Worm,
    rules: [
      'Control the snake to eat food',
      'Avoid hitting walls or yourself',
      'Grow longer with each food',
    ],
  },
  tetris: {
    name: 'Tetris',
    description: 'Stack falling blocks to clear lines',
    modes: ['Solo'],
    icon: Boxes,
    rules: [
      'Rotate and place falling blocks',
      'Complete lines to clear them',
      'Game over if stack reaches top',
    ],
  },
};

export default function GameScreen() {
  const { id } = useLocalSearchParams();
  const [selectedMode, setSelectedMode] = useState<GameModeType | ''>('');
  const [gameStarted, setGameStarted] = useState(false);
  const game = gameData[id as keyof typeof gameData];
  const { addGameToHistory } = useGamesStore();

  const handleGameEnd = (result: 'win' | 'loss' | 'draw', score: number, opponent?: string) => {
    addGameToHistory({
      id: Date.now().toString(),
      gameId: id as string,
      gameName: game.name,
      result,
      score,
      opponent,
      date: Date.now(),
    });
    setGameStarted(false);
  };

  const renderGame = () => {
    if (!gameStarted || !selectedMode) return null;
    
    switch (id) {
      case 'tictactoe':
        return <TicTacToe mode={selectedMode} onGameEnd={handleGameEnd} />;
      case 'snake':
        return <SnakeGame onGameEnd={handleGameEnd} />;
      case 'tetris':
        return <TetrisGame onGameEnd={handleGameEnd} />;
      default:
        return (
          <Text style={styles.comingSoon}>
            This game is coming soon. Stay tuned!
          </Text>
        );
    }
  };

  if (!game) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Game not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: game.name,
        }}
      />

      <Card gradient gradientColors={colors.primaryGradient} style={styles.header}>
        <View style={styles.headerContent}>
          <game.icon size={40} color={colors.card} />
          <Text style={styles.title}>{game.name}</Text>
          <Text style={styles.description}>{game.description}</Text>
        </View>
      </Card>

      {!gameStarted ? (
        <View style={styles.content}>
          {/* Game Modes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Mode</Text>
            <View style={styles.modes}>
              {game.modes.map((mode) => (
                <Button
                  key={mode}
                  title={mode}
                  variant={selectedMode === mode ? 'primary' : 'outline'}
                  style={styles.modeButton}
                  icon={mode === 'Solo' ? <Brain size={20} /> : <Users size={20} />}
                  onPress={() => setSelectedMode(mode)}
                />
              ))}
            </View>
          </View>

          {/* Rules */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rules</Text>
            <Card style={styles.rulesCard}>
              {game.rules.map((rule, index: number) => (
                <View key={index} style={styles.ruleItem}>
                  <Text style={styles.ruleNumber}>{index + 1}</Text>
                  <Text style={styles.ruleText}>{rule}</Text>
                </View>
              ))}
            </Card>
          </View>

          {/* Start Game Button */}
          <Button
            title="Start Game"
            gradient
            style={styles.startButton}
            disabled={!selectedMode}
            onPress={() => setGameStarted(true)}
          />
        </View>
      ) : (
        <View style={styles.gameContainer}>
          {renderGame()}
          <Button
            title="End Game"
            variant="outline"
            style={styles.endButton}
            onPress={() => setGameStarted(false)}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  error: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginTop: 20,
  },
  header: {
    margin: 16,
    marginBottom: 0,
  },
  headerContent: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.card,
    marginTop: 12,
  },
  description: {
    fontSize: 16,
    color: colors.card,
    textAlign: 'center',
    marginTop: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  modes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modeButton: {
    minWidth: 120,
  },
  rulesCard: {
    padding: 16,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ruleNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary + '20',
    color: colors.primary,
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
    fontWeight: '600',
  },
  ruleText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  startButton: {
    marginTop: 'auto',
  },
  gameContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  comingSoon: {
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 20,
  },
  endButton: {
    marginTop: 20,
    width: '100%',
  },
});
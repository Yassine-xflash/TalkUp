import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '@/constants/colors';
import Button from '@/components/ui/Button';

type Player = 'X' | 'O';
type GameResult = 'win' | 'loss' | 'draw';
type Board = (Player | null)[];
type GameMode = 'Solo' | 'Versus';

interface TicTacToeProps {
  mode: GameMode;
  onGameEnd: (result: GameResult, score: number, opponent?: string) => void;
}

const TicTacToe: React.FC<TicTacToeProps> = ({ mode, onGameEnd }) => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | 'Draw'>(null);
  const [isAITurn, setIsAITurn] = useState(false);

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  const checkWinner = (currentBoard: Board): Player | 'Draw' | null => {
    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return currentBoard[a];
      }
    }
    return currentBoard.every(cell => cell !== null) ? 'Draw' : null;
  };

  const handleCellPress = (index: number) => {
    if (board[index] || winner || isAITurn) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      if (gameWinner === 'Draw') {
        onGameEnd('draw', 50);
      } else if (mode === 'Solo') {
        onGameEnd(gameWinner === 'X' ? 'win' : 'loss', gameWinner === 'X' ? 100 : 0);
      } else {
        onGameEnd('win', 100, "Opponent");
      }
      return;
    }

    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    if (mode === 'Solo' && currentPlayer === 'X') {
      setIsAITurn(true);
      setTimeout(makeAIMove, 500, newBoard);
    }
  };

  const makeAIMove = (currentBoard: Board) => {
    const availableMoves = currentBoard.map((cell, index) => cell === null ? index : null).filter(index => index !== null);
    if (availableMoves.length > 0) {
      const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
      const newBoard = [...currentBoard];
      newBoard[randomMove] = 'O';
      setBoard(newBoard);

      const gameWinner = checkWinner(newBoard);
      if (gameWinner) {
        setWinner(gameWinner);
        if (gameWinner === 'Draw') {
          onGameEnd('draw', 50);
        } else {
          onGameEnd(gameWinner === 'X' ? 'win' : 'loss', gameWinner === 'X' ? 100 : 0);
        }
        setIsAITurn(false);
        return;
      }

      setCurrentPlayer('X');
    }
    setIsAITurn(false);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setIsAITurn(false);
  };

  useEffect(() => {
    if (mode === 'Solo' && currentPlayer === 'O' && !winner) {
      setIsAITurn(true);
      setTimeout(makeAIMove, 500, board);
    }
  }, [board, currentPlayer, mode, winner]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tic Tac Toe</Text>
      {!winner && <Text style={styles.status}>Current Player: {currentPlayer}</Text>}
      {winner && winner !== 'Draw' && <Text style={styles.status}>Winner: {winner}</Text>}
      {winner === 'Draw' && <Text style={styles.status}>Game Draw!</Text>}
      
      <View style={styles.board}>
        {board.map((cell, index) => (
          <TouchableOpacity
            key={index}
            style={styles.cell}
            onPress={() => handleCellPress(index)}
            disabled={!!cell || !!winner}
          >
            <Text style={styles.cellText}>{cell || ''}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {winner && (
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
    marginBottom: 20,
  },
  status: {
    fontSize: 18,
    color: colors.text,
    marginBottom: 20,
  },
  board: {
    width: 300,
    height: 300,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cell: {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primaryLight,
    borderRadius: 5,
    margin: 2,
  },
  cellText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primaryDark,
  },
  playAgainButton: {
    marginTop: 20,
    width: 200,
  },
});

export default TicTacToe;
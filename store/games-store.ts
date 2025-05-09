import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameStats, GameHistory, Achievement } from '@/types';

interface GamesState {
  stats: GameStats;
  achievements: Achievement[];
  history: GameHistory[];
  leaderboard: {
    id: string;
    name: string;
    avatar?: string;
    score: number;
    rank: number;
    games: number;
    winRate: string;
  }[];
  updateStats: (newStats: Partial<GameStats>) => void;
  addGameToHistory: (game: GameHistory) => void;
  unlockAchievement: (achievement: Achievement) => void;
  updateLeaderboard: () => Promise<void>;
}

export const useGamesStore = create<GamesState>()(
  persist(
    (set, get) => ({
      stats: {
        totalGames: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        score: 0,
        achievements: [],
        recentGames: [],
      },
      achievements: [],
      history: [],
      leaderboard: [],
      updateStats: (newStats) => {
        set((state) => ({
          stats: {
            ...state.stats,
            ...newStats,
          },
        }));
      },
      addGameToHistory: (game) => {
        set((state) => ({
          history: [game, ...state.history].slice(0, 50), // Keep last 50 games
          stats: {
            ...state.stats,
            totalGames: state.stats.totalGames + 1,
            wins: game.result === 'win' ? state.stats.wins + 1 : state.stats.wins,
            losses: game.result === 'loss' ? state.stats.losses + 1 : state.stats.losses,
            draws: game.result === 'draw' ? state.stats.draws + 1 : state.stats.draws,
            score: state.stats.score + game.score,
          },
        }));
      },
      unlockAchievement: (achievement) => {
        set((state) => ({
          achievements: [...state.achievements, achievement],
        }));
      },
      updateLeaderboard: async () => {
        // In a real app, this would fetch from an API
        // For now, we'll use mock data
        set({
          leaderboard: [
            {
              id: '1',
              name: 'Sarah Chen',
              avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
              score: 2840,
              rank: 1,
              games: 42,
              winRate: '76%',
            },
            {
              id: '2',
              name: 'Alex Kim',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
              score: 2720,
              rank: 2,
              games: 38,
              winRate: '71%',
            },
            {
              id: '3',
              name: 'Maria Garcia',
              avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
              score: 2650,
              rank: 3,
              games: 45,
              winRate: '69%',
            },
          ],
        });
      },
    }),
    {
      name: 'games-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
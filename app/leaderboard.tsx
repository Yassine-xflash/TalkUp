import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import colors from '@/constants/colors';
import { Trophy, Medal, Award } from 'lucide-react-native';

const leaderboardData = [
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
  // Add more users here
];

interface RankIconProps {
  rank: number;
}

const RankIcon: React.FC<RankIconProps> = ({ rank }) => {
  switch (rank) {
    case 1:
      return <Trophy size={24} color="#FFD700" />;
    case 2:
      return <Medal size={24} color="#C0C0C0" />;
    case 3:
      return <Award size={24} color="#CD7F32" />;
    default:
      return <Text style={styles.rankNumber}>{rank}</Text>;
  }
};

export default function LeaderboardScreen() {
  return (
    <ScrollView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Leaderboard',
        }}
      />

      {/* Top Players */}
      <View style={styles.topPlayers}>
        {leaderboardData.slice(0, 3).map((player, index) => (
          <Card
            key={player.id}
            style={[
              styles.topPlayerCard,
              index === 1 && styles.topPlayerCardFirst,
            ]}
          >
            <RankIcon rank={player.rank} />
            <Avatar
              source={player.avatar}
              name={player.name}
              size={index === 1 ? 80 : 60}
              style={styles.avatar}
            />
            <Text style={styles.playerName}>{player.name}</Text>
            <Text style={styles.score}>{player.score} pts</Text>
          </Card>
        ))}
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        {leaderboardData.map((player) => (
          <Card key={player.id} style={styles.statsCard}>
            <View style={styles.statsHeader}>
              <View style={styles.playerInfo}>
                <Text style={styles.rank}>#{player.rank}</Text>
                <Avatar
                  source={player.avatar}
                  name={player.name}
                  size={40}
                  style={styles.statsAvatar}
                />
                <View>
                  <Text style={styles.statsName}>{player.name}</Text>
                  <Text style={styles.statsScore}>{player.score} points</Text>
                </View>
              </View>
            </View>
            <View style={styles.statsDetails}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Games</Text>
                <Text style={styles.statValue}>{player.games}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Win Rate</Text>
                <Text style={styles.statValue}>{player.winRate}</Text>
              </View>
            </View>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topPlayers: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    padding: 16,
    paddingTop: 32,
  },
  topPlayerCard: {
    alignItems: 'center',
    padding: 16,
    width: 100,
    marginHorizontal: 4,
  },
  topPlayerCardFirst: {
    width: 120,
    height: 180,
    marginTop: -20,
    backgroundColor: colors.primary + '10',
    borderColor: colors.primary,
    borderWidth: 2,
    zIndex: 1,
  },
  avatar: {
    marginVertical: 8,
  },
  playerName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  score: {
    fontSize: 12,
    color: colors.primary,
    marginTop: 4,
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  statsContainer: {
    padding: 16,
  },
  statsCard: {
    marginBottom: 12,
    padding: 16,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rank: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginRight: 12,
  },
  statsAvatar: {
    marginRight: 12,
  },
  statsName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  statsScore: {
    fontSize: 14,
    color: colors.primary,
  },
  statsDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});
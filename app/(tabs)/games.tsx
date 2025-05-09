import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, FlatList } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import colors from '@/constants/colors';
import { Gamepad2, Users, Brain, Trophy, Grid, Worm, Boxes } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const categories = [
  { id: 'all', name: 'All Games', icon: Gamepad2, color: colors.primary },
  { id: 'educational', name: 'Educational', icon: Brain, color: '#4CAF50' },
  { id: 'multiplayer', name: 'Multiplayer', icon: Users, color: '#2196F3' },
  { id: 'casual', name: 'Casual', icon: Grid, color: '#FF9800' },
];

const games = [
  {
    id: 'quiz',
    name: 'Academic Quiz',
    description: 'Test your knowledge in various subjects',
    icon: Brain,
    players: '1-4',
    category: 'Educational',
    image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    color: '#4CAF50',
  },
  {
    id: 'memory',
    name: 'Memory Match',
    description: 'Match pairs of academic concepts',
    icon: Brain,
    players: '1-2',
    category: 'Educational',
    image: 'https://images.unsplash.com/photo-1629752187687-3d3c7ea3a21b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    color: '#9C27B0',
  },
  {
    id: 'word',
    name: 'Word Chain',
    description: 'Build words from previous word endings',
    icon: Brain,
    players: '2-4',
    category: 'Language',
    image: 'https://images.unsplash.com/photo-1632507127134-2c2c5b9e8b4d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    color: '#2196F3',
  },
  {
    id: 'math',
    name: 'Speed Math',
    description: 'Solve math problems against time',
    icon: Brain,
    players: '1',
    category: 'Educational',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    color: '#F44336',
  },
  {
    id: 'tictactoe',
    name: 'Tic Tac Toe',
    description: 'Classic game of Xs and Os',
    icon: Grid,
    players: '1-2',
    category: 'Casual',
    image: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    color: '#FF9800',
  },
  {
    id: 'snake',
    name: 'Snake',
    description: 'Guide the snake to eat food and grow',
    icon: Worm,
    players: '1',
    category: 'Casual',
    image: 'https://images.unsplash.com/photo-1628483368492-432e678eb9d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    color: '#4CAF50',
  },
  {
    id: 'tetris',
    name: 'Tetris',
    description: 'Stack falling blocks to clear lines',
    icon: Boxes,
    players: '1',
    category: 'Casual',
    image: 'https://images.unsplash.com/photo-1642068131493-2a6f0c2a2f7a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    color: '#3F51B5',
  },
];

export default function GamesScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredGames = selectedCategory === 'all' 
    ? games 
    : games.filter(game => game.category.toLowerCase() === selectedCategory);

  const renderGameItem = ({ item }) => (
    <Pressable 
      style={styles.gameCard}
      onPress={() => router.push(`/game/${item.id}`)}
    >
      <Image 
        source={{ uri: item.image }}
        style={styles.gameImage}
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gameGradient}
      >
        <View style={styles.gameContent}>
          <View style={[styles.gameIconContainer, { backgroundColor: item.color }]}>
            <item.icon size={24} color="#FFFFFF" />
          </View>
          <Text style={styles.gameName}>{item.name}</Text>
          <Text style={styles.gameDescription} numberOfLines={2}>{item.description}</Text>
          <View style={styles.gameMeta}>
            <Text style={styles.players}>{item.players} Players</Text>
            <View style={[styles.categoryTag, { backgroundColor: item.color + '30' }]}>
              <Text style={[styles.categoryText, { color: item.color }]}>{item.category}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Games',
          headerRight: () => (
            <Button
              title="Leaderboard"
              onPress={() => router.push('/leaderboard')}
              variant="ghost"
              icon={<Trophy size={20} color={colors.primary} />}
            />
          ),
        }}
      />

      {/* Featured Game */}
      <FlatList
        data={filteredGames}
        renderItem={renderGameItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.gamesGrid}
        ListHeaderComponent={
          <>
            {/* Featured Game Banner */}
            <Pressable 
              style={styles.featuredCard}
              onPress={() => router.push('/game/quiz')}
            >
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' }}
                style={styles.featuredImage}
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.featuredGradient}
              >
                <View style={styles.featuredContent}>
                  <Text style={styles.featuredLabel}>FEATURED GAME</Text>
                  <Text style={styles.featuredTitle}>Academic Quiz Challenge</Text>
                  <Text style={styles.featuredDescription}>
                    Challenge your friends in our academic quiz game!
                  </Text>
                  <Button
                    title="Play Now"
                    onPress={() => router.push('/game/quiz')}
                    style={styles.playButton}
                    gradient
                  />
                </View>
              </LinearGradient>
            </Pressable>

            {/* Game Categories */}
            <View style={styles.categoriesContainer}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={styles.categories}
              >
                {categories.map(category => (
                  <Pressable
                    key={category.id}
                    style={[
                      styles.categoryButton,
                      selectedCategory === category.id && styles.categoryButtonActive
                    ]}
                    onPress={() => setSelectedCategory(category.id)}
                  >
                    <View style={[
                      styles.categoryIcon, 
                      { backgroundColor: category.color + '20' },
                      selectedCategory === category.id && { backgroundColor: category.color }
                    ]}>
                      <category.icon 
                        size={18} 
                        color={selectedCategory === category.id ? '#FFFFFF' : category.color} 
                      />
                    </View>
                    <Text style={[
                      styles.categoryButtonText,
                      selectedCategory === category.id && { color: category.color, fontWeight: '600' }
                    ]}>
                      {category.name}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            <Text style={styles.sectionTitle}>
              {selectedCategory === 'all' ? 'All Games' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Games`}
            </Text>
          </>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  featuredCard: {
    margin: 16,
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  featuredGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
  },
  featuredContent: {
    alignItems: 'flex-start',
  },
  featuredLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  featuredTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  featuredDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 16,
    opacity: 0.9,
  },
  playButton: {
    minWidth: 120,
  },
  categoriesContainer: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.card,
  },
  categories: {
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  categoryButtonActive: {
    borderColor: colors.primary,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  categoryButtonText: {
    fontSize: 14,
    color: colors.text,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 24,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  gamesGrid: {
    paddingBottom: 24,
  },
  gameCard: {
    flex: 1,
    margin: 8,
    height: 220,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  gameImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gameGradient: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  gameContent: {
    padding: 12,
  },
  gameIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  gameName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  gameDescription: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 8,
    height: 32,
  },
  gameMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  players: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  categoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
  },
});
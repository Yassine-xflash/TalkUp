import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  ActivityIndicator,
  FlatList
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Users, UserPlus, UserMinus } from 'lucide-react-native';
import { useGroupsStore } from '@/store/groups-store';
import { useAuthStore } from '@/store/auth-store';
import { useFeedStore } from '@/store/feed-store';
import PostItem from '@/components/post/PostItem';
import CreatePostInput from '@/components/post/CreatePostInput';
import Button from '@/components/ui/Button';
import colors from '@/constants/colors';

export default function GroupDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const { currentGroup, groupPosts, isLoading, fetchGroupById, fetchGroupPosts, joinGroup, leaveGroup, addGroupPost } = useGroupsStore();
  const { getUserById } = useFeedStore();
  
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    if (id) {
      fetchGroupById(id);
      fetchGroupPosts(id);
    }
  }, [id]);
  
  const handleRefresh = async () => {
    if (!id) return;
    
    setRefreshing(true);
    await fetchGroupPosts(id);
    setRefreshing(false);
  };
  
  const handleJoinGroup = () => {
    if (!user || !currentGroup) return;
    joinGroup(currentGroup.id, user.id);
  };
  
  const handleLeaveGroup = () => {
    if (!user || !currentGroup) return;
    leaveGroup(currentGroup.id, user.id);
  };
  
  const handleCreatePost = (content: string, media?: string[]) => {
    if (!user || !currentGroup) return;
    addGroupPost(currentGroup.id, user.id, content, media);
  };
  
  const isUserMember = user && currentGroup ? currentGroup.members.includes(user.id) : false;
  
  if (isLoading && !currentGroup) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  
  if (!currentGroup) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Group not found</Text>
        <Button 
          title="Go Back" 
          onPress={() => router.back()} 
          style={styles.errorButton}
        />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: currentGroup.name,
          headerBackTitle: 'Groups',
        }} 
      />
      
      <FlatList
        data={groupPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostItem 
            post={item} 
            user={getUserById(item.userId)}
            onCommentPress={() => {}}
          />
        )}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              {currentGroup.coverImage ? (
                <Image 
                  source={{ uri: currentGroup.coverImage }} 
                  style={styles.coverImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.coverImage, styles.coverPlaceholder]} />
              )}
              
              <View style={styles.avatarContainer}>
                {currentGroup.avatar ? (
                  <Image 
                    source={{ uri: currentGroup.avatar }} 
                    style={styles.avatar}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={[styles.avatar, styles.avatarPlaceholder]}>
                    <Text style={styles.avatarText}>{currentGroup.name.charAt(0)}</Text>
                  </View>
                )}
              </View>
            </View>
            
            <View style={styles.info}>
              <Text style={styles.name}>{currentGroup.name}</Text>
              <Text style={styles.type}>
                {currentGroup.type.charAt(0).toUpperCase() + currentGroup.type.slice(1)}
              </Text>
              
              <View style={styles.stats}>
                <Users size={16} color={colors.textSecondary} />
                <Text style={styles.statsText}>
                  {currentGroup.members.length} {currentGroup.members.length === 1 ? 'member' : 'members'}
                </Text>
              </View>
              
              <Text style={styles.description}>{currentGroup.description}</Text>
              
              {user && (
                <View style={styles.actions}>
                  {isUserMember ? (
                    <Button
                      title="Leave Group"
                      onPress={handleLeaveGroup}
                      variant="outline"
                      size="medium"
                      style={styles.actionButton}
                      icon={<UserMinus size={16} color={colors.primary} />}
                    />
                  ) : (
                    <Button
                      title="Join Group"
                      onPress={handleJoinGroup}
                      variant="primary"
                      size="medium"
                      style={styles.actionButton}
                      icon={<UserPlus size={16} color="#FFFFFF" />}
                    />
                  )}
                </View>
              )}
            </View>
            
            <View style={styles.divider} />
            
            {user && isUserMember && (
              <CreatePostInput 
                user={user} 
                onSubmit={handleCreatePost}
                placeholder="Share something with the group..."
              />
            )}
            
            {groupPosts.length > 0 ? (
              <Text style={styles.postsTitle}>Group Posts</Text>
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  No posts in this group yet
                </Text>
                {user && isUserMember && (
                  <Text style={styles.emptySubtext}>
                    Be the first to share something!
                  </Text>
                )}
              </View>
            )}
          </>
        }
        contentContainerStyle={styles.listContent}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  errorText: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 16,
    textAlign: 'center',
  },
  errorButton: {
    minWidth: 120,
  },
  listContent: {
    paddingBottom: 16,
  },
  header: {
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: 150,
  },
  coverPlaceholder: {
    backgroundColor: colors.border,
  },
  avatarContainer: {
    position: 'absolute',
    bottom: -40,
    left: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: colors.card,
  },
  avatarPlaceholder: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  info: {
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  type: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: 8,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statsText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    flex: 1,
  },
  divider: {
    height: 8,
    backgroundColor: colors.border,
    marginBottom: 16,
  },
  postsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 16,
    color: colors.text,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
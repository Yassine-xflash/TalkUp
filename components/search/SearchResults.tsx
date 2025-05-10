import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator, 
  Pressable, 
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFeedStore } from '@/store/feed-store';
import { useFriendsStore } from '@/store/friends-store';
import { useGroupsStore } from '@/store/groups-store';
import PostItem from '@/components/post/PostItem';
import GroupItem from '@/components/group/GroupItem';
import Avatar from '@/components/ui/Avatar';
import colors from '@/constants/colors';
import { Search, Users, FileText } from 'lucide-react-native';

interface SearchResultsProps {
  query: string;
  visible: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({ query, visible }) => {
  const router = useRouter();
  
  const { users, isLoading: isLoadingUsers } = useFriendsStore();
  const { groups, isLoading: isLoadingGroups } = useGroupsStore();
  const { posts, isLoading: isLoadingPosts } = useFeedStore();

  if (!visible) {
    return (
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoid}
      >
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Try searching for</Text>
          <View style={styles.suggestions}>
            <Pressable 
              style={styles.suggestionItem}
              onPress={() => router.push('/find-friends')}
            >
              <View style={styles.suggestionIcon}>
                <Users size={20} color={colors.primary} />
              </View>
              <Text style={styles.suggestionText}>People</Text>
            </Pressable>
            
            <Pressable 
              style={styles.suggestionItem}
              onPress={() => router.push('/(tabs)/groups')}
            >
              <View style={[styles.suggestionIcon, { backgroundColor: `${colors.secondary}20` }]}>
                <Users size={20} color={colors.secondary} />
              </View>
              <Text style={styles.suggestionText}>Groups</Text>
            </Pressable>
            
            <Pressable 
              style={styles.suggestionItem}
              onPress={() => router.push('/(tabs)')}
            >
              <View style={[styles.suggestionIcon, { backgroundColor: `${colors.info}20` }]}>
                <FileText size={20} color={colors.info} />
              </View>
              <Text style={styles.suggestionText}>Posts</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }

  const filteredUsers = query ? 
    users.filter(user => 
      user.name.toLowerCase().includes(query.toLowerCase()) || 
      (user.email && user.email.toLowerCase().includes(query.toLowerCase()))
    ) : [];
    
  const filteredGroups = query ?
    groups.filter(group => 
      group.name.toLowerCase().includes(query.toLowerCase()) || 
      group.description.toLowerCase().includes(query.toLowerCase())
    ) : [];
    
  const filteredPosts = query ?
    posts.filter(post => 
      post.content.toLowerCase().includes(query.toLowerCase())
    ) : [];

  const isLoading = isLoadingUsers || isLoadingGroups || isLoadingPosts;
  
  if (isLoading) {
    return (
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoid}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      </KeyboardAvoidingView>
    );
  }

  const totalResults = filteredUsers.length + filteredGroups.length + filteredPosts.length;
  
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardAvoid}
    >
      <ScrollView 
        style={styles.container}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.contentContainer}
      >
        {totalResults === 0 ? (
          <View style={styles.emptyContainer}>
            <Search size={48} color={colors.textSecondary} style={styles.emptyIcon} />
            <Text style={styles.emptyTitle}>No results found</Text>
            <Text style={styles.emptyMessage}>
              We couldn't find anything matching "{query}". Try different keywords.
            </Text>
          </View>
        ) : (
          <>
            {filteredUsers.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>People ({filteredUsers.length})</Text>
                {filteredUsers.slice(0, 3).map(user => (
                  <Pressable 
                    key={user.id} 
                    style={styles.userItem}
                    onPress={() => router.push(`/profile/${user.id}`)}
                  >
                    <Avatar 
                      source={user.avatar} 
                      size={48} 
                      style={styles.userAvatar}
                      name={user.name}
                    />
                    <View style={styles.userInfo}>
                      <Text style={styles.userName}>{user.name}</Text>
                      <Text style={styles.userEmail}>{user.email || 'No email'}</Text>
                    </View>
                  </Pressable>
                ))}
                {filteredUsers.length > 3 && (
                  <Pressable 
                    style={styles.seeMore}
                    onPress={() => router.push('/find-friends')}
                  >
                    <Text style={styles.seeMoreText}>See all people results</Text>
                  </Pressable>
                )}
              </View>
            )}
            
            {filteredGroups.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Groups ({filteredGroups.length})</Text>
                {filteredGroups.slice(0, 3).map(group => (
                  <GroupItem 
                    key={group.id} 
                    group={group} 
                    onPress={() => router.push(`/group/${group.id}`)} 
                  />
                ))}
                {filteredGroups.length > 3 && (
                  <Pressable 
                    style={styles.seeMore}
                    onPress={() => router.push('/(tabs)/groups')}
                  >
                    <Text style={styles.seeMoreText}>See all group results</Text>
                  </Pressable>
                )}
              </View>
            )}
            
            {filteredPosts.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Posts ({filteredPosts.length})</Text>
                {filteredPosts.slice(0, 3).map(post => {
                  // Find the user who created the post
                  const postUser = users.find(user => user.id === post.userId);
                  if (!postUser) return null;
                  
                  return (
                    <PostItem 
                      key={post.id} 
                      post={post}
                      user={postUser}
                    />
                  );
                })}
                {filteredPosts.length > 3 && (
                  <Pressable 
                    style={styles.seeMore}
                    onPress={() => router.push('/(tabs)')}
                  >
                    <Text style={styles.seeMoreText}>See all post results</Text>
                  </Pressable>
                )}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 120 : 100,
  },
  suggestionsContainer: {
    padding: 24,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 16,
  },
  suggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  suggestionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${colors.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  suggestionText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: colors.background,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 16,
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
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  userAvatar: {
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  seeMore: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seeMoreText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
});

export default SearchResults;
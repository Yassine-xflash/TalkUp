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
import Card from '@/components/ui/Card';
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

  // Rest of the component remains the same...
  // (Previous implementation of search results)

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
        {/* Previous implementation of search results */}
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
    paddingBottom: Platform.OS === 'ios' ? 120 : 100, // Extra padding for iOS keyboard
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
  // ... rest of the styles remain the same
});

export default SearchResults;
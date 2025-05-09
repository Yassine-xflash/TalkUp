import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Keyboard, TouchableWithoutFeedback, Platform } from 'react-native';
import { Stack } from 'expo-router';
import SearchInput from '@/components/ui/SearchInput';
import SearchResults from '@/components/search/SearchResults';
import { useFeedStore } from '@/store/feed-store';
import { useFriendsStore } from '@/store/friends-store';
import { useGroupsStore } from '@/store/groups-store';
import colors from '@/constants/colors';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  const { fetchPosts } = useFeedStore();
  const { fetchUsers } = useFriendsStore();
  const { fetchGroups } = useGroupsStore();
  
  useEffect(() => {
    // Fetch data when component mounts
    fetchPosts();
    fetchUsers();
    fetchGroups();
  }, []);
  
  const dismissKeyboard = () => {
    Keyboard.dismiss();
    setIsFocused(false);
  };
  
  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <Stack.Screen options={{ 
          headerShown: false,
        }} />
        
        <View style={styles.searchContainer}>
          <SearchInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search people, groups, posts..."
            autoFocus={Platform.OS !== 'ios'} // Disable autoFocus on iOS
          />
        </View>
        
        <SearchResults 
          query={searchQuery}
          visible={searchQuery.length > 0 || isFocused}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'ios' ? 60 : 20, // Add padding for iOS status bar
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    zIndex: 1, // Ensure search container is above results
  },
});
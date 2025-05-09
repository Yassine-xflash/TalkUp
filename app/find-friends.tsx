import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Search, Users, MessageSquare } from 'lucide-react-native';
import { useAuthStore } from '@/store/auth-store';
import { useFriendsStore } from '@/store/friends-store';
import Avatar from '@/components/ui/Avatar';
import colors from '@/constants/colors';

const departments = [
  'All',
  'Computer Science',
  'Electrical Engineering',
  'Civil Engineering',
  'Mechanical Engineering',
];

export default function FindFriendsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { users, isLoading, followUser, unfollowUser, isFollowing } = useFriendsStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  
  const filteredUsers = users.filter(u => {
    if (u.id === user?.id) return false;
    
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.department?.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesDepartment = selectedDepartment === 'All' || 
      u.department === selectedDepartment;
      
    return matchesSearch && matchesDepartment;
  });
  
  const handleFollow = (userId: string) => {
    if (!user) return;
    followUser(userId);
  };
  
  const handleUnfollow = (userId: string) => {
    if (!user) return;
    unfollowUser(userId);
  };
  
  const startChat = (userId: string) => {
    router.push(`/conversation/${userId}`);
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Find Friends',
          headerShadowVisible: false,
        }} 
      />
      
      <View style={styles.searchContainer}>
        <Search size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or department..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.textSecondary}
        />
      </View>
      
      <FlatList
        horizontal
        data={departments}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.departmentChip,
              selectedDepartment === item && styles.selectedDepartmentChip
            ]}
            onPress={() => setSelectedDepartment(item)}
          >
            <Text style={[
              styles.departmentText,
              selectedDepartment === item && styles.selectedDepartmentText
            ]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.departmentsList}
      />
      
      {isLoading ? (
        <ActivityIndicator style={styles.loader} color={colors.primary} />
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.userCard}>
              <View style={styles.userInfo}>
                <Avatar
                  source={item.avatar}
                  name={item.name}
                  size={50}
                />
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>{item.name}</Text>
                  <Text style={styles.userDepartment}>
                    {item.department} • Year {item.year}
                  </Text>
                </View>
              </View>
              
              <View style={styles.actions}>
                {isFollowing(item.id) ? (
                  <>
                    <TouchableOpacity
                      style={styles.messageButton}
                      onPress={() => startChat(item.id)}
                    >
                      <MessageSquare size={20} color={colors.primary} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={styles.unfollowButton}
                      onPress={() => handleUnfollow(item.id)}
                    >
                      <Text style={styles.unfollowText}>Following</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity
                    style={styles.followButton}
                    onPress={() => handleFollow(item.id)}
                  >
                    <Users size={16} color="#FFFFFF" />
                    <Text style={styles.followText}>Follow</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
          contentContainerStyle={styles.usersList}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No users found matching your search
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    margin: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: colors.text,
  },
  departmentsList: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  departmentChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedDepartmentChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  departmentText: {
    color: colors.text,
    fontSize: 14,
  },
  selectedDepartmentText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  usersList: {
    padding: 16,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userDetails: {
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  userDepartment: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageButton: {
    padding: 8,
    marginRight: 8,
  },
  followButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followText: {
    color: '#FFFFFF',
    fontWeight: '500',
    marginLeft: 6,
  },
  unfollowButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  unfollowText: {
    color: colors.text,
    fontWeight: '500',
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
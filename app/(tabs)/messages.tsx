import React, { useEffect, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  RefreshControl,
  ActivityIndicator,
  Text,
  Image,
  TouchableOpacity
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useMessagesStore } from '@/store/messages-store';
import { useAuthStore } from '@/store/auth-store';
import ConversationItem from '@/components/message/ConversationItem';
import colors from '@/constants/colors';
import users from '@/mocks/users';
import { Edit, Search } from 'lucide-react-native';

export default function MessagesScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { conversations, isLoading, fetchConversations } = useMessagesStore();
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    if (user) {
      fetchConversations(user.id);
    }
  }, [user]);
  
  const handleRefresh = async () => {
    if (!user) return;
    
    setRefreshing(true);
    await fetchConversations(user.id);
    setRefreshing(false);
  };
  
  const navigateToConversation = (userId: string) => {
    router.push(`/conversation/${userId}`);
  };
  
  const navigateToSearch = () => {
    router.push('/search');
  };
  
  if (!user) {
    return (
      <View style={styles.authContainer}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' }}
          style={styles.authImage}
        />
        <Text style={styles.authTitle}>Sign in to Message</Text>
        <Text style={styles.authText}>
          Please sign in to view and send messages to your connections
        </Text>
        <TouchableOpacity 
          style={styles.authButton}
          onPress={() => router.push('/auth/login')}
        >
          <Text style={styles.authButtonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  if (isLoading && !refreshing && Object.keys(conversations).length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  
  // Prepare conversations data for the list
  const conversationsData = Object.keys(conversations).map(userId => {
    const userMessages = conversations[userId];
    const lastMessage = userMessages[userMessages.length - 1];
    const unreadCount = userMessages.filter(
      msg => !msg.read && msg.senderId === userId
    ).length;
    
    const conversationUser = users.find(u => u.id === userId);
    
    return {
      userId,
      user: conversationUser,
      lastMessage,
      unreadCount,
    };
  });
  
  // Sort by last message time (newest first)
  conversationsData.sort((a, b) => 
    b.lastMessage.createdAt - a.lastMessage.createdAt
  );
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Messages',
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={navigateToSearch}
              >
                <Search size={22} color={colors.text} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => {}}
              >
                <Edit size={22} color={colors.text} />
              </TouchableOpacity>
            </View>
          ),
        }} 
      />
      
      <FlatList
        data={conversationsData}
        keyExtractor={(item) => item.userId}
        renderItem={({ item }) => (
          item.user && (
            <ConversationItem 
              user={item.user}
              lastMessage={item.lastMessage}
              unreadCount={item.unreadCount}
              onPress={() => navigateToConversation(item.userId)}
            />
          )
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' }}
              style={styles.emptyImage}
            />
            <Text style={styles.emptyTitle}>No conversations yet</Text>
            <Text style={styles.emptyText}>
              Start chatting with your connections to see messages here
            </Text>
            <TouchableOpacity 
              style={styles.findFriendsButton}
              onPress={() => router.push('/find-friends')}
            >
              <Text style={styles.findFriendsText}>Find Friends</Text>
            </TouchableOpacity>
          </View>
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
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 24,
  },
  authImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
  },
  authTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  authText: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  authButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  authButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    marginTop: 60,
  },
  emptyImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  findFriendsButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  findFriendsText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Text, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { useFeedStore } from '@/store/feed-store';
import { useEventsStore } from '@/store/events-store';
import { useAuthStore } from '@/store/auth-store';
import PostItem from '@/components/post/PostItem';
import CreatePostInput from '@/components/post/CreatePostInput';
import EventItem from '@/components/event/EventItem';
import { CustomHeader } from '@/components/layout/CustomHeader';
import colors from '@/constants/colors';

export default function HomeScreen() {
  const { posts, isLoading: postsLoading, fetchPosts, getUserById } = useFeedStore();
  const { events, isLoading: eventsLoading, fetchEvents } = useEventsStore();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'posts' | 'events'>('posts');
  
  useEffect(() => {
    fetchPosts();
    fetchEvents();
  }, []);

  const handleRefresh = async () => {
    if (activeTab === 'posts') {
      await fetchPosts();
    } else {
      await fetchEvents();
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          header: () => <CustomHeader />,
        }} 
      />
      
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
          onPress={() => setActiveTab('posts')}
        >
          <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>
            Posts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'events' && styles.activeTab]}
          onPress={() => setActiveTab('events')}
        >
          <Text style={[styles.tabText, activeTab === 'events' && styles.activeTabText]}>
            Events
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={activeTab === 'posts' ? postsLoading : eventsLoading}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {activeTab === 'posts' && (
          <View>
            {user && (
              <CreatePostInput 
                user={user}
                onSubmit={(content, media) => {
                  console.log('Creating post:', { content, media });
                }}
              />
            )}
            
            {posts.map((post) => {
              const postUser = getUserById(post.userId);
              if (!postUser) return null;
              
              return (
                <PostItem
                  key={post.id}
                  post={post}
                  user={postUser}
                />
              );
            })}
          </View>
        )}
        
        {activeTab === 'events' && (
          <View>
            {events.map((event) => (
              <EventItem 
                key={event.id}
                event={event}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.card,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: colors.primary + '20',
  },
  tabText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.primary,
  },
  content: {
    flex: 1,
  },
});
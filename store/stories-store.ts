import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types';
import users from '@/mocks/users';

export interface Story {
  id: string;
  userId: string;
  media: string;
  caption?: string;
  createdAt: number;
  expiresAt: number;
  views: StoryView[];
}

export interface StoryView {
  userId: string;
  timestamp: number;
}

interface StoriesState {
  stories: Story[];
  isLoading: boolean;
  error: string | null;
  addStory: (userId: string, media: string, caption?: string) => Promise<void>;
  deleteStory: (storyId: string) => Promise<void>;
  viewStory: (storyId: string, viewerId: string) => Promise<void>;
  getStoriesByUserId: (userId: string) => Story[];
  getViewersByStoryId: (storyId: string) => { user: User; timestamp: number }[];
  hasUnseenStories: (userId: string, viewerId: string) => boolean;
}

export const useStoriesStore = create<StoriesState>()(
  persist(
    (set, get) => ({
      stories: [],
      isLoading: false,
      error: null,

      addStory: async (userId: string, media: string, caption?: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const newStory: Story = {
            id: Date.now().toString(),
            userId,
            media,
            caption,
            createdAt: Date.now(),
            expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
            views: [],
          };
          
          set(state => ({
            stories: [newStory, ...state.stories],
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "Failed to add story",
            isLoading: false 
          });
        }
      },

      deleteStory: async (storyId: string) => {
        try {
          set(state => ({
            stories: state.stories.filter(story => story.id !== storyId),
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "Failed to delete story" 
          });
        }
      },

      viewStory: async (storyId: string, viewerId: string) => {
        try {
          set(state => ({
            stories: state.stories.map(story => {
              if (story.id === storyId && !story.views.some(view => view.userId === viewerId)) {
                return {
                  ...story,
                  views: [...story.views, { userId: viewerId, timestamp: Date.now() }],
                };
              }
              return story;
            }),
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "Failed to mark story as viewed" 
          });
        }
      },

      getStoriesByUserId: (userId: string) => {
        const now = Date.now();
        return get().stories
          .filter(story => story.userId === userId && story.expiresAt > now)
          .sort((a, b) => b.createdAt - a.createdAt);
      },

      getViewersByStoryId: (storyId: string) => {
        const story = get().stories.find(s => s.id === storyId);
        if (!story) return [];

        return story.views
          .map(view => ({
            user: users.find(u => u.id === view.userId) as User,
            timestamp: view.timestamp,
          }))
          .filter(view => view.user) // Filter out views where user not found
          .sort((a, b) => b.timestamp - a.timestamp);
      },

      hasUnseenStories: (userId: string, viewerId: string) => {
        const userStories = get().getStoriesByUserId(userId);
        return userStories.some(story => 
          !story.views.some(view => view.userId === viewerId)
        );
      },
    }),
    {
      name: 'stories-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ stories: state.stories }),
    }
  )
);
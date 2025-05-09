import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';
import users from '@/mocks/users';

interface FriendsState {
  users: User[];
  following: string[];
  isLoading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
  isFollowing: (userId: string) => boolean;
}

export const useFriendsStore = create<FriendsState>()(
  persist(
    (set, get) => ({
      users: users,
      following: [],
      isLoading: false,
      error: null,
      
      fetchUsers: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // In a real app, we would fetch users from an API
          // For now, we're using mock data
          set({ users, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "Failed to fetch users",
            isLoading: false 
          });
        }
      },
      
      followUser: (userId: string) => {
        set(state => ({
          following: [...state.following, userId]
        }));
      },
      
      unfollowUser: (userId: string) => {
        set(state => ({
          following: state.following.filter(id => id !== userId)
        }));
      },
      
      isFollowing: (userId: string) => {
        return get().following.includes(userId);
      },
    }),
    {
      name: 'friends-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
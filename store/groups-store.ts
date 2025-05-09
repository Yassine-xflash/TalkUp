import { create } from 'zustand';
import { Group, Post } from '@/types';
import groups from '@/mocks/groups';
import posts from '@/mocks/posts';

interface GroupsState {
  groups: Group[];
  currentGroup: Group | null;
  groupPosts: Post[];
  isLoading: boolean;
  error: string | null;
  fetchGroups: () => Promise<void>;
  fetchGroupById: (groupId: string) => Promise<void>;
  fetchGroupPosts: (groupId: string) => Promise<void>;
  joinGroup: (groupId: string, userId: string) => Promise<void>;
  leaveGroup: (groupId: string, userId: string) => Promise<void>;
  addGroupPost: (groupId: string, userId: string, content: string, media?: string[], mediaType?: 'image' | 'video' | 'pdf') => Promise<void>;
}

export const useGroupsStore = create<GroupsState>((set, get) => ({
  groups: [],
  currentGroup: null,
  groupPosts: [],
  isLoading: false,
  error: null,
  
  fetchGroups: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set({ groups, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Failed to fetch groups", 
        isLoading: false 
      });
    }
  },
  
  fetchGroupById: async (groupId) => {
    set({ isLoading: true, error: null, currentGroup: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const group = groups.find(g => g.id === groupId);
      
      if (!group) {
        throw new Error("Group not found");
      }
      
      set({ currentGroup: group, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Failed to fetch group", 
        isLoading: false 
      });
    }
  },
  
  fetchGroupPosts: async (groupId) => {
    set({ isLoading: true, error: null, groupPosts: [] });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter posts by group ID and sort by creation date (newest first)
      const filteredPosts = posts
        .filter(post => post.groupId === groupId)
        .sort((a, b) => b.createdAt - a.createdAt);
      
      set({ groupPosts: filteredPosts, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Failed to fetch group posts", 
        isLoading: false 
      });
    }
  },
  
  joinGroup: async (groupId, userId) => {
    try {
      set(state => ({
        groups: state.groups.map(group => 
          group.id === groupId 
            ? { ...group, members: [...group.members, userId] }
            : group
        ),
        currentGroup: state.currentGroup?.id === groupId 
          ? { ...state.currentGroup, members: [...state.currentGroup.members, userId] }
          : state.currentGroup
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Failed to join group" 
      });
    }
  },
  
  leaveGroup: async (groupId, userId) => {
    try {
      set(state => ({
        groups: state.groups.map(group => 
          group.id === groupId 
            ? { ...group, members: group.members.filter(id => id !== userId) }
            : group
        ),
        currentGroup: state.currentGroup?.id === groupId 
          ? { ...state.currentGroup, members: state.currentGroup.members.filter(id => id !== userId) }
          : state.currentGroup
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Failed to leave group" 
      });
    }
  },
  
  addGroupPost: async (groupId, userId, content, media, mediaType) => {
    try {
      const newPost: Post = {
        id: Date.now().toString(),
        userId,
        content,
        media,
        mediaType,
        likes: [],
        comments: [],
        createdAt: Date.now(),
        groupId,
      };
      
      set(state => ({ 
        groupPosts: [newPost, ...state.groupPosts]
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Failed to create post" 
      });
    }
  },
}));
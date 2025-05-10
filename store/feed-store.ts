import { create } from 'zustand';
import { Post, News } from '@/types';
import posts from '@/mocks/posts';
import users from '@/mocks/users';

interface FeedState {
  posts: Post[];
  news: News[];
  filteredPosts: Post[];
  isLoading: boolean;
  error: string | null;
  fetchPosts: () => Promise<void>;
  fetchNews: () => Promise<void>;
  filterPostsByType: (type: string) => void;
  addPost: (content: string, media?: string[], mediaType?: 'image' | 'video' | 'pdf', groupId?: string) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  likePost: (postId: string, userId: string) => Promise<void>;
  unlikePost: (postId: string, userId: string) => Promise<void>;
  addComment: (postId: string, userId: string, content: string) => Promise<void>;
  getUserById: (userId: string) => any;
}

const mockNews: News[] = [
  {
    id: '1',
    title: 'Universities and Covid-19: need help?',
    content: 'We have opened online classes...',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1686&q=80',
    source: {
      id: '1',
      name: 'University News',
      avatar: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f',
    },
    category: 'University',
    likes: 245,
    comments: 23,
    readTime: 5,
    createdAt: Date.now() - 3600000,
  },
  {
    id: '2',
    title: 'Reopening of Universities and contaminations',
    content: 'After 2 months of pause...',
    source: {
      id: '2',
      name: 'Government News',
      avatar: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167',
    },
    category: 'Government',
    likes: 189,
    comments: 45,
    readTime: 3,
    createdAt: Date.now() - 7200000,
  },
];

export const useFeedStore = create<FeedState>((set, get) => ({
  posts: [],
  filteredPosts: [],
  news: [],
  isLoading: false,
  error: null,
  
  fetchPosts: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Sort posts by creation date (newest first)
      const sortedPosts = [...posts].sort((a, b) => b.createdAt - a.createdAt);
      
      set({ 
        posts: sortedPosts, 
        filteredPosts: sortedPosts,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Failed to fetch posts", 
        isLoading: false 
      });
    }
  },

  filterPostsByType: (type: string) => {
    const allPosts = get().posts;
    let filtered: Post[];

    switch (type.toLowerCase()) {
      case 'groups':
        filtered = allPosts.filter(post => post.groupId);
        break;
      case 'friends':
        // In a real app, we would filter based on friend relationships
        filtered = allPosts.filter(post => !post.groupId);
        break;
      case 'favorites':
        // In a real app, we would filter based on saved/favorited posts
        filtered = allPosts.filter(post => post.likes.length > 0);
        break;
      case 'trending':
        // Sort by engagement (likes + comments)
        filtered = [...allPosts].sort((a, b) => 
          (b.likes.length + b.comments.length) - (a.likes.length + a.comments.length)
        );
        break;
      default:
        filtered = allPosts;
    }

    set({ filteredPosts: filtered });
  },

  fetchNews: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set({ news: mockNews, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Failed to fetch news", 
        isLoading: false 
      });
    }
  },
  
  addPost: async (content, media, mediaType, groupId) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newPost: Post = {
        id: (Math.max(...get().posts.map(p => parseInt(p.id))) + 1).toString(),
        userId: '1', // Current user ID (would come from auth store in a real app)
        content,
        media,
        mediaType,
        likes: [],
        comments: [],
        createdAt: Date.now(),
        groupId,
      };
      
      set(state => ({ 
        posts: [newPost, ...state.posts],
        filteredPosts: [newPost, ...state.filteredPosts],
        isLoading: false 
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Failed to create post", 
        isLoading: false 
      });
    }
  },

  deletePost: async (postId: string) => {
    try {
      set(state => ({
        posts: state.posts.filter(post => post.id !== postId),
        filteredPosts: state.filteredPosts.filter(post => post.id !== postId)
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Failed to delete post" 
      });
    }
  },
  
  likePost: async (postId, userId) => {
    try {
      set(state => ({
        posts: state.posts.map(post => 
          post.id === postId 
            ? { ...post, likes: [...post.likes, userId] }
            : post
        ),
        filteredPosts: state.filteredPosts.map(post => 
          post.id === postId 
            ? { ...post, likes: [...post.likes, userId] }
            : post
        )
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Failed to like post" 
      });
    }
  },
  
  unlikePost: async (postId, userId) => {
    try {
      set(state => ({
        posts: state.posts.map(post => 
          post.id === postId 
            ? { ...post, likes: post.likes.filter(id => id !== userId) }
            : post
        ),
        filteredPosts: state.filteredPosts.map(post => 
          post.id === postId 
            ? { ...post, likes: post.likes.filter(id => id !== userId) }
            : post
        )
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Failed to unlike post" 
      });
    }
  },
  
  addComment: async (postId, userId, content) => {
    try {
      const newComment = {
        id: Date.now().toString(),
        userId,
        content,
        createdAt: Date.now(),
      };
      
      set(state => ({
        posts: state.posts.map(post => 
          post.id === postId 
            ? { ...post, comments: [...post.comments, newComment] }
            : post
        ),
        filteredPosts: state.filteredPosts.map(post => 
          post.id === postId 
            ? { ...post, comments: [...post.comments, newComment] }
            : post
        )
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Failed to add comment" 
      });
    }
  },
  
  getUserById: (userId) => {
    return users.find(user => user.id === userId);
  },
}));
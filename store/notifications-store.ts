import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Notification } from '@/types';

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  fetchNotifications: (userId: string) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: (userId: string) => Promise<void>;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => Promise<void>;
}

// Mock notifications data
const mockNotifications = [
  {
    id: '1',
    userId: '1',
    name: 'Elaine Smith',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    type: 'message',
    referenceId: '123',
    read: false,
    createdAt: Date.now() - 1800000, // 30 minutes ago
  },
  {
    id: '2',
    userId: '1',
    name: 'Elaine Smith',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    type: 'message',
    referenceId: '124',
    read: false,
    createdAt: Date.now() - 3600000, // 1 hour ago
  },
  {
    id: '3',
    userId: '1',
    name: 'Elaine Smith',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    type: 'comment',
    referenceId: '125',
    read: false,
    createdAt: Date.now() - 7200000, // 2 hours ago
  },
  {
    id: '4',
    userId: '1',
    name: 'Elaine Smith',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    type: 'like',
    referenceId: '126',
    read: true,
    createdAt: Date.now() - 86400000, // 1 day ago
  },
  {
    id: '5',
    userId: '1',
    name: 'Elaine Smith',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    type: 'follow',
    referenceId: '127',
    read: true,
    createdAt: Date.now() - 86400000 - 3600000, // 1 day and 1 hour ago
  },
];

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      error: null,
      
      fetchNotifications: async (userId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // In a real app, we would fetch notifications from the server
          // For now, use mock data
          set({ 
            notifications: mockNotifications,
            unreadCount: mockNotifications.filter(n => !n.read).length,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "Failed to fetch notifications",
            isLoading: false 
          });
        }
      },
      
      markAsRead: async (notificationId: string) => {
        try {
          set(state => {
            const updatedNotifications = state.notifications.map(notification => 
              notification.id === notificationId 
                ? { ...notification, read: true }
                : notification
            );
            
            return {
              notifications: updatedNotifications,
              unreadCount: updatedNotifications.filter(n => !n.read).length
            };
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "Failed to mark notification as read"
          });
        }
      },
      
      markAllAsRead: async (userId: string) => {
        try {
          set(state => {
            const updatedNotifications = state.notifications.map(notification => 
              notification.userId === userId 
                ? { ...notification, read: true }
                : notification
            );
            
            return {
              notifications: updatedNotifications,
              unreadCount: 0
            };
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "Failed to mark all notifications as read"
          });
        }
      },
      
      addNotification: async (notificationData) => {
        try {
          const newNotification = {
            ...notificationData,
            id: Date.now().toString(),
            read: false,
            createdAt: Date.now(),
          };
          
          set(state => {
            const updatedNotifications = [newNotification, ...state.notifications];
            return {
              notifications: updatedNotifications,
              unreadCount: state.unreadCount + 1
            };
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "Failed to add notification"
          });
        }
      },
    }),
    {
      name: 'notifications-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
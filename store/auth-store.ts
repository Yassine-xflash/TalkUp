/**
 * Authentication store for the TalkUp application.
 * This store manages user authentication state including:
 * - User login
 * - User registration
 * - Session management
 * - Error handling
 * 
 * @module AuthStore
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';
import users from '@/mocks/users';

/**
 * Authentication state interface
 * @interface
 */
interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

/**
 * Authentication store implementation
 * Uses Zustand for state management with persistence
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,
      
      /**
       * Handles user login
       * @param {string} email - User's email
       * @param {string} password - User's password
       */
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Validate academic email
          if (!email.endsWith('@usmba.ac.ma')) {
            throw new Error("Please use your academic email (@usmba.ac.ma)");
          }
          
          // Find user
          const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
          
          if (!user) {
            throw new Error("Invalid email or password");
          }
          
          set({ user, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "An unknown error occurred", 
            isLoading: false 
          });
        }
      },
      
      /**
       * Handles user registration
       * @param {string} email - User's email
       * @param {string} password - User's password
       * @param {string} name - User's name
       * @param {string} role - User's role
       */
      register: async (email: string, password: string, name: string, role: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Validate academic email
          if (!email.endsWith('@usmba.ac.ma')) {
            throw new Error("Please use your academic email (@usmba.ac.ma)");
          }
          
          // Check for existing user
          const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
          if (existingUser) {
            throw new Error("Email already registered");
          }
          
          // Create new user
          const newUser: User = {
            id: (users.length + 1).toString(),
            name,
            email,
            role: role as any,
            isVerified: false,
            createdAt: Date.now(),
          };
          
          set({ user: newUser, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "An unknown error occurred", 
            isLoading: false 
          });
        }
      },
      
      /**
       * Handles user logout
       */
      logout: () => {
        set({ user: null });
      },
      
      /**
       * Clears authentication errors
       */
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
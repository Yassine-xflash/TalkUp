import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';
import users from '@/mocks/users';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,
      
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check if email is valid academic email
          if (!email.endsWith('@usmba.ac.ma')) {
            throw new Error("Please use your academic email (@usmba.ac.ma)");
          }
          
          // Find user with matching email (mock authentication)
          const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
          
          if (!user) {
            throw new Error("Invalid email or password");
          }
          
          // In a real app, we would verify the password here
          // For demo purposes, any password works
          
          set({ user, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "An unknown error occurred", 
            isLoading: false 
          });
        }
      },
      
      register: async (email: string, password: string, name: string, role: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check if email is valid academic email
          if (!email.endsWith('@usmba.ac.ma')) {
            throw new Error("Please use your academic email (@usmba.ac.ma)");
          }
          
          // Check if user already exists
          const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
          if (existingUser) {
            throw new Error("Email already registered");
          }
          
          // Create new user (in a real app, this would be saved to a database)
          const newUser: User = {
            id: (users.length + 1).toString(),
            name,
            email,
            role: role as any,
            isVerified: false, // Would require email verification in a real app
            createdAt: Date.now(),
          };
          
          // In a real app, we would save the user to the database here
          
          set({ user: newUser, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "An unknown error occurred", 
            isLoading: false 
          });
        }
      },
      
      logout: () => {
        set({ user: null });
      },
      
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
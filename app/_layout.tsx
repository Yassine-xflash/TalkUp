/**
 * Root layout component for the TalkUp application.
 * This component sets up the core app structure including:
 * - Font loading
 * - Error boundaries
 * - Navigation structure
 * - Authentication state
 * - Query client for data fetching
 * 
 * @module RootLayout
 */

import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, trpcClient } from "@/lib/trpc";
import { ErrorBoundary } from "./error-boundary";
import { View, Text } from "react-native";
import { useAuthStore } from "@/store/auth-store";

/**
 * Initial route configuration
 * @constant
 */
export const unstable_settings = {
  initialRouteName: "onboarding",
};

// Initialize QueryClient for React Query
const queryClient = new QueryClient();

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

/**
 * Root layout component that wraps the entire application
 * @component
 * @returns {JSX.Element} The root layout component
 */
export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });
  const [appReady, setAppReady] = useState(false);

  // Handle font loading errors
  useEffect(() => {
    if (error) {
      console.error("Error loading fonts:", error);
      setAppReady(true);
    }
  }, [error]);

  // Hide splash screen when fonts are loaded
  useEffect(() => {
    if (loaded) {
      setAppReady(true);
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!appReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <RootLayoutNav />
        </QueryClientProvider>
      </trpc.Provider>
    </ErrorBoundary>
  );
}

/**
 * Navigation layout component that defines the app's routing structure
 * @component
 * @returns {JSX.Element} The navigation layout component
 */
function RootLayoutNav() {
  const { user } = useAuthStore();

  return (
    <Stack>
      {/* Main navigation structure */}
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      
      {/* Modal screens */}
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      <Stack.Screen name="create-post" options={{ presentation: "modal" }} />
      <Stack.Screen name="create-story" options={{ presentation: "modal" }} />
      
      {/* Authentication screens */}
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      
      {/* Feature screens */}
      <Stack.Screen name="notifications" options={{ 
        presentation: 'card',
        headerShown: true,
        title: 'Notifications'
      }} />
      <Stack.Screen name="search" options={{ 
        presentation: 'card',
        headerShown: true,
        title: 'Search'
      }} />
      
      {/* Content detail screens */}
      <Stack.Screen name="story/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="group/[id]" options={{ headerShown: true }} />
      <Stack.Screen name="event/[id]" options={{ headerShown: true }} />
      <Stack.Screen name="conversation/[id]" options={{ headerShown: true }} />
      <Stack.Screen name="profile/[id]" options={{ headerShown: true, title: 'Profile' }} />
      <Stack.Screen name="post/[id]" options={{ headerShown: true, title: 'Post' }} />
      
      {/* Settings screens */}
      <Stack.Screen name="settings" options={{ headerShown: true, title: 'Settings' }} />
      <Stack.Screen name="settings/account-info" options={{ headerShown: true, title: 'Account Information' }} />
      <Stack.Screen name="settings/change-password" options={{ headerShown: true, title: 'Change Password' }} />
      <Stack.Screen name="settings/privacy" options={{ headerShown: true, title: 'Privacy Settings' }} />
      <Stack.Screen name="settings/notifications" options={{ headerShown: true, title: 'Notification Settings' }} />
      <Stack.Screen name="settings/help" options={{ headerShown: true, title: 'Help & Support' }} />
      <Stack.Screen name="settings/about" options={{ headerShown: true, title: 'About TalkUp' }} />
      <Stack.Screen name="settings/about/terms" options={{ headerShown: true, title: 'Terms of Service' }} />
      <Stack.Screen name="settings/about/privacy" options={{ headerShown: true, title: 'Privacy Policy' }} />
      <Stack.Screen name="edit-profile" options={{ headerShown: true, title: 'Edit Profile' }} />
      <Stack.Screen name="help" options={{ headerShown: true, title: 'Help & Support' }} />
      <Stack.Screen name="settings/help/chat" options={{ headerShown: true, title: 'Live Chat' }} />
      <Stack.Screen name="settings/help/tutorials" options={{ headerShown: true, title: 'Tutorials' }} />
    </Stack>
  );
}
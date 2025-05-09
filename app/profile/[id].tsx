import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { LogOut, Settings, Bell, Shield, HelpCircle } from 'lucide-react-native';
import { useAuthStore } from '@/store/auth-store';
import { useFeedStore } from '@/store/feed-store';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import colors from '@/constants/colors';

export default function UserProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user: currentUser, logout } = useAuthStore();
  const { getUserById } = useFeedStore();
  const [profileUser, setProfileUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const user = getUserById(id as string);
      if (user) {
        setProfileUser(user);
      } else {
        // In a real app, you would fetch the user data from an API
        setProfileUser(null);
      }
      setLoading(false);
    }
  }, [id]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!profileUser) {
    return (
      <View style={styles.errorContainer}>
        <Stack.Screen options={{ title: 'Profile Not Found' }} />
        <Text style={styles.errorText}>User profile not found.</Text>
        <Button title="Back to Home" onPress={() => router.push('/')} style={styles.backButton} />
      </View>
    );
  }

  const isCurrentUser = currentUser && currentUser.id === id;

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen 
        options={{
          title: profileUser.name || 'Profile',
          headerRight: isCurrentUser ? () => (
            <TouchableOpacity 
              style={styles.settingsButton} 
              onPress={() => router.push('/settings')}
            >
              <Settings size={24} color={colors.text} />
            </TouchableOpacity>
          ) : undefined,
        }} 
      />
      
      <View style={styles.header}>
        {profileUser.avatar ? (
          <Image 
            source={{ uri: profileUser.avatar }} 
            style={styles.avatar}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>{profileUser.name.charAt(0)}</Text>
          </View>
        )}
        
        <Text style={styles.name}>{profileUser.name}</Text>
        <Text style={styles.role}>{profileUser.role.charAt(0).toUpperCase() + profileUser.role.slice(1)}</Text>
        
        {profileUser.department && (
          <Text style={styles.department}>{profileUser.department}</Text>
        )}
      </View>
      
      <Card style={styles.bioCard}>
        <Text style={styles.bioTitle}>About</Text>
        <Text style={styles.bioText}>
          {profileUser.bio || "No bio provided yet."}
        </Text>
      </Card>
      
      {isCurrentUser && (
        <View style={styles.menuSection}>
          <Text style={styles.menuTitle}>Account</Text>
          
          <Card style={styles.menuCard} padded={false}>
            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/edit-profile')}>
              <View style={styles.menuItemContent}>
                <View style={[styles.menuItemIcon, { backgroundColor: `${colors.primary}20` }]}>
                  <Settings size={20} color={colors.primary} />
                </View>
                <Text style={styles.menuItemText}>Edit Profile</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/notifications')}>
              <View style={styles.menuItemContent}>
                <View style={[styles.menuItemIcon, { backgroundColor: `${colors.info}20` }]}>
                  <Bell size={20} color={colors.info} />
                </View>
                <Text style={styles.menuItemText}>Notifications</Text>
              </View>
            </TouchableOpacity>
            
            {profileUser.role === 'admin' && (
              <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/admin')}>
                <View style={styles.menuItemContent}>
                  <View style={[styles.menuItemIcon, { backgroundColor: `${colors.warning}20` }]}>
                    <Shield size={20} color={colors.warning} />
                  </View>
                  <Text style={styles.menuItemText}>Admin Dashboard</Text>
                </View>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/help')}>
              <View style={styles.menuItemContent}>
                <View style={[styles.menuItemIcon, { backgroundColor: `${colors.secondary}20` }]}>
                  <HelpCircle size={20} color={colors.secondary} />
                </View>
                <Text style={styles.menuItemText}>Help & Support</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <View style={styles.menuItemContent}>
                <View style={[styles.menuItemIcon, { backgroundColor: `${colors.error}20` }]}>
                  <LogOut size={20} color={colors.error} />
                </View>
                <Text style={[styles.menuItemText, { color: colors.error }]}>Log Out</Text>
              </View>
            </TouchableOpacity>
          </Card>
        </View>
      )}
      
      {!isCurrentUser && (
        <View style={styles.actionSection}>
          <Button title="Follow" onPress={() => console.log('Follow user')} style={styles.actionButton} />
          <Button title="Message" variant="outline" onPress={() => router.push(`/conversation/${id}`)} style={styles.actionButton} />
        </View>
      )}
      
      <Text style={styles.version}>TalkUp v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  errorText: {
    fontSize: 18,
    marginBottom: 20,
    color: colors.text,
  },
  backButton: {
    width: '80%',
  },
  settingsButton: {
    padding: 8,
    marginRight: 8,
  },
  header: {
    alignItems: 'center',
    padding: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  avatarPlaceholder: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: colors.text,
  },
  role: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: 8,
  },
  department: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  bioCard: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  bioTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.text,
  },
  bioText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  menuSection: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.text,
    paddingLeft: 4,
  },
  menuCard: {
    overflow: 'hidden',
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: colors.text,
  },
  actionSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  actionButton: {
    marginBottom: 12,
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 24,
  },
});
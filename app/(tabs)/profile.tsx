import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LogOut, Settings, Bell, Shield, HelpCircle } from 'lucide-react-native';
import { useAuthStore } from '@/store/auth-store';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import colors from '@/constants/colors';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  
  const handleLogin = () => {
    router.push('/auth/login');
  };
  
  const handleRegister = () => {
    router.push('/auth/register');
  };
  
  const handleLogout = () => {
    logout();
  };
  
  if (!user) {
    return (
      <View style={styles.authContainer}>
        <Stack.Screen 
          options={{
            title: 'Profile',
          }} 
        />
        
        <Text style={styles.authTitle}>Welcome to TalkUp</Text>
        <Text style={styles.authSubtitle}>
          Sign in to connect with the ENSA Fès community
        </Text>
        
        <View style={styles.authButtons}>
          <Button 
            title="Sign In" 
            onPress={handleLogin} 
            style={styles.authButton}
          />
          <Button 
            title="Register" 
            onPress={handleRegister} 
            variant="outline"
            style={styles.authButton}
          />
        </View>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Profile',
          headerRight: () => (
            <TouchableOpacity 
              style={styles.settingsButton} 
              onPress={() => router.push('/settings')}
            >
              <Settings size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <View style={styles.header}>
        {user.avatar ? (
          <Image 
            source={{ uri: user.avatar }} 
            style={styles.avatar}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
          </View>
        )}
        
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.role}>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</Text>
        
        {user.department && (
          <Text style={styles.department}>{user.department}</Text>
        )}
      </View>
      
      <Card style={styles.bioCard}>
        <Text style={styles.bioTitle}>About</Text>
        <Text style={styles.bioText}>
          {user.bio || "No bio provided yet."}
        </Text>
      </Card>
      
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
          
          {user.role === 'admin' && (
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
      
      <Text style={styles.version}>TalkUp v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: colors.text,
  },
  authSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: colors.textSecondary,
  },
  authButtons: {
    width: '100%',
  },
  authButton: {
    marginBottom: 12,
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
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 24,
  },
});
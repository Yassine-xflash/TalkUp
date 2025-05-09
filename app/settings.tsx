import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Settings, Bell, Shield, HelpCircle, Info, Lock, LogOut } from 'lucide-react-native';
import colors from '@/constants/colors';
import Card from '@/components/ui/Card';
import { useAuthStore } from '@/store/auth-store';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.replace('/auth/login');
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Settings',
        }} 
      />
      
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage your account and preferences</Text>
      </View>
      
      <View style={styles.menuSection}>
        <Text style={styles.menuTitle}>Account</Text>
        
        <Card style={styles.menuCard} padded={false}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/settings/account-info')}
          >
            <View style={styles.menuItemContent}>
              <View style={[styles.menuItemIcon, { backgroundColor: `${colors.primary}20` }]}>
                <Settings size={20} color={colors.primary} />
              </View>
              <Text style={styles.menuItemText}>Account Information</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/settings/change-password')}
          >
            <View style={styles.menuItemContent}>
              <View style={[styles.menuItemIcon, { backgroundColor: `${colors.info}20` }]}>
                <Lock size={20} color={colors.info} />
              </View>
              <Text style={styles.menuItemText}>Change Password</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/settings/privacy')}
          >
            <View style={styles.menuItemContent}>
              <View style={[styles.menuItemIcon, { backgroundColor: `${colors.warning}20` }]}>
                <Shield size={20} color={colors.warning} />
              </View>
              <Text style={styles.menuItemText}>Privacy Settings</Text>
            </View>
          </TouchableOpacity>
        </Card>
      </View>
      
      <View style={styles.menuSection}>
        <Text style={styles.menuTitle}>Preferences</Text>
        
        <Card style={styles.menuCard} padded={false}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/settings/notifications')}
          >
            <View style={styles.menuItemContent}>
              <View style={[styles.menuItemIcon, { backgroundColor: `${colors.secondary}20` }]}>
                <Bell size={20} color={colors.secondary} />
              </View>
              <Text style={styles.menuItemText}>Notifications</Text>
            </View>
          </TouchableOpacity>
        </Card>
      </View>
      
      <View style={styles.menuSection}>
        <Text style={styles.menuTitle}>About</Text>
        
        <Card style={styles.menuCard} padded={false}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/settings/help')}
          >
            <View style={styles.menuItemContent}>
              <View style={[styles.menuItemIcon, { backgroundColor: `${colors.info}20` }]}>
                <HelpCircle size={20} color={colors.info} />
              </View>
              <Text style={styles.menuItemText}>Help & Support</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/settings/about')}
          >
            <View style={styles.menuItemContent}>
              <View style={[styles.menuItemIcon, { backgroundColor: `${colors.primary}20` }]}>
                <Info size={20} color={colors.primary} />
              </View>
              <Text style={styles.menuItemText}>About TalkUp</Text>
            </View>
          </TouchableOpacity>
        </Card>
      </View>
      
      {user && (
        <View style={styles.menuSection}>
          <Card style={styles.menuCard} padded={false}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleLogout}
            >
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
      
      <Text style={styles.version}>TalkUp v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
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
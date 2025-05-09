import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Shield, ChevronRight } from 'lucide-react-native';
import colors from '@/constants/colors';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth-store';

export default function PrivacySettingsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [profileVisibility, setProfileVisibility] = useState('friends');
  const [postVisibility, setPostVisibility] = useState('public');
  const [emailVisibility, setEmailVisibility] = useState('private');
  const [activityStatus, setActivityStatus] = useState(true);

  const handleSaveChanges = () => {
    // In a real app, this would save the settings to a backend
    Alert.alert('Success', 'Privacy settings updated successfully.', [
      { text: 'OK' }
    ]);
  };

  const VisibilityOption = ({ label, value, selected, onSelect }: { 
    label: string; 
    value: string; 
    selected: string; 
    onSelect: (value: string) => void;
  }) => (
    <TouchableOpacity 
      style={[
        styles.optionItem,
        selected === value && styles.selectedOption
      ]}
      onPress={() => onSelect(value)}
    >
      <Text style={[
        styles.optionText,
        selected === value && styles.selectedOptionText
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (!user) {
    return (
      <View style={styles.container}>
        <Stack.Screen 
          options={{
            title: 'Privacy Settings',
          }} 
        />
        <Text style={styles.errorText}>You must be logged in to view this page.</Text>
        <Button 
          title="Go to Login" 
          onPress={() => router.replace('/auth/login')} 
          style={styles.loginButton}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Privacy Settings',
        }} 
      />
      
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${colors.warning}20` }]}>
          <Shield size={24} color={colors.warning} />
        </View>
        <Text style={styles.title}>Privacy Settings</Text>
        <Text style={styles.subtitle}>Control who can see your information and activities</Text>
      </View>
      
      <Card style={styles.settingsCard}>
        <Text style={styles.sectionTitle}>Profile Visibility</Text>
        <Text style={styles.sectionDescription}>Who can see your profile details?</Text>
        
        <View style={styles.optionsContainer}>
          <VisibilityOption 
            label="Public" 
            value="public" 
            selected={profileVisibility} 
            onSelect={setProfileVisibility} 
          />
          <VisibilityOption 
            label="Friends Only" 
            value="friends" 
            selected={profileVisibility} 
            onSelect={setProfileVisibility} 
          />
          <VisibilityOption 
            label="Private" 
            value="private" 
            selected={profileVisibility} 
            onSelect={setProfileVisibility} 
          />
        </View>
      </Card>
      
      <Card style={styles.settingsCard}>
        <Text style={styles.sectionTitle}>Posts Visibility</Text>
        <Text style={styles.sectionDescription}>Who can see your posts?</Text>
        
        <View style={styles.optionsContainer}>
          <VisibilityOption 
            label="Public" 
            value="public" 
            selected={postVisibility} 
            onSelect={setPostVisibility} 
          />
          <VisibilityOption 
            label="Friends Only" 
            value="friends" 
            selected={postVisibility} 
            onSelect={setPostVisibility} 
          />
          <VisibilityOption 
            label="Private" 
            value="private" 
            selected={postVisibility} 
            onSelect={setPostVisibility} 
          />
        </View>
      </Card>
      
      <Card style={styles.settingsCard}>
        <Text style={styles.sectionTitle}>Email Visibility</Text>
        <Text style={styles.sectionDescription}>Who can see your email address?</Text>
        
        <View style={styles.optionsContainer}>
          <VisibilityOption 
            label="Public" 
            value="public" 
            selected={emailVisibility} 
            onSelect={setEmailVisibility} 
          />
          <VisibilityOption 
            label="Friends Only" 
            value="friends" 
            selected={emailVisibility} 
            onSelect={setEmailVisibility} 
          />
          <VisibilityOption 
            label="Private" 
            value="private" 
            selected={emailVisibility} 
            onSelect={setEmailVisibility} 
          />
        </View>
      </Card>
      
      <Card style={styles.settingsCard}>
        <Text style={styles.sectionTitle}>Activity Status</Text>
        <Text style={styles.sectionDescription}>Show when you are online or active?</Text>
        
        <TouchableOpacity 
          style={styles.toggleItem}
          onPress={() => setActivityStatus(!activityStatus)}
        >
          <Text style={styles.toggleText}>{activityStatus ? 'On' : 'Off'}</Text>
          <View style={[
            styles.toggleSwitch,
            activityStatus && styles.toggleSwitchActive
          ]}>
            <View style={[
              styles.toggleKnob,
              activityStatus && styles.toggleKnobActive
            ]} />
          </View>
        </TouchableOpacity>
      </Card>
      
      <Card style={styles.settingsCard}>
        <Text style={styles.sectionTitle}>Data & Privacy</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Manage Account Data</Text>
          <ChevronRight size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Delete Account</Text>
          <ChevronRight size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </Card>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="Save Changes" 
          onPress={handleSaveChanges} 
          style={styles.saveButton}
        />
        <Button 
          title="Cancel" 
          variant="outline"
          onPress={() => router.back()} 
          style={styles.cancelButton}
        />
      </View>
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
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  settingsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  optionsContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.card,
  },
  selectedOption: {
    backgroundColor: `${colors.primary}10`,
  },
  optionText: {
    fontSize: 16,
    color: colors.text,
  },
  selectedOptionText: {
    color: colors.primary,
    fontWeight: '500',
  },
  toggleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toggleText: {
    fontSize: 16,
    color: colors.text,
  },
  toggleSwitch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.border,
    padding: 2,
    justifyContent: 'center',
  },
  toggleSwitchActive: {
    backgroundColor: `${colors.secondary}50`,
  },
  toggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleKnobActive: {
    backgroundColor: colors.secondary,
    transform: [{ translateX: 22 }],
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemText: {
    fontSize: 16,
    color: colors.text,
  },
  buttonContainer: {
    padding: 16,
    paddingTop: 0,
  },
  saveButton: {
    marginBottom: 12,
  },
  cancelButton: {},
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: colors.text,
  },
  loginButton: {
    width: '100%',
  },
});
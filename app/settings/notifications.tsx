import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Bell } from 'lucide-react-native';
import colors from '@/constants/colors';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth-store';

export default function NotificationsSettingsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [likes, setLikes] = useState(true);
  const [comments, setComments] = useState(true);
  const [follows, setFollows] = useState(true);
  const [mentions, setMentions] = useState(true);
  const [messages, setMessages] = useState(true);
  const [events, setEvents] = useState(true);
  const [groups, setGroups] = useState(true);

  const handleSaveChanges = () => {
    // In a real app, this would save the settings to a backend
    Alert.alert('Success', 'Notification settings updated successfully.', [
      { text: 'OK' }
    ]);
  };

  const ToggleItem = ({ label, value, onToggle }: { 
    label: string; 
    value: boolean; 
    onToggle: (value: boolean) => void;
  }) => (
    <TouchableOpacity 
      style={styles.toggleItem}
      onPress={() => onToggle(!value)}
    >
      <Text style={styles.toggleText}>{label}</Text>
      <View style={[
        styles.toggleSwitch,
        value && styles.toggleSwitchActive
      ]}>
        <View style={[
          styles.toggleKnob,
          value && styles.toggleKnobActive
        ]} />
      </View>
    </TouchableOpacity>
  );

  if (!user) {
    return (
      <View style={styles.container}>
        <Stack.Screen 
          options={{
            title: 'Notification Settings',
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
          title: 'Notification Settings',
        }} 
      />
      
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${colors.secondary}20` }]}>
          <Bell size={24} color={colors.secondary} />
        </View>
        <Text style={styles.title}>Notification Settings</Text>
        <Text style={styles.subtitle}>Customize which notifications you receive</Text>
      </View>
      
      <Card style={styles.settingsCard}>
        <Text style={styles.sectionTitle}>Notification Channels</Text>
        <Text style={styles.sectionDescription}>How would you like to be notified?</Text>
        
        <ToggleItem 
          label="Push Notifications" 
          value={pushNotifications} 
          onToggle={setPushNotifications} 
        />
        <ToggleItem 
          label="Email Notifications" 
          value={emailNotifications} 
          onToggle={setEmailNotifications} 
        />
      </Card>
      
      <Card style={styles.settingsCard}>
        <Text style={styles.sectionTitle}>Activity Notifications</Text>
        <Text style={styles.sectionDescription}>Get notified about activities related to you</Text>
        
        <ToggleItem 
          label="Likes on Your Posts" 
          value={likes} 
          onToggle={setLikes} 
        />
        <ToggleItem 
          label="Comments on Your Posts" 
          value={comments} 
          onToggle={setComments} 
        />
        <ToggleItem 
          label="New Followers" 
          value={follows} 
          onToggle={setFollows} 
        />
        <ToggleItem 
          label="Mentions" 
          value={mentions} 
          onToggle={setMentions} 
        />
      </Card>
      
      <Card style={styles.settingsCard}>
        <Text style={styles.sectionTitle}>Communication</Text>
        <Text style={styles.sectionDescription}>Get notified about messages and community updates</Text>
        
        <ToggleItem 
          label="New Messages" 
          value={messages} 
          onToggle={setMessages} 
        />
        <ToggleItem 
          label="Event Updates" 
          value={events} 
          onToggle={setEvents} 
        />
        <ToggleItem 
          label="Group Updates" 
          value={groups} 
          onToggle={setGroups} 
        />
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
  toggleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
    marginBottom: 8,
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
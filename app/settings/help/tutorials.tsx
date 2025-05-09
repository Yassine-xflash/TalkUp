import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { HelpCircle, PlayCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '@/constants/colors';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth-store';

export default function TutorialsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  const tutorials = [
    {
      id: '1',
      title: "Getting Started with TalkUp",
      description: "Learn the basics of setting up your profile and navigating the app",
      duration: "2 min",
    },
    {
      id: '2',
      title: "Creating and Sharing Posts",
      description: "Discover how to share your thoughts and media with the community",
      duration: "3 min",
    },
    {
      id: '3',
      title: "Joining and Managing Groups",
      description: "Understand how to find, join, and interact in community groups",
      duration: "4 min",
    },
    {
      id: '4',
      title: "Messaging and Conversations",
      description: "Learn how to connect with friends through private messages",
      duration: "2 min",
    },
    {
      id: '5',
      title: "Using Stories and Live Updates",
      description: "Share temporary updates and see what others are up to",
      duration: "3 min",
    }
  ];

  if (!user) {
    return (
      <View style={styles.container}>
        <Stack.Screen 
          options={{
            title: 'Tutorials',
          }} 
        />
        <Text style={styles.errorText}>You must be logged in to view tutorials.</Text>
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
          title: 'Tutorials',
        }} 
      />
      
      <View style={styles.header}>
        <LinearGradient
          colors={[colors.info + '20', colors.background]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBackground}
        >
          <View style={styles.iconContainer}>
            <HelpCircle size={28} color={colors.info} />
          </View>
          <Text style={styles.title}>App Tutorials</Text>
          <Text style={styles.subtitle}>Learn how to use TalkUp with these helpful videos</Text>
        </LinearGradient>
      </View>
      
      <Card style={styles.tutorialsCard}>
        <Text style={styles.sectionTitle}>Video Tutorials</Text>
        <Text style={styles.sectionDescription}>Watch these short videos to get the most out of TalkUp</Text>
        
        {tutorials.map((tutorial) => (
          <TouchableOpacity 
            key={tutorial.id}
            style={styles.tutorialItem}
            onPress={() => {
              // In a real app, this would open a video player
              alert(`Opening tutorial: ${tutorial.title}`);
            }}
          >
            <View style={styles.tutorialIcon}>
              <PlayCircle size={24} color={colors.primary} />
            </View>
            <View style={styles.tutorialContent}>
              <Text style={styles.tutorialTitle}>{tutorial.title}</Text>
              <Text style={styles.tutorialDescription}>{tutorial.description}</Text>
              <Text style={styles.tutorialDuration}>{tutorial.duration}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    marginBottom: 16,
  },
  gradientBackground: {
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    backgroundColor: colors.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  tutorialsCard: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  tutorialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tutorialIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.primary}20`,
    marginRight: 12,
  },
  tutorialContent: {
    flex: 1,
  },
  tutorialTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  tutorialDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  tutorialDuration: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 24,
    color: colors.text,
  },
  loginButton: {
    width: '100%',
    marginHorizontal: 16,
  },
});
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { HelpCircle, Mail, MessageSquare, Globe } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '@/constants/colors';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth-store';

export default function HelpSupportScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  const handleContactSupport = async () => {
    const emailUrl = "mailto:support@talkup.com";
    try {
      await Linking.openURL(emailUrl);
    } catch (error) {
      console.error("Failed to open email client", error);
    }
  };

  const handleVisitWebsite = async () => {
    const websiteUrl = "https://www.talkup.com/help";
    try {
      await Linking.openURL(websiteUrl);
    } catch (error) {
      console.error("Failed to open website", error);
    }
  };

  const faqs = [
    {
      id: '1',
      question: "How do I create a post?",
      answer: "Tap the '+' icon on the home screen or navigate to your desired group, then select 'Create Post'. You can add text, images, or other media before posting."
    },
    {
      id: '2',
      question: "How do I join a group?",
      answer: "Go to the Groups tab, browse or search for a group that interests you, then tap 'Join Group'. For private groups, your request may need approval from an admin."
    },
    {
      id: '3',
      question: "How do I reset my password?",
      answer: "If you're logged in, go to Settings > Change Password. If you've forgotten your password, tap 'Forgot Password?' on the login screen and follow the instructions."
    },
    {
      id: '4',
      question: "How do I report inappropriate content?",
      answer: "Tap the three-dot menu on any post, comment, or message, then select 'Report'. Choose the reason for your report and submit. Our team will review the content."
    }
  ];

  if (!user) {
    return (
      <View style={styles.container}>
        <Stack.Screen 
          options={{
            title: 'Help & Support',
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
          title: 'Help & Support',
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
          <Text style={styles.title}>Help & Support</Text>
          <Text style={styles.subtitle}>We're here to assist you with any issues or questions</Text>
        </LinearGradient>
      </View>
      
      <Card style={styles.contactCard}>
        <Text style={styles.sectionTitle}>Contact Support</Text>
        <Text style={styles.sectionDescription}>Reach out to our support team for personalized assistance</Text>
        
        <TouchableOpacity 
          style={[styles.contactButton, styles.emailButton]}
          onPress={handleContactSupport}
        >
          <Mail size={20} color={colors.primary} />
          <Text style={styles.contactButtonText}>Email Support</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.contactButton, styles.chatButton]}
          onPress={() => {
            // In a real app, this would open a chat interface
            router.push('/settings/help/chat');
          }}
        >
          <MessageSquare size={20} color={colors.secondary} />
          <Text style={[styles.contactButtonText, { color: colors.secondary }]}>Live Chat</Text>
        </TouchableOpacity>
      </Card>
      
      <Card style={styles.faqCard}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        <Text style={styles.sectionDescription}>Common questions and answers about using TalkUp</Text>
        
        {faqs.map((faq) => (
          <View key={faq.id} style={styles.faqItem}>
            <Text style={styles.faqQuestion}>{faq.question}</Text>
            <Text style={styles.faqAnswer}>{faq.answer}</Text>
          </View>
        ))}
      </Card>
      
      <Card style={styles.resourcesCard}>
        <Text style={styles.sectionTitle}>Additional Resources</Text>
        
        <TouchableOpacity 
          style={styles.resourceItem}
          onPress={handleVisitWebsite}
        >
          <View style={[styles.resourceIcon, { backgroundColor: `${colors.primary}20` }]}>
            <Globe size={20} color={colors.primary} />
          </View>
          <Text style={styles.resourceText}>Visit Help Center Website</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.resourceItem}
          onPress={() => {
            // In a real app, this would open tutorials
            router.push('/settings/help/tutorials');
          }}
        >
          <View style={[styles.resourceIcon, { backgroundColor: `${colors.secondary}20` }]}>
            <HelpCircle size={20} color={colors.secondary} />
          </View>
          <Text style={styles.resourceText}>View App Tutorials</Text>
        </TouchableOpacity>
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
  contactCard: {
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
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  emailButton: {
    backgroundColor: `${colors.primary}10`,
    borderColor: `${colors.primary}30`,
  },
  chatButton: {
    backgroundColor: `${colors.secondary}10`,
    borderColor: `${colors.secondary}30`,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
    color: colors.primary,
  },
  faqCard: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  faqItem: {
    marginBottom: 20,
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  resourcesCard: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resourceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  resourceText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: colors.text,
  },
  loginButton: {
    width: '100%',
    marginHorizontal: 16,
  },
});
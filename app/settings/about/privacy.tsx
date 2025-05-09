import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { Shield } from 'lucide-react-native';
import colors from '@/constants/colors';
import Card from '@/components/ui/Card';

export default function PrivacyPolicyScreen() {
  return (
    <ScrollView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Privacy Policy',
        }} 
      />
      
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${colors.warning}20` }]}>
          <Shield size={24} color={colors.warning} />
        </View>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.subtitle}>Last updated: May 9, 2025</Text>
      </View>
      
      <Card style={styles.contentCard}>
        <Text style={styles.sectionTitle}>1. Introduction</Text>
        <Text style={styles.paragraph}>
          TalkUp is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. Please read this policy carefully.
        </Text>
        
        <Text style={styles.sectionTitle}>2. Information We Collect</Text>
        <Text style={styles.paragraph}>
          We may collect information about you in a variety of ways. The information we may collect includes personal data such as your name, email address, profile information, and any other details you provide to us on the platform.
        </Text>
        
        <Text style={styles.sectionTitle}>3. How We Use Your Information</Text>
        <Text style={styles.paragraph}>
          We use the information we collect to operate and maintain the platform, communicate with you, personalize your experience, improve our services, and comply with legal obligations.
        </Text>
        
        <Text style={styles.sectionTitle}>4. Sharing Your Information</Text>
        <Text style={styles.paragraph}>
          We may share information we have collected about you in certain situations. Your information may be disclosed to third-party service providers who assist us in operating the platform, or as required by law.
        </Text>
        
        <Text style={styles.sectionTitle}>5. Security of Your Information</Text>
        <Text style={styles.paragraph}>
          We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that no security measures are perfect.
        </Text>
        
        <Text style={styles.sectionTitle}>6. Your Privacy Choices</Text>
        <Text style={styles.paragraph}>
          You may review, update, or delete the personal information in your account at any time by logging into your account settings. You may also contact us to request access to, correct, or delete any personal information that you have provided to us.
        </Text>
        
        <Text style={styles.sectionTitle}>7. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have questions or comments about this Privacy Policy, please contact us at privacy@talkup.com.
        </Text>
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
    marginBottom: 8,
  },
  contentCard: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
});
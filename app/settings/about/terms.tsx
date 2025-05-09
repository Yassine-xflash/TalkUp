import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { FileText } from 'lucide-react-native';
import colors from '@/constants/colors';
import Card from '@/components/ui/Card';

export default function TermsOfServiceScreen() {
  return (
    <ScrollView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Terms of Service',
        }} 
      />
      
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${colors.info}20` }]}>
          <FileText size={24} color={colors.info} />
        </View>
        <Text style={styles.title}>Terms of Service</Text>
        <Text style={styles.subtitle}>Last updated: May 9, 2025</Text>
      </View>
      
      <Card style={styles.contentCard}>
        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.paragraph}>
          By accessing or using TalkUp, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this platform.
        </Text>
        
        <Text style={styles.sectionTitle}>2. Use License</Text>
        <Text style={styles.paragraph}>
          Permission is granted to temporarily download one copy of the materials (information or software) on TalkUp's platform for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
        </Text>
        
        <Text style={styles.sectionTitle}>3. User Conduct</Text>
        <Text style={styles.paragraph}>
          You agree to use TalkUp only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the platform. Prohibited behavior includes harassing or causing distress or inconvenience to any other user.
        </Text>
        
        <Text style={styles.sectionTitle}>4. Content Ownership</Text>
        <Text style={styles.paragraph}>
          All content posted on TalkUp remains the property of the original creator. By posting content, you grant TalkUp a non-exclusive, royalty-free license to use, store, and display this content within the platform.
        </Text>
        
        <Text style={styles.sectionTitle}>5. Termination</Text>
        <Text style={styles.paragraph}>
          We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
        </Text>
        
        <Text style={styles.sectionTitle}>6. Governing Law</Text>
        <Text style={styles.paragraph}>
          These Terms shall be governed and construed in accordance with the laws of Morocco, without regard to its conflict of law provisions.
        </Text>
        
        <Text style={styles.sectionTitle}>7. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions about these Terms, please contact us at support@talkup.com.
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
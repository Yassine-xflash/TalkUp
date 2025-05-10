import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Info, Globe, Heart } from 'lucide-react-native';
import colors from '@/constants/colors';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function AboutScreen() {
  const router = useRouter();

  const handleVisitWebsite = async () => {
    const websiteUrl = "https://www.talkup.com";
    try {
      await Linking.openURL(websiteUrl);
    } catch (error) {
      console.error("Failed to open website", error);
    }
  };

  const appInfo = {
    version: "1.0.0",
    build: "1001",
    releaseDate: "May 9, 2025",
    developer: "TalkUp Team",
    mission: "TalkUp is a social platform designed specifically for the ENSA Fès community. Our goal is to foster connection, collaboration, and communication among students, faculty, and alumni of ENSA Fès."
  };

  const teamMembers = [
    { id: '1', name: "Yassine Moulat El Ali", role: "Lead Developer & UI/UX Designer" },
    { id: '2', name: "Abdellah Tahri", role: "Lead Developer & UI/UX Designer" }
  ];

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'About TalkUp',
        }} 
      />
      
      <View style={styles.header}>
        <Image 
          source={{ 
            uri: 'https://media-hosting.imagekit.io/bdce9eed61dd4e06/d10077a3-a197-4a19-88fe-e88fa9437e8e-removebg-preview.png?Expires=1841440791&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=L8BwPMyy3B4M9CXXCG6dx6U3-o3ankbUem6BhM82ceaO3zpxNXzvWrr0Q-aATG7fvc65n3~P-i2YZ~7nfIEGt05sSL9iJfbOE9f0fYZOHnNkwTVGjVtnvuPcZRSl4sBvscVSyAYvC6FVV17~6olljaPu4sl63DqKKW~sCSXbQvZQc~kdp0Nh0oCkypUj-p57I~M5Q2B2aT8epO54qGuBJrqFubUQTIqqCFCTltdWly-FOwuYcPkryEuxiTd9k2zbx0qfU2hppY~FhYsBMLDkOx8omljqMP1TGeqwRLbQSreNc5EWICyvFk9NWtnvm9qzhO6ijVpGb8W0nzsce4qD8w__'
          }}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.version}>Version {appInfo.version} (Build {appInfo.build})</Text>
      </View>
      
      <Card style={styles.missionCard}>
        <Text style={styles.sectionTitle}>Our Mission</Text>
        <Text style={styles.missionText}>{appInfo.mission}</Text>
        <Text style={styles.releaseDate}>Released: {appInfo.releaseDate}</Text>
      </Card>
      
      <Card style={styles.teamCard}>
        <Text style={styles.sectionTitle}>Our Team</Text>
        <Text style={styles.sectionDescription}>Meet the people behind TalkUp</Text>
        
        {teamMembers.map((member) => (
          <View key={member.id} style={styles.teamMember}>
            <View style={styles.memberAvatar}>
              <Text style={styles.memberInitial}>{member.name.charAt(0)}</Text>
            </View>
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberRole}>{member.role}</Text>
            </View>
          </View>
        ))}
      </Card>
      
      <Card style={styles.creditsCard}>
        <Text style={styles.sectionTitle}>Credits & Thanks</Text>
        <Text style={styles.creditsText}>
          Special thanks to the ENSA Fès administration for their support, and to our beta testers and early adopters for their valuable feedback.
        </Text>
        <Text style={styles.creditsText}>
          Built with <Heart size={14} color={colors.error} /> in Fès, Morocco
        </Text>
      </Card>
      
      <Card style={styles.linksCard}>
        <Text style={styles.sectionTitle}>More Information</Text>
        
        <TouchableOpacity 
          style={styles.linkItem}
          onPress={handleVisitWebsite}
        >
          <View style={[styles.linkIcon, { backgroundColor: `${colors.primary}20` }]}>
            <Globe size={20} color={colors.primary} />
          </View>
          <Text style={styles.linkText}>Visit Our Website</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.linkItem}
          onPress={() => {
            router.push('/settings/about/terms');
          }}
        >
          <View style={[styles.linkIcon, { backgroundColor: `${colors.info}20` }]}>
            <Info size={20} color={colors.info} />
          </View>
          <Text style={styles.linkText}>Terms of Service</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.linkItem}
          onPress={() => {
            router.push('/settings/about/privacy');
          }}
        >
          <View style={[styles.linkIcon, { backgroundColor: `${colors.warning}20` }]}>
            <Info size={20} color={colors.warning} />
          </View>
          <Text style={styles.linkText}>Privacy Policy</Text>
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
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  version: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  missionCard: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  missionText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  releaseDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  teamCard: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  teamMember: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  memberInitial: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  memberRole: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  creditsCard: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  creditsText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  linksCard: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  linkIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  linkText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
});
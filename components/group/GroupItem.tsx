import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Group } from '@/types';
import Card from '@/components/ui/Card';
import colors from '@/constants/colors';
import { Users } from 'lucide-react-native';

interface GroupItemProps {
  group: Group;
  onPress: () => void;
}

const GroupItem: React.FC<GroupItemProps> = ({ group, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card style={styles.container} padded={false}>
        {group.coverImage ? (
          <Image 
            source={{ uri: group.coverImage }} 
            style={styles.coverImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.coverImage, styles.coverPlaceholder]} />
        )}
        
        <View style={styles.content}>
          <View style={styles.avatarContainer}>
            {group.avatar ? (
              <Image 
                source={{ uri: group.avatar }} 
                style={styles.avatar}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarText}>{group.name.charAt(0)}</Text>
              </View>
            )}
          </View>
          
          <View style={styles.info}>
            <Text style={styles.name}>{group.name}</Text>
            <Text style={styles.description} numberOfLines={2}>
              {group.description}
            </Text>
            
            <View style={styles.stats}>
              <Users size={14} color={colors.textSecondary} />
              <Text style={styles.statsText}>
                {group.members.length} {group.members.length === 1 ? 'member' : 'members'}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: 100,
  },
  coverPlaceholder: {
    backgroundColor: colors.border,
  },
  content: {
    padding: 16,
    flexDirection: 'row',
  },
  avatarContainer: {
    marginTop: -40,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: colors.card,
  },
  avatarPlaceholder: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
});

export default GroupItem;
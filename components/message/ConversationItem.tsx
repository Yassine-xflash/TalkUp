import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Avatar from '@/components/ui/Avatar';
import colors from '@/constants/colors';
import { formatMessageTime } from '@/utils/date';
import { Message } from '@/types';

interface ConversationItemProps {
  user: {
    id: string;
    name: string;
    avatar?: string;
    department?: string;
  };
  lastMessage: Message;
  unreadCount: number;
  onPress: () => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({ 
  user, 
  lastMessage, 
  unreadCount, 
  onPress 
}) => {
  const isImage = lastMessage.mediaType === 'image';
  const messagePreview = isImage 
    ? '📷 Image' 
    : lastMessage.content || '';
  
  return (
    <TouchableOpacity 
      style={[
        styles.container,
        unreadCount > 0 && styles.unreadContainer
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <Avatar 
          source={user.avatar} 
          name={user.name} 
          size={56} 
        />
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.nameText} numberOfLines={1}>
            {user.name}
          </Text>
          <Text style={styles.timeText}>
            {formatMessageTime(lastMessage.createdAt, true)}
          </Text>
        </View>
        
        <View style={styles.previewContainer}>
          <Text 
            style={[
              styles.previewText,
              unreadCount > 0 && styles.unreadPreviewText
            ]} 
            numberOfLines={1}
          >
            {messagePreview}
          </Text>
          
          {user.department && (
            <View style={styles.departmentContainer}>
              <Text style={styles.departmentText}>
                {user.department}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.card,
  },
  unreadContainer: {
    backgroundColor: `${colors.primary}10`,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.card,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  timeText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  previewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewText: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
    marginRight: 8,
  },
  unreadPreviewText: {
    color: colors.text,
    fontWeight: '500',
  },
  departmentContainer: {
    backgroundColor: `${colors.secondary}20`,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  departmentText: {
    fontSize: 10,
    color: colors.secondary,
    fontWeight: '500',
  },
});

export default ConversationItem;
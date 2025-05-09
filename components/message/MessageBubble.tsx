import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Message } from '@/types';
import colors from '@/constants/colors';
import { formatMessageTime } from '@/utils/date';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isCurrentUser }) => {
  const hasMedia = message.media && message.media.length > 0;
  const hasText = message.content && message.content.trim().length > 0;
  
  return (
    <View style={[
      styles.container,
      isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer
    ]}>
      <View style={[
        styles.bubble,
        isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble,
        (!hasText && hasMedia) && styles.mediaBubble
      ]}>
        {hasMedia && message.mediaType === 'image' && (
          <View style={styles.mediaContainer}>
            {message.media.map((uri, index) => (
              <TouchableOpacity key={index} activeOpacity={0.9}>
                <Image 
                  source={{ uri }} 
                  style={styles.mediaImage} 
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        {hasText && (
          <Text style={[
            styles.messageText,
            isCurrentUser ? styles.currentUserText : styles.otherUserText
          ]}>
            {message.content}
          </Text>
        )}
        
        <Text style={[
          styles.timeText,
          isCurrentUser ? styles.currentUserTimeText : styles.otherUserTimeText
        ]}>
          {formatMessageTime(message.createdAt)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    maxWidth: '80%',
  },
  currentUserContainer: {
    alignSelf: 'flex-end',
  },
  otherUserContainer: {
    alignSelf: 'flex-start',
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    paddingBottom: 24, // Space for the time
  },
  currentUserBubble: {
    backgroundColor: colors.primary,
  },
  otherUserBubble: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mediaBubble: {
    padding: 4,
    paddingBottom: 18, // Space for the time
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  currentUserText: {
    color: '#FFFFFF',
  },
  otherUserText: {
    color: colors.text,
  },
  timeText: {
    fontSize: 11,
    position: 'absolute',
    bottom: 6,
    right: 12,
  },
  currentUserTimeText: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  otherUserTimeText: {
    color: colors.textSecondary,
  },
  mediaContainer: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  mediaImage: {
    width: 200,
    height: 200,
    borderRadius: 14,
  },
});

export default MessageBubble;
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Comment, User } from '@/types';
import Avatar from '@/components/ui/Avatar';
import colors from '@/constants/colors';
import { formatTimeAgo } from '@/utils/date';

interface CommentItemProps {
  comment: Comment;
  user: User;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, user }) => {
  return (
    <View style={styles.container}>
      <Avatar source={user.avatar} name={user.name} size={32} />
      <View style={styles.contentContainer}>
        <View style={styles.bubble}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.content}>{comment.content}</Text>
        </View>
        <Text style={styles.timestamp}>{formatTimeAgo(comment.createdAt)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  contentContainer: {
    flex: 1,
    marginLeft: 8,
  },
  bubble: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 12,
  },
  userName: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 2,
    color: colors.text,
  },
  content: {
    fontSize: 14,
    color: colors.text,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    marginLeft: 8,
  },
});

export default CommentItem;
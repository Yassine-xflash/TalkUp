import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Send } from 'lucide-react-native';
import PostItem from '@/components/post/PostItem';
import CommentItem from '@/components/post/CommentItem';
import colors from '@/constants/colors';
import { useFeedStore } from '@/store/feed-store';
import { useAuthStore } from '@/store/auth-store';

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { posts, getUserById, addComment } = useFeedStore();
  const { user } = useAuthStore();
  const [comment, setComment] = useState('');
  const [post, setPost] = useState<any>(null);
  const [postUser, setPostUser] = useState<any>(null);

  useEffect(() => {
    const foundPost = posts.find(p => p.id === id);
    if (foundPost) {
      setPost(foundPost);
      const userData = getUserById(foundPost.userId);
      setPostUser(userData);
    }
  }, [id, posts]);

  const handleCommentSubmit = async () => {
    if (!user || !comment.trim()) return;

    try {
      await addComment(post.id, user.id, comment);
      setComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleUserPress = (userId: string) => {
    router.push(`/profile/${userId}`);
  };

  if (!post || !postUser) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: `${postUser.name}'s Post`,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
        }} 
      />
      <ScrollView style={styles.content}>
        <PostItem 
          post={post} 
          user={postUser} 
          onUserPress={handleUserPress}
        />
        
        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>Comments</Text>
          {post.comments.length > 0 ? (
            post.comments.map((comment: any) => {
              const commentUser = getUserById(comment.userId);
              if (!commentUser) return null;
              return (
                <CommentItem 
                  key={comment.id} 
                  comment={comment} 
                  user={commentUser} 
                />
              );
            })
          ) : (
            <Text style={styles.noComments}>No comments yet. Be the first to comment!</Text>
          )}
        </View>
      </ScrollView>
      
      {user && (
        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="Add a comment..."
            placeholderTextColor={colors.textSecondary}
            value={comment}
            onChangeText={setComment}
          />
          <TouchableOpacity 
            style={styles.sendButton}
            onPress={handleCommentSubmit}
            disabled={!comment.trim()}
          >
            <Send size={20} color={comment.trim() ? colors.primary : colors.textSecondary} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  backButton: {
    padding: 8,
  },
  commentsSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 16,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  noComments: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    padding: 20,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
  },
  commentInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    marginRight: 12,
  },
  sendButton: {
    padding: 8,
  },
});
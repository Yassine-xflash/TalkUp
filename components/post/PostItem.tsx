import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, Alert } from 'react-native';
import { MessageCircle, Share2, ThumbsUp, MoreHorizontal, Trash2, Flag, BookmarkPlus } from 'lucide-react-native';
import { Post, User } from '@/types';
import Avatar from '@/components/ui/Avatar';
import Card from '@/components/ui/Card';
import colors from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';
import { useFeedStore } from '@/store/feed-store';
import { formatTimeAgo } from '@/utils/date';
import { useRouter } from 'expo-router';

interface PostItemProps {
  post: Post;
  user: User;
  onUserPress?: (userId: string) => void;
  onCommentPress?: () => void;
}

const PostItem: React.FC<PostItemProps> = ({ 
  post, 
  user, 
  onUserPress,
  onCommentPress,
}) => {
  const currentUser = useAuthStore(state => state.user);
  const { likePost, unlikePost, deletePost } = useFeedStore();
  const router = useRouter();
  const [showOptions, setShowOptions] = useState(false);
  
  const isLiked = currentUser ? post.likes.includes(currentUser.id) : false;
  const isOwnPost = currentUser?.id === post.userId;
  
  const toggleLike = () => {
    if (!currentUser) {
      router.push('/auth/login');
      return;
    }
    
    if (isLiked) {
      unlikePost(post.id, currentUser.id);
    } else {
      likePost(post.id, currentUser.id);
    }
  };

  const handleShare = async () => {
    if (Platform.OS === 'web') {
      try {
        await navigator.share({
          title: "Check out this post",
          text: post.content,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // For native, you would implement platform-specific sharing
      Alert.alert('Share', 'Coming soon!');
    }
  };

  const handleCommentPress = () => {
    if (!currentUser) {
      router.push('/auth/login');
      return;
    }
    router.push(`/post/${post.id}`);
  };

  const handleUserPress = () => {
    router.push(`/profile/${user.id}`);
  };

  const handleOptionsPress = () => {
    setShowOptions(true);
    
    // Show different options based on whether it's the user's own post
    const options = isOwnPost 
      ? ['Delete Post', 'Share', 'Save', 'Cancel']
      : ['Report Post', 'Share', 'Save', 'Cancel'];
    
    const destructiveButtonIndex = isOwnPost ? 0 : 0;
    const cancelButtonIndex = options.length - 1;

    if (Platform.OS === 'web') {
      // For web, show a simple alert
      const action = window.confirm(isOwnPost ? 'Delete this post?' : 'Report this post?');
      if (action && isOwnPost) {
        handleDeletePost();
      }
      setShowOptions(false);
      return;
    }

    Alert.alert(
      'Post Options',
      '',
      options.map((option, index) => ({
        text: option,
        onPress: () => {
          if (index === destructiveButtonIndex) {
            if (isOwnPost) {
              handleDeletePost();
            } else {
              handleReportPost();
            }
          } else if (option === 'Share') {
            handleShare();
          } else if (option === 'Save') {
            handleSavePost();
          }
          setShowOptions(false);
        },
        style: index === destructiveButtonIndex ? 'destructive' : 
               index === cancelButtonIndex ? 'cancel' : 'default'
      }))
    );
  };

  const handleDeletePost = () => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deletePost(post.id);
            // Optionally navigate back if on post detail page
            if (router.canGoBack()) {
              router.back();
            }
          }
        }
      ]
    );
  };

  const handleReportPost = () => {
    Alert.alert(
      'Report Post',
      'Are you sure you want to report this post?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Report',
          style: 'destructive',
          onPress: () => {
            // Implement report functionality
            Alert.alert('Thank you', 'We have received your report and will review it shortly.');
          }
        }
      ]
    );
  };

  const handleSavePost = () => {
    Alert.alert('Success', 'Post saved to your bookmarks!');
  };

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.userInfo}
          onPress={handleUserPress}
        >
          <Avatar source={user.avatar} name={user.name} size={40} />
          <View style={styles.userMeta}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.timestamp}>
              {formatTimeAgo(post.createdAt)} · {user.department || user.major}
            </Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.moreButton}
          onPress={handleOptionsPress}
        >
          <MoreHorizontal size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.content}>{post.content}</Text>
      
      {post.media && post.media.length > 0 && (
        <View style={styles.mediaContainer}>
          <Image 
            source={{ uri: post.media[0] }} 
            style={styles.media}
            resizeMode="cover"
          />
        </View>
      )}
      
      <View style={styles.stats}>
        <View style={styles.likesContainer}>
          <View style={styles.avatarStack}>
            {post.likes.slice(0, 3).map((like, index) => (
              <View key={like} style={[styles.stackedAvatar, { zIndex: 3 - index }]}>
                <Avatar size={20} name={`User ${index}`} />
              </View>
            ))}
          </View>
          <Text style={styles.statsText}>{post.likes.length} likes</Text>
        </View>
        <TouchableOpacity onPress={handleCommentPress}>
          <Text style={styles.statsText}>
            {post.comments.length} comments
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={toggleLike}
        >
          <ThumbsUp 
            size={20} 
            color={isLiked ? colors.like : colors.textSecondary}
            fill={isLiked ? colors.like : 'none'}
          />
          <Text style={[
            styles.actionText,
            isLiked && styles.activeActionText
          ]}>Like</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleCommentPress}
        >
          <MessageCircle size={20} color={colors.textSecondary} />
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleShare}
        >
          <Share2 size={20} color={colors.textSecondary} />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userMeta: {
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  moreButton: {
    padding: 4,
  },
  content: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  mediaContainer: {
    marginHorizontal: -16,
    marginBottom: 12,
    backgroundColor: colors.background,
  },
  media: {
    width: '100%',
    height: 300,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarStack: {
    flexDirection: 'row',
    marginRight: 8,
  },
  stackedAvatar: {
    marginLeft: -8,
    borderWidth: 2,
    borderColor: colors.card,
    borderRadius: 10,
  },
  statsText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  actionText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.textSecondary,
  },
  activeActionText: {
    color: colors.like,
  },
});

export default PostItem;
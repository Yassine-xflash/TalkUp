import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
  Modal,
  FlatList,
  ScrollView,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Eye, MoreHorizontal } from 'lucide-react-native';
import Avatar from '@/components/ui/Avatar';
import { useStoriesStore } from '@/store/stories-store';
import { useAuthStore } from '@/store/auth-store';
import { formatDistanceToNow } from '@/utils/date';
import colors from '@/constants/colors';

const { width, height } = Dimensions.get('window');
const PROGRESS_BAR_WIDTH = width - 32;
const STORY_DURATION = 5000; // 5 seconds per story

export default function StoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const { stories, viewStory, getStoriesByUserId, getViewersByStoryId } = useStoriesStore();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showViewers, setShowViewers] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [paused, setPaused] = useState(false);

  const userStories = getStoriesByUserId(id);
  const currentStory = userStories[currentIndex];
  const viewers = currentStory ? getViewersByStoryId(currentStory.id) : [];

  useEffect(() => {
    if (!currentStory || !user) return;

    // Mark story as viewed
    viewStory(currentStory.id, user.id);

    progressAnim.setValue(0);
    
    const animation = Animated.timing(progressAnim, {
      toValue: 1,
      duration: STORY_DURATION,
      useNativeDriver: false,
    });

    if (!paused) {
      animation.start(({ finished }) => {
        if (finished) {
          if (currentIndex < userStories.length - 1) {
            setCurrentIndex(currentIndex + 1);
          } else {
            router.back();
          }
        }
      });
    }

    return () => animation.stop();
  }, [currentIndex, paused, currentStory, user]);

  const handlePress = (evt: any) => {
    const x = evt.nativeEvent.locationX;
    if (x < width / 2) {
      // Pressed left side
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      } else {
        router.back();
      }
    } else {
      // Pressed right side
      if (currentIndex < userStories.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        router.back();
      }
    }
  };

  const handleLongPress = () => {
    setPaused(true);
  };

  const handlePressOut = () => {
    setPaused(false);
  };

  if (!currentStory) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: false,
        }} 
      />

      <TouchableOpacity
        activeOpacity={1}
        style={styles.storyContainer}
        onPress={handlePress}
        onLongPress={handleLongPress}
        onPressOut={handlePressOut}
      >
        <Image
          source={{ uri: currentStory.media }}
          style={styles.media}
          resizeMode="cover"
        />

        <View style={styles.overlay}>
          {/* Progress bars */}
          <View style={styles.progressContainer}>
            {userStories.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressBar,
                  { width: (PROGRESS_BAR_WIDTH - (userStories.length - 1) * 4) / userStories.length }
                ]}
              >
                <Animated.View
                  style={[
                    styles.progressFill,
                    {
                      width: index === currentIndex 
                        ? progressAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0%', '100%'],
                          })
                        : index < currentIndex ? '100%' : '0%',
                    }
                  ]}
                />
              </View>
            ))}
          </View>

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ChevronLeft size={28} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.userInfo}>
              <Avatar
                source={currentStory.userAvatar}
                name={currentStory.userName}
                size={32}
              />
              <Text style={styles.userName}>{currentStory.userName}</Text>
              <Text style={styles.timestamp}>
                {formatDistanceToNow(currentStory.createdAt)}
              </Text>
            </View>

            <TouchableOpacity 
              style={styles.viewersButton}
              onPress={() => setShowViewers(true)}
            >
              <Eye size={20} color="#FFFFFF" />
              <Text style={styles.viewCount}>{viewers.length}</Text>
            </TouchableOpacity>
          </View>

          {/* Caption */}
          {currentStory.caption && (
            <View style={styles.captionContainer}>
              <Text style={styles.caption}>{currentStory.caption}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* Viewers Modal */}
      <Modal
        visible={showViewers}
        transparent
        animationType="slide"
        onRequestClose={() => setShowViewers(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Views</Text>
              <TouchableOpacity onPress={() => setShowViewers(false)}>
                <Text style={styles.closeButton}>Close</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={viewers}
              keyExtractor={(item) => item.user.id}
              renderItem={({ item }) => (
                <View style={styles.viewerItem}>
                  <Avatar
                    source={item.user.avatar}
                    name={item.user.name}
                    size={40}
                  />
                  <View style={styles.viewerInfo}>
                    <Text style={styles.viewerName}>{item.user.name}</Text>
                    <Text style={styles.viewTime}>
                      {formatDistanceToNow(item.timestamp)}
                    </Text>
                  </View>
                </View>
              )}
              contentContainerStyle={styles.viewersList}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  storyContainer: {
    flex: 1,
  },
  media: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 48 : 16,
    marginBottom: 8,
  },
  progressBar: {
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  timestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginLeft: 8,
  },
  viewersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 16,
  },
  viewCount: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 4,
  },
  captionContainer: {
    position: 'absolute',
    bottom: 48,
    left: 16,
    right: 16,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 8,
  },
  caption: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    color: colors.primary,
    fontSize: 16,
  },
  viewersList: {
    padding: 16,
  },
  viewerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewerInfo: {
    marginLeft: 12,
    flex: 1,
  },
  viewerName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  viewTime: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
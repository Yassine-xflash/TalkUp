import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  SectionList,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { MessageSquare, Heart, UserPlus } from 'lucide-react-native';
import { useNotificationsStore } from '@/store/notifications-store';
import { useAuthStore } from '@/store/auth-store';
import Avatar from '@/components/ui/Avatar';
import colors from '@/constants/colors';
import { formatTimeAgo } from '@/utils/date';

// Helper function to group notifications by date
const groupNotificationsByDate = (notifications: any[]) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const groups = notifications.reduce((acc: any, notification) => {
    const date = new Date(notification.createdAt);
    date.setHours(0, 0, 0, 0);
    
    let title = '';
    if (date.getTime() === today.getTime()) {
      title = 'TODAY';
    } else if (date.getTime() === yesterday.getTime()) {
      title = 'YESTERDAY';
    } else {
      title = 'OLDER';
    }
    
    if (!acc[title]) {
      acc[title] = [];
    }
    acc[title].push(notification);
    return acc;
  }, {});
  
  return Object.entries(groups).map(([title, data]) => ({
    title,
    data: data as any[],
  }));
};

// Notification icon based on type
const NotificationIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'message':
      return <MessageSquare size={16} color={colors.primary} />;
    case 'like':
      return <Heart size={16} color={colors.like} />;
    case 'follow':
      return <UserPlus size={16} color={colors.primary} />;
    default:
      return null;
  }
};

// Notification message based on type
const getNotificationMessage = (type: string) => {
  switch (type) {
    case 'message':
      return 'sent you a message';
    case 'like':
      return 'liked your post';
    case 'comment':
      return 'left a comment on your story';
    case 'follow':
      return 'started following you';
    default:
      return '';
  }
};

export default function NotificationsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { notifications, isLoading, fetchNotifications, markAllAsRead } = useNotificationsStore();
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    if (user) {
      fetchNotifications(user.id);
    }
  }, [user]);
  
  const handleRefresh = async () => {
    if (!user) return;
    
    setRefreshing(true);
    await fetchNotifications(user.id);
    setRefreshing(false);
  };
  
  const handleNotificationPress = (notification: any) => {
    // Handle navigation based on notification type
    switch (notification.type) {
      case 'message':
        router.push(`/conversation/${notification.referenceId}`);
        break;
      case 'post':
        router.push(`/post/${notification.referenceId}`);
        break;
      case 'story':
        router.push(`/story/${notification.referenceId}`);
        break;
      default:
        break;
    }
  };
  
  if (!user) {
    return (
      <View style={styles.authContainer}>
        <Text style={styles.authText}>
          Please sign in to view your notifications
        </Text>
      </View>
    );
  }
  
  const groupedNotifications = groupNotificationsByDate(notifications);
  
  return (
    <View style={styles.container}>
      <SectionList
        sections={groupedNotifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.notificationItem,
              !item.read && styles.unreadNotification
            ]}
            onPress={() => handleNotificationPress(item)}
          >
            <Avatar
              source={item.avatar}
              name={item.name || "User"}
              size={40}
            />
            
            <View style={styles.notificationContent}>
              <View style={styles.notificationHeader}>
                <Text style={styles.notificationName}>
                  {item.name}
                </Text>
                <Text style={styles.notificationTime}>
                  {formatTimeAgo(item.createdAt)}
                </Text>
              </View>
              
              <View style={styles.notificationMessage}>
                <NotificationIcon type={item.type} />
                <Text style={styles.notificationText}>
                  {getNotificationMessage(item.type)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  authText: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 16,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.background,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.background,
  },
  unreadNotification: {
    backgroundColor: `${colors.primary}08`,
  },
  notificationContent: {
    flex: 1,
    marginLeft: 12,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  notificationTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  notificationMessage: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 6,
  },
});
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback, FlatList, Platform } from 'react-native';
import { Menu, Bell, Search, Home, Users, Calendar, MessageCircle, User, Settings, LogOut } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import colors from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';
import { SafeAreaView } from 'react-native-safe-area-context';

export const CustomHeader = () => {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [menuVisible, setMenuVisible] = useState(false);

  const menuItems = [
    { id: 'home', title: 'Home', icon: Home, path: '/(tabs)' },
    { id: 'groups', title: 'Groups', icon: Users, path: '/(tabs)/groups' },
    { id: 'games', title: 'Games', icon: Calendar, path: '/(tabs)/games' },
    { id: 'messages', title: 'Messages', icon: MessageCircle, path: '/(tabs)/messages' },
    { id: 'profile', title: 'Profile', icon: User, path: '/(tabs)/profile' },
    { id: 'settings', title: 'Settings', icon: Settings, path: '/settings' },
    ...(user ? [{ id: 'logout', title: 'Logout', icon: LogOut, action: () => {
      logout();
      router.replace('/auth/login');
    } }] : []),
  ];

  const renderMenuItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => {
        if (item.action) {
          item.action();
        } else {
          router.push(item.path);
        }
        setMenuVisible(false);
      }}
    >
      <View style={styles.menuIconContainer}>
        <item.icon size={20} color={item.id === 'logout' ? colors.error : colors.primary} />
      </View>
      <Text style={[styles.menuText, item.id === 'logout' && { color: colors.error }]}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.iconButton}>
          <Menu size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>TalkUp</Text>
        </View>

        <View style={styles.rightContainer}>
          <TouchableOpacity 
            onPress={() => router.push('/search')} 
            style={styles.iconButton}
          >
            <Search size={24} color={colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => router.push('/notifications')} 
            style={styles.iconButton}
          >
            <Bell size={24} color={colors.text} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={menuVisible}
          onRequestClose={() => setMenuVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.menuContainer}>
                <Text style={styles.menuTitle}>Navigation</Text>
                <FlatList
                  data={menuItems}
                  renderItem={renderMenuItem}
                  keyExtractor={item => item.id}
                  style={styles.menuList}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingTop: Platform.OS === 'ios' ? 0 : 12,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  menuContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginTop: 60,
    marginLeft: 16,
    width: 250,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    paddingLeft: 8,
  },
  menuList: {
    flexGrow: 0,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${colors.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
    color: colors.text,
  },
});
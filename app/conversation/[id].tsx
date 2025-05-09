import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Text,
  Image
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Image as ImageIcon, Send, ArrowLeft, MoreVertical, Phone, Video } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useMessagesStore } from '@/store/messages-store';
import { useAuthStore } from '@/store/auth-store';
import MessageBubble from '@/components/message/MessageBubble';
import Avatar from '@/components/ui/Avatar';
import colors from '@/constants/colors';

export default function ConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  
  const { user } = useAuthStore();
  const { 
    currentConversation, 
    currentRecipient, 
    isLoading, 
    fetchConversation, 
    sendMessage, 
    markAsRead 
  } = useMessagesStore();
  
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    if (user && id) {
      fetchConversation(user.id, id);
    }
  }, [user, id]);
  
  useEffect(() => {
    if (currentConversation.length > 0 && user) {
      const unreadMessageIds = currentConversation
        .filter(msg => !msg.read && msg.senderId === id)
        .map(msg => msg.id);
      
      if (unreadMessageIds.length > 0) {
        markAsRead(unreadMessageIds);
      }
    }
  }, [currentConversation, user, id]);
  
  const handleSend = () => {
    if (!user || !id || !message.trim()) return;
    
    sendMessage(user.id, id, message.trim());
    setMessage('');
    
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };
  
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      if (user && id) {
        sendMessage(user.id, id, '', [result.assets[0].uri], 'image');
      }
    }
  };
  
  if (!user) {
    return (
      <View style={styles.authContainer}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' }}
          style={styles.authImage}
        />
        <Text style={styles.authTitle}>Sign in Required</Text>
        <Text style={styles.authText}>
          Please sign in to view and send messages
        </Text>
        <TouchableOpacity 
          style={styles.authButton}
          onPress={() => router.push('/auth/login')}
        >
          <Text style={styles.authButtonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  if (isLoading && currentConversation.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <Stack.Screen 
        options={{
          headerTitle: () => (
            <TouchableOpacity 
              style={styles.headerTitle}
              onPress={() => router.push(`/profile/${id}`)}
            >
              <Avatar 
                source={currentRecipient?.avatar} 
                name={currentRecipient?.name} 
                size={36} 
              />
              <View style={styles.headerInfo}>
                <Text style={styles.headerName}>{currentRecipient?.name}</Text>
                {currentRecipient?.department && (
                  <Text style={styles.headerSubtitle}>
                    {currentRecipient.department}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ),
          headerTitleAlign: 'left',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerLeft: () => (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.headerRightContainer}>
              <TouchableOpacity style={styles.headerButton}>
                <Phone size={22} color={colors.text} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <Video size={22} color={colors.text} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <MoreVertical size={22} color={colors.text} />
              </TouchableOpacity>
            </View>
          ),
        }} 
      />
      
      <FlatList
        ref={flatListRef}
        data={currentConversation}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MessageBubble 
            message={item} 
            isCurrentUser={item.senderId === user.id}
          />
        )}
        contentContainerStyle={styles.messagesList}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No messages yet. Start the conversation!
            </Text>
          </View>
        }
      />
      
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton} onPress={pickImage}>
          <ImageIcon size={24} color={colors.textSecondary} />
        </TouchableOpacity>
        
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor={colors.textSecondary}
          value={message}
          onChangeText={setMessage}
          multiline
        />
        
        <TouchableOpacity 
          style={[
            styles.sendButton,
            !message.trim() && styles.sendButtonDisabled
          ]} 
          onPress={handleSend}
          disabled={!message.trim()}
        >
          <Send size={20} color={message.trim() ? colors.primary : colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 24,
  },
  authImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
  },
  authTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  authText: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  authButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  authButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerInfo: {
    marginLeft: 12,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  headerRightContainer: {
    flexDirection: 'row',
  },
  messagesList: {
    padding: 16,
    paddingBottom: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  attachButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: colors.text,
    maxHeight: 100,
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendButton: {
    padding: 8,
    marginLeft: 4,
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
});
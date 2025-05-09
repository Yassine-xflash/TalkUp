import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { MessageSquare, Send } from 'lucide-react-native';
import colors from '@/constants/colors';
import Card from '@/components/ui/Card';
import { useAuthStore } from '@/store/auth-store';
import Button from '@/components/ui/Button';

export default function LiveChatScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  
  // Mock chat messages
  const messages = [
    { id: '1', sender: 'support', text: "Hello! How can we help you today?", time: "10:30 AM" },
    { id: '2', sender: 'user', text: "I'm having trouble uploading photos to my posts.", time: "10:32 AM" },
    { id: '3', sender: 'support', text: "Let's troubleshoot this together. What happens when you try to upload a photo?", time: "10:34 AM" }
  ];

  if (!user) {
    return (
      <View style={styles.container}>
        <Stack.Screen 
          options={{
            title: 'Live Chat',
          }} 
        />
        <Text style={styles.errorText}>You must be logged in to use live chat.</Text>
        <Button 
          title="Go to Login" 
          onPress={() => router.replace('/auth/login')} 
          style={styles.loginButton}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Live Chat',
        }} 
      />
      
      <ScrollView style={styles.chatContainer}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <MessageSquare size={24} color={colors.primary} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>TalkUp Support</Text>
            <Text style={styles.subtitle}>Typically responds in a few minutes</Text>
          </View>
        </View>
        
        <Card style={styles.messagesCard}>
          {messages.map((message) => (
            <View 
              key={message.id} 
              style={[
                styles.messageBubble, 
                message.sender === 'user' ? styles.userMessage : styles.supportMessage
              ]}
            >
              <Text style={styles.messageText}>{message.text}</Text>
              <Text style={styles.messageTime}>{message.time}</Text>
            </View>
          ))}
        </Card>
      </ScrollView>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          multiline
        />
        <TouchableOpacity style={styles.sendButton}>
          <Send size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  chatContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.primary}20`,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  messagesCard: {
    margin: 16,
    padding: 0,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    maxWidth: '80%',
    marginHorizontal: 12,
  },
  userMessage: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-end',
  },
  supportMessage: {
    backgroundColor: colors.card,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.border,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 4,
    color: colors.text,
  },
  messageTime: {
    fontSize: 12,
    color: colors.textSecondary,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  input: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 48,
    maxHeight: 100,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    marginLeft: 12,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 24,
    color: colors.text,
  },
  loginButton: {
    width: '100%',
    marginHorizontal: 16,
  },
});
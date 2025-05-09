import { create } from 'zustand';
import { Message } from '@/types';
import messages from '@/mocks/messages';
import users from '@/mocks/users';

interface MessagesState {
  conversations: { [key: string]: Message[] };
  currentConversation: Message[];
  currentRecipient: any;
  isLoading: boolean;
  error: string | null;
  fetchConversations: (userId: string) => Promise<void>;
  fetchConversation: (userId: string, recipientId: string) => Promise<void>;
  sendMessage: (senderId: string, receiverId: string, content: string, media?: string[], mediaType?: 'image' | 'video' | 'pdf') => Promise<void>;
  markAsRead: (messageIds: string[]) => Promise<void>;
}

// Add some example messages if there are none
if (messages.length === 0) {
  // Add some example conversations
  const exampleMessages = [
    {
      id: '1',
      senderId: 'user2',
      receiverId: 'user1',
      content: 'Hey there! How are you doing?',
      read: true,
      createdAt: Date.now() - 86400000 * 2, // 2 days ago
    },
    {
      id: '2',
      senderId: 'user1',
      receiverId: 'user2',
      content: "I'm good, thanks! Just working on our group project. How about you?",
      read: true,
      createdAt: Date.now() - 86400000 * 2 + 3600000, // 2 days ago + 1 hour
    },
    {
      id: '3',
      senderId: 'user2',
      receiverId: 'user1',
      content: "Same here. I've been researching for our presentation. Found some interesting articles!",
      read: true,
      createdAt: Date.now() - 86400000 * 2 + 7200000, // 2 days ago + 2 hours
    },
    {
      id: '4',
      senderId: 'user1',
      receiverId: 'user2',
      content: "That's great! Can you share them with me?",
      read: true,
      createdAt: Date.now() - 86400000 * 2 + 10800000, // 2 days ago + 3 hours
    },
    {
      id: '5',
      senderId: 'user2',
      receiverId: 'user1',
      content: "Sure! I'll send them over tonight. Also, when are you free to meet up and discuss?",
      read: true,
      createdAt: Date.now() - 86400000 * 1, // 1 day ago
    },
    {
      id: '6',
      senderId: 'user1',
      receiverId: 'user2',
      content: "I'm free tomorrow afternoon, around 3 PM. Does that work for you?",
      read: true,
      createdAt: Date.now() - 86400000 * 1 + 3600000, // 1 day ago + 1 hour
    },
    {
      id: '7',
      senderId: 'user2',
      receiverId: 'user1',
      content: "Perfect! Let's meet at the library. I'll bring my laptop and notes.",
      read: false,
      createdAt: Date.now() - 3600000 * 5, // 5 hours ago
    },
    // Conversation with user3
    {
      id: '8',
      senderId: 'user3',
      receiverId: 'user1',
      content: "Hi! Are you coming to the study group tonight?",
      read: true,
      createdAt: Date.now() - 86400000 * 3, // 3 days ago
    },
    {
      id: '9',
      senderId: 'user1',
      receiverId: 'user3',
      content: "Yes, I'll be there! What time does it start again?",
      read: true,
      createdAt: Date.now() - 86400000 * 3 + 1800000, // 3 days ago + 30 minutes
    },
    {
      id: '10',
      senderId: 'user3',
      receiverId: 'user1',
      content: "It starts at 7 PM in Room 204. Don't forget to bring your textbook!",
      read: true,
      createdAt: Date.now() - 86400000 * 3 + 3600000, // 3 days ago + 1 hour
    },
    {
      id: '11',
      senderId: 'user1',
      receiverId: 'user3',
      content: "Got it, thanks for the reminder!",
      read: true,
      createdAt: Date.now() - 86400000 * 3 + 5400000, // 3 days ago + 1.5 hours
    },
    {
      id: '12',
      senderId: 'user3',
      receiverId: 'user1',
      content: "By the way, did you understand the assignment from yesterday's lecture?",
      read: false,
      createdAt: Date.now() - 7200000, // 2 hours ago
    },
    // Conversation with user4
    {
      id: '13',
      senderId: 'user4',
      receiverId: 'user1',
      content: "Hey! Are you going to the campus event this weekend?",
      read: true,
      createdAt: Date.now() - 86400000 * 4, // 4 days ago
    },
    {
      id: '14',
      senderId: 'user1',
      receiverId: 'user4',
      content: "I'm thinking about it. What's happening there?",
      read: true,
      createdAt: Date.now() - 86400000 * 4 + 3600000, // 4 days ago + 1 hour
    },
    {
      id: '15',
      senderId: 'user4',
      receiverId: 'user1',
      content: "It's a tech showcase with some cool demos and networking opportunities. A few companies will be there recruiting too!",
      read: true,
      createdAt: Date.now() - 86400000 * 4 + 7200000, // 4 days ago + 2 hours
    },
    {
      id: '16',
      senderId: 'user1',
      receiverId: 'user4',
      content: "That sounds interesting! I'll definitely try to make it. What time does it start?",
      read: true,
      createdAt: Date.now() - 86400000 * 4 + 10800000, // 4 days ago + 3 hours
    },
    {
      id: '17',
      senderId: 'user4',
      receiverId: 'user1',
      content: "It starts at 10 AM and goes until 4 PM. I'm planning to be there around noon. Want to meet up?",
      read: false,
      createdAt: Date.now() - 86400000, // 1 day ago
    },
  ];
  
  messages.push(...exampleMessages);
}

export const useMessagesStore = create<MessagesState>((set, get) => ({
  conversations: {},
  currentConversation: [],
  currentRecipient: null,
  isLoading: false,
  error: null,
  
  fetchConversations: async (userId) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get all messages where the user is either sender or receiver
      const userMessages = messages.filter(
        m => m.senderId === userId || m.receiverId === userId
      );
      
      // Group messages by conversation partner
      const conversations: { [key: string]: Message[] } = {};
      
      userMessages.forEach(message => {
        let partnerId;
        
        if (message.senderId === userId) {
          partnerId = message.receiverId;
        } else {
          partnerId = message.senderId;
        }
        
        if (partnerId) {
          if (!conversations[partnerId]) {
            conversations[partnerId] = [];
          }
          
          conversations[partnerId].push(message);
        }
      });
      
      // Sort messages in each conversation by date
      Object.keys(conversations).forEach(key => {
        conversations[key].sort((a, b) => a.createdAt - b.createdAt);
      });
      
      set({ conversations, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Failed to fetch conversations", 
        isLoading: false 
      });
    }
  },
  
  fetchConversation: async (userId, recipientId) => {
    set({ isLoading: true, error: null, currentConversation: [], currentRecipient: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get all messages between the user and the recipient
      const conversationMessages = messages.filter(
        m => (m.senderId === userId && m.receiverId === recipientId) || 
             (m.senderId === recipientId && m.receiverId === userId)
      );
      
      // Sort messages by date
      const sortedMessages = [...conversationMessages].sort((a, b) => a.createdAt - b.createdAt);
      
      // Get recipient details
      const recipient = users.find(user => user.id === recipientId);
      
      set({ 
        currentConversation: sortedMessages, 
        currentRecipient: recipient,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Failed to fetch conversation", 
        isLoading: false 
      });
    }
  },
  
  sendMessage: async (senderId, receiverId, content, media, mediaType) => {
    try {
      const newMessage: Message = {
        id: Date.now().toString(),
        senderId,
        receiverId,
        content,
        media,
        mediaType,
        read: false,
        createdAt: Date.now(),
      };
      
      // Add to messages array
      messages.push(newMessage);
      
      set(state => ({ 
        currentConversation: [...state.currentConversation, newMessage],
        conversations: {
          ...state.conversations,
          [receiverId]: state.conversations[receiverId] 
            ? [...state.conversations[receiverId], newMessage]
            : [newMessage]
        }
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Failed to send message" 
      });
    }
  },
  
  markAsRead: async (messageIds) => {
    try {
      // Update messages in the messages array
      messageIds.forEach(id => {
        const messageIndex = messages.findIndex(m => m.id === id);
        if (messageIndex !== -1) {
          messages[messageIndex].read = true;
        }
      });
      
      set(state => {
        // Update current conversation
        const updatedCurrentConversation = state.currentConversation.map(message => 
          messageIds.includes(message.id) ? { ...message, read: true } : message
        );
        
        // Update all conversations
        const updatedConversations = { ...state.conversations };
        Object.keys(updatedConversations).forEach(key => {
          updatedConversations[key] = updatedConversations[key].map(message => 
            messageIds.includes(message.id) ? { ...message, read: true } : message
          );
        });
        
        return {
          currentConversation: updatedCurrentConversation,
          conversations: updatedConversations
        };
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Failed to mark messages as read" 
      });
    }
  },
}));
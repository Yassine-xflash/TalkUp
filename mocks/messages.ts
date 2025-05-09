import { Message } from '@/types';

const messages: Message[] = [
  {
    id: '1',
    senderId: '1', // Ahmed Benali
    receiverId: '2', // Fatima Zahra
    content: "Hi Fatima, do you have the notes from yesterday's lecture?",
    read: true,
    createdAt: Date.now() - 86400000, // 1 day ago
  },
  {
    id: '2',
    senderId: '2', // Fatima Zahra
    receiverId: '1', // Ahmed Benali
    content: "Yes, I'll send them to you. Give me a moment.",
    read: true,
    createdAt: Date.now() - 86400000 + 600000, // 1 day ago + 10 minutes
  },
  {
    id: '3',
    senderId: '2', // Fatima Zahra
    receiverId: '1', // Ahmed Benali
    content: "Here are the notes. Let me know if you need anything else!",
    media: ['https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'],
    mediaType: 'image',
    read: true,
    createdAt: Date.now() - 86400000 + 900000, // 1 day ago + 15 minutes
  },
  {
    id: '4',
    senderId: '1', // Ahmed Benali
    receiverId: '2', // Fatima Zahra
    content: "Thank you so much! These are perfect.",
    read: true,
    createdAt: Date.now() - 86400000 + 1200000, // 1 day ago + 20 minutes
  },
  {
    id: '5',
    senderId: '3', // Prof. Mohammed Alaoui
    receiverId: '1', // Ahmed Benali
    content: "Ahmed, I reviewed your project proposal. It looks promising, but I have a few suggestions. Can we meet during my office hours tomorrow?",
    read: false,
    createdAt: Date.now() - 3600000, // 1 hour ago
  },
  {
    id: '6',
    senderId: '4', // Robotics Club
    groupId: '3', // Robotics Club group
    content: "Reminder: Our workshop is this Saturday. Don't forget to bring your laptops!",
    read: false,
    createdAt: Date.now() - 43200000, // 12 hours ago
  },
  {
    id: '7',
    senderId: '5', // Karim Tazi
    receiverId: '1', // Ahmed Benali
    content: "Hi Ahmed, I saw your post about your internship at MarocTelecom. I work with their team occasionally. Would love to connect and hear more about your experience.",
    read: false,
    createdAt: Date.now() - 7200000, // 2 hours ago
  },
  {
    id: '8',
    senderId: '1', // Ahmed Benali
    receiverId: '5', // Karim Tazi
    content: "Hey Karim, thanks for reaching out! I'd be happy to chat. When are you free?",
    read: true,
    createdAt: Date.now() - 6600000, // 1.8 hours ago
  },
  {
    id: '9',
    senderId: '5', // Karim Tazi
    receiverId: '1', // Ahmed Benali
    content: "How about tomorrow afternoon around 2 PM? We can meet at the campus cafe.",
    read: false,
    createdAt: Date.now() - 6000000, // 1.6 hours ago
  },
  {
    id: '10',
    senderId: '2', // Fatima Zahra
    receiverId: '1', // Ahmed Benali
    content: "Hey Ahmed, are you joining the study group tonight?",
    read: false,
    createdAt: Date.now() - 1800000, // 30 minutes ago
  },
];

export default messages;
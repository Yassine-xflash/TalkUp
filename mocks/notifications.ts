import { Notification } from '@/types';

const notifications: Notification[] = [
  {
    id: '1',
    userId: '1', // Ahmed Benali
    type: 'like',
    referenceId: '5', // Post ID
    read: false,
    createdAt: Date.now() - 3600000, // 1 hour ago
  },
  {
    id: '2',
    userId: '1', // Ahmed Benali
    type: 'comment',
    referenceId: '5', // Post ID
    read: false,
    createdAt: Date.now() - 7200000, // 2 hours ago
  },
  {
    id: '3',
    userId: '1', // Ahmed Benali
    type: 'message',
    referenceId: '5', // Message ID
    read: false,
    createdAt: Date.now() - 3600000, // 1 hour ago
  },
  {
    id: '4',
    userId: '1', // Ahmed Benali
    type: 'event',
    referenceId: '1', // Event ID
    read: true,
    createdAt: Date.now() - 86400000 * 3, // 3 days ago
  },
  {
    id: '5',
    userId: '2', // Fatima Zahra
    type: 'message',
    referenceId: '4', // Message ID
    read: true,
    createdAt: Date.now() - 86400000, // 1 day ago
  },
];

export default notifications;
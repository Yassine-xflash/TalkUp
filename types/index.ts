export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  department?: string;
  major?: string;
  interests?: string[];
  followers?: string[];
  following?: string[];
  createdAt: number;
  gameStats?: GameStats;
}

export interface GameStats {
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  score: number;
  rank?: number;
  achievements: Achievement[];
  recentGames: GameHistory[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: number;
}

export interface GameHistory {
  id: string;
  gameId: string;
  gameName: string;
  result: 'win' | 'loss' | 'draw';
  score: number;
  opponent?: string;
  date: number;
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  media?: string[];
  mediaType?: 'image' | 'video' | 'pdf';
  likes: string[];
  comments: Comment[];
  createdAt: number;
  groupId?: string;
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: number;
  likes?: string[];
}

export interface Group {
  id: string;
  name: string;
  description: string;
  coverImage?: string;
  avatar?: string;
  members: string[];
  admins: string[];
  isPrivate: boolean;
  createdAt: number;
  category?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  coverImage?: string;
  startDate: number;
  endDate: number;
  duration: number;
  organizer: string;
  attendees: string[];
  interested: string[];
  groupId?: string;
  isOnline: boolean;
  link?: string;
  createdAt: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  media?: string[];
  mediaType?: 'image' | 'video' | 'pdf';
  isRead: boolean;
  createdAt: number;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
  createdAt: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'event' | 'group' | 'message' | 'game';
  content: string;
  sourceId: string;
  sourceType: 'post' | 'comment' | 'user' | 'event' | 'group' | 'message' | 'game';
  isRead: boolean;
  createdAt: number;
}

export interface News {
  id: string;
  title: string;
  content: string;
  image?: string;
  source?: {
    id: string;
    name: string;
    avatar?: string;
  };
  category?: string;
  likes: number;
  comments: number;
  readTime: number;
  createdAt: number;
}
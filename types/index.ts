export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  location?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  xp: number;
  rank: number;
  streak: number;
  problemsSolved: number;
  acceptanceRate: number;
  skills: string[];
  interests: string[];
  isAvailableForConnection: boolean;
  isOnline: boolean;
  lastSeen?: string;
  createdAt: string;
}

export interface Post {
  id: string;
  content: string;
  authorId: string;
  author: User;
  media?: string[];
  visibility: 'PUBLIC' | 'CONNECTIONS' | 'PRIVATE';
  reactionCount: number;
  commentCount: number;
  shareCount: number;
  reactions: Reaction[];
  createdAt: string;
  updatedAt: string;
}

export interface Reaction {
  id: string;
  type: 'LIKE' | 'LOVE' | 'HELPFUL' | 'CELEBRATE' | 'INTERESTING';
  userId: string;
  user: User;
  postId?: string;
  commentId?: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  author: User;
  postId: string;
  parentId?: string;
  replies?: Comment[];
  reactionCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Connection {
  id: string;
  requesterId: string;
  requester: User;
  addresseeId: string;
  addressee: User;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'BLOCKED';
  createdAt: string;
  updatedAt: string;
}

export interface Problem {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  category: string;
  tags: string[];
  constraints?: string;
  examples?: string;
  starterCode?: Record<string, string>;
  testCases?: any[];
  xpReward: number;
  acceptanceRate: number;
  totalSubmissions: number;
  isSolved?: boolean;
  createdAt: string;
}

export interface Submission {
  id: string;
  problemId: string;
  problem: Problem;
  userId: string;
  user: User;
  language: string;
  code: string;
  status: 'ACCEPTED' | 'WRONG_ANSWER' | 'RUNTIME_ERROR' | 'COMPILATION_ERROR' | 'TIME_LIMIT' | 'MEMORY_LIMIT' | 'PENDING';
  runtime?: number;
  memory?: number;
  score?: number;
  testCasesPassed?: number;
  totalTestCases?: number;
  error?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  sender: User;
  receiverId?: string;
  receiver?: User;
  conversationId?: string;
  roomId?: string;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM';
  media?: string;
  isRead: boolean;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'CONNECTION_REQUEST' | 'CONNECTION_ACCEPTED' | 'POST_REACTION' | 'COMMENT' | 'REPLY' | 'ACHIEVEMENT' | 'MESSAGE' | 'COLLABORATION_REQUEST' | 'COURSE_ENROLLMENT' | 'PAYMENT';
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  xpReward: number;
  earnedAt?: string;
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
  xp: number;
  problemsSolved: number;
  streak: number;
  acceptanceRate: number;
}

export interface CollaborationSession {
  id: string;
  participants: User[];
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  problemId?: string;
  problem?: Problem;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

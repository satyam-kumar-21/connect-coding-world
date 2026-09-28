export type DeveloperLevel = 'BEGINNER' | 'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD' | 'PRINCIPAL' | 'ARCHITECT';
export type AvailabilityStatus = 'AVAILABLE' | 'BUSY' | 'DO_NOT_DISTURB' | 'AWAY' | 'OFFLINE';

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
  role: 'USER' | 'ADMIN' | 'MODERATOR' | 'STUDENT' | 'INSTRUCTOR';
  developerLevel?: DeveloperLevel;
  currentRole?: string;
  company?: string;
  xp: number;
  rank: number;
  streak: number;
  problemsSolved: number;
  acceptanceRate: number;
  skills: string[];
  interests: string[];
  isAvailableForConnection: boolean;
  isOnline: boolean;
  isLive?: boolean;
  currentActivity?: string;
  codingLanguage?: string;
  liveNote?: string;
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
  tags?: string[];
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
  message?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Problem {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
  category: string;
  tags: string[];
  type?: 'CODING' | 'MCQ' | 'DEBUGGING' | 'OUTPUT_PREDICTION' | 'SQL' | 'SYSTEM_DESIGN';
  constraints?: string;
  examples?: string;
  starterCode?: Record<string, string>;
  testCases?: any[];
  xpReward: number;
  acceptanceRate: number;
  totalSubmissions: number;
  isSolved?: boolean;
  editorial?: string;
  createdAt: string;
}

export interface Submission {
  id: string;
  problemId: string;
  problem?: Problem;
  problemTitle?: string;
  userId: string;
  user?: User;
  language: string;
  code?: string;
  status: 'ACCEPTED' | 'WRONG_ANSWER' | 'RUNTIME_ERROR' | 'COMPILATION_ERROR' | 'TIME_LIMIT_EXCEEDED' | 'MEMORY_LIMIT_EXCEEDED' | 'PENDING';
  runtime?: number;
  memory?: number;
  score?: number;
  testCasesPassed?: number;
  totalTestCases?: number;
  error?: string;
  xpEarned?: number;
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
  type: 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM' | 'CODE';
  media?: string;
  codeLanguage?: string;
  replyToId?: string;
  isRead: boolean;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  name?: string;
  type?: 'DIRECT' | 'GROUP' | 'ROOM';
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type:
    | 'CONNECTION_REQUEST'
    | 'CONNECTION_ACCEPTED'
    | 'POST_REACTION'
    | 'POST_COMMENT'
    | 'COMMENT'
    | 'REPLY'
    | 'ACHIEVEMENT'
    | 'ACHIEVEMENT_UNLOCKED'
    | 'BADGE_EARNED'
    | 'CODING_CHALLENGE'
    | 'MESSAGE'
    | 'MESSAGE_RECEIVED'
    | 'COLLABORATION_REQUEST'
    | 'COLLABORATION_ACCEPTED'
    | 'COURSE_ENROLLMENT'
    | 'SYSTEM';
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  sender?: User;
  entityType?: string;
  entityId?: string;
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
  isUnlocked?: boolean;
  progress?: number;
  maxProgress?: number;
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
  xp: number;
  problemsSolved: number;
  streak: number;
  acceptanceRate: number;
  weeklyXp?: number;
  monthlyXp?: number;
  level?: number;
  levelTitle?: string;
  badges?: string[];
}

export interface CollaborationSession {
  id: string;
  title: string;
  description?: string;
  roomCode: string;
  initiator: User;
  participants: User[];
  status: 'PENDING' | 'REQUESTED' | 'ACCEPTED' | 'ACTIVE' | 'ENDED' | 'CANCELLED';
  codingLanguage?: string;
  currentActivity?: string;
  problemId?: string;
  problem?: Problem;
  createdAt: string;
  updatedAt: string;
}

export interface SavedItem {
  id: string;
  type: 'PROBLEM' | 'POST' | 'SNIPPET' | 'DEVELOPER';
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  link: string;
  problem?: Problem;
  post?: Post;
  user?: User;
  codeSnippet?: {
    language: string;
    code: string;
  };
  savedAt: string;
}

export interface ActivityFeedItem {
  id: string;
  type: 'SUBMISSION' | 'ACHIEVEMENT' | 'STREAK' | 'POST' | 'COLLABORATION' | 'CONNECTION';
  title: string;
  description: string;
  timestamp: string;
  xpEarned?: number;
  status?: string;
  metadata?: Record<string, any>;
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

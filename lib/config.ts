export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

export const ROUTES = {
  HOME: '/',
  EXPLORE: '/explore',
  PROBLEMS: '/problems',
  LEADERBOARD: '/leaderboard',
  LIVE: '/live',
  CONNECTIONS: '/connections',
  MESSAGES: '/messages',
  NOTIFICATIONS: '/notifications',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  SEARCH: '/search',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email',
} as const;

export const PROBLEM_CATEGORIES = [
  'DSA',
  'JavaScript',
  'React',
  'Next.js',
  'Node.js',
  'Express',
  'Java',
  'Python',
  'C',
  'C++',
  'SQL',
  'HTML',
  'CSS',
  'MongoDB',
  'PostgreSQL',
  'Git',
  'APIs',
  'Debugging',
  'Output Prediction',
  'System Design',
  'AI/ML',
  'NLP',
  'Other',
] as const;

export const PROBLEM_DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'] as const;

export const POST_VISIBILITY = ['PUBLIC', 'CONNECTIONS', 'PRIVATE'] as const;

export const REACTION_TYPES = ['LIKE', 'LOVE', 'HELPFUL', 'CELEBRATE', 'INTERESTING'] as const;

import { apiClient } from './api';
import { LeaderboardEntry, ApiResponse } from '@/types';

export const leaderboardService = {
  async getGlobalLeaderboard(page = 1, limit = 50): Promise<ApiResponse<LeaderboardEntry[]>> {
    return apiClient.get<LeaderboardEntry[]>(`/leaderboard/global?page=${page}&limit=${limit}`);
  },

  async getWeeklyLeaderboard(page = 1, limit = 50): Promise<ApiResponse<LeaderboardEntry[]>> {
    return apiClient.get<LeaderboardEntry[]>(`/leaderboard/weekly?page=${page}&limit=${limit}`);
  },

  async getMonthlyLeaderboard(page = 1, limit = 50): Promise<ApiResponse<LeaderboardEntry[]>> {
    return apiClient.get<LeaderboardEntry[]>(`/leaderboard/monthly?page=${page}&limit=${limit}`);
  },

  async getConnectionsLeaderboard(page = 1, limit = 50): Promise<ApiResponse<LeaderboardEntry[]>> {
    return apiClient.get<LeaderboardEntry[]>(`/leaderboard/connections?page=${page}&limit=${limit}`);
  },
};

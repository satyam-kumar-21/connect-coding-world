import { apiClient } from './api';
import { User, ApiResponse, PaginatedResponse } from '@/types';

export const usersService = {
  async getProfile(username: string): Promise<ApiResponse<User>> {
    return apiClient.get<User>(`/users/${username}`);
  },

  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return apiClient.put<User>('/users/profile', data);
  },

  async updateAvatar(file: File): Promise<ApiResponse<{ url: string }>> {
    return apiClient.uploadFile<{ url: string }>('/users/avatar', file, 'avatar');
  },

  async updateCoverImage(file: File): Promise<ApiResponse<{ url: string }>> {
    return apiClient.uploadFile<{ url: string }>('/users/cover', file, 'cover');
  },

  async searchUsers(query: string, page = 1, limit = 20): Promise<ApiResponse<PaginatedResponse<User>>> {
    return apiClient.get<PaginatedResponse<User>>(`/users/search?q=${query}&page=${page}&limit=${limit}`);
  },

  async getSuggestedConnections(limit = 10): Promise<ApiResponse<User[]>> {
    return apiClient.get<User[]>(`/users/suggested?limit=${limit}`);
  },

  async getUserStats(userId: string): Promise<ApiResponse<any>> {
    return apiClient.get(`/users/${userId}/stats`);
  },

  async updatePrivacySettings(settings: any): Promise<ApiResponse> {
    return apiClient.put('/users/privacy', settings);
  },

  async updateAvailability(isAvailable: boolean): Promise<ApiResponse> {
    return apiClient.put('/users/availability', { isAvailableForConnection: isAvailable });
  },
};

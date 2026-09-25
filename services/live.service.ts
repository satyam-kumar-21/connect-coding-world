import { apiClient } from './api';
import { User, ApiResponse } from '@/types';

export const liveService = {
  async getLiveDevelopers(page = 1, limit = 50): Promise<ApiResponse<User[]>> {
    return apiClient.get<User[]>(`/live/developers?page=${page}&limit=${limit}`);
  },

  async sendCollaborationRequest(userId: string, message?: string): Promise<ApiResponse> {
    return apiClient.post('/live/request', { userId, message });
  },

  async respondToRequest(requestId: string, accept: boolean): Promise<ApiResponse> {
    return apiClient.post(`/live/request/${requestId}/respond`, { accept });
  },
};

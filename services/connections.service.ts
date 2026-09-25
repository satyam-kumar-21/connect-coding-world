import { apiClient } from './api';
import { Connection, User, ApiResponse, PaginatedResponse } from '@/types';

export const connectionsService = {
  async getConnections(page = 1, limit = 20): Promise<ApiResponse<PaginatedResponse<Connection>>> {
    return apiClient.get<PaginatedResponse<Connection>>(`/connections?page=${page}&limit=${limit}`);
  },

  async getConnectionRequests(page = 1, limit = 20): Promise<ApiResponse<PaginatedResponse<Connection>>> {
    return apiClient.get<PaginatedResponse<Connection>>(`/connections/requests?page=${page}&limit=${limit}`);
  },

  async getSentRequests(page = 1, limit = 20): Promise<ApiResponse<PaginatedResponse<Connection>>> {
    return apiClient.get<PaginatedResponse<Connection>>(`/connections/sent?page=${page}&limit=${limit}`);
  },

  async sendRequest(userId: string, message?: string): Promise<ApiResponse<Connection>> {
    return apiClient.post<Connection>('/connections/request', { userId, message });
  },

  async acceptRequest(connectionId: string): Promise<ApiResponse<Connection>> {
    return apiClient.put<Connection>(`/connections/${connectionId}/accept`);
  },

  async rejectRequest(connectionId: string): Promise<ApiResponse> {
    return apiClient.put(`/connections/${connectionId}/reject`);
  },

  async cancelRequest(connectionId: string): Promise<ApiResponse> {
    return apiClient.delete(`/connections/${connectionId}`);
  },

  async removeConnection(userId: string): Promise<ApiResponse> {
    return apiClient.delete(`/connections/user/${userId}`);
  },

  async blockUser(userId: string): Promise<ApiResponse> {
    return apiClient.post(`/connections/block`, { userId });
  },

  async unblockUser(userId: string): Promise<ApiResponse> {
    return apiClient.delete(`/connections/block/${userId}`);
  },

  async getConnectionStatus(userId: string): Promise<ApiResponse<{ status: string }>> {
    return apiClient.get<{ status: string }>(`/connections/status/${userId}`);
  },
};

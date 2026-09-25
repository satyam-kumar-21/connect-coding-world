import { apiClient } from './api';
import { Notification, ApiResponse, PaginatedResponse } from '@/types';

export const notificationsService = {
  async getNotifications(page = 1, limit = 50): Promise<ApiResponse<PaginatedResponse<Notification>>> {
    return apiClient.get<PaginatedResponse<Notification>>(`/notifications?page=${page}&limit=${limit}`);
  },

  async getUnreadNotifications(page = 1, limit = 50): Promise<ApiResponse<PaginatedResponse<Notification>>> {
    return apiClient.get<PaginatedResponse<Notification>>(`/notifications/unread?page=${page}&limit=${limit}`);
  },

  async markAsRead(notificationId: string): Promise<ApiResponse> {
    return apiClient.put(`/notifications/${notificationId}/read`);
  },

  async markAllAsRead(): Promise<ApiResponse> {
    return apiClient.put('/notifications/read-all');
  },

  async deleteNotification(notificationId: string): Promise<ApiResponse> {
    return apiClient.delete(`/notifications/${notificationId}`);
  },

  async getUnreadCount(): Promise<ApiResponse<{ count: number }>> {
    return apiClient.get<{ count: number }>('/notifications/unread/count');
  },
};

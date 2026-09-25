import { apiClient } from './api';
import { Comment, ApiResponse, PaginatedResponse } from '@/types';

export const commentsService = {
  async getComments(postId: string, page = 1, limit = 20): Promise<ApiResponse<PaginatedResponse<Comment>>> {
    return apiClient.get<PaginatedResponse<Comment>>(`/posts/${postId}/comments?page=${page}&limit=${limit}`);
  },

  async createComment(postId: string, content: string, parentId?: string): Promise<ApiResponse<Comment>> {
    return apiClient.post<Comment>(`/posts/${postId}/comments`, { content, parentId });
  },

  async updateComment(commentId: string, content: string): Promise<ApiResponse<Comment>> {
    return apiClient.put<Comment>(`/comments/${commentId}`, { content });
  },

  async deleteComment(commentId: string): Promise<ApiResponse> {
    return apiClient.delete(`/comments/${commentId}`);
  },

  async addReaction(commentId: string, type: string): Promise<ApiResponse> {
    return apiClient.post(`/comments/${commentId}/reactions`, { type });
  },

  async removeReaction(commentId: string): Promise<ApiResponse> {
    return apiClient.delete(`/comments/${commentId}/reactions`);
  },
};

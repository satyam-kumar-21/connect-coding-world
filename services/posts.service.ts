import { apiClient } from './api';
import { Post, Comment, Reaction, ApiResponse, PaginatedResponse } from '@/types';

export interface CreatePostData {
  content: string;
  visibility: 'PUBLIC' | 'CONNECTIONS' | 'PRIVATE';
  media?: string[];
}

export const postsService = {
  async getFeed(page = 1, limit = 20): Promise<ApiResponse<PaginatedResponse<Post>>> {
    return apiClient.get<PaginatedResponse<Post>>(`/posts/feed?page=${page}&limit=${limit}`);
  },

  async getPost(postId: string): Promise<ApiResponse<Post>> {
    return apiClient.get<Post>(`/posts/${postId}`);
  },

  async createPost(data: CreatePostData): Promise<ApiResponse<Post>> {
    return apiClient.post<Post>('/posts', data);
  },

  async updatePost(postId: string, data: Partial<CreatePostData>): Promise<ApiResponse<Post>> {
    return apiClient.put<Post>(`/posts/${postId}`, data);
  },

  async deletePost(postId: string): Promise<ApiResponse> {
    return apiClient.delete(`/posts/${postId}`);
  },

  async getUserPosts(userId: string, page = 1, limit = 20): Promise<ApiResponse<PaginatedResponse<Post>>> {
    return apiClient.get<PaginatedResponse<Post>>(`/posts/user/${userId}?page=${page}&limit=${limit}`);
  },

  async addReaction(postId: string, type: string): Promise<ApiResponse<Reaction>> {
    return apiClient.post<Reaction>(`/posts/${postId}/reactions`, { type });
  },

  async removeReaction(postId: string): Promise<ApiResponse> {
    return apiClient.delete(`/posts/${postId}/reactions`);
  },

  async sharePost(postId: string): Promise<ApiResponse> {
    return apiClient.post(`/posts/${postId}/share`);
  },

  async savePost(postId: string): Promise<ApiResponse> {
    return apiClient.post(`/posts/${postId}/save`);
  },

  async unsavePost(postId: string): Promise<ApiResponse> {
    return apiClient.delete(`/posts/${postId}/save`);
  },

  async getSavedPosts(page = 1, limit = 20): Promise<ApiResponse<PaginatedResponse<Post>>> {
    return apiClient.get<PaginatedResponse<Post>>(`/posts/saved?page=${page}&limit=${limit}`);
  },
};

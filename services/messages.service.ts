import { apiClient } from './api';
import { Message, Conversation, ApiResponse, PaginatedResponse } from '@/types';

export const messagesService = {
  async getConversations(page = 1, limit = 50): Promise<ApiResponse<PaginatedResponse<Conversation>>> {
    return apiClient.get<PaginatedResponse<Conversation>>(`/messages/conversations?page=${page}&limit=${limit}`);
  },

  async getConversation(conversationId: string): Promise<ApiResponse<Conversation>> {
    return apiClient.get<Conversation>(`/messages/conversations/${conversationId}`);
  },

  async getMessages(conversationId: string, page = 1, limit = 50): Promise<ApiResponse<PaginatedResponse<Message>>> {
    return apiClient.get<PaginatedResponse<Message>>(`/messages/conversations/${conversationId}/messages?page=${page}&limit=${limit}`);
  },

  async sendMessage(receiverId: string, content: string, type: 'TEXT' | 'IMAGE' | 'FILE' = 'TEXT'): Promise<ApiResponse<Message>> {
    return apiClient.post<Message>('/messages', { receiverId, content, type });
  },

  async sendMessageToConversation(conversationId: string, content: string, type: 'TEXT' | 'IMAGE' | 'FILE' = 'TEXT'): Promise<ApiResponse<Message>> {
    return apiClient.post<Message>(`/messages/conversations/${conversationId}`, { content, type });
  },

  async markAsRead(conversationId: string): Promise<ApiResponse> {
    return apiClient.put(`/messages/conversations/${conversationId}/read`);
  },

  async deleteMessage(messageId: string): Promise<ApiResponse> {
    return apiClient.delete(`/messages/${messageId}`);
  },

  async editMessage(messageId: string, content: string): Promise<ApiResponse<Message>> {
    return apiClient.put<Message>(`/messages/${messageId}`, { content });
  },
};

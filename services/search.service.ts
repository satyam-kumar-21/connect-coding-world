import { apiClient } from './api';
import { ApiResponse } from '@/types';

export interface SearchResults {
  users: any[];
  posts: any[];
  problems: any[];
  courses: any[];
}

export const searchService = {
  async search(query: string, type?: string, page = 1, limit = 20): Promise<ApiResponse<SearchResults>> {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
      ...(type && { type }),
    });
    return apiClient.get<SearchResults>(`/search?${params}`);
  },
};

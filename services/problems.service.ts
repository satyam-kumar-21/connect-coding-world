import { apiClient } from './api';
import { Problem, Submission, ApiResponse, PaginatedResponse } from '@/types';

export interface ProblemFilters {
  category?: string;
  difficulty?: string;
  status?: string;
  search?: string;
}

export const problemsService = {
  async getProblems(filters: ProblemFilters = {}, page = 1, limit = 20): Promise<ApiResponse<PaginatedResponse<Problem>>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v)),
    });
    return apiClient.get<PaginatedResponse<Problem>>(`/problems?${params}`);
  },

  async getProblem(slug: string): Promise<ApiResponse<Problem>> {
    return apiClient.get<Problem>(`/problems/${slug}`);
  },

  async submitSolution(problemId: string, language: string, code: string): Promise<ApiResponse<Submission>> {
    return apiClient.post<Submission>(`/problems/${problemId}/submit`, { language, code });
  },

  async runCode(problemId: string, language: string, code: string): Promise<ApiResponse<any>> {
    return apiClient.post(`/problems/${problemId}/run`, { language, code });
  },

  async getSubmissions(page = 1, limit = 20): Promise<ApiResponse<PaginatedResponse<Submission>>> {
    return apiClient.get<PaginatedResponse<Submission>>(`/submissions?page=${page}&limit=${limit}`);
  },

  async getSubmission(submissionId: string): Promise<ApiResponse<Submission>> {
    return apiClient.get<Submission>(`/submissions/${submissionId}`);
  },

  async getProblemSubmissions(problemId: string, page = 1, limit = 20): Promise<ApiResponse<PaginatedResponse<Submission>>> {
    return apiClient.get<PaginatedResponse<Submission>>(`/problems/${problemId}/submissions?page=${page}&limit=${limit}`);
  },
};

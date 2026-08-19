import { apiClient } from '@/services/api';

export interface User {
  id: number;
  full_name: string;
  email: string;
  role: 'Admin' | 'Operator' | 'Courier' | 'User';
  phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isActive?: boolean | string;
}

export interface CreateUserRequest {
  fullName: string;
  email: string;
  password: string;
  role: 'Admin' | 'Operator' | 'Courier' | 'User';
  phone?: string;
}

export const userService = {
  async createUser(data: CreateUserRequest): Promise<{ user: User; token: string }> {
    const response = await apiClient.post<{ user: User; token: string }>('/api/users', data);
    return response;
  },

  async getUsers(filters: UserFilters = {}): Promise<UsersResponse> {
    const params = new URLSearchParams();

    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.role) params.append('role', filters.role);
    if (filters.isActive !== undefined && filters.isActive !== '') {
      params.append('isActive', filters.isActive.toString());
    }

    const queryString = params.toString();
    const endpoint = `/api/users${queryString ? `?${queryString}` : ''}`;

    return await apiClient.get<UsersResponse>(endpoint);
  },

  async getUserById(id: number): Promise<User> {
    const response = await apiClient.get<{ user: User }>(`/api/users/${id}`);
    return response.user;
  },

  async updateUserRole(id: number, role: string): Promise<User> {
    const response = await apiClient.patch<{ user: User }>(`/api/users/${id}/role`, { role });
    return response.user;
  },

  async updateUserPhone(id: number, phone: string): Promise<User> {
    const response = await apiClient.patch<{ user: User }>(`/api/users/${id}/phone`, { phone });
    return response.user;
  },

  async deactivateUser(id: number): Promise<User> {
    const response = await apiClient.patch<{ user: User }>(`/api/users/${id}/deactivate`, {});
    return response.user;
  },

  async activateUser(id: number): Promise<User> {
    const response = await apiClient.patch<{ user: User }>(`/api/users/${id}/activate`, {});
    return response.user;
  },
};

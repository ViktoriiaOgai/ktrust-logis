import { apiClient } from '@/services/api';

export interface Operator {
  id: number;
  full_name: string;
  email: string;
  phone: string | null;
}

export const operatorService = {
  async getActiveOperator(): Promise<{ operator: Operator | null }> {
    return await apiClient.get<{ operator: Operator | null }>('/api/operators/active');
  },
};

import { apiClient } from '@/services/api';

export interface StatusHistory {
  id: number;
  old_status: string;
  new_status: string;
  comment: string;
  changed_by_user: string;
  created_at: string;
}

export const statusService = {
  async updateStatus(orderId: number, newStatus: string, comment?: string): Promise<void> {
    await apiClient.patch(`/api/status/orders/${orderId}/status`, {
      newStatus,
      comment,
    });
  },

  async getStatusHistory(orderId: number): Promise<StatusHistory[]> {
    const response = await apiClient.get<{ history: StatusHistory[] }>(`/api/status/orders/${orderId}/history`);
    return response.history;
  },
};

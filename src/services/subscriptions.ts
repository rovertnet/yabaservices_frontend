import api from './api';

export interface Subscription {
  id: number;
  userId: number;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  startDate: string;
  endDate: string;
  amount: number;
  plan: 'BASIC' | 'PREMIUM';
  createdAt: string;
  updatedAt: string;
}

export const subscriptionsApi = {
  createSubscription: async (amount: number, plan: 'BASIC' | 'PREMIUM' = 'PREMIUM') => {
    const response = await api.post<Subscription>('/subscriptions', { amount, plan });
    return response.data;
  },

  getMySubscription: async () => {
    const response = await api.get<Subscription>('/subscriptions/me');
    return response.data;
  },

  checkStatus: async () => {
    const response = await api.get<{ isActive: boolean; subscription: Subscription | null }>('/subscriptions/status');
    return response.data;
  },
};

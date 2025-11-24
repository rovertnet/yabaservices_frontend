import api from './api';

export interface Notification {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export const notificationsApi = {
  getAllNotifications: async () => {
    const response = await api.get<Notification[]>('/notifications');
    return response.data;
  },

  markAsRead: async (id: number) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },
};

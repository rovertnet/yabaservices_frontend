import api from './api';

export interface Message {
  id: number;
  content: string;
  senderId: number;
  bookingId: number;
  createdAt: string;
  sender: {
    id: number;
    name: string;
  };
}

export const messagesApi = {
  sendMessage: async (bookingId: number, content: string) => {
    const response = await api.post<Message>('/messages', { bookingId, content });
    return response.data;
  },

  getMessages: async (bookingId: number) => {
    const response = await api.get<Message[]>(`/messages/booking/${bookingId}`);
    return response.data;
  },
};

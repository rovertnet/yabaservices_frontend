import api from './api';
import type { Service } from './services';

export interface Booking {
  id: number;
  date: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  clientId: number;
  providerId: number;
  serviceId: number;
  createdAt: string;
  updatedAt: string;
  service?: Service;
  client?: {
    id: number;
    name: string;
    email: string;
  };
  provider?: {
    id: number;
    name: string;
    email: string;
  };
}

export const bookingsApi = {
  createBooking: async (data: { serviceId: number; date: string }) => {
    const response = await api.post<Booking>('/bookings', data);
    return response.data;
  },

  getAllBookings: async () => {
    const response = await api.get<Booking[]>('/bookings');
    return response.data;
  },

  getBookingById: async (id: number) => {
    const response = await api.get<Booking>(`/bookings/${id}`);
    return response.data;
  },

  updateBookingStatus: async (id: number, status: Booking['status']) => {
    const response = await api.patch<Booking>(`/bookings/${id}/status`, { status });
    return response.data;
  }
};

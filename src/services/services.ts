import api from './api';

export interface Service {
  id: number;
  title: string;
  description: string;
  price: number;
  providerId: number;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
  provider?: {
    id: number;
    name: string;
    email: string;
    latitude?: number;
    longitude?: number;
  };
  category?: {
    id: number;
    name: string;
    icon: string;
  };
  imageUrl?: string;
  _count?: {
    bookings: number;
  };
  distance?: number;
}

export const servicesApi = {
  getAllServices: async (lat?: number, lng?: number): Promise<Service[]> => {
    const params = new URLSearchParams();
    if (lat) params.append('lat', lat.toString());
    if (lng) params.append('lng', lng.toString());
    
    const response = await api.get<Service[]>(`/services?${params.toString()}`);
    return response.data;
  },

  getServiceById: async (id: number) => {
    const response = await api.get<Service>(`/services/${id}`);
    return response.data;
  },

  createService: async (data: FormData | { title: string; description: string; price: number; categoryId: number }) => {
    const config = data instanceof FormData
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
    const response = await api.post<Service>('/services', data, config);
    return response.data;
  },

  
  deleteService: async (id: number) => {
      const response = await api.delete(`/services/${id}`);
      return response.data;
  },

  getMyServices: async () => {
    const response = await api.get<Service[]>('/services/my-services');
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get<{ id: number; name: string; icon: string }[]>('/categories');
    return response.data;
  }
};

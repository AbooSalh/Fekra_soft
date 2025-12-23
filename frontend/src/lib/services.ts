import api from './api';
import { AuthResponse } from '../types';

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  register: async (data: any): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export const donationService = {
  getAvailable: () => api.get('/donations/available'),
  getMy: () => api.get('/donations/my'),
  getById: (id: number) => api.get(`/donations/${id}`),
  create: (data: any) => api.post('/donations', data),
  update: (id: number, data: any) => api.put(`/donations/${id}`, data),
  cancel: (id: number) => api.delete(`/donations/${id}`),
};

export const deliveryService = {
  getAvailable: () => api.get('/deliveries/available'),
  getMy: () => api.get('/deliveries/my'),
  accept: (id: number) => api.post(`/deliveries/${id}/accept`),
  updateStatus: (id: number, status: string) => api.put(`/deliveries/${id}/status`, { status }),
  confirmReceipt: (id: number) => api.post(`/deliveries/${id}/confirm`),
  updateLocation: (id: number, latitude: number, longitude: number) => 
    api.put(`/deliveries/${id}/location`, { latitude, longitude }),
};

export const notificationService = {
  getAll: () => api.get('/notifications'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id: number) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
};

export const userService = {
  getMe: () => api.get('/users/me'),
  getStats: () => api.get('/users/stats'),
  getLeaderboard: () => api.get('/users/leaderboard'),
  getPending: () => api.get('/users/pending'),
  approve: (id: number) => api.put(`/users/${id}/approve`),
  reject: (id: number) => api.put(`/users/${id}/reject`),
};

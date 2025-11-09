import api from './api';
import type { AdminStats, AdminUser, AdminProduct } from '../types/admin';

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export const adminService = {
  getStats: async (): Promise<AdminStats> => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getUsers: async (
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<AdminUser>> => {
    const response = await api.get('/admin/users', {
      params: { page, limit },
    });
    return response.data;
  },

  deleteUser: async (userId: string): Promise<void> => {
    await api.delete(`/admin/users/${userId}`);
  },

  updateUserRole: async (
    userId: string,
    role: 'USER' | 'ADMIN'
  ): Promise<AdminUser> => {
    const response = await api.patch(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  getAllProducts: async (
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<AdminProduct>> => {
    const response = await api.get('/admin/products', {
      params: { page, limit },
    });
    return response.data;
  },

  deleteProduct: async (productId: string): Promise<void> => {
    await api.delete(`/admin/products/${productId}`);
  },
};

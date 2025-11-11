import api from '../../../services/api';
import type { AdminStats, AdminUser, AdminProduct } from '../types/admin.types';

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

export class AdminService {
  static async getStats(): Promise<AdminStats> {
    const response = await api.get('/admin/stats');
    return response.data;
  }

  static async getUsers(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<AdminUser>> {
    const response = await api.get('/admin/users', {
      params: { page, limit },
    });
    return response.data;
  }

  static async deleteUser(userId: string): Promise<void> {
    await api.delete(`/admin/users/${userId}`);
  }

  static async updateUserRole(
    userId: string,
    role: 'USER' | 'ADMIN'
  ): Promise<AdminUser> {
    const response = await api.patch(`/admin/users/${userId}/role`, { role });
    return response.data;
  }

  static async getAllProducts(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<AdminProduct>> {
    const response = await api.get('/admin/products', {
      params: { page, limit },
    });
    return response.data;
  }

  static async deleteProduct(productId: string): Promise<void> {
    await api.delete(`/admin/products/${productId}`);
  }
}

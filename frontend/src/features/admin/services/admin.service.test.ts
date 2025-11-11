import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdminService } from './admin.service';
import api from '../../../services/api';
import type { AdminStats, AdminUser, AdminProduct } from '../types/admin.types';

// Mock the api module
vi.mock('../../../services/api');

describe('AdminService', () => {
  const mockAdminUser: AdminUser = {
    id: 'user-1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'ADMIN',
    createdAt: '2025-01-01T00:00:00.000Z',
    _count: {
      products: 5,
    },
  };

  const mockRegularUser: AdminUser = {
    id: 'user-2',
    email: 'user@example.com',
    name: 'Regular User',
    role: 'USER',
    createdAt: '2025-01-02T00:00:00.000Z',
    _count: {
      products: 3,
    },
  };

  const mockAdminProduct: AdminProduct = {
    id: 'product-1',
    name: 'Test Album',
    artist: 'Test Artist',
    coverImage: 'https://example.com/cover.jpg',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    userId: 'user-1',
    user: {
      id: 'user-1',
      name: 'Test User',
      email: 'test@example.com',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getStats', () => {
    it('should fetch admin statistics successfully', async () => {
      const mockStats: AdminStats = {
        totalUsers: 10,
        totalProducts: 25,
        recentProducts: [
          {
            id: 'product-1',
            name: 'Recent Album',
            artist: 'Recent Artist',
            coverImage: 'https://example.com/recent.jpg',
            createdAt: '2025-01-05T00:00:00.000Z',
            user: {
              name: 'User Name',
              email: 'user@example.com',
            },
          },
        ],
      };

      const mockResponse = {
        data: mockStats,
      };

      vi.mocked(api.get).mockResolvedValue(mockResponse);

      const result = await AdminService.getStats();

      expect(api.get).toHaveBeenCalledWith('/admin/stats');
      expect(result).toEqual(mockStats);
      expect(result.totalUsers).toBe(10);
      expect(result.totalProducts).toBe(25);
      expect(result.recentProducts).toHaveLength(1);
    });

    it('should throw error when fetching stats fails', async () => {
      const mockError = new Error('Unauthorized');
      vi.mocked(api.get).mockRejectedValue(mockError);

      await expect(AdminService.getStats()).rejects.toThrow('Unauthorized');
      expect(api.get).toHaveBeenCalledWith('/admin/stats');
    });
  });

  describe('getUsers', () => {
    it('should fetch paginated users with default pagination', async () => {
      const mockResponse = {
        data: {
          data: [mockAdminUser, mockRegularUser],
          pagination: {
            page: 1,
            limit: 10,
            total: 2,
            totalPages: 1,
            hasMore: false,
          },
        },
      };

      vi.mocked(api.get).mockResolvedValue(mockResponse);

      const result = await AdminService.getUsers();

      expect(api.get).toHaveBeenCalledWith('/admin/users', {
        params: { page: 1, limit: 10 },
      });
      expect(result.data).toHaveLength(2);
      expect(result.data[0]).toEqual(mockAdminUser);
      expect(result.pagination.total).toBe(2);
    });

    it('should fetch paginated users with custom pagination', async () => {
      const mockResponse = {
        data: {
          data: [mockAdminUser],
          pagination: {
            page: 2,
            limit: 5,
            total: 10,
            totalPages: 2,
            hasMore: false,
          },
        },
      };

      vi.mocked(api.get).mockResolvedValue(mockResponse);

      const result = await AdminService.getUsers(2, 5);

      expect(api.get).toHaveBeenCalledWith('/admin/users', {
        params: { page: 2, limit: 5 },
      });
      expect(result.data).toHaveLength(1);
      expect(result.pagination.page).toBe(2);
      expect(result.pagination.limit).toBe(5);
    });

    it('should throw error when fetching users fails', async () => {
      const mockError = new Error('Access denied');
      vi.mocked(api.get).mockRejectedValue(mockError);

      await expect(AdminService.getUsers()).rejects.toThrow('Access denied');
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      vi.mocked(api.delete).mockResolvedValue({});

      await AdminService.deleteUser('user-123');

      expect(api.delete).toHaveBeenCalledWith('/admin/users/user-123');
    });

    it('should throw error when deleting user fails', async () => {
      const mockError = new Error('User not found');
      vi.mocked(api.delete).mockRejectedValue(mockError);

      await expect(AdminService.deleteUser('invalid-id')).rejects.toThrow(
        'User not found'
      );
      expect(api.delete).toHaveBeenCalledWith('/admin/users/invalid-id');
    });
  });

  describe('updateUserRole', () => {
    it('should update user role to ADMIN successfully', async () => {
      const updatedUser: AdminUser = {
        ...mockRegularUser,
        role: 'ADMIN',
      };

      const mockResponse = {
        data: updatedUser,
      };

      vi.mocked(api.patch).mockResolvedValue(mockResponse);

      const result = await AdminService.updateUserRole('user-2', 'ADMIN');

      expect(api.patch).toHaveBeenCalledWith('/admin/users/user-2/role', {
        role: 'ADMIN',
      });
      expect(result).toEqual(updatedUser);
      expect(result.role).toBe('ADMIN');
    });

    it('should update user role to USER successfully', async () => {
      const updatedUser: AdminUser = {
        ...mockAdminUser,
        role: 'USER',
      };

      const mockResponse = {
        data: updatedUser,
      };

      vi.mocked(api.patch).mockResolvedValue(mockResponse);

      const result = await AdminService.updateUserRole('user-1', 'USER');

      expect(api.patch).toHaveBeenCalledWith('/admin/users/user-1/role', {
        role: 'USER',
      });
      expect(result).toEqual(updatedUser);
      expect(result.role).toBe('USER');
    });

    it('should throw error when updating user role fails', async () => {
      const mockError = new Error('Cannot update own role');
      vi.mocked(api.patch).mockRejectedValue(mockError);

      await expect(
        AdminService.updateUserRole('user-1', 'USER')
      ).rejects.toThrow('Cannot update own role');
    });
  });

  describe('getAllProducts', () => {
    it('should fetch all products with default pagination', async () => {
      const mockResponse = {
        data: {
          data: [mockAdminProduct],
          pagination: {
            page: 1,
            limit: 10,
            total: 1,
            totalPages: 1,
            hasMore: false,
          },
        },
      };

      vi.mocked(api.get).mockResolvedValue(mockResponse);

      const result = await AdminService.getAllProducts();

      expect(api.get).toHaveBeenCalledWith('/admin/products', {
        params: { page: 1, limit: 10 },
      });
      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toEqual(mockAdminProduct);
      expect(result.pagination.total).toBe(1);
    });

    it('should fetch all products with custom pagination', async () => {
      const mockResponse = {
        data: {
          data: [mockAdminProduct, { ...mockAdminProduct, id: 'product-2' }],
          pagination: {
            page: 1,
            limit: 20,
            total: 15,
            totalPages: 1,
            hasMore: false,
          },
        },
      };

      vi.mocked(api.get).mockResolvedValue(mockResponse);

      const result = await AdminService.getAllProducts(1, 20);

      expect(api.get).toHaveBeenCalledWith('/admin/products', {
        params: { page: 1, limit: 20 },
      });
      expect(result.data).toHaveLength(2);
      expect(result.pagination.limit).toBe(20);
    });

    it('should throw error when fetching products fails', async () => {
      const mockError = new Error('Unauthorized');
      vi.mocked(api.get).mockRejectedValue(mockError);

      await expect(AdminService.getAllProducts()).rejects.toThrow(
        'Unauthorized'
      );
    });
  });

  describe('deleteProduct', () => {
    it('should delete product successfully', async () => {
      vi.mocked(api.delete).mockResolvedValue({});

      await AdminService.deleteProduct('product-123');

      expect(api.delete).toHaveBeenCalledWith('/admin/products/product-123');
    });

    it('should throw error when deleting product fails', async () => {
      const mockError = new Error('Product not found');
      vi.mocked(api.delete).mockRejectedValue(mockError);

      await expect(AdminService.deleteProduct('invalid-id')).rejects.toThrow(
        'Product not found'
      );
      expect(api.delete).toHaveBeenCalledWith('/admin/products/invalid-id');
    });
  });
});

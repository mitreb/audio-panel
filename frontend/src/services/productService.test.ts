import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProductService } from './productService';
import api from './api';
import type { Product } from '../types/product';

// Mock the api module
vi.mock('./api');

describe('ProductService', () => {
  const mockProduct: Product = {
    id: '1',
    name: 'Test Album',
    artist: 'Test Artist',
    coverImage: 'https://example.com/cover.jpg',
    userId: 'user-1',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getProducts', () => {
    it('should fetch products with pagination', async () => {
      const mockResponse = {
        data: {
          data: [mockProduct],
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

      const result = await ProductService.getProducts(1, 10);

      expect(api.get).toHaveBeenCalledWith('/products', {
        params: { page: 1, limit: 10 },
      });
      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toEqual(mockProduct);
      expect(result.pagination.page).toBe(1);
    });

    it('should use default pagination values', async () => {
      const mockResponse = {
        data: {
          data: [],
          pagination: {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
            hasMore: false,
          },
        },
      };

      vi.mocked(api.get).mockResolvedValue(mockResponse);

      await ProductService.getProducts();

      expect(api.get).toHaveBeenCalledWith('/products', {
        params: { page: 1, limit: 10 },
      });
    });
  });

  describe('getProduct', () => {
    it('should fetch a single product by ID', async () => {
      const mockResponse = { data: mockProduct };

      vi.mocked(api.get).mockResolvedValue(mockResponse);

      const result = await ProductService.getProduct('1');

      expect(api.get).toHaveBeenCalledWith('/products/1');
      expect(result).toEqual(mockProduct);
    });
  });

  describe('createProduct', () => {
    it('should create a product with cover image', async () => {
      const mockFile = new File(['image'], 'cover.jpg', { type: 'image/jpeg' });
      const createData = {
        name: 'New Album',
        artist: 'New Artist',
        coverImage: mockFile,
      };

      const mockResponse = { data: mockProduct };
      vi.mocked(api.post).mockResolvedValue(mockResponse);

      const result = await ProductService.createProduct(createData);

      expect(api.post).toHaveBeenCalledWith('/products', expect.any(FormData), {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      expect(result).toEqual(mockProduct);
    });

    it('should create a product without cover image', async () => {
      const createData = {
        name: 'New Album',
        artist: 'New Artist',
      };

      const mockResponse = { data: mockProduct };
      vi.mocked(api.post).mockResolvedValue(mockResponse);

      const result = await ProductService.createProduct(createData);

      expect(api.post).toHaveBeenCalled();
      expect(result).toEqual(mockProduct);
    });
  });

  describe('updateProduct', () => {
    it('should update product with all fields', async () => {
      const mockFile = new File(['image'], 'new-cover.jpg', {
        type: 'image/jpeg',
      });
      const updateData = {
        name: 'Updated Album',
        artist: 'Updated Artist',
        coverImage: mockFile,
      };

      const mockResponse = { data: mockProduct };
      vi.mocked(api.put).mockResolvedValue(mockResponse);

      const result = await ProductService.updateProduct('1', updateData);

      expect(api.put).toHaveBeenCalledWith(
        '/products/1',
        expect.any(FormData),
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      expect(result).toEqual(mockProduct);
    });

    it('should update product with partial fields', async () => {
      const updateData = {
        name: 'Updated Album',
      };

      const mockResponse = { data: mockProduct };
      vi.mocked(api.put).mockResolvedValue(mockResponse);

      const result = await ProductService.updateProduct('1', updateData);

      expect(api.put).toHaveBeenCalled();
      expect(result).toEqual(mockProduct);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product by ID', async () => {
      vi.mocked(api.delete).mockResolvedValue({ data: null });

      await ProductService.deleteProduct('1');

      expect(api.delete).toHaveBeenCalledWith('/products/1');
    });
  });

  describe('error handling', () => {
    it('should propagate errors from API', async () => {
      const error = new Error('Network error');
      vi.mocked(api.get).mockRejectedValue(error);

      await expect(ProductService.getProducts()).rejects.toThrow(
        'Network error'
      );
    });
  });
});

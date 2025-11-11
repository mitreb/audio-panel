import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProductService } from './products.service';
import api from '../../../services/api';
import type { Product } from '../types/products.types';

// Mock the api module
vi.mock('../../../services/api');

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
    it('should create a product with all required fields', async () => {
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

      // Verify all required fields are included in FormData
      const formData = vi.mocked(api.post).mock.calls[0][1] as FormData;
      expect(formData.get('name')).toBe('New Album');
      expect(formData.get('artist')).toBe('New Artist');
      expect(formData.get('coverImage')).toBeInstanceOf(File);
    });

    it('should reject creation without cover image', async () => {
      // This test verifies that the API rejects products without cover images
      const mockError = {
        response: {
          data: { error: 'Cover image is required' },
          status: 400,
        },
      };
      vi.mocked(api.post).mockRejectedValue(mockError);

      const invalidData = {
        name: 'New Album',
        artist: 'New Artist',
        // Missing coverImage
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any; // Cast to any to bypass TypeScript checks for testing

      await expect(
        ProductService.createProduct(invalidData)
      ).rejects.toMatchObject({
        response: {
          status: 400,
          data: { error: 'Cover image is required' },
        },
      });
    });
  });

  describe('updateProduct', () => {
    it('should update product with all required fields', async () => {
      const mockFile = new File(['image'], 'new-cover.jpg', {
        type: 'image/jpeg',
      });
      const updateData = {
        name: 'Updated Album',
        artist: 'Updated Artist',
        coverImage: mockFile,
      };

      const mockResponse = { data: mockProduct };
      vi.mocked(api.patch).mockResolvedValue(mockResponse);

      const result = await ProductService.updateProduct('1', updateData);

      expect(api.patch).toHaveBeenCalledWith(
        '/products/1',
        expect.any(FormData),
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      expect(result).toEqual(mockProduct);

      // Verify all required fields are included in FormData
      const formData = vi.mocked(api.patch).mock.calls[0][1] as FormData;
      expect(formData.get('name')).toBe('Updated Album');
      expect(formData.get('artist')).toBe('Updated Artist');
      expect(formData.get('coverImage')).toBeInstanceOf(File);
    });

    it('should reject partial updates without all required fields', async () => {
      // This test verifies that the API rejects partial updates
      const mockError = {
        response: {
          data: { error: 'All fields (name, artist, coverImage) are required' },
          status: 400,
        },
      };
      vi.mocked(api.patch).mockRejectedValue(mockError);

      const partialData = {
        name: 'Updated Album',
        // Missing artist and coverImage
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any; // Cast to any to bypass TypeScript checks for testing

      await expect(
        ProductService.updateProduct('1', partialData)
      ).rejects.toMatchObject({
        response: {
          status: 400,
          data: { error: 'All fields (name, artist, coverImage) are required' },
        },
      });
    });

    it('should reject update without cover image', async () => {
      // This test verifies that the API rejects updates without cover images
      const mockError = {
        response: {
          data: { error: 'Cover image is required' },
          status: 400,
        },
      };
      vi.mocked(api.patch).mockRejectedValue(mockError);

      const invalidData = {
        name: 'Updated Album',
        artist: 'Updated Artist',
        // Missing coverImage
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any; // Cast to any to bypass TypeScript checks for testing

      await expect(
        ProductService.updateProduct('1', invalidData)
      ).rejects.toMatchObject({
        response: {
          status: 400,
          data: { error: 'Cover image is required' },
        },
      });
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

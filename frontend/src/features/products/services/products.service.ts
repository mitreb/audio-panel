import api from '../../../services/api';
import type {
  Product,
  CreateProductData,
  UpdateProductData,
} from '../types/products.types';

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

export class ProductService {
  // Get current user's products with pagination
  static async getProducts(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Product>> {
    const response = await api.get<PaginatedResponse<Product>>('/products', {
      params: { page, limit },
    });
    return response.data;
  }

  // Get single product by ID
  static async getProduct(id: string): Promise<Product> {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  }

  // Create new product
  static async createProduct(data: CreateProductData): Promise<Product> {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('artist', data.artist);

    if (data.coverImage) {
      formData.append('coverImage', data.coverImage);
    }

    const response = await api.post<Product>('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Update existing product
  static async updateProduct(
    id: string,
    data: UpdateProductData
  ): Promise<Product> {
    const formData = new FormData();

    if (data.name !== undefined) {
      formData.append('name', data.name);
    }
    if (data.artist !== undefined) {
      formData.append('artist', data.artist);
    }
    if (data.coverImage) {
      formData.append('coverImage', data.coverImage);
    }

    const response = await api.patch<Product>(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Delete product
  static async deleteProduct(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  }
}

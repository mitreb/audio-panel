export interface Product {
  id: string;
  name: string;
  artist: string;
  coverImage: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  name: string;
  artist: string;
  coverImage: File;
}

export interface UpdateProductData {
  name: string;
  artist: string;
  coverImage: File;
}

export interface ApiError {
  error: string;
  details?: unknown;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  details?: unknown;
}

import { useQuery } from '@tanstack/react-query';
import { ProductService } from '../services/products.service';
import type { PaginatedResponse } from '../services/products.service';
import type { Product } from '../types/products.types';

export const PRODUCTS_QUERY_KEY = 'products';

export const useProducts = (page: number = 1, limit: number = 10) => {
  return useQuery<PaginatedResponse<Product>>({
    queryKey: [PRODUCTS_QUERY_KEY, page, limit],
    queryFn: () => ProductService.getProducts(page, limit),
  });
};

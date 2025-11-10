import { useQuery } from '@tanstack/react-query';
import { ProductService } from '../services/products.service';
import type { Product } from '../types/products.types';

export const PRODUCT_QUERY_KEY = 'product';

export const useProduct = (id: string | undefined) => {
  return useQuery<Product>({
    queryKey: [PRODUCT_QUERY_KEY, id],
    queryFn: () => {
      if (!id) {
        throw new Error('Product ID is required');
      }
      return ProductService.getProduct(id);
    },
    enabled: !!id, // Only run query if id is defined
  });
};

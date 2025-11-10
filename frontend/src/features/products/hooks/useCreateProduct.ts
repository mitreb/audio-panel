import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProductService } from '../services/products.service';
import type { CreateProductData, Product } from '../types/products.types';
import { PRODUCTS_QUERY_KEY } from './useProducts';

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<Product, Error, CreateProductData>({
    mutationFn: (data: CreateProductData) => ProductService.createProduct(data),
    onSuccess: () => {
      // Invalidate products list to refetch
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
    },
  });
};

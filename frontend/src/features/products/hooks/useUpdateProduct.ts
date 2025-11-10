import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProductService } from '../services/products.service';
import type { UpdateProductData, Product } from '../types/products.types';
import { PRODUCTS_QUERY_KEY } from './useProducts';
import { PRODUCT_QUERY_KEY } from './useProduct';

interface UpdateProductVariables {
  id: string;
  data: UpdateProductData;
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<Product, Error, UpdateProductVariables>({
    mutationFn: ({ id, data }: UpdateProductVariables) =>
      ProductService.updateProduct(id, data),
    onSuccess: (data) => {
      // Invalidate products list
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
      // Invalidate specific product query
      queryClient.invalidateQueries({ queryKey: [PRODUCT_QUERY_KEY, data.id] });
    },
  });
};

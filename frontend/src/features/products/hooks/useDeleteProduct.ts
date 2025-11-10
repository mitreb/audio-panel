import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProductService } from '../services/products.service';
import { PRODUCTS_QUERY_KEY } from './useProducts';
import { PRODUCT_QUERY_KEY } from './useProduct';

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id: string) => ProductService.deleteProduct(id),
    onSuccess: (_, id) => {
      // Invalidate products list to refetch
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
      // Remove specific product from cache
      queryClient.removeQueries({ queryKey: [PRODUCT_QUERY_KEY, id] });
    },
  });
};

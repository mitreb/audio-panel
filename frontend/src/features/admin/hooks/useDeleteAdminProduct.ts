import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminService } from '../services/admin.service';
import { ADMIN_PRODUCTS_QUERY_KEY } from './useAdminProducts';
import { ADMIN_STATS_QUERY_KEY } from './useAdminStats';
import { ADMIN_USERS_QUERY_KEY } from './useAdminUsers';

export const useDeleteAdminProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (productId: string) => AdminService.deleteProduct(productId),
    onSuccess: () => {
      // Invalidate products list, stats, and users (to update product counts) to refetch
      queryClient.invalidateQueries({ queryKey: [ADMIN_PRODUCTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [ADMIN_STATS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [ADMIN_USERS_QUERY_KEY] });
    },
  });
};

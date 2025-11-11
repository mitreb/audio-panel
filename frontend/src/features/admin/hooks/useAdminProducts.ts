import { useQuery } from '@tanstack/react-query';
import { AdminService } from '../services/admin.service';
import type { PaginatedResponse } from '../services/admin.service';
import type { AdminProduct } from '../types/admin.types';

export const ADMIN_PRODUCTS_QUERY_KEY = 'admin-products';

export const useAdminProducts = (page: number = 1, limit: number = 10) => {
  return useQuery<PaginatedResponse<AdminProduct>>({
    queryKey: [ADMIN_PRODUCTS_QUERY_KEY, page, limit],
    queryFn: () => AdminService.getAllProducts(page, limit),
  });
};

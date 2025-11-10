import { useQuery } from '@tanstack/react-query';
import { adminService } from '../services/admin.service';
import type { PaginatedResponse } from '../services/admin.service';
import type { AdminUser } from '../types/admin.types';

export const ADMIN_USERS_QUERY_KEY = 'admin-users';

export const useAdminUsers = (page: number = 1, limit: number = 10) => {
  return useQuery<PaginatedResponse<AdminUser>>({
    queryKey: [ADMIN_USERS_QUERY_KEY, page, limit],
    queryFn: () => adminService.getUsers(page, limit),
  });
};

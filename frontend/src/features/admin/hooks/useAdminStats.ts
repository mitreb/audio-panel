import { useQuery } from '@tanstack/react-query';
import { adminService } from '../services/admin.service';
import type { AdminStats } from '../types/admin.types';

export const ADMIN_STATS_QUERY_KEY = 'admin-stats';

export const useAdminStats = () => {
  return useQuery<AdminStats>({
    queryKey: [ADMIN_STATS_QUERY_KEY],
    queryFn: () => adminService.getStats(),
  });
};

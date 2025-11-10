import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../services/admin.service';
import { ADMIN_USERS_QUERY_KEY } from './useAdminUsers';
import { ADMIN_STATS_QUERY_KEY } from './useAdminStats';

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (userId: string) => adminService.deleteUser(userId),
    onSuccess: () => {
      // Invalidate users list and stats to refetch
      queryClient.invalidateQueries({ queryKey: [ADMIN_USERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [ADMIN_STATS_QUERY_KEY] });
    },
  });
};

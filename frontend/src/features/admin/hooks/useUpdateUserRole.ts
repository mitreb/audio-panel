import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../services/admin.service';
import type { AdminUser } from '../types/admin.types';
import { ADMIN_USERS_QUERY_KEY } from './useAdminUsers';

interface UpdateUserRoleVariables {
  userId: string;
  role: 'USER' | 'ADMIN';
}

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation<AdminUser, Error, UpdateUserRoleVariables>({
    mutationFn: ({ userId, role }: UpdateUserRoleVariables) =>
      adminService.updateUserRole(userId, role),
    onSuccess: () => {
      // Invalidate users list to refetch
      queryClient.invalidateQueries({ queryKey: [ADMIN_USERS_QUERY_KEY] });
    },
  });
};

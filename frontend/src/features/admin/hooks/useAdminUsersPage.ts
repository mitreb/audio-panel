import { useState } from 'react';
import { useAdminUsers, useDeleteUser, useUpdateUserRole } from '.';
import { useAuth } from '../../auth';

const ITEMS_PER_PAGE = 10;

export const useAdminUsersPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [toggleRoleDialogOpen, setToggleRoleDialogOpen] = useState(false);
  const [userToToggle, setUserToToggle] = useState<{
    id: string;
    name: string;
    role: 'USER' | 'ADMIN';
  } | null>(null);
  const { user: currentUser } = useAuth();

  const { data, isLoading, error } = useAdminUsers(currentPage, ITEMS_PER_PAGE);
  const deleteUserMutation = useDeleteUser();
  const updateUserRoleMutation = useUpdateUserRole();

  const handleDeleteClick = (userId: string, userName: string) => {
    setUserToDelete({ id: userId, name: userName });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      await deleteUserMutation.mutateAsync(userToDelete.id);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (err) {
      console.error('Failed to delete user', err);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleToggleRole = (
    userId: string,
    currentRole: 'USER' | 'ADMIN',
    userName: string
  ) => {
    setUserToToggle({ id: userId, name: userName, role: currentRole });
    setToggleRoleDialogOpen(true);
  };

  const handleToggleRoleConfirm = async () => {
    if (!userToToggle) return;

    const newRole = userToToggle.role === 'ADMIN' ? 'USER' : 'ADMIN';

    try {
      await updateUserRoleMutation.mutateAsync({
        userId: userToToggle.id,
        role: newRole,
      });
      setToggleRoleDialogOpen(false);
      setUserToToggle(null);
    } catch (err) {
      console.error('Failed to update role', err);
    }
  };

  const handleToggleRoleCancel = () => {
    setToggleRoleDialogOpen(false);
    setUserToToggle(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    // Data
    users: data?.data || [],
    totalPages: data?.pagination.totalPages || 1,
    total: data?.pagination.total || 0,
    currentPage,
    currentUser,
    isLoading,
    error,

    // Delete dialog state
    deleteDialogOpen,
    userToDelete,

    // Toggle role dialog state
    toggleRoleDialogOpen,
    userToToggle,

    // Actions
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    handleToggleRole,
    handleToggleRoleConfirm,
    handleToggleRoleCancel,
    handlePageChange,
  };
};

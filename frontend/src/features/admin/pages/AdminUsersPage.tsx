import { useAdminUsersPage } from '../hooks';
import {
  UsersTable,
  UsersPagination,
  DeleteUserDialog,
} from '../components/users';
import { PageLoader } from '@/components/page-loader';

export const AdminUsersPage = () => {
  const {
    users,
    totalPages,
    total,
    currentPage,
    currentUser,
    isLoading,
    error,
    deleteDialogOpen,
    userToDelete,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    handleToggleRole,
    handlePageChange,
  } = useAdminUsersPage();

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="text-destructive text-center">Failed to load users</div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Manage Users</h2>
        <div className="text-sm text-muted-foreground">
          Total: {total} user{total !== 1 ? 's' : ''}
        </div>
      </div>

      <UsersTable
        users={users}
        currentUserId={currentUser?.id}
        onDeleteClick={handleDeleteClick}
        onToggleRole={handleToggleRole}
      />

      <UsersPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <DeleteUserDialog
        open={deleteDialogOpen}
        userName={userToDelete?.name}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};

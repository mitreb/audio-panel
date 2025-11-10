import { useEffect, useState } from 'react';
import { adminService } from '../services/adminService';
import type { AdminUser } from '../types/admin';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../components/ui/pagination';
import { Trash2, Shield, User as UserIcon } from 'lucide-react';
import { useAuth } from '../features/auth';

const ITEMS_PER_PAGE = 10;

export const AdminUsersPage = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    loadUsers(currentPage);
  }, [currentPage]);

  const loadUsers = async (page: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminService.getUsers(page, ITEMS_PER_PAGE);
      setUsers(response.data);
      setTotalPages(response.pagination.totalPages);
      setTotal(response.pagination.total);
    } catch (err) {
      console.error('Failed to load users', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (userId: string, userName: string) => {
    setUserToDelete({ id: userId, name: userName });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      await adminService.deleteUser(userToDelete.id);
      await loadUsers(currentPage);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (err) {
      console.error('Failed to delete user', err);
      setError('Failed to delete user');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleToggleRole = async (
    userId: string,
    currentRole: 'USER' | 'ADMIN',
    userName: string
  ) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    const action = newRole === 'ADMIN' ? 'promote to admin' : 'demote to user';

    if (confirm(`Are you sure you want to ${action} "${userName}"?`)) {
      try {
        await adminService.updateUserRole(userId, newRole);
        await loadUsers(currentPage);
      } catch (err) {
        console.error('Failed to update role', err);
        alert('Failed to update user role');
      }
    }
  };

  if (loading) {
    return <div className="text-center">Loading users...</div>;
  }

  if (error) {
    return <div className="text-destructive text-center">{error}</div>;
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Manage Users</h2>
        <div className="text-sm text-muted-foreground">
          Total: {total} user{total !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="border rounded-lg bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Created</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={user.role === 'ADMIN' ? 'default' : 'secondary'}
                  >
                    {user.role === 'ADMIN' ? (
                      <Shield className="h-3 w-3 mr-1 inline" />
                    ) : (
                      <UserIcon className="h-3 w-3 mr-1 inline" />
                    )}
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>{user._count.products}</TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleToggleRole(user.id, user.role, user.name)
                      }
                      disabled={user.id === currentUser?.id}
                    >
                      {user.role === 'ADMIN' ? 'Demote' : 'Promote'}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteClick(user.id, user.name)}
                      disabled={user.id === currentUser?.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={
                    currentPage === 1
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => {
                  // Show first page, last page, current page, and pages around current
                  const showPage =
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1);

                  const showEllipsisBefore =
                    page === currentPage - 2 && currentPage > 3;
                  const showEllipsisAfter =
                    page === currentPage + 2 && currentPage < totalPages - 2;

                  if (showEllipsisBefore || showEllipsisAfter) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }

                  if (!showPage) return null;

                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  className={
                    currentPage === totalPages
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{userToDelete?.name}"? This will
              also delete all their products. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleDeleteCancel}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

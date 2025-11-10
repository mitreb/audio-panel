import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Shield, User as UserIcon } from 'lucide-react';
import type { AdminUser } from '../../types/admin.types';

interface UsersTableProps {
  users: AdminUser[];
  currentUserId: string | undefined;
  onDeleteClick: (userId: string, userName: string) => void;
  onToggleRole: (
    userId: string,
    currentRole: 'USER' | 'ADMIN',
    userName: string
  ) => void;
}

export function UsersTable({
  users,
  currentUserId,
  onDeleteClick,
  onToggleRole,
}: UsersTableProps) {
  return (
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
                    onClick={() => onToggleRole(user.id, user.role, user.name)}
                    disabled={user.id === currentUserId}
                  >
                    {user.role === 'ADMIN' ? 'Demote' : 'Promote'}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDeleteClick(user.id, user.name)}
                    disabled={user.id === currentUserId}
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
  );
}

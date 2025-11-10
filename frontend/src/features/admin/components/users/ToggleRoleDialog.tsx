import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ToggleRoleDialogProps {
  open: boolean;
  userName: string | undefined;
  currentRole: 'USER' | 'ADMIN';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ToggleRoleDialog({
  open,
  userName,
  currentRole,
  onConfirm,
  onCancel,
}: ToggleRoleDialogProps) {
  const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
  const action = newRole === 'ADMIN' ? 'promote to admin' : 'demote to user';

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change User Role</DialogTitle>
          <DialogDescription>
            Are you sure you want to {action} "{userName}"? This will change
            their permissions immediately.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

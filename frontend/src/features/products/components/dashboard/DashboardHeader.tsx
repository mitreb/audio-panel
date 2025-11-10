import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function DashboardHeader() {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold">My Products</h2>
        <p className="text-sm text-muted-foreground">
          Manage your music products
        </p>
      </div>
      <Button asChild>
        <Link to="/create">
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Link>
      </Button>
    </div>
  );
}

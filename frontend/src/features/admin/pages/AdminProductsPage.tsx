import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAdminProductsPage } from '../hooks';
import {
  ProductsTable,
  ProductsGrid,
  ProductsPagination,
  DeleteProductDialog,
} from '../components/products';
import { PageLoader } from '@/components/page-loader';
import { ViewSwitcher } from '@/components/ViewSwitcher';
import { Button } from '@/components/ui/button';

export function AdminProductsPage() {
  const [view, setView] = useState<'table' | 'grid'>('grid');
  const {
    products,
    totalPages,
    total,
    currentPage,
    isLoading,
    error,
    deleteDialogOpen,
    productToDelete,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    handlePageChange,
  } = useAdminProductsPage();

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="text-destructive text-center">
        Failed to load products
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold">Manage Products</h2>
          <p className="text-sm text-muted-foreground">
            Total: {total} product{total !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button asChild>
            <Link to="/create">
              <Plus className="mr-0 sm:mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Add Product</span>
            </Link>
          </Button>
          <ViewSwitcher view={view} onViewChange={setView} />
        </div>
      </div>

      {view === 'table' ? (
        <ProductsTable products={products} onDeleteClick={handleDeleteClick} />
      ) : (
        <ProductsGrid products={products} onDeleteClick={handleDeleteClick} />
      )}

      <div className="mt-8">
        <ProductsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      <DeleteProductDialog
        open={deleteDialogOpen}
        productName={productToDelete?.name}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}

import { Link } from 'react-router-dom';
import { AlertCircle, Plus } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { PageLoader } from '@/components/page-loader';
import { ViewSwitcher } from '@/components/ViewSwitcher';
import { useViewPreference } from '@/hooks/useViewPreference';
import { useUserProductsPage } from '../hooks';
import {
  ProductsTable,
  ProductsGrid,
  ProductsPagination,
  DeleteProductDialog,
} from '../components';

export function UserProductsPage() {
  const [view, setView] = useViewPreference('products-view-preference');
  const {
    products,
    totalPages,
    currentPage,
    isLoading,
    error,
    deleteDialogOpen,
    productToDelete,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    handlePageChange,
  } = useUserProductsPage();

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="flex-1 space-y-4 pt-6">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">Dashboard</h2>
            <p className="text-sm text-muted-foreground">
              Manage your music products
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

        {error && (
          <Alert variant="destructive" className="my-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        {view === 'table' ? (
          <ProductsTable
            products={products}
            onDeleteClick={handleDeleteClick}
          />
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
          product={productToDelete}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      </div>
    </div>
  );
}

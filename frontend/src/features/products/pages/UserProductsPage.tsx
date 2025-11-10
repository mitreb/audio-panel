import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PageLoader } from '@/components/page-loader';
import { useUserProductsPage } from '../hooks';
import {
  DashboardHeader,
  ProductsTable,
  ProductsPagination,
  DeleteProductDialog,
} from '../components';

export function UserProductsPage() {
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
        <DashboardHeader />

        {error && (
          <Alert variant="destructive" className="my-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        <ProductsTable products={products} onDeleteClick={handleDeleteClick} />

        <ProductsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

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

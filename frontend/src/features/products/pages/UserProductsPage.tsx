import { Link } from 'react-router-dom';
import { Plus, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useUserProductsPage } from '../hooks';
import {
  DashboardHeader,
  ProductsTable,
  ProductsPagination,
  DeleteProductDialog,
} from '../components';

export const UserProductsPage = () => {
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
    return (
      <div className="flex-1 space-y-4 pt-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">My Products</h2>
            <Button asChild>
              <Link to="/create">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Link>
            </Button>
          </div>
          <div className="mt-8 text-center">
            <p>Loading your products...</p>
          </div>
        </div>
      </div>
    );
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
};

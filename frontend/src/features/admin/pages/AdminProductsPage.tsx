import { useAdminProductsPage } from '../hooks';
import {
  ProductsTable,
  ProductsPagination,
  DeleteProductDialog,
} from '../components/products';

export const AdminProductsPage = () => {
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
    return <div className="text-center">Loading products...</div>;
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Manage Products</h2>
        <div className="text-sm text-muted-foreground">
          Total: {total} product{total !== 1 ? 's' : ''}
        </div>
      </div>

      <ProductsTable products={products} onDeleteClick={handleDeleteClick} />

      <ProductsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <DeleteProductDialog
        open={deleteDialogOpen}
        productName={productToDelete?.name}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};

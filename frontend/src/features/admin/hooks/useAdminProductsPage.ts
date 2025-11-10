import { useState } from 'react';
import { useAdminProducts, useDeleteAdminProduct } from '.';

const ITEMS_PER_PAGE = 10;

export const useAdminProductsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const { data, isLoading, error } = useAdminProducts(
    currentPage,
    ITEMS_PER_PAGE
  );
  const deleteProductMutation = useDeleteAdminProduct();

  const handleDeleteClick = (productId: string, productName: string) => {
    setProductToDelete({ id: productId, name: productName });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      await deleteProductMutation.mutateAsync(productToDelete.id);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (err) {
      console.error('Failed to delete product', err);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    // Data
    products: data?.data || [],
    totalPages: data?.pagination.totalPages || 1,
    total: data?.pagination.total || 0,
    currentPage,
    isLoading,
    error,

    // Delete dialog state
    deleteDialogOpen,
    productToDelete,

    // Actions
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    handlePageChange,
  };
};

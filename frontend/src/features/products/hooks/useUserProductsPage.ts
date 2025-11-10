import { useState } from 'react';
import { useProducts, useDeleteProduct } from '.';
import type { Product } from '../types/products.types';

const ITEMS_PER_PAGE = 10;

export const useUserProductsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const { data, isLoading, error } = useProducts(currentPage, ITEMS_PER_PAGE);
  const deleteProductMutation = useDeleteProduct();

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      await deleteProductMutation.mutateAsync(productToDelete.id);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error('Failed to delete product:', error);
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
    products: data?.data || [],
    totalPages: data?.pagination.totalPages || 1,
    currentPage,
    isLoading,
    error,
    deleteDialogOpen,
    productToDelete,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    handlePageChange,
  };
};

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useProduct, useUpdateProduct } from '.';
import type { UpdateProductData } from '../types/products.types';

const formSchema = z.object({
  name: z
    .string()
    .min(1, 'Product name is required')
    .max(100, 'Product name must be less than 100 characters'),
  artist: z
    .string()
    .min(1, 'Artist name is required')
    .max(100, 'Artist name must be less than 100 characters'),
  coverImage: z.instanceof(File).optional(),
});

export type UpdateProductFormData = z.infer<typeof formSchema>;

export const useUpdateProductPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { data: product, isLoading, error: queryError } = useProduct(id);
  const updateProductMutation = useUpdateProduct();

  const form = useForm<UpdateProductFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      artist: '',
    },
  });

  // Load product data into form when it's available
  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        artist: product.artist,
      });
    }
  }, [product, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);

    // Clean up previous preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (file) {
      // Create preview URL for the selected image
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      form.setValue('coverImage', file);
    } else {
      setPreviewUrl(null);
    }
  };

  const onSubmit = async (data: UpdateProductFormData) => {
    if (!id) {
      return;
    }

    // Validate that cover image is selected
    if (!selectedFile) {
      return;
    }

    const updateData: UpdateProductData = {
      name: data.name,
      artist: data.artist,
      coverImage: selectedFile,
    };

    try {
      await updateProductMutation.mutateAsync({ id, data: updateData });
      navigate('/'); // Navigate back to product list
    } catch (err) {
      // Error is handled by React Query
      console.error('Failed to update product:', err);
    }
  };

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return {
    id,
    form,
    product,
    isLoading,
    queryError,
    selectedFile,
    previewUrl,
    updateProductMutation,
    handleFileChange,
    onSubmit,
  };
};

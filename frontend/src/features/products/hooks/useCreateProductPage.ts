import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateProduct } from '.';
import type { CreateProductData } from '../types/products.types';

const formSchema = z.object({
  name: z
    .string()
    .min(1, 'Product name is required')
    .max(100, 'Product name must be less than 100 characters'),
  artist: z
    .string()
    .min(1, 'Artist name is required')
    .max(100, 'Artist name must be less than 100 characters'),
  coverImage: z.instanceof(File, { message: 'Cover image is required' }),
});

export type CreateProductFormData = z.infer<typeof formSchema>;

export const useCreateProductPage = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const createProductMutation = useCreateProduct();

  const form = useForm<CreateProductFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      artist: '',
    },
  });

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
      form.clearErrors('coverImage'); // Clear validation error when file is selected
    } else {
      setPreviewUrl(null);
    }
  };

  const onSubmit = async (data: CreateProductFormData) => {
    // Validate that cover image is selected
    if (!selectedFile) {
      return;
    }

    const productData: CreateProductData = {
      name: data.name,
      artist: data.artist,
      coverImage: selectedFile,
    };

    try {
      await createProductMutation.mutateAsync(productData);
      navigate('/'); // Navigate back to product list
    } catch (err) {
      // Error is handled by React Query
      console.error('Failed to create product:', err);
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
    form,
    selectedFile,
    previewUrl,
    createProductMutation,
    handleFileChange,
    onSubmit,
  };
};

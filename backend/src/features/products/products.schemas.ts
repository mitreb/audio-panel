import { z } from 'zod';

// Schema for creating a new product (without file upload)
export const createProductSchema = z.object({
  name: z
    .string()
    .min(1, 'Product name is required')
    .max(100, 'Product name must be less than 100 characters'),
  artist: z
    .string()
    .min(1, 'Artist name is required')
    .max(100, 'Artist name must be less than 100 characters'),
});

// Schema for creating a new product with file upload (form data)
export const createProductWithFileSchema = z.object({
  name: z
    .string()
    .min(1, 'Product name is required')
    .max(100, 'Product name must be less than 100 characters'),
  artist: z
    .string()
    .min(1, 'Artist name is required')
    .max(100, 'Artist name must be less than 100 characters'),
});

// Schema for updating a product (all fields optional)
export const updateProductSchema = z.object({
  name: z
    .string()
    .min(1, 'Product name cannot be empty')
    .max(100, 'Product name must be less than 100 characters')
    .optional(),
  artist: z
    .string()
    .min(1, 'Artist name cannot be empty')
    .max(100, 'Artist name must be less than 100 characters')
    .optional(),
  coverImage: z.string().min(1).optional(),
});

// Schema for URL parameters
export const productParamsSchema = z.object({
  id: z.string().min(1, 'Product ID is required'),
});

// Types derived from schemas
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductParams = z.infer<typeof productParamsSchema>;

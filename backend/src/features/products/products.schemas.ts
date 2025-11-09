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
// Note: coverImage file upload is validated in the controller (req.file)
// as multer processes files separately from req.body
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

// Schema for updating a product with PUT (all fields required)
// Note: coverImage file upload is validated in the controller (req.file)
export const updateProductSchema = z.object({
  name: z
    .string()
    .min(1, 'Product name is required')
    .max(100, 'Product name must be less than 100 characters'),
  artist: z
    .string()
    .min(1, 'Artist name is required')
    .max(100, 'Artist name must be less than 100 characters'),
});

// Schema for URL parameters
export const productParamsSchema = z.object({
  id: z.string().min(1, 'Product ID is required'),
});

// Types derived from schemas
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductParams = z.infer<typeof productParamsSchema>;

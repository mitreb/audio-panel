import { Router } from 'express';
import ProductsController from './products.controller';
import { authenticateToken } from '../auth/auth.middleware';
import { uploadCoverImage } from './products.middleware';
import {
  createProductWithFileSchema,
  productParamsSchema,
  patchProductSchema,
} from './products.schemas';
import {
  validateBody,
  validateParams,
} from '../../shared/middleware/validation';

const router = Router();

router.get('/', authenticateToken, ProductsController.getProducts);

router.get(
  '/:id',
  authenticateToken,
  validateParams(productParamsSchema),
  ProductsController.getProduct
);

router.post(
  '/',
  authenticateToken,
  uploadCoverImage,
  validateBody(createProductWithFileSchema),
  ProductsController.createProduct
);

router.patch(
  '/:id',
  authenticateToken,
  validateParams(productParamsSchema),
  uploadCoverImage,
  validateBody(patchProductSchema),
  ProductsController.updateProduct
);

router.delete(
  '/:id',
  authenticateToken,
  validateParams(productParamsSchema),
  ProductsController.deleteProduct
);

export default router;

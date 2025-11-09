import { Router } from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from './products.controller';
import { authenticateToken } from '../auth/auth.middleware';

const router = Router();

router.get('/', authenticateToken, getProducts);

router.get('/:id', authenticateToken, getProduct);

router.post('/', authenticateToken, createProduct);

router.put('/:id', authenticateToken, updateProduct);

router.delete('/:id', authenticateToken, deleteProduct);

export default router;

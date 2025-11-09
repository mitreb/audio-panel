import { Router } from 'express';
import AdminController from './admin.controller';
import { authenticateToken } from '../auth/auth.middleware';
import { requireAdmin } from './admin.middleware';

const router = Router();

// All routes require admin access
router.use(authenticateToken, requireAdmin);

// GET /api/admin/stats - Dashboard overview
router.get('/stats', AdminController.getStats);

// GET /api/admin/users - Get all users
router.get('/users', AdminController.getUsers);

// DELETE /api/admin/users/:id - Delete user
router.delete('/users/:id', AdminController.deleteUser);

// PATCH /api/admin/users/:id/role - Update user role
router.patch('/users/:id/role', AdminController.updateUserRole);

// GET /api/admin/products - Get all products with user info
router.get('/products', AdminController.getProducts);

// DELETE /api/admin/products/:id - Delete any product
router.delete('/products/:id', AdminController.deleteProduct);

export default router;

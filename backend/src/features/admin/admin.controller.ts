import { Response, NextFunction } from 'express';
import type { AuthRequest } from '../auth/auth.types';
import AdminService from './admin.service';

class AdminController {
  static async getStats(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const stats = await AdminService.getStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }

  static async getUsers(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await AdminService.getPaginatedUsers(page, limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      // Prevent self-deletion
      if (id === req.user?.id) {
        res.status(400).json({ error: 'Cannot delete yourself' });
        return;
      }

      await AdminService.deleteUser(id);
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  static async updateUserRole(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { role } = req.body;

      // Validate role
      if (role !== 'USER' && role !== 'ADMIN') {
        res.status(400).json({ error: 'Invalid role' });
        return;
      }

      // Prevent self-demotion
      if (id === req.user?.id && role === 'USER') {
        res.status(400).json({ error: 'Cannot demote yourself' });
        return;
      }

      const user = await AdminService.updateUserRole(id, role);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  static async getProducts(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await AdminService.getPaginatedProducts(page, limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async deleteProduct(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      await AdminService.deleteProduct(id);
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export default AdminController;

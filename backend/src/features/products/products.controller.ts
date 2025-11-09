import { Response, NextFunction } from 'express';
import { AuthRequest } from '../auth/auth.types';
import { ProductRequest } from './products.types';
import ProductsService from './products.service';

class ProductsController {
  static async getProducts(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await ProductsService.getPaginatedProducts({
        page,
        limit,
        userId: req.user.id,
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getProduct(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const { id } = req.params;
      const product = await ProductsService.getProductById(id, req.user.id);

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json(product);
    } catch (error) {
      next(error);
    }
  }

  static async createProduct(
    req: ProductRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { name, artist } = req.body;

      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'Cover image is required' });
      }

      const coverImage = `/uploads/${req.file.filename}`;

      const product = await ProductsService.createProduct(
        name,
        artist,
        coverImage,
        req.user.id
      );

      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  }

  static async updateProduct(
    req: ProductRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const { name, artist } = req.body;

      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'Cover image is required' });
      }

      const updateData: Record<string, string> = {
        name,
        artist,
        coverImage: `/uploads/${req.file.filename}`,
      };

      const product = await ProductsService.updateProduct(
        id,
        req.user.id,
        updateData
      );

      res.json(product);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Product not found') {
          return res.status(404).json({ error: error.message });
        }
        if (error.message === 'Not authorized to update this product') {
          return res.status(403).json({ error: error.message });
        }
      }
      next(error);
    }
  }

  static async deleteProduct(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      await ProductsService.deleteProduct(id, req.user.id);

      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Product not found') {
          return res.status(404).json({ error: error.message });
        }
        if (error.message === 'Not authorized to delete this product') {
          return res.status(403).json({ error: error.message });
        }
      }
      next(error);
    }
  }
}

export default ProductsController;

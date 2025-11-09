import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../auth/auth.types';

class ProductsController {
  private static prisma = new PrismaClient();

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
      const skip = (page - 1) * limit;

      const whereClause = { userId: req.user.id };

      const total = await ProductsController.prisma.product.count({
        where: whereClause,
      });

      const products = await ProductsController.prisma.product.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      });

      const totalPages = Math.ceil(total / limit);

      res.json({
        data: products,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasMore: page < totalPages,
        },
      });
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
      const product = await ProductsController.prisma.product.findUnique({
        where: { id, userId: req.user.id },
      });

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json(product);
    } catch (error) {
      next(error);
    }
  }

  static async createProduct(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { name, artist } = req.body;

      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // Handle uploaded file
      const coverImage = 'change this later';

      const product = await ProductsController.prisma.product.create({
        data: {
          name,
          artist,
          coverImage,
          userId: req.user.id,
        },
      });

      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  }

  static async updateProduct(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const { name, artist } = req.body;

      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const existingProduct =
        await ProductsController.prisma.product.findUnique({
          where: { id },
        });

      if (!existingProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }

      if (existingProduct.userId !== req.user.id) {
        return res
          .status(403)
          .json({ error: 'Not authorized to update this product' });
      }

      // Handle uploaded file
      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (artist !== undefined) updateData.artist = artist;
      updateData.coverImage = 'change this later';

      const product = await ProductsController.prisma.product.update({
        where: { id },
        data: updateData,
      });

      res.json(product);
    } catch (error) {
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

      const existingProduct =
        await ProductsController.prisma.product.findUnique({
          where: { id },
        });

      if (!existingProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }

      if (existingProduct.userId !== req.user.id) {
        return res
          .status(403)
          .json({ error: 'Not authorized to delete this product' });
      }

      await ProductsController.prisma.product.delete({
        where: { id },
      });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default ProductsController;

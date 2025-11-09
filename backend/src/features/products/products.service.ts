import { PrismaClient } from '@prisma/client';
import type { PaginationParams } from './products.types';

class ProductsService {
  private static prisma = new PrismaClient();

  static async getPaginatedProducts(params: PaginationParams) {
    const { page, limit, userId } = params;
    const skip = (page - 1) * limit;
    const whereClause = { userId };

    const total = await this.prisma.product.count({
      where: whereClause,
    });

    const products = await this.prisma.product.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    };
  }

  static async getProductById(productId: string, userId: string) {
    return await this.prisma.product.findUnique({
      where: { id: productId, userId },
    });
  }

  static async createProduct(
    name: string,
    artist: string,
    coverImage: string,
    userId: string
  ) {
    return await this.prisma.product.create({
      data: {
        name,
        artist,
        coverImage,
        userId,
      },
    });
  }

  static async updateProduct(
    productId: string,
    userId: string,
    updateData: { name?: string; artist?: string; coverImage?: string }
  ) {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      throw new Error('Product not found');
    }

    if (existingProduct.userId !== userId) {
      throw new Error('Not authorized to update this product');
    }

    return await this.prisma.product.update({
      where: { id: productId },
      data: updateData,
    });
  }

  static async deleteProduct(productId: string, userId: string) {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      throw new Error('Product not found');
    }

    if (existingProduct.userId !== userId) {
      throw new Error('Not authorized to delete this product');
    }

    await this.prisma.product.delete({
      where: { id: productId },
    });
  }
}

export default ProductsService;

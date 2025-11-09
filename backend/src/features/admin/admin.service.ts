import { PrismaClient } from '@prisma/client';

class AdminService {
  private static prisma = new PrismaClient();

  static async getStats() {
    const [totalUsers, totalProducts, recentProducts] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.product.count(),
      this.prisma.product.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
    ]);

    return {
      totalUsers,
      totalProducts,
      recentProducts,
    };
  }

  static async getPaginatedUsers(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const total = await this.prisma.user.count();

    const users = await this.prisma.user.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    };
  }

  static async deleteUser(userId: string) {
    await this.prisma.user.delete({ where: { id: userId } });
  }

  static async updateUserRole(userId: string, role: 'USER' | 'ADMIN') {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return user;
  }

  static async getPaginatedProducts(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const total = await this.prisma.product.count();

    const products = await this.prisma.product.findMany({
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
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

  static async deleteProduct(productId: string) {
    await this.prisma.product.delete({ where: { id: productId } });
  }
}

export default AdminService;

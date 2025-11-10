import request from 'supertest';
import app from '../../../app';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

jest.mock('uuid');

const prisma = new PrismaClient();

describe('Admin API', () => {
  let adminUser: { id: string; email: string; name: string };
  let regularUser: { id: string; email: string; name: string };
  let adminToken: string;
  let userToken: string;
  let testProduct: { id: string; name: string };

  // Setup test users and authentication
  beforeAll(async () => {
    // Clean up any existing test data
    await prisma.user.deleteMany({
      where: {
        OR: [
          { email: 'admin@test.com' },
          { email: 'user@test.com' },
          { email: 'user2@test.com' },
        ],
      },
    });

    // Create admin user
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        email: 'admin@test.com',
        password: hashedAdminPassword,
        name: 'Admin User',
        role: 'ADMIN',
      },
    });
    adminUser = { id: admin.id, email: admin.email, name: admin.name };

    // Create regular user
    const hashedUserPassword = await bcrypt.hash('user123', 10);
    const user = await prisma.user.create({
      data: {
        email: 'user@test.com',
        password: hashedUserPassword,
        name: 'Regular User',
        role: 'USER',
      },
    });
    regularUser = { id: user.id, email: user.email, name: user.name };

    // Login as admin to get token
    const adminLoginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'admin123' });
    const adminCookie = adminLoginRes.headers['set-cookie'][0];
    adminToken = adminCookie.split(';')[0].split('=')[1];

    // Login as regular user to get token
    const userLoginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@test.com', password: 'user123' });
    const userCookie = userLoginRes.headers['set-cookie'][0];
    userToken = userCookie.split(';')[0].split('=')[1];

    // Create a test product
    const product = await prisma.product.create({
      data: {
        name: 'Test Album',
        artist: 'Test Artist',
        coverImage: 'test-album.jpg',
        userId: regularUser.id,
      },
    });
    testProduct = { id: product.id, name: product.name };
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.product.deleteMany({
      where: { userId: { in: [adminUser.id, regularUser.id] } },
    });
    await prisma.user.deleteMany({
      where: {
        OR: [
          { email: 'admin@test.com' },
          { email: 'user@test.com' },
          { email: 'user2@test.com' },
        ],
      },
    });
    await prisma.$disconnect();
  });

  describe('GET /api/admin/stats', () => {
    it('should return dashboard stats for admin user', async () => {
      const response = await request(app)
        .get('/api/admin/stats')
        .set('Cookie', [`token=${adminToken}`])
        .expect(200);

      expect(response.body).toHaveProperty('totalUsers');
      expect(response.body).toHaveProperty('totalProducts');
      expect(response.body).toHaveProperty('recentProducts');
      expect(typeof response.body.totalUsers).toBe('number');
      expect(typeof response.body.totalProducts).toBe('number');
      expect(Array.isArray(response.body.recentProducts)).toBe(true);
    });

    it('should reject request from regular user', async () => {
      const response = await request(app)
        .get('/api/admin/stats')
        .set('Cookie', [`token=${userToken}`])
        .expect(403);

      expect(response.body).toHaveProperty('error', 'Admin access required');
    });

    it('should reject request without authentication', async () => {
      const response = await request(app).get('/api/admin/stats').expect(401);

      expect(response.body).toHaveProperty(
        'error',
        'Access denied. No token provided.'
      );
    });
  });

  describe('GET /api/admin/users', () => {
    it('should return all users with product counts', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Cookie', [`token=${adminToken}`])
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);

      const user = response.body.data.find((u: any) => u.id === regularUser.id);
      expect(user).toBeDefined();
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('role');
      expect(user).toHaveProperty('createdAt');
      expect(user).toHaveProperty('_count');
      expect(user._count).toHaveProperty('products');
      expect(user).not.toHaveProperty('password');
    });

    it('should reject request from regular user', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Cookie', [`token=${userToken}`])
        .expect(403);

      expect(response.body).toHaveProperty('error', 'Admin access required');
    });
  });

  describe('GET /api/admin/products', () => {
    it('should return all products with user info', async () => {
      const response = await request(app)
        .get('/api/admin/products')
        .set('Cookie', [`token=${adminToken}`])
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);

      const product = response.body.data.find(
        (p: any) => p.id === testProduct.id
      );
      expect(product).toBeDefined();
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('artist');
      expect(product).toHaveProperty('user');
      expect(product.user).toHaveProperty('id');
      expect(product.user).toHaveProperty('name');
      expect(product.user).toHaveProperty('email');
    });

    it('should reject request from regular user', async () => {
      const response = await request(app)
        .get('/api/admin/products')
        .set('Cookie', [`token=${userToken}`])
        .expect(403);

      expect(response.body).toHaveProperty('error', 'Admin access required');
    });
  });

  describe('PATCH /api/admin/users/:id/role', () => {
    let testUserId: string;

    beforeEach(async () => {
      // Create a user for role testing
      const hashedPassword = await bcrypt.hash('test123', 10);
      const user = await prisma.user.create({
        data: {
          email: 'user2@test.com',
          password: hashedPassword,
          name: 'Test User 2',
          role: 'USER',
        },
      });
      testUserId = user.id;
    });

    afterEach(async () => {
      await prisma.user.deleteMany({
        where: { id: testUserId },
      });
    });

    it('should promote user to admin', async () => {
      const response = await request(app)
        .patch(`/api/admin/users/${testUserId}/role`)
        .set('Cookie', [`token=${adminToken}`])
        .send({ role: 'ADMIN' })
        .expect(200);

      expect(response.body).toHaveProperty('id', testUserId);
      expect(response.body).toHaveProperty('role', 'ADMIN');

      // Verify in database
      const user = await prisma.user.findUnique({
        where: { id: testUserId },
      });
      expect(user?.role).toBe('ADMIN');
    });

    it('should demote admin to user', async () => {
      // First promote to admin
      await prisma.user.update({
        where: { id: testUserId },
        data: { role: 'ADMIN' },
      });

      const response = await request(app)
        .patch(`/api/admin/users/${testUserId}/role`)
        .set('Cookie', [`token=${adminToken}`])
        .send({ role: 'USER' })
        .expect(200);

      expect(response.body).toHaveProperty('id', testUserId);
      expect(response.body).toHaveProperty('role', 'USER');
    });

    it('should reject invalid role', async () => {
      const response = await request(app)
        .patch(`/api/admin/users/${testUserId}/role`)
        .set('Cookie', [`token=${adminToken}`])
        .send({ role: 'SUPERADMIN' })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Invalid role');
    });

    it('should prevent admin from demoting themselves', async () => {
      const response = await request(app)
        .patch(`/api/admin/users/${adminUser.id}/role`)
        .set('Cookie', [`token=${adminToken}`])
        .send({ role: 'USER' })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Cannot demote yourself');
    });

    it('should reject request from regular user', async () => {
      const response = await request(app)
        .patch(`/api/admin/users/${testUserId}/role`)
        .set('Cookie', [`token=${userToken}`])
        .send({ role: 'ADMIN' })
        .expect(403);

      expect(response.body).toHaveProperty('error', 'Admin access required');
    });
  });

  describe('DELETE /api/admin/users/:id', () => {
    let testUserId: string;

    beforeEach(async () => {
      // Clean up any existing test user first
      await prisma.user.deleteMany({
        where: { email: 'user2@test.com' },
      });

      // Create a user for deletion testing
      const hashedPassword = await bcrypt.hash('test123', 10);
      const user = await prisma.user.create({
        data: {
          email: 'user2@test.com',
          password: hashedPassword,
          name: 'Test User 2',
          role: 'USER',
        },
      });
      testUserId = user.id;
    });

    it('should delete user successfully', async () => {
      const response = await request(app)
        .delete(`/api/admin/users/${testUserId}`)
        .set('Cookie', [`token=${adminToken}`])
        .expect(200);

      expect(response.body).toHaveProperty(
        'message',
        'User deleted successfully'
      );

      // Verify user is deleted
      const user = await prisma.user.findUnique({
        where: { id: testUserId },
      });
      expect(user).toBeNull();
    });

    it('should prevent admin from deleting themselves', async () => {
      const response = await request(app)
        .delete(`/api/admin/users/${adminUser.id}`)
        .set('Cookie', [`token=${adminToken}`])
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Cannot delete yourself');

      // Verify admin still exists
      const user = await prisma.user.findUnique({
        where: { id: adminUser.id },
      });
      expect(user).not.toBeNull();
    });

    it('should cascade delete user products', async () => {
      // Create a product for the test user
      const product = await prisma.product.create({
        data: {
          name: 'Test Product',
          artist: 'Test Artist',
          coverImage: 'test-product.jpg',
          userId: testUserId,
        },
      });

      await request(app)
        .delete(`/api/admin/users/${testUserId}`)
        .set('Cookie', [`token=${adminToken}`])
        .expect(200);

      // Verify product is also deleted
      const deletedProduct = await prisma.product.findUnique({
        where: { id: product.id },
      });
      expect(deletedProduct).toBeNull();
    });

    it('should reject request from regular user', async () => {
      const response = await request(app)
        .delete(`/api/admin/users/${testUserId}`)
        .set('Cookie', [`token=${userToken}`])
        .expect(403);

      expect(response.body).toHaveProperty('error', 'Admin access required');

      // Verify user still exists
      const user = await prisma.user.findUnique({
        where: { id: testUserId },
      });
      expect(user).not.toBeNull();
    });

    it('should return error for non-existent user', async () => {
      const response = await request(app)
        .delete('/api/admin/users/nonexistent-id')
        .set('Cookie', [`token=${adminToken}`])
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/admin/products/:id', () => {
    let testProductId: string;

    beforeEach(async () => {
      // Create a product for deletion testing
      const product = await prisma.product.create({
        data: {
          name: 'Delete Test Product',
          artist: 'Test Artist',
          coverImage: 'delete-test.jpg',
          userId: regularUser.id,
        },
      });
      testProductId = product.id;
    });

    it('should delete product successfully', async () => {
      const response = await request(app)
        .delete(`/api/admin/products/${testProductId}`)
        .set('Cookie', [`token=${adminToken}`])
        .expect(200);

      expect(response.body).toHaveProperty(
        'message',
        'Product deleted successfully'
      );

      // Verify product is deleted
      const product = await prisma.product.findUnique({
        where: { id: testProductId },
      });
      expect(product).toBeNull();
    });

    it("should allow admin to delete any user's product", async () => {
      // Create a product owned by admin
      const adminProduct = await prisma.product.create({
        data: {
          name: 'Admin Product',
          artist: 'Admin Artist',
          coverImage: 'admin-product.jpg',
          userId: adminUser.id,
        },
      });

      const response = await request(app)
        .delete(`/api/admin/products/${adminProduct.id}`)
        .set('Cookie', [`token=${adminToken}`])
        .expect(200);

      expect(response.body).toHaveProperty(
        'message',
        'Product deleted successfully'
      );
    });

    it('should reject request from regular user', async () => {
      const response = await request(app)
        .delete(`/api/admin/products/${testProductId}`)
        .set('Cookie', [`token=${userToken}`])
        .expect(403);

      expect(response.body).toHaveProperty('error', 'Admin access required');

      // Verify product still exists
      const product = await prisma.product.findUnique({
        where: { id: testProductId },
      });
      expect(product).not.toBeNull();
    });

    it('should return error for non-existent product', async () => {
      const response = await request(app)
        .delete('/api/admin/products/nonexistent-id')
        .set('Cookie', [`token=${adminToken}`])
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Admin Middleware Authorization', () => {
    it('should reject all admin endpoints without token', async () => {
      const endpoints = [
        { method: 'get', path: '/api/admin/stats' },
        { method: 'get', path: '/api/admin/users' },
        { method: 'get', path: '/api/admin/products' },
        { method: 'patch', path: `/api/admin/users/${regularUser.id}/role` },
        { method: 'delete', path: `/api/admin/users/${regularUser.id}` },
        { method: 'delete', path: `/api/admin/products/${testProduct.id}` },
      ];

      for (const endpoint of endpoints) {
        const response = await (request(app) as any)
          [endpoint.method](endpoint.path)
          .expect(401);

        expect(response.body).toHaveProperty(
          'error',
          'Access denied. No token provided.'
        );
      }
    });

    it('should reject all admin endpoints with invalid token', async () => {
      const endpoints = [
        '/api/admin/stats',
        '/api/admin/users',
        '/api/admin/products',
      ];

      for (const endpoint of endpoints) {
        const response = await request(app)
          .get(endpoint)
          .set('Cookie', ['token=invalid-token'])
          .expect(401);

        expect(response.body).toHaveProperty('error', 'Invalid token.');
      }
    });
  });

  describe('Admin User Role in Auth Responses', () => {
    it('should include role in registration response', async () => {
      // Clean up first
      await prisma.user.deleteMany({
        where: { email: 'newadmin@test.com' },
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'newadmin@test.com',
          password: 'admin123',
          name: 'New Admin',
        })
        .expect(201);

      expect(response.body.user).toHaveProperty('role');
      expect(response.body.user.role).toBe('USER'); // Default role

      // Clean up
      await prisma.user.deleteMany({
        where: { email: 'newadmin@test.com' },
      });
    });

    it('should include role in login response', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@test.com', password: 'admin123' })
        .expect(200);

      expect(response.body.user).toHaveProperty('role', 'ADMIN');
    });

    it('should include role in /me endpoint', async () => {
      const response = await request(app)
        .get('/api/auth/user')
        .set('Cookie', [`token=${adminToken}`])
        .expect(200);

      expect(response.body.user).toHaveProperty('role', 'ADMIN');
    });
  });
});

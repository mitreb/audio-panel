import request from 'supertest';
import app from '../../../app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Products API', () => {
  let createdProductId: string;
  let authCookies: string;
  let testUser = {
    email: 'producttest@example.com',
    password: 'password123',
    name: 'Product Test User',
  };

  beforeAll(async () => {
    // Clean up any existing test user
    await prisma.user.deleteMany({
      where: { email: testUser.email },
    });

    // Register a test user
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    // Get auth cookies from registration
    authCookies = registerResponse.headers['set-cookie']!;
  });

  afterAll(async () => {
    // Clean up test user and their products
    await prisma.user.deleteMany({
      where: { email: testUser.email },
    });
    await prisma.$disconnect();
  });

  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Cookie', authCookies)
        .send({
          name: 'Dark Side of the Moon',
          artist: 'Pink Floyd',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Dark Side of the Moon');
      expect(response.body.artist).toBe('Pink Floyd');
      expect(response.body.coverImage).toBe('change this later');
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');

      // Store ID for other tests
      createdProductId = response.body.id;
    });
  });

  describe('GET /api/products', () => {
    it('should get all products', async () => {
      const response = await request(app)
        .get('/api/products')
        .set('Cookie', authCookies)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data)).toBe(true);

      expect(response.body.pagination).toHaveProperty('page');
      expect(response.body.pagination).toHaveProperty('limit');
      expect(response.body.pagination).toHaveProperty('total');
    });
  });

  describe('GET /api/products/:id', () => {
    it('should get a single product', async () => {
      const response = await request(app)
        .get(`/api/products/${createdProductId}`)
        .set('Cookie', authCookies)
        .expect(200);

      expect(response.body.id).toBe(createdProductId);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('artist');
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .get('/api/products/non-existent-id')
        .set('Cookie', authCookies)
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/products/:id', () => {
    it('should update a product', async () => {
      const response = await request(app)
        .put(`/api/products/${createdProductId}`)
        .set('Cookie', authCookies)
        .send({
          name: 'Dark Side of the Moon (Remastered)',
          artist: 'Pink Floyd',
        })
        .expect(200);

      expect(response.body.name).toBe('Dark Side of the Moon (Remastered)');
      expect(response.body.artist).toBe('Pink Floyd');
      expect(response.body.updatedAt).not.toBe(response.body.createdAt);
    });

    it('should return 404 for non-existent product', async () => {
      await request(app)
        .put('/api/products/non-existent-id')
        .set('Cookie', authCookies)
        .send({
          name: 'Dark Side of the Moon',
          artist: 'Pink Floyd',
        })
        .expect(404);
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete a product', async () => {
      await request(app)
        .delete(`/api/products/${createdProductId}`)
        .set('Cookie', authCookies)
        .expect(204);

      // Verify it's deleted
      await request(app)
        .get(`/api/products/${createdProductId}`)
        .set('Cookie', authCookies)
        .expect(404);
    });

    it('should return 404 for non-existent product', async () => {
      await request(app)
        .delete('/api/products/non-existent-id')
        .set('Cookie', authCookies)
        .expect(404);
    });
  });
});

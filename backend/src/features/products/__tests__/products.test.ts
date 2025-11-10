import request from 'supertest';
import app from '../../../app';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import { config } from '../../../config/env';

jest.mock('uuid');

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

    // Clean up test uploads directory
    const uploadsDir = path.join(process.cwd(), config.uploadsDir);
    if (fs.existsSync(uploadsDir)) {
      fs.rmSync(uploadsDir, { recursive: true, force: true });
    }
  });

  beforeEach(() => {
    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), config.uploadsDir);
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
  });

  afterEach(async () => {
    // Clean up uploaded files
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      files.forEach((file) => {
        if (file !== '.gitkeep') {
          fs.unlinkSync(path.join(uploadsDir, file));
        }
      });
    }
  });

  describe('POST /api/products', () => {
    const testImageBuffer = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
      0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
      0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
      0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
    ]);

    it('should create a new product', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Cookie', authCookies)
        .field('name', 'Dark Side of the Moon')
        .field('artist', 'Pink Floyd')
        .attach('coverImage', testImageBuffer, 'test-cover.png')
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Dark Side of the Moon');
      expect(response.body.artist).toBe('Pink Floyd');
      expect(response.body.coverImage).toMatch(/\.png$/);
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');

      // Store ID for other tests
      createdProductId = response.body.id;
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

  describe('PATCH /api/products/:id', () => {
    const testImageBuffer = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
      0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
      0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
      0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
    ]);

    it('should update a product with all fields', async () => {
      const response = await request(app)
        .patch(`/api/products/${createdProductId}`)
        .set('Cookie', authCookies)
        .field('name', 'Dark Side of the Moon (Remastered)')
        .field('artist', 'Pink Floyd')
        .attach('coverImage', testImageBuffer, 'test-cover.png')
        .expect(200);

      expect(response.body.name).toBe('Dark Side of the Moon (Remastered)');
      expect(response.body.artist).toBe('Pink Floyd');
      expect(response.body.updatedAt).not.toBe(response.body.createdAt);
    });

    it('should update only name field', async () => {
      const response = await request(app)
        .patch(`/api/products/${createdProductId}`)
        .set('Cookie', authCookies)
        .field('name', 'New Album Name')
        .expect(200);

      expect(response.body.name).toBe('New Album Name');
      expect(response.body.artist).toBe('Pink Floyd'); // Should keep old artist
    });

    it('should update only artist field', async () => {
      const response = await request(app)
        .patch(`/api/products/${createdProductId}`)
        .set('Cookie', authCookies)
        .field('artist', 'New Artist Name')
        .expect(200);

      expect(response.body.artist).toBe('New Artist Name');
    });

    it('should update only cover image', async () => {
      const response = await request(app)
        .patch(`/api/products/${createdProductId}`)
        .set('Cookie', authCookies)
        .attach('coverImage', testImageBuffer, 'new-cover.png')
        .expect(200);

      expect(response.body.coverImage).toBeTruthy();
      expect(response.body.coverImage).toContain(`/${config.uploadsDir}/`);
    });

    it('should return 400 when no fields provided', async () => {
      await request(app)
        .patch(`/api/products/${createdProductId}`)
        .set('Cookie', authCookies)
        .expect(400);
    });

    it('should delete old image when updating with new image', async () => {
      // Create a product with image
      const createResponse = await request(app)
        .post('/api/products')
        .set('Cookie', authCookies)
        .field('name', 'Test Album')
        .field('artist', 'Test Artist')
        .attach('coverImage', testImageBuffer, 'old-cover.png')
        .expect(201);

      const productId = createResponse.body.id;
      const oldCoverImage = createResponse.body.coverImage;

      // Verify old file exists
      const uploadsDir = path.join(process.cwd(), config.uploadsDir);
      const oldFileName = oldCoverImage.replace(`/${config.uploadsDir}/`, '');
      const oldImagePath = path.join(uploadsDir, oldFileName);
      expect(fs.existsSync(oldImagePath)).toBe(true);

      // Update with new image
      const updateResponse = await request(app)
        .patch(`/api/products/${productId}`)
        .set('Cookie', authCookies)
        .field('name', 'Test Album Updated')
        .field('artist', 'Test Artist')
        .attach('coverImage', testImageBuffer, 'new-cover.png')
        .expect(200);

      const newCoverImage = updateResponse.body.coverImage;

      // Verify old image is deleted
      expect(fs.existsSync(oldImagePath)).toBe(false);

      // Verify new image exists
      const newFileName = newCoverImage.replace(`/${config.uploadsDir}/`, '');
      const newImagePath = path.join(uploadsDir, newFileName);
      expect(fs.existsSync(newImagePath)).toBe(true);
    });

    it('should return 404 for non-existent product', async () => {
      const testImageBuffer = Buffer.from([
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
        0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
        0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
        0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
        0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
        0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
      ]);

      await request(app)
        .patch('/api/products/non-existent-id')
        .set('Cookie', authCookies)
        .field('name', 'Dark Side of the Moon')
        .field('artist', 'Pink Floyd')
        .attach('coverImage', testImageBuffer, 'test-cover.png')
        .expect(404);
    });
  });

  describe('DELETE /api/products/:id', () => {
    const testImageBuffer = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
      0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
      0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
      0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
    ]);

    it('should delete a product and its image file', async () => {
      // Create a fresh product with image
      const createResponse = await request(app)
        .post('/api/products')
        .set('Cookie', authCookies)
        .field('name', 'Test Album')
        .field('artist', 'Test Artist')
        .attach('coverImage', testImageBuffer, 'test-cover.png')
        .expect(201);

      const productId = createResponse.body.id;
      const coverImage = createResponse.body.coverImage;

      // Verify image exists
      const uploadsDir = path.join(process.cwd(), config.uploadsDir);
      const fileName = coverImage.replace(`/${config.uploadsDir}/`, '');
      const imagePath = path.join(uploadsDir, fileName);
      expect(fs.existsSync(imagePath)).toBe(true);

      // Delete the product
      await request(app)
        .delete(`/api/products/${productId}`)
        .set('Cookie', authCookies)
        .expect(204);

      // Verify product is deleted
      await request(app)
        .get(`/api/products/${productId}`)
        .set('Cookie', authCookies)
        .expect(404);

      // Verify image file is also deleted
      expect(fs.existsSync(imagePath)).toBe(false);
    });

    it('should return 404 for non-existent product', async () => {
      await request(app)
        .delete('/api/products/non-existent-id')
        .set('Cookie', authCookies)
        .expect(404);
    });
  });

  describe('File Upload Validation', () => {
    it('should reject non-image files', async () => {
      const textBuffer = Buffer.from('This is not an image');

      const response = await request(app)
        .post('/api/products')
        .set('Cookie', authCookies)
        .field('name', 'Test Product')
        .field('artist', 'Test Artist')
        .attach('coverImage', textBuffer, 'test.txt')
        .expect(400);

      expect(response.body.error).toContain('Only image files are allowed');
    });

    it('should reject files larger than 5MB', async () => {
      // Create a buffer larger than 5MB
      const largeBuffer = Buffer.alloc(6 * 1024 * 1024, 'x');

      const response = await request(app)
        .post('/api/products')
        .set('Cookie', authCookies)
        .field('name', 'Test Product')
        .field('artist', 'Test Artist')
        .attach('coverImage', largeBuffer, 'large-image.jpg')
        .expect(400);

      expect(response.body.error).toContain('File too large');
    });
  });

  describe('Field Validation', () => {
    const testImageBuffer = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
      0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
      0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
      0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
    ]);

    describe('POST /api/products field validation', () => {
      it('should reject empty product name', async () => {
        const response = await request(app)
          .post('/api/products')
          .set('Cookie', authCookies)
          .field('name', '')
          .field('artist', 'Test Artist')
          .attach('coverImage', testImageBuffer, 'test-cover.png')
          .expect(400);

        expect(response.body.error).toBe('Validation error');
        expect(response.body.details).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'name',
              message: 'Product name is required',
            }),
          ])
        );
      });

      it('should reject missing artist', async () => {
        const response = await request(app)
          .post('/api/products')
          .set('Cookie', authCookies)
          .field('name', 'Test Product')
          .attach('coverImage', testImageBuffer, 'test-cover.png')
          .expect(400);

        expect(response.body.error).toBe('Validation error');
        expect(response.body.details).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'artist',
            }),
          ])
        );
      });

      it('should reject names longer than 100 characters', async () => {
        const response = await request(app)
          .post('/api/products')
          .set('Cookie', authCookies)
          .field('name', 'a'.repeat(101))
          .field('artist', 'Test Artist')
          .attach('coverImage', testImageBuffer, 'test-cover.png')
          .expect(400);

        expect(response.body.details).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'name',
              message: 'Product name must be less than 100 characters',
            }),
          ])
        );
      });

      it('should reject missing cover image', async () => {
        const response = await request(app)
          .post('/api/products')
          .set('Cookie', authCookies)
          .field('name', 'Test Product')
          .field('artist', 'Test Artist')
          .expect(400);

        expect(response.body.error).toBe('Cover image is required');
      });
    });

    describe('PATCH /api/products/:id field validation', () => {
      let productId: string;

      beforeEach(async () => {
        // Create a product for updating
        const response = await request(app)
          .post('/api/products')
          .set('Cookie', authCookies)
          .field('name', 'Product to Update')
          .field('artist', 'Original Artist')
          .attach('coverImage', testImageBuffer, 'test-cover.png')
          .expect(201);
        productId = response.body.id;
      });

      it('should reject empty name in update', async () => {
        const response = await request(app)
          .patch(`/api/products/${productId}`)
          .set('Cookie', authCookies)
          .field('name', '')
          .expect(400);

        expect(response.body.details).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'name',
              message: 'Product name is required',
            }),
          ])
        );
      });

      it('should reject empty artist in update', async () => {
        const response = await request(app)
          .patch(`/api/products/${productId}`)
          .set('Cookie', authCookies)
          .field('artist', '')
          .expect(400);

        expect(response.body.details).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'artist',
              message: 'Artist name is required',
            }),
          ])
        );
      });

      it('should accept partial update with only name', async () => {
        const response = await request(app)
          .patch(`/api/products/${productId}`)
          .set('Cookie', authCookies)
          .field('name', 'Updated Product Name')
          .expect(200);

        expect(response.body.name).toBe('Updated Product Name');
        expect(response.body.artist).toBe('Original Artist'); // Should remain unchanged
      });

      it('should accept full update data', async () => {
        const response = await request(app)
          .patch(`/api/products/${productId}`)
          .set('Cookie', authCookies)
          .field('name', 'Updated Product Name')
          .field('artist', 'Updated Artist')
          .attach('coverImage', testImageBuffer, 'test-cover.png')
          .expect(200);

        expect(response.body.name).toBe('Updated Product Name');
        expect(response.body.artist).toBe('Updated Artist');
      });
    });
  });
});

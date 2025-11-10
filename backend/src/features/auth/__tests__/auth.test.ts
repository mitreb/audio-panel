import request from 'supertest';
import app from '../../../app';
import { PrismaClient } from '@prisma/client';

jest.mock('uuid');

const prisma = new PrismaClient();

describe('Authentication API', () => {
  const testUser = {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
  };

  // Clean up test users before and after tests
  beforeEach(async () => {
    await prisma.user.deleteMany({
      where: { email: testUser.email },
    });
  });

  afterEach(async () => {
    await prisma.user.deleteMany({
      where: { email: testUser.email },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      expect(response.body).toHaveProperty(
        'message',
        'User registered successfully'
      );
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('email', testUser.email);
      expect(response.body.user).toHaveProperty('name', testUser.name);
      expect(response.body.user).not.toHaveProperty('password');

      // Check that JWT cookie is set
      expect(response.headers['set-cookie']).toBeDefined();
      const cookieHeader = response.headers['set-cookie'][0];
      expect(cookieHeader).toMatch(
        /token=.*; Max-Age=.*; Path=.*; HttpOnly; SameSite=Strict/
      );
    });

    it('should return 400 for missing fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: testUser.email,
          // missing password and name
        })
        .expect(400);

      expect(response.body).toHaveProperty(
        'error',
        'Email, password, and name are required'
      );
    });

    it('should return 400 for duplicate email', async () => {
      // First registration
      await request(app).post('/api/auth/register').send(testUser).expect(201);

      // Second registration with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(400);

      expect(response.body).toHaveProperty(
        'error',
        'User with this email already exists'
      );
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Register a user for login tests
      await request(app).post('/api/auth/register').send(testUser);
    });

    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Login successful');
      expect(response.body.user).toHaveProperty('email', testUser.email);
      expect(response.body.user).not.toHaveProperty('password');

      // Check that JWT cookie is set
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should return 400 for missing credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          // missing password
        })
        .expect(400);

      expect(response.body).toHaveProperty(
        'error',
        'Email and password are required'
      );
    });

    it('should return 401 for invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: testUser.password,
        })
        .expect(401);

      expect(response.body).toHaveProperty(
        'error',
        'Invalid email or password'
      );
    });

    it('should return 401 for invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        })
        .expect(401);

      expect(response.body).toHaveProperty(
        'error',
        'Invalid email or password'
      );
    });
  });

  describe('GET /api/auth/user', () => {
    let authCookies: string;

    beforeEach(async () => {
      // Register and login to get auth cookies
      await request(app).post('/api/auth/register').send(testUser);

      const loginResponse = await request(app).post('/api/auth/login').send({
        email: testUser.email,
        password: testUser.password,
      });

      authCookies = loginResponse.headers['set-cookie'];
    });

    it('should return user info when authenticated', async () => {
      const response = await request(app)
        .get('/api/auth/user')
        .set('Cookie', authCookies)
        .expect(200);

      expect(response.body.user).toHaveProperty('email', testUser.email);
      expect(response.body.user).toHaveProperty('name', testUser.name);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app).get('/api/auth/user').expect(401);

      expect(response.body).toHaveProperty(
        'error',
        'Access denied. No token provided.'
      );
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      const response = await request(app).post('/api/auth/logout').expect(200);

      expect(response.body).toHaveProperty('message', 'Logout successful');

      // Check that cookie is cleared
      expect(response.headers['set-cookie']).toBeDefined();
      const cookieHeader = response.headers['set-cookie'][0];
      expect(cookieHeader).toMatch(/token=.*Expires=Thu, 01 Jan 1970/);
    });
  });
});

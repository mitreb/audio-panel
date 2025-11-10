import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from './auth.service';
import api from '../../../services/api';
import type { User, LoginCredentials, RegisterData } from '../types/auth.types';

// Mock the api module
vi.mock('../../../services/api');

describe('AuthService', () => {
  const mockUser: User = {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
    role: 'USER',
    createdAt: '2025-01-01T00:00:00.000Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerData: RegisterData = {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
      };

      const mockResponse = {
        data: {
          user: mockUser,
          message: 'User registered successfully',
        },
      };

      vi.mocked(api.post).mockResolvedValue(mockResponse);

      const result = await AuthService.register(registerData);

      expect(api.post).toHaveBeenCalledWith('/auth/register', registerData);
      expect(result.user).toEqual(mockUser);
      expect(result.message).toBe('User registered successfully');
    });

    it('should throw error when registration fails', async () => {
      const registerData: RegisterData = {
        email: 'invalid@example.com',
        password: 'weak',
        name: 'Test',
      };

      const mockError = new Error('Registration failed');
      vi.mocked(api.post).mockRejectedValue(mockError);

      await expect(AuthService.register(registerData)).rejects.toThrow(
        'Registration failed'
      );
      expect(api.post).toHaveBeenCalledWith('/auth/register', registerData);
    });
  });

  describe('login', () => {
    it('should login user with valid credentials', async () => {
      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockResponse = {
        data: {
          user: mockUser,
          message: 'Login successful',
        },
      };

      vi.mocked(api.post).mockResolvedValue(mockResponse);

      const result = await AuthService.login(credentials);

      expect(api.post).toHaveBeenCalledWith('/auth/login', credentials);
      expect(result.user).toEqual(mockUser);
      expect(result.message).toBe('Login successful');
    });

    it('should throw error when login fails', async () => {
      const credentials: LoginCredentials = {
        email: 'wrong@example.com',
        password: 'wrongpassword',
      };

      const mockError = new Error('Invalid credentials');
      vi.mocked(api.post).mockRejectedValue(mockError);

      await expect(AuthService.login(credentials)).rejects.toThrow(
        'Invalid credentials'
      );
      expect(api.post).toHaveBeenCalledWith('/auth/login', credentials);
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      const mockResponse = {
        data: {
          message: 'Logout successful',
        },
      };

      vi.mocked(api.post).mockResolvedValue(mockResponse);

      const result = await AuthService.logout();

      expect(api.post).toHaveBeenCalledWith('/auth/logout');
      expect(result.message).toBe('Logout successful');
    });

    it('should throw error when logout fails', async () => {
      const mockError = new Error('Logout failed');
      vi.mocked(api.post).mockRejectedValue(mockError);

      await expect(AuthService.logout()).rejects.toThrow('Logout failed');
      expect(api.post).toHaveBeenCalledWith('/auth/logout');
    });
  });

  describe('getUser', () => {
    it('should fetch current user info successfully', async () => {
      const mockResponse = {
        data: {
          user: mockUser,
        },
      };

      vi.mocked(api.get).mockResolvedValue(mockResponse);

      const result = await AuthService.getUser();

      expect(api.get).toHaveBeenCalledWith('/auth/user');
      expect(result.user).toEqual(mockUser);
    });

    it('should throw error when fetching user fails', async () => {
      const mockError = new Error('Unauthorized');
      vi.mocked(api.get).mockRejectedValue(mockError);

      await expect(AuthService.getUser()).rejects.toThrow('Unauthorized');
      expect(api.get).toHaveBeenCalledWith('/auth/user');
    });
  });

  describe('checkAuth', () => {
    it('should return user when authenticated', async () => {
      const mockResponse = {
        data: {
          user: mockUser,
        },
      };

      vi.mocked(api.get).mockResolvedValue(mockResponse);

      const result = await AuthService.checkAuth();

      expect(api.get).toHaveBeenCalledWith('/auth/user');
      expect(result).toEqual(mockUser);
    });

    it('should return null when not authenticated', async () => {
      const mockError = new Error('Unauthorized');
      vi.mocked(api.get).mockRejectedValue(mockError);

      const result = await AuthService.checkAuth();

      expect(api.get).toHaveBeenCalledWith('/auth/user');
      expect(result).toBeNull();
    });

    it('should return null when any error occurs', async () => {
      const mockError = new Error('Network error');
      vi.mocked(api.get).mockRejectedValue(mockError);

      const result = await AuthService.checkAuth();

      expect(result).toBeNull();
    });
  });
});

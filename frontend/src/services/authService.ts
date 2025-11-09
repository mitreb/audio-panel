import api from './api';
import type { User, LoginCredentials, RegisterData } from '../types/auth';

export class AuthService {
  // Register new user
  static async register(
    data: RegisterData
  ): Promise<{ user: User; message: string }> {
    const response = await api.post('/auth/register', data);
    return response.data;
  }

  // Login user
  static async login(
    credentials: LoginCredentials
  ): Promise<{ user: User; message: string }> {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  }

  // Logout user
  static async logout(): Promise<{ message: string }> {
    const response = await api.post('/auth/logout');
    return response.data;
  }

  // Get current user info
  static async getMe(): Promise<{ user: User }> {
    const response = await api.get('/auth/me');
    return response.data;
  }

  // Check if user is authenticated
  static async checkAuth(): Promise<User | null> {
    try {
      const response = await this.getMe();
      return response.user;
    } catch {
      return null;
    }
  }
}

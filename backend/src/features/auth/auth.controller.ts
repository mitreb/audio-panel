import type { Request, Response } from 'express';
import type { AuthRequest } from './auth.types';
import AuthService from './auth.service';
import { setAuthCookie, clearAuthCookie } from '../../shared/utils/cookie';

class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, name } = req.body;

      // Validate input
      if (!email || !password || !name) {
        res.status(400).json({
          error: 'Email, password, and name are required',
        });
        return;
      }

      const { user, token } = await AuthService.registerUser(
        email,
        password,
        name
      );

      // Set HTTP-only cookie
      setAuthCookie(res, token);

      res.status(201).json({
        message: 'User registered successfully',
        user,
      });
    } catch (error) {
      console.error('Registration error:', error);

      if (
        error instanceof Error &&
        error.message === 'User with this email already exists'
      ) {
        res.status(400).json({ error: error.message });
        return;
      }

      res.status(500).json({
        error: 'Internal server error',
      });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        res.status(400).json({
          error: 'Email and password are required',
        });
        return;
      }

      const { user, token } = await AuthService.authenticateUser(
        email,
        password
      );

      // Set HTTP-only cookie
      setAuthCookie(res, token);

      res.json({
        message: 'Login successful',
        user,
      });
    } catch (error) {
      console.error('Login error:', error);

      if (
        error instanceof Error &&
        error.message === 'Invalid email or password'
      ) {
        res.status(401).json({ error: error.message });
        return;
      }

      res.status(500).json({
        error: 'Internal server error',
      });
    }
  }

  static logout(req: Request, res: Response): void {
    clearAuthCookie(res);
    res.json({ message: 'Logout successful' });
  }

  static async getCurrentUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      // User is already attached by authenticateToken middleware
      res.json({ user: req.user });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default AuthController;

import type { Request, Response } from 'express';
import { generateToken } from './auth.middleware';
import type { AuthRequest } from './auth.types';
import { env } from '../../config/env';
import * as authService from './auth.service';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      res.status(400).json({
        error: 'Email, password, and name are required',
      });
      return;
    }

    // Check if user already exists
    const existingUser = await authService.findUserByEmail(email);

    if (existingUser) {
      res.status(400).json({
        error: 'User with this email already exists',
      });
      return;
    }

    // Create user
    const user = await authService.createUser(email, password, name);

    // Generate JWT token
    const token = generateToken(user.id);

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      message: 'User registered successfully',
      user,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({
        error: 'Email and password are required',
      });
      return;
    }

    // Find user
    const user = await authService.findUserByEmail(email);

    if (!user) {
      res.status(401).json({
        error: 'Invalid email or password',
      });
      return;
    }

    // Verify password
    const isValidPassword = await authService.verifyPassword(
      password,
      user.password
    );

    if (!isValidPassword) {
      res.status(401).json({
        error: 'Invalid email or password',
      });
      return;
    }

    // Generate JWT token
    const token = generateToken(user.id);

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
};

export const logout = (req: Request, res: Response): void => {
  res.clearCookie('token');
  res.json({ message: 'Logout successful' });
};

export const getCurrentUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    // User is already attached by authenticateToken middleware
    res.json({ user: req.user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

import type { Response } from 'express';
import { env } from '../../config/env';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const setAuthCookie = (res: Response, token: string): void => {
  res.cookie('token', token, COOKIE_OPTIONS);
};

export const clearAuthCookie = (res: Response): void => {
  res.clearCookie('token');
};

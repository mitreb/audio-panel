import type { Request } from 'express';
import type { AuthUser } from '../auth/auth.types';

export interface AdminRequest extends Request {
  user?: AuthUser;
}

export interface StatsResponse {
  totalUsers: number;
  totalProducts: number;
  recentProducts: any[];
}

export interface UserListItem {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
  _count: {
    products: number;
  };
}

export interface ProductWithUser {
  id: string;
  name: string;
  artist: string;
  coverImage: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

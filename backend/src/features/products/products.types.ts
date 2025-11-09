import type { AuthRequest } from '../auth/auth.types';

export interface ProductRequest extends AuthRequest {
  file?: Express.Multer.File;
}

export interface PaginationParams {
  page: number;
  limit: number;
  userId: string;
}

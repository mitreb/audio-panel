import { Request, Response, NextFunction } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import multer from 'multer';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Handle Prisma errors
  if (err instanceof PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2025':
        return res.status(404).json({ error: 'Resource not found' });
      case 'P2002':
        return res.status(409).json({
          error: 'Resource already exists',
          field: err.meta?.target,
        });
      default:
        console.error('Prisma error:', err);
        return res.status(500).json({ error: 'Database error' });
    }
  }

  // Handle validation errors (for when we add Zod later)
  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Validation error',
      details: err.errors,
    });
  }

  // Handle Multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res
        .status(400)
        .json({ error: 'File too large. Maximum 5MB allowed.' });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ error: 'Unexpected file field' });
    }
    return res.status(400).json({ error: err.message });
  }

  if (err instanceof Error) {
    if (err.message === 'Only image files are allowed!') {
      return res.status(400).json({ error: 'Only image files are allowed' });
    }
    if (err.message.includes('File too large')) {
      return res
        .status(400)
        .json({ error: 'File too large. Maximum 5MB allowed.' });
    }
  }

  // Generic error fallback
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
};

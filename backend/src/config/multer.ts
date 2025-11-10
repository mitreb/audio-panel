import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import { config } from './env';
import { InvalidFileTypeError } from '../shared/errors/custom-errors';

// Configure storage based on environment
export const storage = config.USE_CLOUD_STORAGE
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (req: Request, file: Express.Multer.File, cb) => {
        cb(null, 'uploads/');
      },
      filename: (req: Request, file: Express.Multer.File, cb) => {
        // Generate unique filename: timestamp-originalname
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        const nameWithoutExt = path.parse(file.originalname).name;
        cb(null, `${nameWithoutExt}-${uniqueSuffix}${ext}`);
      },
    });

// File filter for images only
export const imageFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new InvalidFileTypeError());
  }
};

// Multer configuration
export const multerConfig: multer.Options = {
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
};

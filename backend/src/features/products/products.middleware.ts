import multer from 'multer';
import { multerConfig } from '../../config/multer';

const upload = multer(multerConfig);

// Single cover image upload middleware for products
export const uploadCoverImage = upload.single('coverImage');

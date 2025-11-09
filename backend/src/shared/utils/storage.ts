import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { config } from '../../config/env';

// Initialize Google Cloud Storage
const storage = new Storage({
  projectId: config.GCP_PROJECT_ID,
});

const bucket = storage.bucket(config.GCS_BUCKET_NAME);

export interface UploadResult {
  publicUrl: string;
  filename: string;
}

/**
 * Upload a file to Google Cloud Storage
 */
export async function uploadToGCS(
  file: Express.Multer.File
): Promise<UploadResult> {
  const ext = path.extname(file.originalname);
  const filename = `${uuidv4()}${ext}`;

  const blob = bucket.file(filename);
  const blobStream = blob.createWriteStream({
    resumable: false,
    metadata: {
      contentType: file.mimetype,
      metadata: {
        originalName: file.originalname,
      },
    },
  });

  return new Promise((resolve, reject) => {
    blobStream.on('error', (err) => {
      console.error('GCS upload error:', err);
      reject(err);
    });

    blobStream.on('finish', async () => {
      try {
        // Make the file public
        await blob.makePublic();

        const publicUrl = `https://storage.googleapis.com/${config.GCS_BUCKET_NAME}/${filename}`;

        resolve({
          publicUrl,
          filename,
        });
      } catch (error) {
        reject(error);
      }
    });

    blobStream.end(file.buffer);
  });
}

/**
 * Delete a file from Google Cloud Storage
 */
export async function deleteFromGCS(filename: string): Promise<void> {
  try {
    await bucket.file(filename).delete();
    console.log(`Deleted file: ${filename}`);
  } catch (error) {
    console.error('Error deleting file from GCS:', error);
    // Don't throw - file might not exist
  }
}

/**
 * Helper to get image URL - handles both cloud and local storage
 */
export async function getImageUrl(
  file: Express.Multer.File | undefined
): Promise<string | null> {
  if (!file) return null;

  if (config.USE_CLOUD_STORAGE) {
    const result = await uploadToGCS(file);
    return result.publicUrl;
  } else {
    return `/uploads/${file.filename}`;
  }
}

/**
 * Helper to extract filename from URL
 */
export function extractFilename(url: string | null): string | null {
  if (!url) return null;
  if (url.startsWith('https://storage.googleapis.com/')) {
    const parts = url.split('/');
    return parts[parts.length - 1];
  }
  return url.replace('/uploads/', '');
}

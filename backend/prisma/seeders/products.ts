import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function seedProducts() {
  console.log('🌱 Seeding products...');

  // Get all users to assign products to
  const users = await prisma.user.findMany();

  if (users.length === 0) {
    console.log('  ⚠️  No users found. Please seed users first.');
    return;
  }

  // Path to seed images
  const seedImagesDir = path.join(__dirname, 'seed-data', 'cover-images');
  const uploadsDir = path.join(__dirname, '../../uploads');

  // Ensure uploads directory exists
  await fs.promises.mkdir(uploadsDir, { recursive: true });

  // Get all images from seed-data
  const imageFiles = await fs.promises.readdir(seedImagesDir);
  const jpgImages = imageFiles.filter((file: string) => file.endsWith('.jpg'));

  if (jpgImages.length === 0) {
    console.log('  ⚠️  No images found in seed-data/cover-images');
    return;
  }

  console.log(`  📸 Found ${jpgImages.length} images`);

  let created = 0;
  let skipped = 0;

  // Create products for each image
  for (const imageFile of jpgImages) {
    // Generate unique filename for uploads
    const ext = path.extname(imageFile);
    const uniqueFilename = `${uuidv4()}${ext}`;

    const sourcePath = path.join(seedImagesDir, imageFile);
    const destPath = path.join(uploadsDir, uniqueFilename);

    try {
      // Copy image to uploads directory
      await fs.promises.copyFile(sourcePath, destPath);

      // Create product with random data
      const randomUser = users[Math.floor(Math.random() * users.length)];

      await prisma.product.create({
        data: {
          name: faker.music.songName(),
          artist: faker.person.fullName(),
          coverImage: `/uploads/${uniqueFilename}`,
          userId: randomUser.id,
        },
      });

      console.log(`  ✓ Created product with image: ${imageFile}`);
      created++;
    } catch (error) {
      console.log(`  ✗ Failed to create product for ${imageFile}:`, error);
      skipped++;
    }
  }

  console.log(
    `\n✅ Products seeding completed! Created: ${created}, Skipped: ${skipped}\n`
  );
}

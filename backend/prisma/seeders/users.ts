import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

export async function seedUsers() {
  console.log('🌱 Seeding users...');

  // Default password for all seeded users
  const defaultPassword = await bcrypt.hash('password123', 10);

  // Create 20 regular users
  const users = Array.from({ length: 20 }, () => ({
    email: faker.internet.email(),
    password: defaultPassword,
    name: faker.person.fullName(),
    role: 'USER' as const,
  }));

  let created = 0;
  let skipped = 0;

  for (const userData of users) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      console.log(`  ↪ User ${userData.email} already exists, skipping...`);
      skipped++;
      continue;
    }

    await prisma.user.create({
      data: userData,
    });
    console.log(`  ✓ Created user: ${userData.email} (${userData.role})`);
    created++;
  }

  console.log(
    `\n✅ Users seeding completed! Created: ${created}, Skipped: ${skipped}\n`
  );
}

import { PrismaClient } from '@prisma/client';
import { seedUsers } from './seeders/users';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting database seeding...\n');

  try {
    await seedUsers();
    // await seedProducts(); // Will add this after creating products seeder

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

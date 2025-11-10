import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import readline from 'readline';

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function createAdminUser() {
  console.log('=== Create Admin User ===\n');

  // Check if command-line arguments are provided
  const isNonInteractive = process.argv.length > 2;
  const email = process.argv[2] || (await question('Email: '));
  const password = process.argv[3] || (await question('Password: '));
  const name = process.argv[4] || (await question('Name: '));

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('\n❌ User with this email already exists!');

      // Promote to admin if non-interactive
      if (isNonInteractive) {
        await prisma.user.update({
          where: { email },
          data: { role: 'ADMIN' },
        });
        console.log('\n✅ User promoted to admin successfully!');
      } else {
        // Ask if they want to promote existing user
        const promote = await question(
          '\nDo you want to promote this user to admin? (yes/no): '
        );

        if (promote.toLowerCase() === 'yes' || promote.toLowerCase() === 'y') {
          await prisma.user.update({
            where: { email },
            data: { role: 'ADMIN' },
          });
          console.log('\n✅ User promoted to admin successfully!');
        }
      }
    } else {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create admin user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: 'ADMIN',
        },
      });

      console.log('\n✅ Admin user created successfully!');
      console.log(`ID: ${user.id}`);
      console.log(`Email: ${user.email}`);
      console.log(`Name: ${user.name}`);
      console.log(`Role: ${user.role}`);
    }
  } catch (error) {
    console.error('\n❌ Error:', error);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

createAdminUser();

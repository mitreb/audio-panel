import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { generateToken } from '../../shared/utils/jwt';

class AuthService {
  private static prisma = new PrismaClient();

  static async findUserByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  static async createUser(email: string, password: string, name: string) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    return await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
  }

  static async verifyPassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async registerUser(email: string, password: string, name: string) {
    // Check if user already exists
    const existingUser = await this.findUserByEmail(email);

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create user
    const user = await this.createUser(email, password, name);

    // Generate JWT token
    const token = generateToken(user.id);

    return { user, token };
  }

  static async authenticateUser(email: string, password: string) {
    // Find user
    const user = await this.findUserByEmail(email);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await this.verifyPassword(password, user.password);

    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = generateToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    };
  }
}

export default AuthService;

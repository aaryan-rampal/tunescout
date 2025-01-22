import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

/**
 * ✅ Find user by `username` for authentication
 */
export const findUserByUsername = async (username: string) => {
    return prisma.user.findUnique({
      where: { username },
    });
  };
  
  /**
   * ✅ Create a new user with `username` and hashed password
   */
  export const createUser = async (username: string, hashedPassword: string) => {
    return prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
  };
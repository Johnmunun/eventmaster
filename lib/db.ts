import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Empêche Prisma d'être chargé dans le runtime edge
if (typeof window !== "undefined") {
  throw new Error("❌ Prisma ne peut pas être utilisé dans le frontend.");
}

if (process.env.NEXT_RUNTIME === "edge") {
  throw new Error("❌ Prisma ne peut pas être utilisé dans le runtime Edge.");
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

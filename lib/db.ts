import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Charger explicitement les variables d'environnement
dotenv.config({ path: '.env' });

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

// Vérifier que DATABASE_URL est défini
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("❌ DATABASE_URL n'est pas défini dans les variables d'environnement");
  console.error("💡 Vérifiez que le fichier .env existe à la racine du projet");
  console.error("💡 Vérifiez que DATABASE_URL est bien défini dans .env");
  throw new Error("DATABASE_URL is not defined");
}

// Vérifier le format de DATABASE_URL pour Neon
if (databaseUrl.includes('pooler')) {
  console.warn("⚠️ Utilisation du pooler Neon. Si vous avez des problèmes de connexion, essayez la connexion directe.");
}

console.log("✅ DATABASE_URL chargé:", databaseUrl ? "Oui" : "Non");
console.log("📍 Host:", databaseUrl.match(/@([^:]+)/)?.[1] || "Non trouvé");

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['error', 'warn', 'query']
        : ['error'],
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });

// Tester la connexion au démarrage (uniquement en développement)
if (process.env.NODE_ENV !== 'production' && !globalForPrisma.prisma) {
  db.$connect()
    .then(() => {
      console.log("✅ Connexion à la base de données réussie");
    })
    .catch((error) => {
      console.error("❌ Erreur de connexion à la base de données:", error.message);
      console.error("💡 Vérifiez votre DATABASE_URL dans .env");
      console.error("💡 Pour Neon, assurez-vous d'utiliser la bonne URL (pooler ou directe)");
    });
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

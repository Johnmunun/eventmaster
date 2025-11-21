import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import dotenv from "dotenv"
import { Prisma } from "@prisma/client"

// Charger les variables d'environnement
dotenv.config({ path: '.env' })

// Initialiser l'adapter seulement si la base de données est disponible
let adapter: any = undefined
try {
  adapter = PrismaAdapter(db) as any
} catch (error) {
  console.warn("PrismaAdapter initialization failed, using JWT-only mode:", error)
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...(adapter ? { adapter } : {}),
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email et mot de passe requis")
          }

          let user
          try {
            user = await db.user.findUnique({
              where: {
                email: credentials.email as string
              }
            })
          } catch (dbError: any) {
            // Gérer les erreurs de connexion à la base de données
            if (
              dbError instanceof Prisma.PrismaClientKnownRequestError &&
              (dbError.code === 'P1001' || dbError.code === 'P1000')
            ) {
              console.error("Erreur de connexion à la base de données:", dbError.message)
              throw new Error("Erreur de connexion à la base de données. Veuillez réessayer plus tard.")
            }
            if (dbError instanceof Prisma.PrismaClientInitializationError) {
              console.error("Erreur d'initialisation de la base de données:", dbError.message)
              throw new Error("Erreur de connexion à la base de données. Veuillez réessayer plus tard.")
            }
            throw dbError
          }

          if (!user || !user.password) {
            throw new Error("Email ou mot de passe incorrect")
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          )

          if (!isPasswordValid) {
            throw new Error("Email ou mot de passe incorrect")
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          }
        } catch (error: any) {
          console.error("Erreur dans authorize:", error)
          // Propager l'erreur pour que NextAuth la gère
          throw error
        }
      }
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signOut: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  trustHost: true, // Nécessaire pour Next.js 16
  // Configuration de l'URL de base pour NextAuth v5
  basePath: "/api/auth",
})


import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { Prisma } from "@prisma/client"

const registerSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(100, "Le nom est trop long"),
  email: z.string().email("Email invalide").toLowerCase().trim(),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, "Le mot de passe doit contenir au moins un caractère spécial"),
})

export async function POST(request: NextRequest) {
  try {
    // Vérifier que le body est valide
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      return NextResponse.json(
        { success: false, error: "Format de requête invalide" },
        { status: 400 }
      )
    }
    
    // Validation des données
    const validatedData = registerSchema.parse(body)
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await db.user.findUnique({
      where: {
        email: validatedData.email
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Cet email est déjà utilisé" },
        { status: 409 }
      )
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(validatedData.password, 10)

    // Créer l'utilisateur avec 10 crédits de bonus
    const user = await db.user.create({
      data: {
        name: validatedData.name.trim(),
        email: validatedData.email.toLowerCase().trim(),
        password: hashedPassword,
        credits: 10, // Bonus de bienvenue
      },
      select: {
        id: true,
        name: true,
        email: true,
        credits: true,
        createdAt: true,
      }
    })

    return NextResponse.json(
      {
        success: true,
        message: "Compte créé avec succès",
        user,
        bonusCredits: 10,
      },
      { status: 201 }
    )
  } catch (error) {
    // Gestion des erreurs de validation Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: error.errors[0].message,
          details: error.errors 
        },
        { status: 400 }
      )
    }

    // Gestion des erreurs Prisma (contraintes uniques, etc.)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { success: false, error: "Cet email est déjà utilisé" },
          { status: 409 }
        )
      }
      
      if (error.code === 'P1001') {
        return NextResponse.json(
          { success: false, error: "Impossible de se connecter à la base de données" },
          { status: 503 }
        )
      }
    }

    // Gestion des erreurs Prisma de connexion
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return NextResponse.json(
        { success: false, error: "Erreur de connexion à la base de données" },
        { status: 503 }
      )
    }

    // Erreur générique
    console.error("Erreur lors de l'inscription:", error)
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue lors de l'inscription" },
      { status: 500 }
    )
  }
}



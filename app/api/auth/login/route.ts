import { NextRequest, NextResponse } from "next/server"
import { signIn } from "@/lib/auth"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validation des données
    const validatedData = loginSchema.parse(body)
    
    // Tenter la connexion via NextAuth
    const result = await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    })

    if (!result || result.error) {
      return NextResponse.json(
        { success: false, error: "Email ou mot de passe incorrect" },
        { status: 401 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "Connexion réussie",
      },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error("Erreur lors de la connexion:", error)
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue lors de la connexion" },
      { status: 500 }
    )
  }
}


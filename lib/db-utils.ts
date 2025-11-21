import { Prisma } from "@prisma/client"

/**
 * Vérifie si une erreur est une erreur de connexion à la base de données
 */
export function isDatabaseConnectionError(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return error.code === 'P1001' || error.code === 'P1000'
  }
  
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return true
  }
  
  if (error instanceof Error) {
    const message = error.message.toLowerCase()
    return (
      message.includes('can\'t reach database') ||
      message.includes('can not reach database') ||
      message.includes('connection') ||
      message.includes('timeout')
    )
  }
  
  return false
}

/**
 * Obtient un message d'erreur convivial pour les erreurs de connexion
 */
export function getDatabaseErrorMessage(error: unknown): string {
  if (isDatabaseConnectionError(error)) {
    return "Erreur de connexion à la base de données. Veuillez réessayer plus tard."
  }
  
  if (error instanceof Error) {
    return error.message
  }
  
  return "Une erreur est survenue"
}


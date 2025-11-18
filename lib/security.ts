/**
 * Utilitaires de sécurité pour les formulaires publics
 */

import crypto from 'crypto'

/**
 * Génère un token sécurisé pour les formulaires publics
 */
export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Valide un token de formulaire
 */
export function validateToken(token: string): boolean {
  // Vérifier que le token a la bonne longueur (64 caractères hex)
  return /^[a-f0-9]{64}$/i.test(token)
}

/**
 * Extrait l'adresse IP de la requête
 */
export function getClientIP(request: Request): string {
  // Essayer différents headers pour obtenir l'IP réelle
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip') // Cloudflare

  if (cfConnectingIP) return cfConnectingIP.split(',')[0].trim()
  if (realIP) return realIP.split(',')[0].trim()
  if (forwarded) return forwarded.split(',')[0].trim()
  
  return 'unknown'
}

/**
 * Valide un email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Valide un numéro de téléphone (format basique)
 */
export function isValidPhone(phone: string): boolean {
  // Supprimer les espaces, tirets, parenthèses
  const cleaned = phone.replace(/[\s\-\(\)]/g, '')
  // Vérifier qu'il contient au moins 10 chiffres
  return /^\+?[0-9]{10,15}$/.test(cleaned)
}

/**
 * Nettoie et normalise une chaîne de caractères
 */
export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, '')
}

/**
 * Détecte si un user agent semble être un bot
 */
export function isBotUserAgent(userAgent: string | null): boolean {
  if (!userAgent) return false
  
  const botPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
    /java/i,
    /go-http/i,
  ]
  
  return botPatterns.some(pattern => pattern.test(userAgent))
}

/**
 * Rate limiting simple basé sur l'IP
 * Note: Pour la production, utilisez Redis ou un service dédié
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(
  ip: string,
  maxRequests: number = 10,
  windowMs: number = 60000 // 1 minute par défaut
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const key = ip

  const record = rateLimitMap.get(key)

  if (!record || now > record.resetAt) {
    // Nouvelle fenêtre
    rateLimitMap.set(key, {
      count: 1,
      resetAt: now + windowMs,
    })
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetAt: now + windowMs,
    }
  }

  if (record.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: record.resetAt,
    }
  }

  record.count++
  rateLimitMap.set(key, record)

  return {
    allowed: true,
    remaining: maxRequests - record.count,
    resetAt: record.resetAt,
  }
}

/**
 * Nettoie les anciennes entrées du rate limit (pour éviter les fuites mémoire)
 */
export function cleanupRateLimit(): void {
  const now = Date.now()
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetAt) {
      rateLimitMap.delete(key)
    }
  }
}

// Nettoyer toutes les 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimit, 5 * 60 * 1000)
}


import type { Metadata } from 'next'
import { Poppins, JetBrains_Mono, Playfair_Display, Montserrat, Roboto, Lato, Dancing_Script } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  fallback: ['monospace', 'Courier New'],
  adjustFontFallback: true,
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
  fallback: ['Georgia', 'serif'],
  adjustFontFallback: true,
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ['300', '400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
});

const lato = Lato({
  subsets: ["latin"],
  weight: ['300', '400', '700'],
  variable: '--font-lato',
  display: 'swap',
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dancing',
  display: 'swap',
  fallback: ['cursive', 'serif'],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: 'EventMaster - Gestion d\'événements avec QR Codes',
  description: 'Plateforme complète de génération de QR codes et gestion d\'événements professionnels',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className={`${poppins.className} ${jetbrainsMono.variable} ${playfair.variable} ${montserrat.variable} ${roboto.variable} ${lato.variable} ${dancingScript.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster />
          <Analytics />
        </Providers>
      </body>
    </html>
  )
}

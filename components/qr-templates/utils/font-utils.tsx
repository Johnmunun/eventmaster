"use client"

import { GlobalConfig } from "@/lib/stores/qr-template-store"

export function getFontFamily(typography: GlobalConfig['typography']): string {
  const fontMap: Record<GlobalConfig['typography'], string> = {
    sans: 'var(--font-poppins), Poppins, system-ui, -apple-system, sans-serif',
    serif: 'Georgia, "Times New Roman", serif',
    mono: 'var(--font-jetbrains-mono), JetBrains Mono, "Courier New", monospace',
    times: '"Times New Roman", Times, serif',
    playfair: 'var(--font-playfair), "Playfair Display", Georgia, serif',
    montserrat: 'var(--font-montserrat), "Montserrat", sans-serif',
    roboto: 'var(--font-roboto), "Roboto", sans-serif',
    lato: 'var(--font-lato), "Lato", sans-serif',
    cursive: 'var(--font-dancing), "Dancing Script", cursive',
  }
  return fontMap[typography] || fontMap.sans
}

export function getFontWeight(fontWeight: GlobalConfig['fontWeight']): string {
  const weightMap: Record<GlobalConfig['fontWeight'], string> = {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  }
  return weightMap[fontWeight] || '400'
}

export function getTypographyStyle(config: GlobalConfig): React.CSSProperties {
  return {
    fontFamily: getFontFamily(config.typography),
    fontWeight: getFontWeight(config.fontWeight),
  }
}


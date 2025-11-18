'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner, ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: 'border-2 border-primary/30 shadow-lg',
          success: 'border-green-500/30 bg-green-50 dark:bg-green-900/20',
          error: 'border-red-500/30 bg-red-50 dark:bg-red-900/20',
          warning: 'border-yellow-500/30 bg-yellow-50 dark:bg-yellow-900/20',
          info: 'border-blue-500/30 bg-blue-50 dark:bg-blue-900/20',
        },
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }

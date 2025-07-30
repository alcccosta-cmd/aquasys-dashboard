"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
// A linha problemática foi removida. O tipo agora é importado diretamente abaixo.

// A MUDANÇA É AQUI: Importamos o tipo 'ThemeProviderProps' diretamente de 'next-themes'
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
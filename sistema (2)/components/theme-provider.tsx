"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

/**
 * Envuelve la app con next-themes y permite
 * cambiar entre los esquemas light, dark y system.
 *
 * Se exporta:
 *  • default  ➜  ThemeProvider
 *  • named    ➜  ThemeProvider
 */
function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider attribute="class" enableSystem disableTransitionOnChange={false} {...props}>
      {children}
    </NextThemesProvider>
  )
}

export { ThemeProvider } // exportación con nombre
export default ThemeProvider // exportación por defecto

"use client"
 
import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
 
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

// This is not a reliable way to get the context.
// We will get it from the useTheme hook provided by the library instead.
// export const ThemeProviderContext = (NextThemesProvider as any).Context;

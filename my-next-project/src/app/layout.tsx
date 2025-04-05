import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Nature Time - Experience Time Like a Forest",
  description:
    "A mobile + wearable system that forces you to experience time like a forest — slow, seasonal, non-linear.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if window is defined (i.e., client-side rendering)
  const isClient = typeof window !== "undefined"

  // Render children normally on the server, only enable client-side logic when we know we're on the client
  return (
    <html lang="en">
      <body className={inter.className}>
        {isClient ? (
          <ThemeProvider attribute="class" defaultTheme="light">
            {children}
          </ThemeProvider>
        ) : (
          // If not client, render children without theme provider to avoid hydration error
          children
        )}
      </body>
    </html>
  )
}

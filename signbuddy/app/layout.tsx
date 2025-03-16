import type React from "react"
import "@/app/globals.css"
import ThemeProvider from "@/components/theme-provider"

export const metadata = {
  title: "SignLearn - Learn Sign Language Interactively",
  description: "Master sign language through real-time feedback and interactive lessons.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <div className="relative flex min-h-screen flex-col">
            <div className="flex-1">
              {children}
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}


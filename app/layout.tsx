import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { nunito_sans } from '@/lib/fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'Rejume',
  description: '',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${nunito_sans.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

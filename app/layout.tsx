import { ThemeProvider } from 'next-themes'
import { nunito_sans } from '@/lib/fonts'
import { AppStoreProvider } from '@/providers/app'
import './globals.css'

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
          <AppStoreProvider>{children}</AppStoreProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

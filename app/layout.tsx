import { Github } from 'lucide-react'
import { Nunito_Sans } from 'next/font/google'
import Link from 'next/link'
import { ThemeProvider } from 'next-themes'
import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import { AppStoreProvider } from '@/providers/app'
import './globals.css'

const nunito_sans = Nunito_Sans({
  variable: '--font-nunito-sans',
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${nunito_sans.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <AppStoreProvider>
            <main className="h-svh flex flex-col bg-primary-foreground">
              <Header />
              <div className="flex-1 grow-1 overflow-hidden p-4 pt-2">
                {children}
              </div>
            </main>
          </AppStoreProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

function Header() {
  return (
    <div className="flex items-center justify-between py-1 px-4">
      <Link href="/" className="text-2xl font-extrabold font-nunito-sans">
        Rejume
      </Link>
      <div className="flex items-center">
        <Button
          className="cursor-pointer"
          variant="ghost"
          size="icon"
          title="GitHub"
          asChild
        >
          <a href="https://github.com/fenghan34/rejume" target="_blank">
            <Github />
          </a>
        </Button>
        <ModeToggle />
      </div>
    </div>
  )
}

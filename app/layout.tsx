import { Github } from 'lucide-react'
import { Nunito_Sans } from 'next/font/google'
import Link from 'next/link'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import { ModeToggle } from '@/components/mode-toggle'
import { Toolbar } from '@/components/toolbar'
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
            <div className="flex flex-col h-screen">
              <Header />
              <main className="flex-1 overflow-hidden">{children}</main>
            </div>
            <Toaster position="top-center" />
          </AppStoreProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

function Header() {
  return (
    <header className="flex items-center justify-between px-6 h-14">
      <Link href="/" className="font-extrabold font-nunito-sans">
        Rejume
      </Link>
      <div className="flex items-center gap-1">
        <Toolbar />
        <Button
          className="cursor-pointer size-8"
          variant="ghost"
          title="GitHub"
          asChild
        >
          <a href="https://github.com/fenghan34/rejume" target="_blank">
            <Github />
          </a>
        </Button>
        <ModeToggle />
      </div>
    </header>
  )
}

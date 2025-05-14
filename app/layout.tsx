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
      <body
        className={`${nunito_sans.variable} antialiased bg-primary-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <AppStoreProvider>
            <Header />
            <main>{children}</main>
          </AppStoreProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

function Header() {
  return (
    <div className="sticky top-0 h-12 z-10 flex items-center justify-between px-4 bg-primary-foreground">
      <Link href="/" className="text-xl font-extrabold font-nunito-sans">
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

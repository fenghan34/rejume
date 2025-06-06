import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import { Header } from '@/components/header'
import { TooltipProvider } from '@/components/ui/tooltip'
import { notoSans, notoSansSC, nunitoSans } from '@/lib/fonts'
import { AppStoreProvider } from '@/providers/app'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Rejume</title>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${nunitoSans.variable} ${notoSans.variable} ${notoSansSC.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <TooltipProvider>
            <AppStoreProvider>
              <div className="flex flex-col h-screen">
                <Header />
                <main className="flex-1 overflow-hidden">{children}</main>
              </div>
            </AppStoreProvider>
          </TooltipProvider>

          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  )
}

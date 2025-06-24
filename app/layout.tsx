import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import { notoSans, notoSansSC, nunitoSans } from '@/lib/fonts'
import { ReactQueryProvider } from '@/providers/react-query-provider'
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
          <ReactQueryProvider>{children}</ReactQueryProvider>
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  )
}

import type { Metadata } from "next";
import { Nunito_Sans, Fira_Code } from "next/font/google";
import { ThemeProvider } from 'next-themes'
import "./globals.css";

const firaCode = Fira_Code({
  variable: '--font-fira-code',
  subsets: ['latin']
})

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: "Rejume",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${nunitoSans.variable} ${firaCode.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

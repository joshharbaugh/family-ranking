import '@/app/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/app/providers/auth'
import { AppContent } from '@/app/ui/content'
// import { WebVitals } from "@/app/_components/web-vitals";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '700', '900'],
})

export const metadata: Metadata = {
  title: 'FamRank',
  description: "Your family's entertainment story",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        {/* <WebVitals /> */}
        <AuthProvider>
          <AppContent>{children}</AppContent>
        </AuthProvider>
      </body>
    </html>
  )
}
